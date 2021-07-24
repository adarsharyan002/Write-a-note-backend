const { response } = require('express');
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

exports.addNote = (req,res) => {
    const {heading,content}= req.body;

    db('notes').insert({
        heading:heading,
        content:content,
        email:req.email

    })
      .returning('*')
      .then(loginemail=>{
          res.json({
            message:"Note added successfully"
          })
      })
      
      .catch((err) => {
          console.log(err);
        res.status(400).json("db error")
      }) 
        
    };


    exports.getNotes = (req,res)=>{
        db.select('heading','noteid','content')
        .from('notes')
        .where('email','=',req.email)
        .then(data=>{
          userData =  data;
            // console.log(data);
            res.status(200).json({
            message: "all good",
            data:userData,
            });
        })
        .catch((err) => {
            console.log(err);
          res.status(400).json("db error")
        }) 

    }

    exports.updateNotes=(req,res) =>{
        const {heading,content}= req.body;
        console.log(req.noteId)

       db('notes')
       .where('noteid','=',req.noteId)
       .update({
           heading:heading,
           content:content
       })
       .then((data) => {
         res.status(200).json({
           message:"hey doing good",
         })})
       .catch((err) => {
        console.log(err);
      res.status(400).json("databse error")
    })

        
    };

    exports.deleteNotes=(req,res) =>{

       db('notes')
       .where('noteid','=',req.noteId)
       .del()
       .then((data) => {res.status(200).json('success deletion')})
       .catch((err) => {
        console.log(err);
      res.status(400).json("databse error")
    })

        
    };
    



