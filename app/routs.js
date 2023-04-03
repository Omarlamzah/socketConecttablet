
const { render } = require("ejs")
const conection=require("./conn")
const cokies=require("cookie-parser")

const {useridlist} =require("./sio")
const app = conection.app
app.use(cokies())

const path =require("path")
const fs = require("fs")
const fileup =require("express-fileupload")
const dbcon = require("./bdconnection")

app.use(fileup())

dbcon.connection.connect(function(er){
     if(er){console.log("eroro connection")}
     else{console.log("good connection")}
})

app.set("view engine","ejs")


app.get("/",function(rq,res){
    
     userislogin(rq,res)
      
})
var iduser=0
var idmeting=0;


var picturnav
var piccontent
getnameimg(path.join(__dirname,"../public/asset/entit/"),0)
getnameimg(path.join(__dirname,"../public/asset/imgcontent/"),1)
function getnameimg(urlimg,ind){
     fs.readdir(urlimg, (err, files) => {
          if (err) {
            console.log(err);
          } else {
            // Get the first file name from the array of file names
            if(ind==0){
                picturnav = files[0];
            }
           else if (ind==1){
               piccontent= files[0];
           }
           

          }
        });
}
app.post("/",function(req,responsepage){

     getnameimg(path.join(__dirname,"../public/asset/entit/"),0)
     getnameimg(path.join(__dirname,"../public/asset/imgcontent/"),1)
     var hours=new Date().toString().split(" ")[4]
     var days=new Date().toString().split(" ")[0]+"/"+new Date().toString().split(" ")[1]+"/"+new Date().toString().split(" ")[2]+"/"+new Date().toString().split(" ")[3]
     startdate=days+" // "+hours
     enddate="NULL"


     dbcon.connection.query("SELECT * FROM metting ORDER BY ID DESC LIMIT 1",function(errmeting,resdatameting,fieldd){

if(resdatameting){
     dbcon.connection.query("INSERT INTO `user` (`id`, `name`, `active`, `admin`, `lasname`, `startdate`, `enddate`,`id_meetingu`) VALUES (NULL, '"+req.body.name+"',  'NULL',  'NULL',  'NULL','"+startdate+" ','"+enddate+"',"+resdatameting[0].id+");" 
     ,function(err,result){
         if(result){
          iduser= result.insertId
          
          idmeting=resdatameting[0].id
          responsepage.cookie("nameuser",req.body.name,{
               expires: new Date(Date.now()+((1000*60)*60*10)),
             })
             responsepage.cookie("iduser",iduser,{
               expires: new Date(Date.now()+((1000*60)*60*10)),
             })
             responsepage.cookie("idmeting",idmeting,{
               expires: new Date(Date.now()+((1000*60)*60*10)),
             })
             dbcon.connection.query("SELECT * FROM metting ORDER BY ID DESC LIMIT 1",function(err,res,field){
               if (err) throw err;
               console.log(res[0]);
                 dbcon.connection.query("SELECT * FROM `messages`",function(errms,resmess,fieldmess){
                    if (errms) throw err;
                    responsepage.render("index",{"name":req.body.name,"iduser":iduser,"meinfo":res[0],"allmessage":resmess,"picturnav":picturnav,"piccontent":piccontent})
               })         
          })
         }
         else{
          responsepage.render("404")
         }
     }

     )  ;
}
else{responsepage-render("404")}

     })

})





//functions laset meeting url viedio and postere images

