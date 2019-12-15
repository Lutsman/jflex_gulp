'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD (Register as an anonymous module)
    define(['jquery'], factory);
  } else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {
    // Node/CommonJS
    module.exports = factory(require('jquery'));
  } else {
    // Browser globals
    factory(jQuery);
  }
})(function ($) {
  var JEventAnimationController = function () {
    function JEventAnimationController(options) {
      _classCallCheck(this, JEventAnimationController);

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

    _createClass(JEventAnimationController, [{
      key: 'init',
      value: function init() {
        this._onScroll = this.update.bind(this, null);
        this._onRefresh = this.refreshHandler.bind(this);

        $(window).on('scroll', this._onScroll);
        $(this.listenedBlock).on(this.events.refresh, this._onRefresh);
      }
    }, {
      key: 'runAnimation',
      value: function runAnimation(el) {
        var _this = this;

        $(el).each(function (index, currEl) {
          var $currEl = $(currEl);

          if ($currEl.hasClass(_this.class.animated) && !$currEl.hasClass(_this.class.infinite)) return;
          if ($currEl.hasClass(_this.class.animating)) return;

          if ($currEl.hasClass(_this.class.animateJsNumber)) {
            _this.animateNumber(currEl);
          } else if ($currEl.hasClass(_this.class.animateJs)) {
            _this.animateJs(currEl);
          } else {
            _this.animateCss(currEl);
          }
        });
      }
    }, {
      key: 'getJsAnimation',
      value: function getJsAnimation(el) {
        for (var i = 0; i < animationJs.length; i++) {
          if ($(el).hasClass(animationJs[i].name)) {
            return animationJs[i];
          }
        }

        return null;
      }
    }, {
      key: 'prepareJsAnimatedEl',
      value: function prepareJsAnimatedEl(el) {
        var _this2 = this;

        $(el).each(function (i, currEl) {
          var $currEl = $(currEl);
          var currAnimation = _this2.getJsAnimation($currEl);

          if (currAnimation.hideOnStart) {
            $currEl.hide();
          } else {
            $currEl.show();
          }
        });
      }
    }, {
      key: 'animateJs',
      value: function animateJs(el) {
        var _this3 = this;

        $(el).each(function (i, currEl) {
          var $currEl = $(currEl);
          var currAnimation = _this3.getJsAnimation($currEl);
          var delay = parseFloat($currEl.attr('data-animation-delay'));
          var speed = parseFloat($currEl.attr('data-animation-speed'));

          if (!currAnimation) return;

          _this3.prepareJsAnimatedEl(currEl);
          $currEl.addClass(_this3.class.animating);

          if (delay) {
            setTimeout(function () {
              currAnimation.method($currEl, speed);
              $currEl.trigger(_this3.events.animateStart, [currEl, _this3]).delay(speed || currAnimation.speed).removeClass(_this3.class.animating).trigger(_this3.events.animateEnd, [currEl, _this3]);
            }, delay);
          } else {
            currAnimation.method($currEl, speed);
            $currEl.trigger(_this3.events.animateStart, [currEl, _this3]).delay(speed || currAnimation.speed).removeClass(_this3.class.animating).trigger(_this3.events.animateEnd, [currEl, _this3]);
          }

          $currEl.addClass(_this3.class.animated);
        });
      }
    }, {
      key: 'animateNumber',
      value: function animateNumber(el) {
        var _this4 = this;

        $(el).each(function (i, currEl) {
          var $currEl = $(currEl);

          $currEl.addClass(_this4.class.animating).trigger(_this4.events.animateStart, [currEl, _this4]).prop('animator', 0).animate({ animator: $currEl.text() }, {
            duration: 2000,
            easing: 'swing',
            step: function step(now) {
              $currEl.text(Math.ceil(now));
            },
            complete: function complete() {
              $currEl.addClass(_this4.class.animated).removeClass(_this4.class.animating).trigger(_this4.events.animateEnd, [currEl, _this4]);
            }
          });
        });
      }
    }, {
      key: 'animateCss',
      value: function animateCss(el) {
        var _this5 = this;

        $(el).each(function (i, currEl) {
          var $currEl = $(currEl);
          var delay = parseFloat($currEl.attr('data-animation-delay'));
          var speed = parseFloat($currEl.attr('data-animation-speed'));

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
          .addClass(_this5.class.animating).addClass(_this5.class.animatedCss)
          //.addClass(animationName)
          .delay(parseFloat(getComputedStyle(currEl).animationDelay) * 1000).trigger(_this5.events.animateStart, [currEl, _this5]).delay(parseFloat(getComputedStyle(currEl).animationDuration) * 1000)
          //.css('animation-name',  '')
          .addClass(_this5.class.animated).removeClass(_this5.class.animating).trigger(_this5.events.animateEnd, [currEl, _this5]);
        });
      }
    }, {
      key: 'update',
      value: function update(el) {
        var _this6 = this;

        $(el || this.$elements).each(function (i, currEl) {
          if (_this6.isInView(currEl, true)) {
            _this6.runAnimation(currEl);
          }
        });
      }
    }, {
      key: 'isInView',
      value: function isInView(el, firstTime) {
        var coords = this.getCoords(el);
        var clientHeight = document.documentElement.clientHeight;
        var scrollHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight);
        var viewport = {
          top: window.pageYOffset,
          bottom: window.pageYOffset + clientHeight
        };
        if (coords.bottom > viewport.top && coords.bottom <= viewport.bottom && coords.top >= viewport.top && coords.top < viewport.bottom) {
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
    }, {
      key: 'refreshEl',
      value: function refreshEl(el) {
        var _this7 = this;

        $(el).each(function (i, currEl) {
          $(currEl).removeClass(_this7.class.animated).removeClass(_this7.class.inView).removeClass(_this7.class.animatedCss).trigger(_this7.events.refreshStart, [currEl, _this7]);

          if (_this7.isInView(currEl)) {
            _this7.runAnimation(currEl);
          }
        });
      }
    }, {
      key: 'refreshHandler',
      value: function refreshHandler(e) {
        var target = e.target;

        if (!this.$elements.is(target)) return;

        this.refreshEl(target);
      }
    }, {
      key: 'addElement',
      value: function addElement(newEl, options) {
        var _this8 = this;

        var $newEl = $(newEl);

        $newEl.each(function (i, currEl) {
          var $currEl = $(currEl);
          var jsAnimation = _this8.getJsAnimation(currEl);

          if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
            if (options.infinite) {
              $currEl.addClass(_this8.class.infinite);
            }
          }

          if (jsAnimation) {
            $currEl.addClass(_this8.class.animateJs);
          }

          _this8.$elements = _this8.$elements.add($currEl);

          _this8.update(currEl);
        });
      }
    }, {
      key: 'removeElement',
      value: function removeElement(el) {
        var $el = $(el);

        if (_typeof(this.$elements) !== $) return;

        this.$elements = this.$elements.not($el);

        this.cleanEl($el);
      }
    }, {
      key: 'cleanEl',
      value: function cleanEl(el) {
        var $el = $(el);

        for (var className in this.class) {
          $el.removeClass(this.class[className]);
        }
      }
    }, {
      key: 'stop',
      value: function stop() {
        $(window).off('scroll', this._onScroll);
        $(this.listenedBlock).off(this.events.refresh, this._onRefresh);
      }
    }, {
      key: 'start',
      value: function start() {
        $(window).on('scroll', this._onScroll);
        $(this.listenedBlock).on(this.events.refresh, this._onRefresh);
      }
    }, {
      key: 'destroy',
      value: function destroy() {
        this.stop();

        this.cleanEl(this.$elements);
        this.$elements.each(function (i, el) {
          el.jEventAnimation = null;
        });

        this.deleteObj(animator);
        animator = null;
      }
    }, {
      key: 'deleteObj',
      value: function deleteObj(obj) {
        for (var prop in obj) {
          if (_typeof(obj[prop]) === 'object') {
            this.deleteObj(obj[prop]);
          }

          delete obj[prop];
        }
      }
    }, {
      key: 'getSelf',
      value: function getSelf() {
        return this;
      }
    }, {
      key: 'getCoords',
      value: function getCoords(elem) {
        var box = elem.getBoundingClientRect();

        return {
          top: box.top + window.pageYOffset,
          bottom: box.bottom + window.pageYOffset,
          left: box.left + window.pageXOffset,
          right: box.right + window.pageXOffset
        };
      }
    }, {
      key: 'addJsAnimation',
      value: function addJsAnimation(animation) {
        var _this9 = this;

        var newAnimation = $.extend({}, DefaultAnimation, animation);
        animationJs.push(newAnimation);

        this.$elements.each(function (i, currEl) {
          var $currEl = $(currEl);

          if ($currEl.hasClass(newAnimation.name)) {
            $currEl.addClas(_this9.class.animateJs);
          }
        });
      }
    }]);

    return JEventAnimationController;
  }();

  var DefaultAnimation = {
    name: '',
    hideOnStart: false,
    speed: 400,
    method: function method(element, speed) {}
  };

  var animationJs = [{
    name: 'fadeIn',
    hideOnStart: true,
    speed: 400,
    method: function method(element, speed) {
      speed = speed || this.speed;

      $(element).fadeIn(speed);
    }
  }, {
    name: 'fadeOut',
    hideOnStart: false,
    speed: 400,
    method: function method(element, speed) {
      speed = speed || this.speed;

      $(element).fadeOut(speed);
    }
  }, {
    name: 'slideDown',
    hideOnStart: true,
    speed: 400,
    method: function method(element, speed) {
      speed = speed || this.speed;

      $(element).slideDown(speed);
    }
  }, {
    name: 'slideUp',
    hideOnStart: false,
    speed: 400,
    method: function method(element, speed) {
      speed = speed || this.speed;

      $(element).slideUp(speed);
    }
  }];

  var animator = null;

  $.fn.jEventAnimation = function () {
    var _ = this;
    var options = arguments[0] || {};
    var args = Array.prototype.slice.call(arguments, 1);

    if (!_.length) return;

    if (!animator) {
      animator = new JEventAnimationController({});
    }

    if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
      animator.addElement(_, options);

      for (var i = 0; i < _.length; i++) {
        _[i].jEventAnimation = animator;
      }
    } else {
      for (var _i = 0; _i < _.length; _i++) {
        var result = _[_i].jEventAnimation[options].call(_[_i].jEventAnimation, args);

        if (typeof result !== 'undefined') return result;
      }
    }

    return _;
  };
});

