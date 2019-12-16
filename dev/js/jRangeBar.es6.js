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
  let counter = 0;

  class JRangeBarController {
    constructor(options) {
      this.parentEl = options.parent;
      this.minInput = options.minInput;
      this.maxInput = options.maxInput;
      this.displayMin = options.displayMin; //elements to display minimum current value
      this.displayMax = options.displayMax; //elements to display maximum current value
      this.min = options.min || 0;
      this.max = options.max;
      this.minCurrent = options.minCurrent || options.min || 0;
      this.maxCurrent = options.maxCurrent || options.max;
      this.dualMode = options.dualMode || false;
      this.userRanges = options.ranges;
      this.addMethod = options.addMethod || null;
      this.ranges = [];
      this.events = {
        change: 'jRangeBar:change',
        updateUnit: 'jRangeBar:update-unit',
        updateUnitSilent: 'jRangeBar:update-unit:silent',
        updatePixel: 'jRangeBar:update-pixel',
        updatePixelSilent: 'jRangeBar:update-pixel:silent',
        refresh: 'jRangeBar:refresh',
        startEventArr: ['mousedown', 'touchstart', 'pointerdown'],
        moveEventArr: ['mousemove', 'touchmove', 'pointermove'],
        endEventArr: ['mouseup', 'touchend', 'pointerup']
      };
      this.tpl = `<div class="jrangebar-wrapper">
                    <div class="jrangebar-inner">
                      <span class="min"></span>
                      <span class="max"></span>
                    </div>
                  </div>`;

      this.init();
    }

    init() {
      this.events.startEvent = this.events.startEventArr.join('.jRangeBar-' + counter + ' ') + '.jRangeBar-' + counter;
      this.events.moveEvent = this.events.moveEventArr.join('.jRangeBar-' + counter + ' ') + '.jRangeBar-' + counter;
      this.events.endEvent = this.events.endEventArr.join('.jRangeBar-' + counter + ' ') + '.jRangeBar-' + counter;

      this.bindElements();
      this.updateDisplayElements();
      this.renderRangeBar();
      this.setupDimentions();
      this.parseRanges();
      this.bindHandlers();
      this.attachHandlers();
      this.updateSlider();

      //just in case to recalculate slider after styles load
      setTimeout(this.reinitSlider.bind(this), 3000);
    }

    bindElements() {
      this.$parent = $(this.parentEl);
      this.$minInput = $(this.minInput);
      this.$maxInput = $(this.maxInput);
      this.$displayMin = $(this.displayMin);
      this.$displayMax = $(this.displayMax);
      this.$body = $('body');
      this.$window = $(window);
    }

    updateDisplayElements(notInputs) {
      if (!notInputs) {
        this.$minInput.val(this.minCurrent);
        this.$maxInput.val(this.maxCurrent);
      }

      this.$displayMin.text(this.minCurrent);
      this.$displayMax.text(this.maxCurrent);
    }

    bindHandlers() {
      this._onMouseDown = this.onMouseDown.bind(this);
      this._onMouseUp = this.onMouseUp.bind(this);
      this._onMouseMove = this.onMouseMove.bind(this);

      this._onInput = this.onInput.bind(this);
      this._onChange = this.onChange.bind(this);

      this._onPixelUpdate = this.onPixelUpdate.bind(this);
      this._onPixelUpdateSilent = this.onPixelUpdate.bind(this, true);
      this._onUnitUpdate = this.onUnitUpdate.bind(this);
      this._onUnitUpdateSilent = this.onUnitUpdate.bind(this, true);
      this._onRefresh = this.onRefresh.bind(this);
    }

    attachHandlers() {
      let minCounterId = '#' + this.$minCounter.attr('id');
      let maxCounterId = '#' + this.$maxCounter.attr('id');

      $('body').on(this.events.startEvent, minCounterId + ', ' + maxCounterId, this._onMouseDown);

      this.$minInput
          .add(this.$maxInput)
          .on({
            'input': this._onInput,
            'change': this._onChange
          });

      this.$wrapper.on({
        [this.events.updateUnit]: this._onUnitUpdate,
        [this.events.updateUnitSilent]: this._onUnitUpdateSilent,
        [this.events.updatePixel]: this._onPixelUpdate,
        [this.events.updatePixelSilent]: this._onPixelUpdateSilent,
        [this.events.refresh]: this._onRefresh
      });

      this.$window.on('resize', this._onRefresh);
    }

    detachHandlers() {
      this.$minCounter
          .add(this.$maxCounter)
          .off({
            [this.events.startEvent]: this._onMouseDown
          });

      this.$minInput
          .add(this.$maxInput)
          .off({
            'input': this._onInput,
            'change': this._onChange
          });

      this.$wrapper.off({
        [this.events.updateUnit]: this._onUnitUpdate,
        [this.events.updateUnitSilent]: this._onUnitUpdateSilent,
        [this.events.updatePixel]: this._onPixelUpdate,
        [this.events.updatePixelSilent]: this._onPixelUpdateSilent,
        [this.events.refresh]: this._onRefresh
      });

      this.$window.off('resize', this._onRefresh);
    }

    renderRangeBar() {
      const $wrapper = this.$wrapper = $(this.tpl);
      this.$inner = $wrapper.find('.jrangebar-inner');
      this.$minCounter = $wrapper.find('.min');
      this.$maxCounter = $wrapper.find('.max');

      this.$minCounter.attr('id', 'jrangebar-min-' + counter);
      this.$maxCounter.attr('id', 'jrangebar-max-' + counter);
      counter++;

      if (!this.dualMode) {
        this.$minCounter.hide();
      }

      if (this.addMethod) {
        this.addMethod(this.$parent, $wrapper);
      } else {
        this.$parent.append($wrapper);
      }
    }

    onMouseDown(e) {
      const target = e.currentTarget;
      const innerCoords = this.$inner[0].getBoundingClientRect();
      const clientX = this.getPosition(e);

      e.preventDefault();

      const $target = this.$target = $(target);

      if ($target.is(this.$minCounter)) {
        this.shiftX = clientX - innerCoords.left;
      } else if ($target.is(this.$maxCounter)) {
        this.shiftX = innerCoords.right - clientX;
      } else {
        return;
      }

      this.$body.on({
        [this.events.moveEvent]: this._onMouseMove,
        [this.events.endEvent]: this._onMouseUp,
      });
    }

    onMouseMove(e) {
      this.moveAt(e);
      this.pixelToUnit();
    }

    moveAt(e) {
      let wrapperCoords = this.$wrapper[0].getBoundingClientRect();
      let wrapperWidth = this.wrapperWidth;
      let minCounterWidth = this.minCounterWidth;
      let maxCounterWidth = this.maxCounterWidth;
      let $target = this.$target;
      let clientX = this.getPosition(e);
      let shiftX = this.shiftX;

      if ($target.is(this.$minCounter)) {

        let left = clientX - wrapperCoords.left - shiftX;
        let maxLeft = wrapperWidth - minCounterWidth - maxCounterWidth - parseFloat(this.$inner.css('right'));

        if (left < 0) {
          left = 0;
        } else if (left > maxLeft) {
          left = maxLeft;
        }

        this.$inner.css('left', left + 'px');
      } else if ($target.is(this.$maxCounter)) {
        let right = wrapperCoords.right - clientX - shiftX;
        let maxRight = wrapperWidth - minCounterWidth - maxCounterWidth - parseFloat(this.$inner.css('left'));

        if (right < 0) {
          right = 0;
        } else if (right > maxRight) {
          right = maxRight;
        }

        this.$inner.css('right', right + 'px');
      }
    }

    onMouseUp() {
      this.$body.off({
        [this.events.moveEvent]: this._onMouseMove,
        [this.events.endEvent]: this._onMouseUp,
      });
      this.$target = null;
    }

    onInput(e) {
      const $target = $(e.target);
      let val = parseFloat($target.val());
      let maxVal;
      let minVal;

      if (!this.isNumeric(val)) return;

      if ($target.is(this.$minInput)) {
        maxVal = this.maxCurrent;
        minVal = this.min;
      } else if ($target.is(this.$maxInput)) {
        maxVal = this.max;
        minVal = this.minCurrent;
      }

      if (val > maxVal) {
        val = maxVal;
      } else if (val < minVal) {
        val = minVal;
      }

      if ($target.is(this.$minInput)) {
        this.minCurrent = val;
      } else if ($target.is(this.$maxInput)) {
        this.maxCurrent = val;
      }

      this.unitToPixel();
    }

    onChange(e) {
      this.refreshInput(e);
    }

    onRefresh() {
      this.reinitSlider();
    }

    refreshInput(e) {
      let $target = $(e.target);

      if ($target.is(this.$minInput)) {
        $target.val(this.minCurrent);
      } else if ($target.is(this.$maxInput)) {
        $target.val(this.maxCurrent);
      }
    }

    onPixelUpdate(silent) {
      this.pixelToUnit(silent);
    }

    onUnitUpdate(silent) {
      const minVal = parseInt(this.$minInput.val());
      const maxVal = parseInt(this.$maxInput.val());

      this.minCurrent = this.isNumeric(minVal) ? minVal : this.minCurrent;
      this.maxCurrent = this.isNumeric(maxVal) ? maxVal : this.maxCurrent;
      this.unitToPixel(silent);
    }

    pixelToUnit(silentProcess) {
      const left = parseFloat(this.$inner.css('left'));
      const right = parseFloat(this.$inner.css('right'));
      let minVal = 0;
      let maxVal = 0;

      if (this.ranges.length) {
        minVal = Math.round(this.getCompoundRange('left', 'unit'));
        maxVal = Math.round(this.getCompoundRange('right', 'unit'));
      } else {
        minVal = Math.round(left * this.unitInPixel);
        maxVal = Math.round((this.fullPixelRange - right) * this.unitInPixel);
      }

      this.minCurrent = minVal + this.min;
      this.maxCurrent = maxVal + this.min;
      this.updateDisplayElements();

      if (silentProcess) return;

      this.$wrapper.trigger(this.events.change);
    }

    unitToPixel(silentProcess) {
      let left;
      let right;

      if (this.ranges.length) {
        left = this.getCompoundRange('left', 'pixel');
        right = this.getCompoundRange('right', 'pixel');
      } else {
        left = (this.minCurrent - this.min) / this.unitInPixel;
        right = this.fullPixelRange - (this.maxCurrent - this.min) / this.unitInPixel;
      }

      this.$inner.css('left', left + 'px');
      this.$inner.css('right', right + 'px');
      this.updateDisplayElements(true);

      if (silentProcess) return;

      this.$wrapper.trigger(this.events.change);
    }

    parseRanges() {
      let prevUnitSum = this.minCurrent;
      let prevPixelSum = 0;

      if (!this.userRanges || !$.isArray(this.userRanges)) return;

      this.ranges = [];

      for (let i = 0; i < this.userRanges.length; i++) {
        let currPixelRange = this.userRanges[i].pixelRange;
        let currUnitRange = this.userRanges[i].unitRange;
        let currRange = {};

        if (typeof currPixelRange === 'string' && ~currPixelRange.lastIndexOf('%')) {
          currPixelRange = this.fullPixelRange * parseFloat(currPixelRange) / 100;
        } else {
          currPixelRange = parseInt(currPixelRange);
        }

        if (typeof currUnitRange === 'string' && ~currUnitRange.lastIndexOf('%')) {
          currUnitRange = this.fullUnitRange * parseFloat(currUnitRange) / 100;
        } else {
          currUnitRange = parseInt(currUnitRange) - this.min;
        }

        currRange.pixelRange = currPixelRange;
        currRange.unitRange = currUnitRange;
        this.ranges.push(currRange);

        prevPixelSum = currPixelRange;
        prevUnitSum = currUnitRange;
      }

      if (this.fullUnitRange !== prevUnitSum) {
        this.ranges.push({
          unitRange: this.fullUnitRange,
          pixelRange: this.fullPixelRange
        });
      }
    }

    getCompoundRange(direction, outputUnit) {
      let prevPixelRange = 0;
      let prevUnitRange = 0;
      let sourceUnit = 0;
      let result = 0;

      if (direction === 'left') {
        if (outputUnit === 'pixel') {
          sourceUnit = this.minCurrent - this.min;
        } else if (outputUnit === 'unit') {
          sourceUnit = parseFloat(this.$inner.css('left'));
        }
      } else if (direction === 'right') {
        if (outputUnit === 'pixel') {
          sourceUnit = this.maxCurrent - this.min;
        } else if (outputUnit === 'unit') {
          sourceUnit = this.fullPixelRange - parseFloat(this.$inner.css('right'));
        }
      }

      for (let i = 0; i < this.ranges.length; i++) {
        const currPixelRange = this.ranges[i].pixelRange - prevPixelRange;
        const currUnitRange = this.ranges[i].unitRange - prevUnitRange;
        const currUnitInPixel = currUnitRange / currPixelRange;

        if (outputUnit === 'pixel') {
          if (sourceUnit > currUnitRange) {
            sourceUnit -= currUnitRange;
            result += currUnitRange / currUnitInPixel;
          } else {
            result += sourceUnit / currUnitInPixel;

            if (direction === 'left') {
              return result;
            } else if (direction === 'right') {
              return this.fullPixelRange - result;
            }
          }
        } else if (outputUnit === 'unit') {
          if (sourceUnit > currPixelRange) {
            sourceUnit -= currPixelRange;
            result += currPixelRange * currUnitInPixel;
          } else {
            result += sourceUnit * currUnitInPixel;
            return result;
          }
        }

        prevPixelRange = this.ranges[i].pixelRange;
        prevUnitRange = this.ranges[i].unitRange;
      }
    }

    getDimentions() {
      const fullUnitRange = this.max - this.min;
      const wrapperWidth = this.$wrapper.width();
      const minCounterWidth = this.dualMode ? this.$minCounter.outerWidth() : 0;
      const maxCounterWidth = this.$maxCounter.outerWidth();
      const fullPixelRange = wrapperWidth - minCounterWidth - maxCounterWidth;
      const unitInPixel = fullUnitRange / fullPixelRange;

      return {
        unitRange: fullUnitRange,
        pixelRange: fullPixelRange,
        unitInPixel: unitInPixel,
        wrapperWidth: wrapperWidth,
        minCounterWidth: minCounterWidth,
        maxCounterWidth: maxCounterWidth
      };
    }

    setupDimentions() {
      let ranges = this.getDimentions();

      this.fullUnitRange = ranges.unitRange;
      this.fullPixelRange = ranges.pixelRange;
      this.unitInPixel = ranges.unitInPixel;
      this.wrapperWidth = ranges.wrapperWidth;
      this.minCounterWidth = this.dualMode ? ranges.minCounterWidth : 0;
      this.maxCounterWidth = ranges.maxCounterWidth;
    }

    getPosition(e) {
      // Get the offset DIRECTION relative to the viewport
      let coordinate = 'x';
      let ucCoordinate = 'X';
      //let rangePos = this.$inner[0].getBoundingClientRect()['left'];
      let pageCoordinate = 0;


      if (typeof e.originalEvent['client' + ucCoordinate] !== 'undefined') {
        pageCoordinate = e.originalEvent['client' + ucCoordinate];
      }
      else if (
          e.originalEvent.touches &&
          e.originalEvent.touches[0] &&
          typeof e.originalEvent.touches[0]['client' + ucCoordinate] !== 'undefined'
      ) {
        pageCoordinate = e.originalEvent.touches[0]['client' + ucCoordinate];
      }
      else if(e.currentPoint && typeof e.currentPoint[coordinate] !== 'undefined') {
        pageCoordinate = e.currentPoint[coordinate];
      }

      return pageCoordinate; // - rangePos;
    }

    updateSlider(silent) {
      this.unitToPixel(silent);
    }

    reinitSlider() {
      this.setupDimentions();
      this.parseRanges();
      this.updateSlider();
    }

    isNumeric(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    }

    getSelf() {
      return this;
    }
  }

  $.fn.jRangeBar = function () {
    let _ = this;
    let options = arguments[0] || {};
    let args = Array.prototype.slice.call(arguments, 1);

    for (let i = 0; i < _.length; i++) {
      if (typeof options === 'object') {
        options.parent = _[i];
        _[i].jRangeBar = new JRangeBarController(options);
      } else {
        let result = _[i].jRangeBar[options].call(_[i].jRangeBar, args);

        if (typeof result !== 'undefined') return result;
      }
    }

    return _;
  };
}));
