var express = require('express');
var path = require('path');
var bodyParser = require("body-parser")
var fs=require('fs');
//connect to the mongoDB
var db = require('mongoskin').db("mongodb://localhost:27017/testdb", { w: 0});
db.bind('events');
db.bind('users');
db.bind('laboratorios');

function verificar(user,pass){
    var resultado=db.users.findOne({username:user,password:pass},function(err,res){
        if(!err){
            if(res!=null){
                return true;
            }else{
                return false;
            }
        }else{
            return false;
        }
    });
    return false;
}

function insertar(nombre, org, prop, IDusuario){
    var numeros=fs.readFileSync('id.txt','utf-8');
    numeros++;
    db.events.insert({ID:numeros,Name:nombre, Org:org, Proposito:prop, IDUser:IDusuario},function(err,res){
       if(!err){
            console.log('insertado con exito');
            fs.unlinkSync('id.txt');
            fs.writeFileSync('id.txt',numeros);
        }else{
            console.log('Fallo insert');
        }
    });
}

function borrar(id){
    db.events.remove({ID:id},function(err,res){
        if(!err){
            console.log(id+' success delete');
        }else{
            console.log(err);
        }
    });
}

function actualizar(id,nName, nOrg, nProp){
    db.events.update({ID:id},{$set:{Name:nName,Org:nOrg,Proposito:nProp}},function(err,res){
        if(!err){
            console.log(id+' succes update');
        }else{
            console.log(err);
        }
    });
}
//create express app, use public folder for static files
var app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");

//is necessary for parsing POST request
app.use(express.bodyParser());

app.get("/", function(req, res){
    res.render("index")
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
    res.render("lab1")
});

app.get("/laboratorio2", function(req, res){
    res.render("lab2")
});

app.post("/laboratorio1", function(req, res){
    console.log("POSTEO!")
    var nombreEvento = req.query.nombreEvento;
    var organizacion = req.query.organizacion;
    var propositoEvento = req.query.propositoEvento;
    var fechaInicio = req.query.fechaInicio;
    var fechaFinal = req.query.fechaFinal;
    var horaInicio = req.query.horaInicio;
    var horaFinal = req.query.horaFinal;
    console.log(nombreEvento);
    res.redirect("/");
});

app.post("/laboratorio2", function(req, res){
    console.log("POSTEO!")
    var nombreEvento = req.query.nombreEvento;
    var organizacion = req.query.organizacion;
    var propositoEvento = req.query.propositoEvento;
    var fechaInicio = req.query.fechaInicio;
    var fechaFinal = req.query.fechaFinal;
    var horaInicio = req.query.horaInicio;
    var horaFinal = req.query.horaFinal;
    console.log(nombreEvento);
    res.redirect("/");
});

app.listen(3000);