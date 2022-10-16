"use strict"

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 1;

const express = require("express");
const app = express();
const urlencoded = require('body-parser').urlencoded({ extended: false });
const mongoose = require('./mongoConnection');
const books = require('./database/books');
const mongo = require('mongoose');

let port = 80;

mongoose.init();

app.listen(port, () => console.log("http://localhost:" + port));

app.set("etag", false);
app.set('view engine', "ejs");

app.use(express.static(__dirname + "/views"));
app.use(urlencoded);

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.get("/books", (req, res) => {
    res.render("books.ejs");
});

app.get("/upload", (req, res) => {
    res.render("upload.ejs");
});

app.post("/books", async (req, res) => {
    let request = req.body.searchbar;
    var requestCorrecred = request.toLowerCase().split(" ").join("_");

    books.findOne({
        book_search_title: requestCorrecred
    }, (err, data) => {
        if (err) throw new Error("Something Happened. Please Try Again.");
        if (!data) return res.render("404.ejs");
        res.redirect(`/books/${data._id}`);
    });
});

app.get("/books/:id?", async (req, res) => {
    let bookId = req.params.id;

    if(!mongo.Types.ObjectId.isValid(bookId)) return res.render("404.ejs");

    var data = await books.findOne({
        _id: bookId
    });

    if (!data) return res.render("404.ejs");

    let actualDate = new Date(data.upload_date)
    const uploadDate = actualDate.toDateString();

    let args = {
        data: data,
        bookTitle: data.book_title,
        bookAuthor: data.book_author,
        bookDescription: data.book_description,
        bookUploadDate: uploadDate
    };

    res.render("book.ejs", args);
});

app.post("/upload", (req, res) => {
    let description = req.body.description;
    var title = req.body.title;

    if (description == null || description == '' || description == undefined) description = "No Description";

    books.findOne({
        book_search_title: title.toLowerCase().split(" ").join("_"),
    }, (err, data) => {
        if (err) throw new Error("Something Happened. Please Try Again.");
        if (data) return res.send("This Book Name Already Exist.")
        new books({
            book_title: title,
            book_search_title: title.toLowerCase().split(" ").join("_"),
            book_author: req.body.author,
            book_description: description,
            upload_date: Date.now(),
        }).save();

        res.send(`<h1>Book Submitted Successfully.</h1>\
    <a href="/upload">Back to upload Page.</a>`);
    });
});

app.all("*", (req, res) => {
    res.status(404).render("404.ejs");
});

/* ERROR HANDLING */

process.on("uncaughtException", (err, origin) => {
    console.log("*********** NEW ERROR ***********");
    console.error(err);
    console.error(origin);
    console.log("*******************************");
});

process.on("unhandledRejection", (reason, promise) => {
    console.log("*********** NEW ERROR ***********");
    console.error(reason);
    console.log(promise);
    console.log("*******************************");
});

process.on("multipleResolves", (type, promise) => {
    console.log("*********** NEW ERROR ***********");
    console.error(type);
    console.error(promise);
    console.log("*******************************");
});

process.on("uncaughtExceptionMonitor", (err, origin) => {
    console.log("*********** NEW ERROR ***********");
    console.error(err);
    console.error(origin);
    console.log("*******************************");
});