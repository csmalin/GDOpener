module.exports =  function(server) {
  var db = require('./db');
  var moment = require('moment-timezone');
  debugger;
  /**
   * Setup GPIO
   */
  var GPIO = require('onoff').Gpio;
  var garageDoorReedSwitch = new GPIO(4, 'in', 'both');
  var kitchenDoorReedSwitch = new GPIO(5, 'in', 'both');
  var patioDoorReedSwitch = new GPIO(6, 'in', 'both');

  /**
   * Create Socket
   */
  var io = require('socket.io')(server);

  /**
   * Get the current state upon initialization
   */
  var doorState = [ garageDoorReedSwitch.readSync(),
                    kitchenDoorReedSwitch.readSync(),
                    patioDoorReedSwitch.readSync() ]

  /**
   * After we've inserted a change into the database, we need to get the last
   * record and emit it via the socket.
   */
  var emitChange = function(id){
    db.get(("SELECT * FROM gd_statuses WHERE ID=" + id + ";"), function(err, data) {
      data.CREATED_AT = moment(data.CREATED_AT).tz("America/Los_Angeles").format("MMMM Do YYYY, h:mm:ss a");
      io.emit('doorStatus', data);
    });
  };

  /**
   * Insert the state change into the database
   */
  var dbInsert = function(doorID, doorState) {
    var sqlRequest = "INSERT INTO gd_statuses (DOOR_ID, STATE) " +
             "VALUES(" + doorID + "," + doorState + ")";
    db.run(sqlRequest, function(err){
      emitChange(this.lastID); });
  };

  /**
   * Callback for when state has changed, needs to make sure the state
   * actually changed because sometimes the watch listeners fire off
   * when the switch hasn't actually changed state.
   */
  var updateState = function(doorID, state){
    if (state !== doorState[doorID]) {
      dbInsert(doorID, state);
      doorState[doorID] = state;
    }
  };

  /**
   * Init listeners
   */
  garageDoorReedSwitch.watch(function(err, state){ updateState(0, state); });
  kitchenDoorReedSwitch.watch(function(err, state){ updateState(1, state); });
  patioDoorReedSwitch.watch(function(err, state){ updateState(2, state); });

}
