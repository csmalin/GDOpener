module.exports = function() {
  var config = require('config');
  var sensorIDs = config.get('sensors');
  var twilioConfig = config.get('twilio');
  var twilioClient = require('twilio')(twilioConfig.accountSID, twilioConfig.authToken);

  var notify = function(doorID, state) {
    twilioClient.sendMessage({
      to: '+13865667799',
      from: '+13867537338',
      body: "The " + sensorIDs[doorID] + " door was " + (state === 0 ? "closed" : "opened") + "."
    }, function(err, responseData){
      if(!err) {
        console.log(responseData.from);
        console.log(responseData.body);
      }
    })
  }

  return {
    notify: notify
  }
}
