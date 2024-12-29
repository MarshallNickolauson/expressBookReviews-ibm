const express = require('express');
const jwt = require('jsonwebtoken');
let books = require('./booksdb.js');
const regd_users = express.Router();

let users = [{ username: 'John', password: '123' }];

const isValid = (username) => {
    return users.filter((user) => user.username == username).length === 0;
};

const authenticatedUser = (username, password) => {
    return (
        users.filter(
            (user) => user.username === username && user.password === password
        ).length > 0
    );
};

//only registered users can login
regd_users.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password)
        return res.status(404).json({ message: 'Error logging in' });

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign(
            {
                data: password,
            },
            'access',
            { expiresIn: 60 * 60 }
        );

        req.session.authorization = {
            accessToken, username
        }

        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(401).json({ message: "Invalid Login. Check username and password" });
    }
});

regd_users.put('/auth/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization?.username;
    const review = req.body.review;

    console.log(req.session)
    console.log(req.params.isbn)

    if (!username) {
        return res.status(401).json({ message: 'User not logged in' });
    }

    if (!books[isbn]) {
        return res.status(404).json({ message: 'Book not found' });
    }

    if (!review) {
        return res.status(400).json({ message: 'Review content missing' });
    }

    const book = books[isbn];
    if (!book.reviews) {
        book.reviews = {};
    }

    book.reviews[username] = review;

    return res.status(200).json({ message: 'Review successfully added/updated', reviews: book.reviews });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.authenticatedUser = authenticatedUser;
