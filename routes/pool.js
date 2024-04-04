
var mysql = require('mysql2')

const pool = mysql.createPool({

  host : 'localhost',
   user: 'root',
  password:'123',
    database: 'student',
    port:'3306' ,
    multipleStatements: true

  // CREATE USER 'root'@'%' IDENTIFIED BY 'MyComplexPassword123!';

  })



  // country , story , blog-category , blogs , state , 



  // var mysql = require('mysql')
  // require('dotenv').config()
  
  // const pool = mysql.createPool({
  //   host:'103.117.180.114',
  //   ///host : 'localhost',
  //    user: 'shopsun_shopsun',
  //   password:'Shopsun@321!',
  //     database: 'shopsun_shopsun',
  //     port:'3306' ,
  //     multipleStatements: true
  //   })
  
  
  
  
  // module.exports = pool;

module.exports = pool;