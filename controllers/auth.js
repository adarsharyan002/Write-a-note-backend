const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const knex = require('knex');


const db = knex({
  // Enter your own database information here based on what you created
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user :process.env.DB_USER,
    password :process.env.DB_PASSWORD ,
    database : process.env.DB_NAME
  }
});
// const temporaryData = [
//   {
//     name: "Kunal",
//     email: "kunal@gmail.com",
//     password: "rameshsuresh",
//   },
//   {
//     name: "Nikhil",
//     email: "nikhil@gmail.com",
//     password: "rameshsuresh",
//   },
//   {
//     name: "Harsh",
//     email: "harsh@gmail.com",
//     password: "rameshsuresh",
//   },
// ];




exports.signUp = (req,res) =>{
    const {name,email,password}= req.body;

   

    //hashing

    bcrypt.hash(password, 10, function(err, hash)  {
      if(err){
          res.status(500).json(" internalerror in server");
      };
    // res.json("all good");
//IF ALREADY EXIST
    // const isValid = temporaryData.findIndex((ele)=>ele.email === email);
    // console.log(isValid);

    // if(isValid !== -1){
    //     res.status(400).json({
    //         error:"already exits"
    //     });}
    // }else{res.send("clear");}

    db.transaction(trx =>{
      trx.insert({
        hash:hash,
        email:email,
      })
      .into('login')
      .returning('email')
      .then(loginemail => {
        
        trx('users')
        .returning("*")
        .insert({
          email:loginemail[0],
          name:name,
          joined:new Date()
        })
        .then(user =>{

          const token=jwt.sign({
            email:email,
        }, process.env.SECRET_KEY);

          res.json({
            message:"User added successfully to database",
            token:token,
          });
        })
      })
      .then(trx.commit)
      .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('already exist'))
  })
    
    

  };




    //hash password
    // bcrypt.hash(password, 10, function(err, hash)  {
    //   if(err){
    //       res.status(500).json(" internalerror in server");
    //   }
        // res.status(200).send("tokengenerated");
   

//     const user={
//         name,
//         email,
//         password:hash,
//     };
//     temporaryData.push(user);
//     console.log(temporaryData);
//     res.status(200).json({
//         message:"User successfully added",
//         token:token,
//     });
// });


    
// };

exports.signIn = (req,res) => {
    const {email,password}=req.body;
    db.select('email','hash').from('login')
    .where('email','=',email)
    .then(user =>{
      userData=user.rows;
      if(user.Data===0){res.status(400).json("user does not exist,signup instead")}
      else{ bcrypt.compare(password, user[0].hash, function(err, result) {
        console.log(result);
        if(err){
          res.status(500).json("server error");
        }
        else if(result===false){
          res.status(400).json("incorrect password")
        }
        else{
          const token=jwt.sign({
            email:email,
        }, process.env.SECRET_KEY);


          res.status(200).json({
            message:"successfully-signed",
            token:token,
          });
        }
        
    });
  }

     
    })
    .catch((err)=>{ res.status(500).json({
      error: "Database error occurred!",
    });
  });
  

   
 

    
};