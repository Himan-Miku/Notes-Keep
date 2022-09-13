require("dotenv").config();
const express  = require("express");
const mongoose = require("mongoose");
const cors     = require("cors");
const path     = require("path");
const app      = express();
 
const PORT     = process.env.PORT || 4747;
const DB_URI   = "mongodb://localhost:27017/"
const DB       = "reactDB";
 
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
 
// Establish DB connection
mongoose.connect(DB_URI + DB);
 
const db = mongoose.connection;
 
// Event listeners
db.once('open', () => console.log(`Connected to ${DB} database`));
 
// Create Schema
let noteSchema = new mongoose.Schema(
   {
      title: String,
      content: String
   },
   { collection: "notes" }
);
 
// Create Model
let noteModel = db.model("noteModel", noteSchema);
 
// Route to Get all Notes
app.get("/api/notes", (req, res) => {
   noteModel.find({}, {__v: 0}, (err, docs) => {
      if (!err) {
         res.json(docs);
      } else {
         res.status(400).json({"error": err});
      }
   });
})
 
// Route to Add a Person
app.post("/api/note/add", (req, res) => {
   let note = new noteModel(req.body);
   
   note.save((err, result) => {
      if (!err) {
         delete result._doc.__v;
         res.json(result._doc);
      } else {
         res.status(400).json({"error": err});
      }
   });
})

 
app.listen(PORT, () => {
   console.log(app.get("env").toUpperCase() + " Server started on port " + (PORT));
});