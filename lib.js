var hovercard;
Meteor.startup(function() {
  $("body").append($("<div class='hovercard'><div class='arrow'></div><div class='hovercard-content'></div></div>"));
  hovercard = $(".hovercard");
});

HoverCard = {
  hideOnClick: false,
  marginX: 1,
  marginY: 5
};

var hovercardTimeoutShow = null;
var hovercardTimeoutHide = null;
var hovercardDelayShow = 800;
var hovercardDelayHide = 400;
var hovercardIsHovered = false;
var arrowMargin = 15;
var arrowTopDefault = 20;
var arrowLeftDefault = 20;

var showHovercard = function(element, data, timeout) {

  timeout = isNaN(parseInt(timeout)) ? hovercardDelayShow : timeout;

  hovercardTimeoutShow = setTimeout(function() {

    if (!hovercardIsHovered) hideHovercard();

    var container = hovercard.find(".hovercard-content");
    var tplName = element.attr("data-hovercard");
    var tpl = Template[tplName];

    container.empty();
    Blaze.renderWithData(tpl, data, container.get(0));

    positionHovercard(element);
    hovercard.show();

  }, timeout);

}

var hideHovercard = function() {
  hovercard.hide();
}

var positionHovercard = function(element) {

  var elementOffset = element.offset();
  var elementOffsetTop = elementOffset.top;

  var placement = (element.attr("data-direction") === "horizontal") ? "right" : "top";
  hovercard.removeClass("top bottom right left");
  hovercard.addClass(placement);

  var top = "auto";
  var left = "auto";
  var right = "auto";

  if (placement === "top") {

    top = elementOffsetTop - hovercard.outerHeight() - HoverCard.marginY;

    var canBeOnTop = (elementOffsetTop - $(window).scrollTop() - HoverCard.marginY - arrowMargin > hovercard.outerHeight());
    if (canBeOnTop) {
      hovercard.removeClass("bottom").addClass("top");
    } else {
      hovercard.removeClass("top").addClass("bottom");
      top = elementOffsetTop + element.outerHeight() + HoverCard.marginY;
    }

    var arrowLeft = arrowLeftDefault;
    var canBeAlignedLeft = ($(window).width() - elementOffset.left > hovercard.outerWidth());
    if (canBeAlignedLeft) {
      hovercard.removeClass("right-float");
      left = (elementOffset.left + HoverCard.marginX);
    } else {
      right = Math.round($(window).width() - (elementOffset.left + element.outerWidth()) + HoverCard.marginX);
      var hoverCardOffsetLeft = $(window).width() - right - hovercard.outerWidth();
      arrowLeft = Math.min(elementOffset.left - hoverCardOffsetLeft + arrowLeftDefault, hovercard.outerWidth() - arrowLeftDefault);
    }
    hovercard.find(".arrow").css({ left: arrowLeft });

  } else {

    var canBeOnRight = ($(window).width() - elementOffset.left - element.outerWidth() > hovercard.outerWidth());
    if (canBeOnRight) {
      left = elementOffset.left + element.outerWidth() + HoverCard.marginX * 3;
      hovercard.removeClass("left").addClass("right");
    } else {
      hovercard.removeClass("right").addClass("left");
      right = $(window).width() - elementOffset.left + arrowMargin - HoverCard.marginX;
    }

    var arrowTop = arrowTopDefault;
    var canBeAlignedTop = ($(window).height() + $(window).scrollTop() - elementOffset.top > hovercard.outerHeight());
    if (canBeAlignedTop) {
      top = Math.max(elementOffsetTop, $(window).scrollTop()) + 2;
      arrowTop = elementOffset.top - top + element.outerHeight() / 2;
      arrowTop = Math.max(arrowTop, arrowMargin);
    } else {
      top = $(window).height() + $(window).scrollTop() - hovercard.outerHeight() - HoverCard.marginY;
      arrowTop = elementOffset.top - top + element.outerHeight() / 2;
      arrowTop = Math.min(arrowTop, hovercard.outerHeight() - arrowTopDefault);
    }
    hovercard.find(".arrow").css({ top: arrowTop });
  }

  var hovercardCSS = {
    top: top === "auto" ? top : top + "px",
    left: left === "auto" ? left : left + "px",
    right: right === "auto" ? right : right + "px"
  };

  hovercard.css(hovercardCSS);

}

var serializeData = function(raw) {

  var data = null;
  try {
    data = JSON.stringify(raw, null, 2);
  } catch(err) {}
  return data;

}

var unserializeData = function(raw) {

  var data = null;
  try {
    data = JSON.parse(raw);
  } catch(err) {}
  return data;

}

Template.body.events({
  "mouseenter [data-hovercard]": function(e, data) {

    var element = $(e.currentTarget);
    var isTriggered = (element.attr("data-trigger") !== "click");
    if (!isTriggered) return;

    data = unserializeData(element.attr("data-params")) || data;
    showHovercard(element, data);

  },
  "mouseleave [data-hovercard]": function(e, data) {

    var element = $(e.currentTarget);
    var isTriggered = (element.attr("data-trigger") !== "click");
    if (!isTriggered) return;

    clearTimeout(hovercardTimeoutShow);
    var container = $(".hovercard");
    hovercardTimeoutHide = setTimeout(function() {
      if (!hovercardIsHovered) {
        hideHovercard();
      }
    }, hovercardDelayHide);
    container.one("mouseenter", function() {
      clearTimeout(hovercardTimeoutHide);
      container.one("mouseleave", function() {
        hideHovercard();
      });
    });

  },
  "click [data-hovercard]": function(e, data) {
    hideHovercard();
    var element = $(e.currentTarget);
    var isTriggered = (element.attr("data-trigger") === "click");
    if (!isTriggered) return;
    e.preventDefault();

    data = unserializeData(element.attr("data-params")) || data;
    showHovercard(element, data, 0);
  },
  "click": function(e, data) {
    hideHovercard();
  },
  "click .hovercard": function(e, data) {
    e.stopPropagation();
    if (!HoverCard.hideOnClick) return;
    hovercardIsHovered = false;
    hideHovercard();
  },
  "click .hovercard a": function(e, data) {
    hovercardIsHovered = false;
    hideHovercard();
  },
  "mouseenter .hovercard": function(e, data) {
    hovercardIsHovered = true;
  },
  "mouseleave .hovercard": function(e, data) {
    hovercardIsHovered = false;
  },
});

Template.hovercard.rendered = function() {
  var tpl = this;
  var element = $(tpl.firstNode.nextSibling);
  element.attr("data-hovercard", tpl.data.template);
  element.attr("data-direction", tpl.data.direction || "y");
  element.attr("data-trigger", tpl.data.trigger || "hover");

  var data = serializeData(tpl.data.data);
  element.attr("data-params", data);
}
