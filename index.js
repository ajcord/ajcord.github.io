//Stores whether the page is being printed via the in-page link
var printingFromLink = false;
//Stores the time of the last print event to prevent multiple GA events from
//being fired.
var lastPrintEvent = 0;

//Toggle the dropdowns when clicked
$('.expand').click(function() {
  var info = $(this).parent().next();
  //Change the plus/minus icon and track the event
  if (info.css('display') == 'none') {
    $(this).text('[-]');
    //Track the expansion of the section
    ga('send', 'event', $(this).parent().parent().attr('id'), 'expanded',
        $(this).parent().attr('id'));
  } else {
    $(this).text('[+]');
    //Track the collapse of the section
    ga('send', 'event', $(this).parent().parent().attr('id'), 'collapsed',
        $(this).parent().attr('id'));
  }
  //Animate the toggle with a sliding animation
  info.slideToggle(200);
});

//Generate the validator link based on the current URL
$('#valid').attr('href', 'http://validator.w3.org/check?uri=' +
    encodeURIComponent(location.href));

//Make the print link actually print the page
$('#print-link').click(function(){
  printingFromLink = true;
  window.print();
});

//Track downloads of the PDF version of the resume
$('#download-link').click(function() {
  ga('send', 'event', 'resume', 'downloaded', 'PDF');
});

//Track clicks on all outbound links
$('a[href^=http]').click(function() {
  ga('send', 'event', 'links', 'clicked',
      $(this).text() + ' - ' + $(this).attr('href'));
});



(function() {
  var afterPrint = function() {
    //Track the number of times users print the resume
    var currentTime = new Date().getTime();
    //Chrome fires the event twice for some reason. I only want it to happen
    //once, so I am excluding rapid events.
    if (currentTime - lastPrintEvent > 1000) {
      lastPrintEvent = currentTime;
      var label = '';
      if (printingFromLink) {
        label = 'via link';
      } else {
        label = 'via browser';
      }
      ga('send', 'event', 'resume', 'printed', label);
      printingFromLink = false;
    }
  };
  
  //The following code is necessary to get onafterprint working cross-browser.
  //See http://tjvantoll.com/2012/06/15/detecting-print-requests-with-javascript
  if (window.matchMedia) {
    var mediaQueryList = window.matchMedia('print');
    mediaQueryList.addListener(function(mql) {
      if (!mql.matches) {
        afterPrint();
      }
    });
  }
  window.onafterprint = afterPrint;
}());