const fs = require("fs");

/// Resmi binary'e cevirme kodu
function ConvertToBinary(File) {
  let file = fs.readFileSync(File, { encoding: "binary" });
  var buffer = Buffer.from(file, 'binary');
  return buffer
}

module.exports = ConvertToBinary;
