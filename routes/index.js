var express = require('express');
var router = express.Router();
var pool = require("./pool");
var verfiy = require('./middleware');
const upload = require('./multer');
const util = require('util');
const { verify } = require('crypto');

const queryasync = util.promisify(pool.query).bind(pool);


/* GET home page. */
router.get('/', verfiy.authentication ,  function(req, res, next) {

  if(req.session.user_type == 'Broker'){
    res.render('broker', { title: 'Express' });

  }
  else{
    res.render('index', { title: 'Express' });

  }

});


// Call all routes 

router.get('/home/:name',verfiy.authentication,(req,res)=>{
  console.log('done')
  res.render(`${req.params.name}`,{msg:''})
})


router.get('/register',(req,res)=>{
  res.render('register')
})

router.post('/register/check',(req,res)=>{
  req.session.email = req.body.email;
  console.log('email enter',req.session.email)
  res.json({msg:'success'})
})


router.get('/register/v2',(req,res)=>{
  if(req.session.email){
    res.render('register2',{email:req.session.email})
  }
  else{
    res.redirect('/home/register')
  }

})



router.post('/register/submit',(req,res)=>{
  let body = req.body
  pool.query(`select * from user where email = '${req.body.email}' and user_name = '${req.body.user_name}' and phone = '${req.body.phone}'`,(err,result)=>{
    if(err) throw err;
    else if(result.length > 0) {
      res.json({msg:'account exist'})
    }
    else{
      pool.query(`insert into user set ?`,body,(err,result)=>{
        if(err) throw err;
        else {
          req.session.email = null;
          res.json({msg:'success'})
        }
      })
    }
  })
})



router.post('/login/check',(req,res)=>{
  let body = req.body
  pool.query(`select * from user where email = '${req.body.email}' and password = '${req.body.password}'`,(err,result)=>{
    if(err) throw err;
    else if(result.length > 0) {
      req.session.user_name =  result[0].user_name;
      req.session.userid = result[0].id;
      req.session.user_type = result[0].user_type;
      res.redirect('/')
    }
    else{
      pool.query(`insert into user set ?`,body,(err,result)=>{
        if(err) throw err;
        else {
          res.render('login',{msg:'Invalid Credentials'})
        }
      })
    }
  })
})



router.post('/contact/submit',(req,res)=>{
  let body = req.body;
  pool.query(`insert into contact set ?`,body,(err,result)=>{
    if(err) throw err;
    else {
      req.session.email = null;
      res.render('contact',{msg:'Our Team Will Contact You Soon.'})
    }
  })
})


