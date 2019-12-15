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
  class JPageEventLiveController {
    constructor (listenedBlock, scenario) {
      this._listenedBlock = listenedBlock;
      this._scenario = scenario;
    }

    init() {
      this._scenario = this.fliterScenario(this._scenario);

      if (!this._scenario) return;
      //console.log(this._scenario);

      this._events = this.getEvents(this._scenario);

      this._events.forEach((event) => {
        //console.log(event);
        if (event === 'none') return;

        $(this._listenedBlock).on(event, this.eventHandler.bind(this, event));
      });

      /*autoplay*/
      this._scenario.forEach((scenario) => {
        this.autoplayScenario(scenario);
      });
    }

    fliterScenario(scenario) {
      let result = [];

      if (!scenario) return false;

      if ($.isArray(scenario)) {
        result = scenario.filter((item) => {
          return $.isPlainObject(item) && item.target && item.event;
        });

        if (!result.length) return false;

        result = result.map((item) => {
          return $.extend(true, {}, defaultScenario, item);
        });

        return result;
      }

      if ($.isPlainObject(scenario) && scenario.target && scenario.event) {
        result.push($.extend(true, {}, defaultScenario, scenario));

        return result;
      }

      return false;
    }

    getEvents(scenarioArr) {
      let events = [];

      scenarioArr.forEach((item) => {
        //console.log(item.event);
        let currEvents = this.stringToArray(item.event);
        //console.log(currEvents);

        for(let i = 0; i < currEvents.length; i++) {
          if (~$.inArray(currEvents[i], events)) continue;

          events.push(currEvents[i]);
        }
      });

      return events;
    }

    getEligibleScenario(scenario) {
      let cashedScenario = this.getCookies(scenario);
      let result = false;
      let date = new Date();


      if (!cashedScenario) {
        this.putCookies(scenario);

        result = true;
      } else {
        let comparator = this.compareScenario(scenario, cashedScenario);

        switch (comparator) {
          case 1 :
            this.deleteCookies(cashedScenario);
            this.putCookies(scenario);
            result = true;
            break;
          case 0 :
            scenario = cashedScenario;
            result = true;
            break;
          case -1 :
            result = false;
            break;
          default :
            result = false;
            break;
        }
      }

      if (!scenario.date) {
        scenario = $.extend(true, {}, scenario, {date: date});
      }

      /*check timing*/
      if (result && this.isEligibleDate(scenario)) {
        result = true;
      } else {
        result = false;
      }

      /*new/old user*/
      if (result && scenario.userStatus) {
        if (scenario.userStatus === 'new') {
          result = this.isNewUser(scenario);
        } else if (scenario.userStatus === 'old') {
          result = !this.isNewUser(scenario);
        }
      }

      return result ? scenario: false;
    }

    getScenarioByEvent(scenarioArr, event) {
      return scenarioArr.filter((item) => {
        let currEvents = this.stringToArray(item.event);

        for(let i = 0; i < currEvents.length; i++) {
          if (currEvents[i] === event) return true;
        }

        return false;
      });
    }

    compareScenario(scenario1, scenario2) {
      let priorityCompare = null;

      if (scenario1.priority > scenario2.priority) {
        priorityCompare = 1;
      } else if (scenario1.priority === scenario2.priority) {
        priorityCompare = 0;
      } else {
        priorityCompare = -1;
      }

      return priorityCompare;
    }

    isEligibleDate(scenario) {
      let date = new Date() - Date.parse(scenario.date);
      //console.log(scenario.date);
      //console.log(Date.parse(scenario.date));

      if (+scenario.showAfter === 0 &&
        scenario.sessionId === defaultScenario.sessionId) {
        return true;
      }

      if (typeof scenario.showAfter === 'string') {
        let timers = this.parseTimer(scenario.showAfter);

        for (let i = 0; i < timers.length; i++) {
          //console.log('now = ' + date);
          //console.log('timer from = ' + timers[i].from);
          //console.log('timer to = ' +timers[i].to);
          if (timers[i].from <= date && timers[i].to >= date) return true;
        }
      }

      return false;
    }

    parseTimer(timerStr) {
      let timersArr = this.stringToArray(timerStr);
      let parsedTimersArr = [];
      let minutes = 60 * 1000;

      for (let i = 0; i < timersArr.length; i++) {
        let fromTo = this.stringToArray(timersArr[i], '-');

        //fromTo[0] = parseInt(fromTo[0]) * minutes;
        //fromTo[1] = parseInt(fromTo[1]) * minutes;

        parsedTimersArr.push({
          from: parseInt(fromTo[0]) * minutes,
          to: parseInt(fromTo[1]) * minutes
        });
      }

      return parsedTimersArr;
    }

    setupUserInfo() {
      let userGlobal = $.cookie(defaultScenario.newUserGlobal);
      let userPage = $.cookie(defaultScenario.newUserPage);
      let cachedJsonOption = $.cookie.json;
      let userInfo = {
        date: new Date()
      };

      let mess;

      //console.log(userInfo);
      //console.log(userGlobal);
      //console.log(userPage);

      $.cookie.json = true;

      if (!userGlobal) {
        mess = $.cookie(defaultScenario.newUserGlobal, userInfo, {path: '/'}); //$.cookie(defaultScenario.newUserGlobal, userInfo, {path: '/'});
        //console.log(mess);
      }

      if (!userPage) {
        mess = $.cookie(defaultScenario.newUserPage, userInfo);
        //console.log(mess);
      }

      $.cookie.json = cachedJsonOption;
    }

    isNewUser(scenario) {
      let currDate = new Date();
      let timeIndex = 24 * 60 * 60 * 1000; //day in milliseconds
      let cachedJsonOption = $.cookie.json;
      let userName;
      let userInfo;

      $.cookie.json = true;

      if (scenario.newUserEntrance === 'page') {
        userName = scenario.newUserPage;
      } else  { //if (scenario.newUserEntrance === 'site') возможно надо точное сравнение
        userName = scenario.newUserGlobal;
      }
      userInfo = $.cookie(userName);

      if (!userInfo || !userInfo.date) {
        let userData = this.setupUserInfo();
        //userInfo = userData[userName];

        userInfo = $.cookie(userName);
      }

      if (userInfo === undefined) {
        return true;
      }

      $.cookie.json = cachedJsonOption;

      return currDate - Date.parse(userInfo.date) < scenario.newUserStatus * timeIndex;
    }

    eventHandler(eName, e) {
      let scenarioArr = this.getScenarioByEvent(this._scenario, eName);

      for (let i = 0; i < scenarioArr.length; i++) {
        let scenario = this.getEligibleScenario(scenarioArr[i]);

        if (!scenario) continue;

        this.playScenario(scenario);
      }
    }

    playScenario(scenario) {
      if (!scenario) return;

      let isOnShow = typeof scenario.onShow === 'function';

      if (scenario.delay) {
        setTimeout(() => {
          //console.log('playscenario');
          if (isOnShow) scenario.onShow(scenario, this);

          $(this._listenedBlock).trigger(scenario.triggeredEvent, [scenario]);
        }, scenario.delay * 1000);
      } else {
        //console.log('playscenario');
        if (isOnShow) scenario.onShow(scenario, this);

        $(this._listenedBlock).trigger(scenario.triggeredEvent, [scenario]);
      }
    }

    autoplayScenario(scenario) {
      if (!scenario.autoplay) return false;

      return setTimeout(() => {
        this.playScenario(this.getEligibleScenario(scenario));
      }, parseInt(scenario.autoplayDelay) * 1000);
    }

    getCookies(scenario) {
      let cachedJsonOption = $.cookie.json;
      $.cookie.json = true;
      let cookie = $.cookie(scenario.target);
      $.cookie.json = cachedJsonOption;

      return cookie;
    }

    putCookies(scenario) {
      if (!scenario.date) {
        scenario = $.extend(true, {}, scenario, {date: new Date()});
      }

      let cachedJsonOption = $.cookie.json;
      $.cookie.json = true;
      $.cookie(scenario.target, scenario);
      $.cookie.json = cachedJsonOption;
    }

    deleteCookies(scenario) {
      return $.removeCookie(scenario.target);
    }

    stringToArray(str, comparator) {
      comparator = comparator || ', ';

      if (typeof str !== 'string') return false;

      return str
        .split(comparator)
        .map((item) => {
          return $.trim(item);
        });
    }
  }


  const defaultScenario = {
    target: null, //string, jQuery Object: target block, using multiple selectors or objects only with simplebox
    event: null, /*string: native or custom events, multiple events allowed like 'click, hover, myCustomEvent',
                'none' event for autoplay usage, if no need to trigger play scenario againe */
    triggeredEvent: 'jPageEventLive:playScenario', // string: 'playScenario' triggered event name
    openingMethod: 'jBox', // string: 'simplebox', 'jBox'
    showAfter: 0, // string: '0 - 10, 20 - 30', timer cycles in minutes
    priority: 1, // integrer
    autoplay: false, //boolean: enable autoplay
    autoplayDelay: 0, // seconds
    delay: 0, // event triggering delay
    sessionId: Math.random(), //integrer: unique current session id
    userStatus: false, //string: 'new', 'old', false
    newUserGlobal: 'userInfoGlobal', //string: global (current website) user cookies name
    newUserPage: 'userInfoPage', //string: local (current page) user cookies name
    newUserStatus: 7, // integrer: days user is new
    newUserEntrance: 'page', // 'page', 'site'
    onShow: null, //function: callback on show
    onClose: null //function not used
  };


  /*setup new user*/
  JPageEventLiveController.prototype.setupUserInfo.call(null);

  $.fn.jPageEventLive = function () {
    let options = typeof arguments[0] === 'object' ? arguments[0] : {};

    $(this).each(function () {
      let controller = new JPageEventLiveController(this, options);
      //console.dir(controller);
      controller.init();
    });
  };
}));


