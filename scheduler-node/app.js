var express = require('express');
var path = require('path');
var bodyParser = require("body-parser")

//connect to the mongoDB
/*var db = require('mongoskin').db("mongodb://localhost:27017/testdb", { w: 0});
    db.bind('events');
    db.bind('users');
    db.bind('laboratorios');
    /*db.events.insert({
        ID: getNextSequence("userid"),
        Name: "Faasdsad",
        Org: "jajaja",
        Proposito: "jijiji",
        IDUser: 1
    }, function(err,res){
        if(err)
            throw err;
    });*/
/*    var x;
    db.events.find({},{ID:1,_id:0}).sort({ID:-1}).limit(1).toArray(function(err,res){
        if(err){
            throw err;
        }else{
            if(res[0].ID==3){
                console.log('yay');
                x=res[0].ID;//x=3
                console.log(x);
            }        
        }
    });
    console.log(x);//x=0
    

function insertar(nombre, org, prop, IDusuario){
    db.events.insert({Name:nombre, Org:org, Proposito:prop, IDUser:IDusuario},function(err,res){
       if(!err){
            console.log('insertado con exito');
        }else{
            console.log('Fallo insert');
        }
    }); 
}

function borrar(id){
    console.log('----BORRAR----');
    db.events.remove({ID:id},function(err,res){
        if(!err){
            console.log('success delete');
        }else{
            console.log(err);
        }
    });
}

function actualizar(id, nName, nOrg, nProp){
    console.log('----ACTUALIZAR----');
    db.events.update({ID:id},{$set:{name:nName,}},function(err,res){
        if(!err){
            console.log('succes update');
        }else{
            console.log(err);
        }
    });
}
*/

//create express app, use public folder for static files
var app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");

//is necessary for parsing POST request
app.use(express.bodyParser());

app.get("/", function(req, res){
    console.log("LOGIN")
    //res.render("login")
});

app.post("/", function(req, res){
    var loginBoolean = verificar(req.body.user, req.body.password);
    if (loginBoolean) {
        res.redirect("/calendario");
    }else{
        res.render("/", {loginBoolean:loginBoolean});
    }
});

app.get("/laboratorio1", function(req, res){
    console.log("abriendo laboratorio1")
    res.render("lab1")
});



app.listen(3000);
