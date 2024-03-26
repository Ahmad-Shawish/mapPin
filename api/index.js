require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const pinRoute = require('./routes/pins');
const userRoute = require('./routes/users');

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true}).then(()=>{
    console.log("MongoDB Connected!")
}).catch((err)=>{
    console.log(err)
})

app.use('/api/pins', pinRoute);
app.use('/api/users', userRoute);

app.listen(4000, ()=>{
    console.log("Server is running!")
});
