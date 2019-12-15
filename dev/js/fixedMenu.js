/*Fixed menu class*/
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
  function FixedMenu(options) {
    this._menu = options.menu;
    this._fixedClass = options.fixedClass || 'js__top-fixed';
    this._menuIsFixed = false;
    this._staticMenuPosition = -1;
    this._isPageSearch = options.pageSearch || true;
    this._pageSearchBlock = options.pageSearchBlock || options.menu;
    this._pageSearchClass = options.pageSearchClass || 'active';
    this._activeLink = null;
    this._activeSection = null;
    this._links = null;
    this._throttleDuration = options.delay || 100;
  }

  FixedMenu.prototype.init = function () {
    this._links = this._menu.querySelectorAll('a[href^="#"]');

    var setActiveLinkThrottled = this.throttle(this.setActiveLink, this._throttleDuration).bind(this);

    $(window).on({
      'load': function () {
        this.getStaticMenuPos();
        this.setActiveLink();
      }.bind(this),
      'scroll': function () {
        this.toggleMenuPosition();
        setActiveLinkThrottled();
      }.bind(this),
      'resize': this.getStaticMenuPos.bind(this)
    });
  };
  FixedMenu.prototype.getCoords = function (elem) {
    var box = elem.getBoundingClientRect();

    return {
      top: box.top + pageYOffset,
      left: box.left + pageXOffset
    };
  };
  FixedMenu.prototype.toggleMenuPosition = function (off) {
    var $menu = $(this._menu);

    if ($menu.is(':hidden')) return;

    if (window.pageYOffset <= this._staticMenuPosition && this._menuIsFixed || off) {
      $menu.removeClass(this._fixedClass);
      this._menuIsFixed = false;
      return;
    } else if (window.pageYOffset > this._staticMenuPosition && !this._menuIsFixed) {
      $menu.addClass(this._fixedClass);
      this._menuIsFixed = true;
    }
  };
  FixedMenu.prototype.setActiveLink = function () {
    if (!this._isPageSearch) return;
    if ($(this._menu).is(':hidden')) return;

    var coordsPageSearchBlock = this._pageSearchBlock.getBoundingClientRect();
    var elem = document.elementFromPoint(this._pageSearchBlock.offsetWidth / 2,
      coordsPageSearchBlock.bottom + this.getExtraLength());

    //console.dir(elem);

    if (!elem && this._activeLink) {
      this._activeLink.closest('li').classList.remove(this._pageSearchClass);
      this._activeLink = null;
      this._activeSection = null;
      return;
    } else if (!elem) {
      return;
    }

    if (this._activeLink && this._activeSection && this._activeSection.contains(elem)) {
      return;
    }

    for (var i = 0; i < this._links.length; i++) {
      var href = this._links[i].getAttribute('href');

      if (href.length < 2) continue;

      var targetSection = elem.closest(href);

      if (targetSection) {
        if (this._activeLink) {
          this._activeLink.closest('li').classList.remove(this._pageSearchClass);
        }
        this._activeSection = targetSection;
        this._activeLink = this._links[i];
        this._activeLink.closest('li').classList.add(this._pageSearchClass);
        return;
      }
    }

    if (this._activeLink) {
      this._activeLink.closest('li').classList.remove(this._pageSearchClass);
      this._activeLink = null;
      this._activeSection = null;
    }

  };
  FixedMenu.prototype.getStaticMenuPos = function () {
    if ($(this._menu).is(':hidden')) return;

    this.toggleMenuPosition(true);
    this._staticMenuPosition = this.getCoords(this._menu).top;
    this.toggleMenuPosition();
  };
  FixedMenu.prototype.getExtraLength = function () {
    var pageYOffset = window.pageYOffset || document.documentElement.scrollTop;
    var extraLength = 50;

    if (pageYOffset < 300) { //if it is beginning of start page make meter longer
      extraLength = 100;
    }

    return extraLength;
  };
  FixedMenu.prototype.throttle = function (func, ms) {

    var isThrottled = false,
      savedArgs,
      savedThis;

    function wrapper() {

      if (isThrottled) { // (2)
        savedArgs = arguments;
        savedThis = this;
        return;
      }

      func.apply(this, arguments); // (1)

      isThrottled = true;

      setTimeout(function () {
        isThrottled = false; // (3)
        if (savedArgs) {
          wrapper.apply(savedThis, savedArgs);
          savedArgs = savedThis = null;
        }
      }, ms);
    }

    return wrapper;
  };
  FixedMenu.prototype.getSelf = function () {
    return this;
  };


  $.fn.fixedMenu = function () {
    var _ = this;
    var options = arguments[0];
    var args = Array.prototype.slice.call(arguments, 1);

    for (var i = 0; i < _.length; i++) {
      if (typeof options === 'object' || typeof options === 'undefined') {
        options.menu = _[i];
        _[i].fixedMenu = new FixedMenu(options);
        _[i].fixedMenu.init();
      } else {
        var result = _[i].fixedMenu[options].call(_[i].fixedMenu, args);

        if (typeof result !== 'undefined') return result;
      }

      return _;
    }
  };
}));


/*
jQuery(document).ready(function ($) {
  /!*main menu*!/
  (function () {
    var $menu = $('.js__fixed-menu');

    $menu.each(function () {
      var $currMenu = $(this);

      $currMenu.fixedMenu({
        fixedClass: 'js__top-fixed shadow',
        pageSearch: $currMenu.hasClass('js__fixed-menu-pagesearch'),
        pageSearchBlock: $currMenu.attr('data-fixed-menu-searchtarget') || undefined
      });
    });


    /!*$(menuElem).fixedMenu({
     fixedClass: 'js__top-fixed', //string, default = 'js-top-fixed', class for menu block
     pageSearch: true, //boolean, dafault = true, search blocks by anchors in menu, under menu
     pageSearchBlock: '.someSearchBlock', //dom element , default equal to menu element
     pageSearchClass: 'active', // default = 'active', class for active link
     delay: 100 //default = 100, integrer, delay setting active link on scroll for better perfomance
     });*!/
  })();
});*/
