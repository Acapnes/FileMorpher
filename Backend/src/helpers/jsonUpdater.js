
const fs = require('fs')
const path = require('path')
const SettingsConfig = require('../config.json')


function ConfigUpdater(ConnString, Database, Userid, Password) {

    try {
        let json = fs.readFileSync(SettingsConfig.DirectoryPaths.ConfigPath, "utf-8");

        let logs = JSON.parse(json);

        logs.SQLConnection.ConnString = ConnString
        logs.SQLConnection.Database = Database
        logs.SQLConnection.Userid = Userid
        logs.SQLConnection.Password = Password

        json = JSON.stringify(logs);

        fs.writeFileSync(SettingsConfig.DirectoryPaths.ConfigPath, json, 'utf-8')

        return "Updated Succesfully"
    }
    catch (err) {
        console.log("Config Update Error!! " + err)
        return "Something went wrong please try again"
    }

}


module.exports = {
    ConfigUpdater
}