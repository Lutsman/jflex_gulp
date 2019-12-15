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
  var JTourController = function () {
    function JTourController(options) {
      _classCallCheck(this, JTourController);

      this.userSteps = options.steps;
      this.steps = [];
      this.activeStep = null;
      this.activeStepIndex = 0;
      this.prevStepIndex = 0;
      this.name = options.name || 'tour';
      this.title = options.title || this.name;
      this.translationElementSelector = options.translationSelector;
      this.isMenu = options.isMenu || false;
      this.menuContainer = options.menuContainer || document.body;
      this.addMenuMethod = options.addMenuMethod || null;
      this.removeMenuMethod = options.removeMenuMethod || null;
      this.triggeredEl = options.triggeredEl || document.body;
      this.player = $.jPlayer;
      this.isSound = options.isSound || true;
      this.tpl = {
        contentWrapper: '<div class="tootip-content-wrapper"></div>',
        title: '<div class="tooltip-title pv10 mb10 big bold t_blue"></div>',
        content: '<div class="tooltip-message mb20"></div>',
        prev: '<button class="tooltip-btn tooltip-btn_back btn small simple" data-role="prev">назад</button>',
        next: '<button class="tooltip-btn tooltip-btn_next btn small simple" data-role="next">вперед</button>',
        end: '<button class="tooltip-btn btn small simple" data-role="end">завершить</button>',
        replay: '<div class="tooltip-replay" data-role="replay"></div>',
        overlay: '<div class="tour-overlay"></div>'
      };
      this.menuTpl = {
        menuWrapper: '<div class="tour-menu-wrapper">' + '<div class="tour-title">Настройка системы</div>' + '</div>',
        soundBtn: '<div>' + '<input id="tour-sound" type="checkbox">' + '<label class="speaker" for="tour-sound"></label>' + '</div>',
        container: '<ol class="tour-menu marker blue"></ol>',
        item: '<li></li>',
        itemAnchor: '<a href="#" ></a>'
      };
      this.events = {
        tourStart: 'jTour:tourStart',
        tourStop: 'jTour:tourStop',
        tourReset: 'jTour:tourReset',
        tourGoNextPage: 'jTour:tourGoNextPage',
        tourOnNextPageStart: 'jTour:tourOnNextPageStart',
        stepBeforeStart: 'jTour:stepBeforeStart',
        stepAfterStart: 'jTour:stepAfterStart',
        stepBeforeEnd: 'jTour:stepBeforeEnd',
        stepAfterEnd: 'jTour:stepAfterEnd',
        menuBeforeSwitch: 'jTour:menuBeforeSwitch',
        menuAfterSwitch: 'jTour:menuAfterSwitch'
      };
      this.class = {
        customTooltipClass: 'js__jtooltip-s_grey'
      };
      this.userTooltipOptions = options.tooltipOptions || {};

      this.init();
    }

    _createClass(JTourController, [{
      key: 'init',
      value: function init() {
        this._tooltipClickHandler = this.contentClickHandler.bind(this);
        this.$triggeredEl = $(this.triggeredEl);
        this.tooltipOptions = $.extend(true, {}, DefaultTooltipOptions, this.userTooltipOptions);

        for (var i = 0; i < this.userSteps.length; i++) {
          this.steps.push($.extend(true, {}, DefaultStep, this.userSteps[i]));
        }

        var tourData = this.getTourData();

        if (tourData) {
          this.startPage = tourData.startPage;
          this.setupStepsPath();
          this.activeStepIndex = tourData.activeStepIndex;
          this.activeStep = this.steps[tourData.activeStepIndex];
          this.isSound = tourData.isSound;
          this.deleteTourData();
          this.start();
        } else {
          this.activeStepIndex = 0;
          this.activeStep = this.steps[0];
          this.setupStepsPath();
        }
      }
    }, {
      key: 'start',
      value: function start() {
        this.$triggeredEl.trigger(this.events.tourStart, [this]);
        this.goto(this.activeStepIndex);

        if (this.isSamePath(this.activeStep.path)) {
          if (this.isMenu && !this.$menu) {
            this.createMenu();
            this.switchMenuItem(this.activeStepIndex);
          }
        }
      }
    }, {
      key: 'stop',
      value: function stop() {
        this.$triggeredEl.trigger(this.events.tourStop, [this]);

        this.reset();
        this.removeMenu();
      }
    }, {
      key: 'reset',
      value: function reset() {
        this.$triggeredEl.trigger(this.events.tourReset, [this]);

        if (this.activeStep.animateType === 'highlight') {
          this.unhighlightEl(this.activeStep.element);
        }

        this.player.stop();
        this.removeTooltip();
        this.closeModal();
        this.activeStepIndex = 0;
        this.activeStep = this.steps[0];
      }
    }, {
      key: 'goto',
      value: function goto(index) {
        if (index < 0 || index >= this.steps.length) return;

        this.prevStepIndex = this.activeStepIndex;
        this.activeStep = this.steps[index];
        this.activeStepIndex = index;

        this.runStep(this.activeStep);
      }
    }, {
      key: 'gotoPage',
      value: function gotoPage(path) {
        this.$triggeredEl.trigger(this.events.tourGoNextPage, [path, this]);
        this.putTourData(path);
        window.open(path, '_self');
      }
    }, {
      key: 'bindNextStep',
      value: function bindNextStep(index) {
        var path = window.location.pathname;
        index = index || 1;

        if (this.activeStepIndex + index >= this.steps.length) {
          return;
        }

        this.prevStepIndex += index - 1;
        this.activeStepIndex += index;
        this.activeStep = this.steps[this.activeStepIndex];

        this.$triggeredEl.trigger(this.events.tourGoNextPage, [path, this]);
        this.putTourData(path);
      }
    }, {
      key: 'runStep',
      value: function runStep(step) {
        var _this = this;

        var $stepElement = $(step.element);

        this.clean();

        if (!this.isSamePath(step.path, true)) {
          this.gotoPage(step.path);
          return;
        }

        if (step.onElement && step.onElement.handler && typeof step.onElement.handler === 'function') {

          $stepElement.on(step.onElement.event, { tourController: this }, step.onElement.handler);
        }

        this.$triggeredEl.trigger(this.events.stepBeforeStart, [step, this]);
        this.openModal(step);

        if ($stepElement.length) {
          this.onModalClose().then(function () {
            return _this.animateToStep(step);
          }).then(function () {
            _this.playAudio(step.file);
          });
        } else {
          this.playAudio(step.file);
        }
      }
    }, {
      key: 'animateToStep',
      value: function animateToStep(step) {
        var _this2 = this;

        return new Promise(function (resolve, reject) {
          switch (step.animateType) {
            case 'simple':
              _this2.scrollTo(step.element).then(function () {
                _this2.showTooltip(step.element, step.content, step.title, step.tooltipPos);
                _this2.$triggeredEl.trigger(_this2.events.stepAfterStart, [step, _this2]);

                resolve();
              }, function (error) {
                console.log(error);
                reject(error);
              });
              break;
            case 'highlight':
              _this2.scrollTo(step.element).then(function () {
                _this2.showTooltip(step.element, step.content, step.title, step.tooltipPos);
                _this2.highlightEl(step.element);
                _this2.$triggeredEl.trigger(_this2.events.stepAfterStart, [step, _this2]);

                resolve();
              }, function (error) {
                console.log(error);
                reject(error);
              });
              break;
          }
        });
      }
    }, {
      key: 'clean',
      value: function clean() {
        var prevStep = this.steps[this.prevStepIndex];
        var $prevStepElement = $(prevStep.element);

        if (this.tooltip) {
          this.$triggeredEl.trigger(this.events.stepBeforeEnd, [prevStep, this]);
          this.removeTooltip();
          setTimeout(function () {
            this.$triggeredEl.trigger(this.events.stepAfterEnd, [prevStep, this]);
          }.bind(this), this.tooltip.hideAnimationSpeed);
        }

        this.closeModal();

        if (!prevStep) return;

        if (prevStep.animateType === 'highlight') {
          this.unhighlightEl(prevStep.element);
        }

        if (prevStep.onElement && typeof prevStep.onElement.handler === 'function') {

          $prevStepElement.off(prevStep.onElement.event, prevStep.onElement.handler);
        }
      }
    }, {
      key: 'isSamePath',
      value: function isSamePath(path, isEmptyPath) {
        var lang = this.getLang();
        var reg = lang ? new RegExp('/' + lang + '/', 'g') : null;
        var currPath = path.replace(reg, '/');
        var localPath = window.location.pathname.replace(reg, '/');

        if (currPath === localPath || currPath === '' && isEmptyPath) {
          return true;
          return true;
        }

        return false;
      }
    }, {
      key: 'getLang',
      value: function getLang() {
        var objClass = $('body').attr('class').split(/\s+/);
        var pattern = 'i18n-';

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = objClass[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var className = _step.value;

            var pos = className.indexOf('i18n-');
            if (pos === -1) continue;

            return className.slice(pos + pattern.length);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        return null;
      }
    }, {
      key: 'highlightEl',
      value: function highlightEl(el) {
        var $el = $(el);

        if (!$el.length) return;

        var $overlay = this.$overlay = this.$overlay || $(this.tpl.overlay);
        var computedStyles = window.getComputedStyle($el[0]);
        var backgroundColor = '';

        if (computedStyles.backgroundColor === 'rgba(0, 0, 0, 0)') {
          backgroundColor = this.getParentBackground($el);
        }

        $el.css({
          position: 'relative',
          zIndex: '9500',
          backgroundColor: backgroundColor
        }).after($overlay);

        $overlay.css({
          display: 'none',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          zIndex: '9000'
        }).fadeIn(400);
      }
    }, {
      key: 'unhighlightEl',
      value: function unhighlightEl(el) {
        var $el = $(el);

        if (!$el.length) return;

        var $overlay = this.$overlay = this.$overlay || $(this.tpl.overlay);

        $overlay.fadeOut(400, function () {
          $overlay.remove();
          $el.css({
            position: '',
            zIndex: '',
            backgroundColor: ''
          });
        });
      }
    }, {
      key: 'getParentBackground',
      value: function getParentBackground(el) {
        if ($(el).is('body')) return '#fff';

        var $parent = $(el).parent();
        var backgroundColor = window.getComputedStyle($parent[0]).backgroundColor;

        if (backgroundColor === 'rgba(0, 0, 0, 0)') {
          backgroundColor = this.getParentBackground($parent);
        }

        return backgroundColor;
      }
    }, {
      key: 'scrollTo',
      value: function scrollTo(selector, translation) {
        var _this3 = this;

        return new Promise(function (resolve, reject) {
          var wh = document.documentElement.clientHeight;
          var $el = $(selector);
          var elh = $el.outerHeight();
          var coords = {};
          var scrollTop = 0;

          if ($el.length) {
            coords = _this3.getCoords($el[0]);
          } else {
            reject('no such element');
          }

          if (wh > elh) {
            scrollTop = coords.top - (wh - elh) / 2;
          } else {
            scrollTop = coords.top;
          }

          $("html, body").animate({
            scrollTop: scrollTop - (translation || 0)
          }, {
            duration: 500,
            complete: resolve
          });
        });
      }
    }, {
      key: 'renderContent',
      value: function renderContent(content, title, controlPos) {
        //TODO переписать рендер и хендлер с использованием классов, без использования элементов для сравнения
        this.content = {};
        var $wrapper = this.content.$wrapper = $(this.tpl.contentWrapper);
        var $title = title ? $(this.tpl.title).append(title) : '';
        var $content = content ? $(this.tpl.content).append(content) : '';
        var $prev = this.content.$prev = $(this.tpl.prev);
        var $next = this.content.$next = $(this.tpl.next);
        var $end = this.content.$end = $(this.tpl.end);
        var $replay = this.content.$replay = $(this.tpl.replay);
        var $controls = $('<div class="mb20"></div>');
        controlPos = controlPos || 'bottom';

        $controls.append($prev).append($next).append($end);

        if (this.activeStepIndex === 0) {
          $prev.addClass('disabled').attr('disabled', true);
        }

        if (this.activeStepIndex === this.steps.length - 1) {
          $next.addClass('disabled').attr('disabled', true);
        }

        if (this.activeStep.file) {
          if (!this.isSound) {
            $replay.addClass('disabled');
          }

          if (controlPos === 'bottom') {
            $wrapper.append($replay);
          } else {
            $controls.append($replay);
          }
        }

        if (controlPos === 'bottom') {
          $wrapper.append($title).append($content).append($controls);
        } else {
          $wrapper.append($controls).append($title).append($content);
        }

        $wrapper.on('click', this._tooltipClickHandler);

        return $wrapper;
      }
    }, {
      key: 'contentClickHandler',
      value: function contentClickHandler(e) {
        var $target = $(e.target);

        if ($target.is(this.content.$prev)) {
          this.switchMenuItem(this.activeStepIndex - 1);
          this.goto(this.activeStepIndex - 1);
        } else if ($target.is(this.content.$next)) {
          this.switchMenuItem(this.activeStepIndex + 1);
          this.goto(this.activeStepIndex + 1);
        } else if ($target.is(this.content.$end)) {
          this.stop();
        } else if ($target.is(this.content.$replay) && !$target.hasClass('disabled')) {
          this.playAudio();
        }
      }
    }, {
      key: 'showTooltip',
      value: function showTooltip(el, content, title, pos) {
        var tooltip = this.tooltip;

        if (!tooltip) {
          tooltip = this.tooltip = $(el).jTooltip(this.tooltipOptions).jTooltip('getSelf');

          tooltip.stop();
        }

        tooltip.block = $(el)[0];
        tooltip.content = this.renderContent(content, title);
        tooltip.tooltipPosition = pos;
        tooltip.addTooltip();
      }
    }, {
      key: 'removeTooltip',
      value: function removeTooltip() {
        if (!this.tooltip) return;

        if (this.content && this.content.$wrapper) {
          this.content.$wrapper.off();
        }
        this.content = {};
        this.tooltip.removeTooltip();
      }
    }, {
      key: 'openModal',
      value: function openModal(step) {
        var content = step.manual;
        var title = step.title;
        var element = step.element;
        var controlPos = 'top';
        var options = {
          content: content
        };

        if (!content) return;

        if (!element || !$(element).length) {
          options.content = this.renderContent(content, title, controlPos);
          options.disableOverlayHandler = true;
          options.disableCloseBtnHandler = true;
        }

        this.isModalActive = true;
        $.jBox.open(options);
      }
    }, {
      key: 'closeModal',
      value: function closeModal() {
        if (!this.isModalActive) return;

        $.jBox.close();
        this.isModalActive = false;
      }
    }, {
      key: 'onModalClose',
      value: function onModalClose() {
        var _this4 = this;

        return new Promise(function (resolve) {
          if (_this4.isModalActive) {
            setTimeout(function () {
              $(document.body).one('jBox:afterClose', resolve);
            }, 300);
          } else {
            resolve();
          }
        });
      }
    }, {
      key: 'getCookies',
      value: function getCookies(key) {
        var cachedJsonOption = $.cookie.json;
        $.cookie.json = true;
        var cookie = $.cookie(key);
        $.cookie.json = cachedJsonOption;

        return cookie;
      }
    }, {
      key: 'putCookies',
      value: function putCookies(key, val, opt) {
        var cachedJsonOption = $.cookie.json;
        $.cookie.json = true;
        $.cookie(key, val, opt);
        $.cookie.json = cachedJsonOption;
      }
    }, {
      key: 'deleteCookies',
      value: function deleteCookies(key, opt) {
        return $.removeCookie(key, opt);
      }
    }, {
      key: 'putTourData',
      value: function putTourData(path) {
        var options = {
          path: '/'
        };
        var tourData = {
          path: path,
          name: this.name,
          activeStepIndex: this.activeStepIndex,
          startPage: this.startPage,
          isSound: this.isSound
        };

        this.putCookies(this.name, tourData, options);
      }
    }, {
      key: 'getTourData',
      value: function getTourData() {
        var tourData = this.getCookies(this.name);

        if (!tourData || !this.isSamePath(tourData.path)) return null;

        return tourData;
      }
    }, {
      key: 'deleteTourData',
      value: function deleteTourData() {
        var options = {
          path: '/'
        };

        this.deleteCookies(this.name, options);
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
      key: 'createMenu',
      value: function createMenu() {
        var $menu = this.$menu = this.renderMenu();

        if (!$menu) return;

        this.addMenu($menu);
        this.$soundBtn = $menu.find('#tour-sound').attr('checked', this.isSound);
        this._menuClickHandler = this.menuClickHandler.bind(this);
        $menu.on('click', this._menuClickHandler);
      }
    }, {
      key: 'renderMenu',
      value: function renderMenu() {
        var $menuWrapper = $(this.menuTpl.menuWrapper);
        var $menuContainer = $(this.menuTpl.container);
        var steps = this.steps;
        var $currMenuItem = $(0);

        for (var i = 0; i < steps.length; i++) {
          var currStep = steps[i];
          if (currStep.isMenuStep) {
            var $menuItem = $(this.menuTpl.item);
            var $menuAnchor = $(this.menuTpl.itemAnchor);

            $currMenuItem = $menuItem;

            $menuAnchor.text(currStep.menuTitle || steps[i].title).attr('data-jtour-step', i);
            $menuItem.append($menuAnchor);
            $menuContainer.append($menuItem);
          }

          if (this.activeStepIndex === i) {
            $currMenuItem.addClass('active');
          }
        }

        for (var _i = 0; _i < this.steps.length; _i++) {
          if (!this.steps[_i].file) continue;

          $menuWrapper.prepend(this.menuTpl.soundBtn);
          break;
        }

        $menuWrapper.append($menuContainer);

        return $menuContainer.children() === 0 ? null : $menuWrapper;
      }
    }, {
      key: 'removeMenu',
      value: function removeMenu() {
        if (!this.isMenu || !this.$menu) return;

        if (typeof this.removeMenuMethod === 'function') {
          this.removeMenuMethod(this.$menu, this.menuContainer, this);
        }

        this.$menu.off('click', this._menuClickHandler).remove();

        this.$menu = null;
      }
    }, {
      key: 'addMenu',
      value: function addMenu(menu) {
        if (typeof this.addMenuMethod === 'function') {
          this.addMenuMethod(menu, this.menuContainer, this);
        } else {
          $(this.menuContainer).append(menu);
        }
      }
    }, {
      key: 'menuClickHandler',
      value: function menuClickHandler(e) {
        var $target = $(e.target);

        if ($target.is('[data-jtour-step]')) {
          var index = +$target.attr('data-jtour-step');

          this.switchMenuItem(index);
          this.goto(index);

          e.preventDefault();
          return;
        }

        if ($target.is(this.$soundBtn)) {
          this.toggleVolume();

          return;
        }
      }
    }, {
      key: 'playAudio',
      value: function playAudio(source) {
        source = source || this.activeStep.file;

        if (!this.isSound) return;

        this.player.init(source);
        this.player.play();
      }
    }, {
      key: 'toggleVolume',
      value: function toggleVolume() {
        this.isSound = this.$soundBtn[0].checked;

        if (this.isSound) {
          this.content.$replay.removeClass('disabled').attr('disabled', false);
        } else {
          this.player.pause();
          this.content.$replay.addClass('disabled');
        }
      }
    }, {
      key: 'switchMenuItem',
      value: function switchMenuItem(index) {
        if (!this.$menu) return;

        var $menuItem = this.$menu.find('[data-jtour-step ="' + index + '"]');

        if (!$menuItem.length) return;

        var $currMenuItem = $menuItem.closest('li');
        var $activeMenuItem = this.$menu.find('li.active');

        this.$triggeredEl.trigger(this.events.menuBeforeSwitch, [this]);

        $activeMenuItem.removeClass('active');
        $currMenuItem.addClass('active');

        this.$triggeredEl.trigger(this.events.menuAfterSwitch, [this]);
      }
    }, {
      key: 'setupStepsPath',
      value: function setupStepsPath() {
        if (!this.startPage) {
          this.startPage = window.location.pathname;
        }

        var currPass = this.startPage;

        for (var i = 0; i < this.steps.length; i++) {
          var currStep = this.steps[i];

          if (currStep.path === currPass) {
            continue;
          } else if (!currStep.path) {
            currStep.path = currPass;
          } else {
            currPass = currStep.path;
          }
        }
      }

      /*not used*/

    }, {
      key: 'getTranslation',
      value: function getTranslation(el) {
        var translation = 0;

        if (el.hasAttribute('data-translation')) {
          translation = el.getAttribute('data-translation');
        } else if (this.steps[this.activeStepIndex].translationElementSelector) {
          $(this.steps[this.activeStepIndex].translationElementSelector).each(function () {
            translation += this.offsetHeight;
          });
          //translation = document.querySelector(this.translationElementSelector).offsetHeight;
        }

        return translation;
      }
    }, {
      key: 'getFirstIn',
      value: function getFirstIn(from) {
        var firstIn = -1;
        var steps = this.steps;

        if (typeof from === 'undefined') {
          from = 0;
        } else if (from < 0 || from > steps.length) {
          return firstIn;
        }

        for (var i = from; i < steps.length; i++) {
          if (!this.isSamePath(steps[i].path)) continue;

          firstIn = i;
          break;
        }

        return firstIn;
      }
    }]);

    return JTourController;
  }();

  var DefaultStep = {
    path: '',
    element: '',
    animateType: 'simple',
    tooltipPos: 'top',
    title: '',
    content: '',
    translationElementSelector: null,
    onBeforeStart: null,
    onAfterStart: null,
    onBeforeEnd: null,
    onAfterEnd: null,
    onElement: null // should pass object, arguments: event(string), function(function gets controller in e.data.tourController)
  };

  var DefaultTooltipOptions = {
    customContainerClass: 'js__jtooltip-s_white'
  };

  $.jTour = function (options) {
    var result = null;

    if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object' && $.isArray(options.steps)) {
      result = new JTourController(options);
    }

    return result;
  };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpzL2pUb3VyLmVzNi5qcyJdLCJuYW1lcyI6WyJmYWN0b3J5IiwiZGVmaW5lIiwiYW1kIiwiZXhwb3J0cyIsIm1vZHVsZSIsInJlcXVpcmUiLCJqUXVlcnkiLCIkIiwiSlRvdXJDb250cm9sbGVyIiwib3B0aW9ucyIsInVzZXJTdGVwcyIsInN0ZXBzIiwiYWN0aXZlU3RlcCIsImFjdGl2ZVN0ZXBJbmRleCIsInByZXZTdGVwSW5kZXgiLCJuYW1lIiwidGl0bGUiLCJ0cmFuc2xhdGlvbkVsZW1lbnRTZWxlY3RvciIsInRyYW5zbGF0aW9uU2VsZWN0b3IiLCJpc01lbnUiLCJtZW51Q29udGFpbmVyIiwiZG9jdW1lbnQiLCJib2R5IiwiYWRkTWVudU1ldGhvZCIsInJlbW92ZU1lbnVNZXRob2QiLCJ0cmlnZ2VyZWRFbCIsInBsYXllciIsImpQbGF5ZXIiLCJpc1NvdW5kIiwidHBsIiwiY29udGVudFdyYXBwZXIiLCJjb250ZW50IiwicHJldiIsIm5leHQiLCJlbmQiLCJyZXBsYXkiLCJvdmVybGF5IiwibWVudVRwbCIsIm1lbnVXcmFwcGVyIiwic291bmRCdG4iLCJjb250YWluZXIiLCJpdGVtIiwiaXRlbUFuY2hvciIsImV2ZW50cyIsInRvdXJTdGFydCIsInRvdXJTdG9wIiwidG91clJlc2V0IiwidG91ckdvTmV4dFBhZ2UiLCJ0b3VyT25OZXh0UGFnZVN0YXJ0Iiwic3RlcEJlZm9yZVN0YXJ0Iiwic3RlcEFmdGVyU3RhcnQiLCJzdGVwQmVmb3JlRW5kIiwic3RlcEFmdGVyRW5kIiwibWVudUJlZm9yZVN3aXRjaCIsIm1lbnVBZnRlclN3aXRjaCIsImNsYXNzIiwiY3VzdG9tVG9vbHRpcENsYXNzIiwidXNlclRvb2x0aXBPcHRpb25zIiwidG9vbHRpcE9wdGlvbnMiLCJpbml0IiwiX3Rvb2x0aXBDbGlja0hhbmRsZXIiLCJjb250ZW50Q2xpY2tIYW5kbGVyIiwiYmluZCIsIiR0cmlnZ2VyZWRFbCIsImV4dGVuZCIsIkRlZmF1bHRUb29sdGlwT3B0aW9ucyIsImkiLCJsZW5ndGgiLCJwdXNoIiwiRGVmYXVsdFN0ZXAiLCJ0b3VyRGF0YSIsImdldFRvdXJEYXRhIiwic3RhcnRQYWdlIiwic2V0dXBTdGVwc1BhdGgiLCJkZWxldGVUb3VyRGF0YSIsInN0YXJ0IiwidHJpZ2dlciIsImdvdG8iLCJpc1NhbWVQYXRoIiwicGF0aCIsIiRtZW51IiwiY3JlYXRlTWVudSIsInN3aXRjaE1lbnVJdGVtIiwicmVzZXQiLCJyZW1vdmVNZW51IiwiYW5pbWF0ZVR5cGUiLCJ1bmhpZ2hsaWdodEVsIiwiZWxlbWVudCIsInN0b3AiLCJyZW1vdmVUb29sdGlwIiwiY2xvc2VNb2RhbCIsImluZGV4IiwicnVuU3RlcCIsInB1dFRvdXJEYXRhIiwid2luZG93Iiwib3BlbiIsImxvY2F0aW9uIiwicGF0aG5hbWUiLCJzdGVwIiwiJHN0ZXBFbGVtZW50IiwiY2xlYW4iLCJnb3RvUGFnZSIsIm9uRWxlbWVudCIsImhhbmRsZXIiLCJvbiIsImV2ZW50IiwidG91ckNvbnRyb2xsZXIiLCJvcGVuTW9kYWwiLCJvbk1vZGFsQ2xvc2UiLCJ0aGVuIiwiYW5pbWF0ZVRvU3RlcCIsInBsYXlBdWRpbyIsImZpbGUiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsInNjcm9sbFRvIiwic2hvd1Rvb2x0aXAiLCJ0b29sdGlwUG9zIiwiY29uc29sZSIsImxvZyIsImVycm9yIiwiaGlnaGxpZ2h0RWwiLCJwcmV2U3RlcCIsIiRwcmV2U3RlcEVsZW1lbnQiLCJ0b29sdGlwIiwic2V0VGltZW91dCIsImhpZGVBbmltYXRpb25TcGVlZCIsIm9mZiIsImlzRW1wdHlQYXRoIiwibGFuZyIsImdldExhbmciLCJyZWciLCJSZWdFeHAiLCJjdXJyUGF0aCIsInJlcGxhY2UiLCJsb2NhbFBhdGgiLCJvYmpDbGFzcyIsImF0dHIiLCJzcGxpdCIsInBhdHRlcm4iLCJjbGFzc05hbWUiLCJwb3MiLCJpbmRleE9mIiwic2xpY2UiLCJlbCIsIiRlbCIsIiRvdmVybGF5IiwiY29tcHV0ZWRTdHlsZXMiLCJnZXRDb21wdXRlZFN0eWxlIiwiYmFja2dyb3VuZENvbG9yIiwiZ2V0UGFyZW50QmFja2dyb3VuZCIsImNzcyIsInBvc2l0aW9uIiwiekluZGV4IiwiYWZ0ZXIiLCJkaXNwbGF5IiwidG9wIiwibGVmdCIsInJpZ2h0IiwiYm90dG9tIiwiZmFkZUluIiwiZmFkZU91dCIsInJlbW92ZSIsImlzIiwiJHBhcmVudCIsInBhcmVudCIsInNlbGVjdG9yIiwidHJhbnNsYXRpb24iLCJ3aCIsImRvY3VtZW50RWxlbWVudCIsImNsaWVudEhlaWdodCIsImVsaCIsIm91dGVySGVpZ2h0IiwiY29vcmRzIiwic2Nyb2xsVG9wIiwiZ2V0Q29vcmRzIiwiYW5pbWF0ZSIsImR1cmF0aW9uIiwiY29tcGxldGUiLCJjb250cm9sUG9zIiwiJHdyYXBwZXIiLCIkdGl0bGUiLCJhcHBlbmQiLCIkY29udGVudCIsIiRwcmV2IiwiJG5leHQiLCIkZW5kIiwiJHJlcGxheSIsIiRjb250cm9scyIsImFkZENsYXNzIiwiZSIsIiR0YXJnZXQiLCJ0YXJnZXQiLCJoYXNDbGFzcyIsImpUb29sdGlwIiwiYmxvY2siLCJyZW5kZXJDb250ZW50IiwidG9vbHRpcFBvc2l0aW9uIiwiYWRkVG9vbHRpcCIsIm1hbnVhbCIsImRpc2FibGVPdmVybGF5SGFuZGxlciIsImRpc2FibGVDbG9zZUJ0bkhhbmRsZXIiLCJpc01vZGFsQWN0aXZlIiwiakJveCIsImNsb3NlIiwib25lIiwia2V5IiwiY2FjaGVkSnNvbk9wdGlvbiIsImNvb2tpZSIsImpzb24iLCJ2YWwiLCJvcHQiLCJyZW1vdmVDb29raWUiLCJwdXRDb29raWVzIiwiZ2V0Q29va2llcyIsImRlbGV0ZUNvb2tpZXMiLCJlbGVtIiwiYm94IiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwicGFnZVlPZmZzZXQiLCJwYWdlWE9mZnNldCIsInJlbmRlck1lbnUiLCJhZGRNZW51IiwiJHNvdW5kQnRuIiwiZmluZCIsIl9tZW51Q2xpY2tIYW5kbGVyIiwibWVudUNsaWNrSGFuZGxlciIsIiRtZW51V3JhcHBlciIsIiRtZW51Q29udGFpbmVyIiwiJGN1cnJNZW51SXRlbSIsImN1cnJTdGVwIiwiaXNNZW51U3RlcCIsIiRtZW51SXRlbSIsIiRtZW51QW5jaG9yIiwidGV4dCIsIm1lbnVUaXRsZSIsInByZXBlbmQiLCJjaGlsZHJlbiIsIm1lbnUiLCJwcmV2ZW50RGVmYXVsdCIsInRvZ2dsZVZvbHVtZSIsInNvdXJjZSIsInBsYXkiLCJjaGVja2VkIiwicmVtb3ZlQ2xhc3MiLCJwYXVzZSIsImNsb3Nlc3QiLCIkYWN0aXZlTWVudUl0ZW0iLCJjdXJyUGFzcyIsImhhc0F0dHJpYnV0ZSIsImdldEF0dHJpYnV0ZSIsImVhY2giLCJvZmZzZXRIZWlnaHQiLCJmcm9tIiwiZmlyc3RJbiIsIm9uQmVmb3JlU3RhcnQiLCJvbkFmdGVyU3RhcnQiLCJvbkJlZm9yZUVuZCIsIm9uQWZ0ZXJFbmQiLCJjdXN0b21Db250YWluZXJDbGFzcyIsImpUb3VyIiwicmVzdWx0IiwiaXNBcnJheSJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7O0FBRUMsV0FBVUEsT0FBVixFQUFtQjtBQUNsQixNQUFJLE9BQU9DLE1BQVAsS0FBa0IsVUFBbEIsSUFBZ0NBLE9BQU9DLEdBQTNDLEVBQWdEO0FBQzlDO0FBQ0FELFdBQU8sQ0FBQyxRQUFELENBQVAsRUFBbUJELE9BQW5CO0FBQ0QsR0FIRCxNQUdPLElBQUksUUFBT0csT0FBUCx5Q0FBT0EsT0FBUCxPQUFtQixRQUF2QixFQUFpQztBQUN0QztBQUNBQyxXQUFPRCxPQUFQLEdBQWlCSCxRQUFRSyxRQUFRLFFBQVIsQ0FBUixDQUFqQjtBQUNELEdBSE0sTUFHQTtBQUNMO0FBQ0FMLFlBQVFNLE1BQVI7QUFDRDtBQUNGLENBWEEsRUFXQyxVQUFVQyxDQUFWLEVBQWE7QUFBQSxNQUNQQyxlQURPO0FBRVgsNkJBQVlDLE9BQVosRUFBcUI7QUFBQTs7QUFDbkIsV0FBS0MsU0FBTCxHQUFpQkQsUUFBUUUsS0FBekI7QUFDQSxXQUFLQSxLQUFMLEdBQWEsRUFBYjtBQUNBLFdBQUtDLFVBQUwsR0FBa0IsSUFB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RSxNQUFNdUQsQ0FBTixFQUFTYSxJQUF6QixDQUFMLEVBQXFDOztBQUVyQ2dMLG9CQUFVN0wsQ0FBVjtBQUNBO0FBQ0Q7O0FBRUQsZUFBTzZMLE9BQVA7QUFDRDtBQWh3QlU7O0FBQUE7QUFBQTs7QUFtd0JiLE1BQU0xTCxjQUFjO0FBQ2xCVSxVQUFNLEVBRFk7QUFFbEJRLGFBQVMsRUFGUztBQUdsQkYsaUJBQWEsUUFISztBQUlsQmlDLGdCQUFZLEtBSk07QUFLbEJ0RyxXQUFPLEVBTFc7QUFNbEJlLGFBQVMsRUFOUztBQU9sQmQsZ0NBQTRCLElBUFY7QUFRbEIrTyxtQkFBZSxJQVJHO0FBU2xCQyxrQkFBYyxJQVRJO0FBVWxCQyxpQkFBYSxJQVZLO0FBV2xCQyxnQkFBWSxJQVhNO0FBWWxCN0osZUFBVyxJQVpPLENBWUY7QUFaRSxHQUFwQjs7QUFlQSxNQUFNckMsd0JBQXdCO0FBQzVCbU0sMEJBQXNCO0FBRE0sR0FBOUI7O0FBSUE3UCxJQUFFOFAsS0FBRixHQUFVLFVBQVU1UCxPQUFWLEVBQW1CO0FBQzNCLFFBQUk2UCxTQUFTLElBQWI7O0FBRUEsUUFBSSxRQUFPN1AsT0FBUCx5Q0FBT0EsT0FBUCxPQUFtQixRQUFuQixJQUErQkYsRUFBRWdRLE9BQUYsQ0FBVTlQLFFBQVFFLEtBQWxCLENBQW5DLEVBQTZEO0FBQzNEMlAsZUFBUyxJQUFJOVAsZUFBSixDQUFvQkMsT0FBcEIsQ0FBVDtBQUNEOztBQUVELFdBQU82UCxNQUFQO0FBQ0QsR0FSRDtBQVNELENBMXlCQSxDQUFEIiwiZmlsZSI6ImpzL2pUb3VyLmVzNi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uIChmYWN0b3J5KSB7XG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAvLyBBTUQgKFJlZ2lzdGVyIGFzIGFuIGFub255bW91cyBtb2R1bGUpXG4gICAgZGVmaW5lKFsnanF1ZXJ5J10sIGZhY3RvcnkpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuICAgIC8vIE5vZGUvQ29tbW9uSlNcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkocmVxdWlyZSgnanF1ZXJ5JykpO1xuICB9IGVsc2Uge1xuICAgIC8vIEJyb3dzZXIgZ2xvYmFsc1xuICAgIGZhY3RvcnkoalF1ZXJ5KTtcbiAgfVxufShmdW5jdGlvbiAoJCkge1xuICBjbGFzcyBKVG91ckNvbnRyb2xsZXIge1xuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICAgIHRoaXMudXNlclN0ZXBzID0gb3B0aW9ucy5zdGVwcztcbiAgICAgIHRoaXMuc3RlcHMgPSBbXTtcbiAgICAgIHRoaXMuYWN0aXZlU3RlcCA9IG51bGw7XG4gICAgICB0aGlzLmFjdGl2ZVN0ZXBJbmRleCA9IDA7XG4gICAgICB0aGlzLnByZXZTdGVwSW5kZXggPSAwO1xuICAgICAgdGhpcy5uYW1lID0gb3B0aW9ucy5uYW1lIHx8ICd0b3VyJztcbiAgICAgIHRoaXMudGl0bGUgPSBvcHRpb25zLnRpdGxlIHx8IHRoaXMubmFtZTtcbiAgICAgIHRoaXMudHJhbnNsYXRpb25FbGVtZW50U2VsZWN0b3IgPSBvcHRpb25zLnRyYW5zbGF0aW9uU2VsZWN0b3I7XG4gICAgICB0aGlzLmlzTWVudSA9IG9wdGlvbnMuaXNNZW51IHx8IGZhbHNlO1xuICAgICAgdGhpcy5tZW51Q29udGFpbmVyID0gb3B0aW9ucy5tZW51Q29udGFpbmVyIHx8IGRvY3VtZW50LmJvZHk7XG4gICAgICB0aGlzLmFkZE1lbnVNZXRob2QgPSBvcHRpb25zLmFkZE1lbnVNZXRob2QgfHwgbnVsbDtcbiAgICAgIHRoaXMucmVtb3ZlTWVudU1ldGhvZCA9IG9wdGlvbnMucmVtb3ZlTWVudU1ldGhvZCB8fCBudWxsO1xuICAgICAgdGhpcy50cmlnZ2VyZWRFbCA9IG9wdGlvbnMudHJpZ2dlcmVkRWwgfHwgZG9jdW1lbnQuYm9keTtcbiAgICAgIHRoaXMucGxheWVyID0gJC5qUGxheWVyO1xuICAgICAgdGhpcy5pc1NvdW5kID0gb3B0aW9ucy5pc1NvdW5kIHx8IHRydWU7XG4gICAgICB0aGlzLnRwbCA9IHtcbiAgICAgICAgY29udGVudFdyYXBwZXI6ICc8ZGl2IGNsYXNzPVwidG9vdGlwLWNvbnRlbnQtd3JhcHBlclwiPjwvZGl2PicsXG4gICAgICAgIHRpdGxlOiAnPGRpdiBjbGFzcz1cInRvb2x0aXAtdGl0bGUgcHYxMCBtYjEwIGJpZyBib2xkIHRfYmx1ZVwiPjwvZGl2PicsXG4gICAgICAgIGNvbnRlbnQ6ICc8ZGl2IGNsYXNzPVwidG9vbHRpcC1tZXNzYWdlIG1iMjBcIj48L2Rpdj4nLFxuICAgICAgICBwcmV2OiAnPGJ1dHRvbiBjbGFzcz1cInRvb2x0aXAtYnRuIHRvb2x0aXAtYnRuX2JhY2sgYnRuIHNtYWxsIHNpbXBsZVwiIGRhdGEtcm9sZT1cInByZXZcIj7QvdCw0LfQsNC0PC9idXR0b24+JyxcbiAgICAgICAgbmV4dDogJzxidXR0b24gY2xhc3M9XCJ0b29sdGlwLWJ0biB0b29sdGlwLWJ0bl9uZXh0IGJ0biBzbWFsbCBzaW1wbGVcIiBkYXRhLXJvbGU9XCJuZXh0XCI+0LLQv9C10YDQtdC0PC9idXR0b24+JyxcbiAgICAgICAgZW5kOiAnPGJ1dHRvbiBjbGFzcz1cInRvb2x0aXAtYnRuIGJ0biBzbWFsbCBzaW1wbGVcIiBkYXRhLXJvbGU9XCJlbmRcIj7Qt9Cw0LLQtdGA0YjQuNGC0Yw8L2J1dHRvbj4nLFxuICAgICAgICByZXBsYXk6ICc8ZGl2IGNsYXNzPVwidG9vbHRpcC1yZXBsYXlcIiBkYXRhLXJvbGU9XCJyZXBsYXlcIj48L2Rpdj4nLFxuICAgICAgICBvdmVybGF5OiAnPGRpdiBjbGFzcz1cInRvdXItb3ZlcmxheVwiPjwvZGl2PidcbiAgICAgIH07XG4gICAgICB0aGlzLm1lbnVUcGwgPSB7XG4gICAgICAgIG1lbnVXcmFwcGVyOlxuICAgICAgICAnPGRpdiBjbGFzcz1cInRvdXItbWVudS13cmFwcGVyXCI+JyArXG4gICAgICAgICc8ZGl2IGNsYXNzPVwidG91ci10aXRsZVwiPtCd0LDRgdGC0YDQvtC50LrQsCDRgdC40YHRgtC10LzRizwvZGl2PicgK1xuICAgICAgICAnPC9kaXY+JyxcbiAgICAgICAgc291bmRCdG46XG4gICAgICAgICc8ZGl2PicgK1xuICAgICAgICAnPGlucHV0IGlkPVwidG91ci1zb3VuZFwiIHR5cGU9XCJjaGVja2JveFwiPicgK1xuICAgICAgICAnPGxhYmVsIGNsYXNzPVwic3BlYWtlclwiIGZvcj1cInRvdXItc291bmRcIj48L2xhYmVsPicgK1xuICAgICAgICAnPC9kaXY+JyxcbiAgICAgICAgY29udGFpbmVyOiAnPG9sIGNsYXNzPVwidG91ci1tZW51IG1hcmtlciBibHVlXCI+PC9vbD4nLFxuICAgICAgICBpdGVtOiAnPGxpPjwvbGk+JyxcbiAgICAgICAgaXRlbUFuY2hvcjogJzxhIGhyZWY9XCIjXCIgPjwvYT4nXG4gICAgICB9O1xuICAgICAgdGhpcy5ldmVudHMgPSB7XG4gICAgICAgIHRvdXJTdGFydDogJ2pUb3VyOnRvdXJTdGFydCcsXG4gICAgICAgIHRvdXJTdG9wOiAnalRvdXI6dG91clN0b3AnLFxuICAgICAgICB0b3VyUmVzZXQ6ICdqVG91cjp0b3VyUmVzZXQnLFxuICAgICAgICB0b3VyR29OZXh0UGFnZTogJ2pUb3VyOnRvdXJHb05leHRQYWdlJyxcbiAgICAgICAgdG91ck9uTmV4dFBhZ2VTdGFydDogJ2pUb3VyOnRvdXJPbk5leHRQYWdlU3RhcnQnLFxuICAgICAgICBzdGVwQmVmb3JlU3RhcnQ6ICdqVG91cjpzdGVwQmVmb3JlU3RhcnQnLFxuICAgICAgICBzdGVwQWZ0ZXJTdGFydDogJ2pUb3VyOnN0ZXBBZnRlclN0YXJ0JyxcbiAgICAgICAgc3RlcEJlZm9yZUVuZDogJ2pUb3VyOnN0ZXBCZWZvcmVFbmQnLFxuICAgICAgICBzdGVwQWZ0ZXJFbmQ6ICdqVG91cjpzdGVwQWZ0ZXJFbmQnLFxuICAgICAgICBtZW51QmVmb3JlU3dpdGNoOiAnalRvdXI6bWVudUJlZm9yZVN3aXRjaCcsXG4gICAgICAgIG1lbnVBZnRlclN3aXRjaDogJ2pUb3VyOm1lbnVBZnRlclN3aXRjaCdcbiAgICAgIH07XG4gICAgICB0aGlzLmNsYXNzID0ge1xuICAgICAgICBjdXN0b21Ub29sdGlwQ2xhc3M6ICdqc19fanRvb2x0aXAtc19ncmV5J1xuICAgICAgfTtcbiAgICAgIHRoaXMudXNlclRvb2x0aXBPcHRpb25zID0gb3B0aW9ucy50b29sdGlwT3B0aW9ucyB8fCB7fTtcblxuXG4gICAgICB0aGlzLmluaXQoKTtcbiAgICB9XG5cbiAgICBpbml0KCkge1xuICAgICAgdGhpcy5fdG9vbHRpcENsaWNrSGFuZGxlciA9IHRoaXMuY29udGVudENsaWNrSGFuZGxlci5iaW5kKHRoaXMpO1xuICAgICAgdGhpcy4kdHJpZ2dlcmVkRWwgPSAkKHRoaXMudHJpZ2dlcmVkRWwpO1xuICAgICAgdGhpcy50b29sdGlwT3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBEZWZhdWx0VG9vbHRpcE9wdGlvbnMsIHRoaXMudXNlclRvb2x0aXBPcHRpb25zKTtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnVzZXJTdGVwcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB0aGlzLnN0ZXBzLnB1c2goJC5leHRlbmQodHJ1ZSwge30sIERlZmF1bHRTdGVwLCB0aGlzLnVzZXJTdGVwc1tpXSkpO1xuICAgICAgfVxuXG4gICAgICBsZXQgdG91ckRhdGEgPSB0aGlzLmdldFRvdXJEYXRhKCk7XG5cblxuICAgICAgaWYgKHRvdXJEYXRhKSB7XG4gICAgICAgIHRoaXMuc3RhcnRQYWdlID0gdG91ckRhdGEuc3RhcnRQYWdlO1xuICAgICAgICB0aGlzLnNldHVwU3RlcHNQYXRoKCk7XG4gICAgICAgIHRoaXMuYWN0aXZlU3RlcEluZGV4ID0gdG91ckRhdGEuYWN0aXZlU3RlcEluZGV4O1xuICAgICAgICB0aGlzLmFjdGl2ZVN0ZXAgPSB0aGlzLnN0ZXBzW3RvdXJEYXRhLmFjdGl2ZVN0ZXBJbmRleF07XG4gICAgICAgIHRoaXMuaXNTb3VuZCA9IHRvdXJEYXRhLmlzU291bmQ7XG4gICAgICAgIHRoaXMuZGVsZXRlVG91ckRhdGEoKTtcbiAgICAgICAgdGhpcy5zdGFydCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5hY3RpdmVTdGVwSW5kZXggPSAwO1xuICAgICAgICB0aGlzLmFjdGl2ZVN0ZXAgPSB0aGlzLnN0ZXBzWzBdO1xuICAgICAgICB0aGlzLnNldHVwU3RlcHNQYXRoKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgc3RhcnQoKSB7XG4gICAgICB0aGlzLiR0cmlnZ2VyZWRFbC50cmlnZ2VyKHRoaXMuZXZlbnRzLnRvdXJTdGFydCwgW3RoaXNdKTtcbiAgICAgIHRoaXMuZ290byh0aGlzLmFjdGl2ZVN0ZXBJbmRleCk7XG5cbiAgICAgIGlmICh0aGlzLmlzU2FtZVBhdGgodGhpcy5hY3RpdmVTdGVwLnBhdGgpKSB7XG4gICAgICAgIGlmICh0aGlzLmlzTWVudSAmJiAhdGhpcy4kbWVudSkge1xuICAgICAgICAgIHRoaXMuY3JlYXRlTWVudSgpO1xuICAgICAgICAgIHRoaXMuc3dpdGNoTWVudUl0ZW0odGhpcy5hY3RpdmVTdGVwSW5kZXgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgc3RvcCgpIHtcbiAgICAgIHRoaXMuJHRyaWdnZXJlZEVsLnRyaWdnZXIodGhpcy5ldmVudHMudG91clN0b3AsIFt0aGlzXSk7XG5cbiAgICAgIHRoaXMucmVzZXQoKTtcbiAgICAgIHRoaXMucmVtb3ZlTWVudSgpO1xuICAgIH1cblxuICAgIHJlc2V0KCkge1xuICAgICAgdGhpcy4kdHJpZ2dlcmVkRWwudHJpZ2dlcih0aGlzLmV2ZW50cy50b3VyUmVzZXQsIFt0aGlzXSk7XG5cbiAgICAgIGlmICh0aGlzLmFjdGl2ZVN0ZXAuYW5pbWF0ZVR5cGUgPT09ICdoaWdobGlnaHQnKSB7XG4gICAgICAgIHRoaXMudW5oaWdobGlnaHRFbCh0aGlzLmFjdGl2ZVN0ZXAuZWxlbWVudCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMucGxheWVyLnN0b3AoKTtcbiAgICAgIHRoaXMucmVtb3ZlVG9vbHRpcCgpO1xuICAgICAgdGhpcy5jbG9zZU1vZGFsKCk7XG4gICAgICB0aGlzLmFjdGl2ZVN0ZXBJbmRleCA9IDA7XG4gICAgICB0aGlzLmFjdGl2ZVN0ZXAgPSB0aGlzLnN0ZXBzWzBdO1xuICAgIH1cblxuICAgIGdvdG8oaW5kZXgpIHtcbiAgICAgIGlmIChpbmRleCA8IDAgfHwgaW5kZXggPj0gdGhpcy5zdGVwcy5sZW5ndGgpIHJldHVybjtcblxuICAgICAgdGhpcy5wcmV2U3RlcEluZGV4ID0gdGhpcy5hY3RpdmVTdGVwSW5kZXg7XG4gICAgICB0aGlzLmFjdGl2ZVN0ZXAgPSB0aGlzLnN0ZXBzW2luZGV4XTtcbiAgICAgIHRoaXMuYWN0aXZlU3RlcEluZGV4ID0gaW5kZXg7XG5cbiAgICAgIHRoaXMucnVuU3RlcCh0aGlzLmFjdGl2ZVN0ZXApO1xuICAgIH1cblxuICAgIGdvdG9QYWdlKHBhdGgpIHtcbiAgICAgIHRoaXMuJHRyaWdnZXJlZEVsLnRyaWdnZXIodGhpcy5ldmVudHMudG91ckdvTmV4dFBhZ2UsIFtwYXRoLCB0aGlzXSk7XG4gICAgICB0aGlzLnB1dFRvdXJEYXRhKHBhdGgpO1xuICAgICAgd2luZG93Lm9wZW4ocGF0aCwgJ19zZWxmJyk7XG4gICAgfVxuXG4gICAgYmluZE5leHRTdGVwKGluZGV4KSB7XG4gICAgICBsZXQgcGF0aCA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTtcbiAgICAgIGluZGV4ID0gaW5kZXggfHwgMTtcblxuICAgICAgaWYgKHRoaXMuYWN0aXZlU3RlcEluZGV4ICsgaW5kZXggPj0gdGhpcy5zdGVwcy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnByZXZTdGVwSW5kZXggKz0gaW5kZXggLSAxO1xuICAgICAgdGhpcy5hY3RpdmVTdGVwSW5kZXggKz0gaW5kZXg7XG4gICAgICB0aGlzLmFjdGl2ZVN0ZXAgPSB0aGlzLnN0ZXBzW3RoaXMuYWN0aXZlU3RlcEluZGV4XTtcblxuICAgICAgdGhpcy4kdHJpZ2dlcmVkRWwudHJpZ2dlcih0aGlzLmV2ZW50cy50b3VyR29OZXh0UGFnZSwgW3BhdGgsIHRoaXNdKTtcbiAgICAgIHRoaXMucHV0VG91ckRhdGEocGF0aCk7XG4gICAgfVxuXG4gICAgcnVuU3RlcChzdGVwKSB7XG4gICAgICBsZXQgJHN0ZXBFbGVtZW50ID0gJChzdGVwLmVsZW1lbnQpO1xuXG4gICAgICB0aGlzLmNsZWFuKCk7XG5cbiAgICAgIGlmICghdGhpcy5pc1NhbWVQYXRoKHN0ZXAucGF0aCwgdHJ1ZSkpIHtcbiAgICAgICAgdGhpcy5nb3RvUGFnZShzdGVwLnBhdGgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChzdGVwLm9uRWxlbWVudFxuICAgICAgICAmJiBzdGVwLm9uRWxlbWVudC5oYW5kbGVyXG4gICAgICAgICYmIHR5cGVvZiBzdGVwLm9uRWxlbWVudC5oYW5kbGVyID09PSAnZnVuY3Rpb24nKSB7XG5cbiAgICAgICAgJHN0ZXBFbGVtZW50Lm9uKHN0ZXAub25FbGVtZW50LmV2ZW50LCB7dG91ckNvbnRyb2xsZXI6IHRoaXN9LCBzdGVwLm9uRWxlbWVudC5oYW5kbGVyKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy4kdHJpZ2dlcmVkRWwudHJpZ2dlcih0aGlzLmV2ZW50cy5zdGVwQmVmb3JlU3RhcnQsIFtzdGVwLCB0aGlzXSk7XG4gICAgICB0aGlzLm9wZW5Nb2RhbChzdGVwKTtcblxuICAgICAgaWYgKCRzdGVwRWxlbWVudC5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy5vbk1vZGFsQ2xvc2UoKVxuICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmFuaW1hdGVUb1N0ZXAoc3RlcCk7XG4gICAgICAgICAgfSlcbiAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBsYXlBdWRpbyhzdGVwLmZpbGUpO1xuICAgICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5wbGF5QXVkaW8oc3RlcC5maWxlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBhbmltYXRlVG9TdGVwKHN0ZXApIHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIHN3aXRjaCAoc3RlcC5hbmltYXRlVHlwZSkge1xuICAgICAgICAgIGNhc2UgJ3NpbXBsZScgOlxuICAgICAgICAgICAgdGhpcy5zY3JvbGxUbyhzdGVwLmVsZW1lbnQpXG4gICAgICAgICAgICAgIC50aGVuKFxuICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgIHRoaXMuc2hvd1Rvb2x0aXAoc3RlcC5lbGVtZW50LCBzdGVwLmNvbnRlbnQsIHN0ZXAudGl0bGUsIHN0ZXAudG9vbHRpcFBvcyk7XG4gICAgICAgICAgICAgICAgICB0aGlzLiR0cmlnZ2VyZWRFbC50cmlnZ2VyKHRoaXMuZXZlbnRzLnN0ZXBBZnRlclN0YXJ0LCBbc3RlcCwgdGhpc10pO1xuXG4gICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ2hpZ2hsaWdodCcgOlxuICAgICAgICAgICAgdGhpcy5zY3JvbGxUbyhzdGVwLmVsZW1lbnQpXG4gICAgICAgICAgICAgIC50aGVuKFxuICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgIHRoaXMuc2hvd1Rvb2x0aXAoc3RlcC5lbGVtZW50LCBzdGVwLmNvbnRlbnQsIHN0ZXAudGl0bGUsIHN0ZXAudG9vbHRpcFBvcyk7XG4gICAgICAgICAgICAgICAgICB0aGlzLmhpZ2hsaWdodEVsKHN0ZXAuZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICB0aGlzLiR0cmlnZ2VyZWRFbC50cmlnZ2VyKHRoaXMuZXZlbnRzLnN0ZXBBZnRlclN0YXJ0LCBbc3RlcCwgdGhpc10pO1xuXG4gICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBjbGVhbigpIHtcbiAgICAgIGxldCBwcmV2U3RlcCA9IHRoaXMuc3RlcHNbdGhpcy5wcmV2U3RlcEluZGV4XTtcbiAgICAgIGxldCAkcHJldlN0ZXBFbGVtZW50ID0gJChwcmV2U3RlcC5lbGVtZW50KTtcblxuICAgICAgaWYgKHRoaXMudG9vbHRpcCkge1xuICAgICAgICB0aGlzLiR0cmlnZ2VyZWRFbC50cmlnZ2VyKHRoaXMuZXZlbnRzLnN0ZXBCZWZvcmVFbmQsIFtwcmV2U3RlcCwgdGhpc10pO1xuICAgICAgICB0aGlzLnJlbW92ZVRvb2x0aXAoKTtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdGhpcy4kdHJpZ2dlcmVkRWwudHJpZ2dlcih0aGlzLmV2ZW50cy5zdGVwQWZ0ZXJFbmQsIFtwcmV2U3RlcCwgdGhpc10pO1xuICAgICAgICB9LmJpbmQodGhpcyksIHRoaXMudG9vbHRpcC5oaWRlQW5pbWF0aW9uU3BlZWQpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmNsb3NlTW9kYWwoKTtcblxuICAgICAgaWYgKCFwcmV2U3RlcCkgcmV0dXJuO1xuXG4gICAgICBpZiAocHJldlN0ZXAuYW5pbWF0ZVR5cGUgPT09ICdoaWdobGlnaHQnKSB7XG4gICAgICAgIHRoaXMudW5oaWdobGlnaHRFbChwcmV2U3RlcC5lbGVtZW50KTtcbiAgICAgIH1cblxuICAgICAgaWYgKHByZXZTdGVwLm9uRWxlbWVudFxuICAgICAgICAmJiB0eXBlb2YgcHJldlN0ZXAub25FbGVtZW50LmhhbmRsZXIgPT09ICdmdW5jdGlvbicpIHtcblxuICAgICAgICAkcHJldlN0ZXBFbGVtZW50Lm9mZihwcmV2U3RlcC5vbkVsZW1lbnQuZXZlbnQsIHByZXZTdGVwLm9uRWxlbWVudC5oYW5kbGVyKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpc1NhbWVQYXRoKHBhdGgsIGlzRW1wdHlQYXRoKSB7XG4gICAgICBjb25zdCBsYW5nID0gdGhpcy5nZXRMYW5nKCk7XG4gICAgICBjb25zdCByZWcgPSBsYW5nID8gbmV3IFJlZ0V4cChgLyR7bGFuZ30vYCwgJ2cnKSA6IG51bGw7XG4gICAgICBjb25zdCBjdXJyUGF0aCA9IHBhdGgucmVwbGFjZShyZWcsICcvJyk7XG4gICAgICBjb25zdCBsb2NhbFBhdGggPSAgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLnJlcGxhY2UocmVnLCAnLycpO1xuXG4gICAgICBpZiAoY3VyclBhdGggPT09IGxvY2FsUGF0aCB8fCAoY3VyclBhdGggPT09ICcnICYmIGlzRW1wdHlQYXRoKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBnZXRMYW5nKCkge1xuICAgICAgY29uc3Qgb2JqQ2xhc3MgPSAkKCdib2R5JykuYXR0cignY2xhc3MnKS5zcGxpdCgvXFxzKy8pO1xuICAgICAgY29uc3QgcGF0dGVybiA9ICdpMThuLSc7XG5cbiAgICAgIGZvciAoY29uc3QgY2xhc3NOYW1lIG9mIG9iakNsYXNzKSB7XG4gICAgICAgIGNvbnN0IHBvcyA9IGNsYXNzTmFtZSAuaW5kZXhPZignaTE4bi0nKTtcbiAgICAgICAgaWYgKHBvcyA9PT0gLTEpIGNvbnRpbnVlO1xuXG4gICAgICAgIHJldHVybiBjbGFzc05hbWUgLnNsaWNlKHBvcyArIHBhdHRlcm4ubGVuZ3RoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgaGlnaGxpZ2h0RWwoZWwpIHtcbiAgICAgIGxldCAkZWwgPSAkKGVsKTtcblxuICAgICAgaWYgKCEkZWwubGVuZ3RoKSByZXR1cm47XG5cbiAgICAgIGxldCAkb3ZlcmxheSA9IHRoaXMuJG92ZXJsYXkgPSB0aGlzLiRvdmVybGF5IHx8ICQodGhpcy50cGwub3ZlcmxheSk7XG4gICAgICBsZXQgY29tcHV0ZWRTdHlsZXMgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSgkZWxbMF0pO1xuICAgICAgbGV0IGJhY2tncm91bmRDb2xvciA9ICcnO1xuXG4gICAgICBpZiAoY29tcHV0ZWRTdHlsZXMuYmFja2dyb3VuZENvbG9yID09PSAncmdiYSgwLCAwLCAwLCAwKScpIHtcbiAgICAgICAgYmFja2dyb3VuZENvbG9yID0gdGhpcy5nZXRQYXJlbnRCYWNrZ3JvdW5kKCRlbCk7XG4gICAgICB9XG5cbiAgICAgICRlbFxuICAgICAgICAuY3NzKHtcbiAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICAgICAgICB6SW5kZXg6ICc5NTAwJyxcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IGJhY2tncm91bmRDb2xvclxuICAgICAgICB9KVxuICAgICAgICAuYWZ0ZXIoJG92ZXJsYXkpO1xuXG4gICAgICAkb3ZlcmxheVxuICAgICAgICAuY3NzKHtcbiAgICAgICAgICBkaXNwbGF5OiAnbm9uZScsXG4gICAgICAgICAgcG9zaXRpb246ICdmaXhlZCcsXG4gICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgcmlnaHQ6IDAsXG4gICAgICAgICAgYm90dG9tOiAwLFxuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJ3JnYmEoMCwgMCwgMCwgMC44KScsXG4gICAgICAgICAgekluZGV4OiAnOTAwMCdcbiAgICAgICAgfSlcbiAgICAgICAgLmZhZGVJbig0MDApO1xuXG4gICAgfVxuXG4gICAgdW5oaWdobGlnaHRFbChlbCkge1xuICAgICAgbGV0ICRlbCA9ICQoZWwpO1xuXG4gICAgICBpZiAoISRlbC5sZW5ndGgpIHJldHVybjtcblxuICAgICAgbGV0ICRvdmVybGF5ID0gdGhpcy4kb3ZlcmxheSA9IHRoaXMuJG92ZXJsYXkgfHwgJCh0aGlzLnRwbC5vdmVybGF5KTtcblxuICAgICAgJG92ZXJsYXkuZmFkZU91dCg0MDAsICgpID0+IHtcbiAgICAgICAgJG92ZXJsYXkucmVtb3ZlKCk7XG4gICAgICAgICRlbC5jc3Moe1xuICAgICAgICAgIHBvc2l0aW9uOiAnJyxcbiAgICAgICAgICB6SW5kZXg6ICcnLFxuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJydcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBnZXRQYXJlbnRCYWNrZ3JvdW5kKGVsKSB7XG4gICAgICBpZiAoJChlbCkuaXMoJ2JvZHknKSkgcmV0dXJuICcjZmZmJztcblxuICAgICAgbGV0ICRwYXJlbnQgPSAkKGVsKS5wYXJlbnQoKTtcbiAgICAgIGxldCBiYWNrZ3JvdW5kQ29sb3IgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSgkcGFyZW50WzBdKS5iYWNrZ3JvdW5kQ29sb3I7XG5cbiAgICAgIGlmIChiYWNrZ3JvdW5kQ29sb3IgPT09ICdyZ2JhKDAsIDAsIDAsIDApJykge1xuICAgICAgICBiYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLmdldFBhcmVudEJhY2tncm91bmQoJHBhcmVudCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBiYWNrZ3JvdW5kQ29sb3I7XG4gICAgfVxuXG4gICAgc2Nyb2xsVG8oc2VsZWN0b3IsIHRyYW5zbGF0aW9uKSB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBsZXQgd2ggPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0O1xuICAgICAgICBsZXQgJGVsID0gJChzZWxlY3Rvcik7XG4gICAgICAgIGxldCBlbGggPSAkZWwub3V0ZXJIZWlnaHQoKTtcbiAgICAgICAgbGV0IGNvb3JkcyA9IHt9O1xuICAgICAgICBsZXQgc2Nyb2xsVG9wID0gMDtcblxuICAgICAgICBpZiAoJGVsLmxlbmd0aCkge1xuICAgICAgICAgIGNvb3JkcyA9IHRoaXMuZ2V0Q29vcmRzKCRlbFswXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVqZWN0KCdubyBzdWNoIGVsZW1lbnQnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh3aCA+IGVsaCkge1xuICAgICAgICAgIHNjcm9sbFRvcCA9IGNvb3Jkcy50b3AgLSAod2ggLSBlbGgpIC8gMjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzY3JvbGxUb3AgPSBjb29yZHMudG9wO1xuICAgICAgICB9XG5cbiAgICAgICAgJChcImh0bWwsIGJvZHlcIikuYW5pbWF0ZSh7XG4gICAgICAgICAgICBzY3JvbGxUb3A6IHNjcm9sbFRvcCAtICh0cmFuc2xhdGlvbiB8fCAwKSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGR1cmF0aW9uOiA1MDAsXG4gICAgICAgICAgICBjb21wbGV0ZTogcmVzb2x2ZVxuICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJlbmRlckNvbnRlbnQoY29udGVudCwgdGl0bGUsIGNvbnRyb2xQb3MpIHtcbiAgICAgIC8vVE9ETyDQv9C10YDQtdC/0LjRgdCw0YLRjCDRgNC10L3QtNC10YAg0Lgg0YXQtdC90LTQu9C10YAg0YEg0LjRgdC/0L7Qu9GM0LfQvtCy0LDQvdC40LXQvCDQutC70LDRgdGB0L7Qsiwg0LHQtdC3INC40YHQv9C+0LvRjNC30L7QstCw0L3QuNGPINGN0LvQtdC80LXQvdGC0L7QsiDQtNC70Y8g0YHRgNCw0LLQvdC10L3QuNGPXG4gICAgICB0aGlzLmNvbnRlbnQgPSB7fTtcbiAgICAgIGxldCAkd3JhcHBlciA9IHRoaXMuY29udGVudC4kd3JhcHBlciA9ICQodGhpcy50cGwuY29udGVudFdyYXBwZXIpO1xuICAgICAgbGV0ICR0aXRsZSA9IHRpdGxlID8gJCh0aGlzLnRwbC50aXRsZSkuYXBwZW5kKHRpdGxlKSA6ICcnO1xuICAgICAgbGV0ICRjb250ZW50ID0gY29udGVudCA/ICQodGhpcy50cGwuY29udGVudCkuYXBwZW5kKGNvbnRlbnQpIDogJyc7XG4gICAgICBsZXQgJHByZXYgPSB0aGlzLmNvbnRlbnQuJHByZXYgPSAkKHRoaXMudHBsLnByZXYpO1xuICAgICAgbGV0ICRuZXh0ID0gdGhpcy5jb250ZW50LiRuZXh0ID0gJCh0aGlzLnRwbC5uZXh0KTtcbiAgICAgIGxldCAkZW5kID0gdGhpcy5jb250ZW50LiRlbmQgPSAkKHRoaXMudHBsLmVuZCk7XG4gICAgICBsZXQgJHJlcGxheSA9IHRoaXMuY29udGVudC4kcmVwbGF5ID0gJCh0aGlzLnRwbC5yZXBsYXkpO1xuICAgICAgbGV0ICRjb250cm9scyA9ICQoJzxkaXYgY2xhc3M9XCJtYjIwXCI+PC9kaXY+JylcbiAgICAgIGNvbnRyb2xQb3MgPSBjb250cm9sUG9zIHx8ICdib3R0b20nO1xuXG4gICAgICAkY29udHJvbHNcbiAgICAgICAgLmFwcGVuZCgkcHJldilcbiAgICAgICAgLmFwcGVuZCgkbmV4dClcbiAgICAgICAgLmFwcGVuZCgkZW5kKTtcblxuICAgICAgaWYgKHRoaXMuYWN0aXZlU3RlcEluZGV4ID09PSAwKSB7XG4gICAgICAgICRwcmV2XG4gICAgICAgICAgLmFkZENsYXNzKCdkaXNhYmxlZCcpXG4gICAgICAgICAgLmF0dHIoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmFjdGl2ZVN0ZXBJbmRleCA9PT0gdGhpcy5zdGVwcy5sZW5ndGggLSAxKSB7XG4gICAgICAgICRuZXh0XG4gICAgICAgICAgLmFkZENsYXNzKCdkaXNhYmxlZCcpXG4gICAgICAgICAgLmF0dHIoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmFjdGl2ZVN0ZXAuZmlsZSkge1xuICAgICAgICBpZiAoIXRoaXMuaXNTb3VuZCkge1xuICAgICAgICAgICRyZXBsYXlcbiAgICAgICAgICAgIC5hZGRDbGFzcygnZGlzYWJsZWQnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb250cm9sUG9zID09PSAnYm90dG9tJykge1xuICAgICAgICAgICR3cmFwcGVyLmFwcGVuZCgkcmVwbGF5KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAkY29udHJvbHMuYXBwZW5kKCRyZXBsYXkpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChjb250cm9sUG9zID09PSAnYm90dG9tJykge1xuICAgICAgICAkd3JhcHBlclxuICAgICAgICAgIC5hcHBlbmQoJHRpdGxlKVxuICAgICAgICAgIC5hcHBlbmQoJGNvbnRlbnQpXG4gICAgICAgICAgLmFwcGVuZCgkY29udHJvbHMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJHdyYXBwZXJcbiAgICAgICAgICAuYXBwZW5kKCRjb250cm9scylcbiAgICAgICAgICAuYXBwZW5kKCR0aXRsZSlcbiAgICAgICAgICAuYXBwZW5kKCRjb250ZW50KTtcbiAgICAgIH1cblxuICAgICAgJHdyYXBwZXIub24oJ2NsaWNrJywgdGhpcy5fdG9vbHRpcENsaWNrSGFuZGxlcik7XG5cbiAgICAgIHJldHVybiAkd3JhcHBlcjtcbiAgICB9XG5cbiAgICBjb250ZW50Q2xpY2tIYW5kbGVyKGUpIHtcbiAgICAgIGxldCAkdGFyZ2V0ID0gJChlLnRhcmdldCk7XG5cbiAgICAgIGlmICgkdGFyZ2V0LmlzKHRoaXMuY29udGVudC4kcHJldikpIHtcbiAgICAgICAgdGhpcy5zd2l0Y2hNZW51SXRlbSh0aGlzLmFjdGl2ZVN0ZXBJbmRleCAtIDEpO1xuICAgICAgICB0aGlzLmdvdG8odGhpcy5hY3RpdmVTdGVwSW5kZXggLSAxKTtcbiAgICAgIH0gZWxzZSBpZiAoJHRhcmdldC5pcyh0aGlzLmNvbnRlbnQuJG5leHQpKSB7XG4gICAgICAgIHRoaXMuc3dpdGNoTWVudUl0ZW0odGhpcy5hY3RpdmVTdGVwSW5kZXggKyAxKTtcbiAgICAgICAgdGhpcy5nb3RvKHRoaXMuYWN0aXZlU3RlcEluZGV4ICsgMSk7XG4gICAgICB9IGVsc2UgaWYgKCR0YXJnZXQuaXModGhpcy5jb250ZW50LiRlbmQpKSB7XG4gICAgICAgIHRoaXMuc3RvcCgpO1xuICAgICAgfSBlbHNlIGlmICgkdGFyZ2V0LmlzKHRoaXMuY29udGVudC4kcmVwbGF5KSAmJiAhJHRhcmdldC5oYXNDbGFzcygnZGlzYWJsZWQnKSkge1xuICAgICAgICB0aGlzLnBsYXlBdWRpbygpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHNob3dUb29sdGlwKGVsLCBjb250ZW50LCB0aXRsZSwgcG9zKSB7XG4gICAgICBsZXQgdG9vbHRpcCA9IHRoaXMudG9vbHRpcDtcblxuICAgICAgaWYgKCF0b29sdGlwKSB7XG4gICAgICAgIHRvb2x0aXAgPSB0aGlzLnRvb2x0aXAgPSAkKGVsKS5qVG9vbHRpcCh0aGlzLnRvb2x0aXBPcHRpb25zKS5qVG9vbHRpcCgnZ2V0U2VsZicpO1xuXG4gICAgICAgIHRvb2x0aXAuc3RvcCgpO1xuICAgICAgfVxuXG4gICAgICB0b29sdGlwLmJsb2NrID0gJChlbClbMF07XG4gICAgICB0b29sdGlwLmNvbnRlbnQgPSB0aGlzLnJlbmRlckNvbnRlbnQoY29udGVudCwgdGl0bGUpO1xuICAgICAgdG9vbHRpcC50b29sdGlwUG9zaXRpb24gPSBwb3M7XG4gICAgICB0b29sdGlwLmFkZFRvb2x0aXAoKTtcbiAgICB9XG5cbiAgICByZW1vdmVUb29sdGlwKCkge1xuICAgICAgaWYgKCF0aGlzLnRvb2x0aXApIHJldHVybjtcblxuICAgICAgaWYgKHRoaXMuY29udGVudCAmJiB0aGlzLmNvbnRlbnQuJHdyYXBwZXIpIHtcbiAgICAgICAgdGhpcy5jb250ZW50LiR3cmFwcGVyLm9mZigpO1xuICAgICAgfVxuICAgICAgdGhpcy5jb250ZW50ID0ge307XG4gICAgICB0aGlzLnRvb2x0aXAucmVtb3ZlVG9vbHRpcCgpO1xuICAgIH1cblxuICAgIG9wZW5Nb2RhbChzdGVwKSB7XG4gICAgICBsZXQgY29udGVudCA9IHN0ZXAubWFudWFsO1xuICAgICAgbGV0IHRpdGxlID0gc3RlcC50aXRsZTtcbiAgICAgIGxldCBlbGVtZW50ID0gc3RlcC5lbGVtZW50O1xuICAgICAgbGV0IGNvbnRyb2xQb3MgPSAndG9wJztcbiAgICAgIGxldCBvcHRpb25zID0ge1xuICAgICAgICBjb250ZW50OiBjb250ZW50XG4gICAgICB9O1xuXG4gICAgICBpZiAoIWNvbnRlbnQpIHJldHVybjtcblxuICAgICAgaWYgKCFlbGVtZW50IHx8ICEkKGVsZW1lbnQpLmxlbmd0aCkge1xuICAgICAgICBvcHRpb25zLmNvbnRlbnQgPSB0aGlzLnJlbmRlckNvbnRlbnQoY29udGVudCwgdGl0bGUsIGNvbnRyb2xQb3MpO1xuICAgICAgICBvcHRpb25zLmRpc2FibGVPdmVybGF5SGFuZGxlciA9IHRydWU7XG4gICAgICAgIG9wdGlvbnMuZGlzYWJsZUNsb3NlQnRuSGFuZGxlciA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuaXNNb2RhbEFjdGl2ZSA9IHRydWU7XG4gICAgICAkLmpCb3gub3BlbihvcHRpb25zKTtcbiAgICB9XG5cbiAgICBjbG9zZU1vZGFsKCkge1xuICAgICAgaWYgKCF0aGlzLmlzTW9kYWxBY3RpdmUpIHJldHVybjtcblxuICAgICAgJC5qQm94LmNsb3NlKCk7XG4gICAgICB0aGlzLmlzTW9kYWxBY3RpdmUgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBvbk1vZGFsQ2xvc2UoKSB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuaXNNb2RhbEFjdGl2ZSkge1xuICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgJChkb2N1bWVudC5ib2R5KS5vbmUoJ2pCb3g6YWZ0ZXJDbG9zZScsIHJlc29sdmUpO1xuICAgICAgICAgIH0sIDMwMCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBnZXRDb29raWVzKGtleSkge1xuICAgICAgY29uc3QgY2FjaGVkSnNvbk9wdGlvbiA9ICQuY29va2llLmpzb247XG4gICAgICAkLmNvb2tpZS5qc29uID0gdHJ1ZTtcbiAgICAgIGNvbnN0IGNvb2tpZSA9ICQuY29va2llKGtleSk7XG4gICAgICAkLmNvb2tpZS5qc29uID0gY2FjaGVkSnNvbk9wdGlvbjtcblxuICAgICAgcmV0dXJuIGNvb2tpZTtcbiAgICB9XG5cbiAgICBwdXRDb29raWVzKGtleSwgdmFsLCBvcHQpIHtcbiAgICAgIGNvbnN0IGNhY2hlZEpzb25PcHRpb24gPSAkLmNvb2tpZS5qc29uO1xuICAgICAgJC5jb29raWUuanNvbiA9IHRydWU7XG4gICAgICAkLmNvb2tpZShrZXksIHZhbCwgb3B0KTtcbiAgICAgICQuY29va2llLmpzb24gPSBjYWNoZWRKc29uT3B0aW9uO1xuICAgIH1cblxuICAgIGRlbGV0ZUNvb2tpZXMoa2V5LCBvcHQpIHtcbiAgICAgIHJldHVybiAkLnJlbW92ZUNvb2tpZShrZXksIG9wdCk7XG4gICAgfVxuXG4gICAgcHV0VG91ckRhdGEocGF0aCkge1xuICAgICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgICAgcGF0aDogJy8nXG4gICAgICB9O1xuICAgICAgY29uc3QgdG91ckRhdGEgPSB7XG4gICAgICAgIHBhdGg6IHBhdGgsXG4gICAgICAgIG5hbWU6IHRoaXMubmFtZSxcbiAgICAgICAgYWN0aXZlU3RlcEluZGV4OiB0aGlzLmFjdGl2ZVN0ZXBJbmRleCxcbiAgICAgICAgc3RhcnRQYWdlOiB0aGlzLnN0YXJ0UGFnZSxcbiAgICAgICAgaXNTb3VuZDogdGhpcy5pc1NvdW5kXG4gICAgICB9O1xuXG4gICAgICB0aGlzLnB1dENvb2tpZXModGhpcy5uYW1lLCB0b3VyRGF0YSwgb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgZ2V0VG91ckRhdGEoKSB7XG4gICAgICBjb25zdCB0b3VyRGF0YSA9IHRoaXMuZ2V0Q29va2llcyh0aGlzLm5hbWUpO1xuXG4gICAgICBpZiAoIXRvdXJEYXRhIHx8ICF0aGlzLmlzU2FtZVBhdGgodG91ckRhdGEucGF0aCkpIHJldHVybiBudWxsO1xuXG4gICAgICByZXR1cm4gdG91ckRhdGE7XG4gICAgfVxuXG4gICAgZGVsZXRlVG91ckRhdGEoKSB7XG4gICAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgICBwYXRoOiAnLydcbiAgICAgIH07XG5cbiAgICAgIHRoaXMuZGVsZXRlQ29va2llcyh0aGlzLm5hbWUsIG9wdGlvbnMpO1xuICAgIH1cblxuICAgIGdldENvb3JkcyhlbGVtKSB7XG4gICAgICBsZXQgYm94ID0gZWxlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdG9wOiBib3gudG9wICsgd2luZG93LnBhZ2VZT2Zmc2V0LFxuICAgICAgICBib3R0b206IGJveC5ib3R0b20gKyB3aW5kb3cucGFnZVlPZmZzZXQsXG4gICAgICAgIGxlZnQ6IGJveC5sZWZ0ICsgd2luZG93LnBhZ2VYT2Zmc2V0LFxuICAgICAgICByaWdodDogYm94LnJpZ2h0ICsgd2luZG93LnBhZ2VYT2Zmc2V0XG4gICAgICB9O1xuICAgIH1cblxuICAgIGNyZWF0ZU1lbnUoKSB7XG4gICAgICBsZXQgJG1lbnUgPSB0aGlzLiRtZW51ID0gdGhpcy5yZW5kZXJNZW51KCk7XG5cbiAgICAgIGlmICghJG1lbnUpIHJldHVybjtcblxuICAgICAgdGhpcy5hZGRNZW51KCRtZW51KTtcbiAgICAgIHRoaXMuJHNvdW5kQnRuID0gJG1lbnUuZmluZCgnI3RvdXItc291bmQnKS5hdHRyKCdjaGVja2VkJywgdGhpcy5pc1NvdW5kKTtcbiAgICAgIHRoaXMuX21lbnVDbGlja0hhbmRsZXIgPSB0aGlzLm1lbnVDbGlja0hhbmRsZXIuYmluZCh0aGlzKTtcbiAgICAgICRtZW51Lm9uKCdjbGljaycsIHRoaXMuX21lbnVDbGlja0hhbmRsZXIpO1xuICAgIH1cblxuICAgIHJlbmRlck1lbnUoKSB7XG4gICAgICBsZXQgJG1lbnVXcmFwcGVyID0gJCh0aGlzLm1lbnVUcGwubWVudVdyYXBwZXIpO1xuICAgICAgbGV0ICRtZW51Q29udGFpbmVyID0gJCh0aGlzLm1lbnVUcGwuY29udGFpbmVyKTtcbiAgICAgIGxldCBzdGVwcyA9IHRoaXMuc3RlcHM7XG4gICAgICBsZXQgJGN1cnJNZW51SXRlbSA9ICQoMCk7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RlcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbGV0IGN1cnJTdGVwID0gc3RlcHNbaV07XG4gICAgICAgIGlmIChjdXJyU3RlcC5pc01lbnVTdGVwKSB7XG4gICAgICAgICAgbGV0ICRtZW51SXRlbSA9ICQodGhpcy5tZW51VHBsLml0ZW0pO1xuICAgICAgICAgIGxldCAkbWVudUFuY2hvciA9ICQodGhpcy5tZW51VHBsLml0ZW1BbmNob3IpO1xuXG4gICAgICAgICAgJGN1cnJNZW51SXRlbSA9ICRtZW51SXRlbTtcblxuICAgICAgICAgICRtZW51QW5jaG9yXG4gICAgICAgICAgICAudGV4dChjdXJyU3RlcC5tZW51VGl0bGUgfHwgc3RlcHNbaV0udGl0bGUpXG4gICAgICAgICAgICAuYXR0cignZGF0YS1qdG91ci1zdGVwJywgaSk7XG4gICAgICAgICAgJG1lbnVJdGVtLmFwcGVuZCgkbWVudUFuY2hvcik7XG4gICAgICAgICAgJG1lbnVDb250YWluZXIuYXBwZW5kKCRtZW51SXRlbSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5hY3RpdmVTdGVwSW5kZXggPT09IGkpIHtcbiAgICAgICAgICAkY3Vyck1lbnVJdGVtLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc3RlcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKCF0aGlzLnN0ZXBzW2ldLmZpbGUpIGNvbnRpbnVlO1xuXG4gICAgICAgICRtZW51V3JhcHBlci5wcmVwZW5kKHRoaXMubWVudVRwbC5zb3VuZEJ0bik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICAkbWVudVdyYXBwZXIuYXBwZW5kKCRtZW51Q29udGFpbmVyKTtcblxuICAgICAgcmV0dXJuICRtZW51Q29udGFpbmVyLmNoaWxkcmVuKCkgPT09IDAgPyBudWxsIDogJG1lbnVXcmFwcGVyO1xuICAgIH1cblxuICAgIHJlbW92ZU1lbnUoKSB7XG4gICAgICBpZiAoIXRoaXMuaXNNZW51IHx8ICF0aGlzLiRtZW51KSByZXR1cm47XG5cbiAgICAgIGlmICh0eXBlb2YgdGhpcy5yZW1vdmVNZW51TWV0aG9kID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlTWVudU1ldGhvZCh0aGlzLiRtZW51LCB0aGlzLm1lbnVDb250YWluZXIsIHRoaXMpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLiRtZW51XG4gICAgICAgIC5vZmYoJ2NsaWNrJywgdGhpcy5fbWVudUNsaWNrSGFuZGxlcilcbiAgICAgICAgLnJlbW92ZSgpO1xuXG4gICAgICB0aGlzLiRtZW51ID0gbnVsbDtcbiAgICB9XG5cbiAgICBhZGRNZW51KG1lbnUpIHtcbiAgICAgIGlmICh0eXBlb2YgdGhpcy5hZGRNZW51TWV0aG9kID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRoaXMuYWRkTWVudU1ldGhvZChtZW51LCB0aGlzLm1lbnVDb250YWluZXIsIHRoaXMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJCh0aGlzLm1lbnVDb250YWluZXIpLmFwcGVuZChtZW51KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBtZW51Q2xpY2tIYW5kbGVyKGUpIHtcbiAgICAgIGxldCAkdGFyZ2V0ID0gJChlLnRhcmdldCk7XG5cbiAgICAgIGlmICgkdGFyZ2V0LmlzKCdbZGF0YS1qdG91ci1zdGVwXScpKSB7XG4gICAgICAgIGxldCBpbmRleCA9ICskdGFyZ2V0LmF0dHIoJ2RhdGEtanRvdXItc3RlcCcpO1xuXG4gICAgICAgIHRoaXMuc3dpdGNoTWVudUl0ZW0oaW5kZXgpO1xuICAgICAgICB0aGlzLmdvdG8oaW5kZXgpO1xuXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoJHRhcmdldC5pcyh0aGlzLiRzb3VuZEJ0bikpIHtcbiAgICAgICAgdGhpcy50b2dnbGVWb2x1bWUoKTtcblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgcGxheUF1ZGlvKHNvdXJjZSkge1xuICAgICAgc291cmNlID0gc291cmNlIHx8IHRoaXMuYWN0aXZlU3RlcC5maWxlO1xuXG4gICAgICBpZiAoIXRoaXMuaXNTb3VuZCkgcmV0dXJuO1xuXG4gICAgICB0aGlzLnBsYXllci5pbml0KHNvdXJjZSk7XG4gICAgICB0aGlzLnBsYXllci5wbGF5KCk7XG4gICAgfVxuXG4gICAgdG9nZ2xlVm9sdW1lKCkge1xuICAgICAgdGhpcy5pc1NvdW5kID0gdGhpcy4kc291bmRCdG5bMF0uY2hlY2tlZDtcblxuICAgICAgaWYgKHRoaXMuaXNTb3VuZCkge1xuICAgICAgICB0aGlzLmNvbnRlbnQuJHJlcGxheVxuICAgICAgICAgIC5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKVxuICAgICAgICAgIC5hdHRyKCdkaXNhYmxlZCcsIGZhbHNlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucGxheWVyLnBhdXNlKCk7XG4gICAgICAgIHRoaXMuY29udGVudC4kcmVwbGF5XG4gICAgICAgICAgLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHN3aXRjaE1lbnVJdGVtKGluZGV4KSB7XG4gICAgICBpZiAoIXRoaXMuJG1lbnUpIHJldHVybjtcblxuICAgICAgbGV0ICRtZW51SXRlbSA9IHRoaXMuJG1lbnUuZmluZCgnW2RhdGEtanRvdXItc3RlcCA9XCInICsgaW5kZXggKyAnXCJdJyk7XG5cbiAgICAgIGlmICghJG1lbnVJdGVtLmxlbmd0aCkgcmV0dXJuO1xuXG4gICAgICBsZXQgJGN1cnJNZW51SXRlbSA9ICRtZW51SXRlbS5jbG9zZXN0KCdsaScpO1xuICAgICAgbGV0ICRhY3RpdmVNZW51SXRlbSA9IHRoaXMuJG1lbnUuZmluZCgnbGkuYWN0aXZlJyk7XG5cbiAgICAgIHRoaXMuJHRyaWdnZXJlZEVsLnRyaWdnZXIodGhpcy5ldmVudHMubWVudUJlZm9yZVN3aXRjaCwgW3RoaXNdKTtcblxuICAgICAgJGFjdGl2ZU1lbnVJdGVtLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICRjdXJyTWVudUl0ZW0uYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXG4gICAgICB0aGlzLiR0cmlnZ2VyZWRFbC50cmlnZ2VyKHRoaXMuZXZlbnRzLm1lbnVBZnRlclN3aXRjaCwgW3RoaXNdKTtcbiAgICB9XG5cbiAgICBzZXR1cFN0ZXBzUGF0aCgpIHtcbiAgICAgIGlmICghdGhpcy5zdGFydFBhZ2UpIHtcbiAgICAgICAgdGhpcy5zdGFydFBhZ2UgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWU7XG4gICAgICB9XG5cbiAgICAgIGxldCBjdXJyUGFzcyA9IHRoaXMuc3RhcnRQYWdlO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc3RlcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbGV0IGN1cnJTdGVwID0gdGhpcy5zdGVwc1tpXTtcblxuICAgICAgICBpZiAoY3VyclN0ZXAucGF0aCA9PT0gY3VyclBhc3MpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfSBlbHNlIGlmICghY3VyclN0ZXAucGF0aCkge1xuICAgICAgICAgIGN1cnJTdGVwLnBhdGggPSBjdXJyUGFzcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjdXJyUGFzcyA9IGN1cnJTdGVwLnBhdGg7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKm5vdCB1c2VkKi9cbiAgICBnZXRUcmFuc2xhdGlvbihlbCkge1xuICAgICAgbGV0IHRyYW5zbGF0aW9uID0gMDtcblxuICAgICAgaWYgKGVsLmhhc0F0dHJpYnV0ZSgnZGF0YS10cmFuc2xhdGlvbicpKSB7XG4gICAgICAgIHRyYW5zbGF0aW9uID0gZWwuZ2V0QXR0cmlidXRlKCdkYXRhLXRyYW5zbGF0aW9uJyk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuc3RlcHNbdGhpcy5hY3RpdmVTdGVwSW5kZXhdLnRyYW5zbGF0aW9uRWxlbWVudFNlbGVjdG9yKSB7XG4gICAgICAgICQodGhpcy5zdGVwc1t0aGlzLmFjdGl2ZVN0ZXBJbmRleF0udHJhbnNsYXRpb25FbGVtZW50U2VsZWN0b3IpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHRyYW5zbGF0aW9uICs9IHRoaXMub2Zmc2V0SGVpZ2h0O1xuICAgICAgICB9KTtcbiAgICAgICAgLy90cmFuc2xhdGlvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGhpcy50cmFuc2xhdGlvbkVsZW1lbnRTZWxlY3Rvcikub2Zmc2V0SGVpZ2h0O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJhbnNsYXRpb247XG4gICAgfVxuXG4gICAgZ2V0Rmlyc3RJbihmcm9tKSB7XG4gICAgICBsZXQgZmlyc3RJbiA9IC0xO1xuICAgICAgbGV0IHN0ZXBzID0gdGhpcy5zdGVwcztcblxuICAgICAgaWYgKHR5cGVvZiBmcm9tID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICBmcm9tID0gMDtcbiAgICAgIH0gZWxzZSBpZiAoZnJvbSA8IDAgfHwgZnJvbSA+IHN0ZXBzLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gZmlyc3RJbjtcbiAgICAgIH1cblxuICAgICAgZm9yIChsZXQgaSA9IGZyb207IGkgPCBzdGVwcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoIXRoaXMuaXNTYW1lUGF0aChzdGVwc1tpXS5wYXRoKSkgY29udGludWU7XG5cbiAgICAgICAgZmlyc3RJbiA9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmlyc3RJbjtcbiAgICB9XG4gIH1cblxuICBjb25zdCBEZWZhdWx0U3RlcCA9IHtcbiAgICBwYXRoOiAnJyxcbiAgICBlbGVtZW50OiAnJyxcbiAgICBhbmltYXRlVHlwZTogJ3NpbXBsZScsXG4gICAgdG9vbHRpcFBvczogJ3RvcCcsXG4gICAgdGl0bGU6ICcnLFxuICAgIGNvbnRlbnQ6ICcnLFxuICAgIHRyYW5zbGF0aW9uRWxlbWVudFNlbGVjdG9yOiBudWxsLFxuICAgIG9uQmVmb3JlU3RhcnQ6IG51bGwsXG4gICAgb25BZnRlclN0YXJ0OiBudWxsLFxuICAgIG9uQmVmb3JlRW5kOiBudWxsLFxuICAgIG9uQWZ0ZXJFbmQ6IG51bGwsXG4gICAgb25FbGVtZW50OiBudWxsIC8vIHNob3VsZCBwYXNzIG9iamVjdCwgYXJndW1lbnRzOiBldmVudChzdHJpbmcpLCBmdW5jdGlvbihmdW5jdGlvbiBnZXRzIGNvbnRyb2xsZXIgaW4gZS5kYXRhLnRvdXJDb250cm9sbGVyKVxuICB9O1xuXG4gIGNvbnN0IERlZmF1bHRUb29sdGlwT3B0aW9ucyA9IHtcbiAgICBjdXN0b21Db250YWluZXJDbGFzczogJ2pzX19qdG9vbHRpcC1zX3doaXRlJ1xuICB9O1xuXG4gICQualRvdXIgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIGxldCByZXN1bHQgPSBudWxsO1xuXG4gICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnb2JqZWN0JyAmJiAkLmlzQXJyYXkob3B0aW9ucy5zdGVwcykpIHtcbiAgICAgIHJlc3VsdCA9IG5ldyBKVG91ckNvbnRyb2xsZXIob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbn0pKTtcbiJdfQ==
