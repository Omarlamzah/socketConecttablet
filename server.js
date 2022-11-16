const express = require("express")
const app = express()
const server = require("http").createServer(app)
const io = require("socket.io")(server)



app.get("/",(req,res)=>{
  return  res.sendFile(__dirname+ "/views/main.html")
})

app.get("/dash",(req,res)=>{
  return  res.sendFile(__dirname+ "/dashboard.html")
})


app.get("/page1",(req,res)=>{
    return  res.sendFile(__dirname+ "/page1.html")
  })


  app.get("/page2",(req,res)=>{
    return  res.sendFile(__dirname+ "/page2.html")
  })


  app.get("/page3",(req,res)=>{
    return  res.sendFile(__dirname+ "/page3.html")
  })

  app.get("/page4",(req,res)=>{
    return  res.sendFile(__dirname+ "/page4.html")
  })

  app.get("/page5",(req,res)=>{
    return  res.sendFile(__dirname+ "/page5.html")
  })

  app.get("/page6",(req,res)=>{
    return  res.sendFile(__dirname+ "/page6.html")
  })
var taindex=0
io.on("connection",function(socket){
taindex+=1
console.log("tablet "+taindex+" conected")

socket.on("lesnom",dataa=>{
    console.log(dataa)
    io.sockets.emit("datatopage",dataa)

})

socket.on("retateinfo",dataretate=>{ console.log(dataretate)
io.sockets.emit("dataretate",dataretate)
})

socket.on("fontsize",fontsize=>{ console.log(fontsize)
    io.sockets.emit("fontsize",fontsize)
    })

})
server.listen(8080)
