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
  var InsertToDatabaseToInsert = ListSubFoldersImages();
  var connection = sql.connect(getConfig(), function (err) {
    if (err) {
      AddLog(err);
      return;
    }

    for (let i = 0; i < InsertToDatabaseToInsert.length; i++) {
      LoopInsert(InsertToDatabaseToInsert, i, connection);
    }
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
  AlreadyInsertedImageToDatabaseCheck(
    InsertToDatabaseToInsert[i].FileTable,
    InsertToDatabaseToInsert[i].fileName
  ).then((check) => {
    if (check) {
      if (FileTableStatusAfterCheck(InsertToDatabaseToInsert[i].FileTable)) {
        if (!InsertedCheck(InsertToDatabaseToInsert[i].pathName)) {
          var ps = new sql.PreparedStatement(connection);
          let ConvertedImage = ConvertToBinary(InsertToDatabaseToInsert[i].src);
          ps.input("ImageBinary", sql.VarBinary);
          ps.prepare(
            `INSERT INTO ${InsertToDatabaseToInsert[i].FileTable} VALUES ('${InsertToDatabaseToInsert[i].fileName}','${InsertToDatabaseToInsert[i].extension}',@ImageBinary)`,
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
                    );
                    AddLog(
                      `INSERTED ${InsertToDatabaseToInsert[i].fileName} for '${InsertToDatabaseToInsert[i].FileTable}' SUCCESSFULLY!`
                    );
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
        UpdateToDatabase(InsertToDatabaseToInsert, i, connection);
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
