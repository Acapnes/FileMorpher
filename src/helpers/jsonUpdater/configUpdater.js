const fs = require("fs");
const SettingsConfig = require("../../config.json");
const { ConnVeriablesCheck } = require("../checks/databaseChecks");
const { AddLog } = require("../../logging/log");

/// Config.json SQLConnectionsettings update etme fonksiyonu
async function ConfigConnectionUpdater(ConnString, Database, Userid, Password) {
  const result = await ConnVeriablesCheck(
    ConnString,
    Database,
    Userid,
    Password
  )
    .then((e) => {
      if (e) {
        let json = fs.readFileSync(
          SettingsConfig.DirectoryPaths.ConfigPath,
          "utf-8"
        );

        let logs = JSON.parse(json);

        logs.SQLConnection.ConnString = ConnString;
        logs.SQLConnection.Database = Database;
        logs.SQLConnection.Userid = Userid;
        logs.SQLConnection.Password = Password;

        json = JSON.stringify(logs);

        fs.writeFileSync(
          SettingsConfig.DirectoryPaths.ConfigPath,
          json,
          "utf-8"
        );

        return true;
      } else {
        AddLog(`Kullanıcı oturumu açma '${Userid}' başarısız.`);
        return false;
      }
    })
    .catch((err) => {
      AddLog("Config Connection updating error! " + err);
      return err;
    });
  return result;
}

/// Config.json içerisindeki pathleri (Aktarılanlar klasörünün pathi gibi) update etme fonksiyonu
function ConfigPathsUpdater(
  dirname,
  MainFolderPath,
  InsertedFolderPath,
  NotInsertedFolderPath,
  ConfigPath,
  PathsPath
) {
  try {
    let json = fs.readFileSync(dirname, "utf-8");

    let logs = JSON.parse(json);

    logs.DirectoryPaths.DirectoryMainFolderPath = MainFolderPath;
    logs.DirectoryPaths.DirectoryInsertedFolderPath = InsertedFolderPath;
    logs.DirectoryPaths.DirectoryNotInsertedFolderPath = NotInsertedFolderPath;
    logs.DirectoryPaths.ConfigPath = ConfigPath;
    logs.DirectoryPaths.PathsPath = PathsPath;

    json = JSON.stringify(logs);
    fs.writeFileSync(dirname, json, "utf-8");

    return true;
  } catch (err) {
    AddLog("Config path updating error! " + err);
    return false;
  }
}

function ConfigExtensionsUpdater(Index, State) {
  try {
    let json = fs.readFileSync(
      SettingsConfig.DirectoryPaths.ConfigPath,
      "utf-8"
    );

    let logs = JSON.parse(json);

    logs.ApplicationSettings.AllowedExtensions[Index].allow = State;

    json = JSON.stringify(logs);
    fs.writeFileSync(SettingsConfig.DirectoryPaths.ConfigPath, json, "utf-8");

    return true;
  } catch (err) {
    AddLog("Config path updating error! " + err);
    return false;
  }
}

function ConfigMaxFileSizesUpdater(FileSize) {
  try {
    let json = fs.readFileSync(
      SettingsConfig.DirectoryPaths.ConfigPath,
      "utf-8"
    );

    let logs = JSON.parse(json);

    logs.ApplicationSettings.MaxFileSize = FileSize;

    json = JSON.stringify(logs);
    fs.writeFileSync(SettingsConfig.DirectoryPaths.ConfigPath, json, "utf-8");

    return true;
  } catch (err) {
    AddLog("Config path updating error! " + err);
    return false;
  }
}

module.exports = {
  ConfigConnectionUpdater,
  ConfigPathsUpdater,
  ConfigExtensionsUpdater,
  ConfigMaxFileSizesUpdater,
};
