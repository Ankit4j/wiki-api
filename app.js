const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

////////////////////Request targeting all articles///////////////

app.route("/articles")

.get(function(req, res) {
    Article.find({}).then((results) => {
        res.send(results);
    }).catch((err) => {
        res.send(err);
    });
})

.post(function(req, res) {

    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    })
    
    newArticle.save().then(() => {
        res.send("successfully added new article")
    }).catch((err) => {
        res.send(err);
    });
})

.delete(function(req, res) {
    Article.deleteMany({}).then(() => {
        res.send("successfully deleted all the articles");
    }).catch((err) => {
        res.send(err);
    });
});

////////////////////Request targeting specific article///////////////

app.route("/articles/:title")

.get(function(req, res) {
    Article.findOne({title: req.params.title}).then((resultArticle) => {
        if(resultArticle) {
        res.send(resultArticle);
        }
        else {
            res.send("no articles matching the title found")
        }
    }).catch((err) => {
        res.send(err);
    })
})

.put(function(req, res) {
    Article.replaceOne(
        {title: req.params.title},
        {title: req.body.title, content: req.body.content}
        //{overwrite: true}
    ).then(() => {
        res.send("successfully updated article");
    }).catch((err) => {
        res.send(err);
    });
})

.patch(function(req, res) {
    Article.updateOne(
        {title: req.params.title},
        {$set: req.body}
    ).then(() => {
        res.send("updated successfully")
    }).catch((err) => {
        res.send(err);
    });
})

.delete(function(req, res) {
    Article.deleteOne(
        {title: req.params.title}
    ).then(() => {
        res.send("deleted article successfully");
    }).catch((err) => {
        res.send(err);
    });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});