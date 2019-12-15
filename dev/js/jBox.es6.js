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

  class Gallery {
    constructor(options) {
      this.className = options.className;
      this.indexCurrent = 0;
      this.targetEl = options.targetEl;
      this.jboxObj = options.jbox;
      this.tpl = {
        controlTpl: '<div class="jbox-control"><span class="prev"></span><span class="next"></span></div>'
      };

      this.init();
    }

    init() {
      let elements = $('a.jbox.' + this.className);
      let gallerySrc = this.gallerySrc = this.getGallerySrc(elements);

      if (!gallerySrc.length) return;

      let imgCurrent = this.imgCurrent = $('img', this.jboxObj.inner);
      let control = this.control = $(this.tpl.controlTpl);
      this.indexCurrent = parseInt(gallerySrc.indexOf(this.targetEl.attr('href')));
      this.indexSumm = gallerySrc.length - 1;

      imgCurrent.after(control);

      /*TODO необходимо сделать этот эффект при помощи css*/
      $('span', control).hover(function () {
        $(this).animate({opacity: 1}, 150);
      }, function () {
        $(this).animate({opacity: 0}, 50);
      });

      // control
      control.on('click', this.controlHandler.bind(this));
    }

    controlHandler(e) {
      let el = e.target;
      let prevBtn = $(el).closest('.prev');
      let nextBtn = $(el).closest('.next');

      if (prevBtn.length) {
        this.changeImg('prev');
        return;
      }

      if (nextBtn.length) {
        this.changeImg('next');
        return;
      }
    }

    changeImg(direction) {
      switch (direction) {
        case 'prev':
          this.indexCurrent = this.indexCurrent > 0 ? --this.indexCurrent : this.indexSumm;
          break;
        case 'next':
          this.indexCurrent = this.indexCurrent >= this.indexSumm ? 0 : ++this.indexCurrent;
          break;
      }

      let imgUrl = this.gallerySrc[this.indexCurrent];
      let img = this.imgCurrent;

      // tmp img for validate downloads img
      let tmpimg = $('<img/>');
      let isLoadedImg = false;
      tmpimg
        .css({
          'display': 'none'
        })
        .appendTo($('body'));

      tmpimg.on('load', () => {
        isLoadedImg = true;
        tmpimg.remove();
      });

      tmpimg[0].src = imgUrl;

      img.fadeTo(300, 0.1, () => {
        if (isLoadedImg) {
          img.attr('src', imgUrl)
            .fadeTo(250, 1);
          this.jboxObj.jboxPosAbsolute.apply(this.jboxObj, [true, true]);
        } else {
          tmpimg.on('load', () => {
            img.attr('src', imgUrl)
              .fadeTo(250, 1);

            this.jboxObj.jboxPosAbsolute.apply(this.jboxObj, [true, true]);
          });
        }
        
      });
    }

    getGallerySrc($links) {
      let src = [];

      $links.each(function() {
        let $el = $(this);
        let currSrc = $el.attr('href');

        if (~src.indexOf(currSrc)) return;

        src.push(currSrc);
      });

      return src;
    }
  }

  class JBoxController {
    constructor(options) {
      this.gallerySelector = options.gallerySelector || '[class*="gallery-"]';
      this.targetSelectorsArr = options.targetSelectorsArr || [
          '.jbox',
          '#p-tbl-compact a:not(.anchor, .no-jbox)',
          '#p-tbl a:not(.anchor, [target="_blank"], .no-jbox)',
          'a.buy'
        ];
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

    init() {
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
      let selector = this.parseUrl();

      if (selector) {
        this.jboxhtml(selector);
      }

      /*viewport caching*/
      this.$viewPort = $('meta[name="viewport"]');
      this.viewPortContent = this.$viewPort.attr('content');
    }

    renderJbox() {
      let $parent = $('#page').length ? $('#page'): $('body');
      this.holder = $(this.tpl.holderTpl);
      this.overlay = $(this.tpl.overlayTpl);
      this.innerWrap = $(this.tpl.innerWrapTpl);
      this.inner = $(this.tpl.innerTpl);
      this.closeBtn = $(this.tpl.closeBtnTpl);

      $parent
        .append(this.overlay)
        .append(this.holder);

      this.innerWrap.append(this.inner);
      this.holder
        .append(this.innerWrap)
        .append(this.closeBtn);
    }

    getGalleryClass(el) {
      if (!el || !this.isElement(el[0])) return;

      let objClass = el.attr('class').split(/\s+/);
      let className = null;

      jQuery.each(objClass, function (index, item) {
        if (!~item.indexOf('gallery-')) return;

        className = item;
      });

      return className;
    }

    prepareGalleryClasses() {
      let galleries = this.galleries = $(this.gallerySelector).not('a');

      galleries.each((index, item) => {
        let gallery = jQuery(item);
        let className = this.getGalleryClass(gallery);

        if (!className) return;

        jQuery('a.jbox', gallery).each((index, item) => {
          jQuery(item).addClass(className);
        });
      });
    }

    renderGallery(className) {
      let _ = this;
      let options = {
        className: className,
        indexCurrent: 0,
        targetEl: _.triggerBlock,
        jbox: _
      };

      this._onKeyDown = this.onKeyDown.bind(this);

      /*creating gallery object*/
      _.gallery = new Gallery(options);

      // Events when you press forward / backward.
      _.holder.hover(
        _.onMouseenter.bind(_),
        _.onMouseLeave.bind(_)
      );

      //Enable swiping...
      _.holder.swipe({
        //Generic swipe handler for all directions
        swipe: _.onSwipe.bind(_)
      });
    }

    showHandler(e) {
      let targetSelector = this.targetSelectorsArr.join(', ');
      let el = e.target;
      let target = $(el).closest(targetSelector);


      if (!target.length) return;
      e.preventDefault();

      this.showBlock(target);
    }

    jeventHandler(e, scenario) {
      if (!scenario || scenario.openingMethod !== this.jeventOpeningMethod) return;

      let target = scenario.target;
      let caption = scenario.caption;
      let $target = $(target);

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

    closeHandler(e) {
      let $el = $(e.target);

      if ($el.is(this.closeBtn) && !this.disableCloseBtnHandler) {
        this.hideBlock();
        return;
      }

      if ($el.is(this.overlay) && !this.disableOverlayHandler) {
        this.hideBlock();
        return;
      }
    }

    onMouseenter() {
      $(document).on('keydown', this._onKeyDown);
    }

    onMouseLeave() {
      $(document).off('keydown', this._onKeyDown);
    }

    onKeyDown(e) {
      switch ((e.keyCode ? e.keyCode : e.which)) {
        case 37:   // Left Arrow
          e.preventDefault();
          this.gallery.changeImg('prev');
          break;
        case 39:   // Right Arrow
          e.preventDefault();
          this.gallery.changeImg('next');
          break;
      }
    }

    onSwipe(event, direction, distance, duration, fingerCount, fingerData) {
      switch (direction) {
        case 'left':
          this.gallery.changeImg('next');
          break;
        case 'right':
          this.gallery.changeImg('prev');
          break;
      }
    }

    open(options) {
      if (typeof options !== 'object') return;

      let href = options.href;
      let $target = $(href);
      let content = options.content;
      let customHolderClass = options.customHolderClass || '';
      let customOverlayClass = options.customOverlayClass || '';

      if (!$target.length && !content) return;

      let openHandler = () => {
        this.disableCloseBtnHandler = options.disableCloseBtnHandler || false;
        this.disableOverlayHandler = options.disableOverlayHandler || false;

        this.clean();
        this.holder.addClass(customHolderClass);
        this.overlay.addClass(customOverlayClass);

        if (!href && content) {
          let $contentWrapper = $('<div></div>');

          $contentWrapper.append(content);
          this.inner.append($contentWrapper);
          this.jboxhtml($contentWrapper);
          return;
        } else if (typeof href === 'string' && !$target.length) {
          if (href.match(/\.(png|jpg|jpeg|gif)/g)) {
            this.jboximg(href, content);
            return;
          } else if ($('#sku-' + href).length) {
            this.jboxsku(href);
            return;
          }
        } else if ($target.length) {
          if ($target.is('img')) {
            this.jboximg($target.attr('src'), $target.attr('title'));
            return;
          } else {
            this.jboxhtml($target);
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

    close() {
      //
      this.hideBlock();
    }

    showBlock(block) { //open based on triggered element
      this.clean();

      let triggerBlock = this.triggerBlock = jQuery(block);
      let urltype = triggerBlock.attr('href') || triggerBlock.attr('data-jbox-target');
      let objtype = triggerBlock.attr('src');
      let productsku = triggerBlock.attr('id');
      let classList = this.classList;

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
    jboximg(src, captionText) {
      let imgUrl = src.replace('#', '');
      let tmpImg = $('<img/>');
      let $caption = captionText ? $(this.tpl.captionTpl).text(captionText) : '';

      //this.inner.html(''); //уже почистили
      this.holder.addClass('image');

      this.inner
        .append(this.tpl.imgTpl)
        .append($caption)
        .append(this.tpl.overImpTpl);

      this.img = jQuery('img', this.inner);
      this.img
        .hide()
        .attr('src', imgUrl);

      tmpImg[0].src = imgUrl;
      $('body').append(tmpImg);

      tmpImg.on('load', () => {
        this.img.show();
        this.jboxPosAbsolute(false, true);
        tmpImg.remove();
      });

      //this.jboxPosAbsolute();

      // Определяем класс обвертки
      let className = this.getGalleryClass(this.triggerBlock);

      // Проверка на сущ. gallery
      if (className) {
        this.renderGallery(className);
      }
    }

    jboxhtml(selector) {
      let $target = this.target = $(selector);
      let innerid = typeof selector === 'string' ? selector.replace('#', '') : '';

      if (!$target.length) return;

      this.parentElement = $target.parent();
      this.holder.removeClass('loading');

      if (innerid == 'advantages') {
        let targetClone = $target.clone(true, true);

        targetClone.removeClass('hide');
        this.inner.append(targetClone);
      }
      else {
        this.inner.append($target);
      }

      if ($target.is(':hidden')) {
        $target.attr('data-cashed-style', $target.attr('style'));
        $target.show();
        this.isHiddenTarget = true;
      }

      this.jboxPosAbsolute();
    }

    jboxsku(productsku) {
      let innerid = '#sku-' + productsku;

      if (!$(innerid).length) return;

      this.parentElement = $(innerid).parent();
      this.target = $('.p-reference ' + innerid); /// $('.p-reference ' + innerid);  чем отличается id и класс + id, с учетом того, что на странице уникальные id
      this.target.appendTo(this.inner);
      this.jboxPosAbsolute();
    }

    // размещаем по центру экрана
    jboxPosAbsolute(noAnimate, img) {
      let holder = this.holder;
      let inner = this.inner;
      let innerImg = holder.find('img');
      let caption = holder.find('.jbox-caption');
      let isFullScreen = false;
      let _jboxPosAbsolute = this._jboxPosAbsolute;

      if (!holder || !holder.length || !$(this.inner).html()) return;

      let scrollWidth = this.getScrollBarWidth();

      if (typeof _jboxPosAbsolute === 'function') {
        $(window).off('resize', _jboxPosAbsolute);
      }

      _jboxPosAbsolute = this._jboxPosAbsolute = this.jboxPosAbsolute.bind(this, true, img);

      $(window).on('resize', _jboxPosAbsolute);

      holder.trigger(this.beforeOpenEvent);

      $('html, body').css({
        'overflow': 'hidden',
        'position': 'relative',
      });
      $('body').css({
        'padding-right': scrollWidth + 'px',
      });

      let wh = document.documentElement.clientHeight;
      let ww = document.documentElement.clientWidth;

      //сбрасываем положение
      holder
        .css({
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
        })
        .removeClass('compact');
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

      let holderH = holder.outerHeight();
      let resultH = holderH;
      

      // Для изображения делаем высоту не больше экрана
      if (img) {
        if (holderH >= wh) {
          let innerFreeSpace = inner.height();
          if (caption.length) {
            innerFreeSpace -= caption.height();
          }
          
          holder.css('height', wh + 'px');
          innerImg.css('height', (wh - (holderH - innerFreeSpace)) + 'px');
          holderH = wh;
          resultH = wh;

          if (innerImg.width() < caption.width()) {
            let maxCaptionWidth = wh > innerImg.width() * 4 ? innerImg.width() * 2 : innerImg.width();

            caption.css({
              'max-width': maxCaptionWidth + 'px'
            });
            innerFreeSpace = inner.height() - caption.height();
            innerImg
              .css({
                'height': (wh - (holderH - innerFreeSpace)) + 'px',
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

      let holderW = holder.outerWidth();
      let resultW = holderW;

      if (holderW >= ww) {
        holder
          .addClass('compact')
          .css({
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
        }/* else {
          inner.children().eq(0).css({
            'max-width': '100%',
            'width': 'auto'
          });
        }*/
        resultW = ww;
        isFullScreen = true;
      }

      let top = wh - holderH > 0 ? (wh / 2) - (resultH / 2) : 0;
      let left = ww - holderW > 0 ? (ww / 2) - (resultW / 2) : 0;

      if (isFullScreen) {
        top = 0;

        let innerH = inner.outerHeight();
        let innerWrapH = holder.find('.inner-wrap').height();

        /*center inner in holder*/
        if (innerH < innerWrapH) {
          inner.css({
            'top': (innerWrapH / 2) - (innerH / 2) + 'px'
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
        holder
          .delay(250)
          .fadeIn(200, () => {
            this.refreshSlider();
            holder.trigger(this.afterOpenEvent);
          })
          .removeClass('loading');
      } else {
        holder.show();
        this.refreshSlider();
        holder.trigger(this.afterOpenEvent);
      }
    }

    clean() {
      this.holder.trigger(this.beforeCleanEvent);

      //jQuery(this).parent('.anchortarget').hide();
      if (this.isHiddenTarget) {
        let cashedStyles = this.target.attr('data-cashed-style') || '';
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

      this.holder
        .css({
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

    hideBlock() {
      this.holder.trigger(this.beforeCloseEvent);
      this.isClosing = true;

      this.holder.add(this.overlay).fadeOut(200, () => {
        this.clean();
        this.disableOverlayHandler = false;
        this.disableCloseBtnHandler = false;
        this.closeBtn.show();
        this.isClosing = false;
        this.holder.trigger(this.afterCloseEvent);
      });

      $(window).off('resize', this._jboxPosAbsolute);
    }

    isElement(o) {
      return (
        typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
          o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName === "string"
      );
    }

    refreshSlider() {
      let $slider = this.inner.find('.js__slick');

      if (!$slider.length) return;

      $slider.each((i, el) => {
        el.slick.refresh(true);
      });
    }

    getScrollBarWidth() {
      let div = document.createElement('div');
      let scrollBarWidth = 0;

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

    parseUrl() {
      let str = window.location.hash;
      let pattern = 'jbox_id=';
      let index = str.indexOf(pattern);

      if (!~index) return null;

      let selectorStart = index + pattern.length;
      let selectorEnd = ~str.indexOf('%', selectorStart) ? str.indexOf('&', selectorStart) : undefined;
      let selector = str.slice(selectorStart, selectorEnd);

      if (!document.body.querySelector(selector)) {
        if (!document.body.querySelector('#' + selector)) return null;

        selector = '#' + selector;
      }

      return selector;
    }

    enableZoom() {
      if (this.zoomEnabled) return;


      this.$viewPort.attr('content', this.viewPortContentZoom);
      this.zoomEnabled = true;
    }

    disableZoom() {
      if (!this.zoomEnabled) return;

      this.$viewPort.attr('content', this.viewPortContent);
      this.$viewPort.attr('content', this.viewPortContent);
      this.zoomEnabled = false;
    }

    /*unused func*/
    jboxCheckNofixed() {
      let jboxHolder = this.holder;

      jboxHolder.removeClass('nofixed');
      if (jboxHolder.height() > jQuery(window).height()) {
        jboxHolder.addClass('nofixed')
          .css({
            'top': '0',
            'margin-top': '100px',
          });
      }
    }

    getBlockSize(block) {
      //let block =
      let result = {};

      $img
        .attr('src', src)
        .css({
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
  }

  $(document).ready(() => {
    $.jBox = new JBoxController({});
  });
});
