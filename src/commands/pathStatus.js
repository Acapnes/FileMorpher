const Paths = require("../path.json");
const { AddLog } = require("../logging/log");
const { FileTableStatusCheck } = require("../helpers/checks/databaseChecks");
const { FolderCheck } = require("../helpers/checks/folderChecks");
const { PathsStatusUpdater } = require("../helpers/jsonUpdater/pathUpdater");

const PathsStatus = () => {
  Paths.TablePaths.forEach((path, index) => {
    FileTableStatusCheck(path.FileTable)
      .then((result) => {
        if (
          result !== null &&
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
