const express = require('express')
const bodyParser = require('body-parser')
const cors = require("cors");
const logger = require('morgan');
const jwt = require('jsonwebtoken');


require('dotenv').config();
const PORT = process.env.PORT || 4000;
const base_url = process.env.base_url;

const app = express();
app.use(express.json())// add this line
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())


app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin','*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
  
    // Pass to next layer of middleware
    next();
  });

app.use(cors())
app.use(logger('dev'));
app.use(express.json({
    limit: '50mb'
}));
app.use(express.urlencoded({
    extended: true,
    parameterLimit: 100000,
    limit: '50mb'
}));

// modul routing here
const user = require ('./user');
const shopping = require ('./shopping');


// routing here
// =============================== USER =====================================
    app.post('/api/users/signup', user.SignUp);
    app.post('/api/users/signin', user.SignIn);
    app.get('/api/users', authenticateToken, (req, res) => {
        user.readall(req,res)
    });
    app.get('/api/shopping', authenticateToken, (req, res) => {
        shopping.readall(req,res)
    });
// =============================== SHOPPING =====================================
    // create //
    app.post('/api/shopping', authenticateToken, (req, res) => {
        shopping.create(req,res)
    });
    // getall
    app.get('/api/shopping', authenticateToken, (req, res) => {
        shopping.readall(req,res)
    });
    // get by id
    app.get('/api/shopping/:id',authenticateToken, (req, res) => {
        shopping.readById(req,res)
    });
    // update
    app.put('/api/shopping/:id',authenticateToken, (req, res) => {
        shopping.update(req,res)
    });
    // delete
    app.delete('/api/shopping/:id',authenticateToken, (req, res) => {
        shopping.delete_(req,res)
    });

// ==========================================================================

// authentification part======================================================

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
  
    if (token == null) {
        //return res.sendStatus(401)
        return res.status(401).send({success:false,data:'Unauthorize'})
    }
    try {
      const verified = jwt.verify(token, process.env.TOKEN_SECRET)
      req.user = verified
  
      next() // continuamos
  } catch (error) {
      res.status(400).json({error: 'token not valid'})
  }
  
  }
// ==============================================================================
app.get("/", (req, res) => {
    res.send({
        message: "🚀 API Test BTS"
    });
});

app.listen(PORT, () => {
    console.log(`API listening on port ${PORT}`);
});
