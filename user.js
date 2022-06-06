const pool = require('./dbCon');
const fs = require('fs');
const path = require('path')
const base_url = process.env.base_url;
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

var password_hash;


const SignUp = (request, response) => {
    const { username,name,encrypted_password,email,confirm_password,phone,address,city,country,postcode} 
    = request.body

     pool.query('SELECT Count(*) as total FROM users WHERE username = $1',[username] ,(error, results) => {
        if (error) {
          throw error
        }
        if(results.rows[0].total>0)
        {
            response.status(400).json({success:false,data: "user sudah ada" });
           
        }else
        {
            // user not exist

            bcrypt.genSalt(10,function(err, res) {
                salt= res
                bcrypt.hash(encrypted_password, salt,function(err,res){
                    password_hash= res;
                     pool.query('INSERT INTO users (username,name,password,email,phone,address,city,country,postcode) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)',[username,name,password_hash,email,phone,address,city,country,postcode] ,(error, results) => {
                    console.log(results);
                    
                    if (error) {
                        throw error
                    }
                    const token = generateAccessToken({ username: username })
                        // console.log(token);
                        response.status(200).json( {"email":email,"token":token,"username" : username })

                    // response.status(200).json({success:true,data: "User baru berhasil dibuat" });
                        })
                });
            });
            


        }
    })


}

const SignIn = (request, response) => {
    const { email, password} 
    = request.body

    pool.query('SELECT count(*) as total from users WHERE email =$1',[email],(error,results) => {
                pool.query('SELECT * from users WHERE email =$1',[email],(error,results1) => {
                    // console.log(data);
                bcrypt.compare(password, results1.rows[0].password, function(err, res) {

                    if(res) {
                        //console.log('Your password mached with database hash password');
                        //response.status(200).json({success:true,data: "User ditemukan" });
                        const token = generateAccessToken({ email: email })
                        console.log(token);
                        response.status(200).json( {"email":email,"token":token,"username" : results1.rows[0].username })
                    } else {
                        //console.log('Your password not mached.');
                        response.status(400).json({success:false,data: "password tidak sama" });
                    }
                });

            })
        
    })
}

const readall = (request, response) => {
    // const { username,password } 
    // = request.body

    pool.query('SELECT count(*) as total from users',(error,results) => {

                pool.query('SELECT * from users ',(error,results1) => {
                //bcrypt.compare(password, results.rows[0].password, function(err, res) {

                    if(results1) {
                        response.status(200).json( {success:true,data:results1.rows})
                    } else {
                        //console.log('Your password not mached.');
                        response.status(400).json({success:false,data: "tidak ada" });
                    }
                });

            });
        
    
}


  // ======================================== Access token =======================================
  function generateAccessToken(username) {
    return jwt.sign(username, process.env.TOKEN_SECRET,{expiresIn: '1800s'});
  }

  // =============================================================================================

  // ========================================= encrypt & decript function ========================

  function encrypt(text) {
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    //return encrypted.toString('hex')
    iv_text = iv.toString('hex')

    return { iv: iv_text, encryptedData: encrypted.toString('hex'),key:key.toString('hex') };
   }
   
   function decrypt(text) {
    let iv = Buffer.from(text.iv, 'hex');
    let enkey = Buffer.from(text.key, 'hex')//will return key;
    let encryptedText = Buffer.from(text.encryptedData, 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(enkey), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
   }

  //================================================================================================
   

module.exports = {
    SignUp,
    SignIn,
    readall
    }