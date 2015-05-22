module.exports =  function(server) {
  var db = require('./db');
  var moment = require('moment-timezone');
  /**
   * Setup GPIO
   */
  var GPIO = require('onoff').Gpio;
  var reedSwitch = new GPIO(4, 'in', 'both');

  /**
   * Create Socket and start listening
   */
  var io = require('socket.io')(server);
  var isOpen = reedSwitch.readSync() === 0;

  reedSwitch.watch(function(err, value){
    value = (value === 0);
    if (value !== isOpen) {
      sqlRequest = "INSERT INTO 'gd_statuses' (action) " +
             "VALUES('" + (isOpen ? 0 : 1) + "')";
      isOpen = value;
      db.run(sqlRequest, function(err){
        db.get(("SELECT * FROM gd_statuses WHERE id=" + this.lastID + ";"), function(err, data) {
          data.created_at = moment(data.created_at).tz("America/Los_Angeles").format("MMMM Do YYYY, h:mm:ss a");
          data.action = data.action === 0 ? "closed" : "opened";
          io.emit('doorStatus', {'isOpen': isOpen, 'newRecord': data});
        });
      });
    }

  });
}

