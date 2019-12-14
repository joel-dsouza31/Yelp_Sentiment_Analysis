const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
const path=require('path');

const db=require('./db');
const collection="s";


app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'Homepage.html'));
})

app.get('/questions',(req,res)=>{
    res.sendFile(path.join(__dirname,'questions.html'));
})


app.get('/q1',(req,res)=>{
    res.sendFile(path.join(__dirname,'question1.html'));
})

app.get('/q2',(req,res)=>{
    res.sendFile(path.join(__dirname,'question2.html'));
})

app.get('/q3',(req,res)=>{
    res.sendFile(path.join(__dirname,'question3.html'));
})

app.get('/q4',(req,res)=>{
    res.sendFile(path.join(__dirname,'question4.html'));
})

// app.get('/',(req,res)=>{
//     res.sendFile(path.join(__dirname,'index.html'));
// })

//Fetch All the Data from Db
app.get('/getData',(req,res)=>{
    db.getDB().collection(collection).find({}).toArray((err,documents)=>{
        if(err)
        console.log(err);
        else{
            // console.log(documents);
            res.json(documents);
        }
    })
})


//Fetch the Data from Db by Id
app.get('/getData/:id',(req,res) => {
    const review_id=req.params.id;
    console.log(review_id)
    db.getDB().collection('Q1').findOne({name:review_id}).then(doc => {
        if(!doc){
            console.log('There was an error!');
        }else{
            res.json(doc);
        }
    })
})



//Fetch the Data from Db by Id
app.get('/getTopTen/:zipcode/:name',(req,res) => {
    const zipcode=req.params.zipcode;
    const name=req.params.name;
    db.getDB().collection('Q2').find({postal_code:zipcode,name:name}).toArray((err,documents)=>{
        if(err)
        console.log(err);
        else{
            // console.log(documents);
            res.json(documents);
        }
    })
})






app.get('/getTopRestaurants/:zipcode/:category',(req,res) => {
    const zipcode=req.params.zipcode;
    const category=req.params.category;
    db.getDB().collection('Q1').find({ZipCode:zipcode,Categories:{'$regex':category,'$options':'i'}}).toArray((err,documents)=>{
        if(err)
        console.log(err);
        else{
            console.log(documents);
            res.json(documents);
        }
    })
})



//Update Data
app.put('/updateData/:id',(req,res)=>{
    const review_id=req.params.id;
    const userInput=req.body;
    db.getDB().collection(collection).findOneAndUpdate({_id:db.getPrimaryKey(review_id)},{$set :{name:userInput.name}},{returnOriginal:false},(err,result)=>{
        if(err){
            console.log(err);
        }else{
            res.json(result);
        }
    });
});

//Insert Data
app.post('/newRestaurant',(req,res)=>{
    const userInput=req.body;
    console.log(req.body);
    db.getDB().collection('business').insertOne(userInput,(err,result)=>{
        if(err){
            console.log(err);
        }else{
            res.json({result : result,document: result.ops[0]});
        } 
    });
});


//Delete Data
app.delete('/deleteData/:id',(req,res)=>{
    const review_id=req.params.id;
    db.getDB().collection(collection).findOneAndDelete({_id:db.getPrimaryKey(review_id)},(err,result)=>{
        if(err){
            console.log(err);
        }else{
            res.json(result);
        }
    });
});


db.connect((err)=>{
    if(err){
        console.log('unable to connect to database')
        process.exit(1);
    }else{
        app.listen(3000,()=>{
            console.log('Connected');
        })
    }
})
