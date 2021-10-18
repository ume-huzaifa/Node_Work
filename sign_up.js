var mysql=require ('mysql');
var sign_up=mysql.createConnection({
    host:'localhost',
    user:"root",
    password:"451975"
});

sign_up.connect(function(err){
    if(err)
        throw new err;
    console.log("connection successful..."); 
}); 