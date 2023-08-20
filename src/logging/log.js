const fs = require("fs");
const SettingsConfig = require("../config.json");

var BlackList = [];

function AddLog(description) {
  if (fs.statSync(SettingsConfig.DirectoryPaths.LogsPath).size <= 100000000) {
    BlackList.push(description);
    if (AddToBlackList(description)) {
      var date = new Date();
      date.toLocaleDateString("tr-TR");
      fs.appendFile(
        SettingsConfig.DirectoryPaths.LogsPath,
        `${date} ${description}\n`,
        function (err) {
          if (err) return console.log(err);
        }
      );
    }
  }
}

function AddToBlackList(description) {
  var LogCount = BlackList.filter((er) => er === description).length;
  if (LogCount <= 1) return true;
  if (LogCount == 10) {
    BlackList = BlackList.filter((er) => er !== description);
    return true;
  }
  return false;
}

function ClearLogs() {
  try {
    fs.writeFile(SettingsConfig.DirectoryPaths.LogsPath, "", function (err) {
      if (err) return console.log(err);
    });
    return true;
  } catch (err) {
    AddLog("AddLog Error!! " + err);
    return false;
  }
}

module.exports = {
  AddLog,
  ClearLogs,
  AddToBlackList,
};
