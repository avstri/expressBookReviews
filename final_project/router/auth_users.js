const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  return this.users.some(u => u.username === username);
}

const authenticatedUser = (username, password) => { //returns boolean
  const match = users.find(u => u.username === username);
  return match && match.password === password;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const pwd = req.body.password;
  // console.log(`${username} ${pwd}`)
  if (!username || !pwd) {
    return res.status(404).json({ message: "Error logging in" });
  }
  if (authenticatedUser(username, pwd)) {
    const accessToken = jwt.sign({
      data: pwd
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = { accessToken, username };
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const book = books[req.params.isbn];
  if (!book) {
    return res.status(404).json({ message: "Unable to find this book" });
  }

  const username = req.session.authorization.username;
  const existingReview = book.reviews[username];
  console.log(username);
  // if (existingReview){
  //   book.reviews[req.session.username] = req.body; 
  // }
  book.reviews[username] = { "text": req.body.text };
  if (!existingReview)
    return res.status(200).json({ message: "Review Submitted" });
  else
    return res.status(200).json({ message: "Review Updated" });
});

// Add a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const book = books[req.params.isbn];
  if (!book) {
    return res.status(404).json({ message: "Unable to find this book" });
  }

  const username = req.session.authorization.username;
  //console.log(book.reviews);
  if (username in book.reviews) {
    delete book.reviews[username];
    return res.status(200).json({ message: "Review Deleted" });
  }
  else {
    return res.status(404).json({ message: "No review submitted" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
