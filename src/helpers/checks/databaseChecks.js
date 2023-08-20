var sql = require("mssql");
const SettingsConfig = require("../../config.json");
const { getConfig, setConfig } = require("../../utils/config");
const Paths = require("../../path.json");
const { AddLog } = require("../../logging/log");

function FileTableStatusAfterCheck(FileTable) {
  const TablePaths = Paths.TablePaths;
  for (let i = 0; i < TablePaths.length; i++) {
    if (TablePaths[i].FileTable === FileTable) {
      if (TablePaths[i].Status) return true;
    }
  }
  return false;
}

async function ConnVeriablesCheck(ConnString, Database, Userid, Password) {
  const pool = new sql.ConnectionPool(
    setConfig(ConnString, Database, Userid, Password)
  );
  try {
    await pool.connect();
    return true;
  } catch (error) {
    AddLog(error);
    return false;
  }
}

async function FileTableStatusCheck(FileTable) {
  const pool = new sql.ConnectionPool(getConfig());

  try {
    await pool.connect();
    const request = pool.request();
    let result = await request.query(
      `USE ${SettingsConfig.SQLConnection.Database} SELECT * FROM sys.Tables WHERE name = '${FileTable}'`
    );
    if (result !== null) {
      if (result.rowsAffected[0] > 0) {
        return result.recordset;
      }
    }
    return null;
  } catch (error) {
    AddLog(error);
  }
}

async function AlreadyInsertedImageToDatabaseCheck(FileTable, ImageName) {
  const pool = new sql.ConnectionPool(getConfig());

  try {
    await pool.connect();
    const request = pool.request();
    let result = await request.query(
      `SELECT * FROM ${FileTable} WHERE Name = '${ImageName}'`
    );
    if (result !== null) {
      if (result.rowsAffected[0] > 0) {
        return false;
      }
    }
    return true;
  } catch (error) {
    AddLog(error)
    return false
  }
}

module.exports = {
  ConnVeriablesCheck,
  FileTableStatusCheck,
  FileTableStatusAfterCheck,
  AlreadyInsertedImageToDatabaseCheck,
};
