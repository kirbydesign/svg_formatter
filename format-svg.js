#!/usr/bin/node
const fs = require("fs");
const path = require("node:path");
var getDirName = require("path").dirname;
const readdirSync = fs.readdirSync;

const propertyToFormatFrom = /fill="\#(.*?)"/g;
const propertyToFormatTo = 'fill="currentColor"';
const logo = `
_______________________________________
│                                      │
│----------Formatting SVG's!-----------│
│                                      │
│   ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣠⣤⣤⣤⣄⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀       │
│   ⠀⣠⡶⠒⠒⠶⣄⣠⡴⠚⠉⠁⠀⠀⠀⠀⠀⠉⠙⠳⢦⡀⠀⠀⠀⠀⠀⠀       │
│   ⢠⡏⠀⠀⠀⠀⠘⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢧⡀⠀⠀⠀⠀       │
│   ⢸⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠋⢱⠀⠀⢠⠉⢡⠀⠀⠀⠀⠀⠻⡄⠀⠀⠀       │
│   ⠀⣧⠀⠀⠀⠀⠀⠀⠀⠀⢸⣧⣾⠄⠀⢸⣦⣾⠀⠀⠀⠀⠀⠀⢻⡄⠀⠀       │
│   ⠀⠘⢧⡀⠀⠀⠀⠀⠀⠀⠈⣿⣿⠀⠀⠸⣿⡿⠀⠀⠀⠀⠀⠀⠈⠳⣄⠀       │
│   ⠀⠀⠀⡇⠀⠀⠀⠀⠀⠀⠀⠈⠁⡴⠶⡆⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠹⡄       │
│   ⠀⠀⠀⢷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⠒⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣷       │
│   ⠀⠀⠀⠸⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⠇       │
│   ⠀⠀⠀⣀⡿⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡽⣿⡛⠁⠀       │
│   ⠀⣠⢾⣭⠀⠈⠳⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡠⠊⠀⢠⣝⣷⡀       │
│   ⢠⡏⠘⠋⠀⠀⠀⠈⠑⠦⣄⣀⠀⠀⠀⠀⠀⣀⡠⠔⠋⠀⠀⠀⠈⠛⠃⢻       │
│   ⠈⠷⣤⣀⣀⣀⣀⣀⣀⣀⣀⣤⡽⠟⠛⠿⣭⣄⣀⣀⣀⣀⣀⣀⣀⣀⣤⠞       │
│   ⠀⠀⠀⠀⠉⠉⠉⠉⠉⠉⠁⠀⠀⠀⠀⠀⠀⠀⠈⠉⠉⠉⠉⠉⠉⠀⠀⠀       │
│                                      │
│______________________________________│
`
console.log(logo);

/**
 * Fetches all the sub directories in the current directories
 */
const getDirectories = (source) =>
  readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

/**
 *
 * @param {*} folder The name of the folder to format files in.
 * @param {*} file The name of the SVG to format
 */
const formatSvg = (folder, file) => {
  const filePath = path.resolve(__dirname, "files", folder, file);

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    parsedSVG = data.replace(propertyToFormatFrom, propertyToFormatTo);
    const outputFilePath = __dirname + "/out" + "/" + folder + "/" + file;

    const cb = (err) => {};
    fs.mkdir(getDirName(outputFilePath), { recursive: true }, function (err) {
      if (err) return cb(err);

      fs.writeFile(outputFilePath, parsedSVG, cb);
    });
  });
};

let directories;
try {
  directories = getDirectories(__dirname + "/files");
} catch (error) {
  console.error(`Folder with the name 'files' is missing.`);
  return;
}

directories.forEach((dir) => {
  const folderpath = path.resolve(__dirname + "/files", dir);
  
  fs.readdir(folderpath, function (err, files) {
    if (err) {
      return console.log("Unable to scan directory: " + err);
    }
        
    const svgFiles = files.filter((file) => path.extname(file) == ".svg");
    console.info(`\nFormatting ${svgFiles.length} files in folder: `, dir);
    
    svgFiles.forEach(function (file) {
      formatSvg(dir, file);
    });
  });  
});
