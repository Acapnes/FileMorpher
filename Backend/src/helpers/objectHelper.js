const Paths = require("../path.json");

var TablePaths = Paths.TablePaths;
var PathObject = [];

function createDynamicPathObject() {
  for (let i = 0; i < TablePaths.length; i++) {
    PathObject.push({
      FileTable: TablePaths[i].FileTable,
      Procedure: TablePaths[i].Procedure,
      UpdateStatus: false,
    });
  }
  return PathObject;
}

function editDynamicPathObjectStatus(FileTable,UpdateStatus) {
  var FindIndex = PathObject.findIndex(path => path.FileTable === `${FileTable}`)
  PathObject[FindIndex].UpdateStatus = UpdateStatus
  return PathObject
}

module.exports = {
  PathObject,
  createDynamicPathObject,
  editDynamicPathObjectStatus,
};
