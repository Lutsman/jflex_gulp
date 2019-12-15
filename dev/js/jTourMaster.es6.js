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
  class JTourMasterController {
    constructor(options) {
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

    init() {
      let hasAutostart = this.autostart && this.isSamePath(this.autostartPath);
      let hasCookiesStart = this.hasCookiesStart();

      this.defaultTourOptions = $.extend(true, {}, DefaultTourOptions, this.defaultTourOptions);
      this.customTourOptions = $.extend(true, {}, CustomTourOptions, this.customTourOptions);

      if (
        !hasAutostart &&
        !hasCookiesStart
      ) return;

      if (hasCookiesStart) {
        let start = this.onCookiesStart();

        if (start) return;
      }

      if (hasAutostart) {
        let start = this.runAutostart();

        if (start) return;
      }
    }

    initLayout() {
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

    stop() {
      if (this.tour) {
        this.tour.stop();
      }

      this.hidePopUp();
      this.detachHandlers();
      this.destroyLayout();
      this.isLayout = false;
    }

    start() {
      this.startTourMaster();
    }

    runAutostart() {
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
        case  'new':
          return this.firstTimeTourMasterStart();
        default:
          return false;
      }
    }

    bindElements() {
      this.$gotoPopupBtn = $(`[${this.gotoPopUpAttr}]`);
      this.$closePopupBtn = $(this.closePopupBtn);
      this.$startTourByNameBtn = $(`[${this.startTourByNameAttr}]`);
      this.$customTemplateForm = $(this.customTemplateForm);
      this.$listenedEl = $(this.listenedEl);
    }

    bindHandlers() {
      this._gotoPopUpHandler = this.gotoPopUpHandler.bind(this);
      this._hidePopUp = this.hidePopUp.bind(this);
      this._startTourByNameHandler = this.startTourByNameHandler.bind(this);
      this._startCustomTourHandler = this.startCustomTourHandler.bind(this);
      this._gotoNextPageHandler = this.gotoNextPageHandler.bind(this);
    }

    attachHandlers() {
      this.$gotoPopupBtn.on('click', this._gotoPopUpHandler);
      this.$closePopupBtn.on('click', this._hidePopUp);
      this.$startTourByNameBtn.on('click', this._startTourByNameHandler);
      this.$customTemplateForm.on('submit', this._startCustomTourHandler);
      this.$listenedEl.on('jTour:tourGoNextPage', this._gotoNextPageHandler);

      this.isAttachedHandlers = true;
    }

    detachHandlers() {
      this.$gotoPopupBtn.off('click', this._gotoPopUpHandler);
      this.$closePopupBtn.off('click', this._hidePopUp);
      this.$startTourByNameBtn.off('click', this._startTourByNameHandler);
      this.$customTemplateForm.off('submit', this._startCustomTourHandler);
      this.$listenedEl.off('jTour:tourGoNextPage', this._gotoNextPageHandler);

      this.isAttachedHandlers = false;
    }

    showPopUp(el) {
      $.jBox.open($.extend(true, {}, this.jboxOptions, {href: el}));
    }

    hidePopUp() {
      $.jBox.close();
    }

    startTourMaster() {
      if (!this.isLayout) {
        this.initLayout();
      }

      this.showPopUp(this.html.layout.$popupIntro);
    }

    gotoPopUpHandler(e) {
      let el = e.target;
      let target = el.closest(`[${this.gotoPopUpAttr}]`);

      if (!target) return;
      e.preventDefault();

      this.showPopUp(target.getAttribute(this.gotoPopUpAttr));
    }

    startTour(options) {
      this.createTour(options);

      setTimeout(function () {
        this.tour.start();
      }.bind(this),
      200)
    }

    createTour(options) {
      options = $.extend(true, this.defaultTourOptions, options);
      this.activeTourOptions = options;
      this.tour = $.jTour(options);

      return this.tour;
    }

    gotoNextPageHandler(e, path, tour) {

      if (tour !== this.tour) return;

      this.putActiveTourCookies(path);
    }

    startTourByNameHandler(e) {
      let el = e.target;
      let target = el.closest(`[${this.startTourByNameAttr}]`);

      if (!target) return;
      e.preventDefault();

      this.hidePopUp();
      this.startTourByName(target.getAttribute(this.startTourByNameAttr));
    }

    startTourByName(tourName) {
      let tourOptions = this.getTourByName(tourName);

      if (!tourOptions) return;

      this.startTour(tourOptions);
    }

    getTourByName(tourName) {
      for (let i = 0; i < this.tours.length; i++) {
        if (this.tours[i].name !== tourName) continue;

        return this.tours[i];
      }

      return null;
    }

    startCustomTourHandler(e) {
      let el = e.target;
      let target = el.closest(this.customTemplateForm);

      if (!target) return;

      e.preventDefault();

      let options = this.getCustomTour(target);

      if (!options) return;

      this.hidePopUp();
      this.startTour(options);
    }

    getCustomTour(form) {
      let formData = $(form).serializeArray();
      let tourOptions = $.extend(true, {}, this.customTourOptions);
      let currSteps = [];
      let customStepsIndex = this.customStepsIndex = [];

      for (let i = 0; i < formData.length; i++) {
        let stepIndex = +formData[i].value;

        currSteps.push(this.steps[stepIndex]);
        customStepsIndex.push(stepIndex);
      }

      tourOptions.steps = currSteps;

      return tourOptions;
    }

    firstTimeTourMasterStart() {
      let name = 'tour-master';
      let data = {
        date: new Date()
      };
      let options = {
        domain: window.location.hostname
      };
      let tourMasterData = this.getCookies(name);

      if (tourMasterData) return false;

      this.putCookies(name, data, options);
      this.startTourMaster();
      return true;
    }

    putActiveTourCookies(path) {
      const options = {
        path: '/'
      };
      const tourOptions = this.parseTourOptions(this.activeTourOptions);
      const tourData = Object.assign({}, tourOptions, { path });


      this.putCookies(this.activeTourKey, tourData, options);
    }

    hasCookiesStart() {
      return !!this.getActiveTourCookies();
    }


    onCookiesStart() {
      let tourData = this.getActiveTourCookies();
      let cookiesOptions = {
        path: '/'
      };

      if (!tourData) return false;

      this.initLayout();
      this.deleteCookies(this.activeTourKey, cookiesOptions);
      this.createTour(this.parseTourCookieData(tourData));

      return true;
    };

    getActiveTourCookies() {
      const tourData = this.getCookies(this.activeTourKey);

      if (!tourData || !this.isSamePath(tourData.path)) return null;

      return tourData;
    }

    createTourFromCookies(tourData) {
      let tourOptions = this.parseTourCookieData(tourData);

      if (tourData.customStepsIndex) {
        this.customStepsIndex = tourData.customStepsIndex;
      }

      this.activeTourOptions = tourOptions;

      this.tour = $.jTour(tourOptions);
    }

    parseTourOptions(options) {
      let tourCookiesData = {
        name: options.name
      };

      if (options.name !== this.customTourOptions.name) return tourCookiesData;

      tourCookiesData.steps = this.customStepsIndex;
      return tourCookiesData;
    }

    parseTourCookieData(tourData) {
      let tourOptions;

      if (tourData !== this.customTourOptions.name) {
        tourOptions = this.getTourByName(tourData.name);
      } else {
        tourOptions = $.extend(true, {}, this.customTourOptions);
        tourOptions.steps = [];
        this.customStepsIndex = tourData.customStepsIndex;

        for (let i = 0; i < tourData.customStepsIndex; i++) {
          tourOptions.steps.push(this.steps[tourData.customStepsIndex[i]]);
        }
      }

      return tourOptions;
    }

    getCookies(key) {
      let cachedJsonOption = $.cookie.json;
      $.cookie.json = true;
      let cookie = $.cookie(key);
      $.cookie.json = cachedJsonOption;

      return cookie;
    }

    putCookies(key, val, opt) {
      let cachedJsonOption = $.cookie.json;
      $.cookie.json = true;
      $.cookie(key, val, opt);
      $.cookie.json = cachedJsonOption;
    }

    deleteCookies(key, opt) {
      return $.removeCookie(key, opt);
    }

    isSamePath(path, isEmptyPath) {
      const lang = this.getLang();
      const reg = lang ? new RegExp(`/${lang}/`, 'g') : null;
      const currPath = path.replace(reg, '/');
      const localPath =  window.location.pathname.replace(reg, '/');

      if (currPath === localPath || (currPath === '' && isEmptyPath)) {
        return true;
      }

      return false;
    }

    getLang() {
      const objClass = $('body').attr('class').split(/\s+/);
      const pattern = 'i18n-';

      for (const className of objClass) {
        const pos = className .indexOf('i18n-');
        if (pos === -1) continue;

        return className .slice(pos + pattern.length);
      }

      return null;
    }

    renderLayout() {
      let $popupIntro = $(LayoutTpl.popup1);
      let $popupDivarication = $(LayoutTpl.popup2);
      let $popupTours = $(this.renderPopupTours(this.tours));
      let $popupSteps = $(this.renderPopupSteps(this.steps));
      let $container = $(this.layoutContainer);

      this.html = {
        layout: {
          $popupIntro: $popupIntro,
          $popupDivarication: $popupDivarication,
          $popupTours: $popupTours,
          $popupSteps: $popupSteps
        },
        $layoutContainer: $container
      };

      $container
        .append($popupIntro)
        .append($popupDivarication)
        .append($popupTours)
        .append($popupSteps);
    }

    renderPopupTours(tours) {
      let source = LayoutTpl.popup3;
      let template = Handlebars.compile(source);
      let context = {
        tours: tours
      };

      return template(context);
    }

    renderPopupSteps(steps) {
      let source = LayoutTpl.popup4;
      let template = Handlebars.compile(source);
      let context = {
        steps: steps,
        groupSteps: []
      };

      for (let i = 0; i < steps.length; i++) {
        let hasTitle = false;

        for (let j = 0; j < context.groupSteps.length; j++) {
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

    destroyLayout() {
      var layout = this.html.layout;

      for (let popup in layout) {
        layout[popup].remove();
      }

      this.html.layout = {};
    }
  }

  const CustomTourOptions = {
    name: 'custom-tour',
    isMenu: true,
    steps: []
  };

  const DefaultTourOptions = {
    isMenu: true
  };

  const LayoutTpl = {
    popup1: `<div id="tour-master__popup-1" class="tour-master__popup-1 tour__popup center hide">
                <div id="preloader" class="preloader fadeInDown">
                  <div class="preloader__content">
                    <div class="spinner box_1 spinner"></div>
                    <div class="spinner box_2 delay_1"></div>
                    <div class="spinner box_3 delay_2"></div>
                    <div class="spinner box_4 delay_3"></div>
                    <div class="box_5"></div>
                  </div>
                </div>
                <h2 class="mv30 fadeInDown animation-delay_0_2">Мастер настройки</h2>
                <div class="small lh20 fadeInDown animation-delay_0_4">Начните с простой пошаговой настройки системы.</div>
                <div class="mb80 small lh20 fadeInDown animation-delay_0_4">Следуйте подсказкам интерактивного момощника.</div>
                <button class="btn_start btn small simple icon icon-triangle-right fadeInDown animation-delay_0_6" data-show-popup=".tour-master__popup-2">Начать настройку</button>
                <a href="#" class="btn_skip js__jbox-close fadeInDown animation-delay_0_8">пропустить настройку</a>
            </div>`,
    popup2: `<div id="tour-master__popup-2" class="tour-master__popup-2 tour__popup hide">
        <h2 class="mb30 fadeInDown">Варианты настройки Flex</h2>
        
        <div class="marker blue mb50">
          <div class="row sp-20">
            <div class="col d6 m12">
              <div class="settings__title big t_black fadeInDown animation-delay_0_2">
                Шаблоны
                <br>
                процессов
              </div>
              <div class="mb40 smaller description lh20 fadeInDown animation-delay_0_4">Выберите, что бы выстроить процессы на основе шаблонов эффективных стандартов.</div>
              <button class="btn small simple fadeInDown animation-delay_0_6" data-show-popup=".tour-master__popup-3">выбрать</button>
            </div>
 
            <div class="col d6 m12">
              <div class="settings__title big t_black fadeInDown animation-delay_0_2">
                Собственные
                <br>
                процессы
              </div>
              <div class="mb40 smaller description lh20 fadeInDown animation-delay_0_4">Выберите, что бы настроить систему под действующие бизнес-процессы и структуру организации.</div>
              <button class="btn small simple fadeInDown animation-delay_0_6" data-show-popup=".tour-master__popup-4">выбрать</button>
            </div>
          </div>
          
        </div>
    
        <a href="#" class="educational-center__link icon icon-uniE7D3 fadeInDown animation-delay_0_8">Учебный центр</a>
        <a href="#" class="btn_skip js__jbox-close fadeInDown animation-delay_1_0">пропустить настройку</a>
      </div>`,
    popup3: `<div id="tour-master__popup-3" class="tour-master__popup-3 tour__popup  hide">
        <button  class="btn_back btn small simple icon icon-uniE7DC fadeInDown"  data-show-popup=".tour-master__popup-2">назад</button>
        <h2 class="mb30 fadeInDown animation-delay_0_2">Выберите шаблон процессов</h2>
    
        <div class="marker blue mb50 fadeInDown animation-delay_0_4">
          <div class="process-lenks mt20 mb70">
            {{#each tours as |tour|}}
                <a href="#" data-start-tour="{{tour.name}}">{{tour.title}}</a>
            {{/each}}
          </div>
        </div>
    
        <a href="#" class="educational-center__link icon icon-uniE7D3 fadeInDown animation-delay_0_6">Учебный центр</a>
        <a href="#" class="btn_skip js__jbox-close fadeInDown animation-delay_0_8">пропустить настройку</a>
      </div>`,
    popup4: `<div id="tour-master__popup-4" class="tour-master__popup-4 tour__popup  hide">
        <button  class="btn_back btn small simple icon icon-uniE7DC"  data-show-popup=".tour-master__popup-2">назад</button>
        <h2 class="mb30">Выберите опции процессов</h2>
    
        <div class="marker blue mb30">
          <div class="custom-template-form__wrap mt20">
            <form action="post" id="custom-template-form" class="custom-template-form">
              {{#each groupSteps as |groupStep|}}
                <div class="title">{{this.title}}</div>
                <div class="form-item">
                  {{#each ../steps as |step|}}
                    {{#ifCond step.tag '===' groupStep.title}}
                      <input id="template-checkbox-{{@index}}" type="checkbox" name="custom-template" value="{{@index}}">
                      <label for="template-checkbox-{{@index}}">{{step.title}}</label>
                    {{/ifCond}}
                  {{/each}}
                </div>
              {{/each}}
            
              <button type="submit" class="btn_start btn small simple icon icon-triangle-right">Начать настройку</button>
            </form>
          </div>
        </div>
    
        <a href="#" class="educational-center__link icon icon-uniE7D3">Учебный центр</a>
        <a href="#" class="btn_skip js__jbox-close">пропустить настройку</a>
      </div>`
  };


  $.jTourMaster = function (options) {
    if (typeof options === 'object' && $.isArray(options.steps)) {
      return new JTourMasterController(options);
    } else {
      return null;
    }
  };

}));
