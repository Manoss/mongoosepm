var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Project = mongoose.model('Project');

/* GET home page. */
router.get('/project', function(req, res, next) {
    res.render('index', { title: 'Express' });
  });
  
  module.exports = router;