var sql = require("mssql");
const fs = require("fs");
const fse = require("fs-extra");
const {
  ListFileTablesAndFolderNames,
  ListSubFoldersImages,
} = require("../helpers/pathHelper");
const SettingsConfig = require("../config.json");
const Paths = require("../path.json");

// const directoryPath =
//   "C:\\Users\\alper.senpacaci.staj\\Desktop\\ImageFileTableTransService";

var config = {
  server: SettingsConfig.SQLConnection.ConnString,
  database: SettingsConfig.SQLConnection.Database,
  user: SettingsConfig.SQLConnection.Userid,
  password: SettingsConfig.SQLConnection.Password,
  synchronize: true,
  trustServerCertificate: true,
};

const ConnectandList = () => {
  var FoldersAndFileTables = ListFileTablesAndFolderNames();

  sql.connect(config, function (err) {
    if (err) console.log(err);

    // create Request object
    var request = new sql.Request();

    for (let i = 0; i < FoldersAndFileTables.length; i++) {
      request.query(
        `select * from ${FoldersAndFileTables[i].FileTable}`,
        function (err, recordset) {
          if (err) console.log(FoldersAndFileTables[i].FileTable + ` DOEST NOT EXIST! (${FoldersAndFileTables[i].FolderName})`);
          // send records as a response
          else {
            console.log(`${FoldersAndFileTables[i].FileTable} :`, recordset.recordset);
          }
        }
      );
    }
  });
};

function SelectSystemDatabases(callback) {
  sql.connect(config, function (err) {
    if (err) {
      console.log(`ERROR! Connection failed to '${SettingsConfig.SQLConnection.ConnString}' Server ${SettingsConfig.SQLConnection.Database}' Database`);
      return false
    }

    var request = new sql.Request();

    request.query(
      "SELECT NAME,STATE FROM master.sys.databases",
      function (err, recordset) {
        if (err) {
          console.log("ERROR! Connection is closed.");
          callback(err)
        }
        else {
          callback(recordset.recordset)
        }
      }
    );
  });
};

const ListTablesNameandStatus = (callback) => {
  sql.connect(config, function (err) {
    if (err) {
      console.log(`ERROR! Connection failed to '${SettingsConfig.SQLConnection.ConnString}' Server ${SettingsConfig.SQLConnection.Database}' Database`);
      return
    }

    var request = new sql.Request();

    for (let i = 0; i < Paths.TablePaths.length; i++) {
      request.query(
        `USE ${SettingsConfig.SQLConnection.Database} SELECT * FROM sys.Tables WHERE name = '${Paths.TablePaths[i].FileTable}'`,
        function (err, recordsetTables) {
          if (err) {
            if (recordsetTables.recordset.length < 1) console.log("Not found table");
            console.log("ERROR! TRY CONNECT TABLE ERROR")
            callback("not found")
          }
          else {
            if (recordsetTables.recordset[0])
              callback([{
                FileTable: recordsetTables.recordset[0],
                Status: true
              }])
          }
        }
      );
    }
  });
};

async function InsertToDatabase() {

  var InsertToDatabaseToInsert = ListSubFoldersImages();

  sql.connect(config, function (err) {
    if (err) {
      console.log(`ERROR! Connection failed to '${SettingsConfig.SQLConnection.ConnString}' Server ${SettingsConfig.SQLConnection.Database}' Database`);
      return
    }

    // create Request object
    var request = new sql.Request();

    for (let i = 0; i < InsertToDatabaseToInsert.length; i++) {
      request.query(
        `INSERT INTO ${InsertToDatabaseToInsert[i].FileTable} VALUES ('${InsertToDatabaseToInsert[i].fileName}')`,
        function (err, recordset) {
          if (err) console.log(`ERROR! ${InsertToDatabaseToInsert[i].fileName} cannot found ${InsertToDatabaseToInsert[i].FileTable} FileTable ` + err);
          else {
            console.log(`Inserted ${InsertToDatabaseToInsert[i].fileName} for ${InsertToDatabaseToInsert[i].FileTable} successfully!`);
            TransportImagesToInserted(InsertToDatabaseToInsert[i].src, SettingsConfig.DirectoryPaths.DirectoryInsertedFolderPath + "\\" + InsertToDatabaseToInsert[i].fileName, InsertToDatabaseToInsert[i].fileName)
          }
        }
      );
    }
  });
};

const TransportImagesToInserted = (src, dest, fileName) => {
  fse.move(src, dest, { overwrite: false })
    .then(() => { console.log(`Moved image ${fileName} to inserted folder successfully!`) })
    .catch((err) => { console.log(`Error! ${dest} is already inserted`) })
};

module.exports = {
  ConnectandList,
  InsertToDatabase,
  SelectSystemDatabases,
  TransportImagesToInserted,
  ListTablesNameandStatus,
};
