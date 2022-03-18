

const tomorrow = new Date(document.querySelector("input#countdown").value)
tomorrow.setDate(tomorrow.getDate() + 1)
// Update the count down every 1 second
var x = setInterval(function() {

  // Get today's date and time
  var now = new Date().getTime();
    
  // Find the distance between now and the count down date
  var distance = tomorrow - now;
    
  // Time calculations for days, hours, minutes and seconds
  var hours = Math.floor((distance % (1000 * 60 * 60 * 12)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);
  hours = ("00" + hours).slice(-2);
  minutes = ("00" + minutes).slice(-2);
    seconds = ("00" + seconds).slice(-2);
    
    document.querySelector("span#hour").innerHTML = hours;
    document.querySelector("span#minute").innerHTML = minutes;
    document.querySelector("span#second").innerHTML = seconds;

   
}, 1000);
    
