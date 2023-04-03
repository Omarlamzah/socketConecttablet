var mysql= require('mysql');
var connection2= mysql.createConnection({
host :'localhost',
user :'root',
password:'',
database:'olfadb',
port:80
});

var connection= mysql.createConnection({
    host :'68.64.164.99',
    user :'admin',
    password:'r7HMwhfZ',
    database:'olfadb',
    port:12740
    });



module.exports={connection}