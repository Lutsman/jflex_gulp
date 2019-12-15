 /*BlockToggler*/
'use strict';

 //TODO добавить возможность програмного добавления групп
 //TODO на открыти/закрытие/переключени при передаче колбека, обхеденять с колбеком родным
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
})(function ($) {
  class ElementTogglerController {
    constructor (options) {
      this._togglerBtn = options.togglerBtn || null;
      this._listenedEl = options.listenedEl || document.body;
      //this._delegated = options.delegated || false;
      //this._delegatedContainer = options.delegatedContainer || null;
      this._targetSelector = options.target || null;
      this._getTarget = options.getTarget || null; //func, arg: this._$togglerBtn, return: target
      this._groupName = options.groupName || null ;
      this._closeBtnSelector = options.closeBtnSelector || '.js__et-close';
      this._animation = options.animation || 'simple';  // 'none', 'simple', 'slide', 'fade'
      this._animationDuration = options.animationDuration || 400;
      this._openAnimation = options.openAnimation || this._animation;
      this._closeAnimation = options.closeAnimation || this._animation;
      this._switchAnimation = options.switchAnimation || this._animation;
      this._openAnimationDuration = options.openAnimationDuration  || this._animationDuration ;
      this._closeAnimationDuration = options.closeAnimationDuration  || this._animationDuration ;
      this._switchAnimationDuration = options.switchAnimationDuration  || this._animationDuration ;
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
        disableScroller: 'js__scroll-disable',
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

    init() {
      $.extend(this.className, this.userClassName);
      this.bindElements();

      if ((!this._$target || !this._$target.length) && this._animation !== 'none') return; //if still no target stop init func

      this.bindHandlers();
      this.attachHandlers();

      if (this._animation !== 'none') { // возможно лишнее условие
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

    bindElements() {
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

    bindHandlers() {
      let maxAnimationDuration = this._openAnimationDuration >= this._closeAnimationDuration ? this._openAnimationDuration: this._closeAnimationDuration;

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

    attachHandlers() {
      let clickEvent = this._clickEvent = this.isIOS() ? 'touchstart' : 'click';
      let $listenedEl = this._$listenedEl;
      let $target = this._$target;

      if ($target.length) {
        $target
          .on('click', this._closeBtnListener)
          .addClass(this.className.initializedTarget);
      }

      if (this._outerClickClose) {
        $listenedEl.on(this._clickEvent, this._outerClickListener);
      }

      if (this._groupName) {
        $listenedEl.on({
          [this.events.beforeOpen]: this._openBlockListener,
          [this.events.openGroup]: this._openGroupHandler,
          [this.events.closeGroup]: this._closeGroupHandler
        });
      }

      this._$togglerBtn
        .on({
          [clickEvent]: this._debouncedTogglerHandler,
          [this.events.open]: this._openElHandler,
          [this.events.close]: this._closeElHandler,
          [this.events.stop]: this._stopHandler
        })
        .addClass(this.className.initializedToggler);

      if (!this._isInited) {
        this._$togglerBtn
          .on({
            [this.events.start]: this._startHandler
          });
      }
    }

    detachHandlers() {
      let clickEvent = this._clickEvent = this.isIOS() ? 'touchstart' : 'click';
      let $listenedEl = this._$listenedEl;
      let $target = this._$target;

      if ($target.length) {
        $target
          .off('click', this._closeBtnListener)
          .removeClass(this.className.initializedTarget);
      }

      if (this._outerClickClose) {
        $listenedEl.off(this._clickEvent, this._outerClickListener);
      }

      if (this._groupName) {
        $listenedEl.off({
          [this.events.beforeOpen]: this._openBlockListener,
          [this.events.closeGroup]: this._closeGroupHandler
        });
      }

      this._$togglerBtn
        .off({
          [clickEvent]: this._debouncedTogglerHandler,
          [this.events.open]: this._openElHandler,
          [this.events.close]: this._closeElHandler,
          [this.events.stop]: this._stopHandler
        })
        .removeClass(this.className.initializedToggler);
    }

    start() {
      if (this._isWorking) return;

      this.attachHandlers();
      this._isWorking = true;
    }

    stop() {
      if (!this._isWorking) return;

      this.detachHandlers();
      this._isWorking = false;
    }

    startHandler(e) {
      let el = e.target;

      if (!this.isSameToggler(el)) return;

      this.start();
    }

    stopHandler(e) {
      let el = e.target;

      if (!this.isSameToggler(el)) return;

      this.stop();
    }

    isSameToggler(el) {
      //let $el = $(el);
      //let $closestTogglerBtn = $el.closest('.' + this.className.initializedToggler);

      return this._$togglerBtn.is(el);
    }

    togglerHandler(e) {
      let $el = $(e.target);
      let isTarget = !!$el.closest(this._$target).length && !$el.is(this._$togglerBtn);
      let scrollEvent = this.isIOS() ? 'touchmove' : 'scroll';

      if (!this.isHidden(this._$target) && this._animation !== 'none') { //возможно стоит также удалить
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
      }.bind(this),
      200);

      $(document).one(scrollEvent, this._clearClickActionTimeout);
    }

    clearClickActionTimeout() {
      if (this._clickActionTimeout) {
        clearTimeout(this._clickActionTimeout);
        this._clickActionTimeout = null;
      }
    }

    togglerClickHandler() {
      if (this._isActive) {
        this.hideEl();
      } else {
        this.showEl();
      }
    }

    openElHandler(e, animation, duration, callback) {
      let el = e.target;

      if (!this.isSameToggler(el)) return;

      this.showEl(animation, duration, callback);
    }

    closeElHandler(e, animation, duration, callback) {
      let el = e.target;

      if (!this.isSameToggler(el)) return;

      this.hideEl(animation, duration, callback);
    }

    openBlockListener(e, controller) {
      if (!this._isActive ||
        controller._$togglerBtn.is(this._$togglerBtn) ||
        controller._groupName !== this._groupName ||
        controller._groupName === undefined) {
        return;
      }

      this.switchEl();
    }

    switchHandler(e, groupName) {
      if (groupName !== this._groupName ||
        groupName === undefined) {
        return;
      }

      this.switchEl();
    }

    closeGroupHandler(e, groupName) {
      if (!this._isActive ||
        groupName !== this._groupName ||
        groupName === undefined) {
        return;
      }

      this.hideEl();
    }

    outerClickListener(e) {
      //console.dir(this);
      if (!this._isActive) return;

      let $el = $(e.target);
      let isOuter = !$el.closest(this._$target.add(this._$togglerBtn)).length;

      if (!isOuter) return;

      this.hideEl();
    }

    closeBtnListener(e) {
      let $el = $(e.target);
      let $closeBtn = $el.closest(this._closeBtnSelector);

      if (!$closeBtn.length) return;

      let $currTarget = $closeBtn.closest('.' + this.className.initializedTarget);

      if (!$currTarget.is(this._$target)) return;

      this.hideEl();
    }

    showEl(animation, duration, callback) {
      if (~this._disallowedActions.indexOf(this.actions.open)) return;

      let $target = this._$target;
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

    showCallback() {
      if (typeof this._onAfterOpen === 'function') {
        this._onAfterOpen(this);
      }

      this._$togglerBtn.trigger(this.events.afterOpen, [this]);

      if (this._outerClickClose) {
        this._$listenedEl.on(this._clickEvent, this.outerClickListener);
      }
    }

    hideEl(animation, duration, callback) {
      if (~this._disallowedActions.indexOf(this.actions.close)) return;

      let $target = this._$target;
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

    hideCallback() {
      if (typeof this._onAfterClose === 'function') {
        this._onAfterClose(this);
      }

      this._$togglerBtn.trigger(this.events.afterClose, [this]);

      if (this._outerClickClose) {
        this._$listenedEl.off(this._clickEvent, this.outerClickListener);
      }
    }

    switchEl(animation, duration, callback) {
      if (~this._disallowedActions.indexOf(this.actions.switch)) return;

      let $target = this._$target;
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

    switchCallback() {
      if (typeof this._onAfterClose === 'function') {
        this._onAfterSwitch(this);
      }

      this._$togglerBtn.trigger(this.events.afterSwitch, [this]);

      if (this._outerClickClose) {
        this._$listenedEl.off(this._clickEvent, this.outerClickListener);
      }
    }

    isIOS() {
      return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    }

    isHidden(el) {
      let $el = $(el);

      return $el.is(':hidden') ||
        $el.css('visibility') === 'hidden' ||
        +$el.css('opacity') === 0;
    }

    getSelf() {
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
    debounce(fn, quietMillis, bindedThis) {
      let isWaiting = false;
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

    setOptions(options) {
      this.detachHandlers();

      for (let key in options) {
        this['_' + key] = options[key];
      }

      this.init();
    }
  }

  class DelegatedTogglerController {
    constructor(options) {
      this._$delegatedContainer = options.$delegatedContainer;
      this._togglerBtn = options.togglerBtn;
      this._jElementTogglerOptions = options;

      this.init();
    }

    init() {
      this._jElementTogglerOptions.togglerBtn = null;
      this._clickHandler = this.clickHandler.bind(this);
      this._$delegatedContainer.on('click', this._clickHandler);
    }

    clickHandler(e) {
      let target = e.target;
      let togglerBtn = target.closest(this._togglerBtn);

      if (!togglerBtn ||
        (togglerBtn.jElementToggler && togglerBtn.jElementToggler instanceof ElementTogglerController)
      ) return;

      $(togglerBtn).jElementToggler(this._jElementTogglerOptions);
    }
  }

  $.fn.ElementToggler = function () {
    let _ = this;
    let options = arguments[0] || {};
    let args = Array.prototype.slice.call(arguments, 1);

    for (let i = 0; i < _.length; i++) {
      if (typeof options === 'object') {
        if (options.delegated) {
          if (!$.isArray(_[i].delegatedToggler)) {
            _[i].delegatedToggler = [];
          }

          options.$delegatedContainer = $(_[i]);
          _[i].delegatedToggler.push(new DelegatedTogglerController(options));
        } else {
          options.togglerBtn = _[i];
          _[i].jElementToggler = new ElementTogglerController(options);
        }
      } else {
        let result = _[i].jElementToggler[options].call(_[i].jElementToggler, args);

        if (typeof result !== 'undefined') return result;
      }
    }

    return _;
  };
});
