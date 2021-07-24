
const knex = require('knex');


const db = knex({
    // Enter your own database information here based on what you created
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user :'postgres',
      password : 'Adarsh@123',
      database : 'smartbrain'
    }
  });
const jwt = require('jsonwebtoken');
exports.verifyToken=(req,res,next)=>{
    const token = req.headers.authorization;

jwt.verify(token, 'ahdsfhhrivbverbeh', (err, decoded)=> {
    if(err){
        res.status(500).json({error:"server error occured"});
    }
    const userEmail=decoded.email;
    db.select('email','hash').from('login')
    .where('email','=',userEmail)
    .then(user =>{
      userData=user.rows;
      if(user.Data===0){res.status(400).json("user does not exist,signup instead")}
      else{
        req.email= userEmail;
        next();
      }
       
      })

      .catch((err)=>{
          res.status(500).json({
              message:"database error occured",
          });
      })
    });

}