$(function(){

  var socket = io();

  var triggerDoor = function() {
    $.ajax({
      url: '/toggle',
      method: "PUT"
    });
  };

  socket.on('doorStatus', function(data){
    var doorName = ['Garage', 'Kitchen', 'Patio'][data.DOOR_ID] + " Door"
    var state = ['Closed', 'Opened'][data.STATE]
    var li = '<li><span>' + doorName + '</span><span>' + state + '</span><span>' + data.CREATED_AT + '</span></li>';
    $('.row.history ul').prepend(li);
    $('.row.history ul li:last-child').remove();
    if (data.DOOR_ID === 0) {
      $('.percentage-slider').toggleClass('hidden', data.isOpen);
      $('button.gdopener').text((data.STATE ? 'Go!' : 'Open!'));
      $('.status').text("State: " + (data.STATE ? "Open" : "Closed"));
    }
  });

  $('.gdopener').on('click', function(){
    triggerDoor();
    var $slider = $('.percentage-slider');
    if (!$slider.hasClass('hide')) {
      var percentage = parseInt($('#sliderOutput').text())/100;
      if (percentage < 1) {
        var stopTime = 13500 * percentage;
        setTimeout(triggerDoor,stopTime);
      }
    }
  });
});
