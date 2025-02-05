const express=require('express');
const app=express();
const port=3000;

app.get('/',(req,res,next)=>{
    res.sendFile(__dirname+'/index.html');
});

app.listen(port,()=>{
    console.log('server running at http://localhost:'+port);
});