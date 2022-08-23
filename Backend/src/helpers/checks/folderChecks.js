const {
  SelectMainFolderListSubFolders,
  SelectMainInsertedFolderListImages,
} = require("../pathHelper");

/// Eklenecek olan resimin aktarılanlar klasöründe olup olmadığını kontrol eder.
function InsertedCheck(FileName) {
  var InsertedFolder = SelectMainInsertedFolderListImages();
  for (let i = 0; i < InsertedFolder.length; i++) {
    if (InsertedFolder[i] === FileName) return true;
  }
  return false;
}

/// Folderların olup olmadığını, durumunu eder
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
