//Toggle the dropdowns when clicked
$('.expand').click(function() {
  var info = $(this).parent().next();
  if (info.css('display') == 'none') {
    $(this).text('[-]');
  } else {
    $(this).text('[+]');
  }
  info.slideToggle(200);
});

$('#valid').attr('href', 'http://validator.w3.org/check?uri=' +
    encodeURIComponent(location.href));