var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var ctrlUser = require('../controllers/user');

  // GET user creation form
router.get('/user', ctrlUser.create)
  
  module.exports = router;