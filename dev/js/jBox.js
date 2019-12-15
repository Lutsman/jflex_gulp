'use strict';

/*
 * jBox
 * v 1.4
 * */

//TODO плавную смену окон
//TODO правильное позиционирование при смене окон
//TODO разобраться с sku функцией, с anchortarget понять есть ли жизнь на Марсе?
//TODO init или хотя-бы render по требованию
//TODO переработать showEl, что-бы можно было скармливать не только блок но и строку
//TODO сделать возможность сипользования галереи не только для картинок
//TODO вынести определение опций для каждого слайдера из showEl, передавать в showblock только опции


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
  var Gallery = function () {
    function Gallery(options) {
      _classCallCheck(this, Gallery);

      this.className = options.className;
      this.indexCurrent = 0;
      this.targetEl = options.targetEl;
      this.jboxObj = options.jbox;
      this.tpl = {
        controlTpl: '<div class="jbox-control"><span class="prev"></span><span class="next"></span></div>'
      };

      this.init();
    }

    _createClass(Gallery, [{
      key: 'init',
      value: function init() {
        var elements = $('a.jbox.' + this.className);
        var gallerySrc = this.gallerySrc = this.getGallerySrc(elements);

        if (!gallerySrc.length) return;

        var imgCurrent = this.imgCurrent = $('img', this.jboxObj.inner);
        var control = this.control = $(this.tpl.controlTpl);
        this.indexCurrent = parseInt(gallerySrc.indexOf(this.targetEl.attr('href')));
        this.indexSumm = gallerySrc.length - 1;

        imgCurrent.after(control);

        /*TODO необходимо сделать этот эффект при помощи css*/
        $('span', control).hover(function () {
          $(this).animate({ opacity: 1 }, 150);
        }, function () {
          $(this).animate({ opacity: 0 }, 50);
        });

        // control
        control.on('click', this.controlHandler.bind(this));
      }
    }, {
      key: 'controlHandler',
      value: function controlHandler(e) {
        var el = e.target;
        var prevBtn = $(el).closest('.prev');
        var nextBtn = $(el).closest('.next');

        if (prevBtn.length) {
          this.changeImg('prev');
          return;
        }

        if (nextBtn.length) {
          this.changeImg('next');
          return;
        }
      }
    }, {
      key: 'changeImg',
      value: function changeImg(direction) {
        var _this = this;

        switch (direction) {
          case 'prev':
            this.indexCurrent = this.indexCurrent > 0 ? --this.indexCurrent : this.indexSumm;
            break;
          case 'next':
            this.indexCurrent = this.indexCurrent >= this.indexSumm ? 0 : ++this.indexCurrent;
            break;
        }

        var imgUrl = this.gallerySrc[this.indexCurrent];
        var img = this.imgCurrent;

        // tmp img for validate downloads img
        var tmpimg = $('<img/>');
        var isLoadedImg = false;
        tmpimg.css({
          'display': 'none'
        }).appendTo($('body'));

        tmpimg.on('load', function () {
          isLoadedImg = true;
          tmpimg.remove();
        });

        tmpimg[0].src = imgUrl;

        img.fadeTo(300, 0.1, function () {
          if (isLoadedImg) {
            img.attr('src', imgUrl).fadeTo(250, 1);
            _this.jboxObj.jboxPosAbsolute.apply(_this.jboxObj, [true, true]);
          } else {
            tmpimg.on('load', function () {
              img.attr('src', imgUrl).fadeTo(250, 1);

              _this.jboxObj.jboxPosAbsolute.apply(_this.jboxObj, [true, true]);
            });
          }
        });
      }
    }, {
      key: 'getGallerySrc',
      value: function getGallerySrc($links) {
        var src = [];

        $links.each(function () {
          var $el = $(this);
          var currSrc = $el.attr('href');

          if (~src.indexOf(currSrc)) return;

          src.push(currSrc);
        });

        return src;
      }
    }]);

    return Gallery;
  }();

  var JBoxController = function () {
    function JBoxController(options) {
      _classCallCheck(this, JBoxController);

      this.gallerySelector = options.gallerySelector || '[class*="gallery-"]';
      this.targetSelectorsArr = options.targetSelectorsArr || ['.jbox', '#p-tbl-compact a:not(.anchor, .no-jbox)', '#p-tbl a:not(.anchor, [target="_blank"], .no-jbox)', 'a.buy'];
      this.jPageEventLive = options.jPageEventLive || true;
      this.jeventEvent = 'playScenario';
      this.jeventOpeningMethod = 'jBox';
      this.zoomEnabled = false;
      this.disableCloseBtnHandler = false;
      this.disableOverlayHandler = false;
      this.viewPortContentZoom = options.viewPortContentZoom || 'width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=5.0, user-scalable=yes';
      this.tpl = options.tpl;
      this._tplDefault = {
        holderTpl: '<div id="jbox-holder" class="jbox-holder hide loading"></div>',
        innerWrapTpl: '<div class="inner-wrap"></div>',
        innerTpl: '<div class="inner"></div>',
        closeBtnTpl: '<div id="jbox-close" class="jbox-close"></div>',
        overlayTpl: '<div id="jbox-overlay" class="jbox-overlay hide" />',
        imgTpl: '<img class="jimage" src="#" />',
        captionTpl: '<div class="jbox-caption center"></div>',
        overImpTpl: '<div class="overimg"></div>'
      };
      this.classList = options.classList;
      this._classListDefault = {
        active: 'active',
        triggerFullscreen: 'jbox-anchor-fullscreen',
        triggerNopadding: 'jbox-anchor-nopadding',
        triggerNoBg: 'jbox-anchor-nobg',
        triggerWhiteBg: 'jbox-anchor-bg-white',
        fullScreen: 'jbox-fullscreen',
        nopadding: 'jbox-nopadding',
        noBg: 'jbox-bg-nobg',
        whiteBg: 'jbox-bg-white'
      };
      this.beforeOpenEvent = 'jBox:beforeOpen';
      this.afterOpenEvent = 'jBox:afterOpen';
      this.beforeCloseEvent = 'jBox:beforeClose';
      this.afterCloseEvent = 'jBox:afterClose';
      this.beforeCleanEvent = 'jBox:beforeClean';
      this.afterCleanEvent = 'jBox:afterClean';

      this.init();
    }

    _createClass(JBoxController, [{
      key: 'init',
      value: function init() {
        this.targetSelectors = this.targetSelectors || this.targetSelectorsArr.join(', ');
        this.tpl = $.extend(true, {}, this._tplDefault, this.tpl);
        this.classList = $.extend(true, {}, this._classListDefault, this.classList);

        this.renderJbox();

        if ($(this.gallerySelector).length) {
          this.prepareGalleryClasses();
        }

        $('body').on('click', this.showHandler.bind(this));

        this.overlay.add(this.closeBtn).on('click', this.closeHandler.bind(this));

        /*jPageEventLive support*/
        $('body').on(this.jeventEvent, this.jeventHandler.bind(this));

        /*open on url*/
        var selector = this.parseUrl();

        if (selector) {
          this.jboxhtml(selector);
        }

        /*viewport caching*/
        this.$viewPort = $('meta[name="viewport"]');
        this.viewPortContent = this.$viewPort.attr('content');
      }
    }, {
      key: 'renderJbox',
      value: function renderJbox() {
        var $parent = $('#page').length ? $('#page') : $('body');
        this.holder = $(this.tpl.holderTpl);
        this.overlay = $(this.tpl.overlayTpl);
        this.innerWrap = $(this.tpl.innerWrapTpl);
        this.inner = $(this.tpl.innerTpl);
        this.closeBtn = $(this.tpl.closeBtnTpl);

        $parent.append(this.overlay).append(this.holder);

        this.innerWrap.append(this.inner);
        this.holder.append(this.innerWrap).append(this.closeBtn);
      }
    }, {
      key: 'getGalleryClass',
      value: function getGalleryClass(el) {
        if (!el || !this.isElement(el[0])) return;

        var objClass = el.attr('class').split(/\s+/);
        var className = null;

        jQuery.each(objClass, function (index, item) {
          if (!~item.indexOf('gallery-')) return;

          className = item;
        });

        return className;
      }
    }, {
      key: 'prepareGalleryClasses',
      value: function prepareGalleryClasses() {
        var _this2 = this;

        var galleries = this.galleries = $(this.gallerySelector).not('a');

        galleries.each(function (index, item) {
          var gallery = jQuery(item);
          var className = _this2.getGalleryClass(gallery);

          if (!className) return;

          jQuery('a.jbox', gallery).each(function (index, item) {
            jQuery(item).addClass(className);
          });
        });
      }
    }, {
      key: 'renderGallery',
      value: function renderGallery(className) {
        var _ = this;
        var options = {
          className: className,
          indexCurrent: 0,
          targetEl: _.triggerBlock,
          jbox: _
        };

        this._onKeyDown = this.onKeyDown.bind(this);

        /*creating gallery object*/
        _.gallery = new Gallery(options);

        // Events when you press forward / backward.
        _.holder.hover(_.onMouseenter.bind(_), _.onMouseLeave.bind(_));

        //Enable swiping...
        _.holder.swipe({
          //Generic swipe handler for all directions
          swipe: _.onSwipe.bind(_)
        });
      }
    }, {
      key: 'showHandler',
      value: function showHandler(e) {
        var targetSelector = this.targetSelectorsArr.join(', ');
        var el = e.target;
        var target = $(el).closest(targetSelector);

        if (!target.length) return;
        e.preventDefault();

        this.showBlock(target);
      }
    }, {
      key: 'jeventHandler',
      value: function jeventHandler(e, scenario) {
        if (!scenario || scenario.openingMethod !== this.jeventOpeningMethod) return;

        var target = scenario.target;
        var caption = scenario.caption;
        var $target = $(target);

        if (!target) return;

        if ($target.is(this.targetSelectors)) {
          this.showBlock($target);
          return;
        }

        if (typeof target === 'string') {
          if (target.match(/\.(png|jpg|jpeg|gif)/g)) {
            this.clean();
            this.jboximg(target, caption);
            return;
          } else if ($('#sku-' + target).length) {
            this.clean();
            this.jboxsku(target);
            return;
          }
        }

        if ($target.is('img')) {
          this.clean();
          this.jboximg($target.attr('src'), $target.attr('title'));
        }

        if ($target.length) {
          this.clean();
          this.jboxhtml(target);
          return;
        }
      }
    }, {
      key: 'closeHandler',
      value: function closeHandler(e) {
        var $el = $(e.target);

        if ($el.is(this.closeBtn) && !this.disableCloseBtnHandler) {
          this.hideBlock();
          return;
        }

        if ($el.is(this.overlay) && !this.disableOverlayHandler) {
          this.hideBlock();
          return;
        }
      }
    }, {
      key: 'onMouseenter',
      value: function onMouseenter() {
        $(document).on('keydown', this._onKeyDown);
      }
    }, {
      key: 'onMouseLeave',
      value: function onMouseLeave() {
        $(document).off('keydown', this._onKeyDown);
      }
    }, {
      key: 'onKeyDown',
      value: function onKeyDown(e) {
        switch (e.keyCode ? e.keyCode : e.which) {
          case 37:
            // Left Arrow
            e.preventDefault();
            this.gallery.changeImg('prev');
            break;
          case 39:
            // Right Arrow
            e.preventDefault();
            this.gallery.changeImg('next');
            break;
        }
      }
    }, {
      key: 'onSwipe',
      value: function onSwipe(event, direction, distance, duration, fingerCount, fingerData) {
        switch (direction) {
          case 'left':
            this.gallery.changeImg('next');
            break;
          case 'right':
            this.gallery.changeImg('prev');
            break;
        }
      }
    }, {
      key: 'open',
      value: function open(options) {
        var _this3 = this;

        if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) !== 'object') return;

        var href = options.href;
        var $target = $(href);
        var content = options.content;
        var customHolderClass = options.customHolderClass || '';
        var customOverlayClass = options.customOverlayClass || '';

        if (!$target.length && !content) return;

        var openHandler = function openHandler() {
          _this3.disableCloseBtnHandler = options.disableCloseBtnHandler || false;
          _this3.disableOverlayHandler = options.disableOverlayHandler || false;

          _this3.clean();
          _this3.holder.addClass(customHolderClass);
          _this3.overlay.addClass(customOverlayClass);

          if (!href && content) {
            var $contentWrapper = $('<div></div>');

            $contentWrapper.append(content);
            _this3.inner.append($contentWrapper);
            _this3.jboxhtml($contentWrapper);
            return;
          } else if (typeof href === 'string' && !$target.length) {
            if (href.match(/\.(png|jpg|jpeg|gif)/g)) {
              _this3.jboximg(href, content);
              return;
            } else if ($('#sku-' + href).length) {
              _this3.jboxsku(href);
              return;
            }
          } else if ($target.length) {
            if ($target.is('img')) {
              _this3.jboximg($target.attr('src'), $target.attr('title'));
              return;
            } else {
              _this3.jboxhtml($target);
              return;
            }
          }
        };

        if (this.isClosing) {
          //this.holder.one(this.afterCloseEvent, function() { setTimeout(function() {openHandler();}, 100); });
          setTimeout(openHandler.bind(this), 300);
        } else {
          openHandler();
        }
      }
    }, {
      key: 'close',
      value: function close() {
        //
        this.hideBlock();
      }
    }, {
      key: 'showBlock',
      value: function showBlock(block) {
        //open based on triggered element
        this.clean();

        var triggerBlock = this.triggerBlock = jQuery(block);
        var urltype = triggerBlock.attr('href') || triggerBlock.attr('data-jbox-target');
        var objtype = triggerBlock.attr('src');
        var productsku = triggerBlock.attr('id');
        var classList = this.classList;

        this.holder.addClass(classList.active);

        if (triggerBlock.hasClass(classList.triggerFullscreen)) {
          this.holder.addClass(classList.fullScreen);
        } else if (triggerBlock.hasClass(classList.triggerNopadding)) {
          this.holder.addClass(classList.nopadding);
        } else if (triggerBlock.hasClass(classList.triggerNoBg)) {
          this.overlay.addClass(classList.noBg);
        } else if (triggerBlock.hasClass(classList.triggerWhiteBg)) {
          this.overlay.addClass(classList.whiteBg);
        }

        if (urltype) {
          if (urltype.match(/\.(png|jpg|jpeg|gif)/g)) {
            this.jboximg(urltype, triggerBlock.attr('title'));
          } else if ($(urltype).length) {
            this.jboxhtml(urltype);
          }
        }

        if (objtype && objtype.match(/\.(png|jpg|jpeg|gif)/g)) {
          this.jboximg(objtype, triggerBlock.attr('title'));
        }

        if (productsku) {
          this.jboxsku(productsku);
        }
      }

      /**
       * Проверка на сущ. gallery
       * Необходимо каждой фотке указать класс gallery-XXX для группировки фото в галлереи
       */

    }, {
      key: 'jboximg',
      value: function jboximg(src, captionText) {
        var _this4 = this;

        var imgUrl = src.replace('#', '');
        var tmpImg = $('<img/>');
        var $caption = captionText ? $(this.tpl.captionTpl).text(captionText) : '';

        //this.inner.html(''); //уже почистили
        this.holder.addClass('image');

        this.inner.append(this.tpl.imgTpl).append($caption).append(this.tpl.overImpTpl);

        this.img = jQuery('img', this.inner);
        this.img.hide().attr('src', imgUrl);

        tmpImg[0].src = imgUrl;
        $('body').append(tmpImg);

        tmpImg.on('load', function () {
          _this4.img.show();
          _this4.jboxPosAbsolute(false, true);
          tmpImg.remove();
        });

        //this.jboxPosAbsolute();

        // Определяем класс обвертки
        var className = this.getGalleryClass(this.triggerBlock);

        // Проверка на сущ. gallery
        if (className) {
          this.renderGallery(className);
        }
      }
    }, {
      key: 'jboxhtml',
      value: function jboxhtml(selector) {
        var $target = this.target = $(selector);
        var innerid = typeof selector === 'string' ? selector.replace('#', '') : '';

        if (!$target.length) return;

        this.parentElement = $target.parent();
        this.holder.removeClass('loading');

        if (innerid == 'advantages') {
          var targetClone = $target.clone(true, true);

          targetClone.removeClass('hide');
          this.inner.append(targetClone);
        } else {
          this.inner.append($target);
        }

        if ($target.is(':hidden')) {
          $target.attr('data-cashed-style', $target.attr('style'));
          $target.show();
          this.isHiddenTarget = true;
        }

        this.jboxPosAbsolute();
      }
    }, {
      key: 'jboxsku',
      value: function jboxsku(productsku) {
        var innerid = '#sku-' + productsku;

        if (!$(innerid).length) return;

        this.parentElement = $(innerid).parent();
        this.target = $('.p-reference ' + innerid); /// $('.p-reference ' + innerid);  чем отличается id и класс + id, с учетом того, что на странице уникальные id
        this.target.appendTo(this.inner);
        this.jboxPosAbsolute();
      }

      // размещаем по центру экрана

    }, {
      key: 'jboxPosAbsolute',
      value: function jboxPosAbsolute(noAnimate, img) {
        var _this5 = this;

        var holder = this.holder;
        var inner = this.inner;
        var innerImg = holder.find('img');
        var caption = holder.find('.jbox-caption');
        var isFullScreen = false;
        var _jboxPosAbsolute = this._jboxPosAbsolute;

        if (!holder || !holder.length || !$(this.inner).html()) return;

        var scrollWidth = this.getScrollBarWidth();

        if (typeof _jboxPosAbsolute === 'function') {
          $(window).off('resize', _jboxPosAbsolute);
        }

        _jboxPosAbsolute = this._jboxPosAbsolute = this.jboxPosAbsolute.bind(this, true, img);

        $(window).on('resize', _jboxPosAbsolute);

        holder.trigger(this.beforeOpenEvent);

        $('html, body').css({
          'overflow': 'hidden',
          'position': 'relative'
        });
        $('body').css({
          'padding-right': scrollWidth + 'px'
        });

        var wh = document.documentElement.clientHeight;
        var ww = document.documentElement.clientWidth;

        //сбрасываем положение
        holder.css({
          'position': 'fixed',
          'display': 'block',
          'top': '-10000px',
          'left': '-10000px',
          'visibility': 'hidden',
          'width': '',
          'height': '',
          'max-width': '',
          'max-height': '',
          'margin': '',
          'overflowY': ''
        }).removeClass('compact');
        inner.css({
          'top': ''
        });

        if (img) {
          innerImg.css({
            'width': '',
            'height': ''
          });

          if (caption.length) {
            caption.css({
              'max-width': ''
            });
          }
        }

        var holderH = holder.outerHeight();
        var resultH = holderH;

        // Для изображения делаем высоту не больше экрана
        if (img) {
          if (holderH >= wh) {
            var innerFreeSpace = inner.height();
            if (caption.length) {
              innerFreeSpace -= caption.height();
            }

            holder.css('height', wh + 'px');
            innerImg.css('height', wh - (holderH - innerFreeSpace) + 'px');
            holderH = wh;
            resultH = wh;

            if (innerImg.width() < caption.width()) {
              var maxCaptionWidth = wh > innerImg.width() * 4 ? innerImg.width() * 2 : innerImg.width();

              caption.css({
                'max-width': maxCaptionWidth + 'px'
              });
              innerFreeSpace = inner.height() - caption.height();
              innerImg.css({
                'height': wh - (holderH - innerFreeSpace) + 'px',
                'margin': 'auto',
                'display': 'block'
              });
            }
          }

          this.enableZoom();
        }

        if (!img && holderH >= wh) {
          holder.css({
            'height': wh + 'px',
            'max-width': '100%',
            'overflowY': 'auto'
          });

          resultH = wh;
          isFullScreen = true;
        }

        var holderW = holder.outerWidth();
        var resultW = holderW;

        if (holderW >= ww) {
          holder.addClass('compact').css({
            'height': wh + 'px',
            'max-width': '100%',
            'overflowY': 'auto'
          });
          if (img) {
            innerImg.css({
              'max-width': '100%',
              'width': 'auto',
              'margin': 'auto'
            });
          } /* else {
             inner.children().eq(0).css({
               'max-width': '100%',
               'width': 'auto'
             });
            }*/
          resultW = ww;
          isFullScreen = true;
        }

        var top = wh - holderH > 0 ? wh / 2 - resultH / 2 : 0;
        var left = ww - holderW > 0 ? ww / 2 - resultW / 2 : 0;

        if (isFullScreen) {
          top = 0;

          var innerH = inner.outerHeight();
          var innerWrapH = holder.find('.inner-wrap').height();

          /*center inner in holder*/
          if (innerH < innerWrapH) {
            inner.css({
              'top': innerWrapH / 2 - innerH / 2 + 'px'
            });
          }
        }

        holder.css({
          'top': top + 'px',
          'left': left + 'px',
          'visibility': 'visible',
          'display': 'none',
          'position': 'fixed'
        });

        if (!noAnimate) {
          if (this.disableCloseBtnHandler) {
            this.closeBtn.hide();
          }

          this.overlay.fadeIn(200);
          holder.delay(250).fadeIn(200, function () {
            _this5.refreshSlider();
            holder.trigger(_this5.afterOpenEvent);
          }).removeClass('loading');
        } else {
          holder.show();
          this.refreshSlider();
          holder.trigger(this.afterOpenEvent);
        }
      }
    }, {
      key: 'clean',
      value: function clean() {
        this.holder.trigger(this.beforeCleanEvent);

        //jQuery(this).parent('.anchortarget').hide();
        if (this.isHiddenTarget) {
          var cashedStyles = this.target.attr('data-cashed-style') || '';
          this.target.attr('style', cashedStyles);
          this.target.removeAttr('data-cashed-style');
          this.isHiddenTarget = false;
        }

        if (this.parentElement && this.parentElement.length) {
          this.parentElement.append(this.target);
        }
        this.inner.empty();
        this.parentElement = null;
        this.target = null;
        this.triggerBlock = null;

        //$('body').removeClass('m-view');
        $('html, body').css({
          'padding-right': '',
          'overflow': '',
          'position': '',
          'height': ''
        });

        this.holder.css({
          'position': 'absolute',
          'display': 'block',
          'top': '-10000px',
          'left': '-10000px',
          'visibility': 'hidden',
          'width': 'auto',
          'height': 'auto',
          'max-width': 'none',
          'margin': '0',
          'overflowY': ''
        });

        this.inner.css({
          'top': ''
        });

        this.holder[0].className = 'jbox-holder hide loading';
        this.overlay[0].className = 'jbox-overlay hide';

        this.holder.trigger(this.afterCleanEvent);

        $(window).off('resize', this._jboxPosAbsolute);

        this.disableZoom();
      }
    }, {
      key: 'hideBlock',
      value: function hideBlock() {
        var _this6 = this;

        this.holder.trigger(this.beforeCloseEvent);
        this.isClosing = true;

        this.holder.add(this.overlay).fadeOut(200, function () {
          _this6.clean();
          _this6.disableOverlayHandler = false;
          _this6.disableCloseBtnHandler = false;
          _this6.closeBtn.show();
          _this6.isClosing = false;
          _this6.holder.trigger(_this6.afterCloseEvent);
        });

        $(window).off('resize', this._jboxPosAbsolute);
      }
    }, {
      key: 'isElement',
      value: function isElement(o) {
        return (typeof HTMLElement === 'undefined' ? 'undefined' : _typeof(HTMLElement)) === "object" ? o instanceof HTMLElement : //DOM2
        o && (typeof o === 'undefined' ? 'undefined' : _typeof(o)) === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName === "string";
      }
    }, {
      key: 'refreshSlider',
      value: function refreshSlider() {
        var $slider = this.inner.find('.js__slick');

        if (!$slider.length) return;

        $slider.each(function (i, el) {
          el.slick.refresh(true);
        });
      }
    }, {
      key: 'getScrollBarWidth',
      value: function getScrollBarWidth() {
        var div = document.createElement('div');
        var scrollBarWidth = 0;

        $(div).css({
          'width': '100px',
          'height': '100px',
          'overflowY': 'scroll',
          'visibility': 'hidden'
        });
        document.body.appendChild(div);

        scrollBarWidth = div.offsetWidth - div.clientWidth;

        document.body.removeChild(div);

        return scrollBarWidth;
      }
    }, {
      key: 'parseUrl',
      value: function parseUrl() {
        var str = window.location.hash;
        var pattern = 'jbox_id=';
        var index = str.indexOf(pattern);

        if (!~index) return null;

        var selectorStart = index + pattern.length;
        var selectorEnd = ~str.indexOf('%', selectorStart) ? str.indexOf('&', selectorStart) : undefined;
        var selector = str.slice(selectorStart, selectorEnd);

        if (!document.body.querySelector(selector)) {
          if (!document.body.querySelector('#' + selector)) return null;

          selector = '#' + selector;
        }

        return selector;
      }
    }, {
      key: 'enableZoom',
      value: function enableZoom() {
        if (this.zoomEnabled) return;

        this.$viewPort.attr('content', this.viewPortContentZoom);
        this.zoomEnabled = true;
      }
    }, {
      key: 'disableZoom',
      value: function disableZoom() {
        if (!this.zoomEnabled) return;

        this.$viewPort.attr('content', this.viewPortContent);
        this.$viewPort.attr('content', this.viewPortContent);
        this.zoomEnabled = false;
      }

      /*unused func*/

    }, {
      key: 'jboxCheckNofixed',
      value: function jboxCheckNofixed() {
        var jboxHolder = this.holder;

        jboxHolder.removeClass('nofixed');
        if (jboxHolder.height() > jQuery(window).height()) {
          jboxHolder.addClass('nofixed').css({
            'top': '0',
            'margin-top': '100px'
          });
        }
      }
    }, {
      key: 'getBlockSize',
      value: function getBlockSize(block) {
        //let block =
        var result = {};

        $img.attr('src', src).css({
          'position': 'absolute',
          'top': '-10000px',
          'left': '-10000px',
          'visibility': 'hidden',
          'width': 'auto',
          'height': 'auto',
          'margin': '0',
          'padding': '0'
        });

        $('body').append($img);

        result.height = $img[0].clientHeight;
        result.width = $img[0].clientWidth;

        $img.remove();

        return result;
      }
    }]);

    return JBoxController;
  }();

  $(document).ready(function () {
    $.jBox = new JBoxController({});
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpzL2pCb3guZXM2LmpzIl0sIm5hbWVzIjpbImZhY3RvcnkiLCJkZWZpbmUiLCJhbWQiLCJleHBvcnRzIiwibW9kdWxlIiwicmVxdWlyZSIsImpRdWVyeSIsIiQiLCJHYWxsZXJ5Iiwib3B0aW9ucyIsImNsYXNzTmFtZSIsImluZGV4Q3VycmVudCIsInRhcmdldEVsIiwiamJveE9iaiIsImpib3giLCJ0cGwiLCJjb250cm9sVHBsIiwiaW5pdCIsImVsZW1lbnRzIiwiZ2FsbGVyeVNyYyIsImdldEdhbGxlcnlTcmMiLCJsZW5ndGgiLCJpbWdDdXJyZW50IiwiaW5uZXIiLCJjb250cm9sIiwicGFyc2VJbnQiLCJpbmRleE9mIiwiYXR0ciIsImluZGV4U3VtbSIsImFmdGVyIiwiaG92ZXIiLCJhbmltYXRlIiwib3BhY2l0eSIsIm9uIiwiY29udHJvbEhhbmRsZXIiLCJiaW5kIiwiZSIsImVsIiwidGFyZ2V0IiwicHJldkJ0biIsImNsb3Nlc3QiLCJuZXh0QnRuIiwiY2hhbmdlSW1nIiwiZGlyZWN0aW9uIiwiaW1nVXJsIiwiaW1nIiwidG1waW1nIiwiaXNMb2FkZWRJbWciLCJjc3MiLCJhcHBlbmRUbyIsInJlbW92ZSIsInNyYyIsImZhZGVUbyIsImpib3hQb3NBYnNvbHV0ZSIsImFwcGx5IiwiJGxpbmtzIiwiZWFjaCIsIiRlbCIsImN1cnJTcmMiLCJwdXNoIiwiSkJveENvbnRyb2xsZXIiLCJnYWxsZXJ5U2VsZWN0b3IiLCJ0YXJnZXRTZWxlY3RvcnNBcnIiLCJqUGFnZUV2ZW50TGl2ZSIsImpldmVudEV2ZW50IiwiamV2ZW50T3BlbmluZ01ldGhvZCIsInpvb21FbmFibGVkIiwiZGlzYWJsZUNsb3NlQnRuSGFuZGxlciIsImRpc2FibGVPdmVybGF5SGFuZGxlciIsInZpZXdQb3J0Q29udGVudFpvb20iLCJfdHBsRGVmYXVsdCIsImhvbGRlclRwbCIsImlubmVyV3JhcFRwbCIsImlubmVyVHBsIiwiY2xvc2VCdG5UcGwiLCJvdmVybGF5VHBsIiwiaW1nVHBsIiwiY2FwdGlvblRwbCIsIm92ZXJJbXBUcGwiLCJjbGFzc0xpc3QiLCJfY2xhc3NMaXN0RGVmYXVsdCIsImFjdGl2ZSIsInRyaWdnZXJGdWxsc2NyZWVuIiwidHJpZ2dlck5vcGFkZGluZyIsInRyaWdnZXJOb0JnIiwidHJpZ2dlcldoaXRlQmciLCJmdWxsU2NyZWVuIiwibm9wYWRkaW5nIiwibm9CZyIsIndoaXRlQmciLCJiZWZvcmVPcGVuRXZlbnQiLCJhZnRlck9wZW5FdmVudCIsImJlZm9yZUNsb3NlRXZlbnQiLCJhZnRlckNsb3NlRXZlbnQiLCJiZWZvcmVDbGVhbkV2ZW50IiwiYWZ0ZXJDbGVhbkV2ZW50IiwidGFyZ2V0U2VsZWN0b3JzIiwiam9pbiIsImV4dGVuZCIsInJlbmRlckpib3giLCJwcmVwYXJlR2FsbGVyeUNsYXNzZXMiLCJzaG93SGFuZGxlciIsIm92ZXJsYXkiLCJhZGQiLCJjbG9zZUJ0biIsImNsb3NlSGFuZGxlciIsImpldmVudEhhbmRsZXIiLCJzZWxlY3RvciIsInBhcnNlVXJsIiwiamJveGh0bWwiLCIkdmlld1BvcnQiLCJ2aWV3UG9ydENvbnRlbnQiLCIkcGFyZW50IiwiaG9sZGVyIiwiaW5uZXJXcmFwIiwiYXBwZW5kIiwiaXNFbGVtZW50Iiwib2JqQ2xhc3MiLCJzcGxpdCIsImluZGV4IiwiaXRlbSIsImdhbGxlcmllcyIsIm5vdCIsImdhbGxlcnkiLCJnZXRHYWxsZXJ5Q2xhc3MiLCJhZGRDbGFzcyIsIl8iLCJ0cmlnZ2VyQmxvY2siLCJfb25LZXlEb3duIiwib25LZXlEb3duIiwib25Nb3VzZWVudGVyIiwib25Nb3VzZUxlYXZlIiwic3dpcGUiLCJvblN3aXBlIiwidGFyZ2V0U2VsZWN0b3IiLCJwcmV2ZW50RGVmYXVsdCIsInNob3dCbG9jayIsInNjZW5hcmlvIiwib3BlbmluZ01ldGhvZCIsImNhcHRpb24iLCIkdGFyZ2V0IiwiaXMiLCJtYXRjaCIsImNsZWFuIiwiamJveGltZyIsImpib3hza3UiLCJoaWRlQmxvY2siLCJkb2N1bWVudCIsIm9mZiIsImtleUNvZGUiLCJ3aGljaCIsImV2ZW50IiwiZGlzdGFuY2UiLCJkdXJhdGlvbiIsImZpbmdlckNvdW50IiwiZmluZ2VyRGF0YSIsImhyZWYiLCJjb250ZW50IiwiY3VzdG9tSG9sZGVyQ2xhc3MiLCJjdXN0b21PdmVybGF5Q2xhc3MiLCJvcGVuSGFuZGxlciIsIiRjb250ZW50V3JhcHBlciIsImlzQ2xvc2luZyIsInNldFRpbWVvdXQiLCJibG9jayIsInVybHR5cGUiLCJvYmp0eXBlIiwicHJvZHVjdHNrdSIsImhhc0NsYXNzIiwiY2FwdGlvblRleHQiLCJyZXBsYWNlIiwidG1wSW1nIiwiJGNhcHRpb24iLCJ0ZXh0IiwiaGlkZSIsInNob3ciLCJyZW5kZXJHYWxsZXJ5IiwiaW5uZXJpZCIsInBhcmVudEVsZW1lbnQiLCJwYXJlbnQiLCJyZW1vdmVDbGFzcyIsInRhcmdldENsb25lIiwiY2xvbmUiLCJpc0hpZGRlblRhcmdldCIsIm5vQW5pbWF0ZSIsImlubmVySW1nIiwiZmluZCIsImlzRnVsbFNjcmVlbiIsIl9qYm94UG9zQWJzb2x1dGUiLCJodG1sIiwic2Nyb2xsV2lkdGgiLCJnZXRTY3JvbGxCYXJXaWR0aCIsIndpbmRvdyIsInRyaWdnZXIiLCJ3aCIsImRvY3VtZW50RWxlbWVudCIsImNsaWVudEhlaWdodCIsInd3IiwiY2xpZW50V2lkdGgiLCJob2xkZXJIIiwib3V0ZXJIZWlnaHQiLCJyZXN1bHRIIiwiaW5uZXJGcmVlU3BhY2UiLCJoZWlnaHQiLCJ3aWR0aCIsIm1heENhcHRpb25XaWR0aCIsImVuYWJsZVpvb20iLCJob2xkZXJXIiwib3V0ZXJXaWR0aCIsInJlc3VsdFciLCJ0b3AiLCJsZWZ0IiwiaW5uZXJIIiwiaW5uZXJXcmFwSCIsImZhZGVJbiIsImRlbGF5IiwicmVmcmVzaFNsaWRlciIsImNhc2hlZFN0eWxlcyIsInJlbW92ZUF0dHIiLCJlbXB0eSIsImRpc2FibGVab29tIiwiZmFkZU91dCIsIm8iLCJIVE1MRWxlbWVudCIsIm5vZGVUeXBlIiwibm9kZU5hbWUiLCIkc2xpZGVyIiwiaSIsInNsaWNrIiwicmVmcmVzaCIsImRpdiIsImNyZWF0ZUVsZW1lbnQiLCJzY3JvbGxCYXJXaWR0aCIsImJvZHkiLCJhcHBlbmRDaGlsZCIsIm9mZnNldFdpZHRoIiwicmVtb3ZlQ2hpbGQiLCJzdHIiLCJsb2NhdGlvbiIsImhhc2giLCJwYXR0ZXJuIiwic2VsZWN0b3JTdGFydCIsInNlbGVjdG9yRW5kIiwidW5kZWZpbmVkIiwic2xpY2UiLCJxdWVyeVNlbGVjdG9yIiwiamJveEhvbGRlciIsInJlc3VsdCIsIiRpbWciLCJyZWFkeSIsImpCb3giXSwibWFwcGluZ3MiOiJBQUFBOztBQUVBOzs7OztBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7QUFHQSxDQUFDLFVBQVVBLE9BQVYsRUFBbUI7QUFDbEIsTUFBSSxPQUFPQyxNQUFQLEtBQWtCLFVBQWxCLElBQWdDQSxPQUFPQyxHQUEzQyxFQUFnRDtBQUM5QztBQUNBRCxXQUFPLENBQUMsUUFBRCxDQUFQLEVBQW1CRCxPQUFuQjtBQUNELEdBSEQsTUFHTyxJQUFJLFFBQU9HLE9BQVAseUNBQU9BLE9BQVAsT0FBbUIsUUFBdkIsRUFBaUM7QUFDdEM7QUFDQUMsV0FBT0QsT0FBUCxHQUFpQkgsUUFBUUssUUFBUSxRQUFSLENBQVIsQ0FBakI7QUFDRCxHQUhNLE1BR0E7QUFDTDtBQUNBTCxZQUFRTSxNQUFSO0FBQ0Q7QUFDRixDQVhELEVBV0csVUFBVUMsQ0FBVixFQUFhO0FBQUEsTUFFUkMsT0FGUTtBQUdaLHFCQUFZQyxPQUFaLEVBQXFCO0FBQUE7O0FBQ25CLFdBQUtDLFNBQUwsR0FBaUJELFFBQVFDLFNBQXpCO0FBQ0EsV0FBS0MsWUFBTCxHQUFvQixDQUFwQjtBQUNBLFdBQUtDLFFBQUwsR0FBZ0JILFFBQVFHLFFBQXhCO0FBQ0EsV0FBS0MsT0FBTCxHQUFlSixRQUFRSyxJQUF2QjtBQUNBLFdBQUtDLEdBQUwsR0FBVztBQUNUQyxvQkFBWTtBQURILE9BQVg7O0FBSUEsV0FBS0MsSUFBTDtBQUNEOztBQWJXO0FBQUE7QUFB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S0FEUixFQUNld0IsR0FEZixFQUVHSCxHQUZILENBRU87QUFDSCxzQkFBWSxVQURUO0FBRUgsaUJBQU8sVUFGSjtBQUdILGtCQUFRLFVBSEw7QUFJSCx3QkFBYyxRQUpYO0FBS0gsbUJBQVMsTUFMTjtBQU1ILG9CQUFVLE1BTlA7QUFPSCxvQkFBVSxHQVBQO0FBUUgscUJBQVc7QUFSUixTQUZQOztBQWFBekMsVUFBRSxNQUFGLEVBQVU0RyxNQUFWLENBQWlCcUksSUFBakI7O0FBRUFELGVBQU81QyxNQUFQLEdBQWdCNkMsS0FBSyxDQUFMLEVBQVFwRCxZQUF4QjtBQUNBbUQsZUFBTzNDLEtBQVAsR0FBZTRDLEtBQUssQ0FBTCxFQUFRbEQsV0FBdkI7O0FBRUFrRCxhQUFLdE0sTUFBTDs7QUFFQSxlQUFPcU0sTUFBUDtBQUNEO0FBbDVCVzs7QUFBQTtBQUFBOztBQXE1QmRoUCxJQUFFNEksUUFBRixFQUFZc0csS0FBWixDQUFrQixZQUFNO0FBQ3RCbFAsTUFBRW1QLElBQUYsR0FBUyxJQUFJOUwsY0FBSixDQUFtQixFQUFuQixDQUFUO0FBQ0QsR0FGRDtBQUdELENBbjZCRCIsImZpbGUiOiJqcy9qQm94LmVzNi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuLypcbiAqIGpCb3hcbiAqIHYgMS40XG4gKiAqL1xuXG5cbi8vVE9ETyDQv9C70LDQstC90YPRjiDRgdC80LXQvdGDINC+0LrQvtC9XG4vL1RPRE8g0L/RgNCw0LLQuNC70YzQvdC+0LUg0L/QvtC30LjRhtC40L7QvdC40YDQvtCy0LDQvdC40LUg0L/RgNC4INGB0LzQtdC90LUg0L7QutC+0L1cbi8vVE9ETyDRgNCw0LfQvtCx0YDQsNGC0YzRgdGPINGBIHNrdSDRhNGD0L3QutGG0LjQtdC5LCDRgSBhbmNob3J0YXJnZXQg0L/QvtC90Y/RgtGMINC10YHRgtGMINC70Lgg0LbQuNC30L3RjCDQvdCwINCc0LDRgNGB0LU/XG4vL1RPRE8gaW5pdCDQuNC70Lgg0YXQvtGC0Y8t0LHRiyByZW5kZXIg0L/QviDRgtGA0LXQsdC+0LLQsNC90LjRjlxuLy9UT0RPINC/0LXRgNC10YDQsNCx0L7RgtCw0YLRjCBzaG93RWwsINGH0YLQvi3QsdGLINC80L7QttC90L4g0LHRi9C70L4g0YHQutCw0YDQvNC70LjQstCw0YLRjCDQvdC1INGC0L7Qu9GM0LrQviDQsdC70L7QuiDQvdC+INC4INGB0YLRgNC+0LrRg1xuLy9UT0RPINGB0LTQtdC70LDRgtGMINCy0L7Qt9C80L7QttC90L7RgdGC0Ywg0YHQuNC/0L7Qu9GM0LfQvtCy0LDQvdC40Y8g0LPQsNC70LXRgNC10Lgg0L3QtSDRgtC+0LvRjNC60L4g0LTQu9GPINC60LDRgNGC0LjQvdC+0Lpcbi8vVE9ETyDQstGL0L3QtdGB0YLQuCDQvtC/0YDQtdC00LXQu9C10L3QuNC1INC+0L/RhtC40Lkg0LTQu9GPINC60LDQttC00L7Qs9C+INGB0LvQsNC50LTQtdGA0LAg0LjQtyBzaG93RWwsINC/0LXRgNC10LTQsNCy0LDRgtGMINCyIHNob3dibG9jayDRgtC+0LvRjNC60L4g0L7Qv9GG0LjQuFxuXG5cbihmdW5jdGlvbiAoZmFjdG9yeSkge1xuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgLy8gQU1EIChSZWdpc3RlciBhcyBhbiBhbm9ueW1vdXMgbW9kdWxlKVxuICAgIGRlZmluZShbJ2pxdWVyeSddLCBmYWN0b3J5KTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAvLyBOb2RlL0NvbW1vbkpTXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJlcXVpcmUoJ2pxdWVyeScpKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBCcm93c2VyIGdsb2JhbHNcbiAgICBmYWN0b3J5KGpRdWVyeSk7XG4gIH1cbn0pKGZ1bmN0aW9uICgkKSB7XG5cbiAgY2xhc3MgR2FsbGVyeSB7XG4gICAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgICAgdGhpcy5jbGFzc05hbWUgPSBvcHRpb25zLmNsYXNzTmFtZTtcbiAgICAgIHRoaXMuaW5kZXhDdXJyZW50ID0gMDtcbiAgICAgIHRoaXMudGFyZ2V0RWwgPSBvcHRpb25zLnRhcmdldEVsO1xuICAgICAgdGhpcy5qYm94T2JqID0gb3B0aW9ucy5qYm94O1xuICAgICAgdGhpcy50cGwgPSB7XG4gICAgICAgIGNvbnRyb2xUcGw6ICc8ZGl2IGNsYXNzPVwiamJveC1jb250cm9sXCI+PHNwYW4gY2xhc3M9XCJwcmV2XCI+PC9zcGFuPjxzcGFuIGNsYXNzPVwibmV4dFwiPjwvc3Bhbj48L2Rpdj4nXG4gICAgICB9O1xuXG4gICAgICB0aGlzLmluaXQoKTtcbiAgICB9XG5cbiAgICBpbml0KCkge1xuICAgICAgbGV0IGVsZW1lbnRzID0gJCgnYS5qYm94LicgKyB0aGlzLmNsYXNzTmFtZSk7XG4gICAgICBsZXQgZ2FsbGVyeVNyYyA9IHRoaXMuZ2FsbGVyeVNyYyA9IHRoaXMuZ2V0R2FsbGVyeVNyYyhlbGVtZW50cyk7XG5cbiAgICAgIGlmICghZ2FsbGVyeVNyYy5sZW5ndGgpIHJldHVybjtcblxuICAgICAgbGV0IGltZ0N1cnJlbnQgPSB0aGlzLmltZ0N1cnJlbnQgPSAkKCdpbWcnLCB0aGlzLmpib3hPYmouaW5uZXIpO1xuICAgICAgbGV0IGNvbnRyb2wgPSB0aGlzLmNvbnRyb2wgPSAkKHRoaXMudHBsLmNvbnRyb2xUcGwpO1xuICAgICAgdGhpcy5pbmRleEN1cnJlbnQgPSBwYXJzZUludChnYWxsZXJ5U3JjLmluZGV4T2YodGhpcy50YXJnZXRFbC5hdHRyKCdocmVmJykpKTtcbiAgICAgIHRoaXMuaW5kZXhTdW1tID0gZ2FsbGVyeVNyYy5sZW5ndGggLSAxO1xuXG4gICAgICBpbWdDdXJyZW50LmFmdGVyKGNvbnRyb2wpO1xuXG4gICAgICAvKlRPRE8g0L3QtdC+0LHRhdC+0LTQuNC80L4g0YHQtNC10LvQsNGC0Ywg0Y3RgtC+0YIg0Y3RhNGE0LXQutGCINC/0YDQuCDQv9C+0LzQvtGJ0LggY3NzKi9cbiAgICAgICQoJ3NwYW4nLCBjb250cm9sKS5ob3ZlcihmdW5jdGlvbiAoKSB7XG4gICAgICAgICQodGhpcykuYW5pbWF0ZSh7b3BhY2l0eTogMX0sIDE1MCk7XG4gICAgICB9LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICQodGhpcykuYW5pbWF0ZSh7b3BhY2l0eTogMH0sIDUwKTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBjb250cm9sXG4gICAgICBjb250cm9sLm9uKCdjbGljaycsIHRoaXMuY29udHJvbEhhbmRsZXIuYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgY29udHJvbEhhbmRsZXIoZSkge1xuICAgICAgbGV0IGVsID0gZS50YXJnZXQ7XG4gICAgICBsZXQgcHJldkJ0biA9ICQoZWwpLmNsb3Nlc3QoJy5wcmV2Jyk7XG4gICAgICBsZXQgbmV4dEJ0biA9ICQoZWwpLmNsb3Nlc3QoJy5uZXh0Jyk7XG5cbiAgICAgIGlmIChwcmV2QnRuLmxlbmd0aCkge1xuICAgICAgICB0aGlzLmNoYW5nZUltZygncHJldicpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChuZXh0QnRuLmxlbmd0aCkge1xuICAgICAgICB0aGlzLmNoYW5nZUltZygnbmV4dCcpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgY2hhbmdlSW1nKGRpcmVjdGlvbikge1xuICAgICAgc3dpdGNoIChkaXJlY3Rpb24pIHtcbiAgICAgICAgY2FzZSAncHJldic6XG4gICAgICAgICAgdGhpcy5pbmRleEN1cnJlbnQgPSB0aGlzLmluZGV4Q3VycmVudCA+IDAgPyAtLXRoaXMuaW5kZXhDdXJyZW50IDogdGhpcy5pbmRleFN1bW07XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ25leHQnOlxuICAgICAgICAgIHRoaXMuaW5kZXhDdXJyZW50ID0gdGhpcy5pbmRleEN1cnJlbnQgPj0gdGhpcy5pbmRleFN1bW0gPyAwIDogKyt0aGlzLmluZGV4Q3VycmVudDtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgbGV0IGltZ1VybCA9IHRoaXMuZ2FsbGVyeVNyY1t0aGlzLmluZGV4Q3VycmVudF07XG4gICAgICBsZXQgaW1nID0gdGhpcy5pbWdDdXJyZW50O1xuXG4gICAgICAvLyB0bXAgaW1nIGZvciB2YWxpZGF0ZSBkb3dubG9hZHMgaW1nXG4gICAgICBsZXQgdG1waW1nID0gJCgnPGltZy8+Jyk7XG4gICAgICBsZXQgaXNMb2FkZWRJbWcgPSBmYWxzZTtcbiAgICAgIHRtcGltZ1xuICAgICAgICAuY3NzKHtcbiAgICAgICAgICAnZGlzcGxheSc6ICdub25lJ1xuICAgICAgICB9KVxuICAgICAgICAuYXBwZW5kVG8oJCgnYm9keScpKTtcblxuICAgICAgdG1waW1nLm9uKCdsb2FkJywgKCkgPT4ge1xuICAgICAgICBpc0xvYWRlZEltZyA9IHRydWU7XG4gICAgICAgIHRtcGltZy5yZW1vdmUoKTtcbiAgICAgIH0pO1xuXG4gICAgICB0bXBpbWdbMF0uc3JjID0gaW1nVXJsO1xuXG4gICAgICBpbWcuZmFkZVRvKDMwMCwgMC4xLCAoKSA9PiB7XG4gICAgICAgIGlmIChpc0xvYWRlZEltZykge1xuICAgICAgICAgIGltZy5hdHRyKCdzcmMnLCBpbWdVcmwpXG4gICAgICAgICAgICAuZmFkZVRvKDI1MCwgMSk7XG4gICAgICAgICAgdGhpcy5qYm94T2JqLmpib3hQb3NBYnNvbHV0ZS5hcHBseSh0aGlzLmpib3hPYmosIFt0cnVlLCB0cnVlXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdG1waW1nLm9uKCdsb2FkJywgKCkgPT4ge1xuICAgICAgICAgICAgaW1nLmF0dHIoJ3NyYycsIGltZ1VybClcbiAgICAgICAgICAgICAgLmZhZGVUbygyNTAsIDEpO1xuXG4gICAgICAgICAgICB0aGlzLmpib3hPYmouamJveFBvc0Fic29sdXRlLmFwcGx5KHRoaXMuamJveE9iaiwgW3RydWUsIHRydWVdKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGdldEdhbGxlcnlTcmMoJGxpbmtzKSB7XG4gICAgICBsZXQgc3JjID0gW107XG5cbiAgICAgICRsaW5rcy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgJGVsID0gJCh0aGlzKTtcbiAgICAgICAgbGV0IGN1cnJTcmMgPSAkZWwuYXR0cignaHJlZicpO1xuXG4gICAgICAgIGlmICh+c3JjLmluZGV4T2YoY3VyclNyYykpIHJldHVybjtcblxuICAgICAgICBzcmMucHVzaChjdXJyU3JjKTtcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gc3JjO1xuICAgIH1cbiAgfVxuXG4gIGNsYXNzIEpCb3hDb250cm9sbGVyIHtcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgICB0aGlzLmdhbGxlcnlTZWxlY3RvciA9IG9wdGlvbnMuZ2FsbGVyeVNlbGVjdG9yIHx8ICdbY2xhc3MqPVwiZ2FsbGVyeS1cIl0nO1xuICAgICAgdGhpcy50YXJnZXRTZWxlY3RvcnNBcnIgPSBvcHRpb25zLnRhcmdldFNlbGVjdG9yc0FyciB8fCBbXG4gICAgICAgICAgJy5qYm94JyxcbiAgICAgICAgICAnI3AtdGJsLWNvbXBhY3QgYTpub3QoLmFuY2hvciwgLm5vLWpib3gpJyxcbiAgICAgICAgICAnI3AtdGJsIGE6bm90KC5hbmNob3IsIFt0YXJnZXQ9XCJfYmxhbmtcIl0sIC5uby1qYm94KScsXG4gICAgICAgICAgJ2EuYnV5J1xuICAgICAgICBdO1xuICAgICAgdGhpcy5qUGFnZUV2ZW50TGl2ZSA9IG9wdGlvbnMualBhZ2VFdmVudExpdmUgfHwgdHJ1ZTtcbiAgICAgIHRoaXMuamV2ZW50RXZlbnQgPSAncGxheVNjZW5hcmlvJztcbiAgICAgIHRoaXMuamV2ZW50T3BlbmluZ01ldGhvZCA9ICdqQm94JztcbiAgICAgIHRoaXMuem9vbUVuYWJsZWQgPSBmYWxzZTtcbiAgICAgIHRoaXMuZGlzYWJsZUNsb3NlQnRuSGFuZGxlciA9IGZhbHNlO1xuICAgICAgdGhpcy5kaXNhYmxlT3ZlcmxheUhhbmRsZXIgPSBmYWxzZTtcbiAgICAgIHRoaXMudmlld1BvcnRDb250ZW50Wm9vbSA9IG9wdGlvbnMudmlld1BvcnRDb250ZW50Wm9vbSB8fCAnd2lkdGg9ZGV2aWNlLXdpZHRoLCBpbml0aWFsLXNjYWxlPTEuMCwgbWluaW11bS1zY2FsZT0xLjAsIG1heGltdW0tc2NhbGU9NS4wLCB1c2VyLXNjYWxhYmxlPXllcyc7XG4gICAgICB0aGlzLnRwbCA9IG9wdGlvbnMudHBsO1xuICAgICAgdGhpcy5fdHBsRGVmYXVsdCA9IHtcbiAgICAgICAgaG9sZGVyVHBsOiAnPGRpdiBpZD1cImpib3gtaG9sZGVyXCIgY2xhc3M9XCJqYm94LWhvbGRlciBoaWRlIGxvYWRpbmdcIj48L2Rpdj4nLFxuICAgICAgICBpbm5lcldyYXBUcGw6ICc8ZGl2IGNsYXNzPVwiaW5uZXItd3JhcFwiPjwvZGl2PicsXG4gICAgICAgIGlubmVyVHBsOiAnPGRpdiBjbGFzcz1cImlubmVyXCI+PC9kaXY+JyxcbiAgICAgICAgY2xvc2VCdG5UcGw6ICc8ZGl2IGlkPVwiamJveC1jbG9zZVwiIGNsYXNzPVwiamJveC1jbG9zZVwiPjwvZGl2PicsXG4gICAgICAgIG92ZXJsYXlUcGw6ICc8ZGl2IGlkPVwiamJveC1vdmVybGF5XCIgY2xhc3M9XCJqYm94LW92ZXJsYXkgaGlkZVwiIC8+JyxcbiAgICAgICAgaW1nVHBsOiAnPGltZyBjbGFzcz1cImppbWFnZVwiIHNyYz1cIiNcIiAvPicsXG4gICAgICAgIGNhcHRpb25UcGw6ICc8ZGl2IGNsYXNzPVwiamJveC1jYXB0aW9uIGNlbnRlclwiPjwvZGl2PicsXG4gICAgICAgIG92ZXJJbXBUcGw6ICc8ZGl2IGNsYXNzPVwib3ZlcmltZ1wiPjwvZGl2PidcbiAgICAgIH07XG4gICAgICB0aGlzLmNsYXNzTGlzdCA9IG9wdGlvbnMuY2xhc3NMaXN0O1xuICAgICAgdGhpcy5fY2xhc3NMaXN0RGVmYXVsdCA9IHtcbiAgICAgICAgYWN0aXZlOiAnYWN0aXZlJyxcbiAgICAgICAgdHJpZ2dlckZ1bGxzY3JlZW46ICdqYm94LWFuY2hvci1mdWxsc2NyZWVuJyxcbiAgICAgICAgdHJpZ2dlck5vcGFkZGluZzogJ2pib3gtYW5jaG9yLW5vcGFkZGluZycsXG4gICAgICAgIHRyaWdnZXJOb0JnOiAnamJveC1hbmNob3Itbm9iZycsXG4gICAgICAgIHRyaWdnZXJXaGl0ZUJnOiAnamJveC1hbmNob3ItYmctd2hpdGUnLFxuICAgICAgICBmdWxsU2NyZWVuOiAnamJveC1mdWxsc2NyZWVuJyxcbiAgICAgICAgbm9wYWRkaW5nOiAnamJveC1ub3BhZGRpbmcnLFxuICAgICAgICBub0JnOiAnamJveC1iZy1ub2JnJyxcbiAgICAgICAgd2hpdGVCZzogJ2pib3gtYmctd2hpdGUnXG4gICAgICB9O1xuICAgICAgdGhpcy5iZWZvcmVPcGVuRXZlbnQgPSAnakJveDpiZWZvcmVPcGVuJztcbiAgICAgIHRoaXMuYWZ0ZXJPcGVuRXZlbnQgPSAnakJveDphZnRlck9wZW4nO1xuICAgICAgdGhpcy5iZWZvcmVDbG9zZUV2ZW50ID0gJ2pCb3g6YmVmb3JlQ2xvc2UnO1xuICAgICAgdGhpcy5hZnRlckNsb3NlRXZlbnQgPSAnakJveDphZnRlckNsb3NlJztcbiAgICAgIHRoaXMuYmVmb3JlQ2xlYW5FdmVudCA9ICdqQm94OmJlZm9yZUNsZWFuJztcbiAgICAgIHRoaXMuYWZ0ZXJDbGVhbkV2ZW50ID0gJ2pCb3g6YWZ0ZXJDbGVhbic7XG5cbiAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH1cblxuICAgIGluaXQoKSB7XG4gICAgICB0aGlzLnRhcmdldFNlbGVjdG9ycyA9IHRoaXMudGFyZ2V0U2VsZWN0b3JzIHx8IHRoaXMudGFyZ2V0U2VsZWN0b3JzQXJyLmpvaW4oJywgJyk7XG4gICAgICB0aGlzLnRwbCA9ICQuZXh0ZW5kKHRydWUsIHt9LCB0aGlzLl90cGxEZWZhdWx0LCB0aGlzLnRwbCk7XG4gICAgICB0aGlzLmNsYXNzTGlzdCA9ICQuZXh0ZW5kKHRydWUsIHt9LCB0aGlzLl9jbGFzc0xpc3REZWZhdWx0LCB0aGlzLmNsYXNzTGlzdCk7XG5cbiAgICAgIHRoaXMucmVuZGVySmJveCgpO1xuXG4gICAgICBpZiAoJCh0aGlzLmdhbGxlcnlTZWxlY3RvcikubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMucHJlcGFyZUdhbGxlcnlDbGFzc2VzKCk7XG4gICAgICB9XG5cbiAgICAgICQoJ2JvZHknKS5vbignY2xpY2snLCB0aGlzLnNob3dIYW5kbGVyLmJpbmQodGhpcykpO1xuXG4gICAgICB0aGlzLm92ZXJsYXkuYWRkKHRoaXMuY2xvc2VCdG4pLm9uKCdjbGljaycsIHRoaXMuY2xvc2VIYW5kbGVyLmJpbmQodGhpcykpO1xuXG4gICAgICAvKmpQYWdlRXZlbnRMaXZlIHN1cHBvcnQqL1xuICAgICAgJCgnYm9keScpLm9uKHRoaXMuamV2ZW50RXZlbnQsIHRoaXMuamV2ZW50SGFuZGxlci5iaW5kKHRoaXMpKTtcblxuXG4gICAgICAvKm9wZW4gb24gdXJsKi9cbiAgICAgIGxldCBzZWxlY3RvciA9IHRoaXMucGFyc2VVcmwoKTtcblxuICAgICAgaWYgKHNlbGVjdG9yKSB7XG4gICAgICAgIHRoaXMuamJveGh0bWwoc2VsZWN0b3IpO1xuICAgICAgfVxuXG4gICAgICAvKnZpZXdwb3J0IGNhY2hpbmcqL1xuICAgICAgdGhpcy4kdmlld1BvcnQgPSAkKCdtZXRhW25hbWU9XCJ2aWV3cG9ydFwiXScpO1xuICAgICAgdGhpcy52aWV3UG9ydENvbnRlbnQgPSB0aGlzLiR2aWV3UG9ydC5hdHRyKCdjb250ZW50Jyk7XG4gICAgfVxuXG4gICAgcmVuZGVySmJveCgpIHtcbiAgICAgIGxldCAkcGFyZW50ID0gJCgnI3BhZ2UnKS5sZW5ndGggPyAkKCcjcGFnZScpOiAkKCdib2R5Jyk7XG4gICAgICB0aGlzLmhvbGRlciA9ICQodGhpcy50cGwuaG9sZGVyVHBsKTtcbiAgICAgIHRoaXMub3ZlcmxheSA9ICQodGhpcy50cGwub3ZlcmxheVRwbCk7XG4gICAgICB0aGlzLmlubmVyV3JhcCA9ICQodGhpcy50cGwuaW5uZXJXcmFwVHBsKTtcbiAgICAgIHRoaXMuaW5uZXIgPSAkKHRoaXMudHBsLmlubmVyVHBsKTtcbiAgICAgIHRoaXMuY2xvc2VCdG4gPSAkKHRoaXMudHBsLmNsb3NlQnRuVHBsKTtcblxuICAgICAgJHBhcmVudFxuICAgICAgICAuYXBwZW5kKHRoaXMub3ZlcmxheSlcbiAgICAgICAgLmFwcGVuZCh0aGlzLmhvbGRlcik7XG5cbiAgICAgIHRoaXMuaW5uZXJXcmFwLmFwcGVuZCh0aGlzLmlubmVyKTtcbiAgICAgIHRoaXMuaG9sZGVyXG4gICAgICAgIC5hcHBlbmQodGhpcy5pbm5lcldyYXApXG4gICAgICAgIC5hcHBlbmQodGhpcy5jbG9zZUJ0bik7XG4gICAgfVxuXG4gICAgZ2V0R2FsbGVyeUNsYXNzKGVsKSB7XG4gICAgICBpZiAoIWVsIHx8ICF0aGlzLmlzRWxlbWVudChlbFswXSkpIHJldHVybjtcblxuICAgICAgbGV0IG9iakNsYXNzID0gZWwuYXR0cignY2xhc3MnKS5zcGxpdCgvXFxzKy8pO1xuICAgICAgbGV0IGNsYXNzTmFtZSA9IG51bGw7XG5cbiAgICAgIGpRdWVyeS5lYWNoKG9iakNsYXNzLCBmdW5jdGlvbiAoaW5kZXgsIGl0ZW0pIHtcbiAgICAgICAgaWYgKCF+aXRlbS5pbmRleE9mKCdnYWxsZXJ5LScpKSByZXR1cm47XG5cbiAgICAgICAgY2xhc3NOYW1lID0gaXRlbTtcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gY2xhc3NOYW1lO1xuICAgIH1cblxuICAgIHByZXBhcmVHYWxsZXJ5Q2xhc3NlcygpIHtcbiAgICAgIGxldCBnYWxsZXJpZXMgPSB0aGlzLmdhbGxlcmllcyA9ICQodGhpcy5nYWxsZXJ5U2VsZWN0b3IpLm5vdCgnYScpO1xuXG4gICAgICBnYWxsZXJpZXMuZWFjaCgoaW5kZXgsIGl0ZW0pID0+IHtcbiAgICAgICAgbGV0IGdhbGxlcnkgPSBqUXVlcnkoaXRlbSk7XG4gICAgICAgIGxldCBjbGFzc05hbWUgPSB0aGlzLmdldEdhbGxlcnlDbGFzcyhnYWxsZXJ5KTtcblxuICAgICAgICBpZiAoIWNsYXNzTmFtZSkgcmV0dXJuO1xuXG4gICAgICAgIGpRdWVyeSgnYS5qYm94JywgZ2FsbGVyeSkuZWFjaCgoaW5kZXgsIGl0ZW0pID0+IHtcbiAgICAgICAgICBqUXVlcnkoaXRlbSkuYWRkQ2xhc3MoY2xhc3NOYW1lKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZW5kZXJHYWxsZXJ5KGNsYXNzTmFtZSkge1xuICAgICAgbGV0IF8gPSB0aGlzO1xuICAgICAgbGV0IG9wdGlvbnMgPSB7XG4gICAgICAgIGNsYXNzTmFtZTogY2xhc3NOYW1lLFxuICAgICAgICBpbmRleEN1cnJlbnQ6IDAsXG4gICAgICAgIHRhcmdldEVsOiBfLnRyaWdnZXJCbG9jayxcbiAgICAgICAgamJveDogX1xuICAgICAgfTtcblxuICAgICAgdGhpcy5fb25LZXlEb3duID0gdGhpcy5vbktleURvd24uYmluZCh0aGlzKTtcblxuICAgICAgLypjcmVhdGluZyBnYWxsZXJ5IG9iamVjdCovXG4gICAgICBfLmdhbGxlcnkgPSBuZXcgR2FsbGVyeShvcHRpb25zKTtcblxuICAgICAgLy8gRXZlbnRzIHdoZW4geW91IHByZXNzIGZvcndhcmQgLyBiYWNrd2FyZC5cbiAgICAgIF8uaG9sZGVyLmhvdmVyKFxuICAgICAgICBfLm9uTW91c2VlbnRlci5iaW5kKF8pLFxuICAgICAgICBfLm9uTW91c2VMZWF2ZS5iaW5kKF8pXG4gICAgICApO1xuXG4gICAgICAvL0VuYWJsZSBzd2lwaW5nLi4uXG4gICAgICBfLmhvbGRlci5zd2lwZSh7XG4gICAgICAgIC8vR2VuZXJpYyBzd2lwZSBoYW5kbGVyIGZvciBhbGwgZGlyZWN0aW9uc1xuICAgICAgICBzd2lwZTogXy5vblN3aXBlLmJpbmQoXylcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHNob3dIYW5kbGVyKGUpIHtcbiAgICAgIGxldCB0YXJnZXRTZWxlY3RvciA9IHRoaXMudGFyZ2V0U2VsZWN0b3JzQXJyLmpvaW4oJywgJyk7XG4gICAgICBsZXQgZWwgPSBlLnRhcmdldDtcbiAgICAgIGxldCB0YXJnZXQgPSAkKGVsKS5jbG9zZXN0KHRhcmdldFNlbGVjdG9yKTtcblxuXG4gICAgICBpZiAoIXRhcmdldC5sZW5ndGgpIHJldHVybjtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgdGhpcy5zaG93QmxvY2sodGFyZ2V0KTtcbiAgICB9XG5cbiAgICBqZXZlbnRIYW5kbGVyKGUsIHNjZW5hcmlvKSB7XG4gICAgICBpZiAoIXNjZW5hcmlvIHx8IHNjZW5hcmlvLm9wZW5pbmdNZXRob2QgIT09IHRoaXMuamV2ZW50T3BlbmluZ01ldGhvZCkgcmV0dXJuO1xuXG4gICAgICBsZXQgdGFyZ2V0ID0gc2NlbmFyaW8udGFyZ2V0O1xuICAgICAgbGV0IGNhcHRpb24gPSBzY2VuYXJpby5jYXB0aW9uO1xuICAgICAgbGV0ICR0YXJnZXQgPSAkKHRhcmdldCk7XG5cbiAgICAgIGlmICghdGFyZ2V0KSByZXR1cm47XG5cbiAgICAgIGlmICgkdGFyZ2V0LmlzKHRoaXMudGFyZ2V0U2VsZWN0b3JzKSkge1xuICAgICAgICB0aGlzLnNob3dCbG9jaygkdGFyZ2V0KTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIHRhcmdldCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgaWYgKHRhcmdldC5tYXRjaCgvXFwuKHBuZ3xqcGd8anBlZ3xnaWYpL2cpKSB7XG4gICAgICAgICAgdGhpcy5jbGVhbigpO1xuICAgICAgICAgIHRoaXMuamJveGltZyh0YXJnZXQsIGNhcHRpb24pO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBlbHNlIGlmICgkKCcjc2t1LScgKyB0YXJnZXQpLmxlbmd0aCkge1xuICAgICAgICAgIHRoaXMuY2xlYW4oKTtcbiAgICAgICAgICB0aGlzLmpib3hza3UodGFyZ2V0KTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKCR0YXJnZXQuaXMoJ2ltZycpKSB7XG4gICAgICAgIHRoaXMuY2xlYW4oKTtcbiAgICAgICAgdGhpcy5qYm94aW1nKCR0YXJnZXQuYXR0cignc3JjJyksICR0YXJnZXQuYXR0cigndGl0bGUnKSk7XG4gICAgICB9XG5cbiAgICAgIGlmICgkdGFyZ2V0Lmxlbmd0aCkge1xuICAgICAgICB0aGlzLmNsZWFuKCk7XG4gICAgICAgIHRoaXMuamJveGh0bWwodGFyZ2V0KTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNsb3NlSGFuZGxlcihlKSB7XG4gICAgICBsZXQgJGVsID0gJChlLnRhcmdldCk7XG5cbiAgICAgIGlmICgkZWwuaXModGhpcy5jbG9zZUJ0bikgJiYgIXRoaXMuZGlzYWJsZUNsb3NlQnRuSGFuZGxlcikge1xuICAgICAgICB0aGlzLmhpZGVCbG9jaygpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICgkZWwuaXModGhpcy5vdmVybGF5KSAmJiAhdGhpcy5kaXNhYmxlT3ZlcmxheUhhbmRsZXIpIHtcbiAgICAgICAgdGhpcy5oaWRlQmxvY2soKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIG9uTW91c2VlbnRlcigpIHtcbiAgICAgICQoZG9jdW1lbnQpLm9uKCdrZXlkb3duJywgdGhpcy5fb25LZXlEb3duKTtcbiAgICB9XG5cbiAgICBvbk1vdXNlTGVhdmUoKSB7XG4gICAgICAkKGRvY3VtZW50KS5vZmYoJ2tleWRvd24nLCB0aGlzLl9vbktleURvd24pO1xuICAgIH1cblxuICAgIG9uS2V5RG93bihlKSB7XG4gICAgICBzd2l0Y2ggKChlLmtleUNvZGUgPyBlLmtleUNvZGUgOiBlLndoaWNoKSkge1xuICAgICAgICBjYXNlIDM3OiAgIC8vIExlZnQgQXJyb3dcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgdGhpcy5nYWxsZXJ5LmNoYW5nZUltZygncHJldicpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDM5OiAgIC8vIFJpZ2h0IEFycm93XG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIHRoaXMuZ2FsbGVyeS5jaGFuZ2VJbWcoJ25leHQnKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBvblN3aXBlKGV2ZW50LCBkaXJlY3Rpb24sIGRpc3RhbmNlLCBkdXJhdGlvbiwgZmluZ2VyQ291bnQsIGZpbmdlckRhdGEpIHtcbiAgICAgIHN3aXRjaCAoZGlyZWN0aW9uKSB7XG4gICAgICAgIGNhc2UgJ2xlZnQnOlxuICAgICAgICAgIHRoaXMuZ2FsbGVyeS5jaGFuZ2VJbWcoJ25leHQnKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAncmlnaHQnOlxuICAgICAgICAgIHRoaXMuZ2FsbGVyeS5jaGFuZ2VJbWcoJ3ByZXYnKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBvcGVuKG9wdGlvbnMpIHtcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucyAhPT0gJ29iamVjdCcpIHJldHVybjtcblxuICAgICAgbGV0IGhyZWYgPSBvcHRpb25zLmhyZWY7XG4gICAgICBsZXQgJHRhcmdldCA9ICQoaHJlZik7XG4gICAgICBsZXQgY29udGVudCA9IG9wdGlvbnMuY29udGVudDtcbiAgICAgIGxldCBjdXN0b21Ib2xkZXJDbGFzcyA9IG9wdGlvbnMuY3VzdG9tSG9sZGVyQ2xhc3MgfHwgJyc7XG4gICAgICBsZXQgY3VzdG9tT3ZlcmxheUNsYXNzID0gb3B0aW9ucy5jdXN0b21PdmVybGF5Q2xhc3MgfHwgJyc7XG5cbiAgICAgIGlmICghJHRhcmdldC5sZW5ndGggJiYgIWNvbnRlbnQpIHJldHVybjtcblxuICAgICAgbGV0IG9wZW5IYW5kbGVyID0gKCkgPT4ge1xuICAgICAgICB0aGlzLmRpc2FibGVDbG9zZUJ0bkhhbmRsZXIgPSBvcHRpb25zLmRpc2FibGVDbG9zZUJ0bkhhbmRsZXIgfHwgZmFsc2U7XG4gICAgICAgIHRoaXMuZGlzYWJsZU92ZXJsYXlIYW5kbGVyID0gb3B0aW9ucy5kaXNhYmxlT3ZlcmxheUhhbmRsZXIgfHwgZmFsc2U7XG5cbiAgICAgICAgdGhpcy5jbGVhbigpO1xuICAgICAgICB0aGlzLmhvbGRlci5hZGRDbGFzcyhjdXN0b21Ib2xkZXJDbGFzcyk7XG4gICAgICAgIHRoaXMub3ZlcmxheS5hZGRDbGFzcyhjdXN0b21PdmVybGF5Q2xhc3MpO1xuXG4gICAgICAgIGlmICghaHJlZiAmJiBjb250ZW50KSB7XG4gICAgICAgICAgbGV0ICRjb250ZW50V3JhcHBlciA9ICQoJzxkaXY+PC9kaXY+Jyk7XG5cbiAgICAgICAgICAkY29udGVudFdyYXBwZXIuYXBwZW5kKGNvbnRlbnQpO1xuICAgICAgICAgIHRoaXMuaW5uZXIuYXBwZW5kKCRjb250ZW50V3JhcHBlcik7XG4gICAgICAgICAgdGhpcy5qYm94aHRtbCgkY29udGVudFdyYXBwZXIpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgaHJlZiA9PT0gJ3N0cmluZycgJiYgISR0YXJnZXQubGVuZ3RoKSB7XG4gICAgICAgICAgaWYgKGhyZWYubWF0Y2goL1xcLihwbmd8anBnfGpwZWd8Z2lmKS9nKSkge1xuICAgICAgICAgICAgdGhpcy5qYm94aW1nKGhyZWYsIGNvbnRlbnQpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH0gZWxzZSBpZiAoJCgnI3NrdS0nICsgaHJlZikubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLmpib3hza3UoaHJlZik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKCR0YXJnZXQubGVuZ3RoKSB7XG4gICAgICAgICAgaWYgKCR0YXJnZXQuaXMoJ2ltZycpKSB7XG4gICAgICAgICAgICB0aGlzLmpib3hpbWcoJHRhcmdldC5hdHRyKCdzcmMnKSwgJHRhcmdldC5hdHRyKCd0aXRsZScpKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5qYm94aHRtbCgkdGFyZ2V0KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGlmICh0aGlzLmlzQ2xvc2luZykge1xuICAgICAgICAvL3RoaXMuaG9sZGVyLm9uZSh0aGlzLmFmdGVyQ2xvc2VFdmVudCwgZnVuY3Rpb24oKSB7IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7b3BlbkhhbmRsZXIoKTt9LCAxMDApOyB9KTtcbiAgICAgICAgc2V0VGltZW91dChvcGVuSGFuZGxlci5iaW5kKHRoaXMpLCAzMDApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3BlbkhhbmRsZXIoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjbG9zZSgpIHtcbiAgICAgIC8vXG4gICAgICB0aGlzLmhpZGVCbG9jaygpO1xuICAgIH1cblxuICAgIHNob3dCbG9jayhibG9jaykgeyAvL29wZW4gYmFzZWQgb24gdHJpZ2dlcmVkIGVsZW1lbnRcbiAgICAgIHRoaXMuY2xlYW4oKTtcblxuICAgICAgbGV0IHRyaWdnZXJCbG9jayA9IHRoaXMudHJpZ2dlckJsb2NrID0galF1ZXJ5KGJsb2NrKTtcbiAgICAgIGxldCB1cmx0eXBlID0gdHJpZ2dlckJsb2NrLmF0dHIoJ2hyZWYnKSB8fCB0cmlnZ2VyQmxvY2suYXR0cignZGF0YS1qYm94LXRhcmdldCcpO1xuICAgICAgbGV0IG9ianR5cGUgPSB0cmlnZ2VyQmxvY2suYXR0cignc3JjJyk7XG4gICAgICBsZXQgcHJvZHVjdHNrdSA9IHRyaWdnZXJCbG9jay5hdHRyKCdpZCcpO1xuICAgICAgbGV0IGNsYXNzTGlzdCA9IHRoaXMuY2xhc3NMaXN0O1xuXG4gICAgICB0aGlzLmhvbGRlci5hZGRDbGFzcyhjbGFzc0xpc3QuYWN0aXZlKTtcblxuICAgICAgaWYgKHRyaWdnZXJCbG9jay5oYXNDbGFzcyhjbGFzc0xpc3QudHJpZ2dlckZ1bGxzY3JlZW4pKSB7XG4gICAgICAgIHRoaXMuaG9sZGVyLmFkZENsYXNzKGNsYXNzTGlzdC5mdWxsU2NyZWVuKTtcbiAgICAgIH0gZWxzZSBpZiAodHJpZ2dlckJsb2NrLmhhc0NsYXNzKGNsYXNzTGlzdC50cmlnZ2VyTm9wYWRkaW5nKSkge1xuICAgICAgICB0aGlzLmhvbGRlci5hZGRDbGFzcyhjbGFzc0xpc3Qubm9wYWRkaW5nKTtcbiAgICAgIH0gZWxzZSBpZiAodHJpZ2dlckJsb2NrLmhhc0NsYXNzKGNsYXNzTGlzdC50cmlnZ2VyTm9CZykpIHtcbiAgICAgICAgdGhpcy5vdmVybGF5LmFkZENsYXNzKGNsYXNzTGlzdC5ub0JnKTtcbiAgICAgIH0gZWxzZSBpZiAodHJpZ2dlckJsb2NrLmhhc0NsYXNzKGNsYXNzTGlzdC50cmlnZ2VyV2hpdGVCZykpIHtcbiAgICAgICAgdGhpcy5vdmVybGF5LmFkZENsYXNzKGNsYXNzTGlzdC53aGl0ZUJnKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHVybHR5cGUpIHtcbiAgICAgICAgaWYgKHVybHR5cGUubWF0Y2goL1xcLihwbmd8anBnfGpwZWd8Z2lmKS9nKSkge1xuICAgICAgICAgIHRoaXMuamJveGltZyh1cmx0eXBlLCB0cmlnZ2VyQmxvY2suYXR0cigndGl0bGUnKSk7XG4gICAgICAgIH0gZWxzZSBpZiAoJCh1cmx0eXBlKS5sZW5ndGgpIHtcbiAgICAgICAgICB0aGlzLmpib3hodG1sKHVybHR5cGUpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChvYmp0eXBlICYmIG9ianR5cGUubWF0Y2goL1xcLihwbmd8anBnfGpwZWd8Z2lmKS9nKSkge1xuICAgICAgICB0aGlzLmpib3hpbWcob2JqdHlwZSwgdHJpZ2dlckJsb2NrLmF0dHIoJ3RpdGxlJykpO1xuICAgICAgfVxuXG4gICAgICBpZiAocHJvZHVjdHNrdSkge1xuICAgICAgICB0aGlzLmpib3hza3UocHJvZHVjdHNrdSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog0J/RgNC+0LLQtdGA0LrQsCDQvdCwINGB0YPRiS4gZ2FsbGVyeVxuICAgICAqINCd0LXQvtCx0YXQvtC00LjQvNC+INC60LDQttC00L7QuSDRhNC+0YLQutC1INGD0LrQsNC30LDRgtGMINC60LvQsNGB0YEgZ2FsbGVyeS1YWFgg0LTQu9GPINCz0YDRg9C/0L/QuNGA0L7QstC60Lgg0YTQvtGC0L4g0LIg0LPQsNC70LvQtdGA0LXQuFxuICAgICAqL1xuICAgIGpib3hpbWcoc3JjLCBjYXB0aW9uVGV4dCkge1xuICAgICAgbGV0IGltZ1VybCA9IHNyYy5yZXBsYWNlKCcjJywgJycpO1xuICAgICAgbGV0IHRtcEltZyA9ICQoJzxpbWcvPicpO1xuICAgICAgbGV0ICRjYXB0aW9uID0gY2FwdGlvblRleHQgPyAkKHRoaXMudHBsLmNhcHRpb25UcGwpLnRleHQoY2FwdGlvblRleHQpIDogJyc7XG5cbiAgICAgIC8vdGhpcy5pbm5lci5odG1sKCcnKTsgLy/Rg9C20LUg0L/QvtGH0LjRgdGC0LjQu9C4XG4gICAgICB0aGlzLmhvbGRlci5hZGRDbGFzcygnaW1hZ2UnKTtcblxuICAgICAgdGhpcy5pbm5lclxuICAgICAgICAuYXBwZW5kKHRoaXMudHBsLmltZ1RwbClcbiAgICAgICAgLmFwcGVuZCgkY2FwdGlvbilcbiAgICAgICAgLmFwcGVuZCh0aGlzLnRwbC5vdmVySW1wVHBsKTtcblxuICAgICAgdGhpcy5pbWcgPSBqUXVlcnkoJ2ltZycsIHRoaXMuaW5uZXIpO1xuICAgICAgdGhpcy5pbWdcbiAgICAgICAgLmhpZGUoKVxuICAgICAgICAuYXR0cignc3JjJywgaW1nVXJsKTtcblxuICAgICAgdG1wSW1nWzBdLnNyYyA9IGltZ1VybDtcbiAgICAgICQoJ2JvZHknKS5hcHBlbmQodG1wSW1nKTtcblxuICAgICAgdG1wSW1nLm9uKCdsb2FkJywgKCkgPT4ge1xuICAgICAgICB0aGlzLmltZy5zaG93KCk7XG4gICAgICAgIHRoaXMuamJveFBvc0Fic29sdXRlKGZhbHNlLCB0cnVlKTtcbiAgICAgICAgdG1wSW1nLnJlbW92ZSgpO1xuICAgICAgfSk7XG5cbiAgICAgIC8vdGhpcy5qYm94UG9zQWJzb2x1dGUoKTtcblxuICAgICAgLy8g0J7Qv9GA0LXQtNC10LvRj9C10Lwg0LrQu9Cw0YHRgSDQvtCx0LLQtdGA0YLQutC4XG4gICAgICBsZXQgY2xhc3NOYW1lID0gdGhpcy5nZXRHYWxsZXJ5Q2xhc3ModGhpcy50cmlnZ2VyQmxvY2spO1xuXG4gICAgICAvLyDQn9GA0L7QstC10YDQutCwINC90LAg0YHRg9GJLiBnYWxsZXJ5XG4gICAgICBpZiAoY2xhc3NOYW1lKSB7XG4gICAgICAgIHRoaXMucmVuZGVyR2FsbGVyeShjbGFzc05hbWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGpib3hodG1sKHNlbGVjdG9yKSB7XG4gICAgICBsZXQgJHRhcmdldCA9IHRoaXMudGFyZ2V0ID0gJChzZWxlY3Rvcik7XG4gICAgICBsZXQgaW5uZXJpZCA9IHR5cGVvZiBzZWxlY3RvciA9PT0gJ3N0cmluZycgPyBzZWxlY3Rvci5yZXBsYWNlKCcjJywgJycpIDogJyc7XG5cbiAgICAgIGlmICghJHRhcmdldC5sZW5ndGgpIHJldHVybjtcblxuICAgICAgdGhpcy5wYXJlbnRFbGVtZW50ID0gJHRhcmdldC5wYXJlbnQoKTtcbiAgICAgIHRoaXMuaG9sZGVyLnJlbW92ZUNsYXNzKCdsb2FkaW5nJyk7XG5cbiAgICAgIGlmIChpbm5lcmlkID09ICdhZHZhbnRhZ2VzJykge1xuICAgICAgICBsZXQgdGFyZ2V0Q2xvbmUgPSAkdGFyZ2V0LmNsb25lKHRydWUsIHRydWUpO1xuXG4gICAgICAgIHRhcmdldENsb25lLnJlbW92ZUNsYXNzKCdoaWRlJyk7XG4gICAgICAgIHRoaXMuaW5uZXIuYXBwZW5kKHRhcmdldENsb25lKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICB0aGlzLmlubmVyLmFwcGVuZCgkdGFyZ2V0KTtcbiAgICAgIH1cblxuICAgICAgaWYgKCR0YXJnZXQuaXMoJzpoaWRkZW4nKSkge1xuICAgICAgICAkdGFyZ2V0LmF0dHIoJ2RhdGEtY2FzaGVkLXN0eWxlJywgJHRhcmdldC5hdHRyKCdzdHlsZScpKTtcbiAgICAgICAgJHRhcmdldC5zaG93KCk7XG4gICAgICAgIHRoaXMuaXNIaWRkZW5UYXJnZXQgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmpib3hQb3NBYnNvbHV0ZSgpO1xuICAgIH1cblxuICAgIGpib3hza3UocHJvZHVjdHNrdSkge1xuICAgICAgbGV0IGlubmVyaWQgPSAnI3NrdS0nICsgcHJvZHVjdHNrdTtcblxuICAgICAgaWYgKCEkKGlubmVyaWQpLmxlbmd0aCkgcmV0dXJuO1xuXG4gICAgICB0aGlzLnBhcmVudEVsZW1lbnQgPSAkKGlubmVyaWQpLnBhcmVudCgpO1xuICAgICAgdGhpcy50YXJnZXQgPSAkKCcucC1yZWZlcmVuY2UgJyArIGlubmVyaWQpOyAvLy8gJCgnLnAtcmVmZXJlbmNlICcgKyBpbm5lcmlkKTsgINGH0LXQvCDQvtGC0LvQuNGH0LDQtdGC0YHRjyBpZCDQuCDQutC70LDRgdGBICsgaWQsINGBINGD0YfQtdGC0L7QvCDRgtC+0LPQviwg0YfRgtC+INC90LAg0YHRgtGA0LDQvdC40YbQtSDRg9C90LjQutCw0LvRjNC90YvQtSBpZFxuICAgICAgdGhpcy50YXJnZXQuYXBwZW5kVG8odGhpcy5pbm5lcik7XG4gICAgICB0aGlzLmpib3hQb3NBYnNvbHV0ZSgpO1xuICAgIH1cblxuICAgIC8vINGA0LDQt9C80LXRidCw0LXQvCDQv9C+INGG0LXQvdGC0YDRgyDRjdC60YDQsNC90LBcbiAgICBqYm94UG9zQWJzb2x1dGUobm9BbmltYXRlLCBpbWcpIHtcbiAgICAgIGxldCBob2xkZXIgPSB0aGlzLmhvbGRlcjtcbiAgICAgIGxldCBpbm5lciA9IHRoaXMuaW5uZXI7XG4gICAgICBsZXQgaW5uZXJJbWcgPSBob2xkZXIuZmluZCgnaW1nJyk7XG4gICAgICBsZXQgY2FwdGlvbiA9IGhvbGRlci5maW5kKCcuamJveC1jYXB0aW9uJyk7XG4gICAgICBsZXQgaXNGdWxsU2NyZWVuID0gZmFsc2U7XG4gICAgICBsZXQgX2pib3hQb3NBYnNvbHV0ZSA9IHRoaXMuX2pib3hQb3NBYnNvbHV0ZTtcblxuICAgICAgaWYgKCFob2xkZXIgfHwgIWhvbGRlci5sZW5ndGggfHwgISQodGhpcy5pbm5lcikuaHRtbCgpKSByZXR1cm47XG5cbiAgICAgIGxldCBzY3JvbGxXaWR0aCA9IHRoaXMuZ2V0U2Nyb2xsQmFyV2lkdGgoKTtcblxuICAgICAgaWYgKHR5cGVvZiBfamJveFBvc0Fic29sdXRlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICQod2luZG93KS5vZmYoJ3Jlc2l6ZScsIF9qYm94UG9zQWJzb2x1dGUpO1xuICAgICAgfVxuXG4gICAgICBfamJveFBvc0Fic29sdXRlID0gdGhpcy5famJveFBvc0Fic29sdXRlID0gdGhpcy5qYm94UG9zQWJzb2x1dGUuYmluZCh0aGlzLCB0cnVlLCBpbWcpO1xuXG4gICAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIF9qYm94UG9zQWJzb2x1dGUpO1xuXG4gICAgICBob2xkZXIudHJpZ2dlcih0aGlzLmJlZm9yZU9wZW5FdmVudCk7XG5cbiAgICAgICQoJ2h0bWwsIGJvZHknKS5jc3Moe1xuICAgICAgICAnb3ZlcmZsb3cnOiAnaGlkZGVuJyxcbiAgICAgICAgJ3Bvc2l0aW9uJzogJ3JlbGF0aXZlJyxcbiAgICAgIH0pO1xuICAgICAgJCgnYm9keScpLmNzcyh7XG4gICAgICAgICdwYWRkaW5nLXJpZ2h0Jzogc2Nyb2xsV2lkdGggKyAncHgnLFxuICAgICAgfSk7XG5cbiAgICAgIGxldCB3aCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQ7XG4gICAgICBsZXQgd3cgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGg7XG5cbiAgICAgIC8v0YHQsdGA0LDRgdGL0LLQsNC10Lwg0L/QvtC70L7QttC10L3QuNC1XG4gICAgICBob2xkZXJcbiAgICAgICAgLmNzcyh7XG4gICAgICAgICAgJ3Bvc2l0aW9uJzogJ2ZpeGVkJyxcbiAgICAgICAgICAnZGlzcGxheSc6ICdibG9jaycsXG4gICAgICAgICAgJ3RvcCc6ICctMTAwMDBweCcsXG4gICAgICAgICAgJ2xlZnQnOiAnLTEwMDAwcHgnLFxuICAgICAgICAgICd2aXNpYmlsaXR5JzogJ2hpZGRlbicsXG4gICAgICAgICAgJ3dpZHRoJzogJycsXG4gICAgICAgICAgJ2hlaWdodCc6ICcnLFxuICAgICAgICAgICdtYXgtd2lkdGgnOiAnJyxcbiAgICAgICAgICAnbWF4LWhlaWdodCc6ICcnLFxuICAgICAgICAgICdtYXJnaW4nOiAnJyxcbiAgICAgICAgICAnb3ZlcmZsb3dZJzogJydcbiAgICAgICAgfSlcbiAgICAgICAgLnJlbW92ZUNsYXNzKCdjb21wYWN0Jyk7XG4gICAgICBpbm5lci5jc3Moe1xuICAgICAgICAndG9wJzogJydcbiAgICAgIH0pO1xuXG4gICAgICBpZiAoaW1nKSB7XG4gICAgICAgIGlubmVySW1nLmNzcyh7XG4gICAgICAgICAgJ3dpZHRoJzogJycsXG4gICAgICAgICAgJ2hlaWdodCc6ICcnXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChjYXB0aW9uLmxlbmd0aCkge1xuICAgICAgICAgIGNhcHRpb24uY3NzKHtcbiAgICAgICAgICAgICdtYXgtd2lkdGgnOiAnJ1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGxldCBob2xkZXJIID0gaG9sZGVyLm91dGVySGVpZ2h0KCk7XG4gICAgICBsZXQgcmVzdWx0SCA9IGhvbGRlckg7XG4gICAgICBcblxuICAgICAgLy8g0JTQu9GPINC40LfQvtCx0YDQsNC20LXQvdC40Y8g0LTQtdC70LDQtdC8INCy0YvRgdC+0YLRgyDQvdC1INCx0L7Qu9GM0YjQtSDRjdC60YDQsNC90LBcbiAgICAgIGlmIChpbWcpIHtcbiAgICAgICAgaWYgKGhvbGRlckggPj0gd2gpIHtcbiAgICAgICAgICBsZXQgaW5uZXJGcmVlU3BhY2UgPSBpbm5lci5oZWlnaHQoKTtcbiAgICAgICAgICBpZiAoY2FwdGlvbi5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlubmVyRnJlZVNwYWNlIC09IGNhcHRpb24uaGVpZ2h0KCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgIGhvbGRlci5jc3MoJ2hlaWdodCcsIHdoICsgJ3B4Jyk7XG4gICAgICAgICAgaW5uZXJJbWcuY3NzKCdoZWlnaHQnLCAod2ggLSAoaG9sZGVySCAtIGlubmVyRnJlZVNwYWNlKSkgKyAncHgnKTtcbiAgICAgICAgICBob2xkZXJIID0gd2g7XG4gICAgICAgICAgcmVzdWx0SCA9IHdoO1xuXG4gICAgICAgICAgaWYgKGlubmVySW1nLndpZHRoKCkgPCBjYXB0aW9uLndpZHRoKCkpIHtcbiAgICAgICAgICAgIGxldCBtYXhDYXB0aW9uV2lkdGggPSB3aCA+IGlubmVySW1nLndpZHRoKCkgKiA0ID8gaW5uZXJJbWcud2lkdGgoKSAqIDIgOiBpbm5lckltZy53aWR0aCgpO1xuXG4gICAgICAgICAgICBjYXB0aW9uLmNzcyh7XG4gICAgICAgICAgICAgICdtYXgtd2lkdGgnOiBtYXhDYXB0aW9uV2lkdGggKyAncHgnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlubmVyRnJlZVNwYWNlID0gaW5uZXIuaGVpZ2h0KCkgLSBjYXB0aW9uLmhlaWdodCgpO1xuICAgICAgICAgICAgaW5uZXJJbWdcbiAgICAgICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAgICAgJ2hlaWdodCc6ICh3aCAtIChob2xkZXJIIC0gaW5uZXJGcmVlU3BhY2UpKSArICdweCcsXG4gICAgICAgICAgICAgICAgJ21hcmdpbic6ICdhdXRvJyxcbiAgICAgICAgICAgICAgICAnZGlzcGxheSc6ICdibG9jaydcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5lbmFibGVab29tKCk7XG4gICAgICB9XG5cbiAgICAgIGlmICghaW1nICYmIGhvbGRlckggPj0gd2gpIHtcbiAgICAgICAgaG9sZGVyLmNzcyh7XG4gICAgICAgICAgJ2hlaWdodCc6IHdoICsgJ3B4JyxcbiAgICAgICAgICAnbWF4LXdpZHRoJzogJzEwMCUnLFxuICAgICAgICAgICdvdmVyZmxvd1knOiAnYXV0bydcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmVzdWx0SCA9IHdoO1xuICAgICAgICBpc0Z1bGxTY3JlZW4gPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICBsZXQgaG9sZGVyVyA9IGhvbGRlci5vdXRlcldpZHRoKCk7XG4gICAgICBsZXQgcmVzdWx0VyA9IGhvbGRlclc7XG5cbiAgICAgIGlmIChob2xkZXJXID49IHd3KSB7XG4gICAgICAgIGhvbGRlclxuICAgICAgICAgIC5hZGRDbGFzcygnY29tcGFjdCcpXG4gICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAnaGVpZ2h0Jzogd2ggKyAncHgnLFxuICAgICAgICAgICAgJ21heC13aWR0aCc6ICcxMDAlJyxcbiAgICAgICAgICAgICdvdmVyZmxvd1knOiAnYXV0bydcbiAgICAgICAgICB9KTtcbiAgICAgICAgaWYgKGltZykge1xuICAgICAgICAgIGlubmVySW1nLmNzcyh7XG4gICAgICAgICAgICAnbWF4LXdpZHRoJzogJzEwMCUnLFxuICAgICAgICAgICAgJ3dpZHRoJzogJ2F1dG8nLFxuICAgICAgICAgICAgJ21hcmdpbic6ICdhdXRvJ1xuICAgICAgICAgIH0pO1xuICAgICAgICB9LyogZWxzZSB7XG4gICAgICAgICAgaW5uZXIuY2hpbGRyZW4oKS5lcSgwKS5jc3Moe1xuICAgICAgICAgICAgJ21heC13aWR0aCc6ICcxMDAlJyxcbiAgICAgICAgICAgICd3aWR0aCc6ICdhdXRvJ1xuICAgICAgICAgIH0pO1xuICAgICAgICB9Ki9cbiAgICAgICAgcmVzdWx0VyA9IHd3O1xuICAgICAgICBpc0Z1bGxTY3JlZW4gPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICBsZXQgdG9wID0gd2ggLSBob2xkZXJIID4gMCA/ICh3aCAvIDIpIC0gKHJlc3VsdEggLyAyKSA6IDA7XG4gICAgICBsZXQgbGVmdCA9IHd3IC0gaG9sZGVyVyA+IDAgPyAod3cgLyAyKSAtIChyZXN1bHRXIC8gMikgOiAwO1xuXG4gICAgICBpZiAoaXNGdWxsU2NyZWVuKSB7XG4gICAgICAgIHRvcCA9IDA7XG5cbiAgICAgICAgbGV0IGlubmVySCA9IGlubmVyLm91dGVySGVpZ2h0KCk7XG4gICAgICAgIGxldCBpbm5lcldyYXBIID0gaG9sZGVyLmZpbmQoJy5pbm5lci13cmFwJykuaGVpZ2h0KCk7XG5cbiAgICAgICAgLypjZW50ZXIgaW5uZXIgaW4gaG9sZGVyKi9cbiAgICAgICAgaWYgKGlubmVySCA8IGlubmVyV3JhcEgpIHtcbiAgICAgICAgICBpbm5lci5jc3Moe1xuICAgICAgICAgICAgJ3RvcCc6IChpbm5lcldyYXBIIC8gMikgLSAoaW5uZXJIIC8gMikgKyAncHgnXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaG9sZGVyLmNzcyh7XG4gICAgICAgICd0b3AnOiB0b3AgKyAncHgnLFxuICAgICAgICAnbGVmdCc6IGxlZnQgKyAncHgnLFxuICAgICAgICAndmlzaWJpbGl0eSc6ICd2aXNpYmxlJyxcbiAgICAgICAgJ2Rpc3BsYXknOiAnbm9uZScsXG4gICAgICAgICdwb3NpdGlvbic6ICdmaXhlZCdcbiAgICAgIH0pO1xuXG5cbiAgICAgIGlmICghbm9BbmltYXRlKSB7XG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVDbG9zZUJ0bkhhbmRsZXIpIHtcbiAgICAgICAgICB0aGlzLmNsb3NlQnRuLmhpZGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMub3ZlcmxheS5mYWRlSW4oMjAwKTtcbiAgICAgICAgaG9sZGVyXG4gICAgICAgICAgLmRlbGF5KDI1MClcbiAgICAgICAgICAuZmFkZUluKDIwMCwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5yZWZyZXNoU2xpZGVyKCk7XG4gICAgICAgICAgICBob2xkZXIudHJpZ2dlcih0aGlzLmFmdGVyT3BlbkV2ZW50KTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5yZW1vdmVDbGFzcygnbG9hZGluZycpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaG9sZGVyLnNob3coKTtcbiAgICAgICAgdGhpcy5yZWZyZXNoU2xpZGVyKCk7XG4gICAgICAgIGhvbGRlci50cmlnZ2VyKHRoaXMuYWZ0ZXJPcGVuRXZlbnQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNsZWFuKCkge1xuICAgICAgdGhpcy5ob2xkZXIudHJpZ2dlcih0aGlzLmJlZm9yZUNsZWFuRXZlbnQpO1xuXG4gICAgICAvL2pRdWVyeSh0aGlzKS5wYXJlbnQoJy5hbmNob3J0YXJnZXQnKS5oaWRlKCk7XG4gICAgICBpZiAodGhpcy5pc0hpZGRlblRhcmdldCkge1xuICAgICAgICBsZXQgY2FzaGVkU3R5bGVzID0gdGhpcy50YXJnZXQuYXR0cignZGF0YS1jYXNoZWQtc3R5bGUnKSB8fCAnJztcbiAgICAgICAgdGhpcy50YXJnZXQuYXR0cignc3R5bGUnLCBjYXNoZWRTdHlsZXMpO1xuICAgICAgICB0aGlzLnRhcmdldC5yZW1vdmVBdHRyKCdkYXRhLWNhc2hlZC1zdHlsZScpO1xuICAgICAgICB0aGlzLmlzSGlkZGVuVGFyZ2V0ID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnBhcmVudEVsZW1lbnQgJiYgdGhpcy5wYXJlbnRFbGVtZW50Lmxlbmd0aCkge1xuICAgICAgICB0aGlzLnBhcmVudEVsZW1lbnQuYXBwZW5kKHRoaXMudGFyZ2V0KTtcbiAgICAgIH1cbiAgICAgIHRoaXMuaW5uZXIuZW1wdHkoKTtcbiAgICAgIHRoaXMucGFyZW50RWxlbWVudCA9IG51bGw7XG4gICAgICB0aGlzLnRhcmdldCA9IG51bGw7XG4gICAgICB0aGlzLnRyaWdnZXJCbG9jayA9IG51bGw7XG5cbiAgICAgIC8vJCgnYm9keScpLnJlbW92ZUNsYXNzKCdtLXZpZXcnKTtcbiAgICAgICQoJ2h0bWwsIGJvZHknKS5jc3Moe1xuICAgICAgICAncGFkZGluZy1yaWdodCc6ICcnLFxuICAgICAgICAnb3ZlcmZsb3cnOiAnJyxcbiAgICAgICAgJ3Bvc2l0aW9uJzogJycsXG4gICAgICAgICdoZWlnaHQnOiAnJ1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuaG9sZGVyXG4gICAgICAgIC5jc3Moe1xuICAgICAgICAgICdwb3NpdGlvbic6ICdhYnNvbHV0ZScsXG4gICAgICAgICAgJ2Rpc3BsYXknOiAnYmxvY2snLFxuICAgICAgICAgICd0b3AnOiAnLTEwMDAwcHgnLFxuICAgICAgICAgICdsZWZ0JzogJy0xMDAwMHB4JyxcbiAgICAgICAgICAndmlzaWJpbGl0eSc6ICdoaWRkZW4nLFxuICAgICAgICAgICd3aWR0aCc6ICdhdXRvJyxcbiAgICAgICAgICAnaGVpZ2h0JzogJ2F1dG8nLFxuICAgICAgICAgICdtYXgtd2lkdGgnOiAnbm9uZScsXG4gICAgICAgICAgJ21hcmdpbic6ICcwJyxcbiAgICAgICAgICAnb3ZlcmZsb3dZJzogJydcbiAgICAgICAgfSk7XG5cbiAgICAgIHRoaXMuaW5uZXIuY3NzKHtcbiAgICAgICAgJ3RvcCc6ICcnXG4gICAgICB9KTtcblxuICAgICAgdGhpcy5ob2xkZXJbMF0uY2xhc3NOYW1lID0gJ2pib3gtaG9sZGVyIGhpZGUgbG9hZGluZyc7XG4gICAgICB0aGlzLm92ZXJsYXlbMF0uY2xhc3NOYW1lID0gJ2pib3gtb3ZlcmxheSBoaWRlJztcblxuICAgICAgdGhpcy5ob2xkZXIudHJpZ2dlcih0aGlzLmFmdGVyQ2xlYW5FdmVudCk7XG5cbiAgICAgICQod2luZG93KS5vZmYoJ3Jlc2l6ZScsIHRoaXMuX2pib3hQb3NBYnNvbHV0ZSk7XG5cbiAgICAgIHRoaXMuZGlzYWJsZVpvb20oKTtcbiAgICB9XG5cbiAgICBoaWRlQmxvY2soKSB7XG4gICAgICB0aGlzLmhvbGRlci50cmlnZ2VyKHRoaXMuYmVmb3JlQ2xvc2VFdmVudCk7XG4gICAgICB0aGlzLmlzQ2xvc2luZyA9IHRydWU7XG5cbiAgICAgIHRoaXMuaG9sZGVyLmFkZCh0aGlzLm92ZXJsYXkpLmZhZGVPdXQoMjAwLCAoKSA9PiB7XG4gICAgICAgIHRoaXMuY2xlYW4oKTtcbiAgICAgICAgdGhpcy5kaXNhYmxlT3ZlcmxheUhhbmRsZXIgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5kaXNhYmxlQ2xvc2VCdG5IYW5kbGVyID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY2xvc2VCdG4uc2hvdygpO1xuICAgICAgICB0aGlzLmlzQ2xvc2luZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmhvbGRlci50cmlnZ2VyKHRoaXMuYWZ0ZXJDbG9zZUV2ZW50KTtcbiAgICAgIH0pO1xuXG4gICAgICAkKHdpbmRvdykub2ZmKCdyZXNpemUnLCB0aGlzLl9qYm94UG9zQWJzb2x1dGUpO1xuICAgIH1cblxuICAgIGlzRWxlbWVudChvKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICB0eXBlb2YgSFRNTEVsZW1lbnQgPT09IFwib2JqZWN0XCIgPyBvIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgOiAvL0RPTTJcbiAgICAgICAgICBvICYmIHR5cGVvZiBvID09PSBcIm9iamVjdFwiICYmIG8gIT09IG51bGwgJiYgby5ub2RlVHlwZSA9PT0gMSAmJiB0eXBlb2Ygby5ub2RlTmFtZSA9PT0gXCJzdHJpbmdcIlxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZWZyZXNoU2xpZGVyKCkge1xuICAgICAgbGV0ICRzbGlkZXIgPSB0aGlzLmlubmVyLmZpbmQoJy5qc19fc2xpY2snKTtcblxuICAgICAgaWYgKCEkc2xpZGVyLmxlbmd0aCkgcmV0dXJuO1xuXG4gICAgICAkc2xpZGVyLmVhY2goKGksIGVsKSA9PiB7XG4gICAgICAgIGVsLnNsaWNrLnJlZnJlc2godHJ1ZSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBnZXRTY3JvbGxCYXJXaWR0aCgpIHtcbiAgICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGxldCBzY3JvbGxCYXJXaWR0aCA9IDA7XG5cbiAgICAgICQoZGl2KS5jc3Moe1xuICAgICAgICAnd2lkdGgnOiAnMTAwcHgnLFxuICAgICAgICAnaGVpZ2h0JzogJzEwMHB4JyxcbiAgICAgICAgJ292ZXJmbG93WSc6ICdzY3JvbGwnLFxuICAgICAgICAndmlzaWJpbGl0eSc6ICdoaWRkZW4nXG4gICAgICB9KTtcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZGl2KTtcblxuICAgICAgc2Nyb2xsQmFyV2lkdGggPSBkaXYub2Zmc2V0V2lkdGggLSBkaXYuY2xpZW50V2lkdGg7XG5cbiAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoZGl2KTtcblxuICAgICAgcmV0dXJuIHNjcm9sbEJhcldpZHRoO1xuICAgIH1cblxuICAgIHBhcnNlVXJsKCkge1xuICAgICAgbGV0IHN0ciA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoO1xuICAgICAgbGV0IHBhdHRlcm4gPSAnamJveF9pZD0nO1xuICAgICAgbGV0IGluZGV4ID0gc3RyLmluZGV4T2YocGF0dGVybik7XG5cbiAgICAgIGlmICghfmluZGV4KSByZXR1cm4gbnVsbDtcblxuICAgICAgbGV0IHNlbGVjdG9yU3RhcnQgPSBpbmRleCArIHBhdHRlcm4ubGVuZ3RoO1xuICAgICAgbGV0IHNlbGVjdG9yRW5kID0gfnN0ci5pbmRleE9mKCclJywgc2VsZWN0b3JTdGFydCkgPyBzdHIuaW5kZXhPZignJicsIHNlbGVjdG9yU3RhcnQpIDogdW5kZWZpbmVkO1xuICAgICAgbGV0IHNlbGVjdG9yID0gc3RyLnNsaWNlKHNlbGVjdG9yU3RhcnQsIHNlbGVjdG9yRW5kKTtcblxuICAgICAgaWYgKCFkb2N1bWVudC5ib2R5LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpKSB7XG4gICAgICAgIGlmICghZG9jdW1lbnQuYm9keS5xdWVyeVNlbGVjdG9yKCcjJyArIHNlbGVjdG9yKSkgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgc2VsZWN0b3IgPSAnIycgKyBzZWxlY3RvcjtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHNlbGVjdG9yO1xuICAgIH1cblxuICAgIGVuYWJsZVpvb20oKSB7XG4gICAgICBpZiAodGhpcy56b29tRW5hYmxlZCkgcmV0dXJuO1xuXG5cbiAgICAgIHRoaXMuJHZpZXdQb3J0LmF0dHIoJ2NvbnRlbnQnLCB0aGlzLnZpZXdQb3J0Q29udGVudFpvb20pO1xuICAgICAgdGhpcy56b29tRW5hYmxlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgZGlzYWJsZVpvb20oKSB7XG4gICAgICBpZiAoIXRoaXMuem9vbUVuYWJsZWQpIHJldHVybjtcblxuICAgICAgdGhpcy4kdmlld1BvcnQuYXR0cignY29udGVudCcsIHRoaXMudmlld1BvcnRDb250ZW50KTtcbiAgICAgIHRoaXMuJHZpZXdQb3J0LmF0dHIoJ2NvbnRlbnQnLCB0aGlzLnZpZXdQb3J0Q29udGVudCk7XG4gICAgICB0aGlzLnpvb21FbmFibGVkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgLyp1bnVzZWQgZnVuYyovXG4gICAgamJveENoZWNrTm9maXhlZCgpIHtcbiAgICAgIGxldCBqYm94SG9sZGVyID0gdGhpcy5ob2xkZXI7XG5cbiAgICAgIGpib3hIb2xkZXIucmVtb3ZlQ2xhc3MoJ25vZml4ZWQnKTtcbiAgICAgIGlmIChqYm94SG9sZGVyLmhlaWdodCgpID4galF1ZXJ5KHdpbmRvdykuaGVpZ2h0KCkpIHtcbiAgICAgICAgamJveEhvbGRlci5hZGRDbGFzcygnbm9maXhlZCcpXG4gICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAndG9wJzogJzAnLFxuICAgICAgICAgICAgJ21hcmdpbi10b3AnOiAnMTAwcHgnLFxuICAgICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGdldEJsb2NrU2l6ZShibG9jaykge1xuICAgICAgLy9sZXQgYmxvY2sgPVxuICAgICAgbGV0IHJlc3VsdCA9IHt9O1xuXG4gICAgICAkaW1nXG4gICAgICAgIC5hdHRyKCdzcmMnLCBzcmMpXG4gICAgICAgIC5jc3Moe1xuICAgICAgICAgICdwb3NpdGlvbic6ICdhYnNvbHV0ZScsXG4gICAgICAgICAgJ3RvcCc6ICctMTAwMDBweCcsXG4gICAgICAgICAgJ2xlZnQnOiAnLTEwMDAwcHgnLFxuICAgICAgICAgICd2aXNpYmlsaXR5JzogJ2hpZGRlbicsXG4gICAgICAgICAgJ3dpZHRoJzogJ2F1dG8nLFxuICAgICAgICAgICdoZWlnaHQnOiAnYXV0bycsXG4gICAgICAgICAgJ21hcmdpbic6ICcwJyxcbiAgICAgICAgICAncGFkZGluZyc6ICcwJ1xuICAgICAgICB9KTtcblxuICAgICAgJCgnYm9keScpLmFwcGVuZCgkaW1nKTtcblxuICAgICAgcmVzdWx0LmhlaWdodCA9ICRpbWdbMF0uY2xpZW50SGVpZ2h0O1xuICAgICAgcmVzdWx0LndpZHRoID0gJGltZ1swXS5jbGllbnRXaWR0aDtcblxuICAgICAgJGltZy5yZW1vdmUoKTtcblxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gIH1cblxuICAkKGRvY3VtZW50KS5yZWFkeSgoKSA9PiB7XG4gICAgJC5qQm94ID0gbmV3IEpCb3hDb250cm9sbGVyKHt9KTtcbiAgfSk7XG59KTtcbiJdfQ==
