const fs = require("fs");
const SettingsConfig = require("../../config.json");
const { AddLog } = require("../../logging/log");

function PathsUpdater(
  FileTable,
  FolderName,
  Status,
  SelectedDate,
  CopyOrCut,
  OverWrite,
  Procedure,
  Index
) {
  try {
    let json = fs.readFileSync(
      SettingsConfig.DirectoryPaths.PathsPath,
      "utf-8"
    );

    let logs = JSON.parse(json);

    logs.TablePaths[Index].FileTable = FileTable;
    logs.TablePaths[Index].FolderName = FolderName;
    logs.TablePaths[Index].Status = Status;
    logs.TablePaths[Index].SelectedDate = SelectedDate;
    logs.TablePaths[Index].CopyOrCut = CopyOrCut;
    logs.TablePaths[Index].OverWrite = OverWrite;
    logs.TablePaths[Index].Procedure = Procedure;
    json = JSON.stringify(logs);

    fs.writeFileSync(SettingsConfig.DirectoryPaths.PathsPath, json, "utf-8");

    return true;
  } catch (err) {
    AddLog("Path updating error! " + err);
    return false;
  }
}

function PathsStatusUpdater(Status, Index) {
  try {
    let json = fs.readFileSync(
      SettingsConfig.DirectoryPaths.PathsPath,
      "utf-8"
    );

    let logs = JSON.parse(json);

    logs.TablePaths[Index].Status = Status;
    json = JSON.stringify(logs);

    fs.writeFileSync(SettingsConfig.DirectoryPaths.PathsPath, json, "utf-8");

    return true;
  } catch (err) {
    AddLog("Path updating error! " + err);
    return false;
  }
}

function PathAdd(FileTable, FolderName) {
  try {
    let json = fs.readFileSync(
      SettingsConfig.DirectoryPaths.PathsPath,
      "utf-8"
    );

    let logs = JSON.parse(json);

    logs.TablePaths.push({
      FileTable: FileTable,
      FolderName: FolderName,
      Status: false,
      SelectedDate: "2",
      CopyOrCut: false,
      OverWrite: false,
      Procedure: "null",
    });

    json = JSON.stringify(logs);

    fs.writeFileSync(SettingsConfig.DirectoryPaths.PathsPath, json, "utf-8");

    return true;
  } catch (err) {
    AddLog("Path adding error! " + err);
    return false;
  }
}

module.exports = {
  PathsUpdater,
  PathAdd,
  PathsStatusUpdater,
};
