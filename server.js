import express from 'express';
import cors from 'cors';
import knex from 'knex';
import handleRegister from './controllers/register.js';
import handleSignin from './controllers/signin.js';
import handleProfile from './controllers/profile.js';
import {handleImage,  handelApiCall } from './controllers/image.js';

 const db = knex ({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : 5432,
      user : 'postgres',
      password : 'test',
      database : 'face_life_db'
    }
});

const app = express();

app.use(express.json());
app.use(cors());

app.get('/',(req,res) => {
  res.send('gettting root');
})

app.post('/signin',(req,res) => {handleSignin(req,res,db)})
app.post('/register', handleRegister(db))
app.get('/profile/:id',(req,res) => {handleProfile(req,res,db)})
app.put('/image',(req,res) => {handleImage(req,res,db)})
app.post('/imageurl',(req,res) => {handelApiCall(req,res)})

app.listen(process.env.PORT,() => {
    //will run after listen happens
    console.log(`app is running on port: ${process.env.PORT}`);
})

// console.log(process.env);
// const PORT = process.env.PORT;
// console.log(PORT);