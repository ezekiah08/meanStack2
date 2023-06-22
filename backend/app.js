const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')

const Post = require('./model/post')

mongoose.connect("mongodb+srv://carpianojohn94:Hannahfaye%4024@cluster0.zr1o1rv.mongodb.net/node-angular?retryWrites=true&w=majority")
.then(() => {
  console.log('Connected to the database')
})
.catch(() => {
  console.log('Connection failed')
})

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
    );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save().then(createdPost => {
      res.status(201).json({
        message: "Post has been added ",
        postId: createdPost._id
      });
    });
  });

  app.get("/api/posts",(req, res, next) => {
  Post.find().then(documents => {
    res.status(200).json({
      message: "has been successfully fetch",
      posts: documents
    });
  })
});

app.delete("/api/posts/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
  res.status(200).json({mesagge: 'Post deleted'})

})
})

module.exports = app;
