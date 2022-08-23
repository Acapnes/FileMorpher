const fse = require("fs-extra");
const fs = require("fs");
const path = require("path");
const SettingsConfig = require("../config.json");
const { AddLog } = require("../logging/log");

/// Resimleri aktarma fonksiyonu
const TransportImagesToInserted = (
  src, /// image src
  dest, /// image dest name
  pathName, /// image path
  folderName, /// image folder
  copyormove, /// true copy false cut
  overWrite
) => {
  if (copyormove) {
    fse
      .copy(src, dest, { overwrite: overWrite })
      .then(() => {
        AddLog(`COPIED image ${pathName} to ${folderName} folder`);
      })
      .catch((err) => {
        //AddLog(err);
      });
  } else {
    fse
      .move(src, dest, { overwrite: overWrite })
      .then(() => {
        AddLog(`TRANSFERED image ${pathName} to ${folderName} folder`);
      })
      .catch((err) => {
        //AddLog(err);
      });
  }
};

/// Aktarılanlar klasöründeki resimleri siler
const RemoveInsertedImages = () => {
  try {
    var ReadDirImages = fs.readdirSync(
      SettingsConfig.DirectoryPaths.DirectoryInsertedFolderPath
    );
    ReadDirImages.forEach((file) => {
      if (
        path.extname(file) == ".png" ||
        path.extname(file) == ".jpg" ||
        path.extname(file) == ".JPG" ||
        path.extname(file) == ".PNG" ||
        path.extname(file) == ".pdf" ||
        path.extname(file) == ".svg"
      ) {
        fse.remove(
          SettingsConfig.DirectoryPaths.DirectoryInsertedFolderPath +
            `\\${file}`
        );
      }
    });
    return true;
  } catch (err) {
    AddLog(err);
    return false;
  }
};

module.exports = {
  TransportImagesToInserted,
  RemoveInsertedImages,
};
