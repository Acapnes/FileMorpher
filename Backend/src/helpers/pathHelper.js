const fs = require("fs");
const fse = require("fs-extra");
const path = require("path");
const Paths = require("../path.json");
const Config = require("../config.json")

//"C:\\Users\\alper.senpacaci.staj\\Desktop\\ImageFileTableTransService"
//const directoryPath = "C:\\Users\\tr\\Desktop\\Deneme";

function SelectMainFolderListSubFolders() {
  const Readdir = fs.readdirSync(Config.DirectoryPaths.DirectoryMainFolderPath, function (err, files) {
    //handling error
    if (err) {
      return console.log("Unable to scan directory: " + err);
    }
  });
  return Readdir;
}

function ListSubFoldersImages() {
  const Folders = ListFileTablesAndFolderNames();
  let ReadDirImages;
  let ImageArray = [];

  for (let i = 0; i < Folders.length; i++) {
    ReadDirImages = fs.readdirSync(
      Config.DirectoryPaths.DirectoryMainFolderPath + `/${Folders[i].FolderName}`,
      []
    );
    ReadDirImages.forEach((file) => {
      if (file.endsWith(".jpg" || ".png")) {
        ImageArray.push({
          FileTable: Folders[i].FileTable,
          fileName: file,
          extension: path.extname(file),
          src: Config.DirectoryPaths.DirectoryMainFolderPath + `\\${Folders[i].FolderName}\\${file}`,
        });
      }
    });
  }
  return ImageArray
}

/// Returns Object Array -FileTable,FolderName-
const ListFileTablesAndFolderNames = () => {
  var Folders = SelectMainFolderListSubFolders();
  var ListedArray = [];
  for (let i = 0; i < Paths.TablePaths.length; i++) {
    for (let j = 0; j < Folders.length; j++) {
      if (Paths.TablePaths[i].FolderName == Folders[j]) {
        ListedArray.push({
          FileTable: Paths.TablePaths[i].FileTable,
          FolderName: Folders[j],
        });
      }
    }
  }
  return ListedArray;
};

module.exports = {
  SelectMainFolderListSubFolders,
  ListFileTablesAndFolderNames,
  ListSubFoldersImages,
};
