var express = require('express');
var path = require('path');

//connect to the mongoDB
var db = require('mongoskin').db("mongodb://localhost:27017/testdb", { w: 0});
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
    var x;
    db.events.find({},{ID:1,_id:0}).sort({ID:-1}).limit(1).toArray(function(err,res){
        if(err){
            throw err;
        }else{
            if(res[0].ID===3){
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
//create express app, use public folder for static files
var app = express();
app.use(express.static(path.join(__dirname, 'public')));

//is necessary for parsing POST request
app.use(express.bodyParser());

app.get('/init', function(req, res){
    db.events.insert({ 
        text:"My test event A", 
        start_date: new Date(2013,8,1),
        end_date:   new Date(2013,8,5)
    });
    db.events.insert({ 
        text:"One more test event", 
        start_date: new Date(2013,8,3),
        end_date:   new Date(2013,8,8),
        color: "#DD8616"
    });

    /*... skipping similar code for other test events...*/

    res.send("Test events were added to the database")
});


app.get('/data', function(req, res){
    db.events.find().toArray(function(err, data){
        //set id property for all records
        for (var i = 0; i < data.length; i++)
            data[i].id = data[i]._id;

        //output response
        res.send(data);
    });
});

app.post('/data', function(req, res){
    var data = req.body;

    //get operation type
    var mode = data["!nativeeditor_status"];
    //get id of record
    var sid = data.id;
    var tid = sid;

    //remove properties which we do not want to save in DB
    delete data.id;
    delete data.gr_id;
    delete data["!nativeeditor_status"];


    //output confirmation response
    function update_response(err, result){
        if (err)
            mode = "error";
        else if (mode == "inserted")
            tid = data._id;

        res.setHeader("Content-Type","text/xml");
        res.send("<data><action type='"+mode+"' sid='"+sid+"' tid='"+tid+"'/></data>");
    }

    //run db operation
    if (mode == "updated")
        db.events.updateById( sid, data, update_response);
    else if (mode == "inserted")
        db.events.insert(data, update_response);
    else if (mode == "deleted")
        db.events.removeById( sid, update_response);
    else
        res.send("Not supported operation");
});

app.listen(3000);