/*
jQuery(document).ready(function ($) {
  /!*init*!/
  let $animatedEl = $('.js__jeventanimation');

  $animatedEl.jEventAnimation();
});*/
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpzL2pFdmVudEFuaW1hdGlvbi5lczYuanMiXSwibmFtZXMiOlsiZmFjdG9yeSIsImRlZmluZSIsImFtZCIsImV4cG9ydHMiLCJtb2R1bGUiLCJyZXF1aXJlIiwialF1ZXJ5IiwiJCIsIkpFdmVudEFuaW1hdGlvbkNvbnRyb2xsZXIiLCJvcHRpb25zIiwibGlzdGVuZWRCbG9jayIsImRvY3VtZW50IiwiYm9keSIsIiRlbGVtZW50cyIsImV2ZW50cyIsInJlZnJlc2giLCJyZWZyZXNoU3RhcnQiLCJpblZpZXciLCJpblZpZXdGaXJzdFRpbWUiLCJvdXRPZlZpZXciLCJvdXRPZlZpZXdGaXJzdFRpbWUiLCJhbmltYXRlU3RhcnQiLCJhbmltYXRlRW5kIiwiY2xhc3MiLCJpbmZpbml0ZSIsImFuaW1hdGVkIiwiYW5pbWF0aW5nIiwiYW5pbWF0ZWRDc3MiLCJhbmltYXRlSnMiLCJhbmltYXRlSnNOdW1iZXIiLCJpbml0IiwiX29uU2Nyb2xsIiwidXBkYXRlIiwiYmluZCIsIl9vblJlZnJlc2giLCJyZWZyZXNoSGFuZGxlciIsIndpbmRvdyIsIm9uIiwiZWwiLCJlYWNoIiwiaW5kZXgiLCJjdXJyRWwiLCIkY3VyckVsIiwiaGFzQ2xhc3MiLCJhbmltYXRlTnVtYmVyIiwiYW5pbWF0ZUNzcyIsImkiLCJhbmltYXRpb25KcyIsImxlbmd0aCIsIm5hbWUiLCJjdXJyQW5pbWF0aW9uIiwiZ2V0SnNBbmltYXRpb24iLCJoaWRlT25TdGFydCIsImhpZGUiLCJzaG93IiwiZGVsYXkiLCJwYXJzZUZsb2F0IiwiYXR0ciIsInNwZWVkIiwicHJlcGFyZUpzQW5pbWF0ZWRFbCIsImFkZENsYXNzIiwic2V0VGltZW91dCIsIm1ldGhvZCIsInRyaWdnZXIiLCJyZW1vdmVDbGFzcyIsInByb3AiLCJhbmltYXRlIiwiYW5pbWF0b3IiLCJ0ZXh0IiwiZHVyYXRpb24iLCJlYXNpbmciLCJzdGVwIiwibm93IiwiTWF0aCIsImNlaWwiLCJjb21wbGV0ZSIsInN0eWxlIiwiYW5pbWF0aW9uRHVyYXRpb24iLCJhbmltYXRpb25EZWxheSIsImdldENvbXB1dGVkU3R5bGUiLCJpc0luVmlldyIsInJ1bkFuaW1hdGlvbiIsImZpcnN0VGltZSIsImNvb3JkcyIsImdldENvb3JkcyIsImNsaWVudEhlaWdodCIsImRvY3VtZW50RWxlbWVudCIsInNjcm9sbEhlaWdodCIsIm1heCIsIm9mZnNldEhlaWdodCIsInZpZXdwb3J0IiwidG9wIiwicGFnZVlPZmZzZXQiLCJib3R0b20iLCJjbGFzc0xpc3QiLCJjb250YWlucyIsImFkZCIsInJlbW92ZSIsImUiLCJ0YXJnZXQiLCJpcyIsInJlZnJlc2hFbCIsIm5ld0VsIiwiJG5ld0VsIiwianNBbmltYXRpb24iLCIkZWwiLCJub3QiLCJjbGVhbkVsIiwiY2xhc3NOYW1lIiwib2ZmIiwic3RvcCIsImpFdmVudEFuaW1hdGlvbiIsImRlbGV0ZU9iaiIsIm9iaiIsImVsZW0iLCJib3giLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJsZWZ0IiwicGFnZVhPZmZzZXQiLCJyaWdodCIsImFuaW1hdGlvbiIsIm5ld0FuaW1hdGlvbiIsImV4dGVuZCIsIkRlZmF1bHRBbmltYXRpb24iLCJwdXNoIiwiYWRkQ2xhcyIsImVsZW1lbnQiLCJmYWRlSW4iLCJmYWRlT3V0Iiwic2xpZGVEb3duIiwic2xpZGVVcCIsImZuIiwiXyIsImFyZ3VtZW50cyIsImFyZ3MiLCJBcnJheSIsInByb3RvdHlwZSIsInNsaWNlIiwiY2FsbCIsImFkZEVsZW1lbnQiLCJyZXN1bHQiXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7OztBQUVDLFdBQVVBLE9BQVYsRUFBbUI7QUFDbEIsTUFBSSxPQUFPQyxNQUFQLEtBQWtCLFVBQWxCLElBQWdDQSxPQUFPQyxHQUEzQyxFQUFnRDtBQUM5QztBQUNBRCxXQUFPLENBQUMsUUFBRCxDQUFQLEVBQW1CRCxPQUFuQjtBQUNELEdBSEQsTUFHTyxJQUFJLFFBQU9HLE9BQVAseUNBQU9BLE9BQVAsT0FBbUIsUUFBdkIsRUFBaUM7QUFDdEM7QUFDQUMsV0FBT0Qs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c0YsVUFBRXRGLENBQUYsRUFBS2lFLGVBQUwsR0FBdUI1QyxRQUF2QjtBQUNEO0FBQ0YsS0FORCxNQU1PO0FBQ0wsV0FBSyxJQUFJckIsS0FBSSxDQUFiLEVBQWdCQSxLQUFJc0YsRUFBRXBGLE1BQXRCLEVBQThCRixJQUE5QixFQUFtQztBQUNqQyxZQUFJOEYsU0FBU1IsRUFBRXRGLEVBQUYsRUFBS2lFLGVBQUwsQ0FBcUJ0RyxPQUFyQixFQUE4QmlJLElBQTlCLENBQW1DTixFQUFFdEYsRUFBRixFQUFLaUUsZUFBeEMsRUFBeUR1QixJQUF6RCxDQUFiOztBQUVBLFlBQUksT0FBT00sTUFBUCxLQUFrQixXQUF0QixFQUFtQyxPQUFPQSxNQUFQO0FBQ3BDO0FBRUY7O0FBRUQsV0FBT1IsQ0FBUDtBQUNELEdBM0JEO0FBNEJELENBeGJBLENBQUQ7O0FBMmJBIiwiZmlsZSI6ImpzL2pFdmVudEFuaW1hdGlvbi5lczYuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbihmdW5jdGlvbiAoZmFjdG9yeSkge1xuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgLy8gQU1EIChSZWdpc3RlciBhcyBhbiBhbm9ueW1vdXMgbW9kdWxlKVxuICAgIGRlZmluZShbJ2pxdWVyeSddLCBmYWN0b3J5KTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAvLyBOb2RlL0NvbW1vbkpTXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJlcXVpcmUoJ2pxdWVyeScpKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBCcm93c2VyIGdsb2JhbHNcbiAgICBmYWN0b3J5KGpRdWVyeSk7XG4gIH1cbn0oZnVuY3Rpb24gKCQpIHtcbiAgY2xhc3MgSkV2ZW50QW5pbWF0aW9uQ29udHJvbGxlciB7XG4gICAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgICAgdGhpcy5saXN0ZW5lZEJsb2NrID0gb3B0aW9ucy5saXN0ZW5lZEJsb2NrIHx8IGRvY3VtZW50LmJvZHk7XG4gICAgICB0aGlzLiRlbGVtZW50cyA9ICQoMCk7XG4gICAgICB0aGlzLmV2ZW50cyA9IHtcbiAgICAgICAgcmVmcmVzaDogJ2pFdmVudEFuaW1hdGlvbjpyZWZyZXNoRWwnLFxuICAgICAgICByZWZyZXNoU3RhcnQ6ICdqRXZlbnRBbmltYXRpb246cmVmcmVzaFN0YXJ0JyxcbiAgICAgICAgaW5WaWV3OiAnakV2ZW50QW5pbWF0aW9uOmluVmlldycsXG4gICAgICAgIGluVmlld0ZpcnN0VGltZTogJ2pFdmVudEFuaW1hdGlvbjppblZpZXdGaXJzdFRpbWUnLFxuICAgICAgICBvdXRPZlZpZXc6ICdqRXZlbnRBbmltYXRpb246b3V0T2ZWaWV3JyxcbiAgICAgICAgb3V0T2ZWaWV3Rmlyc3RUaW1lOiAnakV2ZW50QW5pbWF0aW9uOm91dE9mVmlld0ZpcnN0VGltZScsXG4gICAgICAgIGFuaW1hdGVTdGFydDogJ2pFdmVudEFuaW1hdGlvbjphbmltYXRlU3RhcnQnLFxuICAgICAgICBhbmltYXRlRW5kOiAnakV2ZW50QW5pbWF0aW9uOmFuaW1hdGVFbmQnXG4gICAgICB9O1xuICAgICAgdGhpcy5jbGFzcyA9IHtcbiAgICAgICAgaW5maW5pdGU6ICdqc19famV2ZW50YW5pbWF0aW9uLWluZmluaXRlJyxcbiAgICAgICAgYW5pbWF0ZWQ6ICdqc19famV2ZW50YW5pbWF0aW9uLWFuaW1hdGVkJyxcbiAgICAgICAgYW5pbWF0aW5nOiAnanNfX2pldmVudGFuaW1hdGlvbi1hbmltYXRpbmcnLFxuICAgICAgICBhbmltYXRlZENzczogJ2FuaW1hdGVkJyxcbiAgICAgICAgYW5pbWF0ZUpzOiAnanNfX2pldmVudGFuaW1hdGlvbi1qcycsXG4gICAgICAgIGFuaW1hdGVKc051bWJlcjogJ2pzX19qZXZlbnRhbmltYXRpb24tbnVtYmVyJyxcbiAgICAgICAgaW5WaWV3OiAnanNfX2pldmVudGFuaW1hdGlvbi1pbnZpZXcnXG4gICAgICB9O1xuXG4gICAgICB0aGlzLmluaXQoKTtcbiAgICB9XG5cbiAgICBpbml0KCkge1xuICAgICAgdGhpcy5fb25TY3JvbGwgPSB0aGlzLnVwZGF0ZS5iaW5kKHRoaXMsIG51bGwpO1xuICAgICAgdGhpcy5fb25SZWZyZXNoID0gdGhpcy5yZWZyZXNoSGFuZGxlci5iaW5kKHRoaXMpO1xuXG4gICAgICAkKHdpbmRvdykub24oJ3Njcm9sbCcsIHRoaXMuX29uU2Nyb2xsKTtcbiAgICAgICQodGhpcy5saXN0ZW5lZEJsb2NrKS5vbih0aGlzLmV2ZW50cy5yZWZyZXNoLCB0aGlzLl9vblJlZnJlc2gpO1xuICAgIH1cblxuICAgIHJ1bkFuaW1hdGlvbihlbCkge1xuICAgICAgJChlbCkuZWFjaCgoaW5kZXgsIGN1cnJFbCkgPT4ge1xuICAgICAgICBsZXQgJGN1cnJFbCA9ICQoY3VyckVsKTtcblxuICAgICAgICBpZiAoJGN1cnJFbC5oYXNDbGFzcyh0aGlzLmNsYXNzLmFuaW1hdGVkKSAmJiAhJGN1cnJFbC5oYXNDbGFzcyh0aGlzLmNsYXNzLmluZmluaXRlKSkgcmV0dXJuO1xuICAgICAgICBpZiAoJGN1cnJFbC5oYXNDbGFzcyh0aGlzLmNsYXNzLmFuaW1hdGluZykpIHJldHVybjtcblxuICAgICAgICBpZiAoJGN1cnJFbC5oYXNDbGFzcyh0aGlzLmNsYXNzLmFuaW1hdGVKc051bWJlcikpIHtcbiAgICAgICAgICB0aGlzLmFuaW1hdGVOdW1iZXIoY3VyckVsKTtcbiAgICAgICAgfSBlbHNlIGlmICgkY3VyckVsLmhhc0NsYXNzKHRoaXMuY2xhc3MuYW5pbWF0ZUpzKSkge1xuICAgICAgICAgIHRoaXMuYW5pbWF0ZUpzKGN1cnJFbCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5hbmltYXRlQ3NzKGN1cnJFbCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGdldEpzQW5pbWF0aW9uKGVsKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFuaW1hdGlvbkpzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICgkKGVsKS5oYXNDbGFzcyhhbmltYXRpb25Kc1tpXS5uYW1lKSkge1xuICAgICAgICAgIHJldHVybiBhbmltYXRpb25Kc1tpXTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBwcmVwYXJlSnNBbmltYXRlZEVsKGVsKSB7XG4gICAgICAkKGVsKS5lYWNoKChpLCBjdXJyRWwpID0+IHtcbiAgICAgICAgbGV0ICRjdXJyRWwgPSAkKGN1cnJFbCk7XG4gICAgICAgIGxldCBjdXJyQW5pbWF0aW9uID0gdGhpcy5nZXRKc0FuaW1hdGlvbigkY3VyckVsKTtcblxuICAgICAgICBpZiAoY3VyckFuaW1hdGlvbi5oaWRlT25TdGFydCkge1xuICAgICAgICAgICRjdXJyRWwuaGlkZSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICRjdXJyRWwuc2hvdygpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBhbmltYXRlSnMoZWwpIHtcbiAgICAgICQoZWwpLmVhY2goKGksIGN1cnJFbCkgPT4ge1xuICAgICAgICBsZXQgJGN1cnJFbCA9ICQoY3VyckVsKTtcbiAgICAgICAgbGV0IGN1cnJBbmltYXRpb24gPSB0aGlzLmdldEpzQW5pbWF0aW9uKCRjdXJyRWwpO1xuICAgICAgICBsZXQgZGVsYXkgPSBwYXJzZUZsb2F0KCRjdXJyRWwuYXR0cignZGF0YS1hbmltYXRpb24tZGVsYXknKSk7XG4gICAgICAgIGxldCBzcGVlZCA9IHBhcnNlRmxvYXQoJGN1cnJFbC5hdHRyKCdkYXRhLWFuaW1hdGlvbi1zcGVlZCcpKTtcblxuICAgICAgICBpZiAoIWN1cnJBbmltYXRpb24pIHJldHVybjtcblxuICAgICAgICB0aGlzLnByZXBhcmVKc0FuaW1hdGVkRWwoY3VyckVsKTtcbiAgICAgICAgJGN1cnJFbC5hZGRDbGFzcyh0aGlzLmNsYXNzLmFuaW1hdGluZyk7XG5cbiAgICAgICAgaWYgKGRlbGF5KSB7XG4gICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICBjdXJyQW5pbWF0aW9uLm1ldGhvZCgkY3VyckVsLCBzcGVlZCk7XG4gICAgICAgICAgICAkY3VyckVsXG4gICAgICAgICAgICAgIC50cmlnZ2VyKHRoaXMuZXZlbnRzLmFuaW1hdGVTdGFydCwgW2N1cnJFbCwgdGhpc10pXG4gICAgICAgICAgICAgIC5kZWxheShzcGVlZCB8fCBjdXJyQW5pbWF0aW9uLnNwZWVkKVxuICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3ModGhpcy5jbGFzcy5hbmltYXRpbmcpXG4gICAgICAgICAgICAgIC50cmlnZ2VyKHRoaXMuZXZlbnRzLmFuaW1hdGVFbmQsIFtjdXJyRWwsIHRoaXNdKTtcbiAgICAgICAgICB9LCBkZWxheSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY3VyckFuaW1hdGlvbi5tZXRob2QoJGN1cnJFbCwgc3BlZWQpO1xuICAgICAgICAgICRjdXJyRWxcbiAgICAgICAgICAgIC50cmlnZ2VyKHRoaXMuZXZlbnRzLmFuaW1hdGVTdGFydCwgW2N1cnJFbCwgdGhpc10pXG4gICAgICAgICAgICAuZGVsYXkoc3BlZWQgfHwgY3VyckFuaW1hdGlvbi5zcGVlZClcbiAgICAgICAgICAgIC5yZW1vdmVDbGFzcyh0aGlzLmNsYXNzLmFuaW1hdGluZylcbiAgICAgICAgICAgIC50cmlnZ2VyKHRoaXMuZXZlbnRzLmFuaW1hdGVFbmQsIFtjdXJyRWwsIHRoaXNdKTtcbiAgICAgICAgfVxuXG4gICAgICAgICRjdXJyRWwuYWRkQ2xhc3ModGhpcy5jbGFzcy5hbmltYXRlZCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBhbmltYXRlTnVtYmVyKGVsKSB7XG4gICAgICAkKGVsKS5lYWNoKChpLCBjdXJyRWwpID0+IHtcbiAgICAgICAgbGV0ICRjdXJyRWwgPSAkKGN1cnJFbCk7XG5cbiAgICAgICAgJGN1cnJFbFxuICAgICAgICAgIC5hZGRDbGFzcyh0aGlzLmNsYXNzLmFuaW1hdGluZylcbiAgICAgICAgICAudHJpZ2dlcih0aGlzLmV2ZW50cy5hbmltYXRlU3RhcnQsIFtjdXJyRWwsIHRoaXNdKVxuICAgICAgICAgIC5wcm9wKCdhbmltYXRvcicsIDApXG4gICAgICAgICAgLmFuaW1hdGUoXG4gICAgICAgICAgICB7YW5pbWF0b3I6ICRjdXJyRWwudGV4dCgpfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgZHVyYXRpb246IDIwMDAsXG4gICAgICAgICAgICAgIGVhc2luZzogJ3N3aW5nJyxcbiAgICAgICAgICAgICAgc3RlcDogKG5vdykgPT4ge1xuICAgICAgICAgICAgICAgICRjdXJyRWwudGV4dChNYXRoLmNlaWwobm93KSk7XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGNvbXBsZXRlOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgJGN1cnJFbFxuICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKHRoaXMuY2xhc3MuYW5pbWF0ZWQpXG4gICAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3ModGhpcy5jbGFzcy5hbmltYXRpbmcpXG4gICAgICAgICAgICAgICAgICAudHJpZ2dlcih0aGlzLmV2ZW50cy5hbmltYXRlRW5kLCBbY3VyckVsLCB0aGlzXSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgYW5pbWF0ZUNzcyhlbCkge1xuICAgICAgJChlbCkuZWFjaCgoaSwgY3VyckVsKSA9PiB7XG4gICAgICAgIGxldCAkY3VyckVsID0gJChjdXJyRWwpO1xuICAgICAgICBsZXQgZGVsYXkgPSBwYXJzZUZsb2F0KCRjdXJyRWwuYXR0cignZGF0YS1hbmltYXRpb24tZGVsYXknKSk7XG4gICAgICAgIGxldCBzcGVlZCA9IHBhcnNlRmxvYXQoJGN1cnJFbC5hdHRyKCdkYXRhLWFuaW1hdGlvbi1zcGVlZCcpKTtcblxuICAgICAgICBpZiAoc3BlZWQpIHtcbiAgICAgICAgICBjdXJyRWwuc3R5bGUuYW5pbWF0aW9uRHVyYXRpb24gPSBzcGVlZCArICdzJztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChkZWxheSkge1xuICAgICAgICAgIGN1cnJFbC5zdHlsZS5hbmltYXRpb25EZWxheSA9IGRlbGF5ICsgJ3MnO1xuICAgICAgICB9XG5cblxuICAgICAgICAvKmlmICghJGN1cnJFbC5oYXNDbGFzcyh0aGlzLmNsYXNzLmFuaW1hdGVkKSkge1xuICAgICAgICAgICRjdXJyRWwuYWRkQ2xhc3ModGhpcy5jbGFzcy5hbmltYXRlZCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoISRjdXJyRWwuaGFzQ2xhc3ModGhpcy5jbGFzcy5hbmltYXRlZENzcykpIHtcbiAgICAgICAgICAkY3VyckVsLmFkZENsYXNzKHRoaXMuY2xhc3MuYW5pbWF0ZWRDc3MpO1xuICAgICAgICB9Ki9cblxuICAgICAgICAvL2xldCBhbmltYXRpb25OYW1lID0gJGN1cnJFbC5jc3MoJ2FuaW1hdGlvbi1uYW1lJyk7XG5cbiAgICAgICAgJGN1cnJFbFxuICAgICAgICAgIC8vLnJlbW92ZUNsYXNzKGFuaW1hdGlvbk5hbWUpXG4gICAgICAgICAgLmFkZENsYXNzKHRoaXMuY2xhc3MuYW5pbWF0aW5nKVxuICAgICAgICAgIC5hZGRDbGFzcyh0aGlzLmNsYXNzLmFuaW1hdGVkQ3NzKVxuICAgICAgICAgIC8vLmFkZENsYXNzKGFuaW1hdGlvbk5hbWUpXG4gICAgICAgICAgLmRlbGF5KHBhcnNlRmxvYXQoZ2V0Q29tcHV0ZWRTdHlsZShjdXJyRWwpLmFuaW1hdGlvbkRlbGF5KSAqIDEwMDApXG4gICAgICAgICAgLnRyaWdnZXIodGhpcy5ldmVudHMuYW5pbWF0ZVN0YXJ0LCBbY3VyckVsLCB0aGlzXSlcbiAgICAgICAgICAuZGVsYXkocGFyc2VGbG9hdChnZXRDb21wdXRlZFN0eWxlKGN1cnJFbCkuYW5pbWF0aW9uRHVyYXRpb24pICogMTAwMClcbiAgICAgICAgICAvLy5jc3MoJ2FuaW1hdGlvbi1uYW1lJywgICcnKVxuICAgICAgICAgIC5hZGRDbGFzcyh0aGlzLmNsYXNzLmFuaW1hdGVkKVxuICAgICAgICAgIC5yZW1vdmVDbGFzcyh0aGlzLmNsYXNzLmFuaW1hdGluZylcbiAgICAgICAgICAudHJpZ2dlcih0aGlzLmV2ZW50cy5hbmltYXRlRW5kLCBbY3VyckVsLCB0aGlzXSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB1cGRhdGUoZWwpIHtcbiAgICAgICQoZWwgfHwgdGhpcy4kZWxlbWVudHMpLmVhY2goKGksIGN1cnJFbCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5pc0luVmlldyhjdXJyRWwsIHRydWUpKSB7XG4gICAgICAgICAgdGhpcy5ydW5BbmltYXRpb24oY3VyckVsKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaXNJblZpZXcoZWwsIGZpcnN0VGltZSkge1xuICAgICAgbGV0IGNvb3JkcyA9IHRoaXMuZ2V0Q29vcmRzKGVsKTtcbiAgICAgIGxldCBjbGllbnRIZWlnaHQgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0O1xuICAgICAgbGV0IHNjcm9sbEhlaWdodCA9IE1hdGgubWF4KFxuICAgICAgICBkb2N1bWVudC5ib2R5LnNjcm9sbEhlaWdodCwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbEhlaWdodCxcbiAgICAgICAgZG9jdW1lbnQuYm9keS5vZmZzZXRIZWlnaHQsIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5vZmZzZXRIZWlnaHQsXG4gICAgICAgIGRvY3VtZW50LmJvZHkuY2xpZW50SGVpZ2h0LCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0XG4gICAgICApO1xuICAgICAgbGV0IHZpZXdwb3J0ID0ge1xuICAgICAgICB0b3A6IHdpbmRvdy5wYWdlWU9mZnNldCxcbiAgICAgICAgYm90dG9tOiB3aW5kb3cucGFnZVlPZmZzZXQgKyBjbGllbnRIZWlnaHRcbiAgICAgIH07XG4gICAgICBpZiAoKGNvb3Jkcy5ib3R0b20gPiB2aWV3cG9ydC50b3AgJiYgY29vcmRzLmJvdHRvbSA8PSB2aWV3cG9ydC5ib3R0b20pICYmXG4gICAgICAgIChjb29yZHMudG9wID49IHZpZXdwb3J0LnRvcCAmJiBjb29yZHMudG9wIDwgdmlld3BvcnQuYm90dG9tKSkge1xuICAgICAgICAkKGVsKS50cmlnZ2VyKHRoaXMuZXZlbnRzLmluVmlldywgW2VsLCB0aGlzXSk7XG5cbiAgICAgICAgaWYgKCFlbC5jbGFzc0xpc3QuY29udGFpbnModGhpcy5jbGFzcy5pblZpZXcpKSB7XG4gICAgICAgICAgJChlbCkudHJpZ2dlcih0aGlzLmV2ZW50cy5pblZpZXdGaXJzdFRpbWUsIFtlbCwgdGhpc10pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGZpcnN0VGltZSAmJiBlbC5jbGFzc0xpc3QuY29udGFpbnModGhpcy5jbGFzcy5pblZpZXcpKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgZWwuY2xhc3NMaXN0LmFkZCh0aGlzLmNsYXNzLmluVmlldyk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoZWwuY2xhc3NMaXN0LmNvbnRhaW5zKHRoaXMuY2xhc3MuaW5WaWV3KSkge1xuICAgICAgICAkKGVsKS50cmlnZ2VyKHRoaXMuZXZlbnRzLm91dE9mVmlld0ZpcnN0VGltZSwgW2VsLCB0aGlzXSk7XG4gICAgICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5jbGFzcy5pblZpZXcpO1xuICAgICAgfVxuXG4gICAgICAkKGVsKS50cmlnZ2VyKHRoaXMuZXZlbnRzLm91dE9mVmlldywgW2VsLCB0aGlzXSk7XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZWZyZXNoRWwoZWwpIHtcbiAgICAgICQoZWwpLmVhY2goKGksIGN1cnJFbCkgPT4ge1xuICAgICAgICAkKGN1cnJFbClcbiAgICAgICAgICAucmVtb3ZlQ2xhc3ModGhpcy5jbGFzcy5hbmltYXRlZClcbiAgICAgICAgICAucmVtb3ZlQ2xhc3ModGhpcy5jbGFzcy5pblZpZXcpXG4gICAgICAgICAgLnJlbW92ZUNsYXNzKHRoaXMuY2xhc3MuYW5pbWF0ZWRDc3MpXG4gICAgICAgICAgLnRyaWdnZXIodGhpcy5ldmVudHMucmVmcmVzaFN0YXJ0LCBbY3VyckVsLCB0aGlzXSk7XG5cbiAgICAgICAgaWYgKHRoaXMuaXNJblZpZXcoY3VyckVsKSkge1xuICAgICAgICAgIHRoaXMucnVuQW5pbWF0aW9uKGN1cnJFbCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJlZnJlc2hIYW5kbGVyKGUpIHtcbiAgICAgIGxldCB0YXJnZXQgPSBlLnRhcmdldDtcblxuICAgICAgaWYgKCF0aGlzLiRlbGVtZW50cy5pcyh0YXJnZXQpKSByZXR1cm47XG5cbiAgICAgIHRoaXMucmVmcmVzaEVsKHRhcmdldCk7XG4gICAgfVxuXG4gICAgYWRkRWxlbWVudChuZXdFbCwgb3B0aW9ucykge1xuICAgICAgbGV0ICRuZXdFbCA9ICQobmV3RWwpO1xuXG4gICAgICAkbmV3RWwuZWFjaCgoaSwgY3VyckVsKSA9PiB7XG4gICAgICAgIGxldCAkY3VyckVsID0gJChjdXJyRWwpO1xuICAgICAgICBsZXQganNBbmltYXRpb24gPSB0aGlzLmdldEpzQW5pbWF0aW9uKGN1cnJFbCk7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgIGlmIChvcHRpb25zLmluZmluaXRlKSB7XG4gICAgICAgICAgICAkY3VyckVsLmFkZENsYXNzKHRoaXMuY2xhc3MuaW5maW5pdGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChqc0FuaW1hdGlvbikge1xuICAgICAgICAgICRjdXJyRWwuYWRkQ2xhc3ModGhpcy5jbGFzcy5hbmltYXRlSnMpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy4kZWxlbWVudHMgPSB0aGlzLiRlbGVtZW50cy5hZGQoJGN1cnJFbCk7XG5cbiAgICAgICAgdGhpcy51cGRhdGUoY3VyckVsKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJlbW92ZUVsZW1lbnQoZWwpIHtcbiAgICAgIGxldCAkZWwgPSAkKGVsKTtcblxuICAgICAgaWYgKHR5cGVvZiB0aGlzLiRlbGVtZW50cyAhPT0gJCkgcmV0dXJuO1xuXG4gICAgICB0aGlzLiRlbGVtZW50cyA9IHRoaXMuJGVsZW1lbnRzLm5vdCgkZWwpO1xuXG4gICAgICB0aGlzLmNsZWFuRWwoJGVsKTtcbiAgICB9XG5cbiAgICBjbGVhbkVsKGVsKSB7XG4gICAgICBsZXQgJGVsID0gJChlbCk7XG5cbiAgICAgIGZvciAobGV0IGNsYXNzTmFtZSBpbiB0aGlzLmNsYXNzKSB7XG4gICAgICAgICRlbC5yZW1vdmVDbGFzcyh0aGlzLmNsYXNzW2NsYXNzTmFtZV0pO1xuICAgICAgfVxuICAgIH1cblxuXG4gICAgc3RvcCgpIHtcbiAgICAgICQod2luZG93KS5vZmYoJ3Njcm9sbCcsIHRoaXMuX29uU2Nyb2xsKTtcbiAgICAgICQodGhpcy5saXN0ZW5lZEJsb2NrKS5vZmYodGhpcy5ldmVudHMucmVmcmVzaCwgdGhpcy5fb25SZWZyZXNoKTtcbiAgICB9XG5cbiAgICBzdGFydCgpIHtcbiAgICAgICQod2luZG93KS5vbignc2Nyb2xsJywgdGhpcy5fb25TY3JvbGwpO1xuICAgICAgJCh0aGlzLmxpc3RlbmVkQmxvY2spLm9uKHRoaXMuZXZlbnRzLnJlZnJlc2gsIHRoaXMuX29uUmVmcmVzaCk7XG4gICAgfVxuXG4gICAgZGVzdHJveSgpIHtcbiAgICAgIHRoaXMuc3RvcCgpO1xuXG4gICAgICB0aGlzLmNsZWFuRWwodGhpcy4kZWxlbWVudHMpO1xuICAgICAgdGhpcy4kZWxlbWVudHMuZWFjaCgoaSwgZWwpID0+IHtcbiAgICAgICAgZWwuakV2ZW50QW5pbWF0aW9uID0gbnVsbDtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLmRlbGV0ZU9iaihhbmltYXRvcik7XG4gICAgICBhbmltYXRvciA9IG51bGw7XG4gICAgfVxuXG4gICAgZGVsZXRlT2JqKG9iaikge1xuICAgICAgZm9yIChsZXQgcHJvcCBpbiBvYmopIHtcbiAgICAgICAgaWYgKHR5cGVvZiBvYmpbcHJvcF0gPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgdGhpcy5kZWxldGVPYmoob2JqW3Byb3BdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRlbGV0ZSBvYmpbcHJvcF07XG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0U2VsZigpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGdldENvb3JkcyhlbGVtKSB7XG4gICAgICBsZXQgYm94ID0gZWxlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdG9wOiBib3gudG9wICsgd2luZG93LnBhZ2VZT2Zmc2V0LFxuICAgICAgICBib3R0b206IGJveC5ib3R0b20gKyB3aW5kb3cucGFnZVlPZmZzZXQsXG4gICAgICAgIGxlZnQ6IGJveC5sZWZ0ICsgd2luZG93LnBhZ2VYT2Zmc2V0LFxuICAgICAgICByaWdodDogYm94LnJpZ2h0ICsgd2luZG93LnBhZ2VYT2Zmc2V0XG4gICAgICB9O1xuICAgIH1cblxuICAgIGFkZEpzQW5pbWF0aW9uKGFuaW1hdGlvbikge1xuICAgICAgbGV0IG5ld0FuaW1hdGlvbiA9ICQuZXh0ZW5kKHt9LCBEZWZhdWx0QW5pbWF0aW9uLCBhbmltYXRpb24pO1xuICAgICAgYW5pbWF0aW9uSnMucHVzaChuZXdBbmltYXRpb24pO1xuXG4gICAgICB0aGlzLiRlbGVtZW50cy5lYWNoKChpLCBjdXJyRWwpID0+IHtcbiAgICAgICAgbGV0ICRjdXJyRWwgPSAkKGN1cnJFbCk7XG5cbiAgICAgICAgaWYgKCRjdXJyRWwuaGFzQ2xhc3MobmV3QW5pbWF0aW9uLm5hbWUpKSB7XG4gICAgICAgICAgJGN1cnJFbC5hZGRDbGFzKHRoaXMuY2xhc3MuYW5pbWF0ZUpzKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgY29uc3QgRGVmYXVsdEFuaW1hdGlvbiA9IHtcbiAgICBuYW1lOiAnJyxcbiAgICBoaWRlT25TdGFydDogZmFsc2UsXG4gICAgc3BlZWQ6IDQwMCxcbiAgICBtZXRob2Q6IGZ1bmN0aW9uIChlbGVtZW50LCBzcGVlZCkge1xuXG4gICAgfVxuICB9O1xuXG4gIGxldCBhbmltYXRpb25KcyA9IFtcbiAgICB7XG4gICAgICBuYW1lOiAnZmFkZUluJyxcbiAgICAgIGhpZGVPblN0YXJ0OiB0cnVlLFxuICAgICAgc3BlZWQ6IDQwMCxcbiAgICAgIG1ldGhvZDogZnVuY3Rpb24gKGVsZW1lbnQsIHNwZWVkKSB7XG4gICAgICAgIHNwZWVkID0gc3BlZWQgfHwgdGhpcy5zcGVlZDtcblxuICAgICAgICAkKGVsZW1lbnQpLmZhZGVJbihzcGVlZCk7XG4gICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICBuYW1lOiAnZmFkZU91dCcsXG4gICAgICBoaWRlT25TdGFydDogZmFsc2UsXG4gICAgICBzcGVlZDogNDAwLFxuICAgICAgbWV0aG9kOiBmdW5jdGlvbiAoZWxlbWVudCwgc3BlZWQpIHtcbiAgICAgICAgc3BlZWQgPSBzcGVlZCB8fCB0aGlzLnNwZWVkO1xuXG4gICAgICAgICQoZWxlbWVudCkuZmFkZU91dChzcGVlZCk7XG4gICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICBuYW1lOiAnc2xpZGVEb3duJyxcbiAgICAgIGhpZGVPblN0YXJ0OiB0cnVlLFxuICAgICAgc3BlZWQ6IDQwMCxcbiAgICAgIG1ldGhvZDogZnVuY3Rpb24gKGVsZW1lbnQsIHNwZWVkKSB7XG4gICAgICAgIHNwZWVkID0gc3BlZWQgfHwgdGhpcy5zcGVlZDtcblxuICAgICAgICAkKGVsZW1lbnQpLnNsaWRlRG93bihzcGVlZCk7XG4gICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICBuYW1lOiAnc2xpZGVVcCcsXG4gICAgICBoaWRlT25TdGFydDogZmFsc2UsXG4gICAgICBzcGVlZDogNDAwLFxuICAgICAgbWV0aG9kOiBmdW5jdGlvbiAoZWxlbWVudCwgc3BlZWQpIHtcbiAgICAgICAgc3BlZWQgPSBzcGVlZCB8fCB0aGlzLnNwZWVkO1xuXG4gICAgICAgICQoZWxlbWVudCkuc2xpZGVVcChzcGVlZCk7XG4gICAgICB9XG4gICAgfVxuICBdO1xuXG4gIGxldCBhbmltYXRvciA9IG51bGw7XG5cbiAgJC5mbi5qRXZlbnRBbmltYXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgbGV0IF8gPSB0aGlzO1xuICAgIGxldCBvcHRpb25zID0gYXJndW1lbnRzWzBdIHx8IHt9O1xuICAgIGxldCBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcblxuICAgIGlmICghXy5sZW5ndGgpIHJldHVybjtcblxuICAgIGlmICghYW5pbWF0b3IpIHtcbiAgICAgIGFuaW1hdG9yID0gbmV3IEpFdmVudEFuaW1hdGlvbkNvbnRyb2xsZXIoe30pO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGFuaW1hdG9yLmFkZEVsZW1lbnQoXywgb3B0aW9ucyk7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgXy5sZW5ndGg7IGkrKykge1xuICAgICAgICBfW2ldLmpFdmVudEFuaW1hdGlvbiA9IGFuaW1hdG9yO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IF8ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IF9baV0uakV2ZW50QW5pbWF0aW9uW29wdGlvbnNdLmNhbGwoX1tpXS5qRXZlbnRBbmltYXRpb24sIGFyZ3MpO1xuXG4gICAgICAgIGlmICh0eXBlb2YgcmVzdWx0ICE9PSAndW5kZWZpbmVkJykgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1cblxuICAgIH1cblxuICAgIHJldHVybiBfO1xuICB9O1xufSkpO1xuXG5cbi8qXG5qUXVlcnkoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgkKSB7XG4gIC8hKmluaXQqIS9cbiAgbGV0ICRhbmltYXRlZEVsID0gJCgnLmpzX19qZXZlbnRhbmltYXRpb24nKTtcblxuICAkYW5pbWF0ZWRFbC5qRXZlbnRBbmltYXRpb24oKTtcbn0pOyovXG4iXX0=
