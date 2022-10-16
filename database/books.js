const { Schema, model } = require('mongoose');

const BooksSchema = new Schema({
    book_title: String,
    book_search_title: String,
    book_description: String,
    book_author: String,
    upload_date: Number,
});

module.exports = model("books", BooksSchema);