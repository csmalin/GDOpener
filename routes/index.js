var express = require('express');
var router = express.Router();
var GPIO = require('onoff').Gpio;
var garageDoor = new GPIO(17,'high');
var reedSwitch = new GPIO(4, 'in', 'both');
var db = require('../db');
garageDoor.writeSync(1); //Make sure the garage door doesn't open when the app starts!

/* GET home page. */
router.get('/', function(req, res, next) {
  var gdIsOpen = reedSwitch.readSync();
  db.all("SELECT * FROM gd_statuses ORDER BY created_at DESC LIMIT 10", function(err, data) {
    res.render('index', { title: 'GdOpener', gdIsOpen: gdIsOpen, history: data});
  });
});

router.put('/toggle', function(req, res, next) {
  setTimeout(function(){
    garageDoor.writeSync(0);
    setTimeout(function(){
      garageDoor.writeSync(1);
    }, 500);
  }, 500);
  res.sendStatus(200);
});

module.exports = router;
