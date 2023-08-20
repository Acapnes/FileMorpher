var express = require("express");
var app = express();
const SettingsConfig = require("./config.json");
const Paths = require("./path.json");
var cors = require("cors");
const path = require("path");
const {
  createDynamicPathObject,
  PathObject,
} = require("./helpers/objectHelper");
const { ClearLogs, AddToBlackList } = require("./logging/log");
const {
  ConfigConnectionUpdater,
  ConfigPathsUpdater,
  ConfigExtensionsUpdater,
  ConfigMaxFileSizesUpdater,
} = require("./helpers/jsonUpdater/configUpdater");
const { PathsUpdater, PathAdd } = require("./helpers/jsonUpdater/pathUpdater");
const { InsertToDatabase } = require("./commands/insert");
const { PathsStatus } = require("./commands/pathStatus");
const { ListSubFoldersImages } = require("./helpers/pathHelper");
const { RemoveInsertedImages } = require("./commands/fileControls");

createDynamicPathObject();

var intervalStatus = false;
if (intervalStatus === false) {
  intervalStatus = InsertToDatabase !== true ? true : false;
  setInterval(intervalStatus === true ? InsertToDatabase : null, 3000);
}

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../assets")));
app.use(express.static(path.join(__dirname, "../css")));
app.use(express.static(path.join(__dirname, "../js")));
app.use(express.static(path.join(__dirname, "../icons")));
app.use(express.static(path.join(__dirname, "../logs")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.get("/", (req, res) => {
  res.render(__dirname + "/views/index", {
    SettingsConfig,
    Paths,
  });
});

/// BACKEND ENDPOINTS

app.get("/paths", (req, res) => {
  res.send(Paths.TablePaths);
});

app.get("/settingsConfig/extensions", (req, res) => {
  res.send(SettingsConfig.ApplicationSettings.AllowedExtensions);
});

app.get("/settingsConfig/maxfilesize", (req, res) => {
  res.send(SettingsConfig.ApplicationSettings.MaxFileSize);
});

app.post("/settingsconfig/update", (req, res) => {
  const { ConnString, Database, Userid, Password } = req.body;
  if (ConnString && Database && Userid && Password) {
    if (Object.keys(req.body).length > 4)
      res.status(500).send("Too many inputs");
    ConfigConnectionUpdater(ConnString, Database, Userid, Password)
      .then((status) => {
        if (status) res.status(200).send("Updated Successfully");
        res.status(404).send(`Signin Error.`);
      })
      .catch(() => {
        res.status(404).send("Something went wrong please try again");
      });
  } else {
    res.status(500).send("Please fill required fields");
  }
});

app.post("/settingsconfig/paths/update", (req, res) => {
  const {
    MainFolderPath,
    InsertedFolderPath,
    NotInsertedFolderPath,
    ConfigPath,
    PathsPath,
  } = req.body;
  if (
    MainFolderPath &&
    InsertedFolderPath &&
    NotInsertedFolderPath &&
    ConfigPath &&
    PathsPath
  ) {
    res.send(
      ConfigPathsUpdater(
        __dirname + "\\config.json",
        MainFolderPath,
        InsertedFolderPath,
        NotInsertedFolderPath,
        ConfigPath,
        PathsPath
      )
    );
  }
});

app.post("/settingsconfig/extensions/update", (req, res) => {
  const { Index, State } = req.body;
  if (Index) {
    res.send(ConfigExtensionsUpdater(Index, State));
  }
});

app.post("/settingsconfig/maxfilesize/update", (req, res) => {
  const { MaxFileSize } = req.body;
  if (MaxFileSize) {
    res.send(ConfigMaxFileSizesUpdater(MaxFileSize));
  }
});

app.post("/paths/update", (req, res) => {
  const {
    FileTable,
    FolderName,
    Status,
    Index,
    SelectedDate,
    CopyOrCut,
    OverWrite,
    Procedure,
  } = req.body;
  res.send(
    PathsUpdater(
      FileTable,
      FolderName,
      Status,
      SelectedDate,
      CopyOrCut,
      OverWrite,
      Procedure,
      Index
    )
  );
});

app.post("/paths/insert", (req, res) => {
  const { FileTable, FolderName } = req.body;
  if (FileTable && FolderName) {
    if (PathAdd(FileTable, FolderName))
      res.status(200).send("Inserted Successfully");
    else res.status(404).send("Something went wrong.");
  }
});

app.post("/inserted/delete", (req, res) => {
  if (RemoveInsertedImages()) res.status(200).send("Successfull");
  res.status(404).send("Something went wrong.");
});

app.post("/log/clear", (req, res) => {
  if (ClearLogs()) res.status(200).send("Successfull");
  res.status(404).send("Something went wrong.");
});

app.listen(1575, function () {
  console.log(`Server is running.. PORT: 1575`);
});
