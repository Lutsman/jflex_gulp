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

  class JTooltip {
    constructor(options) {
      this.block = options.block;
      this.content = options.content || '';
      this.tooltipPosition = options.position || 'bottom';
      this.extraMargin = options.extraMargin || 5;
      this.showAnimation = options.showAnimation || 'fade';
      this.hideAnimation = options.hideAnimation || 'fade';
      this.showAnimationSpeed = options.showAnimationSpeed || 200;
      this.hideAnimationSpeed = options.hideAnimationSpeed || 200;
      this.customContainerClass = options.customContainerClass || '';
      this.tpl = {
        tooltipContainer: '<div class="jTooltip"></div>',
        tooltipInner: '<div class="jTooltip-inner"></div>',
        tooltipArrow: '<div class="jTooltip-arrow"></div>'
      };
      this.events = {
        beforeOpen: 'jTooltip:beforeOpen',
        afterOpen: 'jTooltip:afterOpen',
        beforeClose: 'jTooltip:beforeClose',
        afterClose: 'jTooltip:afterClose'
      };

      this.init();
    }

    init() {
      if (!this.block) return;

      const debounceDuration = this.showAnimationSpeed + this.hideAnimationSpeed + 20;
      this.$block = $(this.block);

      this._addTooltipHandler = this.debounce(this.addTooltipHandler, debounceDuration).bind(this);
      this._removeTooltipHandler = this.removeTooltipHandler.bind(this);

      this.content =
          this.content ||
          this.block.getAttribute('data-jTooltip-content') ||
          this.block.getAttribute('title') ||
          this.block.getAttribute('name');


      this.$block.on({
        'mouseenter': this._addTooltipHandler,
        'mouseleave': this._removeTooltipHandler
      });

      this.running = true;
    };

    addTooltipHandler(e) {
      e.preventDefault();

      let title = this.$block.attr('title');

      if (title) {
        this.$block
            .removeAttr('title')
            .attr('data-cached-title', title);
      }

      this.addTooltip();
    }

    removeTooltipHandler(e) {
      e.preventDefault();

      let cachedTitle = this.$block.attr('data-cached-title');

      if (cachedTitle) {
        this.$block
            .removeAttr('data-cached-title')
            .attr('title', cachedTitle);
      }

      this.removeTooltip();
    }

    addTooltip() {
      this.renderTooltip();
      this.setTooltipPos(this.tooltipPosition);
      this.showTooltip();
    }

    renderTooltip(hidden) {
      let $tooltip = this.$tooltip = $(this.tpl.tooltipContainer);
      let $inner = this.$inner = $(this.tpl.tooltipInner);
      let $arrow = this.$arrow = $(this.tpl.tooltipArrow);
      let content = this.content;
      let customStyleClass = this.getPartialClass(this.block, 'js__jTooltip-s_') || '';

      $inner.append(content);
      $tooltip
          .append($inner)
          .append($arrow)
          .addClass(customStyleClass)
          .addClass(this.customContainerClass)
          .appendTo('body');

      if (hidden) {
        $tooltip.hide();
      }
    };

    setTooltipPos(pos, force) {
      let baseTooltipPos = this.tooltipPosition;
      let isAvaliablePos = this.getAvailiablePos(pos);
      let currForce = false;
      let blockCoords = this.getCoords(this.block);
      let $tooltip = this.$tooltip;
      let $arrow = this.$arrow;
      let offset = this.extraMargin;
      let top = null;
      let left = null;
      let arrowClass = '';
      let arrowCss = {};

      $tooltip.show();

      let tooltipWidth = $tooltip.outerWidth();
      let tooltipHeight = $tooltip.outerHeight();

      if (!isAvaliablePos && !force) {
        let nextPos = '';

        switch (pos) {
          case 'top':
            if (baseTooltipPos === pos) {
              nextPos = 'bottom';
            } else if (baseTooltipPos === 'bottom') {
              nextPos = 'right';
            } else if (baseTooltipPos === 'left' || baseTooltipPos === 'right') {
              nextPos = baseTooltipPos;
              currForce = true;
            }
            break;
          case 'right':
            if (baseTooltipPos === 'left') {
              nextPos = 'bottom';
            } else {
              nextPos = 'left';
            }
            break;
          case 'bottom':
            if (baseTooltipPos === 'top') {
              nextPos = 'right';
            } else {
              nextPos = 'top';
            }
            break;
          case 'left':
            if (baseTooltipPos === pos) {
              nextPos = 'right';
            } else if (baseTooltipPos === 'right') {
              nextPos = 'bottom';
            } else if (baseTooltipPos === 'top' || baseTooltipPos === 'bottom') {
              nextPos = baseTooltipPos;
              currForce = true;
            }
            break;
        }

        this.setTooltipPos(nextPos, currForce);
        return;
      }

      switch (pos) {
        case 'top':
          top = blockCoords.top - (tooltipHeight + offset);
          left = this.getCenterTooltip(pos);
          arrowCss = this.getArrowCenter(pos, left);
          arrowClass = 'jTooltip-t';
          break;
        case 'right':
          top = this.getCenterTooltip(pos);
          left = blockCoords.right + offset;
          arrowCss = this.getArrowCenter(pos, top);
          arrowClass = 'jTooltip-r';
          break;
        case 'bottom':
          top = blockCoords.bottom + offset;
          left = this.getCenterTooltip(pos);
          arrowCss = this.getArrowCenter(pos, left);
          arrowClass = 'jTooltip-b';
          break;
        case 'left':
          top = this.getCenterTooltip(pos);
          left = blockCoords.left - (tooltipWidth + offset);
          arrowCss = this.getArrowCenter(pos, top);
          arrowClass = 'jTooltip-l';
          break;
      }

      $tooltip
          .addClass(arrowClass)
          .css({
            left: left + 'px',
            top: top + 'px',
          });

      $arrow.css(arrowCss.propName, arrowCss.propVal);

      $tooltip.hide();
    };

    getAvailiablePos(pos) {
      let blockCoodrs = this.getCoords(this.block);
      let viewportCoords = this.getViewportCoords();
      let offset = this.extraMargin;
      let $tooltip = this.$tooltip;
      let tooltipWidth = $tooltip.outerWidth() + offset;
      let tooltipHeight = $tooltip.outerHeight() + offset;
      let result = false;

      switch (pos) {
        case 'top':
          result = blockCoodrs.top - viewportCoords.top >= tooltipHeight;
          break;
        case 'right':
          result = viewportCoords.right - blockCoodrs.right >= tooltipWidth;
          break;
        case 'bottom':
          result = viewportCoords.bottom - blockCoodrs.bottom >= tooltipHeight;
          break;
        case 'left':
          result = blockCoodrs.left - viewportCoords.left >= tooltipWidth;
          break;
      }

      return result;
    }

    getCenterTooltip(pos) {
      let blockCoodrs = this.getCoords(this.block);
      let viewportCoords = this.getViewportCoords();
      let $tooltip = this.$tooltip;
      let tooltipWidth = $tooltip.outerWidth();
      let tooltipHeight = $tooltip.outerHeight();
      let blockCenter = 0;

      if (pos === 'top' || pos === 'bottom') {
        blockCenter = blockCoodrs.left + blockCoodrs.width / 2;
        let availLeft = blockCenter - tooltipWidth / 2 >= viewportCoords.left;
        let availRight = blockCenter + tooltipWidth / 2 <= viewportCoords.right;

        if (!availLeft || viewportCoords.width <= tooltipWidth) {
          return viewportCoords.left;
        } else if (!availRight) {
          return viewportCoords.right - tooltipWidth;
        }

        return blockCenter - tooltipWidth / 2;

      } else {
        blockCenter = blockCoodrs.top + (blockCoodrs.height / 2);
        let availTop = blockCenter - tooltipHeight / 2 >= viewportCoords.top;
        let availBottom = blockCenter + tooltipHeight / 2 <= viewportCoords.bottom;

        if (!availTop || viewportCoords.height <= tooltipHeight) {
          return viewportCoords.top;
        } else if (!availBottom) {
          return viewportCoords.bottom - tooltipHeight;
        }

        return blockCenter - tooltipHeight / 2;
      }
    }

    getArrowCenter(posName, posUnit) {
      const $arrow = this.$arrow;
      const arrowCoords = this.getCoords($arrow[0]);
      const blockCoords = this.getCoords(this.block);
      let propName = '';
      let propLengthName = '';


      if (posName === 'top' || posName === 'bottom') {
        propName = 'left';
        propLengthName = 'width';
      } else {
        propName = 'top';
        propLengthName = 'height';
      }

      const offset = posUnit - arrowCoords[propName];
      const blockCenter = blockCoords[propName] + blockCoords[propLengthName] / 2;
      const arrowCenter = arrowCoords[propName] + arrowCoords[propLengthName] / 2 + offset;

      if (blockCenter === arrowCenter) return;

      return {
        propName,
        propVal: (blockCenter - arrowCenter) + 'px',
      };
    }

    removeTooltip() {
      this.hideTooltip(true);
    }

    showTooltip() {
      if (!this.$tooltip.length) return;

      this.$block.trigger(this.events.beforeOpen, [this.$tooltip, this]);

      switch (this.showAnimation) {
        case 'simple':
          this.$tooltip.show();
          this.$block.trigger(this.events.afterOpen, [this.$tooltip, this]);
          break;
        case 'slide':
          this.$tooltip.slideDown(this.events.showAnimationSpeed, () => {
            this.$block.trigger(this.events.afterOpen, [this.$tooltip, this]);
          });
          break;
        case 'fade':
          this.$tooltip.fadeIn(this.events.showAnimationSpeed, () => {
            this.$block.trigger(this.events.afterOpen, [this.$tooltip, this]);
          });
          break;
      }
    }

    hideTooltip(destroyTooltip) {
      let destroy = function () {
      };

      if (!this.$tooltip || !this.$tooltip.length) return;

      if (destroyTooltip) {
        destroy = this.destoyTooltip.bind(this);
      }

      this.$block.trigger(this.events.beforeClose, [this.$tooltip, this]);

      switch (this.showAnimation) {
        case 'simple':
          this.$tooltip.hide();
          destroy();
          this.$block.trigger(this.events.afterClose, [this.$tooltip, this]);
          break;
        case 'slide':
          this.$tooltip.slideUp(this.hideAnimationSpeed, () => {
            destroy();
            this.$block.trigger(this.events.afterClose, [this.$tooltip, this]);
          });
          break;
        case 'fade':
          this.$tooltip.fadeOut(this.hideAnimationSpeed, () => {
            destroy();
            this.$block.trigger(this.events.afterClose, [this.$tooltip, this]);
          });
          break;
      }
    }

    destoyTooltip() {
      this.$tooltip.remove();
      this.$tooltip = null;
      this.$inner = null;
      this.$arrow = null;
    }

    getCoords(elem) {
      let box = elem.getBoundingClientRect();
      let html = document.documentElement;

      return {
        top: box.top + window.pageYOffset || html.scrollTop,
        right: box.right + window.pageXOffset || html.scrollLeft,
        bottom: box.bottom + window.pageYOffset || html.scrollTop,
        left: box.left + window.pageXOffset || html.scrollLeft,
        width: elem.offsetWidth,
        height: elem.offsetHeight
      };
    }

    getViewportCoords() {
      let html = document.documentElement;
      let top = window.pageYOffset || html.scrollTop;
      let left = window.pageXOffset || html.scrollLeft;
      let right = left + html.clientWidth;
      let bottom = top + html.clientHeight;

      return {
        top: top,
        right: right,
        bottom: bottom,
        left: left,
        width: html.clientWidth,
        height: html.clientHeight
      };
    }

    getPartialClass(el, classStart) {
      let classStr = el.className;
      let startPos = classStr.indexOf(classStart);

      if (!~startPos) return null;

      let endPos = ~classStr.indexOf(' ', startPos) ? classStr.indexOf(' ', startPos) : undefined;

      return classStr.slice(startPos, endPos);
    }

    debounce(func, ms) {
      let state = false;

      function wrapper() {
        if (state) return;

        func.apply(this, arguments);
        state = true;

        setTimeout(function () {
          state = false;
        }, ms);
      }

      return wrapper;
    }

    getSelf() {
      return this;
    }

    stop() {
      if (!this.running) return;

      this.$block.off({
        'mouseenter': this._addTooltipHandler,
        'mouseleave': this._removeTooltipHandler
      });

      this.running = false;
    }

    start() {
      if (this.running) return;

      this.$block.on({
        'mouseenter': this._addTooltipHandler,
        'mouseleave': this._removeTooltipHandler
      });

      this.running = true;
    }

    preventDef(e) {
      e.preventDefault();
    }
  }


  $.fn.jTooltip = function () {
    let _ = this;
    let options = arguments[0] || {};
    let args = Array.prototype.slice.call(arguments, 1);

    for (let i = 0; i < _.length; i++) {
      if (typeof options === 'object') {
        options.block = _[i];
        _[i].jTooltip = new JTooltip(options);
      } else {
        let result = _[i].jTooltip[options].call(_[i].jTooltip, args);

        if (typeof result !== 'undefined') return result;
      }
    }

    return _;
  };
}));


