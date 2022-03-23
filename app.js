require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const mongoURL = 'mongodb+srv://admin-shubham:' + process.env.PASSWORD + '@cluster0.hkzz7.mongodb.net/wikiDB';

mongoose.connect(mongoURL);

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model('Article', articleSchema);

app.route('/articles')
    .get((req, res) => {
        Article.find((err, foundArticles) => {
            if (!err) {
                res.send(foundArticles);
            }
        });
    })
    .post((req, res) => {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        newArticle.save((err) => {
            if (!err) {
                res.send("successfully saved");
            }
        });
    })
    .delete((req, res) => {
        Article.deleteMany({}, (err) => {
            if (!err) {
                res.send("successfully deleted");
            }
        });
    });


app.route("/articles/:articleTitle")
    .get((req, res) => {
        Article.find({ title: req.params.articleTitle }, (err, foundArticles) => {
            if (!err) {
                res.send(foundArticles);
            }
        });
    })
    .put((req, res) => {
        Article.replaceOne({ title: req.params.articleTitle }, {
            title: req.body.title,
            content: req.body.content
        }, (err) => {
            if (!err) {
                res.send("successfully updated");
            } else {
                res.send("failed" + err);
            }
        });
    })
    .patch((req, res) => {
        Article.updateOne({ title: req.params.articleTitle }, { $set: req.body }, (err) => {
            if (!err) {
                res.send("successfully updated");
            }
        });
    })
    .delete((req, res) => {
        Article.deleteOne({ title: req.params.articleTitle }, (err) => {
            if (!err) {
                res.send("Successfully deleted");
            }
        });
    });

app.listen(process.env.PORT || 3000, () => {
    console.log("server is running on port 3000");
});