/*BlockToggler*/
'use strict';

//TODO добавить возможность програмного добавления групп
//TODO на открыти/закрытие/переключени при передаче колбека, обхеденять с колбеком родным

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
  var JElementTogglerController = function () {
    function JElementTogglerController(options) {
      _classCallCheck(this, JElementTogglerController);

      this._togglerBtn = options.togglerBtn || null;
      this._listenedEl = options.listenedEl || document.body;
      //this._delegated = options.delegated || false;
      //this._delegatedContainer = options.delegatedContainer || null;
      this._targetSelector = options.target || null;
      this._getTarget = options.getTarget || null; //func, arg: this._$togglerBtn, return: target
      this._groupName = options.groupName || null;
      this._closeBtnSelector = options.closeBtnSelector || '.js__et-close';
      this._animation = options.animation || 'simple'; // 'none', 'simple', 'slide', 'fade'
      this._animationDuration = options.animationDuration || 400;
      this._openAnimation = options.openAnimation || this._animation;
      this._closeAnimation = options.closeAnimation || this._animation;
      this._switchAnimation = options.switchAnimation || this._animation;
      this._openAnimationDuration = options.openAnimationDuration || this._animationDuration;
      this._closeAnimationDuration = options.closeAnimationDuration || this._animationDuration;
      this._switchAnimationDuration = options.switchAnimationDuration || this._animationDuration;
      this._onBeforeOpen = options.onBeforeOpen || null;
      this._onAfterOpen = options.onAfterOpen || null;
      this._onBeforeClose = options.onBeforeClose || null;
      this._onAfterClose = options.onAfterClose || null;
      this._onBeforeSwitch = options.onBeforeSwitch || null;
      this._onAfterSwitch = options.onAfterSwitch || null;
      this._outerClickClose = options.outerClick || false;
      this._disallowedActions = options.disallowedActions || [];
      this.actions = {
        open: 'open',
        close: 'close',
        switch: 'switch'
      };
      this._isActive = false;
      this._isWorking = false;
      this._clickActionTimeout = null;
      this.userClassName = options.className || {};
      this.className = {
        initializedToggler: 'js__et-toggler-initialized',
        initializedTarget: 'js__et-target-initialized',
        active: 'et-active',
        disableScroller: 'js__scroll-disable'
      };
      this.events = {
        beforeOpen: 'jElementToggler:beforeOpen',
        afterOpen: 'jElementToggler:afterOpen',
        beforeClose: 'jElementToggler:beforeClose',
        afterClose: 'jElementToggler:afterClose',
        beforeSwitch: 'jElementToggler:beforeSwitch',
        afterSwitch: 'jElementToggler:afterSwitch',
        openGroup: 'jElementToggler:openGroup',
        closeGroup: 'jElementToggler:closeGroup',

        /*managing events*/
        open: 'jElementToggler:open',
        close: 'jElementToggler:close',
        start: 'jElementToggler:start',
        stop: 'jElementToggler:stop'
      };

      this.init();
    }

    _createClass(JElementTogglerController, [{
      key: 'init',
      value: function init() {
        $.extend(this.className, this.userClassName);
        this.bindElements();

        if ((!this._$target || !this._$target.length) && this._animation !== 'none') return; //if still no target stop init func

        this.bindHandlers();
        this.attachHandlers();

        if (this._animation !== 'none') {
          // возможно лишнее условие
          this._$target.hide();
        }

        if (this._$togglerBtn.hasClass(this.className.active) || this._$togglerBtn.is(':checked')) {
          this.showEl('simple');
          this._isActive = true;
        }

        this._$togglerBtn.addClass(this.className.disableScroller); //фикс конфликта со smooth scroll

        this._isWorking = true;
        this._isInited = true;
      }
    }, {
      key: 'bindElements',
      value: function bindElements() {
        this._$togglerBtn = $(this._togglerBtn);
        this._$listenedEl = $(this._listenedEl);
        this._groupName = this._groupName || this._$togglerBtn.attr('data-et-group');

        if (typeof this._getTarget === 'function') {
          this._$target = $(this._getTarget(this._$togglerBtn, this));
        } else {
          this._targetSelector = this._targetSelector || this._$togglerBtn.attr('data-et-target') || this._$togglerBtn.attr('href');
          this._$target = $(this._targetSelector);
        }

        if (this._$togglerBtn.is('input[type="checkbox"]')) {
          this.isCheckbox = true;
        }
      }
    }, {
      key: 'bindHandlers',
      value: function bindHandlers() {
        var maxAnimationDuration = this._openAnimationDuration >= this._closeAnimationDuration ? this._openAnimationDuration : this._closeAnimationDuration;

        this._debouncedTogglerHandler = this.debounce(this.togglerHandler, maxAnimationDuration + 5, this);
        this._togglerClickHandler = this.togglerClickHandler.bind(this);
        this._clearClickActionTimeout = this.clearClickActionTimeout.bind(this);
        this._openBlockListener = this.openBlockListener.bind(this);
        this._openGroupHandler = this.switchHandler.bind(this);
        this._closeGroupHandler = this.closeGroupHandler.bind(this);
        this._closeBtnListener = this.closeBtnListener.bind(this);
        this._outerClickListener = this.outerClickListener.bind(this);
        this._openElHandler = this.openElHandler.bind(this);
        this._closeElHandler = this.closeElHandler.bind(this);
        this._startHandler = this.startHandler.bind(this);
        this._stopHandler = this.stopHandler.bind(this);
      }
    }, {
      key: 'attachHandlers',
      value: function attachHandlers() {
        var _$togglerBtn$on;

        var clickEvent = this._clickEvent = this.isIOS() ? 'touchstart' : 'click';
        var $listenedEl = this._$listenedEl;
        var $target = this._$target;

        if ($target.length) {
          $target.on('click', this._closeBtnListener).addClass(this.className.initializedTarget);
        }

        if (this._outerClickClose) {
          $listenedEl.on(this._clickEvent, this._outerClickListener);
        }

        if (this._groupName) {
          var _$listenedEl$on;

          $listenedEl.on((_$listenedEl$on = {}, _defineProperty(_$listenedEl$on, this.events.beforeOpen, this._openBlockListener), _defineProperty(_$listenedEl$on, this.events.openGroup, this._openGroupHandler), _defineProperty(_$listenedEl$on, this.events.closeGroup, this._closeGroupHandler), _$listenedEl$on));
        }

        this._$togglerBtn.on((_$togglerBtn$on = {}, _defineProperty(_$togglerBtn$on, clickEvent, this._debouncedTogglerHandler), _defineProperty(_$togglerBtn$on, this.events.open, this._openElHandler), _defineProperty(_$togglerBtn$on, this.events.close, this._closeElHandler), _defineProperty(_$togglerBtn$on, this.events.stop, this._stopHandler), _$togglerBtn$on)).addClass(this.className.initializedToggler);

        if (!this._isInited) {
          this._$togglerBtn.on(_defineProperty({}, this.events.start, this._startHandler));
        }
      }
    }, {
      key: 'detachHandlers',
      value: function detachHandlers() {
        var _$togglerBtn$off;

        var clickEvent = this._clickEvent = this.isIOS() ? 'touchstart' : 'click';
        var $listenedEl = this._$listenedEl;
        var $target = this._$target;

        if ($target.length) {
          $target.off('click', this._closeBtnListener).removeClass(this.className.initializedTarget);
        }

        if (this._outerClickClose) {
          $listenedEl.off(this._clickEvent, this._outerClickListener);
        }

        if (this._groupName) {
          var _$listenedEl$off;

          $listenedEl.off((_$listenedEl$off = {}, _defineProperty(_$listenedEl$off, this.events.beforeOpen, this._openBlockListener), _defineProperty(_$listenedEl$off, this.events.closeGroup, this._closeGroupHandler), _$listenedEl$off));
        }

        this._$togglerBtn.off((_$togglerBtn$off = {}, _defineProperty(_$togglerBtn$off, clickEvent, this._debouncedTogglerHandler), _defineProperty(_$togglerBtn$off, this.events.open, this._openElHandler), _defineProperty(_$togglerBtn$off, this.events.close, this._closeElHandler), _defineProperty(_$togglerBtn$off, this.events.stop, this._stopHandler), _$togglerBtn$off)).removeClass(this.className.initializedToggler);
      }
    }, {
      key: 'start',
      value: function start() {
        if (this._isWorking) return;

        this.attachHandlers();
        this._isWorking = true;
      }
    }, {
      key: 'stop',
      value: function stop() {
        if (!this._isWorking) return;

        this.detachHandlers();
        this._isWorking = false;
      }
    }, {
      key: 'startHandler',
      value: function startHandler(e) {
        var el = e.target;

        if (!this.isSameToggler(el)) return;

        this.start();
      }
    }, {
      key: 'stopHandler',
      value: function stopHandler(e) {
        var el = e.target;

        if (!this.isSameToggler(el)) return;

        this.stop();
      }
    }, {
      key: 'isSameToggler',
      value: function isSameToggler(el) {
        //let $el = $(el);
        //let $closestTogglerBtn = $el.closest('.' + this.className.initializedToggler);

        return this._$togglerBtn.is(el);
      }
    }, {
      key: 'togglerHandler',
      value: function togglerHandler(e) {
        var $el = $(e.target);
        var isTarget = !!$el.closest(this._$target).length && !$el.is(this._$togglerBtn);
        var scrollEvent = this.isIOS() ? 'touchmove' : 'scroll';

        if (!this.isHidden(this._$target) && this._animation !== 'none') {
          //возможно стоит также удалить
          this._isActive = true;
        }

        if (this._isActive && isTarget) return;

        if (!this.isIOS() && !this.isCheckbox) {
          e.preventDefault();
        }

        this.clearClickActionTimeout();
        this._clickActionTimeout = setTimeout(function () {
          this.togglerClickHandler();
          $(document).off(scrollEvent, this._clearClickActionTimeout);
        }.bind(this), 200);

        $(document).one(scrollEvent, this._clearClickActionTimeout);
      }
    }, {
      key: 'clearClickActionTimeout',
      value: function clearClickActionTimeout() {
        if (this._clickActionTimeout) {
          clearTimeout(this._clickActionTimeout);
          this._clickActionTimeout = null;
        }
      }
    }, {
      key: 'togglerClickHandler',
      value: function togglerClickHandler() {
        if (this._isActive) {
          this.hideEl();
        } else {
          this.showEl();
        }
      }
    }, {
      key: 'openElHandler',
      value: function openElHandler(e, animation, duration, callback) {
        var el = e.target;

        if (!this.isSameToggler(el)) return;

        this.showEl(animation, duration, callback);
      }
    }, {
      key: 'closeElHandler',
      value: function closeElHandler(e, animation, duration, callback) {
        var el = e.target;

        if (!this.isSameToggler(el)) return;

        this.hideEl(animation, duration, callback);
      }
    }, {
      key: 'openBlockListener',
      value: function openBlockListener(e, controller) {
        if (!this._isActive || controller._$togglerBtn.is(this._$togglerBtn) || controller._groupName !== this._groupName || controller._groupName === undefined) {
          return;
        }

        this.switchEl();
      }
    }, {
      key: 'switchHandler',
      value: function switchHandler(e, groupName) {
        if (groupName !== this._groupName || groupName === undefined) {
          return;
        }

        this.switchEl();
      }
    }, {
      key: 'closeGroupHandler',
      value: function closeGroupHandler(e, groupName) {
        if (!this._isActive || groupName !== this._groupName || groupName === undefined) {
          return;
        }

        this.hideEl();
      }
    }, {
      key: 'outerClickListener',
      value: function outerClickListener(e) {
        //console.dir(this);
        if (!this._isActive) return;

        var $el = $(e.target);
        var isOuter = !$el.closest(this._$target.add(this._$togglerBtn)).length;

        if (!isOuter) return;

        this.hideEl();
      }
    }, {
      key: 'closeBtnListener',
      value: function closeBtnListener(e) {
        var $el = $(e.target);
        var $closeBtn = $el.closest(this._closeBtnSelector);

        if (!$closeBtn.length) return;

        var $currTarget = $closeBtn.closest('.' + this.className.initializedTarget);

        if (!$currTarget.is(this._$target)) return;

        this.hideEl();
      }
    }, {
      key: 'showEl',
      value: function showEl(animation, duration, callback) {
        if (~this._disallowedActions.indexOf(this.actions.open)) return;

        var $target = this._$target;
        callback = typeof callback === 'function' ? callback.bind(this) : this.showCallback.bind(this);
        duration = duration || this._openAnimationDuration;
        animation = animation || this._openAnimation;

        if (this._$togglerBtn.is('input[type="checkbox"]')) {
          this._$togglerBtn.attr('checked', true);
        } else {
          this._$togglerBtn.addClass(this.className.active);
        }
        $target.addClass(this.className.active);
        this._isActive = true;

        if (typeof this._onBeforeOpen === 'function') {
          this._onBeforeOpen(this);
        }

        this._$togglerBtn.trigger(this.events.beforeOpen, [this]);

        switch (animation) {
          case 'none':
            callback();
            break;
          case 'simple':
            $target.show();
            callback();
            break;
          case 'slide':
            if (!$target.length) {
              callback();
            } else {
              $target.slideDown(duration, callback);
            }
            break;
          case 'fade':
            if (!$target.length) {
              callback();
            } else {
              $target.fadeIn(duration, callback);
            }
            break;
        }
      }
    }, {
      key: 'showCallback',
      value: function showCallback() {
        if (typeof this._onAfterOpen === 'function') {
          this._onAfterOpen(this);
        }

        this._$togglerBtn.trigger(this.events.afterOpen, [this]);

        if (this._outerClickClose) {
          this._$listenedEl.on(this._clickEvent, this.outerClickListener);
        }
      }
    }, {
      key: 'hideEl',
      value: function hideEl(animation, duration, callback) {
        if (~this._disallowedActions.indexOf(this.actions.close)) return;

        var $target = this._$target;
        callback = typeof callback === 'function' ? callback.bind(this) : this.hideCallback.bind(this);
        duration = duration || this._closeAnimationDuration;
        animation = animation || this._closeAnimation;

        if (this._$togglerBtn.is('input[type="checkbox"]')) {
          this._$togglerBtn.attr('checked', false);
        } else {
          this._$togglerBtn.removeClass(this.className.active);
        }
        $target.removeClass(this.className.active);
        this._isActive = false;

        if (typeof this._onBeforeClose === 'function') {
          this._onBeforeClose(this);
        }

        this._$togglerBtn.trigger(this.events.beforeClose, [this]);

        switch (animation) {
          case 'none':
            callback();
            break;
          case 'simple':
            $target.hide();
            callback();
            break;
          case 'slide':
            $target.slideUp(duration, callback);
            break;
          case 'fade':
            $target.fadeOut(duration, callback);
            break;
        }
      }
    }, {
      key: 'hideCallback',
      value: function hideCallback() {
        if (typeof this._onAfterClose === 'function') {
          this._onAfterClose(this);
        }

        this._$togglerBtn.trigger(this.events.afterClose, [this]);

        if (this._outerClickClose) {
          this._$listenedEl.off(this._clickEvent, this.outerClickListener);
        }
      }
    }, {
      key: 'switchEl',
      value: function switchEl(animation, duration, callback) {
        if (~this._disallowedActions.indexOf(this.actions.switch)) return;

        var $target = this._$target;
        callback = typeof callback === 'function' ? callback.bind(this) : this.switchCallback.bind(this);
        duration = duration || this._switchAnimationDuration;
        animation = animation || this._switchAnimation;

        if (this._$togglerBtn.is('input[type="checkbox"]')) {
          this._$togglerBtn.attr('checked', false);
        } else {
          this._$togglerBtn.removeClass(this.className.active);
        }
        $target.removeClass(this.className.active);
        this._isActive = false;

        if (typeof this._onBeforeSwitch === 'function') {
          this._onBeforeSwitch(this);
        }

        this._$togglerBtn.trigger(this.events.beforeSwitch, [this]);

        switch (animation) {
          case 'none':
            callback();
            break;
          case 'simple':
            $target.hide();
            callback();
            break;
          case 'slide':
            $target.slideUp(duration, callback);
            break;
          case 'fade':
            $target.fadeOut(duration, callback);
            break;
        }
      }
    }, {
      key: 'switchCallback',
      value: function switchCallback() {
        if (typeof this._onAfterClose === 'function') {
          this._onAfterSwitch(this);
        }

        this._$togglerBtn.trigger(this.events.afterSwitch, [this]);

        if (this._outerClickClose) {
          this._$listenedEl.off(this._clickEvent, this.outerClickListener);
        }
      }
    }, {
      key: 'isIOS',
      value: function isIOS() {
        return (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
        );
      }
    }, {
      key: 'isHidden',
      value: function isHidden(el) {
        var $el = $(el);

        return $el.is(':hidden') || $el.css('visibility') === 'hidden' || +$el.css('opacity') === 0;
      }
    }, {
      key: 'getSelf',
      value: function getSelf() {
        return this;
      }

      /**
       * Debounces a function. Returns a function that calls the original fn function only if no invocations have been made
       * within the last quietMillis milliseconds.
       *
       * @param quietMillis number of milliseconds to wait before invoking fn
       * @param fn function to be debounced
       * @param bindedThis object to be used as this reference within fn
       * @return debounced version of fn
       */

    }, {
      key: 'debounce',
      value: function debounce(fn, quietMillis, bindedThis) {
        var isWaiting = false;
        return function func() {
          if (isWaiting) return;

          if (bindedThis === undefined) {
            bindedThis = this;
          }

          fn.apply(bindedThis, arguments);
          isWaiting = true;

          setTimeout(function () {
            isWaiting = false;
          }, quietMillis);
        };
      }
    }, {
      key: 'setOptions',
      value: function setOptions(options) {
        this.detachHandlers();

        for (var key in options) {
          this['_' + key] = options[key];
        }

        this.init();
      }
    }]);

    return JElementTogglerController;
  }();

  var DelegatedTogglerController = function () {
    function DelegatedTogglerController(options) {
      _classCallCheck(this, DelegatedTogglerController);

      this._$delegatedContainer = options.$delegatedContainer;
      this._togglerBtn = options.togglerBtn;
      this._jElementTogglerOptions = options;

      this.init();
    }

    _createClass(DelegatedTogglerController, [{
      key: 'init',
      value: function init() {
        this._jElementTogglerOptions.togglerBtn = null;
        this._clickHandler = this.clickHandler.bind(this);
        this._$delegatedContainer.on('click', this._clickHandler);
      }
    }, {
      key: 'clickHandler',
      value: function clickHandler(e) {
        var target = e.target;
        var togglerBtn = target.closest(this._togglerBtn);

        if (!togglerBtn || togglerBtn.jElementToggler && togglerBtn.jElementToggler instanceof JElementTogglerController) return;

        $(togglerBtn).jElementToggler(this._jElementTogglerOptions);
      }
    }]);

    return DelegatedTogglerController;
  }();

  $.fn.jElementToggler = function () {
    var _ = this;
    var options = arguments[0] || {};
    var args = Array.prototype.slice.call(arguments, 1);

    for (var i = 0; i < _.length; i++) {
      if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
        if (options.delegated) {
          if (!$.isArray(_[i].delegatedToggler)) {
            _[i].delegatedToggler = [];
          }

          options.$delegatedContainer = $(_[i]);
          _[i].delegatedToggler.push(new DelegatedTogglerController(options));
        } else {
          options.togglerBtn = _[i];
          _[i].jElementToggler = new JElementTogglerController(options);
        }

        //options.togglerBtn = _[i];
        //_[i].jElementToggler = new JElementTogglerController(options);
      } else {
        var result = _[i].jElementToggler[options].call(_[i].jElementToggler, args);

        if (typeof result !== 'undefined') return result;
      }
    }

    return _;
  };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpzL2pFbGVtZW50VG9nZ2xlci5lczYuanMiXSwibmFtZXMiOlsiZmFjdG9yeSIsImRlZmluZSIsImFtZCIsImV4cG9ydHMiLCJtb2R1bGUiLCJyZXF1aXJlIiwialF1ZXJ5IiwiJCIsIkpFbGVtZW50VG9nZ2xlckNvbnRyb2xsZXIiLCJvcHRpb25zIiwiX3RvZ2dsZXJCdG4iLCJ0b2dnbGVyQnRuIiwiX2xpc3RlbmVkRWwiLCJsaXN0ZW5lZEVsIiwiZG9jdW1lbnQiLCJib2R5IiwiX3RhcmdldFNlbGVjdG9yIiwidGFyZ2V0IiwiX2dldFRhcmdldCIsImdldFRhcmdldCIsIl9ncm91cE5hbWUiLCJncm91cE5hbWUiLCJfY2xvc2VCdG5TZWxlY3RvciIsImNsb3NlQnRuU2VsZWN0b3IiLCJfYW5pbWF0aW9uIiwiYW5pbWF0aW9uIiwiX2FuaW1hdGlvbkR1cmF0aW9uIiwiYW5pbWF0aW9uRHVyYXRpb24iLCJfb3BlbkFuaW1hdGlvbiIsIm9wZW5BbmltYXRpb24iLCJfY2xvc2VBbmltYXRpb24iLCJjbG9zZUFuaW1hdGlvbiIsIl9zd2l0Y2hBbmltYXRpb24iLCJzd2l0Y2hBbmltYXRpb24iLCJfb3BlbkFuaW1hdGlvbkR1cmF0aW9uIiwib3BlbkFuaW1hdGlvbkR1cmF0aW9uIiwiX2Nsb3NlQW5pbWF0aW9uRHVyYXRpb24iLCJjbG9zZUFuaW1hdGlvbkR1cmF0aW9uIiwiX3N3aXRjaEFuaW1hdGlvbkR1cmF0aW9uIiwic3dpdGNoQW5pbWF0aW9uRHVyYXRpb24iLCJfb25CZWZvcmVPcGVuIiwib25CZWZvcmVPcGVuIiwiX29uQWZ0ZXJPcGVuIiwib25BZnRlck9wZW4iLCJfb25CZWZvcmVDbG9zZSIsIm9uQmVmb3JlQ2xvc2UiLCJfb25BZnRlckNsb3NlIiwib25BZnRlckNsb3NlIiwiX29uQmVmb3JlU3dpdGNoIiwib25CZWZvcmVTd2l0Y2giLCJfb25BZnRlclN3aXRjaCIsIm9uQWZ0ZXJTd2l0Y2giLCJfb3V0ZXJDbGlja0Nsb3NlIiwib3V0ZXJDbGljayIsIl9kaXNhbGxvd2VkQWN0aW9ucyIsImRpc2FsbG93ZWRBY3Rpb25zIiwiYWN0aW9ucyIsIm9wZW4iLCJjbG9zZSIsInN3aXRjaCIsIl9pc0FjdGl2ZSIsIl9pc1dvcmtpbmciLCJfY2xpY2tBY3Rpb25UaW1lb3V0IiwidXNlckNsYXNzTmFtZSIsImNsYXNzTmFtZSIsImluaXRpYWxpemVkVG9nZ2xlciIsImluaXRpYWxpemVkVGFyZ2V0IiwiYWN0aXZlIiwiZGlzYWJsZVNjcm9sbGVyIiwiZXZlbnRzIiwiYmVmb3JlT3BlbiIsImFmdGVyT3BlbiIsImJlZm9yZUNsb3NlIiwiYWZ0ZXJDbG9zZSIsImJlZm9yZVN3aXRjaCIsImFmdGVyU3dpdGNoIiwib3Blbkdyb3VwIiwiY2xvc2VHcm91cCIsInN0YXJ0Iiwic3RvcCIsImluaXQiLCJleHRlbmQiLCJiaW5kRWxlbWVudHMiLCJfJHRhcmdldCIsImxlbmd0aCIsImJpbmRIYW5kbGVycyIsImF0dGFjaEhhbmRsZXJzIiwiaGlkZSIsIl8kdG9nZ2xlckJ0biIsImhhc0NsYXNzIiwiaXMiLCJzaG93RWwiLCJhZGRDbGFzcyIsIl9pc0luaXRlZCIsIl8kbGlzdGVuZWRFbCIsImF0dHIiLCJpc0NoZWNrYm94IiwibWF4QW5pbWF0aW9uRHVyYXRpb24iLCJfZGVib3VuY2VkVG9nZ2xlckhhbmRsZXIiLCJkZWJvdW5jZSIsInRvZ2dsZXJIYW5kbGVyIiwiX3RvZ2dsZXJDbGlja0hhbmRsZXIiLCJ0b2dnbGVyQ2xpY2tIYW5kbGVyIiwiYmluZCIsIl9jbGVhckNsaWNrQWN0aW9uVGltZW91dCIsImNsZWFyQ2xpY2tBY3Rpb25UaW1lb3V0IiwiX29wZW5CbG9ja0xpc3RlbmVyIiwib3BlbkJsb2NrTGlzdGVuZXIiLCJfb3Blbkdyb3VwSGFuZGxlciIsInN3aXRjaEhhbmRsZXIiLCJfY2xvc2VHcm91cEhhbmRsZXIiLCJjbG9zZUdyb3VwSGFuZGxlciIsIl9jbG9zZUJ0bkxpc3RlbmVyIiwiY2xvc2VCdG5MaXN0ZW5lciIsIl9vdXRlckNsaWNrTGlzdGVuZXIiLCJvdXRlckNsaWNrTGlzdGVuZXIiLCJfb3BlbkVsSGFuZGxlciIsIm9wZW5FbEhhbmRsZXIiLCJfY2xvc2VFbEhhbmRsZXIiLCJjbG9zZUVsSGFuZGxlciIsIl9zdGFydEhhbmRsZXIiLCJzdGFydEhhbmRsZXIiLCJfc3RvcEhhbmRsZXIiLCJzdG9wSGFuZGxlciIsImNsaWNrRXZlbnQiLCJfY2xpY2tFdmVudCIsImlzSU9TIiwiJGxpc3RlbmVkRWwiLCIkdGFyZ2V0Iiwib24iLCJvZmYiLCJyZW1vdmVDbGFzcyIsImRldGFjaEhhbmRsZXJzIiwiZSIsImVsIiwiaXNTYW1lVG9nZ2xlciIsIiRlbCIsImlzVGFyZ2V0IiwiY2xvc2VzdCIsInNjcm9sbEV2ZW50IiwiaXNIaWRkZW4iLCJwcmV2ZW50RGVmYXVsdCIsInNldFRpbWVvdXQiLCJvbmUiLCJjbGVhclRpbWVvdXQiLCJoaWRlRWwiLCJkdXJhdGlvbiIsImNhbGxiYWNrIiwiY29udHJvbGxlciIsInVuZGVmaW5lZCIsInN3aXRjaEVsIiwiaXNPdXRlciIsImFkZCIsIiRjbG9zZUJ0biIsIiRjdXJyVGFyZ2V0IiwiaW5kZXhPZiIsInNob3dDYWxsYmFjayIsInRyaWdnZXIiLCJzaG93Iiwic2xpZGVEb3duIiwiZmFkZUluIiwiaGlkZUNhbGxiYWNrIiwic2xpZGVVcCIsImZhZGVPdXQiLCJzd2l0Y2hDYWxsYmFjayIsInRlc3QiLCJuYXZpZ2F0b3IiLCJ1c2VyQWdlbnQiLCJ3aW5kb3ciLCJNU1N0cmVhbSIsImNzcyIsImZuIiwicXVpZXRNaWxsaXMiLCJiaW5kZWRUaGlzIiwiaXNXYWl0aW5nIiwiZnVuYyIsImFwcGx5IiwiYXJndW1lbnRzIiwia2V5IiwiRGVsZWdhdGVkVG9nZ2xlckNvbnRyb2xsZXIiLCJfJGRlbGVnYXRlZENvbnRhaW5lciIsIiRkZWxlZ2F0ZWRDb250YWluZXIiLCJfakVsZW1lbnRUb2dnbGVyT3B0aW9ucyIsIl9jbGlja0hhbmRsZXIiLCJjbGlja0hhbmRsZXIiLCJqRWxlbWVudFRvZ2dsZXIiLCJfIiwiYXJncyIsIkFycmF5IiwicHJvdG90eXBlIiwic2xpY2UiLCJjYWxsIiwiaSIsImRlbGVnYXRlZCIsImlzQXJyYXkiLCJkZWxlZ2F0ZWRUb2dnbGVyIiwicHVzaCIsInJlc3VsdCJdLCJtYXBwaW5ncyI6IkFBQUM7QUFDRDs7QUFFQztBQUNBOzs7Ozs7Ozs7O0FBQ0QsQ0FBQyxVQUFVQSxPQUFWLEVBQW1CO0FBQ2xCLE1BQUksT0FBT0MsTUFBUCxLQUFrQixVQUFsQixJQUFnQ0EsT0FBT0MsR0FBM0MsRUFBZ0Q7QUFDOUM7QUFDQUQsV0FBTyxDQUFDLFFBQUQsQ0FBUCxFQUFtQkQsT0FBbkI7QUFDRCxHQUhELE1BR08sSUFBSSxRQUFPRyxPQUFQLHlDQUFPQSxPQUFQLE9BQW1CLFFBQXZCLEVBQWlDO0FBQ3RDO0FBQ0FDLFdBQU9ELE9BQVAsR0FBaUJILFFBQVFLLFFBQVEsUUFBUixDQUFSLENBQWpCO0FBQ0QsR0FITSxNQUdBO0FBQ0w7QUFDQUwsWUFBUU0sTUFBUjtBQUNEO0FBQ0YsQ0FYRCxFQVdHLFVBQVVDLENBQVYsRUFBYTtBQUFBLE1BQ1JDLHlCQURRO0FBRVosdUNBQWFDLE9BQWIsRUFBc0I7QUFBQTs7QUFDcEIsV0FBS0MsV0FBTCxHQUFtQkQsUUFBUUUsVUFBUixJQUFzQixJQUF6QztBQUNBLFdBQUtDLFdBQUwsR0FBbUJILFFBQVFJLFVBQVIsSUFBc0JDLFNBQVNDLElBQWxEO0FBQ0E7QUFDQTtBQUNBLFdBQUtDLGVBQUwsR0FBdUJQLFFBQVFRLE1BQVIsSUFBa0IsSUFBekM7QUFDQSxXQUFLQyxVQUFMLEdBQWtCVCxRQUFRVSxTQUFSLElBQXFCLElBQXZDLENBTm9CLENBTXlCO0FBQzdDLFdBQUtDLFVBQUwsR0FBa0JYLFFBQVFZLFNBQVIsSUFBcUIsSUFBdkM7QUFDQSxXQUFLQyxpQkFBTCxHQUF5QmIsUUFBUWMsZ0JBQVIsSUFBNEIsZUFBckQ7QUFDQSxXQUFLQyxVQUFMLEdBQWtCZixRQUFRZ0IsU0FBUixJQUFxQixRQUF2QyxDQVRvQixDQVM4QjtBQUNsRCxXQUFLQyxrQkFBTCxHQUEwQmpCLFFB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LFVBQUksUUFBT3ZMLE9BQVAseUNBQU9BLE9BQVAsT0FBbUIsUUFBdkIsRUFBaUM7QUFDL0IsWUFBSUEsUUFBUXdMLFNBQVosRUFBdUI7QUFDckIsY0FBSSxDQUFDMUwsRUFBRTJMLE9BQUYsQ0FBVVIsRUFBRU0sQ0FBRixFQUFLRyxnQkFBZixDQUFMLEVBQXVDO0FBQ3JDVCxjQUFFTSxDQUFGLEVBQUtHLGdCQUFMLEdBQXdCLEVBQXhCO0FBQ0Q7O0FBRUQxTCxrQkFBUTRLLG1CQUFSLEdBQThCOUssRUFBRW1MLEVBQUVNLENBQUYsQ0FBRixDQUE5QjtBQUNBTixZQUFFTSxDQUFGLEVBQUtHLGdCQUFMLENBQXNCQyxJQUF0QixDQUEyQixJQUFJakIsMEJBQUosQ0FBK0IxSyxPQUEvQixDQUEzQjtBQUNELFNBUEQsTUFPTztBQUNMQSxrQkFBUUUsVUFBUixHQUFxQitLLEVBQUVNLENBQUYsQ0FBckI7QUFDQU4sWUFBRU0sQ0FBRixFQUFLUCxlQUFMLEdBQXVCLElBQUlqTCx5QkFBSixDQUE4QkMsT0FBOUIsQ0FBdkI7QUFDRDs7QUFFRDtBQUNBO0FBQ0QsT0FmRCxNQWVPO0FBQ0wsWUFBSTRMLFNBQVNYLEVBQUVNLENBQUYsRUFBS1AsZUFBTCxDQUFxQmhMLE9BQXJCLEVBQThCc0wsSUFBOUIsQ0FBbUNMLEVBQUVNLENBQUYsRUFBS1AsZUFBeEMsRUFBeURFLElBQXpELENBQWI7O0FBRUEsWUFBSSxPQUFPVSxNQUFQLEtBQWtCLFdBQXRCLEVBQW1DLE9BQU9BLE1BQVA7QUFDcEM7QUFDRjs7QUFFRCxXQUFPWCxDQUFQO0FBQ0QsR0E3QkQ7QUE4QkQsQ0FqbkJEIiwiZmlsZSI6ImpzL2pFbGVtZW50VG9nZ2xlci5lczYuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgLypCbG9ja1RvZ2dsZXIqL1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4gLy9UT0RPINC00L7QsdCw0LLQuNGC0Ywg0LLQvtC30LzQvtC20L3QvtGB0YLRjCDQv9GA0L7Qs9GA0LDQvNC90L7Qs9C+INC00L7QsdCw0LLQu9C10L3QuNGPINCz0YDRg9C/0L9cclxuIC8vVE9ETyDQvdCwINC+0YLQutGA0YvRgtC4L9C30LDQutGA0YvRgtC40LUv0L/QtdGA0LXQutC70Y7Rh9C10L3QuCDQv9GA0Lgg0L/QtdGA0LXQtNCw0YfQtSDQutC+0LvQsdC10LrQsCwg0L7QsdGF0LXQtNC10L3Rj9GC0Ywg0YEg0LrQvtC70LHQtdC60L7QvCDRgNC+0LTQvdGL0LxcclxuKGZ1bmN0aW9uIChmYWN0b3J5KSB7XHJcbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xyXG4gICAgLy8gQU1EIChSZWdpc3RlciBhcyBhbiBhbm9ueW1vdXMgbW9kdWxlKVxyXG4gICAgZGVmaW5lKFsnanF1ZXJ5J10sIGZhY3RvcnkpO1xyXG4gIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XHJcbiAgICAvLyBOb2RlL0NvbW1vbkpTXHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkocmVxdWlyZSgnanF1ZXJ5JykpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICAvLyBCcm93c2VyIGdsb2JhbHNcclxuICAgIGZhY3RvcnkoalF1ZXJ5KTtcclxuICB9XHJcbn0pKGZ1bmN0aW9uICgkKSB7XHJcbiAgY2xhc3MgSkVsZW1lbnRUb2dnbGVyQ29udHJvbGxlciB7XHJcbiAgICBjb25zdHJ1Y3RvciAob3B0aW9ucykge1xyXG4gICAgICB0aGlzLl90b2dnbGVyQnRuID0gb3B0aW9ucy50b2dnbGVyQnRuIHx8IG51bGw7XHJcbiAgICAgIHRoaXMuX2xpc3RlbmVkRWwgPSBvcHRpb25zLmxpc3RlbmVkRWwgfHwgZG9jdW1lbnQuYm9keTtcclxuICAgICAgLy90aGlzLl9kZWxlZ2F0ZWQgPSBvcHRpb25zLmRlbGVnYXRlZCB8fCBmYWxzZTtcclxuICAgICAgLy90aGlzLl9kZWxlZ2F0ZWRDb250YWluZXIgPSBvcHRpb25zLmRlbGVnYXRlZENvbnRhaW5lciB8fCBudWxsO1xyXG4gICAgICB0aGlzLl90YXJnZXRTZWxlY3RvciA9IG9wdGlvbnMudGFyZ2V0IHx8IG51bGw7XHJcbiAgICAgIHRoaXMuX2dldFRhcmdldCA9IG9wdGlvbnMuZ2V0VGFyZ2V0IHx8IG51bGw7IC8vZnVuYywgYXJnOiB0aGlzLl8kdG9nZ2xlckJ0biwgcmV0dXJuOiB0YXJnZXRcclxuICAgICAgdGhpcy5fZ3JvdXBOYW1lID0gb3B0aW9ucy5ncm91cE5hbWUgfHwgbnVsbCA7XHJcbiAgICAgIHRoaXMuX2Nsb3NlQnRuU2VsZWN0b3IgPSBvcHRpb25zLmNsb3NlQnRuU2VsZWN0b3IgfHwgJy5qc19fZXQtY2xvc2UnO1xyXG4gICAgICB0aGlzLl9hbmltYXRpb24gPSBvcHRpb25zLmFuaW1hdGlvbiB8fCAnc2ltcGxlJzsgIC8vICdub25lJywgJ3NpbXBsZScsICdzbGlkZScsICdmYWRlJ1xyXG4gICAgICB0aGlzLl9hbmltYXRpb25EdXJhdGlvbiA9IG9wdGlvbnMuYW5pbWF0aW9uRHVyYXRpb24gfHwgNDAwO1xyXG4gICAgICB0aGlzLl9vcGVuQW5pbWF0aW9uID0gb3B0aW9ucy5vcGVuQW5pbWF0aW9uIHx8IHRoaXMuX2FuaW1hdGlvbjtcclxuICAgICAgdGhpcy5fY2xvc2VBbmltYXRpb24gPSBvcHRpb25zLmNsb3NlQW5pbWF0aW9uIHx8IHRoaXMuX2FuaW1hdGlvbjtcclxuICAgICAgdGhpcy5fc3dpdGNoQW5pbWF0aW9uID0gb3B0aW9ucy5zd2l0Y2hBbmltYXRpb24gfHwgdGhpcy5fYW5pbWF0aW9uO1xyXG4gICAgICB0aGlzLl9vcGVuQW5pbWF0aW9uRHVyYXRpb24gPSBvcHRpb25zLm9wZW5BbmltYXRpb25EdXJhdGlvbiAgfHwgdGhpcy5fYW5pbWF0aW9uRHVyYXRpb24gO1xyXG4gICAgICB0aGlzLl9jbG9zZUFuaW1hdGlvbkR1cmF0aW9uID0gb3B0aW9ucy5jbG9zZUFuaW1hdGlvbkR1cmF0aW9uICB8fCB0aGlzLl9hbmltYXRpb25EdXJhdGlvbiA7XHJcbiAgICAgIHRoaXMuX3N3aXRjaEFuaW1hdGlvbkR1cmF0aW9uID0gb3B0aW9ucy5zd2l0Y2hBbmltYXRpb25EdXJhdGlvbiAgfHwgdGhpcy5fYW5pbWF0aW9uRHVyYXRpb24gO1xyXG4gICAgICB0aGlzLl9vbkJlZm9yZU9wZW4gPSBvcHRpb25zLm9uQmVmb3JlT3BlbiB8fCBudWxsO1xyXG4gICAgICB0aGlzLl9vbkFmdGVyT3BlbiA9IG9wdGlvbnMub25BZnRlck9wZW4gfHwgbnVsbDtcclxuICAgICAgdGhpcy5fb25CZWZvcmVDbG9zZSA9IG9wdGlvbnMub25CZWZvcmVDbG9zZSB8fCBudWxsO1xyXG4gICAgICB0aGlzLl9vbkFmdGVyQ2xvc2UgPSBvcHRpb25zLm9uQWZ0ZXJDbG9zZSB8fCBudWxsO1xyXG4gICAgICB0aGlzLl9vbkJlZm9yZVN3aXRjaCA9IG9wdGlvbnMub25CZWZvcmVTd2l0Y2ggfHwgbnVsbDtcclxuICAgICAgdGhpcy5fb25BZnRlclN3aXRjaCA9IG9wdGlvbnMub25BZnRlclN3aXRjaCB8fCBudWxsO1xyXG4gICAgICB0aGlzLl9vdXRlckNsaWNrQ2xvc2UgPSBvcHRpb25zLm91dGVyQ2xpY2sgfHwgZmFsc2U7XHJcbiAgICAgIHRoaXMuX2Rpc2FsbG93ZWRBY3Rpb25zID0gb3B0aW9ucy5kaXNhbGxvd2VkQWN0aW9ucyB8fCBbXTtcclxuICAgICAgdGhpcy5hY3Rpb25zID0ge1xyXG4gICAgICAgIG9wZW46ICdvcGVuJyxcclxuICAgICAgICBjbG9zZTogJ2Nsb3NlJyxcclxuICAgICAgICBzd2l0Y2g6ICdzd2l0Y2gnXHJcbiAgICAgIH07XHJcbiAgICAgIHRoaXMuX2lzQWN0aXZlID0gZmFsc2U7XHJcbiAgICAgIHRoaXMuX2lzV29ya2luZyA9IGZhbHNlO1xyXG4gICAgICB0aGlzLl9jbGlja0FjdGlvblRpbWVvdXQgPSBudWxsO1xyXG4gICAgICB0aGlzLnVzZXJDbGFzc05hbWUgPSBvcHRpb25zLmNsYXNzTmFtZSB8fCB7fTtcclxuICAgICAgdGhpcy5jbGFzc05hbWUgPSB7XHJcbiAgICAgICAgaW5pdGlhbGl6ZWRUb2dnbGVyOiAnanNfX2V0LXRvZ2dsZXItaW5pdGlhbGl6ZWQnLFxyXG4gICAgICAgIGluaXRpYWxpemVkVGFyZ2V0OiAnanNfX2V0LXRhcmdldC1pbml0aWFsaXplZCcsXHJcbiAgICAgICAgYWN0aXZlOiAnZXQtYWN0aXZlJyxcclxuICAgICAgICBkaXNhYmxlU2Nyb2xsZXI6ICdqc19fc2Nyb2xsLWRpc2FibGUnLFxyXG4gICAgICB9O1xyXG4gICAgICB0aGlzLmV2ZW50cyA9IHtcclxuICAgICAgICBiZWZvcmVPcGVuOiAnakVsZW1lbnRUb2dnbGVyOmJlZm9yZU9wZW4nLFxyXG4gICAgICAgIGFmdGVyT3BlbjogJ2pFbGVtZW50VG9nZ2xlcjphZnRlck9wZW4nLFxyXG4gICAgICAgIGJlZm9yZUNsb3NlOiAnakVsZW1lbnRUb2dnbGVyOmJlZm9yZUNsb3NlJyxcclxuICAgICAgICBhZnRlckNsb3NlOiAnakVsZW1lbnRUb2dnbGVyOmFmdGVyQ2xvc2UnLFxyXG4gICAgICAgIGJlZm9yZVN3aXRjaDogJ2pFbGVtZW50VG9nZ2xlcjpiZWZvcmVTd2l0Y2gnLFxyXG4gICAgICAgIGFmdGVyU3dpdGNoOiAnakVsZW1lbnRUb2dnbGVyOmFmdGVyU3dpdGNoJyxcclxuICAgICAgICBvcGVuR3JvdXA6ICdqRWxlbWVudFRvZ2dsZXI6b3Blbkdyb3VwJyxcclxuICAgICAgICBjbG9zZUdyb3VwOiAnakVsZW1lbnRUb2dnbGVyOmNsb3NlR3JvdXAnLFxyXG5cclxuICAgICAgICAvKm1hbmFnaW5nIGV2ZW50cyovXHJcbiAgICAgICAgb3BlbjogJ2pFbGVtZW50VG9nZ2xlcjpvcGVuJyxcclxuICAgICAgICBjbG9zZTogJ2pFbGVtZW50VG9nZ2xlcjpjbG9zZScsXHJcbiAgICAgICAgc3RhcnQ6ICdqRWxlbWVudFRvZ2dsZXI6c3RhcnQnLFxyXG4gICAgICAgIHN0b3A6ICdqRWxlbWVudFRvZ2dsZXI6c3RvcCdcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHRoaXMuaW5pdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXQoKSB7XHJcbiAgICAgICQuZXh0ZW5kKHRoaXMuY2xhc3NOYW1lLCB0aGlzLnVzZXJDbGFzc05hbWUpO1xyXG4gICAgICB0aGlzLmJpbmRFbGVtZW50cygpO1xyXG5cclxuICAgICAgaWYgKCghdGhpcy5fJHRhcmdldCB8fCAhdGhpcy5fJHRhcmdldC5sZW5ndGgpICYmIHRoaXMuX2FuaW1hdGlvbiAhPT0gJ25vbmUnKSByZXR1cm47IC8vaWYgc3RpbGwgbm8gdGFyZ2V0IHN0b3AgaW5pdCBmdW5jXHJcblxyXG4gICAgICB0aGlzLmJpbmRIYW5kbGVycygpO1xyXG4gICAgICB0aGlzLmF0dGFjaEhhbmRsZXJzKCk7XHJcblxyXG4gICAgICBpZiAodGhpcy5fYW5pbWF0aW9uICE9PSAnbm9uZScpIHsgLy8g0LLQvtC30LzQvtC20L3QviDQu9C40YjQvdC10LUg0YPRgdC70L7QstC40LVcclxuICAgICAgICB0aGlzLl8kdGFyZ2V0LmhpZGUoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHRoaXMuXyR0b2dnbGVyQnRuLmhhc0NsYXNzKHRoaXMuY2xhc3NOYW1lLmFjdGl2ZSkgfHwgdGhpcy5fJHRvZ2dsZXJCdG4uaXMoJzpjaGVja2VkJykpIHtcclxuICAgICAgICB0aGlzLnNob3dFbCgnc2ltcGxlJyk7XHJcbiAgICAgICAgdGhpcy5faXNBY3RpdmUgPSB0cnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLl8kdG9nZ2xlckJ0bi5hZGRDbGFzcyh0aGlzLmNsYXNzTmFtZS5kaXNhYmxlU2Nyb2xsZXIpOyAvL9GE0LjQutGBINC60L7QvdGE0LvQuNC60YLQsCDRgdC+IHNtb290aCBzY3JvbGxcclxuXHJcbiAgICAgIHRoaXMuX2lzV29ya2luZyA9IHRydWU7XHJcbiAgICAgIHRoaXMuX2lzSW5pdGVkID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBiaW5kRWxlbWVudHMoKSB7XHJcbiAgICAgIHRoaXMuXyR0b2dnbGVyQnRuID0gJCh0aGlzLl90b2dnbGVyQnRuKTtcclxuICAgICAgdGhpcy5fJGxpc3RlbmVkRWwgPSAkKHRoaXMuX2xpc3RlbmVkRWwpO1xyXG4gICAgICB0aGlzLl9ncm91cE5hbWUgPSB0aGlzLl9ncm91cE5hbWUgfHwgdGhpcy5fJHRvZ2dsZXJCdG4uYXR0cignZGF0YS1ldC1ncm91cCcpO1xyXG5cclxuICAgICAgaWYgKHR5cGVvZiB0aGlzLl9nZXRUYXJnZXQgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICB0aGlzLl8kdGFyZ2V0ID0gJCh0aGlzLl9nZXRUYXJnZXQodGhpcy5fJHRvZ2dsZXJCdG4sIHRoaXMpKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLl90YXJnZXRTZWxlY3RvciA9IHRoaXMuX3RhcmdldFNlbGVjdG9yIHx8IHRoaXMuXyR0b2dnbGVyQnRuLmF0dHIoJ2RhdGEtZXQtdGFyZ2V0JykgfHwgdGhpcy5fJHRvZ2dsZXJCdG4uYXR0cignaHJlZicpO1xyXG4gICAgICAgIHRoaXMuXyR0YXJnZXQgPSAkKHRoaXMuX3RhcmdldFNlbGVjdG9yKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHRoaXMuXyR0b2dnbGVyQnRuLmlzKCdpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nKSkge1xyXG4gICAgICAgIHRoaXMuaXNDaGVja2JveCA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBiaW5kSGFuZGxlcnMoKSB7XHJcbiAgICAgIGxldCBtYXhBbmltYXRpb25EdXJhdGlvbiA9IHRoaXMuX29wZW5BbmltYXRpb25EdXJhdGlvbiA+PSB0aGlzLl9jbG9zZUFuaW1hdGlvbkR1cmF0aW9uID8gdGhpcy5fb3BlbkFuaW1hdGlvbkR1cmF0aW9uOiB0aGlzLl9jbG9zZUFuaW1hdGlvbkR1cmF0aW9uO1xyXG5cclxuICAgICAgdGhpcy5fZGVib3VuY2VkVG9nZ2xlckhhbmRsZXIgPSB0aGlzLmRlYm91bmNlKHRoaXMudG9nZ2xlckhhbmRsZXIsIG1heEFuaW1hdGlvbkR1cmF0aW9uICsgNSwgdGhpcyk7XHJcbiAgICAgIHRoaXMuX3RvZ2dsZXJDbGlja0hhbmRsZXIgPSB0aGlzLnRvZ2dsZXJDbGlja0hhbmRsZXIuYmluZCh0aGlzKTtcclxuICAgICAgdGhpcy5fY2xlYXJDbGlja0FjdGlvblRpbWVvdXQgPSB0aGlzLmNsZWFyQ2xpY2tBY3Rpb25UaW1lb3V0LmJpbmQodGhpcyk7XHJcbiAgICAgIHRoaXMuX29wZW5CbG9ja0xpc3RlbmVyID0gdGhpcy5vcGVuQmxvY2tMaXN0ZW5lci5iaW5kKHRoaXMpO1xyXG4gICAgICB0aGlzLl9vcGVuR3JvdXBIYW5kbGVyID0gdGhpcy5zd2l0Y2hIYW5kbGVyLmJpbmQodGhpcyk7XHJcbiAgICAgIHRoaXMuX2Nsb3NlR3JvdXBIYW5kbGVyID0gdGhpcy5jbG9zZUdyb3VwSGFuZGxlci5iaW5kKHRoaXMpO1xyXG4gICAgICB0aGlzLl9jbG9zZUJ0bkxpc3RlbmVyID0gdGhpcy5jbG9zZUJ0bkxpc3RlbmVyLmJpbmQodGhpcyk7XHJcbiAgICAgIHRoaXMuX291dGVyQ2xpY2tMaXN0ZW5lciA9IHRoaXMub3V0ZXJDbGlja0xpc3RlbmVyLmJpbmQodGhpcyk7XHJcbiAgICAgIHRoaXMuX29wZW5FbEhhbmRsZXIgPSB0aGlzLm9wZW5FbEhhbmRsZXIuYmluZCh0aGlzKTtcclxuICAgICAgdGhpcy5fY2xvc2VFbEhhbmRsZXIgPSB0aGlzLmNsb3NlRWxIYW5kbGVyLmJpbmQodGhpcyk7XHJcbiAgICAgIHRoaXMuX3N0YXJ0SGFuZGxlciA9IHRoaXMuc3RhcnRIYW5kbGVyLmJpbmQodGhpcyk7XHJcbiAgICAgIHRoaXMuX3N0b3BIYW5kbGVyID0gdGhpcy5zdG9wSGFuZGxlci5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGF0dGFjaEhhbmRsZXJzKCkge1xyXG4gICAgICBsZXQgY2xpY2tFdmVudCA9IHRoaXMuX2NsaWNrRXZlbnQgPSB0aGlzLmlzSU9TKCkgPyAndG91Y2hzdGFydCcgOiAnY2xpY2snO1xyXG4gICAgICBsZXQgJGxpc3RlbmVkRWwgPSB0aGlzLl8kbGlzdGVuZWRFbDtcclxuICAgICAgbGV0ICR0YXJnZXQgPSB0aGlzLl8kdGFyZ2V0O1xyXG5cclxuICAgICAgaWYgKCR0YXJnZXQubGVuZ3RoKSB7XHJcbiAgICAgICAgJHRhcmdldFxyXG4gICAgICAgICAgLm9uKCdjbGljaycsIHRoaXMuX2Nsb3NlQnRuTGlzdGVuZXIpXHJcbiAgICAgICAgICAuYWRkQ2xhc3ModGhpcy5jbGFzc05hbWUuaW5pdGlhbGl6ZWRUYXJnZXQpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodGhpcy5fb3V0ZXJDbGlja0Nsb3NlKSB7XHJcbiAgICAgICAgJGxpc3RlbmVkRWwub24odGhpcy5fY2xpY2tFdmVudCwgdGhpcy5fb3V0ZXJDbGlja0xpc3RlbmVyKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHRoaXMuX2dyb3VwTmFtZSkge1xyXG4gICAgICAgICRsaXN0ZW5lZEVsLm9uKHtcclxuICAgICAgICAgIFt0aGlzLmV2ZW50cy5iZWZvcmVPcGVuXTogdGhpcy5fb3BlbkJsb2NrTGlzdGVuZXIsXHJcbiAgICAgICAgICBbdGhpcy5ldmVudHMub3Blbkdyb3VwXTogdGhpcy5fb3Blbkdyb3VwSGFuZGxlcixcclxuICAgICAgICAgIFt0aGlzLmV2ZW50cy5jbG9zZUdyb3VwXTogdGhpcy5fY2xvc2VHcm91cEhhbmRsZXJcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5fJHRvZ2dsZXJCdG5cclxuICAgICAgICAub24oe1xyXG4gICAgICAgICAgW2NsaWNrRXZlbnRdOiB0aGlzLl9kZWJvdW5jZWRUb2dnbGVySGFuZGxlcixcclxuICAgICAgICAgIFt0aGlzLmV2ZW50cy5vcGVuXTogdGhpcy5fb3BlbkVsSGFuZGxlcixcclxuICAgICAgICAgIFt0aGlzLmV2ZW50cy5jbG9zZV06IHRoaXMuX2Nsb3NlRWxIYW5kbGVyLFxyXG4gICAgICAgICAgW3RoaXMuZXZlbnRzLnN0b3BdOiB0aGlzLl9zdG9wSGFuZGxlclxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmFkZENsYXNzKHRoaXMuY2xhc3NOYW1lLmluaXRpYWxpemVkVG9nZ2xlcik7XHJcblxyXG4gICAgICBpZiAoIXRoaXMuX2lzSW5pdGVkKSB7XHJcbiAgICAgICAgdGhpcy5fJHRvZ2dsZXJCdG5cclxuICAgICAgICAgIC5vbih7XHJcbiAgICAgICAgICAgIFt0aGlzLmV2ZW50cy5zdGFydF06IHRoaXMuX3N0YXJ0SGFuZGxlclxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBkZXRhY2hIYW5kbGVycygpIHtcclxuICAgICAgbGV0IGNsaWNrRXZlbnQgPSB0aGlzLl9jbGlja0V2ZW50ID0gdGhpcy5pc0lPUygpID8gJ3RvdWNoc3RhcnQnIDogJ2NsaWNrJztcclxuICAgICAgbGV0ICRsaXN0ZW5lZEVsID0gdGhpcy5fJGxpc3RlbmVkRWw7XHJcbiAgICAgIGxldCAkdGFyZ2V0ID0gdGhpcy5fJHRhcmdldDtcclxuXHJcbiAgICAgIGlmICgkdGFyZ2V0Lmxlbmd0aCkge1xyXG4gICAgICAgICR0YXJnZXRcclxuICAgICAgICAgIC5vZmYoJ2NsaWNrJywgdGhpcy5fY2xvc2VCdG5MaXN0ZW5lcilcclxuICAgICAgICAgIC5yZW1vdmVDbGFzcyh0aGlzLmNsYXNzTmFtZS5pbml0aWFsaXplZFRhcmdldCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0aGlzLl9vdXRlckNsaWNrQ2xvc2UpIHtcclxuICAgICAgICAkbGlzdGVuZWRFbC5vZmYodGhpcy5fY2xpY2tFdmVudCwgdGhpcy5fb3V0ZXJDbGlja0xpc3RlbmVyKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHRoaXMuX2dyb3VwTmFtZSkge1xyXG4gICAgICAgICRsaXN0ZW5lZEVsLm9mZih7XHJcbiAgICAgICAgICBbdGhpcy5ldmVudHMuYmVmb3JlT3Blbl06IHRoaXMuX29wZW5CbG9ja0xpc3RlbmVyLFxyXG4gICAgICAgICAgW3RoaXMuZXZlbnRzLmNsb3NlR3JvdXBdOiB0aGlzLl9jbG9zZUdyb3VwSGFuZGxlclxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLl8kdG9nZ2xlckJ0blxyXG4gICAgICAgIC5vZmYoe1xyXG4gICAgICAgICAgW2NsaWNrRXZlbnRdOiB0aGlzLl9kZWJvdW5jZWRUb2dnbGVySGFuZGxlcixcclxuICAgICAgICAgIFt0aGlzLmV2ZW50cy5vcGVuXTogdGhpcy5fb3BlbkVsSGFuZGxlcixcclxuICAgICAgICAgIFt0aGlzLmV2ZW50cy5jbG9zZV06IHRoaXMuX2Nsb3NlRWxIYW5kbGVyLFxyXG4gICAgICAgICAgW3RoaXMuZXZlbnRzLnN0b3BdOiB0aGlzLl9zdG9wSGFuZGxlclxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnJlbW92ZUNsYXNzKHRoaXMuY2xhc3NOYW1lLmluaXRpYWxpemVkVG9nZ2xlcik7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhcnQoKSB7XHJcbiAgICAgIGlmICh0aGlzLl9pc1dvcmtpbmcpIHJldHVybjtcclxuXHJcbiAgICAgIHRoaXMuYXR0YWNoSGFuZGxlcnMoKTtcclxuICAgICAgdGhpcy5faXNXb3JraW5nID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBzdG9wKCkge1xyXG4gICAgICBpZiAoIXRoaXMuX2lzV29ya2luZykgcmV0dXJuO1xyXG5cclxuICAgICAgdGhpcy5kZXRhY2hIYW5kbGVycygpO1xyXG4gICAgICB0aGlzLl9pc1dvcmtpbmcgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBzdGFydEhhbmRsZXIoZSkge1xyXG4gICAgICBsZXQgZWwgPSBlLnRhcmdldDtcclxuXHJcbiAgICAgIGlmICghdGhpcy5pc1NhbWVUb2dnbGVyKGVsKSkgcmV0dXJuO1xyXG5cclxuICAgICAgdGhpcy5zdGFydCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0b3BIYW5kbGVyKGUpIHtcclxuICAgICAgbGV0IGVsID0gZS50YXJnZXQ7XHJcblxyXG4gICAgICBpZiAoIXRoaXMuaXNTYW1lVG9nZ2xlcihlbCkpIHJldHVybjtcclxuXHJcbiAgICAgIHRoaXMuc3RvcCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGlzU2FtZVRvZ2dsZXIoZWwpIHtcclxuICAgICAgLy9sZXQgJGVsID0gJChlbCk7XHJcbiAgICAgIC8vbGV0ICRjbG9zZXN0VG9nZ2xlckJ0biA9ICRlbC5jbG9zZXN0KCcuJyArIHRoaXMuY2xhc3NOYW1lLmluaXRpYWxpemVkVG9nZ2xlcik7XHJcblxyXG4gICAgICByZXR1cm4gdGhpcy5fJHRvZ2dsZXJCdG4uaXMoZWwpO1xyXG4gICAgfVxyXG5cclxuICAgIHRvZ2dsZXJIYW5kbGVyKGUpIHtcclxuICAgICAgbGV0ICRlbCA9ICQoZS50YXJnZXQpO1xyXG4gICAgICBsZXQgaXNUYXJnZXQgPSAhISRlbC5jbG9zZXN0KHRoaXMuXyR0YXJnZXQpLmxlbmd0aCAmJiAhJGVsLmlzKHRoaXMuXyR0b2dnbGVyQnRuKTtcclxuICAgICAgbGV0IHNjcm9sbEV2ZW50ID0gdGhpcy5pc0lPUygpID8gJ3RvdWNobW92ZScgOiAnc2Nyb2xsJztcclxuXHJcbiAgICAgIGlmICghdGhpcy5pc0hpZGRlbih0aGlzLl8kdGFyZ2V0KSAmJiB0aGlzLl9hbmltYXRpb24gIT09ICdub25lJykgeyAvL9Cy0L7Qt9C80L7QttC90L4g0YHRgtC+0LjRgiDRgtCw0LrQttC1INGD0LTQsNC70LjRgtGMXHJcbiAgICAgICAgdGhpcy5faXNBY3RpdmUgPSB0cnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodGhpcy5faXNBY3RpdmUgJiYgaXNUYXJnZXQpIHJldHVybjtcclxuXHJcbiAgICAgIGlmICghdGhpcy5pc0lPUygpICYmICF0aGlzLmlzQ2hlY2tib3gpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuY2xlYXJDbGlja0FjdGlvblRpbWVvdXQoKTtcclxuICAgICAgdGhpcy5fY2xpY2tBY3Rpb25UaW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy50b2dnbGVyQ2xpY2tIYW5kbGVyKCk7XHJcbiAgICAgICAgJChkb2N1bWVudCkub2ZmKHNjcm9sbEV2ZW50LCB0aGlzLl9jbGVhckNsaWNrQWN0aW9uVGltZW91dCk7XHJcbiAgICAgIH0uYmluZCh0aGlzKSxcclxuICAgICAgMjAwKTtcclxuXHJcbiAgICAgICQoZG9jdW1lbnQpLm9uZShzY3JvbGxFdmVudCwgdGhpcy5fY2xlYXJDbGlja0FjdGlvblRpbWVvdXQpO1xyXG4gICAgfVxyXG5cclxuICAgIGNsZWFyQ2xpY2tBY3Rpb25UaW1lb3V0KCkge1xyXG4gICAgICBpZiAodGhpcy5fY2xpY2tBY3Rpb25UaW1lb3V0KSB7XHJcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX2NsaWNrQWN0aW9uVGltZW91dCk7XHJcbiAgICAgICAgdGhpcy5fY2xpY2tBY3Rpb25UaW1lb3V0ID0gbnVsbDtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRvZ2dsZXJDbGlja0hhbmRsZXIoKSB7XHJcbiAgICAgIGlmICh0aGlzLl9pc0FjdGl2ZSkge1xyXG4gICAgICAgIHRoaXMuaGlkZUVsKCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5zaG93RWwoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG9wZW5FbEhhbmRsZXIoZSwgYW5pbWF0aW9uLCBkdXJhdGlvbiwgY2FsbGJhY2spIHtcclxuICAgICAgbGV0IGVsID0gZS50YXJnZXQ7XHJcblxyXG4gICAgICBpZiAoIXRoaXMuaXNTYW1lVG9nZ2xlcihlbCkpIHJldHVybjtcclxuXHJcbiAgICAgIHRoaXMuc2hvd0VsKGFuaW1hdGlvbiwgZHVyYXRpb24sIGNhbGxiYWNrKTtcclxuICAgIH1cclxuXHJcbiAgICBjbG9zZUVsSGFuZGxlcihlLCBhbmltYXRpb24sIGR1cmF0aW9uLCBjYWxsYmFjaykge1xyXG4gICAgICBsZXQgZWwgPSBlLnRhcmdldDtcclxuXHJcbiAgICAgIGlmICghdGhpcy5pc1NhbWVUb2dnbGVyKGVsKSkgcmV0dXJuO1xyXG5cclxuICAgICAgdGhpcy5oaWRlRWwoYW5pbWF0aW9uLCBkdXJhdGlvbiwgY2FsbGJhY2spO1xyXG4gICAgfVxyXG5cclxuICAgIG9wZW5CbG9ja0xpc3RlbmVyKGUsIGNvbnRyb2xsZXIpIHtcclxuICAgICAgaWYgKCF0aGlzLl9pc0FjdGl2ZSB8fFxyXG4gICAgICAgIGNvbnRyb2xsZXIuXyR0b2dnbGVyQnRuLmlzKHRoaXMuXyR0b2dnbGVyQnRuKSB8fFxyXG4gICAgICAgIGNvbnRyb2xsZXIuX2dyb3VwTmFtZSAhPT0gdGhpcy5fZ3JvdXBOYW1lIHx8XHJcbiAgICAgICAgY29udHJvbGxlci5fZ3JvdXBOYW1lID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuc3dpdGNoRWwoKTtcclxuICAgIH1cclxuXHJcbiAgICBzd2l0Y2hIYW5kbGVyKGUsIGdyb3VwTmFtZSkge1xyXG4gICAgICBpZiAoZ3JvdXBOYW1lICE9PSB0aGlzLl9ncm91cE5hbWUgfHxcclxuICAgICAgICBncm91cE5hbWUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5zd2l0Y2hFbCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGNsb3NlR3JvdXBIYW5kbGVyKGUsIGdyb3VwTmFtZSkge1xyXG4gICAgICBpZiAoIXRoaXMuX2lzQWN0aXZlIHx8XHJcbiAgICAgICAgZ3JvdXBOYW1lICE9PSB0aGlzLl9ncm91cE5hbWUgfHxcclxuICAgICAgICBncm91cE5hbWUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5oaWRlRWwoKTtcclxuICAgIH1cclxuXHJcbiAgICBvdXRlckNsaWNrTGlzdGVuZXIoZSkge1xyXG4gICAgICAvL2NvbnNvbGUuZGlyKHRoaXMpO1xyXG4gICAgICBpZiAoIXRoaXMuX2lzQWN0aXZlKSByZXR1cm47XHJcblxyXG4gICAgICBsZXQgJGVsID0gJChlLnRhcmdldCk7XHJcbiAgICAgIGxldCBpc091dGVyID0gISRlbC5jbG9zZXN0KHRoaXMuXyR0YXJnZXQuYWRkKHRoaXMuXyR0b2dnbGVyQnRuKSkubGVuZ3RoO1xyXG5cclxuICAgICAgaWYgKCFpc091dGVyKSByZXR1cm47XHJcblxyXG4gICAgICB0aGlzLmhpZGVFbCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGNsb3NlQnRuTGlzdGVuZXIoZSkge1xyXG4gICAgICBsZXQgJGVsID0gJChlLnRhcmdldCk7XHJcbiAgICAgIGxldCAkY2xvc2VCdG4gPSAkZWwuY2xvc2VzdCh0aGlzLl9jbG9zZUJ0blNlbGVjdG9yKTtcclxuXHJcbiAgICAgIGlmICghJGNsb3NlQnRuLmxlbmd0aCkgcmV0dXJuO1xyXG5cclxuICAgICAgbGV0ICRjdXJyVGFyZ2V0ID0gJGNsb3NlQnRuLmNsb3Nlc3QoJy4nICsgdGhpcy5jbGFzc05hbWUuaW5pdGlhbGl6ZWRUYXJnZXQpO1xyXG5cclxuICAgICAgaWYgKCEkY3VyclRhcmdldC5pcyh0aGlzLl8kdGFyZ2V0KSkgcmV0dXJuO1xyXG5cclxuICAgICAgdGhpcy5oaWRlRWwoKTtcclxuICAgIH1cclxuXHJcbiAgICBzaG93RWwoYW5pbWF0aW9uLCBkdXJhdGlvbiwgY2FsbGJhY2spIHtcclxuICAgICAgaWYgKH50aGlzLl9kaXNhbGxvd2VkQWN0aW9ucy5pbmRleE9mKHRoaXMuYWN0aW9ucy5vcGVuKSkgcmV0dXJuO1xyXG5cclxuICAgICAgbGV0ICR0YXJnZXQgPSB0aGlzLl8kdGFyZ2V0O1xyXG4gICAgICBjYWxsYmFjayA9IHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJyA/IGNhbGxiYWNrLmJpbmQodGhpcykgOiB0aGlzLnNob3dDYWxsYmFjay5iaW5kKHRoaXMpO1xyXG4gICAgICBkdXJhdGlvbiA9IGR1cmF0aW9uIHx8IHRoaXMuX29wZW5BbmltYXRpb25EdXJhdGlvbjtcclxuICAgICAgYW5pbWF0aW9uID0gYW5pbWF0aW9uIHx8IHRoaXMuX29wZW5BbmltYXRpb247XHJcblxyXG4gICAgICBpZiAodGhpcy5fJHRvZ2dsZXJCdG4uaXMoJ2lucHV0W3R5cGU9XCJjaGVja2JveFwiXScpKSB7XHJcbiAgICAgICAgdGhpcy5fJHRvZ2dsZXJCdG4uYXR0cignY2hlY2tlZCcsIHRydWUpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuXyR0b2dnbGVyQnRuLmFkZENsYXNzKHRoaXMuY2xhc3NOYW1lLmFjdGl2ZSk7XHJcbiAgICAgIH1cclxuICAgICAgJHRhcmdldC5hZGRDbGFzcyh0aGlzLmNsYXNzTmFtZS5hY3RpdmUpO1xyXG4gICAgICB0aGlzLl9pc0FjdGl2ZSA9IHRydWU7XHJcblxyXG4gICAgICBpZiAodHlwZW9mIHRoaXMuX29uQmVmb3JlT3BlbiA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIHRoaXMuX29uQmVmb3JlT3Blbih0aGlzKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5fJHRvZ2dsZXJCdG4udHJpZ2dlcih0aGlzLmV2ZW50cy5iZWZvcmVPcGVuLCBbdGhpc10pO1xyXG5cclxuICAgICAgc3dpdGNoIChhbmltYXRpb24pIHtcclxuICAgICAgICBjYXNlICdub25lJzpcclxuICAgICAgICAgIGNhbGxiYWNrKCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICdzaW1wbGUnOlxyXG4gICAgICAgICAgJHRhcmdldC5zaG93KCk7XHJcbiAgICAgICAgICBjYWxsYmFjaygpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnc2xpZGUnOlxyXG4gICAgICAgICAgaWYgKCEkdGFyZ2V0Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICBjYWxsYmFjaygpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgJHRhcmdldC5zbGlkZURvd24oZHVyYXRpb24sIGNhbGxiYWNrKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ2ZhZGUnOlxyXG4gICAgICAgICAgaWYgKCEkdGFyZ2V0Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICBjYWxsYmFjaygpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgJHRhcmdldC5mYWRlSW4oZHVyYXRpb24sIGNhbGxiYWNrKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2hvd0NhbGxiYWNrKCkge1xyXG4gICAgICBpZiAodHlwZW9mIHRoaXMuX29uQWZ0ZXJPcGVuID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgdGhpcy5fb25BZnRlck9wZW4odGhpcyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuXyR0b2dnbGVyQnRuLnRyaWdnZXIodGhpcy5ldmVudHMuYWZ0ZXJPcGVuLCBbdGhpc10pO1xyXG5cclxuICAgICAgaWYgKHRoaXMuX291dGVyQ2xpY2tDbG9zZSkge1xyXG4gICAgICAgIHRoaXMuXyRsaXN0ZW5lZEVsLm9uKHRoaXMuX2NsaWNrRXZlbnQsIHRoaXMub3V0ZXJDbGlja0xpc3RlbmVyKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGhpZGVFbChhbmltYXRpb24sIGR1cmF0aW9uLCBjYWxsYmFjaykge1xyXG4gICAgICBpZiAofnRoaXMuX2Rpc2FsbG93ZWRBY3Rpb25zLmluZGV4T2YodGhpcy5hY3Rpb25zLmNsb3NlKSkgcmV0dXJuO1xyXG5cclxuICAgICAgbGV0ICR0YXJnZXQgPSB0aGlzLl8kdGFyZ2V0O1xyXG4gICAgICBjYWxsYmFjayA9IHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJyA/IGNhbGxiYWNrLmJpbmQodGhpcykgOiB0aGlzLmhpZGVDYWxsYmFjay5iaW5kKHRoaXMpO1xyXG4gICAgICBkdXJhdGlvbiA9IGR1cmF0aW9uIHx8IHRoaXMuX2Nsb3NlQW5pbWF0aW9uRHVyYXRpb247XHJcbiAgICAgIGFuaW1hdGlvbiA9IGFuaW1hdGlvbiB8fCB0aGlzLl9jbG9zZUFuaW1hdGlvbjtcclxuXHJcbiAgICAgIGlmICh0aGlzLl8kdG9nZ2xlckJ0bi5pcygnaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJykpIHtcclxuICAgICAgICB0aGlzLl8kdG9nZ2xlckJ0bi5hdHRyKCdjaGVja2VkJywgZmFsc2UpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuXyR0b2dnbGVyQnRuLnJlbW92ZUNsYXNzKHRoaXMuY2xhc3NOYW1lLmFjdGl2ZSk7XHJcbiAgICAgIH1cclxuICAgICAgJHRhcmdldC5yZW1vdmVDbGFzcyh0aGlzLmNsYXNzTmFtZS5hY3RpdmUpO1xyXG4gICAgICB0aGlzLl9pc0FjdGl2ZSA9IGZhbHNlO1xyXG5cclxuICAgICAgaWYgKHR5cGVvZiB0aGlzLl9vbkJlZm9yZUNsb3NlID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgdGhpcy5fb25CZWZvcmVDbG9zZSh0aGlzKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5fJHRvZ2dsZXJCdG4udHJpZ2dlcih0aGlzLmV2ZW50cy5iZWZvcmVDbG9zZSwgW3RoaXNdKTtcclxuXHJcbiAgICAgIHN3aXRjaCAoYW5pbWF0aW9uKSB7XHJcbiAgICAgICAgY2FzZSAnbm9uZSc6XHJcbiAgICAgICAgICBjYWxsYmFjaygpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnc2ltcGxlJzpcclxuICAgICAgICAgICR0YXJnZXQuaGlkZSgpO1xyXG4gICAgICAgICAgY2FsbGJhY2soKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ3NsaWRlJzpcclxuICAgICAgICAgICR0YXJnZXQuc2xpZGVVcChkdXJhdGlvbiwgY2FsbGJhY2spO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnZmFkZSc6XHJcbiAgICAgICAgICAkdGFyZ2V0LmZhZGVPdXQoZHVyYXRpb24sIGNhbGxiYWNrKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaGlkZUNhbGxiYWNrKCkge1xyXG4gICAgICBpZiAodHlwZW9mIHRoaXMuX29uQWZ0ZXJDbG9zZSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIHRoaXMuX29uQWZ0ZXJDbG9zZSh0aGlzKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5fJHRvZ2dsZXJCdG4udHJpZ2dlcih0aGlzLmV2ZW50cy5hZnRlckNsb3NlLCBbdGhpc10pO1xyXG5cclxuICAgICAgaWYgKHRoaXMuX291dGVyQ2xpY2tDbG9zZSkge1xyXG4gICAgICAgIHRoaXMuXyRsaXN0ZW5lZEVsLm9mZih0aGlzLl9jbGlja0V2ZW50LCB0aGlzLm91dGVyQ2xpY2tMaXN0ZW5lcik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzd2l0Y2hFbChhbmltYXRpb24sIGR1cmF0aW9uLCBjYWxsYmFjaykge1xyXG4gICAgICBpZiAofnRoaXMuX2Rpc2FsbG93ZWRBY3Rpb25zLmluZGV4T2YodGhpcy5hY3Rpb25zLnN3aXRjaCkpIHJldHVybjtcclxuXHJcbiAgICAgIGxldCAkdGFyZ2V0ID0gdGhpcy5fJHRhcmdldDtcclxuICAgICAgY2FsbGJhY2sgPSB0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicgPyBjYWxsYmFjay5iaW5kKHRoaXMpIDogdGhpcy5zd2l0Y2hDYWxsYmFjay5iaW5kKHRoaXMpO1xyXG4gICAgICBkdXJhdGlvbiA9IGR1cmF0aW9uIHx8IHRoaXMuX3N3aXRjaEFuaW1hdGlvbkR1cmF0aW9uO1xyXG4gICAgICBhbmltYXRpb24gPSBhbmltYXRpb24gfHwgdGhpcy5fc3dpdGNoQW5pbWF0aW9uO1xyXG5cclxuICAgICAgaWYgKHRoaXMuXyR0b2dnbGVyQnRuLmlzKCdpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nKSkge1xyXG4gICAgICAgIHRoaXMuXyR0b2dnbGVyQnRuLmF0dHIoJ2NoZWNrZWQnLCBmYWxzZSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5fJHRvZ2dsZXJCdG4ucmVtb3ZlQ2xhc3ModGhpcy5jbGFzc05hbWUuYWN0aXZlKTtcclxuICAgICAgfVxyXG4gICAgICAkdGFyZ2V0LnJlbW92ZUNsYXNzKHRoaXMuY2xhc3NOYW1lLmFjdGl2ZSk7XHJcbiAgICAgIHRoaXMuX2lzQWN0aXZlID0gZmFsc2U7XHJcblxyXG4gICAgICBpZiAodHlwZW9mIHRoaXMuX29uQmVmb3JlU3dpdGNoID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgdGhpcy5fb25CZWZvcmVTd2l0Y2godGhpcyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuXyR0b2dnbGVyQnRuLnRyaWdnZXIodGhpcy5ldmVudHMuYmVmb3JlU3dpdGNoLCBbdGhpc10pO1xyXG5cclxuICAgICAgc3dpdGNoIChhbmltYXRpb24pIHtcclxuICAgICAgICBjYXNlICdub25lJzpcclxuICAgICAgICAgIGNhbGxiYWNrKCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICdzaW1wbGUnOlxyXG4gICAgICAgICAgJHRhcmdldC5oaWRlKCk7XHJcbiAgICAgICAgICBjYWxsYmFjaygpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnc2xpZGUnOlxyXG4gICAgICAgICAgJHRhcmdldC5zbGlkZVVwKGR1cmF0aW9uLCBjYWxsYmFjayk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICdmYWRlJzpcclxuICAgICAgICAgICR0YXJnZXQuZmFkZU91dChkdXJhdGlvbiwgY2FsbGJhY2spO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzd2l0Y2hDYWxsYmFjaygpIHtcclxuICAgICAgaWYgKHR5cGVvZiB0aGlzLl9vbkFmdGVyQ2xvc2UgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICB0aGlzLl9vbkFmdGVyU3dpdGNoKHRoaXMpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLl8kdG9nZ2xlckJ0bi50cmlnZ2VyKHRoaXMuZXZlbnRzLmFmdGVyU3dpdGNoLCBbdGhpc10pO1xyXG5cclxuICAgICAgaWYgKHRoaXMuX291dGVyQ2xpY2tDbG9zZSkge1xyXG4gICAgICAgIHRoaXMuXyRsaXN0ZW5lZEVsLm9mZih0aGlzLl9jbGlja0V2ZW50LCB0aGlzLm91dGVyQ2xpY2tMaXN0ZW5lcik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpc0lPUygpIHtcclxuICAgICAgcmV0dXJuIC9pUGFkfGlQaG9uZXxpUG9kLy50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpICYmICF3aW5kb3cuTVNTdHJlYW07XHJcbiAgICB9XHJcblxyXG4gICAgaXNIaWRkZW4oZWwpIHtcclxuICAgICAgbGV0ICRlbCA9ICQoZWwpO1xyXG5cclxuICAgICAgcmV0dXJuICRlbC5pcygnOmhpZGRlbicpIHx8XHJcbiAgICAgICAgJGVsLmNzcygndmlzaWJpbGl0eScpID09PSAnaGlkZGVuJyB8fFxyXG4gICAgICAgICskZWwuY3NzKCdvcGFjaXR5JykgPT09IDA7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0U2VsZigpIHtcclxuICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEZWJvdW5jZXMgYSBmdW5jdGlvbi4gUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgY2FsbHMgdGhlIG9yaWdpbmFsIGZuIGZ1bmN0aW9uIG9ubHkgaWYgbm8gaW52b2NhdGlvbnMgaGF2ZSBiZWVuIG1hZGVcclxuICAgICAqIHdpdGhpbiB0aGUgbGFzdCBxdWlldE1pbGxpcyBtaWxsaXNlY29uZHMuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHF1aWV0TWlsbGlzIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdG8gd2FpdCBiZWZvcmUgaW52b2tpbmcgZm5cclxuICAgICAqIEBwYXJhbSBmbiBmdW5jdGlvbiB0byBiZSBkZWJvdW5jZWRcclxuICAgICAqIEBwYXJhbSBiaW5kZWRUaGlzIG9iamVjdCB0byBiZSB1c2VkIGFzIHRoaXMgcmVmZXJlbmNlIHdpdGhpbiBmblxyXG4gICAgICogQHJldHVybiBkZWJvdW5jZWQgdmVyc2lvbiBvZiBmblxyXG4gICAgICovXHJcbiAgICBkZWJvdW5jZShmbiwgcXVpZXRNaWxsaXMsIGJpbmRlZFRoaXMpIHtcclxuICAgICAgbGV0IGlzV2FpdGluZyA9IGZhbHNlO1xyXG4gICAgICByZXR1cm4gZnVuY3Rpb24gZnVuYygpIHtcclxuICAgICAgICBpZiAoaXNXYWl0aW5nKSByZXR1cm47XHJcblxyXG4gICAgICAgIGlmIChiaW5kZWRUaGlzID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgIGJpbmRlZFRoaXMgPSB0aGlzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm4uYXBwbHkoYmluZGVkVGhpcywgYXJndW1lbnRzKTtcclxuICAgICAgICBpc1dhaXRpbmcgPSB0cnVlO1xyXG5cclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIGlzV2FpdGluZyA9IGZhbHNlO1xyXG4gICAgICAgIH0sIHF1aWV0TWlsbGlzKTtcclxuICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRPcHRpb25zKG9wdGlvbnMpIHtcclxuICAgICAgdGhpcy5kZXRhY2hIYW5kbGVycygpO1xyXG5cclxuICAgICAgZm9yIChsZXQga2V5IGluIG9wdGlvbnMpIHtcclxuICAgICAgICB0aGlzWydfJyArIGtleV0gPSBvcHRpb25zW2tleV07XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuaW5pdCgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY2xhc3MgRGVsZWdhdGVkVG9nZ2xlckNvbnRyb2xsZXIge1xyXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucykge1xyXG4gICAgICB0aGlzLl8kZGVsZWdhdGVkQ29udGFpbmVyID0gb3B0aW9ucy4kZGVsZWdhdGVkQ29udGFpbmVyO1xyXG4gICAgICB0aGlzLl90b2dnbGVyQnRuID0gb3B0aW9ucy50b2dnbGVyQnRuO1xyXG4gICAgICB0aGlzLl9qRWxlbWVudFRvZ2dsZXJPcHRpb25zID0gb3B0aW9ucztcclxuXHJcbiAgICAgIHRoaXMuaW5pdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXQoKSB7XHJcbiAgICAgIHRoaXMuX2pFbGVtZW50VG9nZ2xlck9wdGlvbnMudG9nZ2xlckJ0biA9IG51bGw7XHJcbiAgICAgIHRoaXMuX2NsaWNrSGFuZGxlciA9IHRoaXMuY2xpY2tIYW5kbGVyLmJpbmQodGhpcyk7XHJcbiAgICAgIHRoaXMuXyRkZWxlZ2F0ZWRDb250YWluZXIub24oJ2NsaWNrJywgdGhpcy5fY2xpY2tIYW5kbGVyKTtcclxuICAgIH1cclxuXHJcbiAgICBjbGlja0hhbmRsZXIoZSkge1xyXG4gICAgICBsZXQgdGFyZ2V0ID0gZS50YXJnZXQ7XHJcbiAgICAgIGxldCB0b2dnbGVyQnRuID0gdGFyZ2V0LmNsb3Nlc3QodGhpcy5fdG9nZ2xlckJ0bik7XHJcblxyXG4gICAgICBpZiAoIXRvZ2dsZXJCdG4gfHxcclxuICAgICAgICAodG9nZ2xlckJ0bi5qRWxlbWVudFRvZ2dsZXIgJiYgdG9nZ2xlckJ0bi5qRWxlbWVudFRvZ2dsZXIgaW5zdGFuY2VvZiBKRWxlbWVudFRvZ2dsZXJDb250cm9sbGVyKVxyXG4gICAgICApIHJldHVybjtcclxuXHJcbiAgICAgICQodG9nZ2xlckJ0bikuakVsZW1lbnRUb2dnbGVyKHRoaXMuX2pFbGVtZW50VG9nZ2xlck9wdGlvbnMpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcblxyXG5cclxuICAkLmZuLmpFbGVtZW50VG9nZ2xlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBfID0gdGhpcztcclxuICAgIGxldCBvcHRpb25zID0gYXJndW1lbnRzWzBdIHx8IHt9O1xyXG4gICAgbGV0IGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgXy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgaWYgKG9wdGlvbnMuZGVsZWdhdGVkKSB7XHJcbiAgICAgICAgICBpZiAoISQuaXNBcnJheShfW2ldLmRlbGVnYXRlZFRvZ2dsZXIpKSB7XHJcbiAgICAgICAgICAgIF9baV0uZGVsZWdhdGVkVG9nZ2xlciA9IFtdO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIG9wdGlvbnMuJGRlbGVnYXRlZENvbnRhaW5lciA9ICQoX1tpXSk7XHJcbiAgICAgICAgICBfW2ldLmRlbGVnYXRlZFRvZ2dsZXIucHVzaChuZXcgRGVsZWdhdGVkVG9nZ2xlckNvbnRyb2xsZXIob3B0aW9ucykpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBvcHRpb25zLnRvZ2dsZXJCdG4gPSBfW2ldO1xyXG4gICAgICAgICAgX1tpXS5qRWxlbWVudFRvZ2dsZXIgPSBuZXcgSkVsZW1lbnRUb2dnbGVyQ29udHJvbGxlcihvcHRpb25zKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vb3B0aW9ucy50b2dnbGVyQnRuID0gX1tpXTtcclxuICAgICAgICAvL19baV0uakVsZW1lbnRUb2dnbGVyID0gbmV3IEpFbGVtZW50VG9nZ2xlckNvbnRyb2xsZXIob3B0aW9ucyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IF9baV0uakVsZW1lbnRUb2dnbGVyW29wdGlvbnNdLmNhbGwoX1tpXS5qRWxlbWVudFRvZ2dsZXIsIGFyZ3MpO1xyXG5cclxuICAgICAgICBpZiAodHlwZW9mIHJlc3VsdCAhPT0gJ3VuZGVmaW5lZCcpIHJldHVybiByZXN1bHQ7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gXztcclxuICB9O1xyXG59KTtcclxuIl19
