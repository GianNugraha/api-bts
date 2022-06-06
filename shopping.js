const pool = require('./dbCon');
// const fs = require('fs');

const base_url = process.env.base_url;
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const create = (request, response) => {
    const { createddate, name } 
    = request.body

        pool.query('INSERT INTO shopping (createddate, name) VALUES ($1, $2) RETURNING id'
        , [createddate, name ], (error, results) =>{
          if (error) {
             throw error
          }else
          {        
            response.status(200).json( {data:{"createddate":createddate,"id":results.rows[0].id,"name" : name }})
          }
    
        })
  
   

   
}

const readall = (request, response) => {

    const {page,rows} = request.body
    var page_req = page || 1
    var rows_req = rows || 10
    var offset = (page_req - 1) * rows_req
    var res = []
    var items = []

  
    pool.query('SELECT count(*) as total FROM shopping', (error, results) => {
      if (error) {
        throw error
      }
     //console.log(results.rows[0].total)
     res.push({total:results.rows[0].total})
  
     var sql= 'SELECT * FROM shopping ORDER BY id ASC'
     pool.query(sql ,(error, results) => {
       if (error) {
         throw error
       }
       items.push({rows:results.rows})
       res.push(items)
       response.status(200).send({success:true,data:res})
     })
  
    })

}

const readById = (request, response) => {

    const id = parseInt(request.params.id);
    const {page,rows} = request.body
    var page_req = page || 1
    var rows_req = rows || 10
    var offset = (page_req - 1) * rows_req
    var res = []
    var items = []
  
    // pool.query('SELECT count(*) as total FROM shopping where id=$1', [id], (error, results) => {
    //   if (error) {
    //     throw error
    //   }
    //  //console.log(results.rows[0].total)
    //  res.push({total:results.rows[0].total})
  
     var sql= 'SELECT * FROM shopping where id=$1'
     pool.query(sql,[id] ,(error, results) => {
       if (error) {
         throw error
       }
      //  items.push({rows:results.rows})
      //  res.push(items)
       response.status(200).send({data:results.rows})
     })
  
    // })

}

const update = (request, response) => {
    const id = parseInt(request.params.id);
    const { createddate, name } 
    = request.body;

    pool.query('SELECT * FROM shopping where id=$1 ',[id] ,(error, results) => {
          if (error) {
            throw error
          }

         pool.query('UPDATE shopping SET createddate=$1, name=$2 where id=$3'
         , [ createddate, name,id], (error, results) =>{
           if (error) {
             throw error
        
           }else
           {
              response.status(200).json( {data:{"createddate":createddate,"name" : name }})
           }
     
         })
    });
    
}

const delete_ = (request, response) => {
    const id = parseInt(request.params.id);

    pool.query('SELECT * FROM shopping where id=$1 ',[id] ,(error, results) => {
          if (error) {
            throw error
          }

         pool.query('DELETE FROM shopping WHERE id = $1', [id], (error, results) =>{
           if (error) {

             if (error)
             {
              throw error
             }
           }else
           {
               response.status(200).send({success:true,data:'data successfuly to delete'})
           }
     
         })

    });

        

   

   
    
}

module.exports = {
create,
readall,
readById,
update,
delete_,
}