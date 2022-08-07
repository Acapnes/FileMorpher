var express = require("express");
var app = express();
var sql = require("mssql");
const { ConnectandList, InsertToDatabase, SelectSystemDatabases, TransportImagesToInserted, ListTablesNameandStatus, ListTablesNameandStatus2 } = require("./commands/commands");
const ConsoleLogger = require("./helpers/logging");
const { ListFileTablesAndFolderNames, SelectMainFolderListSubFolders, ListSubFoldersImages } = require("./helpers/pathHelper");
const SettingsConfig = require('./config.json');
const { ConfigUpdater } = require("./helpers/jsonUpdater");
const Paths = require('./path.json')
var cors = require('cors');



InsertToDatabase();

ConfigUpdater("a","a","a","b")

// ListTablesNameandStatus(function (tables) {
//   console.log((tables[0].FileTable.name))
// })

var config = {
  server: SettingsConfig.SQLConnection.ConnString,
  database: SettingsConfig.SQLConnection.Database,
  user: SettingsConfig.SQLConnection.Userid,
  password: SettingsConfig.SQLConnection.Password,
  synchronize: true,
  trustServerCertificate: true,
};

app.use(cors());


app.get("/", (req, res) => {

  SelectSystemDatabases(function (recordset) {
    res.send(recordset);
  })

})

app.get("/settingsconfig", (req, res) => {

  res.send(SettingsConfig)

})

app.post("/settingsconfig/update", (req, res) => {
  // const { ConnString, Database, Userid, Password } = req.body;

  // if (ConnString != "null" && Database != "null" && Userid != "null" && Password != "null") {
  //   ConfigUpdater();

  //   res.send("asd")
  // }
})

var server = app.listen(1575, function () {
  console.log("Server is running..");
});
