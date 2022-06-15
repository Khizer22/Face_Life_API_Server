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
// const upload = multer({
//   limits: {
//     fileSize: 4 * 1024 * 1024,
//   }
// });



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

app.use(express.static(__dirname + '/public'));

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, 'uploads/');
  },

  // By default, multer removes file extensions so let's add them back
  filename: function(req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage, fileFilter: helpers.imageFilter }).single('myimage');
upload(req, res, function(err) {
  // req.file contains information of uploaded file
  // req.body contains information of text fields, if there were any

  if (req.fileValidationError) {
      return res.send(req.fileValidationError);
  }
  else if (!req.file) {
      return res.send('Please select an image to upload');
  }
  else if (err instanceof multer.MulterError) {
      return res.send(err);
  }
  else if (err) {
      return res.send(err);
  }

  // Display uploaded image for user validation
  res.send(`You have uploaded this image: <hr/><img src="${req.file.path}" width="500"><hr /><a href="./">Upload another image</a>`);
});

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
app.post('/imageurl',upload,(req,res) => {handelApiCall(req,res,'face')})
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