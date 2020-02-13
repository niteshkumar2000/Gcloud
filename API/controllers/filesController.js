files = []
fileCopy = []
fileChunk = []
let node_count = 0
let count = 0
let config = require('../../config.json')
const path = 'D:\\MERN\\Node\\cloud-storage\\public\\uploads\\'
const splitFile = require("split-file");
const moveFile = require("move-file");

exports.getFileList = (req,res) => {
    res.status(200).send(files)
}

function addChunk(filename, names) {
    let x = names
     let tempChunk = {};
     tempChunk[filename] = x;  
     fileChunk.push(tempChunk);
     x.forEach(element => {
        createCopy(element);
        let dest_path =
        "./public/node_" +
        (++node_count % config.node_count).toString() +
        "/";
       (async () => {
         await moveFile(element, dest_path + element.slice(41));
        //  console.log("The file has been moved");
       })();
     });
    //  console.log(fileChunk);

}

function createChunk(filename){
     splitFile
       .splitFileBySize(path + filename, config.size_per_slice)
       .then(names => {
           addChunk(filename, names)
       })
       .catch(err => {
         console.log("Error: ", err);
       });

}

function createCopy(filename){
    let val = config.redundancy_count;
    let tempCopy = {};
    tempCopy[filename] = [];
    let copyFileName = filename + "_copy" + (val + 1).toString();
    while (val--) {
        const fs = require("fs");
        fs.copyFile( filename, copyFileName, err => {
          if (err) throw err;
        });
        let dest_path =
            "./public/node_" +
            (++node_count % config.node_count).toString() +
            "/";
        (async () => {
            await moveFile(copyFileName, dest_path + copyFileName.slice(41));
            // console.log("The file has been moved");
        })();
        tempCopy[filename].push(copyFileName.toString());
    }
     fileCopy.push(tempCopy);
    //  console.log(fileCopy);
}

function mergeFile(names, filename){
    // console.log(names)
    splitFile
      .mergeFiles(names, path + filename)
      .then(() => {
        console.log("Done!");
      })
      .catch(err => {
        console.log("Error: ", err);
      });
}

exports.uploadFile = (req, res) => {
        let flag = 0
        files.forEach(element => {
            if(element.file_name == req.file.filename){
                flag = 1
            }
        });
        if(flag == 1){
            res.status(409).send("File already exist");
        }else{
            createChunk(req.file.filename)
            let temp = {
                file_name: req.file.filename,
                id: ++count
            };
            files.push(temp)
            res.json(temp.id)
        }
}


exports.getFile = (req, res) => {
    let name = '', flag = 0
    files.forEach((item) => {
        if(item.id == req.params.id){
            name = item.file_name
            flag = 1
        }
    })
    console.log(name, fileChunk)
    // mergeFile(fileChunk[name],name)
    if(flag == 1){
        res.status(200).sendFile('D:\\MERN\\Node\\cloud-storage\\public\\uploads\\' + name);
    }else{
        res.status(404).send("Content Not found")
    }
}

exports.deleteFile = (req, res) => {
    let name = "",index = 0, flag = 0;
    files.forEach(item => {
    if (item.id == req.params.id) {
        name = item.file_name;
        delete files[index];
        files = files.filter(function(el) {
          return el != null;
        });

        flag = 1
    }
    index++
    });
    if(flag == 1){
        const fs = require("fs")
        fs.unlinkSync("D:\\MERN\\Node\\cloud-storage\\public\\uploads\\" + name);
        res.status(200).send(req.params.id + ' deleted successfully')
    }else{
        res.status(404).send(`Requested object ${req.params.id} is not found`);
    }
}