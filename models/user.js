const mongoose = require('mongoose')

const mongoUrl = 'mongodb+srv://Gautam:root@cluster0.wocng.mongodb.net/Sheriyans-Project?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoUrl).then(() => {
    console.log('Database connection established');
});

const userSchema = mongoose.Schema({
    username: String,
    name:String,
    age: Number,
    gender: String,
    email: String,
    password: String,
    post:[{type:mongoose.Schema.Types.ObjectId, ref:"post"}]
},{collection : 'database'})

module.exports=mongoose.model('user', userSchema)