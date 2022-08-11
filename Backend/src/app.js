var express = require("express");
var app = express();
var sql = require("mssql");
const { ConnectandList, InsertToDatabase, SelectSystemDatabases, TransportImagesToInserted, ListTablesNameandStatus, ListTablesNameandStatus2 } = require("./commands/commands");
const ConsoleLogger = require("./helpers/logging");
const { ListFileTablesAndFolderNames, SelectMainFolderListSubFolders, ListSubFoldersImages } = require("./helpers/pathHelper");
const SettingsConfig = require('./config.json');
const Paths = require('./path.json')
const { ConfigUpdater, PathsUpdater } = require("./helpers/jsonUpdater");
var cors = require('cors');

InsertToDatabase();
// PathsUpdater("a", "a", 2)

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
app.use(express.json())


app.get("/", (req, res) => {

  SelectSystemDatabases(function (recordset) {
    res.send(recordset);
  })

})

app.get("/settingsconfig", (req, res) => {

  res.send(SettingsConfig)

})

app.post("/settingsconfig/update", (req, res) => {
  const { ConnString, Database, Userid, Password } = req.body;

  if (ConnString && Database && Userid && Password) {
    if (Object.keys(req.body).length > 4)
      res.status(500).send("Too many inputs")
    if (ConfigUpdater(ConnString, Database, Userid, Password))
      res.status(200).send("Updated Successfully")
    else
      res.status(404).send("Something went wrong please try again")
  } else {
    res.status(500).send("Please fill required fields")
  }
})

app.get("/paths", (req, res) => {

  res.send(Paths.TablePaths)

})

var server = app.listen(1575, function () {
  console.log("Server is running..");
});
