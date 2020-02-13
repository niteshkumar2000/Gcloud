const express = require('express')
const app = express()
const port = 3000
const filesRoutes = require('./API/routes/files') 
let config = require('./config.json')
let fs = require("fs");
const path = "D:\\MERN\\Node\\cloud-storage\\public\\";

let nodeCount = config.node_count

while(nodeCount--){
    fs.mkdir(path + 'node_' + (nodeCount+1).toString(), err => {
      if (err) throw err;
    });
}

app.use('/files', filesRoutes)

app.listen(port, () => console.log(`Cloud app listening on port ${port}!`))