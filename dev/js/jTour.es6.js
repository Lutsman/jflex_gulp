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
  class JTourController {
    constructor(options) {
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
        menuWrapper:
        '<div class="tour-menu-wrapper">' +
        '<div class="tour-title">Настройка системы</div>' +
        '</div>',
        soundBtn:
        '<div>' +
        '<input id="tour-sound" type="checkbox">' +
        '<label class="speaker" for="tour-sound"></label>' +
        '</div>',
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

    init() {
      this._tooltipClickHandler = this.contentClickHandler.bind(this);
      this.$triggeredEl = $(this.triggeredEl);
      this.tooltipOptions = $.extend(true, {}, DefaultTooltipOptions, this.userTooltipOptions);

      for (let i = 0; i < this.userSteps.length; i++) {
        this.steps.push($.extend(true, {}, DefaultStep, this.userSteps[i]));
      }

      let tourData = this.getTourData();


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

    start() {
      this.$triggeredEl.trigger(this.events.tourStart, [this]);
      this.goto(this.activeStepIndex);

      if (this.isSamePath(this.activeStep.path)) {
        if (this.isMenu && !this.$menu) {
          this.createMenu();
          this.switchMenuItem(this.activeStepIndex);
        }
      }
    }

    stop() {
      this.$triggeredEl.trigger(this.events.tourStop, [this]);

      this.reset();
      this.removeMenu();
    }

    reset() {
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

    goto(index) {
      if (index < 0 || index >= this.steps.length) return;

      this.prevStepIndex = this.activeStepIndex;
      this.activeStep = this.steps[index];
      this.activeStepIndex = index;

      this.runStep(this.activeStep);
    }

    gotoPage(path) {
      this.$triggeredEl.trigger(this.events.tourGoNextPage, [path, this]);
      this.putTourData(path);
      window.open(path, '_self');
    }

    bindNextStep(index) {
      let path = window.location.pathname;
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

    runStep(step) {
      let $stepElement = $(step.element);

      this.clean();

      if (!this.isSamePath(step.path, true)) {
        this.gotoPage(step.path);
        return;
      }

      if (step.onElement
        && step.onElement.handler
        && typeof step.onElement.handler === 'function') {

        $stepElement.on(step.onElement.event, {tourController: this}, step.onElement.handler);
      }

      this.$triggeredEl.trigger(this.events.stepBeforeStart, [step, this]);
      this.openModal(step);

      if ($stepElement.length) {
        this.onModalClose()
          .then(() => {
            return this.animateToStep(step);
          })
          .then(() => {
            this.playAudio(step.file);
          });
      } else {
        this.playAudio(step.file);
      }
    }

    animateToStep(step) {
      return new Promise((resolve, reject) => {
        switch (step.animateType) {
          case 'simple' :
            this.scrollTo(step.element)
              .then(
                () => {
                  this.showTooltip(step.element, step.content, step.title, step.tooltipPos);
                  this.$triggeredEl.trigger(this.events.stepAfterStart, [step, this]);

                  resolve();
                },
                error => {
                  console.log(error);
                  reject(error);
                }
              );
            break;
          case 'highlight' :
            this.scrollTo(step.element)
              .then(
                () => {
                  this.showTooltip(step.element, step.content, step.title, step.tooltipPos);
                  this.highlightEl(step.element);
                  this.$triggeredEl.trigger(this.events.stepAfterStart, [step, this]);

                  resolve();
                },
                error => {
                  console.log(error);
                  reject(error);
                }
              );
            break;
        }
      });
    }

    clean() {
      let prevStep = this.steps[this.prevStepIndex];
      let $prevStepElement = $(prevStep.element);

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

      if (prevStep.onElement
        && typeof prevStep.onElement.handler === 'function') {

        $prevStepElement.off(prevStep.onElement.event, prevStep.onElement.handler);
      }
    }

    isSamePath(path, isEmptyPath) {
      const lang = this.getLang();
      const reg = lang ? new RegExp(`/${lang}/`, 'g') : null;
      const currPath = path.replace(reg, '/');
      const localPath =  window.location.pathname.replace(reg, '/');

      if (currPath === localPath || (currPath === '' && isEmptyPath)) {
        return true;
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

    highlightEl(el) {
      let $el = $(el);

      if (!$el.length) return;

      let $overlay = this.$overlay = this.$overlay || $(this.tpl.overlay);
      let computedStyles = window.getComputedStyle($el[0]);
      let backgroundColor = '';

      if (computedStyles.backgroundColor === 'rgba(0, 0, 0, 0)') {
        backgroundColor = this.getParentBackground($el);
      }

      $el
        .css({
          position: 'relative',
          zIndex: '9500',
          backgroundColor: backgroundColor
        })
        .after($overlay);

      $overlay
        .css({
          display: 'none',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          zIndex: '9000'
        })
        .fadeIn(400);

    }

    unhighlightEl(el) {
      let $el = $(el);

      if (!$el.length) return;

      let $overlay = this.$overlay = this.$overlay || $(this.tpl.overlay);

      $overlay.fadeOut(400, () => {
        $overlay.remove();
        $el.css({
          position: '',
          zIndex: '',
          backgroundColor: ''
        });
      });
    }

    getParentBackground(el) {
      if ($(el).is('body')) return '#fff';

      let $parent = $(el).parent();
      let backgroundColor = window.getComputedStyle($parent[0]).backgroundColor;

      if (backgroundColor === 'rgba(0, 0, 0, 0)') {
        backgroundColor = this.getParentBackground($parent);
      }

      return backgroundColor;
    }

    scrollTo(selector, translation) {
      return new Promise((resolve, reject) => {
        let wh = document.documentElement.clientHeight;
        let $el = $(selector);
        let elh = $el.outerHeight();
        let coords = {};
        let scrollTop = 0;

        if ($el.length) {
          coords = this.getCoords($el[0]);
        } else {
          reject('no such element');
        }

        if (wh > elh) {
          scrollTop = coords.top - (wh - elh) / 2;
        } else {
          scrollTop = coords.top;
        }

        $("html, body").animate({
            scrollTop: scrollTop - (translation || 0),
          },
          {
            duration: 500,
            complete: resolve
          }
        );
      });
    }

    renderContent(content, title, controlPos) {
      //TODO переписать рендер и хендлер с использованием классов, без использования элементов для сравнения
      this.content = {};
      let $wrapper = this.content.$wrapper = $(this.tpl.contentWrapper);
      let $title = title ? $(this.tpl.title).append(title) : '';
      let $content = content ? $(this.tpl.content).append(content) : '';
      let $prev = this.content.$prev = $(this.tpl.prev);
      let $next = this.content.$next = $(this.tpl.next);
      let $end = this.content.$end = $(this.tpl.end);
      let $replay = this.content.$replay = $(this.tpl.replay);
      let $controls = $('<div class="mb20"></div>')
      controlPos = controlPos || 'bottom';

      $controls
        .append($prev)
        .append($next)
        .append($end);

      if (this.activeStepIndex === 0) {
        $prev
          .addClass('disabled')
          .attr('disabled', true);
      }

      if (this.activeStepIndex === this.steps.length - 1) {
        $next
          .addClass('disabled')
          .attr('disabled', true);
      }

      if (this.activeStep.file) {
        if (!this.isSound) {
          $replay
            .addClass('disabled');
        }

        if (controlPos === 'bottom') {
          $wrapper.append($replay);
        } else {
          $controls.append($replay);
        }
      }

      if (controlPos === 'bottom') {
        $wrapper
          .append($title)
          .append($content)
          .append($controls);
      } else {
        $wrapper
          .append($controls)
          .append($title)
          .append($content);
      }

      $wrapper.on('click', this._tooltipClickHandler);

      return $wrapper;
    }

    contentClickHandler(e) {
      let $target = $(e.target);

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

    showTooltip(el, content, title, pos) {
      let tooltip = this.tooltip;

      if (!tooltip) {
        tooltip = this.tooltip = $(el).jTooltip(this.tooltipOptions).jTooltip('getSelf');

        tooltip.stop();
      }

      tooltip.block = $(el)[0];
      tooltip.content = this.renderContent(content, title);
      tooltip.tooltipPosition = pos;
      tooltip.addTooltip();
    }

    removeTooltip() {
      if (!this.tooltip) return;

      if (this.content && this.content.$wrapper) {
        this.content.$wrapper.off();
      }
      this.content = {};
      this.tooltip.removeTooltip();
    }

    openModal(step) {
      let content = step.manual;
      let title = step.title;
      let element = step.element;
      let controlPos = 'top';
      let options = {
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

    closeModal() {
      if (!this.isModalActive) return;

      $.jBox.close();
      this.isModalActive = false;
    }

    onModalClose() {
      return new Promise((resolve) => {
        if (this.isModalActive) {
          setTimeout(() => {
            $(document.body).one('jBox:afterClose', resolve);
          }, 300);
        } else {
          resolve();
        }
      });
    }

    getCookies(key) {
      const cachedJsonOption = $.cookie.json;
      $.cookie.json = true;
      const cookie = $.cookie(key);
      $.cookie.json = cachedJsonOption;

      return cookie;
    }

    putCookies(key, val, opt) {
      const cachedJsonOption = $.cookie.json;
      $.cookie.json = true;
      $.cookie(key, val, opt);
      $.cookie.json = cachedJsonOption;
    }

    deleteCookies(key, opt) {
      return $.removeCookie(key, opt);
    }

    putTourData(path) {
      const options = {
        path: '/'
      };
      const tourData = {
        path: path,
        name: this.name,
        activeStepIndex: this.activeStepIndex,
        startPage: this.startPage,
        isSound: this.isSound
      };

      this.putCookies(this.name, tourData, options);
    }

    getTourData() {
      const tourData = this.getCookies(this.name);

      if (!tourData || !this.isSamePath(tourData.path)) return null;

      return tourData;
    }

    deleteTourData() {
      const options = {
        path: '/'
      };

      this.deleteCookies(this.name, options);
    }

    getCoords(elem) {
      let box = elem.getBoundingClientRect();

      return {
        top: box.top + window.pageYOffset,
        bottom: box.bottom + window.pageYOffset,
        left: box.left + window.pageXOffset,
        right: box.right + window.pageXOffset
      };
    }

    createMenu() {
      let $menu = this.$menu = this.renderMenu();

      if (!$menu) return;

      this.addMenu($menu);
      this.$soundBtn = $menu.find('#tour-sound').attr('checked', this.isSound);
      this._menuClickHandler = this.menuClickHandler.bind(this);
      $menu.on('click', this._menuClickHandler);
    }

    renderMenu() {
      let $menuWrapper = $(this.menuTpl.menuWrapper);
      let $menuContainer = $(this.menuTpl.container);
      let steps = this.steps;
      let $currMenuItem = $(0);

      for (let i = 0; i < steps.length; i++) {
        let currStep = steps[i];
        if (currStep.isMenuStep) {
          let $menuItem = $(this.menuTpl.item);
          let $menuAnchor = $(this.menuTpl.itemAnchor);

          $currMenuItem = $menuItem;

          $menuAnchor
            .text(currStep.menuTitle || steps[i].title)
            .attr('data-jtour-step', i);
          $menuItem.append($menuAnchor);
          $menuContainer.append($menuItem);
        }

        if (this.activeStepIndex === i) {
          $currMenuItem.addClass('active');
        }
      }

      for (let i = 0; i < this.steps.length; i++) {
        if (!this.steps[i].file) continue;

        $menuWrapper.prepend(this.menuTpl.soundBtn);
        break;
      }

      $menuWrapper.append($menuContainer);

      return $menuContainer.children() === 0 ? null : $menuWrapper;
    }

    removeMenu() {
      if (!this.isMenu || !this.$menu) return;

      if (typeof this.removeMenuMethod === 'function') {
        this.removeMenuMethod(this.$menu, this.menuContainer, this);
      }

      this.$menu
        .off('click', this._menuClickHandler)
        .remove();

      this.$menu = null;
    }

    addMenu(menu) {
      if (typeof this.addMenuMethod === 'function') {
        this.addMenuMethod(menu, this.menuContainer, this);
      } else {
        $(this.menuContainer).append(menu);
      }
    }

    menuClickHandler(e) {
      let $target = $(e.target);

      if ($target.is('[data-jtour-step]')) {
        let index = +$target.attr('data-jtour-step');

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

    playAudio(source) {
      source = source || this.activeStep.file;

      if (!this.isSound) return;

      this.player.init(source);
      this.player.play();
    }

    toggleVolume() {
      this.isSound = this.$soundBtn[0].checked;

      if (this.isSound) {
        this.content.$replay
          .removeClass('disabled')
          .attr('disabled', false);
      } else {
        this.player.pause();
        this.content.$replay
          .addClass('disabled');
      }
    }

    switchMenuItem(index) {
      if (!this.$menu) return;

      let $menuItem = this.$menu.find('[data-jtour-step ="' + index + '"]');

      if (!$menuItem.length) return;

      let $currMenuItem = $menuItem.closest('li');
      let $activeMenuItem = this.$menu.find('li.active');

      this.$triggeredEl.trigger(this.events.menuBeforeSwitch, [this]);

      $activeMenuItem.removeClass('active');
      $currMenuItem.addClass('active');

      this.$triggeredEl.trigger(this.events.menuAfterSwitch, [this]);
    }

    setupStepsPath() {
      if (!this.startPage) {
        this.startPage = window.location.pathname;
      }

      let currPass = this.startPage;

      for (let i = 0; i < this.steps.length; i++) {
        let currStep = this.steps[i];

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
    getTranslation(el) {
      let translation = 0;

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

    getFirstIn(from) {
      let firstIn = -1;
      let steps = this.steps;

      if (typeof from === 'undefined') {
        from = 0;
      } else if (from < 0 || from > steps.length) {
        return firstIn;
      }

      for (let i = from; i < steps.length; i++) {
        if (!this.isSamePath(steps[i].path)) continue;

        firstIn = i;
        break;
      }

      return firstIn;
    }
  }

  const DefaultStep = {
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

  const DefaultTooltipOptions = {
    customContainerClass: 'js__jtooltip-s_white'
  };

  $.jTour = function (options) {
    let result = null;

    if (typeof options === 'object' && $.isArray(options.steps)) {
      result = new JTourController(options);
    }

    return result;
  };
}));
