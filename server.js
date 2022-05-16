import express from 'express';
import cors from 'cors';
import knex from 'knex';
import handleRegister from './controllers/register.js';
import handleSignin from './controllers/signin.js';
import handleProfile from './controllers/profile.js';
import {handleImage,  handelApiCall } from './controllers/image.js';

const app = express();

app.use(cors());
app.use(express.json());

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