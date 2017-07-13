'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const blogPostSchema = mongoose.Schema({
  author: {
    firstName: String,
    lastName: String
  },
  title: {type: String, required: true},
  content: {type: String},
  created: {type: Date, default: Date.now}
});


blogPostSchema.virtual('authorName').get(function() {
  return `${this.author.firstName} ${this.author.lastName}`.trim();
});

blogPostSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    author: this.authorName,
    content: this.content,
    title: this.title,
    created: this.created
  };
};

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {type: String, default: ''},
  lastName: {type: String, default: ''}
});

// don't show password with a get request
UserSchema.methods.apiRepr = function() {
  return {
    username: this.username || '',
    firstName: this.firstName || '',
    lastName: this.lastName || ''
  };
};

//  check if password is correct
UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

// create a password hash
UserSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

const BlogPost = mongoose.model('BlogPost', blogPostSchema);
const User = mongoose.model('User', UserSchema);

module.exports = {BlogPost, User};
