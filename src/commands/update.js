var sql = require("mssql");
const SettingsConfig = require("../config.json");
const { AddLog } = require("../logging/log");
const ConvertToBinary = require("../utils/convert");
const { editDynamicPathObjectStatus } = require("../helpers/objectHelper");
const { TransportImagesToInserted } = require("./fileControls");

function UpdateToDatabase(InsertToDatabaseToInsert, i, connection) {
  var ps = new sql.PreparedStatement(connection);
  let ConvertedImage = ConvertToBinary(InsertToDatabaseToInsert[i].src);
  ps.input("ImageBinary", sql.VarBinary);
  ps.prepare(
    `UPDATE ${InsertToDatabaseToInsert[i].FileTable} SET ImageBinary = @ImageBinary WHERE name = '${InsertToDatabaseToInsert[i].fileName}'`,
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
          );
          AddLog(
            `UPDATED ${InsertToDatabaseToInsert[i].fileName} for '${InsertToDatabaseToInsert[i].FileTable}' SUCCESSFULLY!`
          );
          TransportImagesToInserted(
            InsertToDatabaseToInsert[i].src,
            SettingsConfig.DirectoryPaths.DirectoryInsertedFolderPath +
              "\\" +
              InsertToDatabaseToInsert[i].pathName,
            InsertToDatabaseToInsert[i].pathName,
            "INSERTED",
            false,
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