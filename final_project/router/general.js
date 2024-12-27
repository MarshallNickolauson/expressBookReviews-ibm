const express = require('express');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();

public_users.post('/register', (req, res) => {
    //Write your code here
    return res.status(300).json({ message: 'Yet to be implemented' });
});

public_users.get('/', function (req, res) {
    return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const bookDetails = books[req.params.isbn];
    if (!bookDetails)
        return res.status(404).json({ message: 'Book not found' });
    return res.status(200).json(bookDetails);
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    for (let i = 1; i <= 10; i++) {
        const book = books[i];
        if (book.author === req.params.author) {
            return res.status(200).json(book);
        }
    }
    return res.status(404).json({ message: 'Author not found' });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    for (let i = 1; i <= 10; i++) {
        const book = books[i];
        if (book.title === req.params.title) {
            return res.status(200).json(book);
        }
    }
    return res.status(404).json({ message: 'Title not found' });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const bookDetails = books[req.params.isbn];
    if (!bookDetails)
        return res.status(404).json({ message: 'Book not found' });
    return res.status(200).json(bookDetails.reviews);
});

module.exports.general = public_users;
