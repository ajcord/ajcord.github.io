//Toggle the dropdowns when clicked
$('.expand').click(function() {
  var info = $(this).parent().next();
  //Change the plus/minus icon
  if (info.css('display') == 'none') {
    $(this).text('[-]');
  } else {
    $(this).text('[+]');
  }
  //Animate the toggle with a sliding animation
  info.slideToggle(200);
});

//Generate the validator link based on the current URL
$('#valid').attr('href', 'http://validator.w3.org/check?uri=' +
    encodeURIComponent(location.href));

//Make the print link actually print the page
$('#print-link').click(function(){print()});