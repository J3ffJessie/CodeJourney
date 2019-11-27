//jshint esversion:6

//declaring dependencies
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

//setting each page with some basic content that will automatically get loaded.  Change these when actually ready to push this live.
const homeStartingContent = "Welcome to My Journey! I am happy you are here, and I hope that some of my content helps you learn or at least motivates you to push further along in your own journey.";
const aboutContent = "";
const contactContent = "";

//declaring the app module
const app = express();

//set the view engine to use EJS
app.set('view engine', 'ejs');

//telling express to use bodyParser and static files for access to the CSS
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//setup for the database connection
mongoose.connect("mongodb+srv://admin-Jeff:breanna1@blogproject-ttedr.mongodb.net/myBlogDB", { 
  useNewUrlParser: true,
  useUnifiedTopology: true
});


//framework for the blog posts and the schema
const postSchema = {
  title: String,
  content: String
};
//build the new mongoose model based on the post schema
const Post = mongoose.model("Post", postSchema);

//home route and the posts being found to display from the compose route
app.get("/", function (req, res) {

  Post.find({}, function (err, posts) {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
    });
  });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  //saving the posts to the database and re-routing to the home route
  post.save(function (err) {
    if (!err) {
      res.redirect("/");
    }
  });
});
//getting the posts from the DB based off of the _id of the post to display on its own page
app.get("/posts/:postId", function (req, res) {

  const requestedPostId = req.params.postId;

  Post.findOne({
    _id: requestedPostId
  }, function (err, post) {
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });

});

app.get("/about", function (req, res) {
  res.render("about", {
    aboutContent: aboutContent
  });
});

app.get("/contact", function (req, res) {
  res.render("contact", {
    contactContent: contactContent
  });
});


let port = process.env.PORT;
if(port == null || port == ""){
  port=3000;
}
app.listen(port, function(){
  console.log("Server has started successfully");
});