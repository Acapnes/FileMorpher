var express = require("express");
var app = express();
const {ConnectandList,InsertToDatabase, SelectSystemDatabases} = require("./commands/commands");
const ConsoleLogger = require("./helpers/logging");
const { ListFileTablesAndFolderNames, SelectMainFolderListSubFolders, ListSubFoldersImages } = require("./helpers/pathHelper");

ConnectandList();
//SelectSystemDatabases();
//InsertToDatabase();

app.get("/", function (req, res) {
  res.send("hello");
});

var server = app.listen(5500, function () {
  console.log("Server is running..");
});
