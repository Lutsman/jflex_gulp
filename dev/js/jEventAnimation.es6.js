'use strict';

(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD (Register as an anonymous module)
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node/CommonJS
    module.exports = factory(require('jquery'));
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function ($) {
  class JEventAnimationController {
    constructor(options) {
      this.listenedBlock = options.listenedBlock || document.body;
      this.$elements = $(0);
      this.events = {
        refresh: 'jEventAnimation:refreshEl',
        refreshStart: 'jEventAnimation:refreshStart',
        inView: 'jEventAnimation:inView',
        inViewFirstTime: 'jEventAnimation:inViewFirstTime',
        outOfView: 'jEventAnimation:outOfView',
        outOfViewFirstTime: 'jEventAnimation:outOfViewFirstTime',
        animateStart: 'jEventAnimation:animateStart',
        animateEnd: 'jEventAnimation:animateEnd'
      };
      this.class = {
        infinite: 'js__jeventanimation-infinite',
        animated: 'js__jeventanimation-animated',
        animating: 'js__jeventanimation-animating',
        animatedCss: 'animated',
        animateJs: 'js__jeventanimation-js',
        animateJsNumber: 'js__jeventanimation-number',
        inView: 'js__jeventanimation-inview'
      };

      this.init();
    }

    init() {
      this._onScroll = this.update.bind(this, null);
      this._onRefresh = this.refreshHandler.bind(this);

      $(window).on('scroll', this._onScroll);
      $(this.listenedBlock).on(this.events.refresh, this._onRefresh);
    }

    runAnimation(el) {
      $(el).each((index, currEl) => {
        let $currEl = $(currEl);

        if ($currEl.hasClass(this.class.animated) && !$currEl.hasClass(this.class.infinite)) return;
        if ($currEl.hasClass(this.class.animating)) return;

        if ($currEl.hasClass(this.class.animateJsNumber)) {
          this.animateNumber(currEl);
        } else if ($currEl.hasClass(this.class.animateJs)) {
          this.animateJs(currEl);
        } else {
          this.animateCss(currEl);
        }
      });
    }

    getJsAnimation(el) {
      for (let i = 0; i < animationJs.length; i++) {
        if ($(el).hasClass(animationJs[i].name)) {
          return animationJs[i];
        }
      }

      return null;
    }

    prepareJsAnimatedEl(el) {
      $(el).each((i, currEl) => {
        let $currEl = $(currEl);
        let currAnimation = this.getJsAnimation($currEl);

        if (currAnimation.hideOnStart) {
          $currEl.hide();
        } else {
          $currEl.show();
        }
      });
    }

    animateJs(el) {
      $(el).each((i, currEl) => {
        let $currEl = $(currEl);
        let currAnimation = this.getJsAnimation($currEl);
        let delay = parseFloat($currEl.attr('data-animation-delay'));
        let speed = parseFloat($currEl.attr('data-animation-speed'));

        if (!currAnimation) return;

        this.prepareJsAnimatedEl(currEl);
        $currEl.addClass(this.class.animating);

        if (delay) {
          setTimeout(() => {
            currAnimation.method($currEl, speed);
            $currEl
              .trigger(this.events.animateStart, [currEl, this])
              .delay(speed || currAnimation.speed)
              .removeClass(this.class.animating)
              .trigger(this.events.animateEnd, [currEl, this]);
          }, delay);
        } else {
          currAnimation.method($currEl, speed);
          $currEl
            .trigger(this.events.animateStart, [currEl, this])
            .delay(speed || currAnimation.speed)
            .removeClass(this.class.animating)
            .trigger(this.events.animateEnd, [currEl, this]);
        }

        $currEl.addClass(this.class.animated);
      });
    }

    animateNumber(el) {
      $(el).each((i, currEl) => {
        let $currEl = $(currEl);

        $currEl
          .addClass(this.class.animating)
          .trigger(this.events.animateStart, [currEl, this])
          .prop('animator', 0)
          .animate(
            {animator: $currEl.text()},
            {
              duration: 2000,
              easing: 'swing',
              step: (now) => {
                $currEl.text(Math.ceil(now));
              },
              complete: () => {
                $currEl
                  .addClass(this.class.animated)
                  .removeClass(this.class.animating)
                  .trigger(this.events.animateEnd, [currEl, this]);
              }
            });
      });
    }

    animateCss(el) {
      $(el).each((i, currEl) => {
        let $currEl = $(currEl);
        let delay = parseFloat($currEl.attr('data-animation-delay'));
        let speed = parseFloat($currEl.attr('data-animation-speed'));

        if (speed) {
          currEl.style.animationDuration = speed + 's';
        }

        if (delay) {
          currEl.style.animationDelay = delay + 's';
        }


        /*if (!$currEl.hasClass(this.class.animated)) {
          $currEl.addClass(this.class.animated);
        }

        if (!$currEl.hasClass(this.class.animatedCss)) {
          $currEl.addClass(this.class.animatedCss);
        }*/

        //let animationName = $currEl.css('animation-name');

        $currEl
          //.removeClass(animationName)
          .addClass(this.class.animating)
          .addClass(this.class.animatedCss)
          //.addClass(animationName)
          .delay(parseFloat(getComputedStyle(currEl).animationDelay) * 1000)
          .trigger(this.events.animateStart, [currEl, this])
          .delay(parseFloat(getComputedStyle(currEl).animationDuration) * 1000)
          //.css('animation-name',  '')
          .addClass(this.class.animated)
          .removeClass(this.class.animating)
          .trigger(this.events.animateEnd, [currEl, this]);
      });
    }

    update(el) {
      $(el || this.$elements).each((i, currEl) => {
        if (this.isInView(currEl, true)) {
          this.runAnimation(currEl);
        }
      });
    }

    isInView(el, firstTime) {
      let coords = this.getCoords(el);
      let clientHeight = document.documentElement.clientHeight;
      let scrollHeight = Math.max(
        document.body.scrollHeight, document.documentElement.scrollHeight,
        document.body.offsetHeight, document.documentElement.offsetHeight,
        document.body.clientHeight, document.documentElement.clientHeight
      );
      let viewport = {
        top: window.pageYOffset,
        bottom: window.pageYOffset + clientHeight
      };
      if ((coords.bottom > viewport.top && coords.bottom <= viewport.bottom) &&
        (coords.top >= viewport.top && coords.top < viewport.bottom)) {
        $(el).trigger(this.events.inView, [el, this]);

        if (!el.classList.contains(this.class.inView)) {
          $(el).trigger(this.events.inViewFirstTime, [el, this]);
        }

        if (firstTime && el.classList.contains(this.class.inView)) {
          return false;
        }

        el.classList.add(this.class.inView);
        return true;
      }

      if (el.classList.contains(this.class.inView)) {
        $(el).trigger(this.events.outOfViewFirstTime, [el, this]);
        el.classList.remove(this.class.inView);
      }

      $(el).trigger(this.events.outOfView, [el, this]);

      return false;
    }

    refreshEl(el) {
      $(el).each((i, currEl) => {
        $(currEl)
          .removeClass(this.class.animated)
          .removeClass(this.class.inView)
          .removeClass(this.class.animatedCss)
          .trigger(this.events.refreshStart, [currEl, this]);

        if (this.isInView(currEl)) {
          this.runAnimation(currEl);
        }
      });
    }

    refreshHandler(e) {
      let target = e.target;

      if (!this.$elements.is(target)) return;

      this.refreshEl(target);
    }

    addElement(newEl, options) {
      let $newEl = $(newEl);

      $newEl.each((i, currEl) => {
        let $currEl = $(currEl);
        let jsAnimation = this.getJsAnimation(currEl);

        if (typeof options === 'object') {
          if (options.infinite) {
            $currEl.addClass(this.class.infinite);
          }
        }

        if (jsAnimation) {
          $currEl.addClass(this.class.animateJs);
        }

        this.$elements = this.$elements.add($currEl);

        this.update(currEl);
      });
    }

    removeElement(el) {
      let $el = $(el);

      if (typeof this.$elements !== $) return;

      this.$elements = this.$elements.not($el);

      this.cleanEl($el);
    }

    cleanEl(el) {
      let $el = $(el);

      for (let className in this.class) {
        $el.removeClass(this.class[className]);
      }
    }


    stop() {
      $(window).off('scroll', this._onScroll);
      $(this.listenedBlock).off(this.events.refresh, this._onRefresh);
    }

    start() {
      $(window).on('scroll', this._onScroll);
      $(this.listenedBlock).on(this.events.refresh, this._onRefresh);
    }

    destroy() {
      this.stop();

      this.cleanEl(this.$elements);
      this.$elements.each((i, el) => {
        el.jEventAnimation = null;
      });

      this.deleteObj(animator);
      animator = null;
    }

    deleteObj(obj) {
      for (let prop in obj) {
        if (typeof obj[prop] === 'object') {
          this.deleteObj(obj[prop]);
        }

        delete obj[prop];
      }
    }

    getSelf() {
      return this;
    }

    getCoords(elem) {
      let box = elem.getBoundingClientRect();

      return {
        top: box.top + window.pageYOffset,
        bottom: box.bottom + window.pageYOffset,
        left: box.left + window.pageXOffset,
        right: box.right + window.pageXOffset
      };
    }

    addJsAnimation(animation) {
      let newAnimation = $.extend({}, DefaultAnimation, animation);
      animationJs.push(newAnimation);

      this.$elements.each((i, currEl) => {
        let $currEl = $(currEl);

        if ($currEl.hasClass(newAnimation.name)) {
          $currEl.addClas(this.class.animateJs);
        }
      });
    }
  }

  const DefaultAnimation = {
    name: '',
    hideOnStart: false,
    speed: 400,
    method: function (element, speed) {

    }
  };

  let animationJs = [
    {
      name: 'fadeIn',
      hideOnStart: true,
      speed: 400,
      method: function (element, speed) {
        speed = speed || this.speed;

        $(element).fadeIn(speed);
      }
    },
    {
      name: 'fadeOut',
      hideOnStart: false,
      speed: 400,
      method: function (element, speed) {
        speed = speed || this.speed;

        $(element).fadeOut(speed);
      }
    },
    {
      name: 'slideDown',
      hideOnStart: true,
      speed: 400,
      method: function (element, speed) {
        speed = speed || this.speed;

        $(element).slideDown(speed);
      }
    },
    {
      name: 'slideUp',
      hideOnStart: false,
      speed: 400,
      method: function (element, speed) {
        speed = speed || this.speed;

        $(element).slideUp(speed);
      }
    }
  ];

  let animator = null;

  $.fn.jEventAnimation = function () {
    let _ = this;
    let options = arguments[0] || {};
    let args = Array.prototype.slice.call(arguments, 1);

    if (!_.length) return;

    if (!animator) {
      animator = new JEventAnimationController({});
    }

    if (typeof options === 'object') {
      animator.addElement(_, options);

      for (let i = 0; i < _.length; i++) {
        _[i].jEventAnimation = animator;
      }
    } else {
      for (let i = 0; i < _.length; i++) {
        let result = _[i].jEventAnimation[options].call(_[i].jEventAnimation, args);

        if (typeof result !== 'undefined') return result;
      }

    }

    return _;
  };
}));


/*
jQuery(document).ready(function ($) {
  /!*init*!/
  let $animatedEl = $('.js__jeventanimation');

  $animatedEl.jEventAnimation();
});*/