router.get('/get-friend-list',(req,res)=>{
  pool.query(`select u.fname as friend_name from user u`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})



// router.post('/property/submit',upload.array('images','15'),(req,res)=>{
//   let body = req.body;
//   let files = req.files;
//   console.log('body',files);
//   pool.query(`insert into property set ?`,body,(err,result)=>{
//     if(err) throw err;
//     else{
//       let id = result[0].id
//       for(i=0;i<files.length;i++){
//         pool.query(`insert into images(propertyid,image) values('${id}' , '${files[i].filename}')`,(err,result)=>{
//           if(err) throw err;
//           else{
//             console.log('done')
//           }
//         })
//       }
//       res.render(`property`,{msg:'Succesfully Submitted'})
//     }
//   })
// })


router.post('/property/submit', upload.array('images', 15), async (req, res) => {
  try {
    const body = req.body;
    const files = req.files;
    console.log('body', files);

    body['userid'] = req.session.userid;

    // Insert property details
    const insertPropertyQuery = 'INSERT INTO property SET ?';
    const propertyResult = await queryasync(insertPropertyQuery, body);
    const id = propertyResult.insertId;

    // Insert images
    const insertImagesQuery = 'INSERT INTO images(propertyid, image) VALUES ?';
    const imageValues = files.map(file => [id, file.filename]);
    await queryasync(insertImagesQuery, [imageValues]);

    console.log('Images inserted successfully');
    res.render('uploadproperty', { msg: 'Successfully Submitted' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});



router.get('/propertylist',verfiy.authentication,(req,res)=>{
  pool.query(`select p.*, (select i.image from images i where i.propertyid = p.id order by id desc limit 1) as propertyimage from property p where p.userid = '${req.session.userid}'`,(err,result)=>{
    if(err) throw err;
    else res.render(`propertylist`,{result})
  })
})


router.get('/property/delete',(req,res)=>{
  pool.query(`delete from property where id = '${req.query.id}'`,(err,result)=>{
    if(err) throw err;
    else res.redirect('/propertylist')  
  })
})


router.get('/profile',verfiy.authentication,(req,res)=>{
  pool.query(`select * from user where id = '${req.session.userid}'`,(err,result)=>{
    if(err) throw err;
    else res.render(`profile`,{result,msg:''})
  })
})


router.post('/profile/update',(req,res)=>{
  pool.query(`update user set password = '${req.body.password}' where id = '${req.session.userid}'`,(err,result)=>{
    if(err) throw err;
    else {
      pool.query(`select * from user where id = '${req.session.userid}'`,(err,result)=>{
        if(err) throw err;
        else res.render(`profile`,{result,msg:'Update Successfully'})
      })
    }
  })
})


router.get('/logout', (req, res) => {
  req.session.user_name = req.session.user_type = req.session.userid = null;
  res.redirect('/home/login');
});



router.get('/browse-property',verfiy.authentication,(req,res)=>{
  pool.query(`select p.*, (select i.image from images i where i.propertyid = p.id order by id desc limit 1) as propertyimage from property p`,(err,result)=>{
    if(err) throw err;
    else res.render(`property`,{result})
  })
})




router.get('/search', async (req, res) => {
  try {
    const { name, type, bedrooms, minPrice } = req.query;

    // res.json(name)

    let queryParams = [];
    let conditions = [];

    if (name) {
      conditions.push('address LIKE ?');
      queryParams.push(`%${name}%`);
    }

    if (type) {
      conditions.push('type = ?');
      queryParams.push(type);
    }

    if (bedrooms) {
      conditions.push('bedrooms = ?');
      queryParams.push(bedrooms);
    }

    if (minPrice) {
      conditions.push('rent >= ?');
      queryParams.push(minPrice);
    }

    let conditionString = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

    const query = `SELECT * FROM property ${conditionString}`;
    console.log(`SELECT * FROM property ${conditionString}`)
    const properties = await queryasync(query, queryParams);

    // res.json(properties);
    res.render(`property`,{result:properties})
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});



router.get('/browse/single-property',verfiy.authentication,(req,res)=>{
  var query = `select p.* ,
   (select u.fname from user u where u.id = p.userid) as userfirstname,
   (select u.lname from user u where u.id = p.userid) as userlastname
   from property p where p.id  = '${req.query.id}';`
  var query1 = `select * from images where propertyid = '${req.query.id}';`
  pool.query(query+query1,(err,result)=>{
    if(err) throw err;
    else res.render('single_property',{result})
  })
  
})


router.post('/roommate/submit',upload.single('image'),(req,res)=>{
  let body = req.body;
  body['image'] = req.file.filename
  pool.query(`insert into roommate set ?`,body,(err,result)=>{
    if(err) throw err;
    else res.render(`addroommate`,{msg:'Successfully Submmitted'})
  })
})


router.get('/find-roommate',(req,res)=>{
  pool.query(`select * from roommate`,(err,result)=>{
    if(err) throw err;
    else res.render('roommate_list',{result})
  })
})


router.get('/find-roommate-list',(req,res)=>{
  pool.query(`select * from roommate`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})


router.get('/get-studentbuddy-list',(req,res)=>{
  pool.query(`select * from studentbuddy`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})




router.get('/roomatechat',(req,res)=>{
  let first_party = req.session.userid;
  let second_party = req.query.second_party;
  
  var query = `select * from roommate where id = '${second_party}';`
  var query1 = `SELECT * FROM roomatechat WHERE first_party IN ('${first_party}', '${second_party}') and second_party IN ('${first_party}', '${second_party}')`


  pool.query(query+query1,(err,result)=>{
    if(err) throw err;
    // else res.json(result)
    else res.render('chat',{result,first_party,second_party})
  })
  // 
})




router.get('/studentbuddychat',(req,res)=>{
  let first_party = req.session.userid;
  let second_party = req.query.second_party;
  
  var query = `select * from studentbuddy where id = '${second_party}';`
  var query1 = `SELECT * FROM studentbuddychat WHERE first_party IN ('${first_party}', '${second_party}') and second_party IN ('${first_party}', '${second_party}')`


  pool.query(query+query1,(err,result)=>{
    if(err) throw err;
    // else res.json(result)
    else res.render('studentbuddychat',{result,first_party,second_party})
  })
  // 
})



router.get('/brokerchat',(req,res)=>{
  let first_party = req.session.userid;
  let second_party = req.query.second_party;
  var query = `select * from user where id = '${second_party}';`
  var query1 = `SELECT b.*
  FROM brokerchat b WHERE b.first_party IN ('${first_party}', '${second_party}') and b.second_party IN ('${first_party}', '${second_party}')`
  pool.query(query+query1,(err,result)=>{
    if(err) throw err;
    // else res.json(result)
    else res.render('brokerchat',{result,first_party,second_party})
  })
  // 
})



router.post('/roomatechat/submit',upload.array('image',20),(req,res)=>{
  // res.json({body:req.body,file:req.files})

  let body = req.body;

  if(req.body.message){
     pool.query(`insert into roomatechat set ?`,body,(err,result)=>{
      if(err) throw err;
      else {
        if(req.files){
        for(i=0;i<req.files.length;i++){
          pool.query(`insert into roomatechat(first_party,second_party,message) values('${req.body.first_party}','${req.body.second_party}', '${req.files[i].filename}')`,(err,result)=>{
            if(err) throw err;
            else console.log('done');
          })
        }
        res.redirect(`/roomatechat?first_party=${req.body.first_party}&second_party=${req.body.second_party}`)
        }
        else{
          res.redirect(`/roomatechat?first_party=${req.body.first_party}&second_party=${req.body.second_party}`)
        }
      }
     })
  }
  else{
    for(i=0;i<req.files.length;i++){
      pool.query(`insert into roomatechat(first_party,second_party,message) values('${req.body.first_party}','${req.body.second_party}', '${req.files[i].filename}')`,(err,result)=>{
        if(err) throw err;
        else console.log('done');
      })
    }
    res.redirect(`/roomatechat?first_party=${req.body.first_party}&second_party=${req.body.second_party}`)
    
  }

})




router.post('/brokerchat/submit',upload.array('image',20),(req,res)=>{
  // res.json({body:req.body,file:req.files})

  let body = req.body;

  if(req.body.message){
     pool.query(`insert into brokerchat set ?`,body,(err,result)=>{
      if(err) throw err;
      else {
        if(req.files){
        for(i=0;i<req.files.length;i++){
          pool.query(`insert into brokerchat(first_party,second_party,message) values('${req.body.first_party}','${req.body.second_party}', '${req.files[i].filename}')`,(err,result)=>{
            if(err) throw err;
            else console.log('done');
          })
        }
        res.redirect(`/brokerchat?first_party=${req.body.first_party}&second_party=${req.body.second_party}`)
        }
        else{
          res.redirect(`/brokerchat?first_party=${req.body.first_party}&second_party=${req.body.second_party}`)
        }
      }
     })
  }
  else{
    for(i=0;i<req.files.length;i++){
      pool.query(`insert into brokerchat(first_party,second_party,message) values('${req.body.first_party}','${req.body.second_party}', '${req.files[i].filename}')`,(err,result)=>{
        if(err) throw err;
        else console.log('done');
      })
    }
    res.redirect(`/brokerchat?first_party=${req.body.first_party}&second_party=${req.body.second_party}`)
    
  }

})


router.post('/studentbuddychat/submit',upload.array('image',20),(req,res)=>{
  // res.json({body:req.body,file:req.files})

  let body = req.body;

  if(req.body.message){
     pool.query(`insert into studentbuddychat set ?`,body,(err,result)=>{
      if(err) throw err;
      else {
        if(req.files){
        for(i=0;i<req.files.length;i++){
          pool.query(`insert into studentbuddychat(first_party,second_party,message) values('${req.body.first_party}','${req.body.second_party}', '${req.files[i].filename}')`,(err,result)=>{
            if(err) throw err;
            else console.log('done');
          })
        }
        res.redirect(`/studentbuddychat?first_party=${req.body.first_party}&second_party=${req.body.second_party}`)
        }
        else{
          res.redirect(`/studentbuddychat?first_party=${req.body.first_party}&second_party=${req.body.second_party}`)
        }
      }
     })
  }
  else{
    for(i=0;i<req.files.length;i++){
      pool.query(`insert into studentbuddychat(first_party,second_party,message) values('${req.body.first_party}','${req.body.second_party}', '${req.files[i].filename}')`,(err,result)=>{
        if(err) throw err;
        else console.log('done');
      })
    }
    res.redirect(`/studentbuddychat?first_party=${req.body.first_party}&second_party=${req.body.second_party}`)
    
  }

})


router.post('/studentbuddy/submit',upload.single('image'),(req,res)=>{
  let body = req.body;
  body['image'] = req.file.filename
  pool.query(`insert into studentbuddy set ?`,body,(err,result)=>{
    if(err) throw err;
    else res.render(`studentbuddy_form`,{msg:'Successfully Submmitted'})
  })
})

module.exports = router;
