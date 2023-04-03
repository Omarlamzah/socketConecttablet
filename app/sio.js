const sio =require("./conn")
var io =sio.io;
var nvisiteur=0;
var totalvisiteur=0;

var useridlist=[]
io.on("connect",function(socket){
  console.log("----------mmmkkkkkkkkkkkkkkkk  mmmmmmmmmm---------")
  console.log("user is connected" + socket)
  //useridlist.push(socket.handshake.headers.cookie)
  console.log(useridlist)
  console.log("---------mmmmmmmmmmmkkkkkmmmmmmmmm----------")
  //nvisiteur=nvisiteur+1
  //if(nvisiteur<0){nvisiteur=0}
  //io.sockets.emit("newvisite",nvisiteur)
   //console.log("connnnnnnnnnnn"+nvisiteur)
 

  socket.on("msginfo",function(minfo){
    io.sockets.emit("newmessage",minfo)
  })

socket.on("deletemesage",function(mesdelet){

  io.sockets.emit("delmsg",mesdelet)
  console.log(mesdelet)
})
//user is hidden
socket.on("userhidden",function(){
  nvisiteur=nvisiteur-1
  useridlist.splice(useridlist.indexOf(socket.handshake.headers.cookie),1)//ussuuuuuuu
  if(nvisiteur<0){nvisiteur=0}
  console.log("hiddennn  "+nvisiteur)
  io.sockets.emit("newvisite",nvisiteur)
  console.log(useridlist)
})
  
//user is hidden

//user is visible
socket.on("visibleuser",function(){
  useridlist.push(socket.handshake.headers.cookie)
  nvisiteur=nvisiteur+1
  if(nvisiteur<0){nvisiteur=0}
  console.log("visibleee "+nvisiteur)
  io.sockets.emit("newvisite",nvisiteur)
console.log(useridlist)
})

//user is visible
  socket.on('disconnect', (sockett) => {
    console.log("diiiiiiiiiiiiiiiiiiiiis")
 useridlist.splice(useridlist.indexOf(socket.handshake.headers.cookie),1)
 console.log(useridlist)
 console.log(nvisiteur)
 console.log("diiiiiiiiiiiiiiiiiiiiis")
 nvisiteur=nvisiteur-1
 if(nvisiteur<0){nvisiteur=0}
 io.sockets.emit("newvisite",nvisiteur)
  console.log("user is gone")
});
})







module.exports={io,useridlist}