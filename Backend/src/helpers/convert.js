const fs = require("fs");
const path = require("path");

function ConvertToBinary() {
  const file = fs.readFileSync("src/assets/cat.jpg");
  const blob = Buffer.from(file).toString('binary');
  

  console.log(blob);
}

ConvertToBinary();

module.exports = ConvertToBinary;
