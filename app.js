const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");

const articlesSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model("Article", articlesSchema);

// Request asking for all articles

app.get("/", (req, res)=>{
    res.redirect("/articles")
});

app.route("/articles")

.get(function(req, res) {
    Article.find(function(err, foundArticles){
        if(!err){
            res.send(foundArticles);
        } else {
            res.send(err);
        }
    });
})

.post(function(req, res) {
    console.log(req.body.title);
    consolte.log(req.body.content);

    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save(function(err){
        if(!err){
            res.send("Successfully added a new article");
        } else {
            res.send(err);
        }
    });
})

.delete(function(req, res){

    Article.deleteMany(function(err){
        if (!err) {
            res.send("Succesfully deleted all articles");
        } else {
            res.send(err);
        }
    });
});

// Request asking for a specific article

app.route("/articles/:titleArticle")

.get(function(req, res) {

    Article.findOne( {title: req.params.titleArticle}, function(err, foundArticle){

        if (foundArticle) {
            res.send(foundArticle);
        } else {
            res.send("No article with that title was found")
        }
    });
})

.put(function(req, res){

    Article.update(
        {title: req.params.titleArticle},
        {title: req.body.title, content: req.body.content}, 
        {overwrite: true},
        function(err){

            if (!err) {
                res.send("Successfully updated article")
            } else {
                res.send(err);
            }
        }
    )    

});

app.listen(3000, () => {
    console.log("Server started on port 3000");
  });