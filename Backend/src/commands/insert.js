var sql = require("mssql");
const { ListSubFoldersImages } = require("../helpers/pathHelper");
const SettingsConfig = require("../config.json");
const ConvertToBinary = require("../utils/convert");
const { getConfig } = require("../utils/config");
const {
  editDynamicPathObjectStatus,
  PathObject,
} = require("../helpers/objectHelper");
const { AddLog } = require("../logging/log");
const {
  AlreadyInsertedImageToDatabaseCheck,
  FileTableStatusAfterCheck,
} = require("../helpers/checks/databaseChecks");
const { InsertedCheck } = require("../helpers/checks/folderChecks");
const { TransportImagesToInserted } = require("./fileControls");
const { UpdateToDatabase } = require("./update");

function InsertToDatabase() {
  /// Folderların içerisindeki resimlerin listesini alır
  var InsertToDatabaseToInsert = ListSubFoldersImages();

  /// Connection u açar ve bağlantının başarılı olup olmadığını kontrol eder
  var connection = sql.connect(getConfig(), function (err) {
    if (err) {
      AddLog(err);
      /// Bağlantı başarısızsa fonksiyondan çıkar hata mesajı basar.
      return;
    }

    /// Bağlantı başarılıysa LoopInsert methoduna girip ekleme işlemini döngü ile gerçekleştirmeye başlar
    for (let i = 0; i < InsertToDatabaseToInsert.length; i++) {
      LoopInsert(InsertToDatabaseToInsert, i, connection);
    }
    //UpdateProcedure();
  });

  return false;
}

function UpdateProcedure() {
  for (let i = 0; i < PathObject.length; i++) {
    if (PathObject[i].UpdateStatus === true) {
      ExecProcedure(PathObject[i].Procedure);
      editDynamicPathObjectStatus(PathObject[i].FileTable, false);
    }
  }
}

function LoopInsert(InsertToDatabaseToInsert, i, connection) {
  // Eklenecek resimin FileTable'da olup olmadığını check eder yoksa ekler varsa loga hata yazar
  AlreadyInsertedImageToDatabaseCheck(
    InsertToDatabaseToInsert[i].FileTable,
    InsertToDatabaseToInsert[i].fileName
  ).then((check) => {
    if (check) {
      /// Eklenecek FileTable'ın status değerini kontrol eder - True ise eklenir False ise fonksiyona girmez.
      if (FileTableStatusAfterCheck(InsertToDatabaseToInsert[i].FileTable)) {
        /// Eklenecek olan image aktarılanlar folderında varsa eklenme işlemi olmuyor ve aktarılamayanlar klasörüne gönderiliyor
        if (!InsertedCheck(InsertToDatabaseToInsert[i].pathName)) {
          var ps = new sql.PreparedStatement(connection); /// conn açılıyor
          let ConvertedImage = ConvertToBinary(InsertToDatabaseToInsert[i].src); /// eklenecek olan image'in seçilme ve çevirme işlemi
          ps.input("ImageBinary", sql.VarBinary); /// binary değer kaydediliyor
          ps.prepare(
            /// sql query
            `INSERT INTO ${InsertToDatabaseToInsert[i].FileTable} VALUES ('${InsertToDatabaseToInsert[i].fileName}','${InsertToDatabaseToInsert[i].extension}',@ImageBinary)`,
            // check err
            function (err, recordset) {
              ps.execute(
                { ImageBinary: ConvertedImage },
                function (err, records) {
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
                      `INSERTED ${InsertToDatabaseToInsert[i].fileName} for '${InsertToDatabaseToInsert[i].FileTable}' SUCCESSFULLY!`
                    );
                    /// Eklenme başarılıysa aktarılanlar klasörüne gönderiliyor
                    TransportImagesToInserted(
                      InsertToDatabaseToInsert[i].src,
                      SettingsConfig.DirectoryPaths
                        .DirectoryInsertedFolderPath +
                        "\\" +
                        InsertToDatabaseToInsert[i].pathName,
                      InsertToDatabaseToInsert[i].pathName,
                      "INSERTED",
                      false, /// true copy paste / false cut paste
                      InsertToDatabaseToInsert[i].overWrite
                    );
                  });
                }
              );
            }
          );
        } else if (InsertedCheck(InsertToDatabaseToInsert[i].pathName)) {
          /// Aktarılamayanlar klasörüne gönderme işlemi // move silme tutma if buraya
          TransportImagesToInserted(
            InsertToDatabaseToInsert[i].src,
            SettingsConfig.DirectoryPaths.DirectoryNotInsertedFolderPath +
              "\\" +
              InsertToDatabaseToInsert[i].pathName,
            InsertToDatabaseToInsert[i].pathName,
            "NOT INSERTED",
            false,
            InsertToDatabaseToInsert[i].overWrite
          );
        }
      } else if (
        !FileTableStatusAfterCheck(InsertToDatabaseToInsert[i].FileTable)
      ) {
        /// Eklenme işlemi başarısızsa console error
        AddLog(
          `ERROR! ${InsertToDatabaseToInsert[i].FileTable} status off or not exist.`
        );
        TransportImagesToInserted(
          InsertToDatabaseToInsert[i].src,
          SettingsConfig.DirectoryPaths.DirectoryNotInsertedFolderPath +
            "\\" +
            InsertToDatabaseToInsert[i].pathName,
          InsertToDatabaseToInsert[i].pathName,
          "NOT INSERTED",
          false,
          InsertToDatabaseToInsert[i].overWrite
        );
      }
    } else if (!check) {
      if (InsertToDatabaseToInsert[i].overWrite) {
        UpdateToDatabase(InsertToDatabaseToInsert,i,connection)
      } else {
        AddLog(
          `Error! ${InsertToDatabaseToInsert[i].fileName} already inserted to ${InsertToDatabaseToInsert[i].FileTable}`
        );
        TransportImagesToInserted(
          InsertToDatabaseToInsert[i].src,
          SettingsConfig.DirectoryPaths.DirectoryNotInsertedFolderPath +
            "\\" +
            InsertToDatabaseToInsert[i].pathName,
          InsertToDatabaseToInsert[i].pathName,
          "NOT INSERTED",
          false,
          InsertToDatabaseToInsert[i].overWrite
        );
      }
    }
  });
}

async function ExecProcedure(ProcedureName) {
  const pool = new sql.ConnectionPool(getConfig());

  try {
    await pool.connect();
    const request = pool.request();
    let result = await request.query(`EXEC ${ProcedureName}`);
    if (result !== null) {
      if (result.rowsAffected[0] > 0) {
        return result.recordset;
      }
    }
    return null;
  } catch (error) {
    AddLog(error);
  }
}

module.exports = {
  InsertToDatabase,
};
