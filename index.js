//Toggle the dropdowns when clicked
$(".expand").click(function() {
  var info = $("." + this.parentNode.id.replace("-dropdown", "-info"));
  //Change the plus/minus icon and track the event
  if (info.css("display") == "none") {
    $(this).text("[-]");
  } else {
    $(this).text("[+]");
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
