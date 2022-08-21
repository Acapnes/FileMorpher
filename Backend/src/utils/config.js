const SettingsConfig = require("../config.json")

/// Butun projedeki sql komutlarının kullandıgı config
function getConfig() {
  return {
    server: SettingsConfig.SQLConnection.ConnString,
    database: SettingsConfig.SQLConnection.Database,
    user: SettingsConfig.SQLConnection.Userid,
    password: SettingsConfig.SQLConnection.Password,
    synchronize: true,
    trustServerCertificate: true,
  };
}

function setConfig(ConnString,Database,Userid,Password) {
  return {
    server: ConnString,
    database: Database,
    user: Userid,
    password: Password,
    synchronize: true,
    trustServerCertificate: true,
  };
}

module.exports = {
  getConfig,
  setConfig
};
