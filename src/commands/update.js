var sql = require("mssql");
const SettingsConfig = require('../config.json')
const { getConfig } = require("../utils/config");
const { AddLog } = require("../logging/log");
const ConvertToBinary = require("../utils/convert");
const { editDynamicPathObjectStatus } = require("../helpers/objectHelper");
const { TransportImagesToInserted } = require("./fileControls");

function UpdateToDatabase(InsertToDatabaseToInsert, i, connection) {
  var ps = new sql.PreparedStatement(connection); /// conn açılıyor
  let ConvertedImage = ConvertToBinary(InsertToDatabaseToInsert[i].src); /// Güncellenecek olan image'in seçilme ve çevirme işlemi
  ps.input("ImageBinary", sql.VarBinary); /// binary değer kaydediliyor
  ps.prepare(
    /// sql query
    `UPDATE ${InsertToDatabaseToInsert[i].FileTable} SET ImageBinary = @ImageBinary WHERE name = '${InsertToDatabaseToInsert[i].fileName}'`,
    // check err
    function (err, recordset) {
      ps.execute({ ImageBinary: ConvertedImage }, function (err, records) {
        if (err) {
          AddLog(err);
          return;
        }
        ps.unprepare(function (err) {
          editDynamicPathObjectStatus(
            InsertToDatabaseToInsert[i].FileTable,
            true
          ); /// UPDATE FONKSİYONU İÇİN UPDATE EDİLECEKLERİ EDİTLER
          AddLog(
            `UPDATED ${InsertToDatabaseToInsert[i].fileName} for '${InsertToDatabaseToInsert[i].FileTable}' SUCCESSFULLY!`
          );
          /// UPDATE başarılıysa aktarılanlar klasörüne gönderiliyor
          TransportImagesToInserted(
            InsertToDatabaseToInsert[i].src,
            SettingsConfig.DirectoryPaths.DirectoryInsertedFolderPath +
              "\\" +
              InsertToDatabaseToInsert[i].pathName,
            InsertToDatabaseToInsert[i].pathName,
            "INSERTED",
            false, /// true copy paste / false cut paste
            InsertToDatabaseToInsert[i].overWrite
          );
        });
      });
    }
  );
}

module.exports = {
  UpdateToDatabase,
};

// UPDATE table_name
// SET column1 = value1, column2 = value2, ...
// WHERE condition;
