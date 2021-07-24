require('dotenv').config();

const express= require('express');
const cors=require('cors');
const authRoutes= require('./routes/auth');
const notesRoutes= require('./routes/notes');



const app=express();
app.use(express.json());
app.use(cors());

const port= process.env.PORT || 8000;

app.get("/",(req,res)=>{
    res.status(200).send("server is running ")
});

app.use("/auth",authRoutes);
app.use("/notes",notesRoutes);


app.listen(port,()=>{
    console.log("server is running");
});