app.post("/removemessage",function(req,res){
     dbcon.connection.query("DELETE FROM `messages` WHERE id="+req.body.idm,function(erall,resall,fieldmess){
          if (erall) throw erall
          else{
               
               //shoold delete file of ,messages
              // fs.unlink(path.join(__dirname,"../public/asset/msgasset/"+req.body.fname))
            //  fs.unlink(path.join(__dirname,"../public/asset/msgasset/"+req.body.au))
         if(req.body.au!="undefined"){
           fs.unlink(path.join(__dirname,"../public/asset/msgasset/")+req.body.au, function (err) {            
               if (err) {                                                 
                   console.error(err);                                    
               }                                                          
              console.log('audio has been Deleted');                           
           });
         }

         if(req.body.fname!="undefined"){
          fs.unlink(path.join(__dirname,"../public/asset/msgasset/")+req.body.fname, function (err) {            
               if (err) {                                                 
                   console.error(err);                                    
               }                                                          
              console.log('File has been Deleted');                           
           });
         } 

              
                 
          }
     })
   console.log(req.body) 
  // res.redirect("/")
})

    
app.post("/addmessage",function(req,res){
     const fi =req.files
     var fileup=""
     var fileupaudio=""


     console.log("--------------------audi--------------")
     console.log("--------------------audi--------------")
     console.log(fi)
     console.log("--------------------audi------------")

     console.log(req.files)

     if(fi!=null){
            if(fi.films){

            fileup =fi.films
            var fname=fileup.name


            console.log("--------------ok::::::::::::::::")
           console.log(fname)
              console.log("--------------ok::::::::::::::::")
           fileup.mv(path.join(__dirname,"../public/asset/msgasset/")+fname)
           
     }


     if(fi.blob){
          fileupaudio =fi.blob
          const filebuffer=Buffer.from(fi.blob.data,"base64")
          fs.writeFile(path.join(__dirname,"../public/asset/msgasset/")+fileupaudio.name,filebuffer,function(err){
                   if(err){console.log("errrrrrrrrrrrrrrrrrrrrr")}
                   else{console.log("gooooooooooooooooodd")}
          })   
   //fileup.mv(path.join(__dirname,"../public/asset/msgasset/")+fileupaudio.name)
  }
     }
   
     dbcon.connection.query(
          "INSERT INTO `messages` (`id`, `textmsg`, `id_user`, `usname`  , `id_metting`, `datemessage`, `audiourl`, `fileurl`) VALUES (NULL, '"+req.body.txtmessage+"',"+req.cookies.iduser+",'"+req.cookies.nameuser +"', "+req.cookies.idmeting+", '"+Date().split(" ")[4]+"', '"+fileupaudio.name+"', '"+fname+"');"
     ,function(err,result){
          if (err){
                  console.log(res[0]);
                  res.render("404")

          }
       
        

     })

     console.log("--------------mesexxxxxxxxxxxxxx..............")
     console.log(fileup.name+"----------")
     console.log(req.cookies.nameuser)
     console.log("--------------mesexxxxxxxxxxxx..............")
    
     res.redirect("/")
     })
     






//dash






app.get("/505",(req, res)=>{
     res.sendFile(conection.path.join(__dirname,"../views/505.html"))
})





function userislogin(rq,res ,url="lljWW6UEEhI" ,datente){
     getnameimg(path.join(__dirname,"../public/asset/entit/"),0)
     getnameimg(path.join(__dirname,"../public/asset/imgcontent/"),1)
     if(rq.cookies.nameuser==undefined){   
          res.render("login")
         }
         else{

          dbcon.connection.query("SELECT * FROM metting ORDER BY ID DESC LIMIT 1",function(err,resdata,field){
               if (err) throw err;
               dbcon.connection.query("SELECT * FROM `messages` where id_metting="+resdata[0].id,function(errms,resmess,fieldmess){
                    if (errms) throw err;
                  
                    res.render("index",{"name":rq.cookies.nameuser,"iduser":rq.cookies.iduser,"meinfo":resdata[0],"allmessage":resmess,"picturnav":picturnav,"piccontent":piccontent})
               })


               
          })




          console.log(rq.cookies.iduser)
         }
}




app.get("/majalis",(req, res)=>{

     dbcon.connection.query("SELECT * FROM `metting` ORDER BY id desc  LIMIT 4 OFFSET "+req.query.q*4,function(errms,resm,fieldmess){
          if (errms) throw errms;





          dbcon.connection.query("SELECT count(*) FROM `metting`",function(erall,resall,fieldmess){
               if (erall) throw erall;
                 console.log(resall[0]["count(*)"])
               res.render("meeting",{"totlarows": resall[0]["count(*)"],"page":req.query.q,"meetings":resm})
          })

     })
       console.log(req.query.q*10)
       console.log(req.query.q*10)
     
})



