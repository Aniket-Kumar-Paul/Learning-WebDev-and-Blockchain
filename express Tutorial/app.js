//Express, Static Files, PUG template engine, Form's Data Backend

const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 80;

//EXPRESS SPECIFIC STUFF
app.get("/about", (req, res)=>{
    res.status(200).send("This is the [GET REQUEST] about page of my first express app.");
});
app.post("/about", (req, res)=>{
    res.send("This is the [POST REQUEST] about page of my first express app.");
});

//static file :- file/page which can be accessed publicly without any login etc
//serving static files
app.use('/static',express.static('static')); //static is a folder
//Now, on running localhost/static/index.js , 
//it will show the exact code in index.js instead of executing index.js

// used for getting data from the form
app.use(express.urlencoded());

//PUG SPECIFIC STUFF
app.set('view engine', 'pug'); //Set the template engine as pug
app.set('views', path.join(__dirname, 'views')); //Set the views(templates) directory


//ENDPOINTS
app.get('/', (req, res)=>{ 
    const params = {'title': 'Gym', 'content': 'Welcome'};
    res.status(200).render('index.pug', params);
})
app.post('/', (req, res)=>{
    console.log(req.body);
    naam = req.body.name;
    age = req.body.age;
    gender = req.body.gender;
    address = req.body.address;

    let output = `Name of the client is ${naam} who is ${age} years old residing in ${address}`;
    fs.writeFileSync('output.txt', output);

    const params = {'message': 'Your form has been submitted successfully'};
    res.status(200).render('index.pug', params);
})
//Pug Demo endpoint
app.get("/demo", (req, res)=>{
    res.status(200).render('demo', {title: 'Using pug', message: 'Hi there, Im learning pug!'});
});


//START THE SERVER
app.listen(port, ()=>{
    console.log(`Application started successfully on port ${port}`);
});
