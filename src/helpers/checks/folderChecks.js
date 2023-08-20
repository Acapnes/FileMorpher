const {
  SelectMainFolderListSubFolders,
  SelectMainInsertedFolderListImages,
} = require("../pathHelper");

function InsertedCheck(FileName) {
  var InsertedFolder = SelectMainInsertedFolderListImages();
  for (let i = 0; i < InsertedFolder.length; i++) {
    if (InsertedFolder[i] === FileName) return true;
  }
  return false;
}

const FolderCheck = (FolderName, length) => {
  var Folders = SelectMainFolderListSubFolders();
  let index = 0;
  while (index < length) {
    if (Folders[index] == FolderName) {
      return true;
    }
    index++;
  }
};

module.exports = {
  InsertedCheck,
  FolderCheck,
};