/*init*/
/*
jQuery(document).ready(function ($) {
  /!*tooltip*!/
  (function() {
    let $tooltips = $('[class*="js__jTooltip"]');

    $tooltips.each(function () {
      let $tooltip = $(this);
      let className = {
        positionTop: 'js__jTooltip-t',
        positionRight: 'js__jTooltip-r',
        positionBottom: 'js__jTooltip-b',
        positionLeft: 'js__jTooltip-l'
      };
      let options = {};


      if ($tooltip.hasClass('js__jTooltip') || $tooltip.hasClass('js__jTooltip-horizontal')) { //temporary patch for changing hml layout
        return;
      }

      if ($tooltip.hasClass(className.positionTop)) {
        options.position = 'top';
      } else if ($tooltip.hasClass(className.positionRight)) {
        options.position = 'right';
      } else if ($tooltip.hasClass(className.positionBottom)) {
        options.position = 'bottom';
      } else if ($tooltip.hasClass(className.positionLeft)) {
        options.position = 'left';
      }

      $tooltip.jTooltip(options);
    });
  })();

  /!*vertical*!/
  (function () {
    let $tooltip = $('.js__jTooltip');
    let options = {};

    $tooltip.jTooltip(options);
  })();

  /!*horizontal*!/
  (function () {
    let $tooltip = $('.js__jTooltip-horizontal');
    let options = {
      position: 'right'
    };

    $tooltip.jTooltip(options);
  })();
});*/