/*simple block opener*/
(function ($) {

  class SimpleBox{
    constructor() {
      this._isActive = false;
      this._activeCounter = 0;
      this._isOpening = null;
      this.listenedEvent = 'jPageEventLive:playScenario';
      this.closeBtn = '<span class="lightbox-close">x</span>';
      this.inner = '<div class="lightbox-inner"></div>';
      this.outer = '<div class="simple-box lightbox-outer"></div>';
      this.closeBtnSelector = '.lightbox-close';
      this.innerSelector = '.lightbox-inner';
      this.outerSelector = '.lightbox-outer';
      this.contentSelector = '.lightbox-content';
      this.lightboxSelector = '.simple-box';
    }

    init() {
      //let _ = this;
      //let listenedEvent = _.listenedEvent;

      $('body')
        .on(this.listenedEvent, this.eventHandler.bind(this))
        .on('click', this.outerClickChecker.bind(this))
        .on('click', this.closeBtnHandler.bind(this));
    }

    showBlock(block) {
      let $block = this.setupBlock(block);

      if (this._isOpening) {
        this._isOpening = this._isOpening.add($block);
      } else {
        this._isOpening = $block;
      }

      $block.fadeIn(() => {
        this._isOpening = null;
      });
      /*this._isActive = true;
       this._activeCounter += $(block).length;*/
    }

    hideBlock(block) {
      let $block = $(block);

      /*this._activeCounter = (this._activeCounter - $block.length) >= 0 ?
       this._activeCounter - $block.length : 0;

       if(!this._activeCounter) this._isActive = false;*/

      $block.add($block.find(this.contentSelector)).fadeOut(() => {
        this.stripBlock($block);
      });
    }

    setupBlock(block) {
      /*return $(block)
       .addClass(this.contentSelector.slice(1))
       .show()
       .wrap(this.outer)
       .wrap(this.inner)
       .parent(this.outerSelector)
       .append(this.closeBtn)
       .hide();*/

      let $block = $(block);

      $block.each((index, item) => {
        let $item = $(item);

        if ($item.closest(this.outerSelector).length) return;

        $(item)
          .addClass(this.contentSelector.slice(1))
          .wrap(this.outer)
          .wrap(this.inner)
          .show()
          .closest(this.outerSelector)
          .append(this.closeBtn)
          .hide();
      });

      let $lightbox = $block.closest(this.lightboxSelector);
      //console.log($block[0]);

      /*$block = $block
        .closest(this.outerSelector)
        .append(this.closeBtn)
        .hide();*/

      //console.log($block[0]);

      return $lightbox;
    }

    stripBlock(block) {
      var $outer = $(block).closest(this.outerSelector);
      var $block = $outer.find(this.contentSelector);

      //console.log($outer[0]);
      $outer.find(this.closeBtnSelector).remove();
      //console.log($outer[0]);
      $block
        .unwrap()
        .unwrap()
        .removeClass(this.contentSelector.slice(1));
    }

    eventHandler(e, scenario) {
      if (scenario.openingMethod !== 'simplebox') return;

      let target = scenario.target;

      this.showBlock(target);
    }

    outerClickChecker(e) {
      let el = e.target;
      let target = el.closest(this.lightboxSelector);


      if (target) return;
      if (!$(this.lightboxSelector).length) return;

      if (this._isOpening) {
        this.hideBlock($(this.lightboxSelector).not(this._isOpening));
        return;
      }

      this.hideBlock(this.lightboxSelector);
    }

    closeBtnHandler(e) {
      let el = e.target;
      let closeBtn = el.closest(this.closeBtnSelector);

      if (!closeBtn) return;

      this.hideBlock(closeBtn.closest(this.lightboxSelector));
    }
  }

  /*block opener init*/
  let simpleLightbox = new SimpleBox();

  simpleLightbox.init();
})(jQuery);
