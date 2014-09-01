//Stores whether the page is being printed via the in-page link
var printingFromLink = false;
//Stores the time of the last print event to prevent multiple GA events from
//being fired.
var lastPrintEvent = 0;

//Toggle the dropdowns when clicked
$(".expand").click(function() {
  var info = $("." + this.parentNode.id.replace("-dropdown", "-info"));
  //Change the plus/minus icon and track the event
  if (info.css("display") == "none") {
    $(this).text("[-]");
    //Track the expansion of the section
    ga("send", "event", $(this).parent().parent().attr("id"), "expanded",
        $(this).parent().attr("id"));
  } else {
    $(this).text("[+]");
    //Track the collapse of the section
    ga("send", "event", $(this).parent().parent().attr("id"), "collapsed",
        $(this).parent().attr("id"));
  }
  //Animate the toggle with a sliding animation
  info.slideToggle({
    duration: 200,
    progress: updateMinimap
  });
});

//Generate the validator link based on the current URL
$("#valid").attr("href", "http://validator.w3.org/check?uri=" +
    encodeURIComponent(location.href));

//Make the print link actually print the page
$("#print-link").click(function(){
  printingFromLink = true;
  window.print();
});

//Track downloads of the PDF version of the resume
$("#download-link").click(function() {
  ga("send", "event", "resume", "downloaded", "PDF");
});

//Track clicks on all outbound links
$("a[href^=http]").click(function() {
  ga("send", "event", "links", "clicked",
      $(this).text() + " - " + $(this).attr("href"));
});


//Prevent the animation if the page is scrolled past the main heading
if ($(window).scrollTop() > 150) {
  $("*").css({
    animation: "none",
    opacity: "1"
  });
}


//Set up print logging
(function() {
  var afterPrint = function() {
    //Track the number of times users print the resume
    var currentTime = new Date().getTime();
    //Chrome fires the event twice for some reason. I only want it to happen
    //once, so I am excluding rapid events.
    if (currentTime - lastPrintEvent > 1000) {
      lastPrintEvent = currentTime;
      var label = "";
      if (printingFromLink) {
        label = "via link";
      } else {
        label = "via browser";
      }
      ga("send", "event", "resume", "printed", label);
      printingFromLink = false;
    }
  };
  
  //The following code is necessary to get onafterprint working cross-browser.
  //See http://tjvantoll.com/2012/06/15/detecting-print-requests-with-javascript
  if (window.matchMedia) {
    var mediaQueryList = window.matchMedia("print");
    mediaQueryList.addListener(function(mql) {
      if (!mql.matches) {
        afterPrint();
      }
    });
  }
  window.onafterprint = afterPrint;
}());


//Set up minimap if transforms are supported
if (Modernizr.csstransforms) {
  var minimap = $("#content").clone();
  minimap.attr("id", "minimap");
  $(document.body).append(minimap);
  //Unlink ALL the links!
  $("#minimap a[href]").removeAttr("href")
    .filter(":not(#valid)").css("text-decoration", "underline");
    //TODO: Scrub IDs from the copied elements?
}

var isDraggingMinimap = false;
var heightOffset = 0;
var initialScroll = 0;
var initialY = 0;

function updateMinimap() {
  //Move the viewport as well as the minimap itself if needed.
  var heightDiff = 0.25 * $(document).height() - $(window).height();
  var scrollPercent = $(window).scrollTop() / ($(document).height() - $(window).height());
  if (heightDiff > 0) {
    heightOffset = -heightDiff * scrollPercent;
  } else {
    //Don't move the minimap if it's not necessary
    heightOffset = 0;
  }
  $("#minimap").css("top", Math.floor(heightOffset) + "px");
  var scrollDistance = 0.25 * $(window).scrollTop();
  $("#minimap-viewport").css("top", (heightOffset + scrollDistance) + "px");
}

$(window).on("resize", updateMinimap);

$(document).on("scroll", function() {
  updateMinimap();
});

$("#minimap-viewport")
  .on("mousedown", function(event) {
    event.preventDefault();
    isDraggingMinimap = true;
    initialY = event.screenY;
    initialScroll = $(window).scrollTop();
  })
.add("#minimap")
  .on("mouseup", function() {
    isDraggingMinimap = false;
  });

$("#minimap, #minimap-viewport")
  .on("mouseleave", function(event) {
    //Cancel scroll if the mouse enters an element not in the minimap
    if (!$(event.toElement).parents("#minimap").length &&
        !$(event.toElement).is("#minimap-viewport")) {
      isDraggingMinimap = false;
    }
  })
  .on("mousemove", function(event) {
    event.preventDefault();
    //Scroll the document
    if (isDraggingMinimap) {
      window.scrollTo(0, initialScroll + 4 * (event.screenY - initialY));
    }
  });

$("#minimap").on("click", function(event) {
  //Scroll to the click
  event.preventDefault();
  var yCoord = event.clientY - heightOffset;
  var yCoordOnPage = yCoord * 4;
  //Animate to the new position
  $("body").animate({
    scrollTop: yCoordOnPage - $(window).height() / 2
  }, {
    duration: 150,
    always: function() {
      //Make sure the page is scrolled even if the animation didn't work
      //*cough* firefox *cough*
      window.scrollTo(0, yCoordOnPage - $(window).height() / 2);
    }
  });
});
