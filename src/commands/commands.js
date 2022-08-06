var sql = require("mssql");
const fs = require("fs");
const {
  ListFileTablesAndFolderNames,
  ListSubFoldersImages,
} = require("../helpers/pathHelper");
const ConnectionConfig = require("../config.json");
const Paths = require("../path.json");

// const directoryPath =
//   "C:\\Users\\alper.senpacaci.staj\\Desktop\\ImageFileTableTransService";

var config = {
  server: ConnectionConfig.SQLConnection.ConnStrig,
  database: ConnectionConfig.SQLConnection.Database,
  user: ConnectionConfig.SQLConnection.Userid,
  password: ConnectionConfig.SQLConnection.Password,
  synchronize: true,
  trustServerCertificate: true,
};

const ConnectandList = () => {
  var FoldersAndFileTables = ListFileTablesAndFolderNames();

  sql.connect(config, function (err) {
    if (err) console.log(err);

    // create Request object
    var request = new sql.Request();

    // query to the database and get the records
    for (let i = 0; i < FoldersAndFileTables.length; i++) {
      request.query(
        `select * from ${FoldersAndFileTables[i].FileTable}`,
        function (err, recordset) {
          if (err) console.log(FoldersAndFileTables[i].FileTable + ` DOEST NOT EXIST! (${FoldersAndFileTables[i].FolderName})`);
          // send records as a response
          else {
            console.log(`${FoldersAndFileTables[i].FileTable} :`, recordset);
          }
        }
      );
    }
  });
};

const SelectSystemDatabases = () => {

  sql.connect(config, function (err) {
    if (err) console.log(err);

    // create Request object
    var request = new sql.Request();

    // query to the database and get the records
    request.query(
      "SELECT NAME FROM master.sys.databases",
      function (err, recordset) {
        if (err) console.log(err);
        // send records as a response
        console.log(recordset);
      }
    );
  });
};

const InsertToDatabase = () => {
  var InsertToDatabaseToInsert = ListSubFoldersImages().ImageArray;

  sql.connect(config, function (err) {
    if (err) console.log(err);

    // create Request object
    var request = new sql.Request();

    for (let i = 0; i < InsertToDatabaseToInsert.length; i++) {
      request.query(
        `INSERT INTO ${InsertToDatabaseToInsert[i].FileTable} VALUES ('${InsertToDatabaseToInsert[i].fileName}')`,
        function (err, recordset) {
          if (err) console.log(err);
          console.log(recordset);
        }
      );
    }
  });
};

const RemoveInsertedImages = () => {

};

module.exports = {
  ConnectandList,
  InsertToDatabase,
  SelectSystemDatabases,
};
