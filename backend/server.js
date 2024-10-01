const express= require('express')
const app = express();
const userModel=require('../models/user')
const postModel=require('../models/posts')
const port=3000;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');


app.use(express.json());
app.set("view engine","ejs");
app.use(express.urlencoded({ extended : true }));
app.use(cookieParser());


app.get('/',(req,res)=>{
    res.render('index')
})
app.get('/login',(req,res)=>{
    res.render('login')
})
app.get('/logout',(req,res)=>{
    res.cookie("token","");

    res.redirect('/login')
})
app.post('/register',async(req,res)=>{
    let {email,password,username,name,age}=req.body;
    // basic validation 
    if (!email || !password || !username || !name || !age) {
        return res.status(400).send('Please fill all the fields');
    }

    // check if email already exists in the database
    let check = await userModel.findOne({email: email});
    if(check){
        return res.send('User already exists')
    }
    
    // hash the password
    let salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    console.log(password);

    // create a new user document and save it to the database
    let user=new userModel({email,password,username,name,age})
    try{
        await user.save();
        // create a JWT token
        let token = jwt.sign({email:email,userid:user._id},"system");
        res.cookie("token",token);
        res.send('User registered successfully')
        }
        catch(err){
            console.log(err)
            res.send('Error registering user')
    }
})
app.post('/login',async(req,res)=>{
    let {email,password}=req.body;
    // basic validation 
    if (!email || !password ) {
        return res.status(400).send('Please fill all the fields');
    }

    // check if email already exists in the database
    let check = await userModel.findOne({email: email});
    if(!check){
        return res.send('Something went wrong')
    }
    
    bcrypt.compare(password, check.password,(err,result)=>{
        if(result){
            res.status(200).send("You have successfully authenticated");
        }
        else{
            res.status(401).send("Invalid credentials")
            res.redirect('/login');
        }
    })
})

app.listen(port, ()=>{
    console.log(`Server running at http://localhost:${port}`)
})