app.get("/online",(req,res)=>{
     res.render("useronline",{"userisonline":useridlist} )
})






app.post("/majalis",(req, res)=>{

     dbcon.connection.query("SELECT * FROM `metting` where name like '%"+req.body.keys+"%'",function(errms,resm,fieldmess){
          if (errms) throw errms;
          dbcon.connection.query("SELECT count(*) FROM `metting`",function(erall,resall,fieldmess){
               if (erall) throw erall;
                 console.log(resall[0]["count(*)"])
               res.render("meeting",{"totlarows": resall[0]["count(*)"],"page":req.query.q,"meetings":resm})
          })
     })
       console.log(req.query.q*10)
})
app.get("/logout",(req, res)=>{
     res.cookie("nameuser",req.body.name,{
          expires: new Date(Date.now()-((1000*60)*60*10)),
        })
     res.redirect("/")
})
app.get("/dash",(req, res)=>{
    res.render("dash")
})
app.get("/administration",(req,res)=>{
     res.render("admin")
})
app.post("/ajoutermeeting",(req,res)=>{
   //   let name,start_time,url_video,poster,id_user,desc


          const today = new Date();
          const year = today.getFullYear();
          const month = today.getMonth() + 1; // add 1 because January is 0
          const day = today.getDate();


     let name = (req.body.name !=null) ?req.body.name  :  '' ;
     let start_time = (req.body.start_time !=null) ? month+"-"+day+"-"+year :  'undefined' ;
     let url_video = (req.body.url_video !=null) ?req.body.url_video  :  'undefindded' ;
     let poster = (req.body.poster !=null) ?req.body.poster  :  'undefined' ;
     let id_user = (req.body.poster !=null) ?req.body.id_user  :  'undefined' ;
     let desc = (req.body.poster !=null) ?req.body.desc  :  'undefined' ;
    
     dbcon.connection.query(
          "INSERT INTO `metting`(`id`, `name`, `start_time`, `final_time`, `responsable`, `url_video`, `poster`, `id_user`, `desc`) VALUES ('NULL','"+name+"','"+start_time+"','[value-4]','[value-5]','"+url_video+"','"+poster+"','"+id_user+"','"+desc+"')"
     ,function(err,result){
          if (err){
                  console.log(res[0]);
                  res.render("404")
          }
          else{
               
               if(  fs.existsSync(path.join(__dirname,"../public/asset/imgcontent/")+ piccontent)){
                    fs.unlinkSync(path.join(__dirname,"../public/asset/imgcontent/")+ piccontent, (err) => {
                        if (err) throw err;
                        console.log('img2 was successfully deleted');
                      });
                 }
                res.render("admin")
          }
     })
    
})




app.post("/ajouteimg",(req,res)=>{
console.log(req.files)



if(req.files.header){
     req.files.header.mv(path.join(__dirname,"../public/asset/entit/")+ req.files.header.name)

   if(  fs.existsSync(path.join(__dirname,"../public/asset/entit/")+ picturnav)){
      fs.unlinkSync(path.join(__dirname,"../public/asset/entit/")+ picturnav, (err) => {
          if (err) throw err;
          console.log('img1 was successfully deleted');
        });
   }
    
}

if(req.files.imgcontent){
     req.files.imgcontent.mv(path.join(__dirname,"../public/asset/imgcontent/")+ req.files.imgcontent.name)
     if(  fs.existsSync(path.join(__dirname,"../public/asset/imgcontent/")+ piccontent)){
          fs.unlinkSync(path.join(__dirname,"../public/asset/imgcontent/")+ piccontent, (err) => {
              if (err) throw err;
              console.log('img2 was successfully deleted');
            });
       }
}
//fileup.mv(path.join(__dirname,"../public/asset/entit/")+req.files.imgcontent.name)
     res.render("admin")

})
app.use((req,res)=>{    
     res.render("404")
  })
  