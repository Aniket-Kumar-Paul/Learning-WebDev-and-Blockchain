//Synchronous/Blocking - line by line execution
//Asynchronous/Non-Blocking - line by line execution not guarantedd, callbacks will fire

// const fs = require("fs"); //import module fs
// //Synchronous
// let text = fs.readFileSync("oldText.txt", "utf-8"); //returns contents of oldText in a string
// console.log("Synchronous\n",text);
// text = text.replace("file system","fs");
// fs.writeFileSync("newText.txt",text);
// //Asynchronous
// fs.readFile("oldText.txt","utf-8",(err,data)=>{
//     console.log("\nAsynchronous\n",err,data);
// }); //First read file then call the callback function, will take time, thus, below statements will be executed until then
// console.log("New Message"); //This will be printed before asynchronous one
// fs.readFile("oldFile.txt","utf-8",(err,data)=>{
//     console.log("\nAsynchronous\n",err,data);
// });

//Serving HTML File using NodeJS
const http = require('http');
const fs = require('fs');
const hostname = '127.0.0.1';
const port = 80;
const fileContent =  fs.readFileSync('htmlTut.html');
const server = http.createServer((req, res)=>{ //request, response
    console.log(req.url);
    res.writeHead(200, {'Content-type':'text/html'}); //200-status code
    res.end(fileContent);
});
server.listen(port, hostname, ()=>{
    console.log(`Server running at http://${hostname}:${port}/`);
});
