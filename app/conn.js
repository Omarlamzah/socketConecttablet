const express = require("express")
const app= express()
const fs =require("fs")

const options={
    key:fs.readFileSync("./ssl/key.pem"),
    cert:fs.readFileSync("./ssl/cert.pem")
} 

const server =require("https").createServer(options,app)
const io = require("socket.io")(server)
var port = process.env.port || 2020
const listen=  server.listen(2020,function(){console.log("on port "+port)})
const path =require("path")



app.use(express.json());       
app.use(express.urlencoded({extended: true})); 
app.use(express.static("public"))
app.use(express.static("node_modules"))
module.exports={app,server,io,listen,path}

