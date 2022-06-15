import express from 'express';
import cors from 'cors';
import knex from 'knex';
import handleRegister from './controllers/register.js';
import handleSignin from './controllers/signin.js';
import handleProfile from './controllers/profile.js';
import {handleImage,  handelApiCall } from './controllers/image.js';
// import fileUpload from 'express-fileupload';
import multer from 'multer';

const app = express();
const upload = multer();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(fileUpload());

//TEST
app.options('*',cors());
var allowCrossDomain = function(req,res,next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();  
}
app.use(allowCrossDomain);
//

const db = knex ({
  client: 'pg',
  connection: {
    connectionString : process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }      
  }
});

app.get('/',(req,res) => {
  res.send('gettting root');
})

app.get('/profile/:id',(req,res) => {handleProfile(req,res,db)})
app.put('/image',(req,res) => {handleImage(req,res,db)})
app.post('/imageurl',upload.single('myimage'),(req,res) => {handelApiCall(req,res,'face')})
app.post('/generalimageurl',(req,res) => {handelApiCall(req,res,'general')})
app.post('/signin',(req,res) => {handleSignin(req,res,db)})
app.post('/register', handleRegister(db))

app.listen(process.env.PORT,() => {
    //will run after listen happens
    console.log(`app is running on port: ${process.env.PORT}`);
})

// console.log(process.env);
// const PORT = process.env.PORT;
// console.log(PORT);