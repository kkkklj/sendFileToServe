const fs = require('fs');

const utils = {
  delDirs: function (path) {
    let files = [];
    if(fs.existsSync(path)){
        files = fs.readdirSync(path);
        files.forEach((file, index) => {
            let curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()){
                delDirs(curPath); //递归删除文件夹
                
            } else {
                fs.unlinkSync(curPath); //删除文件
            }
        });
        // fs.rmdirSync(path);
    }
  }
}
module.exports = utils;