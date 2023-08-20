const Paths = require("../path.json");
const { AddLog } = require("../logging/log");
const { FileTableStatusCheck } = require("../helpers/checks/databaseChecks");
const { FolderCheck } = require("../helpers/checks/folderChecks");
const { PathsStatusUpdater } = require("../helpers/jsonUpdater/pathUpdater");

const PathsStatus = () => {
  /// path.jsondaki her bir path için
  Paths.TablePaths.forEach((path, index) => {
    ///  FileTableStatusCheck uygulamasına girer Sql'e request atar tabloların state'i döner
    FileTableStatusCheck(path.FileTable)
      .then((result) => {
        if (
          result !== null &&
          /// folderları da kontrol eder ve sonra dönen değerlere göre path statuslerini update eder.
          FolderCheck(path.FolderName, Paths.TablePaths.length)
        ) {
          PathsStatusUpdater(true, index);
        } else {
          PathsStatusUpdater(false, index);
        }
      })
      .catch((error) => AddLog(error));
  });
};

module.exports = {
  PathsStatus,
};
