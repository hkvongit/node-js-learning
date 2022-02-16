const express = require("express");
const mongoose = require("mongoose");
const PORT = 3303;
const MONGOURL = "localhost:27017";

var app = express();
var bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// Documentation: https://mongoosejs.com/docs/index.html
mongoose.connect(`mongodb://${MONGOURL}/todo_app_db`);
const Schema = mongoose.Schema;

const TodoSchema = new Schema({
  content: String,
  author: String,
  time: { type: Date, default: Date.now }
});

const TodoModel = mongoose.model('todos', TodoSchema);

app.get('/sample', (req, res) => {
  res.send('Hello World');
})

app.get('/todos', (req, res) => {
  const query = TodoModel.find({}).select({"content": 1, "author": 1, "_id": 0})
  query.exec(function (err, docs) {
    !!err ? res.status(400).send(JSON.stringify(err)) : res.json(docs);
  })
})

app.post('/add-todo', (req, res) => {
  const { todoText } = req.body;
  const instance = new TodoModel();
  instance.content = todoText;
  instance.author = "Cat Tony"
  instance.save(function (err) {
    err && console.log("[error] - instance/save", err)
  })
  res.end
    (JSON.stringify({ message: "Accepted todo", todoText: req.body.todoText }))
})

app.listen(PORT, console.log(`listening at ${PORT}`))
