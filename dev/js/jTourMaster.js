//TODO events

/*comments*/
/*steps examples*/
/*{
            element: '#edit-submit',
            title: 'Отправить',
            content: 'Сохраните серийный номер',
            onElement: {
              event: 'click',
              handler: function (e) {
                let $target = $(e.target);
                let tour = e.data.tourController;

                e.preventDefault();

                setTimeout(() => {
                  $target.trigger(tour.activeStep.onElement.event);
                }, 50);
                tour.bindNextStep();
              }
            },

            {
            element: '#edit-theme-settings .fieldset-legend',
            title: 'Включить/выключить отображение ',
            content: 'Управление отображением элементов страницы. Оставьте без изменений, если не уверены.',
            path: '/admin/appearance/settings/jflex/',
            isMenuStep: true,
            menuTitle: 'настройки оформления'
          },

          Custom steps for gathering in one tour

          {
        element: '.js__jtour-step1',
        title: 'step 1',
        tag: 'Функциональные опции интернет-магазина', //в турмастере в popup4 шаги по одной теме группируются вместе, с одним заголовком
        content: 'some bla-bla-bla',
        path: '/review/flex_admin_tour/test2.html'
      },
      {
        element: '.js__jtour-step2',
        title: 'step 2',
        tag: 'Функциональные опции интернет-магазина',
        content: 'some bla-bla-bla',
        path: '/review/flex_admin_tour/test2.html'
      },
*/
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
  var JTourMasterController = function () {
    function JTourMasterController(options) {
      _classCallCheck(this, JTourMasterController);

      this.tours = options.tours;
      this.steps = options.steps;
      this.jboxOptions = options.jboxOptions || {};
      this.defaultTourOptions = options.defaultTourOptions || {};
      this.gotoPopUpAttr = options.gotoPopUpAttr || 'data-show-popup';
      this.startTourByNameAttr = options.startTourByNameAttr || 'data-start-tour';
      this.closePopupBtn = options.closePopupBtn || '.js__jbox-close';
      this.customTemplateForm = '#custom-template-form';
      this.customTourOptions = options.customTourOptions || {};
      this.autostart = options.autostart || false;
      this.autostartPath = options.autostartPath || '';
      this.autostartCondition = options.autostartCondition || 'none'; // 'none', 'new'
      this.autostartConditionFunc = options.autostartConditionFunc || null;
      this.tour = null;
      this.listenedEl = options.listenedEl || document.body;
      this.layoutContainer = options.layoutContainer || document.body;
      this.events = {};
      this.activeTourKey = 'tour-master-active-tour';

      this.init();
    }

    _createClass(JTourMasterController, [{
      key: 'init',
      value: function init() {
        var hasAutostart = this.autostart && this.isSamePath(this.autostartPath);
        var hasCookiesStart = this.hasCookiesStart();

        this.defaultTourOptions = $.extend(true, {}, DefaultTourOptions, this.defaultTourOptions);
        this.customTourOptions = $.extend(true, {}, CustomTourOptions, this.customTourOptions);

        if (!hasAutostart && !hasCookiesStart) return;

        if (hasCookiesStart) {
          var start = this.onCookiesStart();

          if (start) return;
        }

        if (hasAutostart) {
          var _start = this.runAutostart();

          if (_start) return;
        }
      }
    }, {
      key: 'initLayout',
      value: function initLayout() {
        if (this.isLayout) return;

        if (this.isAttachedHandlers) {
          this.detachHandlers();
        }

        this.renderLayout();
        this.bindElements();
        this.bindHandlers();
        this.attachHandlers();

        this.isLayout = true;
      }
    }, {
      key: 'stop',
      value: function stop() {
        if (this.tour) {
          this.tour.stop();
        }

        this.hidePopUp();
        this.detachHandlers();
        this.destroyLayout();
        this.isLayout = false;
      }
    }, {
      key: 'start',
      value: function start() {
        this.startTourMaster();
      }
    }, {
      key: 'runAutostart',
      value: function runAutostart() {
        if (typeof this.autostartConditionFunc === 'function') {
          if (this.autostartConditionFunc(this)) {
            this.start();
            return true;
          }

          return false;
        }

        switch (this.autostartCondition) {
          case 'none':
            this.start();
            return true;
          case 'new':
            return this.firstTimeTourMasterStart();
          default:
            return false;
        }
      }
    }, {
      key: 'bindElements',
      value: function bindElements() {
        this.$gotoPopupBtn = $('[' + this.gotoPopUpAttr + ']');
        this.$closePopupBtn = $(this.closePopupBtn);
        this.$startTourByNameBtn = $('[' + this.startTourByNameAttr + ']');
        this.$customTemplateForm = $(this.customTemplateForm);
        this.$listenedEl = $(this.listenedEl);
      }
    }, {
      key: 'bindHandlers',
      value: function bindHandlers() {
        this._gotoPopUpHandler = this.gotoPopUpHandler.bind(this);
        this._hidePopUp = this.hidePopUp.bind(this);
        this._startTourByNameHandler = this.startTourByNameHandler.bind(this);
        this._startCustomTourHandler = this.startCustomTourHandler.bind(this);
        this._gotoNextPageHandler = this.gotoNextPageHandler.bind(this);
      }
    }, {
      key: 'attachHandlers',
      value: function attachHandlers() {
        this.$gotoPopupBtn.on('click', this._gotoPopUpHandler);
        this.$closePopupBtn.on('click', this._hidePopUp);
        this.$startTourByNameBtn.on('click', this._startTourByNameHandler);
        this.$customTemplateForm.on('submit', this._startCustomTourHandler);
        this.$listenedEl.on('jTour:tourGoNextPage', this._gotoNextPageHandler);

        this.isAttachedHandlers = true;
      }
    }, {
      key: 'detachHandlers',
      value: function detachHandlers() {
        this.$gotoPopupBtn.off('click', this._gotoPopUpHandler);
        this.$closePopupBtn.off('click', this._hidePopUp);
        this.$startTourByNameBtn.off('click', this._startTourByNameHandler);
        this.$customTemplateForm.off('submit', this._startCustomTourHandler);
        this.$listenedEl.off('jTour:tourGoNextPage', this._gotoNextPageHandler);

        this.isAttachedHandlers = false;
      }
    }, {
      key: 'showPopUp',
      value: function showPopUp(el) {
        $.jBox.open($.extend(true, {}, this.jboxOptions, { href: el }));
      }
    }, {
      key: 'hidePopUp',
      value: function hidePopUp() {
        $.jBox.close();
      }
    }, {
      key: 'startTourMaster',
      value: function startTourMaster() {
        if (!this.isLayout) {
          this.initLayout();
        }

        this.showPopUp(this.html.layout.$popupIntro);
      }
    }, {
      key: 'gotoPopUpHandler',
      value: function gotoPopUpHandler(e) {
        var el = e.target;
        var target = el.closest('[' + this.gotoPopUpAttr + ']');

        if (!target) return;
        e.preventDefault();

        this.showPopUp(target.getAttribute(this.gotoPopUpAttr));
      }
    }, {
      key: 'startTour',
      value: function startTour(options) {
        this.createTour(options);

        setTimeout(function () {
          this.tour.start();
        }.bind(this), 200);
      }
    }, {
      key: 'createTour',
      value: function createTour(options) {
        options = $.extend(true, this.defaultTourOptions, options);
        this.activeTourOptions = options;
        this.tour = $.jTour(options);

        return this.tour;
      }
    }, {
      key: 'gotoNextPageHandler',
      value: function gotoNextPageHandler(e, path, tour) {

        if (tour !== this.tour) return;

        this.putActiveTourCookies(path);
      }
    }, {
      key: 'startTourByNameHandler',
      value: function startTourByNameHandler(e) {
        var el = e.target;
        var target = el.closest('[' + this.startTourByNameAttr + ']');

        if (!target) return;
        e.preventDefault();

        this.hidePopUp();
        this.startTourByName(target.getAttribute(this.startTourByNameAttr));
      }
    }, {
      key: 'startTourByName',
      value: function startTourByName(tourName) {
        var tourOptions = this.getTourByName(tourName);

        if (!tourOptions) return;

        this.startTour(tourOptions);
      }
    }, {
      key: 'getTourByName',
      value: function getTourByName(tourName) {
        for (var i = 0; i < this.tours.length; i++) {
          if (this.tours[i].name !== tourName) continue;

          return this.tours[i];
        }

        return null;
      }
    }, {
      key: 'startCustomTourHandler',
      value: function startCustomTourHandler(e) {
        var el = e.target;
        var target = el.closest(this.customTemplateForm);

        if (!target) return;

        e.preventDefault();

        var options = this.getCustomTour(target);

        if (!options) return;

        this.hidePopUp();
        this.startTour(options);
      }
    }, {
      key: 'getCustomTour',
      value: function getCustomTour(form) {
        var formData = $(form).serializeArray();
        var tourOptions = $.extend(true, {}, this.customTourOptions);
        var currSteps = [];
        var customStepsIndex = this.customStepsIndex = [];

        for (var i = 0; i < formData.length; i++) {
          var stepIndex = +formData[i].value;

          currSteps.push(this.steps[stepIndex]);
          customStepsIndex.push(stepIndex);
        }

        tourOptions.steps = currSteps;

        return tourOptions;
      }
    }, {
      key: 'firstTimeTourMasterStart',
      value: function firstTimeTourMasterStart() {
        var name = 'tour-master';
        var data = {
          date: new Date()
        };
        var options = {
          domain: window.location.hostname
        };
        var tourMasterData = this.getCookies(name);

        if (tourMasterData) return false;

        this.putCookies(name, data, options);
        this.startTourMaster();
        return true;
      }
    }, {
      key: 'putActiveTourCookies',
      value: function putActiveTourCookies(path) {
        var options = {
          path: '/'
        };
        var tourOptions = this.parseTourOptions(this.activeTourOptions);
        var tourData = Object.assign({}, tourOptions, { path: path });

        this.putCookies(this.activeTourKey, tourData, options);
      }
    }, {
      key: 'hasCookiesStart',
      value: function hasCookiesStart() {
        return !!this.getActiveTourCookies();
      }
    }, {
      key: 'onCookiesStart',
      value: function onCookiesStart() {
        var tourData = this.getActiveTourCookies();
        var cookiesOptions = {
          path: '/'
        };

        if (!tourData) return false;

        this.initLayout();
        this.deleteCookies(this.activeTourKey, cookiesOptions);
        this.createTour(this.parseTourCookieData(tourData));

        return true;
      }
    }, {
      key: 'getActiveTourCookies',
      value: function getActiveTourCookies() {
        var tourData = this.getCookies(this.activeTourKey);

        if (!tourData || !this.isSamePath(tourData.path)) return null;

        return tourData;
      }
    }, {
      key: 'createTourFromCookies',
      value: function createTourFromCookies(tourData) {
        var tourOptions = this.parseTourCookieData(tourData);

        if (tourData.customStepsIndex) {
          this.customStepsIndex = tourData.customStepsIndex;
        }

        this.activeTourOptions = tourOptions;

        this.tour = $.jTour(tourOptions);
      }
    }, {
      key: 'parseTourOptions',
      value: function parseTourOptions(options) {
        var tourCookiesData = {
          name: options.name
        };

        if (options.name !== this.customTourOptions.name) return tourCookiesData;

        tourCookiesData.steps = this.customStepsIndex;
        return tourCookiesData;
      }
    }, {
      key: 'parseTourCookieData',
      value: function parseTourCookieData(tourData) {
        var tourOptions = void 0;

        if (tourData !== this.customTourOptions.name) {
          tourOptions = this.getTourByName(tourData.name);
        } else {
          tourOptions = $.extend(true, {}, this.customTourOptions);
          tourOptions.steps = [];
          this.customStepsIndex = tourData.customStepsIndex;

          for (var i = 0; i < tourData.customStepsIndex; i++) {
            tourOptions.steps.push(this.steps[tourData.customStepsIndex[i]]);
          }
        }

        return tourOptions;
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
      key: 'isSamePath',
      value: function isSamePath(path, isEmptyPath) {
        var lang = this.getLang();
        var reg = lang ? new RegExp('/' + lang + '/', 'g') : null;
        var currPath = path.replace(reg, '/');
        var localPath = window.location.pathname.replace(reg, '/');

        if (currPath === localPath || currPath === '' && isEmptyPath) {
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
      key: 'renderLayout',
      value: function renderLayout() {
        var $popupIntro = $(LayoutTpl.popup1);
        var $popupDivarication = $(LayoutTpl.popup2);
        var $popupTours = $(this.renderPopupTours(this.tours));
        var $popupSteps = $(this.renderPopupSteps(this.steps));
        var $container = $(this.layoutContainer);

        this.html = {
          layout: {
            $popupIntro: $popupIntro,
            $popupDivarication: $popupDivarication,
            $popupTours: $popupTours,
            $popupSteps: $popupSteps
          },
          $layoutContainer: $container
        };

        $container.append($popupIntro).append($popupDivarication).append($popupTours).append($popupSteps);
      }
    }, {
      key: 'renderPopupTours',
      value: function renderPopupTours(tours) {
        var source = LayoutTpl.popup3;
        var template = Handlebars.compile(source);
        var context = {
          tours: tours
        };

        return template(context);
      }
    }, {
      key: 'renderPopupSteps',
      value: function renderPopupSteps(steps) {
        var source = LayoutTpl.popup4;
        var template = Handlebars.compile(source);
        var context = {
          steps: steps,
          groupSteps: []
        };

        for (var i = 0; i < steps.length; i++) {
          var hasTitle = false;

          for (var j = 0; j < context.groupSteps.length; j++) {
            if (steps[i].tag !== context.groupSteps[j].title) continue;

            hasTitle = true;
            break;
          }

          if (hasTitle) continue;

          context.groupSteps.push({
            title: steps[i].tag
          });
        }

        return template(context);
      }
    }, {
      key: 'destroyLayout',
      value: function destroyLayout() {
        var layout = this.html.layout;

        for (var popup in layout) {
          layout[popup].remove();
        }

        this.html.layout = {};
      }
    }]);

    return JTourMasterController;
  }();

  var CustomTourOptions = {
    name: 'custom-tour',
    isMenu: true,
    steps: []
  };

  var DefaultTourOptions = {
    isMenu: true
  };

  var LayoutTpl = {
    popup1: '<div id="tour-master__popup-1" class="tour-master__popup-1 tour__popup center hide">\n                <div id="preloader" class="preloader fadeInDown">\n                  <div class="preloader__content">\n                    <div class="spinner box_1 spinner"></div>\n                    <div class="spinner box_2 delay_1"></div>\n                    <div class="spinner box_3 delay_2"></div>\n                    <div class="spinner box_4 delay_3"></div>\n                    <div class="box_5"></div>\n                  </div>\n                </div>\n                <h2 class="mv30 fadeInDown animation-delay_0_2">\u041C\u0430\u0441\u0442\u0435\u0440 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438</h2>\n                <div class="small lh20 fadeInDown animation-delay_0_4">\u041D\u0430\u0447\u043D\u0438\u0442\u0435 \u0441 \u043F\u0440\u043E\u0441\u0442\u043E\u0439 \u043F\u043E\u0448\u0430\u0433\u043E\u0432\u043E\u0439 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u0441\u0438\u0441\u0442\u0435\u043C\u044B.</div>\n                <div class="mb80 small lh20 fadeInDown animation-delay_0_4">\u0421\u043B\u0435\u0434\u0443\u0439\u0442\u0435 \u043F\u043E\u0434\u0441\u043A\u0430\u0437\u043A\u0430\u043C \u0438\u043D\u0442\u0435\u0440\u0430\u043A\u0442\u0438\u0432\u043D\u043E\u0433\u043E \u043C\u043E\u043C\u043E\u0449\u043D\u0438\u043A\u0430.</div>\n                <button class="btn_start btn small simple icon icon-triangle-right fadeInDown animation-delay_0_6" data-show-popup=".tour-master__popup-2">\u041D\u0430\u0447\u0430\u0442\u044C \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0443</button>\n                <a href="#" class="btn_skip js__jbox-close fadeInDown animation-delay_0_8">\u043F\u0440\u043E\u043F\u0443\u0441\u0442\u0438\u0442\u044C \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0443</a>\n            </div>',
    popup2: '<div id="tour-master__popup-2" class="tour-master__popup-2 tour__popup hide">\n        <h2 class="mb30 fadeInDown">\u0412\u0430\u0440\u0438\u0430\u043D\u0442\u044B \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 Flex</h2>\n        \n        <div class="marker blue mb50">\n          <div class="row sp-20">\n            <div class="col d6 m12">\n              <div class="settings__title big t_black fadeInDown animation-delay_0_2">\n                \u0428\u0430\u0431\u043B\u043E\u043D\u044B\n                <br>\n                \u043F\u0440\u043E\u0446\u0435\u0441\u0441\u043E\u0432\n              </div>\n              <div class="mb40 smaller description lh20 fadeInDown animation-delay_0_4">\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435, \u0447\u0442\u043E \u0431\u044B \u0432\u044B\u0441\u0442\u0440\u043E\u0438\u0442\u044C \u043F\u0440\u043E\u0446\u0435\u0441\u0441\u044B \u043D\u0430 \u043E\u0441\u043D\u043E\u0432\u0435 \u0448\u0430\u0431\u043B\u043E\u043D\u043E\u0432 \u044D\u0444\u0444\u0435\u043A\u0442\u0438\u0432\u043D\u044B\u0445 \u0441\u0442\u0430\u043D\u0434\u0430\u0440\u0442\u043E\u0432.</div>\n              <button class="btn small simple fadeInDown animation-delay_0_6" data-show-popup=".tour-master__popup-3">\u0432\u044B\u0431\u0440\u0430\u0442\u044C</button>\n            </div>\n \n            <div class="col d6 m12">\n              <div class="settings__title big t_black fadeInDown animation-delay_0_2">\n                \u0421\u043E\u0431\u0441\u0442\u0432\u0435\u043D\u043D\u044B\u0435\n                <br>\n                \u043F\u0440\u043E\u0446\u0435\u0441\u0441\u044B\n              </div>\n              <div class="mb40 smaller description lh20 fadeInDown animation-delay_0_4">\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435, \u0447\u0442\u043E \u0431\u044B \u043D\u0430\u0441\u0442\u0440\u043E\u0438\u0442\u044C \u0441\u0438\u0441\u0442\u0435\u043C\u0443 \u043F\u043E\u0434 \u0434\u0435\u0439\u0441\u0442\u0432\u0443\u044E\u0449\u0438\u0435 \u0431\u0438\u0437\u043D\u0435\u0441-\u043F\u0440\u043E\u0446\u0435\u0441\u0441\u044B \u0438 \u0441\u0442\u0440\u0443\u043A\u0442\u0443\u0440\u0443 \u043E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0446\u0438\u0438.</div>\n              <button class="btn small simple fadeInDown animation-delay_0_6" data-show-popup=".tour-master__popup-4">\u0432\u044B\u0431\u0440\u0430\u0442\u044C</button>\n            </div>\n          </div>\n          \n        </div>\n    \n        <a href="#" class="educational-center__link icon icon-uniE7D3 fadeInDown animation-delay_0_8">\u0423\u0447\u0435\u0431\u043D\u044B\u0439 \u0446\u0435\u043D\u0442\u0440</a>\n        <a href="#" class="btn_skip js__jbox-close fadeInDown animation-delay_1_0">\u043F\u0440\u043E\u043F\u0443\u0441\u0442\u0438\u0442\u044C \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0443</a>\n      </div>',
    popup3: '<div id="tour-master__popup-3" class="tour-master__popup-3 tour__popup  hide">\n        <button  class="btn_back btn small simple icon icon-uniE7DC fadeInDown"  data-show-popup=".tour-master__popup-2">\u043D\u0430\u0437\u0430\u0434</button>\n        <h2 class="mb30 fadeInDown animation-delay_0_2">\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0448\u0430\u0431\u043B\u043E\u043D \u043F\u0440\u043E\u0446\u0435\u0441\u0441\u043E\u0432</h2>\n    \n        <div class="marker blue mb50 fadeInDown animation-delay_0_4">\n          <div class="process-lenks mt20 mb70">\n            {{#each tours as |tour|}}\n                <a href="#" data-start-tour="{{tour.name}}">{{tour.title}}</a>\n            {{/each}}\n          </div>\n        </div>\n    \n        <a href="#" class="educational-center__link icon icon-uniE7D3 fadeInDown animation-delay_0_6">\u0423\u0447\u0435\u0431\u043D\u044B\u0439 \u0446\u0435\u043D\u0442\u0440</a>\n        <a href="#" class="btn_skip js__jbox-close fadeInDown animation-delay_0_8">\u043F\u0440\u043E\u043F\u0443\u0441\u0442\u0438\u0442\u044C \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0443</a>\n      </div>',
    popup4: '<div id="tour-master__popup-4" class="tour-master__popup-4 tour__popup  hide">\n        <button  class="btn_back btn small simple icon icon-uniE7DC"  data-show-popup=".tour-master__popup-2">\u043D\u0430\u0437\u0430\u0434</button>\n        <h2 class="mb30">\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u043E\u043F\u0446\u0438\u0438 \u043F\u0440\u043E\u0446\u0435\u0441\u0441\u043E\u0432</h2>\n    \n        <div class="marker blue mb30">\n          <div class="custom-template-form__wrap mt20">\n            <form action="post" id="custom-template-form" class="custom-template-form">\n              {{#each groupSteps as |groupStep|}}\n                <div class="title">{{this.title}}</div>\n                <div class="form-item">\n                  {{#each ../steps as |step|}}\n                    {{#ifCond step.tag \'===\' groupStep.title}}\n                      <input id="template-checkbox-{{@index}}" type="checkbox" name="custom-template" value="{{@index}}">\n                      <label for="template-checkbox-{{@index}}">{{step.title}}</label>\n                    {{/ifCond}}\n                  {{/each}}\n                </div>\n              {{/each}}\n            \n              <button type="submit" class="btn_start btn small simple icon icon-triangle-right">\u041D\u0430\u0447\u0430\u0442\u044C \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0443</button>\n            </form>\n          </div>\n        </div>\n    \n        <a href="#" class="educational-center__link icon icon-uniE7D3">\u0423\u0447\u0435\u0431\u043D\u044B\u0439 \u0446\u0435\u043D\u0442\u0440</a>\n        <a href="#" class="btn_skip js__jbox-close">\u043F\u0440\u043E\u043F\u0443\u0441\u0442\u0438\u0442\u044C \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0443</a>\n      </div>'
  };

  $.jTourMaster = function (options) {
    if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object' && $.isArray(options.steps)) {
      return new JTourMasterController(options);
    } else {
      return null;
    }
  };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpzL2pUb3VyTWFzdGVyLmVzNi5qcyJdLCJuYW1lcyI6WyJmYWN0b3J5IiwiZGVmaW5lIiwiYW1kIiwiZXhwb3J0cyIsIm1vZHVsZSIsInJlcXVpcmUiLCJqUXVlcnkiLCIkIiwiSlRvdXJNYXN0ZXJDb250cm9sbGVyIiwib3B0aW9ucyIsInRvdXJzIiwic3RlcHMiLCJqYm94T3B0aW9ucyIsImRlZmF1bHRUb3VyT3B0aW9ucyIsImdvdG9Qb3BVcEF0dHIiLCJzdGFydFRvdXJCeU5hbWVBdHRyIiwiY2xvc2VQb3B1cEJ0biIsImN1c3RvbVRlbXBsYXRlRm9ybSIsImN1c3RvbVRvdXJPcHRpb25zIiwiYXV0b3N0YXJ0IiwiYXV0b3N0YXJ0UGF0aCIsImF1dG9zdGFydENvbmRpdGlvbiIsImF1dG9zdGFydENvbmRpdGlvbkZ1bmMiLCJ0b3VyIiwibGlzdGVuZWRFbCIsImRvY3VtZW50IiwiYm9keSIsImxheW91dENvbnRhaW5lciIsImV2ZW50cyIsImFjdGl2ZVRvdXJLZXkiLCJpbml0IiwiaGFzQXV0b3N0YXJ0IiwiaXNTYW1lUGF0aCIsImhhc0Nvb2tpZXNTdGFydCIsImV4dGVuZCIsIkRlZmF1bHRUb3VyT3B0aW9ucyIsIkN1c3RvbVRvdXJPcHRpb25zIiwic3RhcnQiLCJvbkNvb2tpZXNTdGFydCIsInJ1bkF1dG9zdGFydCIsImlzTGF5b3V0IiwiaXNBdHRhY2hlZEhhbmRsZXJzIiwiZGV0YWNoSGFuZGxlcnMiLCJyZW5kZXJMYXlvdXQiLCJiaW5kRWxlbWVudHMiLCJiaW5kSGFuZGxlcnMiLCJhdHRhY2hIYW5kbGVycyIsInN0b3AiLCJoaWRlUG9wVXAiLCJkZXN0cm95TGF5b3V0Iiwic3RhcnRUb3VyTWFzdGVyIiwiZmlyc3RUaW1lVG91ck1hc3RlclN0YXJ0IiwiJGdvdG9Qb3B1cEJ0biIsIiRjbG9zZVBvcHVwQnRuIiwiJHN0YXJ0VG91ckJ5TmFtZUJ0biIsIiRjdXN0b21UZW1wbGF0ZUZvcm0iLCIkbGlzdGVuZWRFbCIsIl9nb3RvUG9wVXBIYW5kbGVyIiwiZ290b1BvcFVwSGFuZGxlciIsImJpbmQiLCJfaGlkZVBvcFVwIiwiX3N0YXJ0VG91ckJ5TmFtZUhhbmRsZXIiLCJzdGFydFRvdXJCeU5hbWVIYW5kbGVyIiwiX3N0YXJ0Q3VzdG9tVG91ckhhbmRsZXIiLCJzdGFydEN1c3RvbVRvdXJIYW5kbGVyIiwiX2dvdG9OZXh0UGFnZUhhbmRsZXIiLCJnb3RvTmV4dFBhZ2VIYW5kbGVyIiwib24iLCJvZmYiLCJlbCIsImpCb3giLCJvcGVuIiwiaHJlZiIsImNsb3NlIiwiaW5pdExheW91dCIsInNob3dQb3BVcCIsImh0bWwiLCJsYXlvdXQiLCIkcG9wdXBJbnRybyIsImUiLCJ0YXJnZXQiLCJjbG9zZXN0IiwicHJldmVudERlZmF1bHQiLCJnZXRBdHRyaWJ1dGUiLCJjcmVhdGVUb3VyIiwic2V0VGltZW91dCIsImFjdGl2ZVRvdXJPcHRpb25zIiwialRvdXIiLCJwYXRoIiwicHV0QWN0aXZlVG91ckNvb2tpZXMiLCJzdGFydFRvdXJCeU5hbWUiLCJ0b3VyTmFtZSIsInRvdXJPcHRpb25zIiwiZ2V0VG91ckJ5TmFtZSIsInN0YXJ0VG91ciIsImkiLCJsZW5ndGgiLCJuYW1lIiwiZ2V0Q3VzdG9tVG91ciIsImZvcm0iLCJmb3JtRGF0YSIsInNlcmlhbGl6ZUFycmF5IiwiY3VyclN0ZXBzIiwiY3VzdG9tU3RlcHNJbmRleCIsInN0ZXBJbmRleCIsInZhbHVlIiwicHVzaCIsImRhdGEiLCJkYXRlIiwiRGF0ZSIsImRvbWFpbiIsIndpbmRvdyIsImxvY2F0aW9uIiwiaG9zdG5hbWUiLCJ0b3VyTWFzdGVyRGF0YSIsImdldENvb2tpZXMiLCJwdXRDb29raWVzIiwicGFyc2VUb3VyT3B0aW9ucyIsInRvdXJEYXRhIiwiT2JqZWN0IiwiYXNzaWduIiwiZ2V0QWN0aXZlVG91ckNvb2tpZXMiLCJjb29raWVzT3B0aW9ucyIsImRlbGV0ZUNvb2tpZXMiLCJwYXJzZVRvdXJDb29raWVEYXRhIiwidG91ckNvb2tpZXNEYXRhIiwia2V5IiwiY2FjaGVkSnNvbk9wdGlvbiIsImNvb2tpZSIsImpzb24iLCJ2YWwiLCJvcHQiLCJyZW1vdmVDb29raWUiLCJpc0VtcHR5UGF0aCIsImxhbmciLCJnZXRMYW5nIiwicmVnIiwiUmVnRXhwIiwiY3VyclBhdGgiLCJyZXBsYWNlIiwibG9jYWxQYXRoIiwicGF0aG5hbWUiLCJvYmpDbGFzcyIsImF0dHIiLCJzcGxpdCIsInBhdHRlcm4iLCJjbGFzc05hbWUiLCJwb3MiLCJpbmRleE9mIiwic2xpY2UiLCJMYXlvdXRUcGwiLCJwb3B1cDEiLCIkcG9wdXBEaXZhcmljYXRpb24iLCJwb3B1cDIiLCIkcG9wdXBUb3VycyIsInJlbmRlclBvcHVwVG91cnMiLCIkcG9wdXBTdGVwcyIsInJlbmRlclBvcHVwU3RlcHMiLCIkY29udGFpbmVyIiwiJGxheW91dENvbnRhaW5lciIsImFwcGVuZCIsInNvdXJjZSIsInBvcHVwMyIsInRlbXBsYXRlIiwiSGFuZGxlYmFycyIsImNvbXBpbGUiLCJjb250ZXh0IiwicG9wdXA0IiwiZ3JvdXBTdGVwcyIsImhhc1RpdGxlIiwiaiIsInRhZyIsInRpdGxlIiwicG9wdXAiLCJyZW1vdmUiLCJpc01lbnUiLCJqVG91ck1hc3RlciIsImlzQXJyYXkiXSwibWFwcGluZ3MiOiJBQUFBOztBQUVBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBNkNBOzs7Ozs7OztBQUVDLFdBQVVBLE9BQVYsRUFBbUI7QUFDbEIsTUFBSSxPQUFPQyxNQUFQLEtBQWtCLFVBQWxCLElBQWdDQSxPQUFPQyxHQUEzQyxFQUFnRDtBQUM5QztBQUNBRCxXQUFPLENBQUMsUUFBRCxDQUFQLEVBQW1CRCxPQUFuQjtBQUNELEdBSEQsTUFHTyxJQUFJLFFBQU9HLE9BQVAseUNBQU9BLE9BQVAsT0FBbUIsUUFBdkIsRUFBaUM7QUFDdEM7QUFDQUMsV0FBT0QsT0FBUCxHQUFpQkgsUUFBUUssUUFBUSxRQUFSLENBQVIsQ0FBakI7QUFDRCxHQUhNLE1BR0E7QUFDTDtBQUNBTCxZQUFRTSxNQUFS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QUNEOztBQUVELGNBQUlBLFFBQUosRUFBYzs7QUFFZEgsa0JBQVFFLFVBQVIsQ0FBbUI5RCxJQUFuQixDQUF3QjtBQUN0QmtFLG1CQUFPakssTUFBTW9GLENBQU4sRUFBUzRFO0FBRE0sV0FBeEI7QUFHRDs7QUFFRCxlQUFPUixTQUFTRyxPQUFULENBQVA7QUFDRDtBQXRjVTtBQUFBO0FBQUEsc0NBd2NLO0FBQ2QsWUFBSXpGLFNBQVMsS0FBS0QsSUFBTCxDQUFVQyxNQUF2Qjs7QUFFQSxhQUFLLElBQUlnRyxLQUFULElBQWtCaEcsTUFBbEIsRUFBMEI7QUFDeEJBLGlCQUFPZ0csS0FBUCxFQUFjQyxNQUFkO0FBQ0Q7O0FBRUQsYUFBS2xHLElBQUwsQ0FBVUMsTUFBVixHQUFtQixFQUFuQjtBQUNEO0FBaGRVOztBQUFBO0FBQUE7O0FBbWRiLE1BQU16QyxvQkFBb0I7QUFDeEI2RCxVQUFNLGFBRGtCO0FBRXhCOEUsWUFBUSxJQUZnQjtBQUd4QnBLLFdBQU87QUFIaUIsR0FBMUI7O0FBTUEsTUFBTXdCLHFCQUFxQjtBQUN6QjRJLFlBQVE7QUFEaUIsR0FBM0I7O0FBSUEsTUFBTXpCLFlBQVk7QUFDaEJDLG8xREFEZ0I7QUFpQmhCRSx1ekZBakJnQjtBQWdEaEJTLDRvQ0FoRGdCO0FBK0RoQks7QUEvRGdCLEdBQWxCOztBQTZGQWhLLElBQUV5SyxXQUFGLEdBQWdCLFVBQVV2SyxPQUFWLEVBQW1CO0FBQ2pDLFFBQUksUUFBT0EsT0FBUCx5Q0FBT0EsT0FBUCxPQUFtQixRQUFuQixJQUErQkYsRUFBRTBLLE9BQUYsQ0FBVXhLLFFBQVFFLEtBQWxCLENBQW5DLEVBQTZEO0FBQzNELGFBQU8sSUFBSUgscUJBQUosQ0FBMEJDLE9BQTFCLENBQVA7QUFDRCxLQUZELE1BRU87QUFDTCxhQUFPLElBQVA7QUFDRDtBQUNGLEdBTkQ7QUFRRCxDQTdrQkEsQ0FBRCIsImZpbGUiOiJqcy9qVG91ck1hc3Rlci5lczYuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvL1RPRE8gZXZlbnRzXG5cbi8qY29tbWVudHMqL1xuLypzdGVwcyBleGFtcGxlcyovXG4vKntcbiAgICAgICAgICAgIGVsZW1lbnQ6ICcjZWRpdC1zdWJtaXQnLFxuICAgICAgICAgICAgdGl0bGU6ICfQntGC0L/RgNCw0LLQuNGC0YwnLFxuICAgICAgICAgICAgY29udGVudDogJ9Ch0L7RhdGA0LDQvdC40YLQtSDRgdC10YDQuNC50L3Ri9C5INC90L7QvNC10YAnLFxuICAgICAgICAgICAgb25FbGVtZW50OiB7XG4gICAgICAgICAgICAgIGV2ZW50OiAnY2xpY2snLFxuICAgICAgICAgICAgICBoYW5kbGVyOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIGxldCAkdGFyZ2V0ID0gJChlLnRhcmdldCk7XG4gICAgICAgICAgICAgICAgbGV0IHRvdXIgPSBlLmRhdGEudG91ckNvbnRyb2xsZXI7XG5cbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICR0YXJnZXQudHJpZ2dlcih0b3VyLmFjdGl2ZVN0ZXAub25FbGVtZW50LmV2ZW50KTtcbiAgICAgICAgICAgICAgICB9LCA1MCk7XG4gICAgICAgICAgICAgICAgdG91ci5iaW5kTmV4dFN0ZXAoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAge1xuICAgICAgICAgICAgZWxlbWVudDogJyNlZGl0LXRoZW1lLXNldHRpbmdzIC5maWVsZHNldC1sZWdlbmQnLFxuICAgICAgICAgICAgdGl0bGU6ICfQktC60LvRjtGH0LjRgtGML9Cy0YvQutC70Y7Rh9C40YLRjCDQvtGC0L7QsdGA0LDQttC10L3QuNC1ICcsXG4gICAgICAgICAgICBjb250ZW50OiAn0KPQv9GA0LDQstC70LXQvdC40LUg0L7RgtC+0LHRgNCw0LbQtdC90LjQtdC8INGN0LvQtdC80LXQvdGC0L7QsiDRgdGC0YDQsNC90LjRhtGLLiDQntGB0YLQsNCy0YzRgtC1INCx0LXQtyDQuNC30LzQtdC90LXQvdC40LksINC10YHQu9C4INC90LUg0YPQstC10YDQtdC90YsuJyxcbiAgICAgICAgICAgIHBhdGg6ICcvYWRtaW4vYXBwZWFyYW5jZS9zZXR0aW5ncy9qZmxleC8nLFxuICAgICAgICAgICAgaXNNZW51U3RlcDogdHJ1ZSxcbiAgICAgICAgICAgIG1lbnVUaXRsZTogJ9C90LDRgdGC0YDQvtC50LrQuCDQvtGE0L7RgNC80LvQtdC90LjRjydcbiAgICAgICAgICB9LFxuXG4gICAgICAgICAgQ3VzdG9tIHN0ZXBzIGZvciBnYXRoZXJpbmcgaW4gb25lIHRvdXJcblxuICAgICAgICAgIHtcbiAgICAgICAgZWxlbWVudDogJy5qc19fanRvdXItc3RlcDEnLFxuICAgICAgICB0aXRsZTogJ3N0ZXAgMScsXG4gICAgICAgIHRhZzogJ9Ck0YPQvdC60YbQuNC+0L3QsNC70YzQvdGL0LUg0L7Qv9GG0LjQuCDQuNC90YLQtdGA0L3QtdGCLdC80LDQs9Cw0LfQuNC90LAnLCAvL9CyINGC0YPRgNC80LDRgdGC0LXRgNC1INCyIHBvcHVwNCDRiNCw0LPQuCDQv9C+INC+0LTQvdC+0Lkg0YLQtdC80LUg0LPRgNGD0L/Qv9C40YDRg9GO0YLRgdGPINCy0LzQtdGB0YLQtSwg0YEg0L7QtNC90LjQvCDQt9Cw0LPQvtC70L7QstC60L7QvFxuICAgICAgICBjb250ZW50OiAnc29tZSBibGEtYmxhLWJsYScsXG4gICAgICAgIHBhdGg6ICcvcmV2aWV3L2ZsZXhfYWRtaW5fdG91ci90ZXN0Mi5odG1sJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgZWxlbWVudDogJy5qc19fanRvdXItc3RlcDInLFxuICAgICAgICB0aXRsZTogJ3N0ZXAgMicsXG4gICAgICAgIHRhZzogJ9Ck0YPQvdC60YbQuNC+0L3QsNC70YzQvdGL0LUg0L7Qv9GG0LjQuCDQuNC90YLQtdGA0L3QtdGCLdC80LDQs9Cw0LfQuNC90LAnLFxuICAgICAgICBjb250ZW50OiAnc29tZSBibGEtYmxhLWJsYScsXG4gICAgICAgIHBhdGg6ICcvcmV2aWV3L2ZsZXhfYWRtaW5fdG91ci90ZXN0Mi5odG1sJ1xuICAgICAgfSxcbiovXG4ndXNlIHN0cmljdCc7XG5cbihmdW5jdGlvbiAoZmFjdG9yeSkge1xuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgLy8gQU1EIChSZWdpc3RlciBhcyBhbiBhbm9ueW1vdXMgbW9kdWxlKVxuICAgIGRlZmluZShbJ2pxdWVyeSddLCBmYWN0b3J5KTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAvLyBOb2RlL0NvbW1vbkpTXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJlcXVpcmUoJ2pxdWVyeScpKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBCcm93c2VyIGdsb2JhbHNcbiAgICBmYWN0b3J5KGpRdWVyeSk7XG4gIH1cbn0oZnVuY3Rpb24gKCQpIHtcbiAgY2xhc3MgSlRvdXJNYXN0ZXJDb250cm9sbGVyIHtcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgICB0aGlzLnRvdXJzID0gb3B0aW9ucy50b3VycztcbiAgICAgIHRoaXMuc3RlcHMgPSBvcHRpb25zLnN0ZXBzO1xuICAgICAgdGhpcy5qYm94T3B0aW9ucyA9IG9wdGlvbnMuamJveE9wdGlvbnMgfHwge307XG4gICAgICB0aGlzLmRlZmF1bHRUb3VyT3B0aW9ucyA9IG9wdGlvbnMuZGVmYXVsdFRvdXJPcHRpb25zIHx8IHt9O1xuICAgICAgdGhpcy5nb3RvUG9wVXBBdHRyID0gb3B0aW9ucy5nb3RvUG9wVXBBdHRyIHx8ICdkYXRhLXNob3ctcG9wdXAnO1xuICAgICAgdGhpcy5zdGFydFRvdXJCeU5hbWVBdHRyID0gb3B0aW9ucy5zdGFydFRvdXJCeU5hbWVBdHRyIHx8ICdkYXRhLXN0YXJ0LXRvdXInO1xuICAgICAgdGhpcy5jbG9zZVBvcHVwQnRuID0gb3B0aW9ucy5jbG9zZVBvcHVwQnRuIHx8ICcuanNfX2pib3gtY2xvc2UnO1xuICAgICAgdGhpcy5jdXN0b21UZW1wbGF0ZUZvcm0gPSAnI2N1c3RvbS10ZW1wbGF0ZS1mb3JtJztcbiAgICAgIHRoaXMuY3VzdG9tVG91ck9wdGlvbnMgPSBvcHRpb25zLmN1c3RvbVRvdXJPcHRpb25zIHx8IHt9O1xuICAgICAgdGhpcy5hdXRvc3RhcnQgPSBvcHRpb25zLmF1dG9zdGFydCB8fCBmYWxzZTtcbiAgICAgIHRoaXMuYXV0b3N0YXJ0UGF0aCA9IG9wdGlvbnMuYXV0b3N0YXJ0UGF0aCB8fCAnJztcbiAgICAgIHRoaXMuYXV0b3N0YXJ0Q29uZGl0aW9uID0gb3B0aW9ucy5hdXRvc3RhcnRDb25kaXRpb24gfHwgJ25vbmUnOyAvLyAnbm9uZScsICduZXcnXG4gICAgICB0aGlzLmF1dG9zdGFydENvbmRpdGlvbkZ1bmMgPSBvcHRpb25zLmF1dG9zdGFydENvbmRpdGlvbkZ1bmMgfHwgbnVsbDtcbiAgICAgIHRoaXMudG91ciA9IG51bGw7XG4gICAgICB0aGlzLmxpc3RlbmVkRWwgPSBvcHRpb25zLmxpc3RlbmVkRWwgfHwgZG9jdW1lbnQuYm9keTtcbiAgICAgIHRoaXMubGF5b3V0Q29udGFpbmVyID0gb3B0aW9ucy5sYXlvdXRDb250YWluZXIgfHwgZG9jdW1lbnQuYm9keTtcbiAgICAgIHRoaXMuZXZlbnRzID0ge307XG4gICAgICB0aGlzLmFjdGl2ZVRvdXJLZXkgPSAndG91ci1tYXN0ZXItYWN0aXZlLXRvdXInO1xuXG4gICAgICB0aGlzLmluaXQoKTtcbiAgICB9XG5cbiAgICBpbml0KCkge1xuICAgICAgbGV0IGhhc0F1dG9zdGFydCA9IHRoaXMuYXV0b3N0YXJ0ICYmIHRoaXMuaXNTYW1lUGF0aCh0aGlzLmF1dG9zdGFydFBhdGgpO1xuICAgICAgbGV0IGhhc0Nvb2tpZXNTdGFydCA9IHRoaXMuaGFzQ29va2llc1N0YXJ0KCk7XG5cbiAgICAgIHRoaXMuZGVmYXVsdFRvdXJPcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIERlZmF1bHRUb3VyT3B0aW9ucywgdGhpcy5kZWZhdWx0VG91ck9wdGlvbnMpO1xuICAgICAgdGhpcy5jdXN0b21Ub3VyT3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBDdXN0b21Ub3VyT3B0aW9ucywgdGhpcy5jdXN0b21Ub3VyT3B0aW9ucyk7XG5cbiAgICAgIGlmIChcbiAgICAgICAgIWhhc0F1dG9zdGFydCAmJlxuICAgICAgICAhaGFzQ29va2llc1N0YXJ0XG4gICAgICApIHJldHVybjtcblxuICAgICAgaWYgKGhhc0Nvb2tpZXNTdGFydCkge1xuICAgICAgICBsZXQgc3RhcnQgPSB0aGlzLm9uQ29va2llc1N0YXJ0KCk7XG5cbiAgICAgICAgaWYgKHN0YXJ0KSByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChoYXNBdXRvc3RhcnQpIHtcbiAgICAgICAgbGV0IHN0YXJ0ID0gdGhpcy5ydW5BdXRvc3RhcnQoKTtcblxuICAgICAgICBpZiAoc3RhcnQpIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpbml0TGF5b3V0KCkge1xuICAgICAgaWYgKHRoaXMuaXNMYXlvdXQpIHJldHVybjtcblxuICAgICAgaWYgKHRoaXMuaXNBdHRhY2hlZEhhbmRsZXJzKSB7XG4gICAgICAgIHRoaXMuZGV0YWNoSGFuZGxlcnMoKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5yZW5kZXJMYXlvdXQoKTtcbiAgICAgIHRoaXMuYmluZEVsZW1lbnRzKCk7XG4gICAgICB0aGlzLmJpbmRIYW5kbGVycygpO1xuICAgICAgdGhpcy5hdHRhY2hIYW5kbGVycygpO1xuXG4gICAgICB0aGlzLmlzTGF5b3V0ID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBzdG9wKCkge1xuICAgICAgaWYgKHRoaXMudG91cikge1xuICAgICAgICB0aGlzLnRvdXIuc3RvcCgpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmhpZGVQb3BVcCgpO1xuICAgICAgdGhpcy5kZXRhY2hIYW5kbGVycygpO1xuICAgICAgdGhpcy5kZXN0cm95TGF5b3V0KCk7XG4gICAgICB0aGlzLmlzTGF5b3V0ID0gZmFsc2U7XG4gICAgfVxuXG4gICAgc3RhcnQoKSB7XG4gICAgICB0aGlzLnN0YXJ0VG91ck1hc3RlcigpO1xuICAgIH1cblxuICAgIHJ1bkF1dG9zdGFydCgpIHtcbiAgICAgIGlmICh0eXBlb2YgdGhpcy5hdXRvc3RhcnRDb25kaXRpb25GdW5jID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGlmICh0aGlzLmF1dG9zdGFydENvbmRpdGlvbkZ1bmModGhpcykpIHtcbiAgICAgICAgICB0aGlzLnN0YXJ0KCk7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHN3aXRjaCAodGhpcy5hdXRvc3RhcnRDb25kaXRpb24pIHtcbiAgICAgICAgY2FzZSAnbm9uZSc6XG4gICAgICAgICAgdGhpcy5zdGFydCgpO1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICBjYXNlICAnbmV3JzpcbiAgICAgICAgICByZXR1cm4gdGhpcy5maXJzdFRpbWVUb3VyTWFzdGVyU3RhcnQoKTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgYmluZEVsZW1lbnRzKCkge1xuICAgICAgdGhpcy4kZ290b1BvcHVwQnRuID0gJChgWyR7dGhpcy5nb3RvUG9wVXBBdHRyfV1gKTtcbiAgICAgIHRoaXMuJGNsb3NlUG9wdXBCdG4gPSAkKHRoaXMuY2xvc2VQb3B1cEJ0bik7XG4gICAgICB0aGlzLiRzdGFydFRvdXJCeU5hbWVCdG4gPSAkKGBbJHt0aGlzLnN0YXJ0VG91ckJ5TmFtZUF0dHJ9XWApO1xuICAgICAgdGhpcy4kY3VzdG9tVGVtcGxhdGVGb3JtID0gJCh0aGlzLmN1c3RvbVRlbXBsYXRlRm9ybSk7XG4gICAgICB0aGlzLiRsaXN0ZW5lZEVsID0gJCh0aGlzLmxpc3RlbmVkRWwpO1xuICAgIH1cblxuICAgIGJpbmRIYW5kbGVycygpIHtcbiAgICAgIHRoaXMuX2dvdG9Qb3BVcEhhbmRsZXIgPSB0aGlzLmdvdG9Qb3BVcEhhbmRsZXIuYmluZCh0aGlzKTtcbiAgICAgIHRoaXMuX2hpZGVQb3BVcCA9IHRoaXMuaGlkZVBvcFVwLmJpbmQodGhpcyk7XG4gICAgICB0aGlzLl9zdGFydFRvdXJCeU5hbWVIYW5kbGVyID0gdGhpcy5zdGFydFRvdXJCeU5hbWVIYW5kbGVyLmJpbmQodGhpcyk7XG4gICAgICB0aGlzLl9zdGFydEN1c3RvbVRvdXJIYW5kbGVyID0gdGhpcy5zdGFydEN1c3RvbVRvdXJIYW5kbGVyLmJpbmQodGhpcyk7XG4gICAgICB0aGlzLl9nb3RvTmV4dFBhZ2VIYW5kbGVyID0gdGhpcy5nb3RvTmV4dFBhZ2VIYW5kbGVyLmJpbmQodGhpcyk7XG4gICAgfVxuXG4gICAgYXR0YWNoSGFuZGxlcnMoKSB7XG4gICAgICB0aGlzLiRnb3RvUG9wdXBCdG4ub24oJ2NsaWNrJywgdGhpcy5fZ290b1BvcFVwSGFuZGxlcik7XG4gICAgICB0aGlzLiRjbG9zZVBvcHVwQnRuLm9uKCdjbGljaycsIHRoaXMuX2hpZGVQb3BVcCk7XG4gICAgICB0aGlzLiRzdGFydFRvdXJCeU5hbWVCdG4ub24oJ2NsaWNrJywgdGhpcy5fc3RhcnRUb3VyQnlOYW1lSGFuZGxlcik7XG4gICAgICB0aGlzLiRjdXN0b21UZW1wbGF0ZUZvcm0ub24oJ3N1Ym1pdCcsIHRoaXMuX3N0YXJ0Q3VzdG9tVG91ckhhbmRsZXIpO1xuICAgICAgdGhpcy4kbGlzdGVuZWRFbC5vbignalRvdXI6dG91ckdvTmV4dFBhZ2UnLCB0aGlzLl9nb3RvTmV4dFBhZ2VIYW5kbGVyKTtcblxuICAgICAgdGhpcy5pc0F0dGFjaGVkSGFuZGxlcnMgPSB0cnVlO1xuICAgIH1cblxuICAgIGRldGFjaEhhbmRsZXJzKCkge1xuICAgICAgdGhpcy4kZ290b1BvcHVwQnRuLm9mZignY2xpY2snLCB0aGlzLl9nb3RvUG9wVXBIYW5kbGVyKTtcbiAgICAgIHRoaXMuJGNsb3NlUG9wdXBCdG4ub2ZmKCdjbGljaycsIHRoaXMuX2hpZGVQb3BVcCk7XG4gICAgICB0aGlzLiRzdGFydFRvdXJCeU5hbWVCdG4ub2ZmKCdjbGljaycsIHRoaXMuX3N0YXJ0VG91ckJ5TmFtZUhhbmRsZXIpO1xuICAgICAgdGhpcy4kY3VzdG9tVGVtcGxhdGVGb3JtLm9mZignc3VibWl0JywgdGhpcy5fc3RhcnRDdXN0b21Ub3VySGFuZGxlcik7XG4gICAgICB0aGlzLiRsaXN0ZW5lZEVsLm9mZignalRvdXI6dG91ckdvTmV4dFBhZ2UnLCB0aGlzLl9nb3RvTmV4dFBhZ2VIYW5kbGVyKTtcblxuICAgICAgdGhpcy5pc0F0dGFjaGVkSGFuZGxlcnMgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBzaG93UG9wVXAoZWwpIHtcbiAgICAgICQuakJveC5vcGVuKCQuZXh0ZW5kKHRydWUsIHt9LCB0aGlzLmpib3hPcHRpb25zLCB7aHJlZjogZWx9KSk7XG4gICAgfVxuXG4gICAgaGlkZVBvcFVwKCkge1xuICAgICAgJC5qQm94LmNsb3NlKCk7XG4gICAgfVxuXG4gICAgc3RhcnRUb3VyTWFzdGVyKCkge1xuICAgICAgaWYgKCF0aGlzLmlzTGF5b3V0KSB7XG4gICAgICAgIHRoaXMuaW5pdExheW91dCgpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnNob3dQb3BVcCh0aGlzLmh0bWwubGF5b3V0LiRwb3B1cEludHJvKTtcbiAgICB9XG5cbiAgICBnb3RvUG9wVXBIYW5kbGVyKGUpIHtcbiAgICAgIGxldCBlbCA9IGUudGFyZ2V0O1xuICAgICAgbGV0IHRhcmdldCA9IGVsLmNsb3Nlc3QoYFske3RoaXMuZ290b1BvcFVwQXR0cn1dYCk7XG5cbiAgICAgIGlmICghdGFyZ2V0KSByZXR1cm47XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIHRoaXMuc2hvd1BvcFVwKHRhcmdldC5nZXRBdHRyaWJ1dGUodGhpcy5nb3RvUG9wVXBBdHRyKSk7XG4gICAgfVxuXG4gICAgc3RhcnRUb3VyKG9wdGlvbnMpIHtcbiAgICAgIHRoaXMuY3JlYXRlVG91cihvcHRpb25zKTtcblxuICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMudG91ci5zdGFydCgpO1xuICAgICAgfS5iaW5kKHRoaXMpLFxuICAgICAgMjAwKVxuICAgIH1cblxuICAgIGNyZWF0ZVRvdXIob3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHRoaXMuZGVmYXVsdFRvdXJPcHRpb25zLCBvcHRpb25zKTtcbiAgICAgIHRoaXMuYWN0aXZlVG91ck9wdGlvbnMgPSBvcHRpb25zO1xuICAgICAgdGhpcy50b3VyID0gJC5qVG91cihvcHRpb25zKTtcblxuICAgICAgcmV0dXJuIHRoaXMudG91cjtcbiAgICB9XG5cbiAgICBnb3RvTmV4dFBhZ2VIYW5kbGVyKGUsIHBhdGgsIHRvdXIpIHtcblxuICAgICAgaWYgKHRvdXIgIT09IHRoaXMudG91cikgcmV0dXJuO1xuXG4gICAgICB0aGlzLnB1dEFjdGl2ZVRvdXJDb29raWVzKHBhdGgpO1xuICAgIH1cblxuICAgIHN0YXJ0VG91ckJ5TmFtZUhhbmRsZXIoZSkge1xuICAgICAgbGV0IGVsID0gZS50YXJnZXQ7XG4gICAgICBsZXQgdGFyZ2V0ID0gZWwuY2xvc2VzdChgWyR7dGhpcy5zdGFydFRvdXJCeU5hbWVBdHRyfV1gKTtcblxuICAgICAgaWYgKCF0YXJnZXQpIHJldHVybjtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgdGhpcy5oaWRlUG9wVXAoKTtcbiAgICAgIHRoaXMuc3RhcnRUb3VyQnlOYW1lKHRhcmdldC5nZXRBdHRyaWJ1dGUodGhpcy5zdGFydFRvdXJCeU5hbWVBdHRyKSk7XG4gICAgfVxuXG4gICAgc3RhcnRUb3VyQnlOYW1lKHRvdXJOYW1lKSB7XG4gICAgICBsZXQgdG91ck9wdGlvbnMgPSB0aGlzLmdldFRvdXJCeU5hbWUodG91ck5hbWUpO1xuXG4gICAgICBpZiAoIXRvdXJPcHRpb25zKSByZXR1cm47XG5cbiAgICAgIHRoaXMuc3RhcnRUb3VyKHRvdXJPcHRpb25zKTtcbiAgICB9XG5cbiAgICBnZXRUb3VyQnlOYW1lKHRvdXJOYW1lKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMudG91cnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHRoaXMudG91cnNbaV0ubmFtZSAhPT0gdG91ck5hbWUpIGNvbnRpbnVlO1xuXG4gICAgICAgIHJldHVybiB0aGlzLnRvdXJzW2ldO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBzdGFydEN1c3RvbVRvdXJIYW5kbGVyKGUpIHtcbiAgICAgIGxldCBlbCA9IGUudGFyZ2V0O1xuICAgICAgbGV0IHRhcmdldCA9IGVsLmNsb3Nlc3QodGhpcy5jdXN0b21UZW1wbGF0ZUZvcm0pO1xuXG4gICAgICBpZiAoIXRhcmdldCkgcmV0dXJuO1xuXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIGxldCBvcHRpb25zID0gdGhpcy5nZXRDdXN0b21Ub3VyKHRhcmdldCk7XG5cbiAgICAgIGlmICghb3B0aW9ucykgcmV0dXJuO1xuXG4gICAgICB0aGlzLmhpZGVQb3BVcCgpO1xuICAgICAgdGhpcy5zdGFydFRvdXIob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgZ2V0Q3VzdG9tVG91cihmb3JtKSB7XG4gICAgICBsZXQgZm9ybURhdGEgPSAkKGZvcm0pLnNlcmlhbGl6ZUFycmF5KCk7XG4gICAgICBsZXQgdG91ck9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgdGhpcy5jdXN0b21Ub3VyT3B0aW9ucyk7XG4gICAgICBsZXQgY3VyclN0ZXBzID0gW107XG4gICAgICBsZXQgY3VzdG9tU3RlcHNJbmRleCA9IHRoaXMuY3VzdG9tU3RlcHNJbmRleCA9IFtdO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZvcm1EYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCBzdGVwSW5kZXggPSArZm9ybURhdGFbaV0udmFsdWU7XG5cbiAgICAgICAgY3VyclN0ZXBzLnB1c2godGhpcy5zdGVwc1tzdGVwSW5kZXhdKTtcbiAgICAgICAgY3VzdG9tU3RlcHNJbmRleC5wdXNoKHN0ZXBJbmRleCk7XG4gICAgICB9XG5cbiAgICAgIHRvdXJPcHRpb25zLnN0ZXBzID0gY3VyclN0ZXBzO1xuXG4gICAgICByZXR1cm4gdG91ck9wdGlvbnM7XG4gICAgfVxuXG4gICAgZmlyc3RUaW1lVG91ck1hc3RlclN0YXJ0KCkge1xuICAgICAgbGV0IG5hbWUgPSAndG91ci1tYXN0ZXInO1xuICAgICAgbGV0IGRhdGEgPSB7XG4gICAgICAgIGRhdGU6IG5ldyBEYXRlKClcbiAgICAgIH07XG4gICAgICBsZXQgb3B0aW9ucyA9IHtcbiAgICAgICAgZG9tYWluOiB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWVcbiAgICAgIH07XG4gICAgICBsZXQgdG91ck1hc3RlckRhdGEgPSB0aGlzLmdldENvb2tpZXMobmFtZSk7XG5cbiAgICAgIGlmICh0b3VyTWFzdGVyRGF0YSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgICB0aGlzLnB1dENvb2tpZXMobmFtZSwgZGF0YSwgb3B0aW9ucyk7XG4gICAgICB0aGlzLnN0YXJ0VG91ck1hc3RlcigpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcHV0QWN0aXZlVG91ckNvb2tpZXMocGF0aCkge1xuICAgICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgICAgcGF0aDogJy8nXG4gICAgICB9O1xuICAgICAgY29uc3QgdG91ck9wdGlvbnMgPSB0aGlzLnBhcnNlVG91ck9wdGlvbnModGhpcy5hY3RpdmVUb3VyT3B0aW9ucyk7XG4gICAgICBjb25zdCB0b3VyRGF0YSA9IE9iamVjdC5hc3NpZ24oe30sIHRvdXJPcHRpb25zLCB7IHBhdGggfSk7XG5cblxuICAgICAgdGhpcy5wdXRDb29raWVzKHRoaXMuYWN0aXZlVG91cktleSwgdG91ckRhdGEsIG9wdGlvbnMpO1xuICAgIH1cblxuICAgIGhhc0Nvb2tpZXNTdGFydCgpIHtcbiAgICAgIHJldHVybiAhIXRoaXMuZ2V0QWN0aXZlVG91ckNvb2tpZXMoKTtcbiAgICB9XG5cblxuICAgIG9uQ29va2llc1N0YXJ0KCkge1xuICAgICAgbGV0IHRvdXJEYXRhID0gdGhpcy5nZXRBY3RpdmVUb3VyQ29va2llcygpO1xuICAgICAgbGV0IGNvb2tpZXNPcHRpb25zID0ge1xuICAgICAgICBwYXRoOiAnLydcbiAgICAgIH07XG5cbiAgICAgIGlmICghdG91ckRhdGEpIHJldHVybiBmYWxzZTtcblxuICAgICAgdGhpcy5pbml0TGF5b3V0KCk7XG4gICAgICB0aGlzLmRlbGV0ZUNvb2tpZXModGhpcy5hY3RpdmVUb3VyS2V5LCBjb29raWVzT3B0aW9ucyk7XG4gICAgICB0aGlzLmNyZWF0ZVRvdXIodGhpcy5wYXJzZVRvdXJDb29raWVEYXRhKHRvdXJEYXRhKSk7XG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH07XG5cbiAgICBnZXRBY3RpdmVUb3VyQ29va2llcygpIHtcbiAgICAgIGNvbnN0IHRvdXJEYXRhID0gdGhpcy5nZXRDb29raWVzKHRoaXMuYWN0aXZlVG91cktleSk7XG5cbiAgICAgIGlmICghdG91ckRhdGEgfHwgIXRoaXMuaXNTYW1lUGF0aCh0b3VyRGF0YS5wYXRoKSkgcmV0dXJuIG51bGw7XG5cbiAgICAgIHJldHVybiB0b3VyRGF0YTtcbiAgICB9XG5cbiAgICBjcmVhdGVUb3VyRnJvbUNvb2tpZXModG91ckRhdGEpIHtcbiAgICAgIGxldCB0b3VyT3B0aW9ucyA9IHRoaXMucGFyc2VUb3VyQ29va2llRGF0YSh0b3VyRGF0YSk7XG5cbiAgICAgIGlmICh0b3VyRGF0YS5jdXN0b21TdGVwc0luZGV4KSB7XG4gICAgICAgIHRoaXMuY3VzdG9tU3RlcHNJbmRleCA9IHRvdXJEYXRhLmN1c3RvbVN0ZXBzSW5kZXg7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuYWN0aXZlVG91ck9wdGlvbnMgPSB0b3VyT3B0aW9ucztcblxuICAgICAgdGhpcy50b3VyID0gJC5qVG91cih0b3VyT3B0aW9ucyk7XG4gICAgfVxuXG4gICAgcGFyc2VUb3VyT3B0aW9ucyhvcHRpb25zKSB7XG4gICAgICBsZXQgdG91ckNvb2tpZXNEYXRhID0ge1xuICAgICAgICBuYW1lOiBvcHRpb25zLm5hbWVcbiAgICAgIH07XG5cbiAgICAgIGlmIChvcHRpb25zLm5hbWUgIT09IHRoaXMuY3VzdG9tVG91ck9wdGlvbnMubmFtZSkgcmV0dXJuIHRvdXJDb29raWVzRGF0YTtcblxuICAgICAgdG91ckNvb2tpZXNEYXRhLnN0ZXBzID0gdGhpcy5jdXN0b21TdGVwc0luZGV4O1xuICAgICAgcmV0dXJuIHRvdXJDb29raWVzRGF0YTtcbiAgICB9XG5cbiAgICBwYXJzZVRvdXJDb29raWVEYXRhKHRvdXJEYXRhKSB7XG4gICAgICBsZXQgdG91ck9wdGlvbnM7XG5cbiAgICAgIGlmICh0b3VyRGF0YSAhPT0gdGhpcy5jdXN0b21Ub3VyT3B0aW9ucy5uYW1lKSB7XG4gICAgICAgIHRvdXJPcHRpb25zID0gdGhpcy5nZXRUb3VyQnlOYW1lKHRvdXJEYXRhLm5hbWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdG91ck9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgdGhpcy5jdXN0b21Ub3VyT3B0aW9ucyk7XG4gICAgICAgIHRvdXJPcHRpb25zLnN0ZXBzID0gW107XG4gICAgICAgIHRoaXMuY3VzdG9tU3RlcHNJbmRleCA9IHRvdXJEYXRhLmN1c3RvbVN0ZXBzSW5kZXg7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0b3VyRGF0YS5jdXN0b21TdGVwc0luZGV4OyBpKyspIHtcbiAgICAgICAgICB0b3VyT3B0aW9ucy5zdGVwcy5wdXNoKHRoaXMuc3RlcHNbdG91ckRhdGEuY3VzdG9tU3RlcHNJbmRleFtpXV0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0b3VyT3B0aW9ucztcbiAgICB9XG5cbiAgICBnZXRDb29raWVzKGtleSkge1xuICAgICAgbGV0IGNhY2hlZEpzb25PcHRpb24gPSAkLmNvb2tpZS5qc29uO1xuICAgICAgJC5jb29raWUuanNvbiA9IHRydWU7XG4gICAgICBsZXQgY29va2llID0gJC5jb29raWUoa2V5KTtcbiAgICAgICQuY29va2llLmpzb24gPSBjYWNoZWRKc29uT3B0aW9uO1xuXG4gICAgICByZXR1cm4gY29va2llO1xuICAgIH1cblxuICAgIHB1dENvb2tpZXMoa2V5LCB2YWwsIG9wdCkge1xuICAgICAgbGV0IGNhY2hlZEpzb25PcHRpb24gPSAkLmNvb2tpZS5qc29uO1xuICAgICAgJC5jb29raWUuanNvbiA9IHRydWU7XG4gICAgICAkLmNvb2tpZShrZXksIHZhbCwgb3B0KTtcbiAgICAgICQuY29va2llLmpzb24gPSBjYWNoZWRKc29uT3B0aW9uO1xuICAgIH1cblxuICAgIGRlbGV0ZUNvb2tpZXMoa2V5LCBvcHQpIHtcbiAgICAgIHJldHVybiAkLnJlbW92ZUNvb2tpZShrZXksIG9wdCk7XG4gICAgfVxuXG4gICAgaXNTYW1lUGF0aChwYXRoLCBpc0VtcHR5UGF0aCkge1xuICAgICAgY29uc3QgbGFuZyA9IHRoaXMuZ2V0TGFuZygpO1xuICAgICAgY29uc3QgcmVnID0gbGFuZyA/IG5ldyBSZWdFeHAoYC8ke2xhbmd9L2AsICdnJykgOiBudWxsO1xuICAgICAgY29uc3QgY3VyclBhdGggPSBwYXRoLnJlcGxhY2UocmVnLCAnLycpO1xuICAgICAgY29uc3QgbG9jYWxQYXRoID0gIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5yZXBsYWNlKHJlZywgJy8nKTtcblxuICAgICAgaWYgKGN1cnJQYXRoID09PSBsb2NhbFBhdGggfHwgKGN1cnJQYXRoID09PSAnJyAmJiBpc0VtcHR5UGF0aCkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBnZXRMYW5nKCkge1xuICAgICAgY29uc3Qgb2JqQ2xhc3MgPSAkKCdib2R5JykuYXR0cignY2xhc3MnKS5zcGxpdCgvXFxzKy8pO1xuICAgICAgY29uc3QgcGF0dGVybiA9ICdpMThuLSc7XG5cbiAgICAgIGZvciAoY29uc3QgY2xhc3NOYW1lIG9mIG9iakNsYXNzKSB7XG4gICAgICAgIGNvbnN0IHBvcyA9IGNsYXNzTmFtZSAuaW5kZXhPZignaTE4bi0nKTtcbiAgICAgICAgaWYgKHBvcyA9PT0gLTEpIGNvbnRpbnVlO1xuXG4gICAgICAgIHJldHVybiBjbGFzc05hbWUgLnNsaWNlKHBvcyArIHBhdHRlcm4ubGVuZ3RoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmVuZGVyTGF5b3V0KCkge1xuICAgICAgbGV0ICRwb3B1cEludHJvID0gJChMYXlvdXRUcGwucG9wdXAxKTtcbiAgICAgIGxldCAkcG9wdXBEaXZhcmljYXRpb24gPSAkKExheW91dFRwbC5wb3B1cDIpO1xuICAgICAgbGV0ICRwb3B1cFRvdXJzID0gJCh0aGlzLnJlbmRlclBvcHVwVG91cnModGhpcy50b3VycykpO1xuICAgICAgbGV0ICRwb3B1cFN0ZXBzID0gJCh0aGlzLnJlbmRlclBvcHVwU3RlcHModGhpcy5zdGVwcykpO1xuICAgICAgbGV0ICRjb250YWluZXIgPSAkKHRoaXMubGF5b3V0Q29udGFpbmVyKTtcblxuICAgICAgdGhpcy5odG1sID0ge1xuICAgICAgICBsYXlvdXQ6IHtcbiAgICAgICAgICAkcG9wdXBJbnRybzogJHBvcHVwSW50cm8sXG4gICAgICAgICAgJHBvcHVwRGl2YXJpY2F0aW9uOiAkcG9wdXBEaXZhcmljYXRpb24sXG4gICAgICAgICAgJHBvcHVwVG91cnM6ICRwb3B1cFRvdXJzLFxuICAgICAgICAgICRwb3B1cFN0ZXBzOiAkcG9wdXBTdGVwc1xuICAgICAgICB9LFxuICAgICAgICAkbGF5b3V0Q29udGFpbmVyOiAkY29udGFpbmVyXG4gICAgICB9O1xuXG4gICAgICAkY29udGFpbmVyXG4gICAgICAgIC5hcHBlbmQoJHBvcHVwSW50cm8pXG4gICAgICAgIC5hcHBlbmQoJHBvcHVwRGl2YXJpY2F0aW9uKVxuICAgICAgICAuYXBwZW5kKCRwb3B1cFRvdXJzKVxuICAgICAgICAuYXBwZW5kKCRwb3B1cFN0ZXBzKTtcbiAgICB9XG5cbiAgICByZW5kZXJQb3B1cFRvdXJzKHRvdXJzKSB7XG4gICAgICBsZXQgc291cmNlID0gTGF5b3V0VHBsLnBvcHVwMztcbiAgICAgIGxldCB0ZW1wbGF0ZSA9IEhhbmRsZWJhcnMuY29tcGlsZShzb3VyY2UpO1xuICAgICAgbGV0IGNvbnRleHQgPSB7XG4gICAgICAgIHRvdXJzOiB0b3Vyc1xuICAgICAgfTtcblxuICAgICAgcmV0dXJuIHRlbXBsYXRlKGNvbnRleHQpO1xuICAgIH1cblxuICAgIHJlbmRlclBvcHVwU3RlcHMoc3RlcHMpIHtcbiAgICAgIGxldCBzb3VyY2UgPSBMYXlvdXRUcGwucG9wdXA0O1xuICAgICAgbGV0IHRlbXBsYXRlID0gSGFuZGxlYmFycy5jb21waWxlKHNvdXJjZSk7XG4gICAgICBsZXQgY29udGV4dCA9IHtcbiAgICAgICAgc3RlcHM6IHN0ZXBzLFxuICAgICAgICBncm91cFN0ZXBzOiBbXVxuICAgICAgfTtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdGVwcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBsZXQgaGFzVGl0bGUgPSBmYWxzZTtcblxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNvbnRleHQuZ3JvdXBTdGVwcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgIGlmIChzdGVwc1tpXS50YWcgIT09IGNvbnRleHQuZ3JvdXBTdGVwc1tqXS50aXRsZSkgY29udGludWU7XG5cbiAgICAgICAgICBoYXNUaXRsZSA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaGFzVGl0bGUpIGNvbnRpbnVlO1xuXG4gICAgICAgIGNvbnRleHQuZ3JvdXBTdGVwcy5wdXNoKHtcbiAgICAgICAgICB0aXRsZTogc3RlcHNbaV0udGFnXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGVtcGxhdGUoY29udGV4dCk7XG4gICAgfVxuXG4gICAgZGVzdHJveUxheW91dCgpIHtcbiAgICAgIHZhciBsYXlvdXQgPSB0aGlzLmh0bWwubGF5b3V0O1xuXG4gICAgICBmb3IgKGxldCBwb3B1cCBpbiBsYXlvdXQpIHtcbiAgICAgICAgbGF5b3V0W3BvcHVwXS5yZW1vdmUoKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5odG1sLmxheW91dCA9IHt9O1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IEN1c3RvbVRvdXJPcHRpb25zID0ge1xuICAgIG5hbWU6ICdjdXN0b20tdG91cicsXG4gICAgaXNNZW51OiB0cnVlLFxuICAgIHN0ZXBzOiBbXVxuICB9O1xuXG4gIGNvbnN0IERlZmF1bHRUb3VyT3B0aW9ucyA9IHtcbiAgICBpc01lbnU6IHRydWVcbiAgfTtcblxuICBjb25zdCBMYXlvdXRUcGwgPSB7XG4gICAgcG9wdXAxOiBgPGRpdiBpZD1cInRvdXItbWFzdGVyX19wb3B1cC0xXCIgY2xhc3M9XCJ0b3VyLW1hc3Rlcl9fcG9wdXAtMSB0b3VyX19wb3B1cCBjZW50ZXIgaGlkZVwiPlxuICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJwcmVsb2FkZXJcIiBjbGFzcz1cInByZWxvYWRlciBmYWRlSW5Eb3duXCI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicHJlbG9hZGVyX19jb250ZW50XCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzcGlubmVyIGJveF8xIHNwaW5uZXJcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNwaW5uZXIgYm94XzIgZGVsYXlfMVwiPjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic3Bpbm5lciBib3hfMyBkZWxheV8yXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzcGlubmVyIGJveF80IGRlbGF5XzNcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJveF81XCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8aDIgY2xhc3M9XCJtdjMwIGZhZGVJbkRvd24gYW5pbWF0aW9uLWRlbGF5XzBfMlwiPtCc0LDRgdGC0LXRgCDQvdCw0YHRgtGA0L7QudC60Lg8L2gyPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzbWFsbCBsaDIwIGZhZGVJbkRvd24gYW5pbWF0aW9uLWRlbGF5XzBfNFwiPtCd0LDRh9C90LjRgtC1INGBINC/0YDQvtGB0YLQvtC5INC/0L7RiNCw0LPQvtCy0L7QuSDQvdCw0YHRgtGA0L7QudC60Lgg0YHQuNGB0YLQtdC80YsuPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1iODAgc21hbGwgbGgyMCBmYWRlSW5Eb3duIGFuaW1hdGlvbi1kZWxheV8wXzRcIj7QodC70LXQtNGD0LnRgtC1INC/0L7QtNGB0LrQsNC30LrQsNC8INC40L3RgtC10YDQsNC60YLQuNCy0L3QvtCz0L4g0LzQvtC80L7RidC90LjQutCwLjwvZGl2PlxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJidG5fc3RhcnQgYnRuIHNtYWxsIHNpbXBsZSBpY29uIGljb24tdHJpYW5nbGUtcmlnaHQgZmFkZUluRG93biBhbmltYXRpb24tZGVsYXlfMF82XCIgZGF0YS1zaG93LXBvcHVwPVwiLnRvdXItbWFzdGVyX19wb3B1cC0yXCI+0J3QsNGH0LDRgtGMINC90LDRgdGC0YDQvtC50LrRgzwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIjXCIgY2xhc3M9XCJidG5fc2tpcCBqc19famJveC1jbG9zZSBmYWRlSW5Eb3duIGFuaW1hdGlvbi1kZWxheV8wXzhcIj7Qv9GA0L7Qv9GD0YHRgtC40YLRjCDQvdCw0YHRgtGA0L7QudC60YM8L2E+XG4gICAgICAgICAgICA8L2Rpdj5gLFxuICAgIHBvcHVwMjogYDxkaXYgaWQ9XCJ0b3VyLW1hc3Rlcl9fcG9wdXAtMlwiIGNsYXNzPVwidG91ci1tYXN0ZXJfX3BvcHVwLTIgdG91cl9fcG9wdXAgaGlkZVwiPlxuICAgICAgICA8aDIgY2xhc3M9XCJtYjMwIGZhZGVJbkRvd25cIj7QktCw0YDQuNCw0L3RgtGLINC90LDRgdGC0YDQvtC50LrQuCBGbGV4PC9oMj5cbiAgICAgICAgXG4gICAgICAgIDxkaXYgY2xhc3M9XCJtYXJrZXIgYmx1ZSBtYjUwXCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cInJvdyBzcC0yMFwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbCBkNiBtMTJcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNldHRpbmdzX190aXRsZSBiaWcgdF9ibGFjayBmYWRlSW5Eb3duIGFuaW1hdGlvbi1kZWxheV8wXzJcIj5cbiAgICAgICAgICAgICAgICDQqNCw0LHQu9C+0L3Ri1xuICAgICAgICAgICAgICAgIDxicj5cbiAgICAgICAgICAgICAgICDQv9GA0L7RhtC10YHRgdC+0LJcbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtYjQwIHNtYWxsZXIgZGVzY3JpcHRpb24gbGgyMCBmYWRlSW5Eb3duIGFuaW1hdGlvbi1kZWxheV8wXzRcIj7QktGL0LHQtdGA0LjRgtC1LCDRh9GC0L4g0LHRiyDQstGL0YHRgtGA0L7QuNGC0Ywg0L/RgNC+0YbQtdGB0YHRiyDQvdCwINC+0YHQvdC+0LLQtSDRiNCw0LHQu9C+0L3QvtCyINGN0YTRhNC10LrRgtC40LLQvdGL0YUg0YHRgtCw0L3QtNCw0YDRgtC+0LIuPC9kaXY+XG4gICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4gc21hbGwgc2ltcGxlIGZhZGVJbkRvd24gYW5pbWF0aW9uLWRlbGF5XzBfNlwiIGRhdGEtc2hvdy1wb3B1cD1cIi50b3VyLW1hc3Rlcl9fcG9wdXAtM1wiPtCy0YvQsdGA0LDRgtGMPC9idXR0b24+XG4gICAgICAgICAgICA8L2Rpdj5cbiBcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wgZDYgbTEyXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzZXR0aW5nc19fdGl0bGUgYmlnIHRfYmxhY2sgZmFkZUluRG93biBhbmltYXRpb24tZGVsYXlfMF8yXCI+XG4gICAgICAgICAgICAgICAg0KHQvtCx0YHRgtCy0LXQvdC90YvQtVxuICAgICAgICAgICAgICAgIDxicj5cbiAgICAgICAgICAgICAgICDQv9GA0L7RhtC10YHRgdGLXG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWI0MCBzbWFsbGVyIGRlc2NyaXB0aW9uIGxoMjAgZmFkZUluRG93biBhbmltYXRpb24tZGVsYXlfMF80XCI+0JLRi9Cx0LXRgNC40YLQtSwg0YfRgtC+INCx0Ysg0L3QsNGB0YLRgNC+0LjRgtGMINGB0LjRgdGC0LXQvNGDINC/0L7QtCDQtNC10LnRgdGC0LLRg9GO0YnQuNC1INCx0LjQt9C90LXRgS3Qv9GA0L7RhtC10YHRgdGLINC4INGB0YLRgNGD0LrRgtGD0YDRgyDQvtGA0LPQsNC90LjQt9Cw0YbQuNC4LjwvZGl2PlxuICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIHNtYWxsIHNpbXBsZSBmYWRlSW5Eb3duIGFuaW1hdGlvbi1kZWxheV8wXzZcIiBkYXRhLXNob3ctcG9wdXA9XCIudG91ci1tYXN0ZXJfX3BvcHVwLTRcIj7QstGL0LHRgNCw0YLRjDwvYnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgXG4gICAgICAgIDwvZGl2PlxuICAgIFxuICAgICAgICA8YSBocmVmPVwiI1wiIGNsYXNzPVwiZWR1Y2F0aW9uYWwtY2VudGVyX19saW5rIGljb24gaWNvbi11bmlFN0QzIGZhZGVJbkRvd24gYW5pbWF0aW9uLWRlbGF5XzBfOFwiPtCj0YfQtdCx0L3Ri9C5INGG0LXQvdGC0YA8L2E+XG4gICAgICAgIDxhIGhyZWY9XCIjXCIgY2xhc3M9XCJidG5fc2tpcCBqc19famJveC1jbG9zZSBmYWRlSW5Eb3duIGFuaW1hdGlvbi1kZWxheV8xXzBcIj7Qv9GA0L7Qv9GD0YHRgtC40YLRjCDQvdCw0YHRgtGA0L7QudC60YM8L2E+XG4gICAgICA8L2Rpdj5gLFxuICAgIHBvcHVwMzogYDxkaXYgaWQ9XCJ0b3VyLW1hc3Rlcl9fcG9wdXAtM1wiIGNsYXNzPVwidG91ci1tYXN0ZXJfX3BvcHVwLTMgdG91cl9fcG9wdXAgIGhpZGVcIj5cbiAgICAgICAgPGJ1dHRvbiAgY2xhc3M9XCJidG5fYmFjayBidG4gc21hbGwgc2ltcGxlIGljb24gaWNvbi11bmlFN0RDIGZhZGVJbkRvd25cIiAgZGF0YS1zaG93LXBvcHVwPVwiLnRvdXItbWFzdGVyX19wb3B1cC0yXCI+0L3QsNC30LDQtDwvYnV0dG9uPlxuICAgICAgICA8aDIgY2xhc3M9XCJtYjMwIGZhZGVJbkRvd24gYW5pbWF0aW9uLWRlbGF5XzBfMlwiPtCS0YvQsdC10YDQuNGC0LUg0YjQsNCx0LvQvtC9INC/0YDQvtGG0LXRgdGB0L7QsjwvaDI+XG4gICAgXG4gICAgICAgIDxkaXYgY2xhc3M9XCJtYXJrZXIgYmx1ZSBtYjUwIGZhZGVJbkRvd24gYW5pbWF0aW9uLWRlbGF5XzBfNFwiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJwcm9jZXNzLWxlbmtzIG10MjAgbWI3MFwiPlxuICAgICAgICAgICAge3sjZWFjaCB0b3VycyBhcyB8dG91cnx9fVxuICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIjXCIgZGF0YS1zdGFydC10b3VyPVwie3t0b3VyLm5hbWV9fVwiPnt7dG91ci50aXRsZX19PC9hPlxuICAgICAgICAgICAge3svZWFjaH19XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIFxuICAgICAgICA8YSBocmVmPVwiI1wiIGNsYXNzPVwiZWR1Y2F0aW9uYWwtY2VudGVyX19saW5rIGljb24gaWNvbi11bmlFN0QzIGZhZGVJbkRvd24gYW5pbWF0aW9uLWRlbGF5XzBfNlwiPtCj0YfQtdCx0L3Ri9C5INGG0LXQvdGC0YA8L2E+XG4gICAgICAgIDxhIGhyZWY9XCIjXCIgY2xhc3M9XCJidG5fc2tpcCBqc19famJveC1jbG9zZSBmYWRlSW5Eb3duIGFuaW1hdGlvbi1kZWxheV8wXzhcIj7Qv9GA0L7Qv9GD0YHRgtC40YLRjCDQvdCw0YHRgtGA0L7QudC60YM8L2E+XG4gICAgICA8L2Rpdj5gLFxuICAgIHBvcHVwNDogYDxkaXYgaWQ9XCJ0b3VyLW1hc3Rlcl9fcG9wdXAtNFwiIGNsYXNzPVwidG91ci1tYXN0ZXJfX3BvcHVwLTQgdG91cl9fcG9wdXAgIGhpZGVcIj5cbiAgICAgICAgPGJ1dHRvbiAgY2xhc3M9XCJidG5fYmFjayBidG4gc21hbGwgc2ltcGxlIGljb24gaWNvbi11bmlFN0RDXCIgIGRhdGEtc2hvdy1wb3B1cD1cIi50b3VyLW1hc3Rlcl9fcG9wdXAtMlwiPtC90LDQt9Cw0LQ8L2J1dHRvbj5cbiAgICAgICAgPGgyIGNsYXNzPVwibWIzMFwiPtCS0YvQsdC10YDQuNGC0LUg0L7Qv9GG0LjQuCDQv9GA0L7RhtC10YHRgdC+0LI8L2gyPlxuICAgIFxuICAgICAgICA8ZGl2IGNsYXNzPVwibWFya2VyIGJsdWUgbWIzMFwiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJjdXN0b20tdGVtcGxhdGUtZm9ybV9fd3JhcCBtdDIwXCI+XG4gICAgICAgICAgICA8Zm9ybSBhY3Rpb249XCJwb3N0XCIgaWQ9XCJjdXN0b20tdGVtcGxhdGUtZm9ybVwiIGNsYXNzPVwiY3VzdG9tLXRlbXBsYXRlLWZvcm1cIj5cbiAgICAgICAgICAgICAge3sjZWFjaCBncm91cFN0ZXBzIGFzIHxncm91cFN0ZXB8fX1cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGl0bGVcIj57e3RoaXMudGl0bGV9fTwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWl0ZW1cIj5cbiAgICAgICAgICAgICAgICAgIHt7I2VhY2ggLi4vc3RlcHMgYXMgfHN0ZXB8fX1cbiAgICAgICAgICAgICAgICAgICAge3sjaWZDb25kIHN0ZXAudGFnICc9PT0nIGdyb3VwU3RlcC50aXRsZX19XG4gICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGlkPVwidGVtcGxhdGUtY2hlY2tib3gte3tAaW5kZXh9fVwiIHR5cGU9XCJjaGVja2JveFwiIG5hbWU9XCJjdXN0b20tdGVtcGxhdGVcIiB2YWx1ZT1cInt7QGluZGV4fX1cIj5cbiAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwidGVtcGxhdGUtY2hlY2tib3gte3tAaW5kZXh9fVwiPnt7c3RlcC50aXRsZX19PC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAge3svaWZDb25kfX1cbiAgICAgICAgICAgICAgICAgIHt7L2VhY2h9fVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICB7ey9lYWNofX1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzcz1cImJ0bl9zdGFydCBidG4gc21hbGwgc2ltcGxlIGljb24gaWNvbi10cmlhbmdsZS1yaWdodFwiPtCd0LDRh9Cw0YLRjCDQvdCw0YHRgtGA0L7QudC60YM8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgXG4gICAgICAgIDxhIGhyZWY9XCIjXCIgY2xhc3M9XCJlZHVjYXRpb25hbC1jZW50ZXJfX2xpbmsgaWNvbiBpY29uLXVuaUU3RDNcIj7Qo9GH0LXQsdC90YvQuSDRhtC10L3RgtGAPC9hPlxuICAgICAgICA8YSBocmVmPVwiI1wiIGNsYXNzPVwiYnRuX3NraXAganNfX2pib3gtY2xvc2VcIj7Qv9GA0L7Qv9GD0YHRgtC40YLRjCDQvdCw0YHRgtGA0L7QudC60YM8L2E+XG4gICAgICA8L2Rpdj5gXG4gIH07XG5cblxuICAkLmpUb3VyTWFzdGVyID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdvYmplY3QnICYmICQuaXNBcnJheShvcHRpb25zLnN0ZXBzKSkge1xuICAgICAgcmV0dXJuIG5ldyBKVG91ck1hc3RlckNvbnRyb2xsZXIob3B0aW9ucyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfTtcblxufSkpO1xuIl19
