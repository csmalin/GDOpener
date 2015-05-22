$(function(){

  var socket = io();

  var triggerDoor = function() {
    $.ajax({
      url: '/toggle',
      method: "PUT"
    });
  };

  socket.on('doorStatus', function(data){
    var newRecord = data['newRecord'];
    var li = '<li><span>' + newRecord['created_at'] + '</span><span>' + newRecord['action'] + '</span></li>';
    $('.row.history ul').prepend(li);
    $('.percentage-slider').toggleClass('hidden', data.isOpen);
    $('button.gdopener').text((data.isOpen ? 'Go!' : 'Open!'));
    $('.status').text("State: " + (data.isOpen ? "Open" : "Closed"));
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
