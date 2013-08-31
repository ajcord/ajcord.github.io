//Toggle the dropdowns when clicked
$('.expand').click(function() {
  $(this).parent().next().toggle(200);
  if ($(this).parent().next(':hidden').length) {
    $(this).text('[expand]');
  } else {
    $(this).text('[collapse]');
  }
});