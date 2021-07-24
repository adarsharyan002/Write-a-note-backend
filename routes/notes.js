const express= require('express');
const router =express.Router();
const {verifyToken}=require("../middlewares/middle");
const { handleNoteIdParam } = require("../middlewares/notemiddleware");
const {addNote}=require("../controllers/notes");
const {getNotes}=require("../controllers/notes");
const {updateNotes}=require("../controllers/notes");
const {deleteNotes}=require("../controllers/notes");

router.param("noteId", handleNoteIdParam);


router.post('/add',verifyToken,addNote);

router.delete("/delete/:noteId",verifyToken,deleteNotes);
router.put("/update/:noteId",verifyToken,updateNotes);
router.get("/getallnotes",verifyToken,getNotes);

module.exports=router;

