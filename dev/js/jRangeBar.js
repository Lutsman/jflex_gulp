/*sliding counter*/
//TODO  touch events


'use strict';

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
  var JRangeBarController = function () {
    function JRangeBarController(options) {
      _classCallCheck(this, JRangeBarController);

      this.parentEl = options.parent;
      this.minInput = options.min;
      this.maxInput = options.max;
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
      this.tpl = '<div class="jrangebar-wrapper">\n                    <div class="jrangebar-inner">\n                      <span class="min"></span>\n                      <span class="max"></span>\n                    </div>\n                  </div>';

      this.init();
    }

    _createClass(JRangeBarController, [{
      key: 'init',
      value: function init() {
        this.$parent = $(this.parentEl);
        this.$minInput = $(this.minInput);
        this.$maxInput = $(this.maxInput);

        this.minInputValCached = this.baseMin = +this.$minInput.val();
        this.maxInputValCached = this.baseMax = +this.$maxInput.val();

        this.events.startEvent = this.events.startEventArr.join('.jRangeBar-' + counter + ' ') + '.jRangeBar-' + counter;
        this.events.moveEvent = this.events.moveEventArr.join('.jRangeBar-' + counter + ' ') + '.jRangeBar-' + counter;
        this.events.endEvent = this.events.endEventArr.join('.jRangeBar-' + counter + ' ') + '.jRangeBar-' + counter;

        this.renderRangeBar();
        this.setupDimentions();
        this.parseRanges();
        this.bindHandlers();
        this.attachHandlers();
      }
    }, {
      key: 'bindHandlers',
      value: function bindHandlers() {
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
    }, {
      key: 'attachHandlers',
      value: function attachHandlers() {
        var _$wrapper$on;

        var minCounterId = '#' + this.$minCounter.attr('id');
        var maxCounterId = '#' + this.$maxCounter.attr('id');

        $('body').on(this.events.startEvent, minCounterId + ', ' + maxCounterId, this._onMouseDown);

        this.$minInput.add(this.$maxInput).on({
          'input': this._onInput,
          'change': this._onChange
        });

        this.$wrapper.on((_$wrapper$on = {}, _defineProperty(_$wrapper$on, this.events.updateUnit, this._onUnitUpdate), _defineProperty(_$wrapper$on, this.events.updateUnitSilent, this._onUnitUpdateSilent), _defineProperty(_$wrapper$on, this.events.updatePixel, this._onPixelUpdate), _defineProperty(_$wrapper$on, this.events.updatePixelSilent, this._onPixelUpdateSilent), _defineProperty(_$wrapper$on, this.events.refresh, this._onRefresh), _$wrapper$on));

        $(window).on('resize', this._onRefresh);
      }
    }, {
      key: 'detachHandlers',
      value: function detachHandlers() {
        var _$wrapper$off;

        this.$minCounter.add(this.$maxCounter).off(_defineProperty({}, this.events.startEvent, this._onMouseDown));

        this.$minInput.add(this.$maxInput).off({
          'input': this._onInput,
          'change': this._onChange
        });

        this.$wrapper.off((_$wrapper$off = {}, _defineProperty(_$wrapper$off, this.events.updateUnit, this._onUnitUpdate), _defineProperty(_$wrapper$off, this.events.updateUnitSilent, this._onUnitUpdateSilent), _defineProperty(_$wrapper$off, this.events.updatePixel, this._onPixelUpdate), _defineProperty(_$wrapper$off, this.events.updatePixelSilent, this._onPixelUpdateSilent), _defineProperty(_$wrapper$off, this.events.refresh, this._onRefresh), _$wrapper$off));

        $(window).off('resize', this._onRefresh);
      }
    }, {
      key: 'renderRangeBar',
      value: function renderRangeBar() {
        var $wrapper = this.$wrapper = $(this.tpl);
        this.$inner = $wrapper.find('.jrangebar-inner');
        this.$minCounter = $wrapper.find('.min');
        this.$maxCounter = $wrapper.find('.max');

        this.$minCounter.attr('id', 'jrangebar-min-' + counter);
        this.$maxCounter.attr('id', 'jrangebar-max-' + counter);
        counter++;

        if (this.addMethod) {
          this.addMethod(this.$parent, $wrapper);
        } else {
          this.$parent.append($wrapper);
        }
      }
    }, {
      key: 'onMouseDown',
      value: function onMouseDown(e) {
        var target = e.currentTarget;
        var innerCoords = this.$inner[0].getBoundingClientRect();
        var clientX = this.getPosition(e);

        e.preventDefault();

        var $target = this.$target = $(target);

        if ($target.is(this.$minCounter)) {
          this.shiftX = clientX - innerCoords.left;
        } else if ($target.is(this.$maxCounter)) {
          this.shiftX = innerCoords.right - clientX;
        } else {
          return;
          //this.shiftX = 0;
        }

        //console.dir(e);
        //console.log(this.shiftX);

        $('body').on(this.events.moveEvent, this._onMouseMove);
        $('body').on(this.events.endEvent, this._onMouseUp);
      }
    }, {
      key: 'onMouseMove',
      value: function onMouseMove(e) {
        this.moveAt(e);
        this.pixelToUnit();
      }
    }, {
      key: 'moveAt',
      value: function moveAt(e) {
        var wrapperCoords = this.$wrapper[0].getBoundingClientRect();
        var wrapperWidth = this.wrapperWidth;
        var minCounterWidth = this.minCounterWidth;
        var maxCounterWidth = this.maxCounterWidth;
        var $target = this.$target;
        var clientX = this.getPosition(e);
        var shiftX = this.shiftX;

        if ($target.is(this.$minCounter)) {

          var left = clientX - wrapperCoords.left - shiftX;
          var maxLeft = wrapperWidth - minCounterWidth - maxCounterWidth - parseFloat(this.$inner.css('right')) - 1;

          if (left < 0) {
            left = 0;
          } else if (left > maxLeft) {
            left = maxLeft;
          }

          this.$inner.css('left', left + 'px');
        } else if ($target.is(this.$maxCounter)) {
          var right = wrapperCoords.right - clientX - shiftX;
          var maxRight = wrapperWidth - minCounterWidth - maxCounterWidth - parseFloat(this.$inner.css('left')) - 1;

          if (right < 0) {
            right = 0;
          } else if (right > maxRight) {
            right = maxRight;
          }

          this.$inner.css('right', right + 'px');
        }
      }
    }, {
      key: 'onMouseUp',
      value: function onMouseUp() {
        var _$$off;

        $('body').off((_$$off = {}, _defineProperty(_$$off, this.events.moveEvent, this._onMouseMove), _defineProperty(_$$off, this.events.endEvent, this._onMouseUp), _$$off));
        this.$target = null;
      }
    }, {
      key: 'onInput',
      value: function onInput(e) {
        var $target = this.$target = $(e.target);
        var val = +$target.val();
        var maxVal = void 0;
        var minVal = void 0;

        if (!this.isNumeric(val)) return;

        if ($target.is(this.$minInput)) {
          maxVal = this.maxInputValCached;
          minVal = this.baseMin;
        } else if ($target.is(this.$maxInput)) {
          maxVal = this.baseMax;
          minVal = this.minInputValCached;
        }

        if (val > maxVal) {
          val = maxVal;
        } else if (val < minVal) {
          val = minVal;
        }

        if ($target.is(this.$minInput)) {
          this.minInputValCached = val;
        } else if ($target.is(this.$maxInput)) {
          this.maxInputValCached = val;
        }

        this.unitToPixel();

        this.$target = null;
      }
    }, {
      key: 'onChange',
      value: function onChange(e) {
        this.refreshInput(e);
      }
    }, {
      key: 'onRefresh',
      value: function onRefresh() {
        this.setupDimentions();
        this.parseRanges();
      }
    }, {
      key: 'refreshInput',
      value: function refreshInput(e) {
        var $target = $(e.target);

        if ($target.is(this.$minInput)) {
          $target.val(this.minInputValCached);
        } else if ($target.is(this.$maxInput)) {
          $target.val(this.maxInputValCached);
        }
      }
    }, {
      key: 'onPixelUpdate',
      value: function onPixelUpdate(silent) {
        this.pixelToUnit(silent);
      }
    }, {
      key: 'onUnitUpdate',
      value: function onUnitUpdate(silent) {
        this.minInputValCached = +this.$minInput.val();
        this.maxInputValCached = +this.$maxInput.val();

        this.unitToPixel(silent);
      }
    }, {
      key: 'pixelToUnit',
      value: function pixelToUnit(silentProcess) {
        var left = parseFloat(this.$inner.css('left'));
        var right = parseFloat(this.$inner.css('right'));
        var minVal = 0;
        var maxVal = 0;

        if (this.ranges.length) {
          minVal = Math.round(this.getCompoundRange('left', 'unit'));
          maxVal = Math.round(this.getCompoundRange('right', 'unit'));
        } else {
          minVal = Math.round(left * this.unitInPixel);
          maxVal = Math.round((this.fullPixelRange - right) * this.unitInPixel);
        }

        this.minInputValCached = minVal;
        this.maxInputValCached = maxVal;

        this.$minInput.val(minVal);
        this.$maxInput.val(maxVal);

        if (silentProcess) return;

        this.$wrapper.add(this.$minInput).add(this.$maxInput).trigger(this.events.change);
      }
    }, {
      key: 'unitToPixel',
      value: function unitToPixel(silentProcess) {
        var left = void 0;
        var right = void 0;

        if (this.ranges.length) {
          left = this.getCompoundRange('left', 'pixel');
          right = this.getCompoundRange('right', 'pixel');
        } else {
          left = this.baseMin / this.unitInPixel;
          right = this.fullPixelRange - this.baseMax / this.unitInPixel;
        }

        this.$inner.css('left', left + 'px');
        this.$inner.css('right', right + 'px');

        if (silentProcess) return;

        this.$wrapper.add(this.$minInput).add(this.$maxInput).trigger(this.events.change);
      }
    }, {
      key: 'parseRanges',
      value: function parseRanges() {
        var prevUnitSum = this.baseMin;
        var prevPixelSum = 0;

        if (!this.userRanges || !$.isArray(this.userRanges)) return;

        this.ranges = [];

        for (var i = 0; i < this.userRanges.length; i++) {
          var currPixelRange = this.userRanges[i].pixelRange;
          var currUnitRange = this.userRanges[i].unitRange;
          var currRange = {};

          /*if (!isNumeric(currPixelRange) || !isNumeric(currUnitRange)) {
           return false;
           }*/

          if (typeof currPixelRange === 'string' && ~currPixelRange.lastIndexOf('%')) {
            currPixelRange = this.fullPixelRange * parseFloat(currPixelRange) / 100; //+ prevPixelSum;
          } else {
            currPixelRange = parseInt(currPixelRange);
          }

          if (typeof currUnitRange === 'string' && ~currUnitRange.lastIndexOf('%')) {
            currUnitRange = this.fullUnitRange * parseFloat(currUnitRange) / 100 + this.baseMin;
          } else {
            currUnitRange = parseInt(currUnitRange);
          }

          currRange.pixelRange = currPixelRange;
          currRange.unitRange = currUnitRange;
          this.ranges.push(currRange);

          prevPixelSum = currPixelRange;
          prevUnitSum = currUnitRange;
        }

        if (this.fullUnitRange !== prevUnitSum) {
          this.ranges.push({
            unitRange: this.baseMax,
            pixelRange: this.fullPixelRange
          });
        }
      }
    }, {
      key: 'getCompoundRange',
      value: function getCompoundRange(direction, outputUnit) {
        var prevPixelRange = 0;
        var prevUnitRange = this.baseMin;
        var sourceUnit = 0;
        var result = 0;

        if (direction === 'left') {
          if (outputUnit === 'pixel') {
            sourceUnit = this.minInputValCached - this.baseMin;
          } else if (outputUnit === 'unit') {
            sourceUnit = parseFloat(this.$inner.css('left'));
          }
        } else if (direction === 'right') {
          if (outputUnit === 'pixel') {
            sourceUnit = this.maxInputValCached - this.baseMin;
          } else if (outputUnit === 'unit') {
            sourceUnit = this.fullPixelRange - parseFloat(this.$inner.css('right'));
          }
        }

        for (var i = 0; i < this.ranges.length; i++) {
          var currPixelRange = this.ranges[i].pixelRange;
          var currUnitRange = this.ranges[i].unitRange;
          var currUnitInPixel = 0;

          currPixelRange = currPixelRange - prevPixelRange;
          currUnitRange = currUnitRange - prevUnitRange;
          currUnitInPixel = currUnitRange / currPixelRange;

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
    }, {
      key: 'getDimentions',
      value: function getDimentions() {
        var fullUnitRange = this.baseMax - this.baseMin;
        var wrapperWidth = this.$wrapper.width();
        var minCounterWidth = this.$minCounter.outerWidth();
        var maxCounterWidth = this.$maxCounter.outerWidth();
        var fullPixelRange = wrapperWidth - minCounterWidth - maxCounterWidth - 1; // - 2;
        var unitInPixel = fullUnitRange / fullPixelRange;

        return {
          unitRange: fullUnitRange,
          pixelRange: fullPixelRange,
          unitInPixel: unitInPixel,
          wrapperWidth: wrapperWidth,
          minCounterWidth: minCounterWidth,
          maxCounterWidth: maxCounterWidth
        };
      }
    }, {
      key: 'setupDimentions',
      value: function setupDimentions() {
        var ranges = this.getDimentions();

        this.fullUnitRange = ranges.unitRange;
        this.fullPixelRange = ranges.pixelRange;
        this.unitInPixel = ranges.unitInPixel;
        this.wrapperWidth = ranges.wrapperWidth;
        this.minCounterWidth = ranges.minCounterWidth;
        this.maxCounterWidth = ranges.maxCounterWidth;
      }
    }, {
      key: 'getPosition',
      value: function getPosition(e) {
        // Get the offset DIRECTION relative to the viewport
        var coordinate = 'x';
        var ucCoordinate = 'X';
        //let rangePos = this.$inner[0].getBoundingClientRect()['left'];
        var pageCoordinate = 0;

        if (typeof e.originalEvent['client' + ucCoordinate] !== 'undefined') {
          pageCoordinate = e.originalEvent['client' + ucCoordinate];
        } else if (e.originalEvent.touches && e.originalEvent.touches[0] && typeof e.originalEvent.touches[0]['client' + ucCoordinate] !== 'undefined') {
          pageCoordinate = e.originalEvent.touches[0]['client' + ucCoordinate];
        } else if (e.currentPoint && typeof e.currentPoint[coordinate] !== 'undefined') {
          pageCoordinate = e.currentPoint[coordinate];
        }

        return pageCoordinate; // - rangePos;
      }
    }, {
      key: 'isNumeric',
      value: function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
      }
    }, {
      key: 'getSelf',
      value: function getSelf() {
        return this;
      }
    }]);

    return JRangeBarController;
  }();

  var counter = 0;

  $.fn.jRangeBar = function () {
    var _ = this;
    var options = arguments[0] || {};
    var args = Array.prototype.slice.call(arguments, 1);

    for (var i = 0; i < _.length; i++) {
      if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
        options.parent = _[i];
        _[i].jRangeBar = new JRangeBarController(options);
      } else {
        var result = _[i].jRangeBar[options].call(_[i].jRangeBar, args);

        if (typeof result !== 'undefined') return result;
      }
    }

    return _;
  };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpzL2pSYW5nZUJhci5lczYuanMiXSwibmFtZXMiOlsiZmFjdG9yeSIsImRlZmluZSIsImFtZCIsImV4cG9ydHMiLCJtb2R1bGUiLCJyZXF1aXJlIiwialF1ZXJ5IiwiJCIsIkpSYW5nZUJhckNvbnRyb2xsZXIiLCJvcHRpb25zIiwicGFyZW50RWwiLCJwYXJlbnQiLCJtaW5JbnB1dCIsIm1pbiIsIm1heElucHV0IiwibWF4IiwidXNlclJhbmdlcyIsInJhbmdlcyIsImFkZE1ldGhvZCIsImV2ZW50cyIsImNoYW5nZSIsInVwZGF0ZVVuaXQiLCJ1cGRhdGVVbml0U2lsZW50IiwidXBkYXRlUGl4ZWwiLCJ1cGRhdGVQaXhlbFNpbGVudCIsInJlZnJlc2giLCJzdGFydEV2ZW50QXJyIiwibW92ZUV2ZW50QXJyIiwiZW5kRXZlbnRBcnIiLCJ0cGwiLCJpbml0IiwiJHBhcmVudCIsIiRtaW5JbnB1dCIsIiRtYXhJbnB1dCIsIm1pbklucHV0VmFsQ2FjaGVkIiwiYmFzZU1pbiIsInZhbCIsIm1heElucHV0VmFsQ2FjaGVkIiwiYmFzZU1heCIsInN0YXJ0RXZlbnQiLCJqb2luIiwiY291bnRlciIsIm1vdmVFdmVudCIsImVuZEV2ZW50IiwicmVuZGVyUmFuZ2VCYXIiLCJzZXR1cERpbWVudGlvbnMiLCJwYXJzZVJhbmdlcyIsImJpbmRIYW5kbGVycyIsImF0dGFjaEhhbmRsZXJzIiwiX29uTW91c2VEb3duIiwib25Nb3VzZURvd24iLCJiaW5kIiwiX29uTW91c2VVcCIsIm9uTW91c2VVcCIsIl9vbk1vdXNlTW92ZSIsIm9uTW91c2VNb3ZlIiwiX29uSW5wdXQiLCJvbklucHV0IiwiX29uQ2hhbmdlIiwib25DaGFuZ2UiLCJfb25QaXhlbFVwZGF0ZSIsIm9uUGl4ZWxVcGRhdGUiLCJfb25QaXhlbFVwZGF0ZVNpbGVudCIsIl9vblVuaXRVcGRhdGUiLCJvblVuaXRVcGRhdGUiLCJfb25Vbml0VXBkYXRlU2lsZW50IiwiX29uUmVmcmVzaCIsIm9uUmVmcmVzaCIsIm1pbkNvdW50ZXJJZCIsIiRtaW5Db3VudGVyIiwiYXR0ciIsIm1heENvdW50ZXJJZCIsIiRtYXhDb3VudGVyIiwib24iLCJhZGQiLCIkd3JhcHBlciIsIndpbmRvdyIsIm9mZiIsIiRpbm5lciIsImZpbmQiLCJhcHBlbmQiLCJlIiwidGFyZ2V0IiwiY3VycmVudFRhcmdldCIsImlubmVyQ29vcmRzIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwiY2xpZW50WCIsImdldFBvc2l0aW9uIiwicHJldmVudERlZmF1bHQiLCIkdGFyZ2V0IiwiaXMiLCJzaGlmdFgiLCJsZWZ0IiwicmlnaHQiLCJtb3ZlQXQiLCJwaXhlbFRvVW5pdCIsIndyYXBwZXJDb29yZHMiLCJ3cmFwcGVyV2lkdGgiLCJtaW5Db3VudGVyV2lkdGgiLCJtYXhDb3VudGVyV2lkdGgiLCJtYXhMZWZ0IiwicGFyc2VGbG9hdCIsImNzcyIsIm1heFJpZ2h0IiwibWF4VmFsIiwibWluVmFsIiwiaXNOdW1lcmljIiwidW5pdFRvUGl4ZWwiLCJyZWZyZXNoSW5wdXQiLCJzaWxlbnQiLCJzaWxlbnRQcm9jZXNzIiwibGVuZ3RoIiwiTWF0aCIsInJvdW5kIiwiZ2V0Q29tcG91bmRSYW5nZSIsInVuaXRJblBpeGVsIiwiZnVsbFBpeGVsUmFuZ2UiLCJ0cmlnZ2VyIiwicHJldlVuaXRTdW0iLCJwcmV2UGl4ZWxTdW0iLCJpc0FycmF5IiwiaSIsImN1cnJQaXhlbFJhbmdlIiwicGl4ZWxSYW5nZSIsImN1cnJVbml0UmFuZ2UiLCJ1bml0UmFuZ2UiLCJjdXJyUmFuZ2UiLCJsYXN0SW5kZXhPZiIsInBhcnNlSW50IiwiZnVsbFVuaXRSYW5nZSIsInB1c2giLCJkaXJlY3Rpb24iLCJvdXRwdXRVbml0IiwicHJldlBpeGVsUmFuZ2UiLCJwcmV2VW5pdFJhbmdlIiwic291cmNlVW5pdCIsInJlc3VsdCIsImN1cnJVbml0SW5QaXhlbCIsIndpZHRoIiwib3V0ZXJXaWR0aCIsImdldERpbWVudGlvbnMiLCJjb29yZGluYXRlIiwidWNDb29yZGluYXRlIiwicGFnZUNvb3JkaW5hdGUiLCJvcmlnaW5hbEV2ZW50IiwidG91Y2hlcyIsImN1cnJlbnRQb2ludCIsIm4iLCJpc05hTiIsImlzRmluaXRlIiwiZm4iLCJqUmFuZ2VCYXIiLCJfIiwiYXJndW1lbnRzIiwiYXJncyIsIkFycmF5IiwicHJvdG90eXBlIiwic2xpY2UiLCJjYWxsIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBOzs7QUFHQTs7Ozs7Ozs7OztBQUVDLFdBQVVBLE9BQVYsRUFBbUI7QUFDbEIsTUFBSSxPQUFPQyxNQUFQLEtBQWtCLFVBQWxCLElBQWdDQSxPQUFPQyxHQUEzQyxFQUFnRDtBQUM5QztBQUNBRCxXQUFPLENBQUMsUUFBRCxDQUFQLEVBQW1CRCxPQUFuQjtBQUNELEdBSEQsTUFHTyxJQUFJLFFBQU9HLE9BQVAseUNBQU9BLE9BQVAsT0FBbUIsUUFBdkIsRUFBaUM7QUFDdEM7QUFDQUMsV0FBT0QsT0FBUCxHQUFpQkgsUUFBUUssUUFBUSxRQUFSLENBQVIsQ0FBakI7QUFDRCxHQUhNLE1BR0E7QUFDTDtBQUNBTCxZQUFRTSxNQUFSO0FBQ0Q7QUFDRixDQVhBLEVBV0MsVUFBVUMsQ0FBVixFQUFhO0FBQUEsTUFFUEMsbUJBRk87QUFHWCxpQ0FBWUMsT0FBWixFQUFxQjtBQUFBOztBQUNuQixXQUFLQyxRQUFMLEdBQWdCRCxRQUFRRSxNQUF4QjtBQUNBLFdBQUtDLFFBQUwsR0FBZ0JILFFBQVFJLEdBQXhCO0FBQ0EsV0FBS0MsUUFBTCxHQUFnQkwsUUFBUU0sR0FBeEI7QUFDQSxXQUFLQyxVQUFMLEdBQWtCUCxRQUFRUSxNQUExQjtBQUNBLFdBQUtDLFNBQUwsR0FBaUJULFFBQVFTLFNBQVIsSUFBcUIsSUFBdEM7QUFDQSxXQUFLRCxNQUFMLEdBQWMsRUFBZDtBQUNBLFdBQUtFLE1BQUwsR0FBYztBQUNaQyxnQkFBUSxrQkFESTtBQUVaQyxvQkFBWSx1QkFGQTtBQUdaQywwQkFBa0IsOEJBSE47QUFJWkMscUJBQWEsd0JBSkQ7QUFLWkMsMkJBQW1CLCtCQUxQO0FBTVpDLGlCQUFTLG1CQU5HO0FBT1pD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QWxDLElBQUUrSSxFQUFGLENBQUtDLFNBQUwsR0FBaUIsWUFBWTtBQUMzQixRQUFJQyxJQUFJLElBQVI7QUFDQSxRQUFJL0ksVUFBVWdKLFVBQVUsQ0FBVixLQUFnQixFQUE5QjtBQUNBLFFBQUlDLE9BQU9DLE1BQU1DLFNBQU4sQ0FBZ0JDLEtBQWhCLENBQXNCQyxJQUF0QixDQUEyQkwsU0FBM0IsRUFBc0MsQ0FBdEMsQ0FBWDs7QUFFQSxTQUFLLElBQUloQyxJQUFJLENBQWIsRUFBZ0JBLElBQUkrQixFQUFFekMsTUFBdEIsRUFBOEJVLEdBQTlCLEVBQW1DO0FBQ2pDLFVBQUksUUFBT2hILE9BQVAseUNBQU9BLE9BQVAsT0FBbUIsUUFBdkIsRUFBaUM7QUFDL0JBLGdCQUFRRSxNQUFSLEdBQWlCNkksRUFBRS9CLENBQUYsQ0FBakI7QUFDQStCLFVBQUUvQixDQUFGLEVBQUs4QixTQUFMLEdBQWlCLElBQUkvSSxtQkFBSixDQUF3QkMsT0FBeEIsQ0FBakI7QUFDRCxPQUhELE1BR087QUFDTCxZQUFJK0gsU0FBU2dCLEVBQUUvQixDQUFGLEVBQUs4QixTQUFMLENBQWU5SSxPQUFmLEVBQXdCcUosSUFBeEIsQ0FBNkJOLEVBQUUvQixDQUFGLEVBQUs4QixTQUFsQyxFQUE2Q0csSUFBN0MsQ0FBYjs7QUFFQSxZQUFJLE9BQU9sQixNQUFQLEtBQWtCLFdBQXRCLEVBQW1DLE9BQU9BLE1BQVA7QUFDcEM7QUFDRjs7QUFFRCxXQUFPZ0IsQ0FBUDtBQUNELEdBakJEO0FBa0JELENBbGdCQSxDQUFEIiwiZmlsZSI6ImpzL2pSYW5nZUJhci5lczYuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKnNsaWRpbmcgY291bnRlciovXG4vL1RPRE8gIHRvdWNoIGV2ZW50c1xuXG5cbid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uIChmYWN0b3J5KSB7XG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAvLyBBTUQgKFJlZ2lzdGVyIGFzIGFuIGFub255bW91cyBtb2R1bGUpXG4gICAgZGVmaW5lKFsnanF1ZXJ5J10sIGZhY3RvcnkpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuICAgIC8vIE5vZGUvQ29tbW9uSlNcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkocmVxdWlyZSgnanF1ZXJ5JykpO1xuICB9IGVsc2Uge1xuICAgIC8vIEJyb3dzZXIgZ2xvYmFsc1xuICAgIGZhY3RvcnkoalF1ZXJ5KTtcbiAgfVxufShmdW5jdGlvbiAoJCkge1xuXG4gIGNsYXNzIEpSYW5nZUJhckNvbnRyb2xsZXIge1xuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICAgIHRoaXMucGFyZW50RWwgPSBvcHRpb25zLnBhcmVudDtcbiAgICAgIHRoaXMubWluSW5wdXQgPSBvcHRpb25zLm1pbjtcbiAgICAgIHRoaXMubWF4SW5wdXQgPSBvcHRpb25zLm1heDtcbiAgICAgIHRoaXMudXNlclJhbmdlcyA9IG9wdGlvbnMucmFuZ2VzO1xuICAgICAgdGhpcy5hZGRNZXRob2QgPSBvcHRpb25zLmFkZE1ldGhvZCB8fCBudWxsO1xuICAgICAgdGhpcy5yYW5nZXMgPSBbXTtcbiAgICAgIHRoaXMuZXZlbnRzID0ge1xuICAgICAgICBjaGFuZ2U6ICdqUmFuZ2VCYXI6Y2hhbmdlJyxcbiAgICAgICAgdXBkYXRlVW5pdDogJ2pSYW5nZUJhcjp1cGRhdGUtdW5pdCcsXG4gICAgICAgIHVwZGF0ZVVuaXRTaWxlbnQ6ICdqUmFuZ2VCYXI6dXBkYXRlLXVuaXQ6c2lsZW50JyxcbiAgICAgICAgdXBkYXRlUGl4ZWw6ICdqUmFuZ2VCYXI6dXBkYXRlLXBpeGVsJyxcbiAgICAgICAgdXBkYXRlUGl4ZWxTaWxlbnQ6ICdqUmFuZ2VCYXI6dXBkYXRlLXBpeGVsOnNpbGVudCcsXG4gICAgICAgIHJlZnJlc2g6ICdqUmFuZ2VCYXI6cmVmcmVzaCcsXG4gICAgICAgIHN0YXJ0RXZlbnRBcnI6IFsnbW91c2Vkb3duJywgJ3RvdWNoc3RhcnQnLCAncG9pbnRlcmRvd24nXSxcbiAgICAgICAgbW92ZUV2ZW50QXJyOiBbJ21vdXNlbW92ZScsICd0b3VjaG1vdmUnLCAncG9pbnRlcm1vdmUnXSxcbiAgICAgICAgZW5kRXZlbnRBcnI6IFsnbW91c2V1cCcsICd0b3VjaGVuZCcsICdwb2ludGVydXAnXVxuICAgICAgfTtcbiAgICAgIHRoaXMudHBsID0gYDxkaXYgY2xhc3M9XCJqcmFuZ2ViYXItd3JhcHBlclwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwianJhbmdlYmFyLWlubmVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJtaW5cIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJtYXhcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9kaXY+YDtcblxuICAgICAgdGhpcy5pbml0KCk7XG4gICAgfVxuXG4gICAgaW5pdCgpIHtcbiAgICAgIHRoaXMuJHBhcmVudCA9ICQodGhpcy5wYXJlbnRFbCk7XG4gICAgICB0aGlzLiRtaW5JbnB1dCA9ICQodGhpcy5taW5JbnB1dCk7XG4gICAgICB0aGlzLiRtYXhJbnB1dCA9ICQodGhpcy5tYXhJbnB1dCk7XG5cbiAgICAgIHRoaXMubWluSW5wdXRWYWxDYWNoZWQgPSB0aGlzLmJhc2VNaW4gPSArdGhpcy4kbWluSW5wdXQudmFsKCk7XG4gICAgICB0aGlzLm1heElucHV0VmFsQ2FjaGVkID0gdGhpcy5iYXNlTWF4ID0gK3RoaXMuJG1heElucHV0LnZhbCgpO1xuXG4gICAgICB0aGlzLmV2ZW50cy5zdGFydEV2ZW50ID0gdGhpcy5ldmVudHMuc3RhcnRFdmVudEFyci5qb2luKCcualJhbmdlQmFyLScgKyBjb3VudGVyICsgJyAnKSArICcualJhbmdlQmFyLScgKyBjb3VudGVyO1xuICAgICAgdGhpcy5ldmVudHMubW92ZUV2ZW50ID0gdGhpcy5ldmVudHMubW92ZUV2ZW50QXJyLmpvaW4oJy5qUmFuZ2VCYXItJyArIGNvdW50ZXIgKyAnICcpICsgJy5qUmFuZ2VCYXItJyArIGNvdW50ZXI7XG4gICAgICB0aGlzLmV2ZW50cy5lbmRFdmVudCA9IHRoaXMuZXZlbnRzLmVuZEV2ZW50QXJyLmpvaW4oJy5qUmFuZ2VCYXItJyArIGNvdW50ZXIgKyAnICcpICsgJy5qUmFuZ2VCYXItJyArIGNvdW50ZXI7XG5cbiAgICAgIHRoaXMucmVuZGVyUmFuZ2VCYXIoKTtcbiAgICAgIHRoaXMuc2V0dXBEaW1lbnRpb25zKCk7XG4gICAgICB0aGlzLnBhcnNlUmFuZ2VzKCk7XG4gICAgICB0aGlzLmJpbmRIYW5kbGVycygpO1xuICAgICAgdGhpcy5hdHRhY2hIYW5kbGVycygpO1xuICAgIH1cblxuICAgIGJpbmRIYW5kbGVycygpIHtcbiAgICAgIHRoaXMuX29uTW91c2VEb3duID0gdGhpcy5vbk1vdXNlRG93bi5iaW5kKHRoaXMpO1xuICAgICAgdGhpcy5fb25Nb3VzZVVwID0gdGhpcy5vbk1vdXNlVXAuYmluZCh0aGlzKTtcbiAgICAgIHRoaXMuX29uTW91c2VNb3ZlID0gdGhpcy5vbk1vdXNlTW92ZS5iaW5kKHRoaXMpO1xuXG4gICAgICB0aGlzLl9vbklucHV0ID0gdGhpcy5vbklucHV0LmJpbmQodGhpcyk7XG4gICAgICB0aGlzLl9vbkNoYW5nZSA9IHRoaXMub25DaGFuZ2UuYmluZCh0aGlzKTtcblxuICAgICAgdGhpcy5fb25QaXhlbFVwZGF0ZSA9IHRoaXMub25QaXhlbFVwZGF0ZS5iaW5kKHRoaXMpO1xuICAgICAgdGhpcy5fb25QaXhlbFVwZGF0ZVNpbGVudCA9IHRoaXMub25QaXhlbFVwZGF0ZS5iaW5kKHRoaXMsIHRydWUpO1xuICAgICAgdGhpcy5fb25Vbml0VXBkYXRlID0gdGhpcy5vblVuaXRVcGRhdGUuYmluZCh0aGlzKTtcbiAgICAgIHRoaXMuX29uVW5pdFVwZGF0ZVNpbGVudCA9IHRoaXMub25Vbml0VXBkYXRlLmJpbmQodGhpcywgdHJ1ZSk7XG4gICAgICB0aGlzLl9vblJlZnJlc2ggPSB0aGlzLm9uUmVmcmVzaC5iaW5kKHRoaXMpO1xuICAgIH1cblxuICAgIGF0dGFjaEhhbmRsZXJzKCkge1xuICAgICAgbGV0IG1pbkNvdW50ZXJJZCA9ICcjJyArIHRoaXMuJG1pbkNvdW50ZXIuYXR0cignaWQnKTtcbiAgICAgIGxldCBtYXhDb3VudGVySWQgPSAnIycgKyB0aGlzLiRtYXhDb3VudGVyLmF0dHIoJ2lkJyk7XG5cbiAgICAgICQoJ2JvZHknKS5vbih0aGlzLmV2ZW50cy5zdGFydEV2ZW50LCBtaW5Db3VudGVySWQgKyAnLCAnICsgbWF4Q291bnRlcklkLCB0aGlzLl9vbk1vdXNlRG93bik7XG5cbiAgICAgIHRoaXMuJG1pbklucHV0XG4gICAgICAgIC5hZGQodGhpcy4kbWF4SW5wdXQpXG4gICAgICAgIC5vbih7XG4gICAgICAgICAgJ2lucHV0JzogdGhpcy5fb25JbnB1dCxcbiAgICAgICAgICAnY2hhbmdlJzogdGhpcy5fb25DaGFuZ2VcbiAgICAgICAgfSk7XG5cbiAgICAgIHRoaXMuJHdyYXBwZXIub24oe1xuICAgICAgICBbdGhpcy5ldmVudHMudXBkYXRlVW5pdF06IHRoaXMuX29uVW5pdFVwZGF0ZSxcbiAgICAgICAgW3RoaXMuZXZlbnRzLnVwZGF0ZVVuaXRTaWxlbnRdOiB0aGlzLl9vblVuaXRVcGRhdGVTaWxlbnQsXG4gICAgICAgIFt0aGlzLmV2ZW50cy51cGRhdGVQaXhlbF06IHRoaXMuX29uUGl4ZWxVcGRhdGUsXG4gICAgICAgIFt0aGlzLmV2ZW50cy51cGRhdGVQaXhlbFNpbGVudF06IHRoaXMuX29uUGl4ZWxVcGRhdGVTaWxlbnQsXG4gICAgICAgIFt0aGlzLmV2ZW50cy5yZWZyZXNoXTogdGhpcy5fb25SZWZyZXNoXG4gICAgICB9KTtcblxuICAgICAgJCh3aW5kb3cpLm9uKCdyZXNpemUnLCB0aGlzLl9vblJlZnJlc2gpO1xuICAgIH1cblxuICAgIGRldGFjaEhhbmRsZXJzKCkge1xuICAgICAgdGhpcy4kbWluQ291bnRlclxuICAgICAgICAuYWRkKHRoaXMuJG1heENvdW50ZXIpXG4gICAgICAgIC5vZmYoe1xuICAgICAgICAgIFt0aGlzLmV2ZW50cy5zdGFydEV2ZW50XTogdGhpcy5fb25Nb3VzZURvd25cbiAgICAgICAgfSk7XG5cbiAgICAgIHRoaXMuJG1pbklucHV0XG4gICAgICAgIC5hZGQodGhpcy4kbWF4SW5wdXQpXG4gICAgICAgIC5vZmYoe1xuICAgICAgICAgICdpbnB1dCc6IHRoaXMuX29uSW5wdXQsXG4gICAgICAgICAgJ2NoYW5nZSc6IHRoaXMuX29uQ2hhbmdlXG4gICAgICAgIH0pO1xuXG4gICAgICB0aGlzLiR3cmFwcGVyLm9mZih7XG4gICAgICAgIFt0aGlzLmV2ZW50cy51cGRhdGVVbml0XTogdGhpcy5fb25Vbml0VXBkYXRlLFxuICAgICAgICBbdGhpcy5ldmVudHMudXBkYXRlVW5pdFNpbGVudF06IHRoaXMuX29uVW5pdFVwZGF0ZVNpbGVudCxcbiAgICAgICAgW3RoaXMuZXZlbnRzLnVwZGF0ZVBpeGVsXTogdGhpcy5fb25QaXhlbFVwZGF0ZSxcbiAgICAgICAgW3RoaXMuZXZlbnRzLnVwZGF0ZVBpeGVsU2lsZW50XTogdGhpcy5fb25QaXhlbFVwZGF0ZVNpbGVudCxcbiAgICAgICAgW3RoaXMuZXZlbnRzLnJlZnJlc2hdOiB0aGlzLl9vblJlZnJlc2hcbiAgICAgIH0pO1xuXG4gICAgICAkKHdpbmRvdykub2ZmKCdyZXNpemUnLCB0aGlzLl9vblJlZnJlc2gpO1xuICAgIH1cblxuICAgIHJlbmRlclJhbmdlQmFyKCkge1xuICAgICAgbGV0ICR3cmFwcGVyID0gdGhpcy4kd3JhcHBlciA9ICQodGhpcy50cGwpO1xuICAgICAgdGhpcy4kaW5uZXIgPSAkd3JhcHBlci5maW5kKCcuanJhbmdlYmFyLWlubmVyJyk7XG4gICAgICB0aGlzLiRtaW5Db3VudGVyID0gJHdyYXBwZXIuZmluZCgnLm1pbicpO1xuICAgICAgdGhpcy4kbWF4Q291bnRlciA9ICR3cmFwcGVyLmZpbmQoJy5tYXgnKTtcblxuICAgICAgdGhpcy4kbWluQ291bnRlci5hdHRyKCdpZCcsICdqcmFuZ2ViYXItbWluLScgKyBjb3VudGVyKTtcbiAgICAgIHRoaXMuJG1heENvdW50ZXIuYXR0cignaWQnLCAnanJhbmdlYmFyLW1heC0nICsgY291bnRlcik7XG4gICAgICBjb3VudGVyKys7XG5cbiAgICAgIGlmICh0aGlzLmFkZE1ldGhvZCkge1xuICAgICAgICB0aGlzLmFkZE1ldGhvZCh0aGlzLiRwYXJlbnQsICR3cmFwcGVyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuJHBhcmVudC5hcHBlbmQoJHdyYXBwZXIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIG9uTW91c2VEb3duKGUpIHtcbiAgICAgIGxldCB0YXJnZXQgPSBlLmN1cnJlbnRUYXJnZXQ7XG4gICAgICBsZXQgaW5uZXJDb29yZHMgPSB0aGlzLiRpbm5lclswXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIGxldCBjbGllbnRYID0gdGhpcy5nZXRQb3NpdGlvbihlKTtcblxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICBsZXQgJHRhcmdldCA9IHRoaXMuJHRhcmdldCA9ICQodGFyZ2V0KTtcblxuICAgICAgaWYgKCR0YXJnZXQuaXModGhpcy4kbWluQ291bnRlcikpIHtcbiAgICAgICAgdGhpcy5zaGlmdFggPSBjbGllbnRYIC0gaW5uZXJDb29yZHMubGVmdDtcbiAgICAgIH0gZWxzZSBpZiAoJHRhcmdldC5pcyh0aGlzLiRtYXhDb3VudGVyKSkge1xuICAgICAgICB0aGlzLnNoaWZ0WCA9IGlubmVyQ29vcmRzLnJpZ2h0IC0gY2xpZW50WDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgICAgLy90aGlzLnNoaWZ0WCA9IDA7XG4gICAgICB9XG5cbiAgICAgIC8vY29uc29sZS5kaXIoZSk7XG4gICAgICAvL2NvbnNvbGUubG9nKHRoaXMuc2hpZnRYKTtcblxuICAgICAgJCgnYm9keScpLm9uKHRoaXMuZXZlbnRzLm1vdmVFdmVudCwgdGhpcy5fb25Nb3VzZU1vdmUpO1xuICAgICAgJCgnYm9keScpLm9uKHRoaXMuZXZlbnRzLmVuZEV2ZW50LCB0aGlzLl9vbk1vdXNlVXApO1xuICAgIH1cblxuICAgIG9uTW91c2VNb3ZlKGUpIHtcbiAgICAgIHRoaXMubW92ZUF0KGUpO1xuICAgICAgdGhpcy5waXhlbFRvVW5pdCgpO1xuICAgIH1cblxuICAgIG1vdmVBdChlKSB7XG4gICAgICBsZXQgd3JhcHBlckNvb3JkcyA9IHRoaXMuJHdyYXBwZXJbMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICBsZXQgd3JhcHBlcldpZHRoID0gdGhpcy53cmFwcGVyV2lkdGg7XG4gICAgICBsZXQgbWluQ291bnRlcldpZHRoID0gdGhpcy5taW5Db3VudGVyV2lkdGg7XG4gICAgICBsZXQgbWF4Q291bnRlcldpZHRoID0gdGhpcy5tYXhDb3VudGVyV2lkdGg7XG4gICAgICBsZXQgJHRhcmdldCA9IHRoaXMuJHRhcmdldDtcbiAgICAgIGxldCBjbGllbnRYID0gdGhpcy5nZXRQb3NpdGlvbihlKTtcbiAgICAgIGxldCBzaGlmdFggPSB0aGlzLnNoaWZ0WDtcblxuICAgICAgaWYgKCR0YXJnZXQuaXModGhpcy4kbWluQ291bnRlcikpIHtcblxuICAgICAgICBsZXQgbGVmdCA9IGNsaWVudFggLSB3cmFwcGVyQ29vcmRzLmxlZnQgLSBzaGlmdFg7XG4gICAgICAgIGxldCBtYXhMZWZ0ID0gd3JhcHBlcldpZHRoIC0gbWluQ291bnRlcldpZHRoIC0gbWF4Q291bnRlcldpZHRoIC0gcGFyc2VGbG9hdCh0aGlzLiRpbm5lci5jc3MoJ3JpZ2h0JykpIC0gMTtcblxuICAgICAgICBpZiAobGVmdCA8IDApIHtcbiAgICAgICAgICBsZWZ0ID0gMDtcbiAgICAgICAgfSBlbHNlIGlmIChsZWZ0ID4gbWF4TGVmdCkge1xuICAgICAgICAgIGxlZnQgPSBtYXhMZWZ0O1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy4kaW5uZXIuY3NzKCdsZWZ0JywgbGVmdCArICdweCcpO1xuICAgICAgfSBlbHNlIGlmICgkdGFyZ2V0LmlzKHRoaXMuJG1heENvdW50ZXIpKSB7XG4gICAgICAgIGxldCByaWdodCA9IHdyYXBwZXJDb29yZHMucmlnaHQgLSBjbGllbnRYIC0gc2hpZnRYO1xuICAgICAgICBsZXQgbWF4UmlnaHQgPSB3cmFwcGVyV2lkdGggLSBtaW5Db3VudGVyV2lkdGggLSBtYXhDb3VudGVyV2lkdGggLSBwYXJzZUZsb2F0KHRoaXMuJGlubmVyLmNzcygnbGVmdCcpKSAtIDE7XG5cbiAgICAgICAgaWYgKHJpZ2h0IDwgMCkge1xuICAgICAgICAgIHJpZ2h0ID0gMDtcbiAgICAgICAgfSBlbHNlIGlmIChyaWdodCA+IG1heFJpZ2h0KSB7XG4gICAgICAgICAgcmlnaHQgPSBtYXhSaWdodDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuJGlubmVyLmNzcygncmlnaHQnLCByaWdodCArICdweCcpO1xuICAgICAgfVxuICAgIH1cblxuICAgIG9uTW91c2VVcCgpIHtcbiAgICAgICQoJ2JvZHknKS5vZmYoe1xuICAgICAgICBbdGhpcy5ldmVudHMubW92ZUV2ZW50XTogdGhpcy5fb25Nb3VzZU1vdmUsXG4gICAgICAgIFt0aGlzLmV2ZW50cy5lbmRFdmVudF06IHRoaXMuX29uTW91c2VVcFxuICAgICAgfSk7XG4gICAgICB0aGlzLiR0YXJnZXQgPSBudWxsO1xuICAgIH1cblxuICAgIG9uSW5wdXQoZSkge1xuICAgICAgbGV0ICR0YXJnZXQgPSB0aGlzLiR0YXJnZXQgPSAkKGUudGFyZ2V0KTtcbiAgICAgIGxldCB2YWwgPSArJHRhcmdldC52YWwoKTtcbiAgICAgIGxldCBtYXhWYWw7XG4gICAgICBsZXQgbWluVmFsO1xuXG4gICAgICBpZiAoIXRoaXMuaXNOdW1lcmljKHZhbCkpIHJldHVybjtcblxuICAgICAgaWYgKCR0YXJnZXQuaXModGhpcy4kbWluSW5wdXQpKSB7XG4gICAgICAgIG1heFZhbCA9IHRoaXMubWF4SW5wdXRWYWxDYWNoZWQ7XG4gICAgICAgIG1pblZhbCA9IHRoaXMuYmFzZU1pbjtcbiAgICAgIH0gZWxzZSBpZiAoJHRhcmdldC5pcyh0aGlzLiRtYXhJbnB1dCkpIHtcbiAgICAgICAgbWF4VmFsID0gdGhpcy5iYXNlTWF4O1xuICAgICAgICBtaW5WYWwgPSB0aGlzLm1pbklucHV0VmFsQ2FjaGVkO1xuICAgICAgfVxuXG4gICAgICBpZiAodmFsID4gbWF4VmFsKSB7XG4gICAgICAgIHZhbCA9IG1heFZhbDtcbiAgICAgIH0gZWxzZSBpZiAodmFsIDwgbWluVmFsKSB7XG4gICAgICAgIHZhbCA9IG1pblZhbDtcbiAgICAgIH1cblxuICAgICAgaWYgKCR0YXJnZXQuaXModGhpcy4kbWluSW5wdXQpKSB7XG4gICAgICAgIHRoaXMubWluSW5wdXRWYWxDYWNoZWQgPSB2YWw7XG4gICAgICB9IGVsc2UgaWYgKCR0YXJnZXQuaXModGhpcy4kbWF4SW5wdXQpKSB7XG4gICAgICAgIHRoaXMubWF4SW5wdXRWYWxDYWNoZWQgPSB2YWw7XG4gICAgICB9XG5cbiAgICAgIHRoaXMudW5pdFRvUGl4ZWwoKTtcblxuICAgICAgdGhpcy4kdGFyZ2V0ID0gbnVsbDtcbiAgICB9XG5cbiAgICBvbkNoYW5nZShlKSB7XG4gICAgICB0aGlzLnJlZnJlc2hJbnB1dChlKTtcbiAgICB9XG5cbiAgICBvblJlZnJlc2goKSB7XG4gICAgICB0aGlzLnNldHVwRGltZW50aW9ucygpO1xuICAgICAgdGhpcy5wYXJzZVJhbmdlcygpO1xuICAgIH1cblxuICAgIHJlZnJlc2hJbnB1dChlKSB7XG4gICAgICBsZXQgJHRhcmdldCA9ICQoZS50YXJnZXQpO1xuXG4gICAgICBpZiAoJHRhcmdldC5pcyh0aGlzLiRtaW5JbnB1dCkpIHtcbiAgICAgICAgJHRhcmdldC52YWwodGhpcy5taW5JbnB1dFZhbENhY2hlZCk7XG4gICAgICB9IGVsc2UgaWYgKCR0YXJnZXQuaXModGhpcy4kbWF4SW5wdXQpKSB7XG4gICAgICAgICR0YXJnZXQudmFsKHRoaXMubWF4SW5wdXRWYWxDYWNoZWQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIG9uUGl4ZWxVcGRhdGUoc2lsZW50KSB7XG4gICAgICB0aGlzLnBpeGVsVG9Vbml0KHNpbGVudCk7XG4gICAgfVxuXG4gICAgb25Vbml0VXBkYXRlKHNpbGVudCkge1xuICAgICAgdGhpcy5taW5JbnB1dFZhbENhY2hlZCA9ICt0aGlzLiRtaW5JbnB1dC52YWwoKTtcbiAgICAgIHRoaXMubWF4SW5wdXRWYWxDYWNoZWQgPSArdGhpcy4kbWF4SW5wdXQudmFsKCk7XG5cbiAgICAgIHRoaXMudW5pdFRvUGl4ZWwoc2lsZW50KTtcbiAgICB9XG5cbiAgICBwaXhlbFRvVW5pdChzaWxlbnRQcm9jZXNzKSB7XG4gICAgICBsZXQgbGVmdCA9IHBhcnNlRmxvYXQodGhpcy4kaW5uZXIuY3NzKCdsZWZ0JykpO1xuICAgICAgbGV0IHJpZ2h0ID0gcGFyc2VGbG9hdCh0aGlzLiRpbm5lci5jc3MoJ3JpZ2h0JykpO1xuICAgICAgbGV0IG1pblZhbCA9IDA7XG4gICAgICBsZXQgbWF4VmFsID0gMDtcblxuICAgICAgaWYgKHRoaXMucmFuZ2VzLmxlbmd0aCkge1xuICAgICAgICBtaW5WYWwgPSBNYXRoLnJvdW5kKHRoaXMuZ2V0Q29tcG91bmRSYW5nZSgnbGVmdCcsICd1bml0JykpO1xuICAgICAgICBtYXhWYWwgPSBNYXRoLnJvdW5kKHRoaXMuZ2V0Q29tcG91bmRSYW5nZSgncmlnaHQnLCAndW5pdCcpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1pblZhbCA9IE1hdGgucm91bmQobGVmdCAqIHRoaXMudW5pdEluUGl4ZWwpO1xuICAgICAgICBtYXhWYWwgPSBNYXRoLnJvdW5kKCh0aGlzLmZ1bGxQaXhlbFJhbmdlIC0gcmlnaHQpICogdGhpcy51bml0SW5QaXhlbCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMubWluSW5wdXRWYWxDYWNoZWQgPSBtaW5WYWw7XG4gICAgICB0aGlzLm1heElucHV0VmFsQ2FjaGVkID0gbWF4VmFsO1xuXG4gICAgICB0aGlzLiRtaW5JbnB1dC52YWwobWluVmFsKTtcbiAgICAgIHRoaXMuJG1heElucHV0LnZhbChtYXhWYWwpO1xuXG4gICAgICBpZiAoc2lsZW50UHJvY2VzcykgcmV0dXJuO1xuXG4gICAgICB0aGlzLiR3cmFwcGVyXG4gICAgICAgIC5hZGQodGhpcy4kbWluSW5wdXQpXG4gICAgICAgIC5hZGQodGhpcy4kbWF4SW5wdXQpXG4gICAgICAgIC50cmlnZ2VyKHRoaXMuZXZlbnRzLmNoYW5nZSk7XG4gICAgfVxuXG4gICAgdW5pdFRvUGl4ZWwoc2lsZW50UHJvY2Vzcykge1xuICAgICAgbGV0IGxlZnQ7XG4gICAgICBsZXQgcmlnaHQ7XG5cbiAgICAgIGlmICh0aGlzLnJhbmdlcy5sZW5ndGgpIHtcbiAgICAgICAgbGVmdCA9IHRoaXMuZ2V0Q29tcG91bmRSYW5nZSgnbGVmdCcsICdwaXhlbCcpO1xuICAgICAgICByaWdodCA9IHRoaXMuZ2V0Q29tcG91bmRSYW5nZSgncmlnaHQnLCAncGl4ZWwnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxlZnQgPSB0aGlzLmJhc2VNaW4gLyB0aGlzLnVuaXRJblBpeGVsO1xuICAgICAgICByaWdodCA9IHRoaXMuZnVsbFBpeGVsUmFuZ2UgLSB0aGlzLmJhc2VNYXggLyB0aGlzLnVuaXRJblBpeGVsO1xuICAgICAgfVxuXG4gICAgICB0aGlzLiRpbm5lci5jc3MoJ2xlZnQnLCBsZWZ0ICsgJ3B4Jyk7XG4gICAgICB0aGlzLiRpbm5lci5jc3MoJ3JpZ2h0JywgcmlnaHQgKyAncHgnKTtcblxuICAgICAgaWYgKHNpbGVudFByb2Nlc3MpIHJldHVybjtcblxuICAgICAgdGhpcy4kd3JhcHBlclxuICAgICAgICAuYWRkKHRoaXMuJG1pbklucHV0KVxuICAgICAgICAuYWRkKHRoaXMuJG1heElucHV0KVxuICAgICAgICAudHJpZ2dlcih0aGlzLmV2ZW50cy5jaGFuZ2UpO1xuICAgIH1cblxuICAgIHBhcnNlUmFuZ2VzKCkge1xuICAgICAgbGV0IHByZXZVbml0U3VtID0gdGhpcy5iYXNlTWluO1xuICAgICAgbGV0IHByZXZQaXhlbFN1bSA9IDA7XG5cbiAgICAgIGlmICghdGhpcy51c2VyUmFuZ2VzIHx8ICEkLmlzQXJyYXkodGhpcy51c2VyUmFuZ2VzKSkgcmV0dXJuO1xuXG4gICAgICB0aGlzLnJhbmdlcyA9IFtdO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMudXNlclJhbmdlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBsZXQgY3VyclBpeGVsUmFuZ2UgPSB0aGlzLnVzZXJSYW5nZXNbaV0ucGl4ZWxSYW5nZTtcbiAgICAgICAgbGV0IGN1cnJVbml0UmFuZ2UgPSB0aGlzLnVzZXJSYW5nZXNbaV0udW5pdFJhbmdlO1xuICAgICAgICBsZXQgY3VyclJhbmdlID0ge307XG5cbiAgICAgICAgLyppZiAoIWlzTnVtZXJpYyhjdXJyUGl4ZWxSYW5nZSkgfHwgIWlzTnVtZXJpYyhjdXJyVW5pdFJhbmdlKSkge1xuICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgfSovXG5cbiAgICAgICAgaWYgKHR5cGVvZiBjdXJyUGl4ZWxSYW5nZSA9PT0gJ3N0cmluZycgJiYgfmN1cnJQaXhlbFJhbmdlLmxhc3RJbmRleE9mKCclJykpIHtcbiAgICAgICAgICBjdXJyUGl4ZWxSYW5nZSA9IHRoaXMuZnVsbFBpeGVsUmFuZ2UgKiBwYXJzZUZsb2F0KGN1cnJQaXhlbFJhbmdlKSAvIDEwMDsgLy8rIHByZXZQaXhlbFN1bTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjdXJyUGl4ZWxSYW5nZSA9IHBhcnNlSW50KGN1cnJQaXhlbFJhbmdlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgY3VyclVuaXRSYW5nZSA9PT0gJ3N0cmluZycgJiYgfmN1cnJVbml0UmFuZ2UubGFzdEluZGV4T2YoJyUnKSkge1xuICAgICAgICAgIGN1cnJVbml0UmFuZ2UgPSB0aGlzLmZ1bGxVbml0UmFuZ2UgKiBwYXJzZUZsb2F0KGN1cnJVbml0UmFuZ2UpIC8gMTAwICsgdGhpcy5iYXNlTWluO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGN1cnJVbml0UmFuZ2UgPSBwYXJzZUludChjdXJyVW5pdFJhbmdlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGN1cnJSYW5nZS5waXhlbFJhbmdlID0gY3VyclBpeGVsUmFuZ2U7XG4gICAgICAgIGN1cnJSYW5nZS51bml0UmFuZ2UgPSBjdXJyVW5pdFJhbmdlO1xuICAgICAgICB0aGlzLnJhbmdlcy5wdXNoKGN1cnJSYW5nZSk7XG5cbiAgICAgICAgcHJldlBpeGVsU3VtID0gY3VyclBpeGVsUmFuZ2U7XG4gICAgICAgIHByZXZVbml0U3VtID0gY3VyclVuaXRSYW5nZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuZnVsbFVuaXRSYW5nZSAhPT0gcHJldlVuaXRTdW0pIHtcbiAgICAgICAgdGhpcy5yYW5nZXMucHVzaCh7XG4gICAgICAgICAgdW5pdFJhbmdlOiB0aGlzLmJhc2VNYXgsXG4gICAgICAgICAgcGl4ZWxSYW5nZTogdGhpcy5mdWxsUGl4ZWxSYW5nZVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRDb21wb3VuZFJhbmdlKGRpcmVjdGlvbiwgb3V0cHV0VW5pdCkge1xuICAgICAgbGV0IHByZXZQaXhlbFJhbmdlID0gMDtcbiAgICAgIGxldCBwcmV2VW5pdFJhbmdlID0gdGhpcy5iYXNlTWluO1xuICAgICAgbGV0IHNvdXJjZVVuaXQgPSAwO1xuICAgICAgbGV0IHJlc3VsdCA9IDA7XG5cbiAgICAgIGlmIChkaXJlY3Rpb24gPT09ICdsZWZ0Jykge1xuICAgICAgICBpZiAob3V0cHV0VW5pdCA9PT0gJ3BpeGVsJykge1xuICAgICAgICAgIHNvdXJjZVVuaXQgPSB0aGlzLm1pbklucHV0VmFsQ2FjaGVkIC0gdGhpcy5iYXNlTWluO1xuICAgICAgICB9IGVsc2UgaWYgKG91dHB1dFVuaXQgPT09ICd1bml0Jykge1xuICAgICAgICAgIHNvdXJjZVVuaXQgPSBwYXJzZUZsb2F0KHRoaXMuJGlubmVyLmNzcygnbGVmdCcpKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChkaXJlY3Rpb24gPT09ICdyaWdodCcpIHtcbiAgICAgICAgaWYgKG91dHB1dFVuaXQgPT09ICdwaXhlbCcpIHtcbiAgICAgICAgICBzb3VyY2VVbml0ID0gdGhpcy5tYXhJbnB1dFZhbENhY2hlZCAtIHRoaXMuYmFzZU1pbjtcbiAgICAgICAgfSBlbHNlIGlmIChvdXRwdXRVbml0ID09PSAndW5pdCcpIHtcbiAgICAgICAgICBzb3VyY2VVbml0ID0gdGhpcy5mdWxsUGl4ZWxSYW5nZSAtIHBhcnNlRmxvYXQodGhpcy4kaW5uZXIuY3NzKCdyaWdodCcpKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucmFuZ2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCBjdXJyUGl4ZWxSYW5nZSA9IHRoaXMucmFuZ2VzW2ldLnBpeGVsUmFuZ2U7XG4gICAgICAgIGxldCBjdXJyVW5pdFJhbmdlID0gdGhpcy5yYW5nZXNbaV0udW5pdFJhbmdlO1xuICAgICAgICBsZXQgY3VyclVuaXRJblBpeGVsID0gMDtcblxuICAgICAgICBjdXJyUGl4ZWxSYW5nZSA9IGN1cnJQaXhlbFJhbmdlIC0gcHJldlBpeGVsUmFuZ2U7XG4gICAgICAgIGN1cnJVbml0UmFuZ2UgPSBjdXJyVW5pdFJhbmdlIC0gcHJldlVuaXRSYW5nZTtcbiAgICAgICAgY3VyclVuaXRJblBpeGVsID0gY3VyclVuaXRSYW5nZSAvIGN1cnJQaXhlbFJhbmdlO1xuXG4gICAgICAgIGlmIChvdXRwdXRVbml0ID09PSAncGl4ZWwnKSB7XG4gICAgICAgICAgaWYgKHNvdXJjZVVuaXQgPiBjdXJyVW5pdFJhbmdlKSB7XG4gICAgICAgICAgICBzb3VyY2VVbml0IC09IGN1cnJVbml0UmFuZ2U7XG4gICAgICAgICAgICByZXN1bHQgKz0gY3VyclVuaXRSYW5nZSAvIGN1cnJVbml0SW5QaXhlbDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzdWx0ICs9IHNvdXJjZVVuaXQgLyBjdXJyVW5pdEluUGl4ZWw7XG5cbiAgICAgICAgICAgIGlmIChkaXJlY3Rpb24gPT09ICdsZWZ0Jykge1xuICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfSBlbHNlIGlmIChkaXJlY3Rpb24gPT09ICdyaWdodCcpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZnVsbFBpeGVsUmFuZ2UgLSByZXN1bHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKG91dHB1dFVuaXQgPT09ICd1bml0Jykge1xuICAgICAgICAgIGlmIChzb3VyY2VVbml0ID4gY3VyclBpeGVsUmFuZ2UpIHtcbiAgICAgICAgICAgIHNvdXJjZVVuaXQgLT0gY3VyclBpeGVsUmFuZ2U7XG4gICAgICAgICAgICByZXN1bHQgKz0gY3VyclBpeGVsUmFuZ2UgKiBjdXJyVW5pdEluUGl4ZWw7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdCArPSBzb3VyY2VVbml0ICogY3VyclVuaXRJblBpeGVsO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwcmV2UGl4ZWxSYW5nZSA9IHRoaXMucmFuZ2VzW2ldLnBpeGVsUmFuZ2U7XG4gICAgICAgIHByZXZVbml0UmFuZ2UgPSB0aGlzLnJhbmdlc1tpXS51bml0UmFuZ2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0RGltZW50aW9ucygpIHtcbiAgICAgIGxldCBmdWxsVW5pdFJhbmdlID0gdGhpcy5iYXNlTWF4IC0gdGhpcy5iYXNlTWluO1xuICAgICAgbGV0IHdyYXBwZXJXaWR0aCA9IHRoaXMuJHdyYXBwZXIud2lkdGgoKTtcbiAgICAgIGxldCBtaW5Db3VudGVyV2lkdGggPSB0aGlzLiRtaW5Db3VudGVyLm91dGVyV2lkdGgoKTtcbiAgICAgIGxldCBtYXhDb3VudGVyV2lkdGggPSB0aGlzLiRtYXhDb3VudGVyLm91dGVyV2lkdGgoKTtcbiAgICAgIGxldCBmdWxsUGl4ZWxSYW5nZSA9IHdyYXBwZXJXaWR0aCAtIG1pbkNvdW50ZXJXaWR0aCAtIG1heENvdW50ZXJXaWR0aCAtIDE7IC8vIC0gMjtcbiAgICAgIGxldCB1bml0SW5QaXhlbCA9IGZ1bGxVbml0UmFuZ2UgLyBmdWxsUGl4ZWxSYW5nZTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdW5pdFJhbmdlOiBmdWxsVW5pdFJhbmdlLFxuICAgICAgICBwaXhlbFJhbmdlOiBmdWxsUGl4ZWxSYW5nZSxcbiAgICAgICAgdW5pdEluUGl4ZWw6IHVuaXRJblBpeGVsLFxuICAgICAgICB3cmFwcGVyV2lkdGg6IHdyYXBwZXJXaWR0aCxcbiAgICAgICAgbWluQ291bnRlcldpZHRoOiBtaW5Db3VudGVyV2lkdGgsXG4gICAgICAgIG1heENvdW50ZXJXaWR0aDogbWF4Q291bnRlcldpZHRoXG4gICAgICB9O1xuICAgIH1cblxuICAgIHNldHVwRGltZW50aW9ucygpIHtcbiAgICAgIGxldCByYW5nZXMgPSB0aGlzLmdldERpbWVudGlvbnMoKTtcblxuICAgICAgdGhpcy5mdWxsVW5pdFJhbmdlID0gcmFuZ2VzLnVuaXRSYW5nZTtcbiAgICAgIHRoaXMuZnVsbFBpeGVsUmFuZ2UgPSByYW5nZXMucGl4ZWxSYW5nZTtcbiAgICAgIHRoaXMudW5pdEluUGl4ZWwgPSByYW5nZXMudW5pdEluUGl4ZWw7XG4gICAgICB0aGlzLndyYXBwZXJXaWR0aCA9IHJhbmdlcy53cmFwcGVyV2lkdGg7XG4gICAgICB0aGlzLm1pbkNvdW50ZXJXaWR0aCA9IHJhbmdlcy5taW5Db3VudGVyV2lkdGg7XG4gICAgICB0aGlzLm1heENvdW50ZXJXaWR0aCA9IHJhbmdlcy5tYXhDb3VudGVyV2lkdGg7XG4gICAgfVxuXG4gICAgZ2V0UG9zaXRpb24oZSkge1xuICAgICAgLy8gR2V0IHRoZSBvZmZzZXQgRElSRUNUSU9OIHJlbGF0aXZlIHRvIHRoZSB2aWV3cG9ydFxuICAgICAgbGV0IGNvb3JkaW5hdGUgPSAneCc7XG4gICAgICBsZXQgdWNDb29yZGluYXRlID0gJ1gnO1xuICAgICAgLy9sZXQgcmFuZ2VQb3MgPSB0aGlzLiRpbm5lclswXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVsnbGVmdCddO1xuICAgICAgbGV0IHBhZ2VDb29yZGluYXRlID0gMDtcblxuXG4gICAgICBpZiAodHlwZW9mIGUub3JpZ2luYWxFdmVudFsnY2xpZW50JyArIHVjQ29vcmRpbmF0ZV0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHBhZ2VDb29yZGluYXRlID0gZS5vcmlnaW5hbEV2ZW50WydjbGllbnQnICsgdWNDb29yZGluYXRlXTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKFxuICAgICAgICBlLm9yaWdpbmFsRXZlbnQudG91Y2hlcyAmJlxuICAgICAgICBlLm9yaWdpbmFsRXZlbnQudG91Y2hlc1swXSAmJlxuICAgICAgICB0eXBlb2YgZS5vcmlnaW5hbEV2ZW50LnRvdWNoZXNbMF1bJ2NsaWVudCcgKyB1Y0Nvb3JkaW5hdGVdICE9PSAndW5kZWZpbmVkJ1xuICAgICAgKSB7XG4gICAgICAgIHBhZ2VDb29yZGluYXRlID0gZS5vcmlnaW5hbEV2ZW50LnRvdWNoZXNbMF1bJ2NsaWVudCcgKyB1Y0Nvb3JkaW5hdGVdO1xuICAgICAgfVxuICAgICAgZWxzZSBpZihlLmN1cnJlbnRQb2ludCAmJiB0eXBlb2YgZS5jdXJyZW50UG9pbnRbY29vcmRpbmF0ZV0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHBhZ2VDb29yZGluYXRlID0gZS5jdXJyZW50UG9pbnRbY29vcmRpbmF0ZV07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwYWdlQ29vcmRpbmF0ZTsgLy8gLSByYW5nZVBvcztcbiAgICB9O1xuXG4gICAgaXNOdW1lcmljKG4pIHtcbiAgICAgIHJldHVybiAhaXNOYU4ocGFyc2VGbG9hdChuKSkgJiYgaXNGaW5pdGUobik7XG4gICAgfVxuXG4gICAgZ2V0U2VsZigpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfVxuXG4gIGxldCBjb3VudGVyID0gMDtcblxuICAkLmZuLmpSYW5nZUJhciA9IGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgXyA9IHRoaXM7XG4gICAgbGV0IG9wdGlvbnMgPSBhcmd1bWVudHNbMF0gfHwge307XG4gICAgbGV0IGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBfLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIG9wdGlvbnMucGFyZW50ID0gX1tpXTtcbiAgICAgICAgX1tpXS5qUmFuZ2VCYXIgPSBuZXcgSlJhbmdlQmFyQ29udHJvbGxlcihvcHRpb25zKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCByZXN1bHQgPSBfW2ldLmpSYW5nZUJhcltvcHRpb25zXS5jYWxsKF9baV0ualJhbmdlQmFyLCBhcmdzKTtcblxuICAgICAgICBpZiAodHlwZW9mIHJlc3VsdCAhPT0gJ3VuZGVmaW5lZCcpIHJldHVybiByZXN1bHQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIF87XG4gIH07XG59KSk7XG5cbiJdfQ==
