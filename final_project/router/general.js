const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios').default;

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books, null,2));
});

// Get the book list available in the shop
public_users.get('async/',async (req, res) => {
  try{
    const b = await new Promise(res=> setTimeout(res(books), 100));
    res.status(200).send(JSON.stringify(b, null,2));
  } catch (error){
    res.status(500).send("unable to retrive books")
  }
  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {  
  const book = books[req.params.isbn];
  if (book)
    return res.status(200).json(book);
  else
    return res.status(404).send("Book with such number does not exist");
 });

 // Get book details based on ISBN
public_users.get('/async/isbn/:isbn',async (req, res) => {
  const book = await new Promise(res=> setTimeout(res(books[req.params.isbn]), 100));
  if (book)
    return res.status(200).json(book);
  else
    return res.status(404).send("Book with such number does not exist");
 });

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const filtered = Object.entries(books).filter(([k,v]) => v.author===req.params.author );
  if (filtered){
    return res.status(200).json(filtered);
  } else {
    return res.status(404).json({message: "No books by this author were found"});
  }
});

// Get book details based on author
public_users.get('/async/author/:author',async (req, res) => {
  
  const filtered = await new Promise((res, rej)=>
     res(Object.entries(books).filter(([k,v]) => v.author===req.params.author )));
  
  if (filtered){
    return res.status(200).json(filtered);
  } else {
    return res.status(404).json({message: "No books by this author were found"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const filtered = Object.entries(books).filter(([k,v]) => v.title===req.params.title );
  if (filtered){
    return res.status(200).json(filtered);
  } else {
    return res.status(404).json({message: "No books by this author were found"});
  }
});

// Get all books based on title
public_users.get('/async/title/:title',async (req, res) => {
  const filtered = await new Promise((res, rej)=>
  res(Object.entries(books).filter(([k,v]) => v.title===req.params.title )));

  if (filtered){
    return res.status(200).json(filtered);
  } else {
    return res.status(404).json({message: "No books by this author were found"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const book = books[req.params.isbn];
  if (book)
    return res.status(200).json(book.reviews);
  else
    return res.status(404).send("Book with such number does not exist");
});

module.exports.general = public_users;
