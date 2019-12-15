/* any element rotation function plugin */

jQuery.fn.animateRotate = function(angle, duration, easing, complete) {
  var args = jQuery.speed(duration, easing, complete);
  var step = args.step;
  return this.each(function(i, e) {
    args.complete = jQuery.proxy(args.complete, e);
    args.step = function(now) {
      jQuery.style(e, 'transform', 'rotate(' + now + 'deg)');
      if (step) return step.apply(e, arguments);
    };

    jQuery({deg: 0}).animate({deg: angle}, args);
  });
};