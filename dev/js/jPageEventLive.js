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
  var JPageEventLiveController = function () {
    function JPageEventLiveController(listenedBlock, scenario) {
      _classCallCheck(this, JPageEventLiveController);

      this._listenedBlock = listenedBlock;
      this._scenario = scenario;
    }

    _createClass(JPageEventLiveController, [{
      key: 'init',
      value: function init() {
        var _this = this;

        this._scenario = this.fliterScenario(this._scenario);

        if (!this._scenario) return;
        //console.log(this._scenario);

        this._events = this.getEvents(this._scenario);

        this._events.forEach(function (event) {
          //console.log(event);
          if (event === 'none') return;

          $(_this._listenedBlock).on(event, _this.eventHandler.bind(_this, event));
        });

        /*autoplay*/
        this._scenario.forEach(function (scenario) {
          _this.autoplayScenario(scenario);
        });
      }
    }, {
      key: 'fliterScenario',
      value: function fliterScenario(scenario) {
        var result = [];

        if (!scenario) return false;

        if ($.isArray(scenario)) {
          result = scenario.filter(function (item) {
            return $.isPlainObject(item) && item.target && item.event;
          });

          if (!result.length) return false;

          result = result.map(function (item) {
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
    }, {
      key: 'getEvents',
      value: function getEvents(scenarioArr) {
        var _this2 = this;

        var events = [];

        scenarioArr.forEach(function (item) {
          //console.log(item.event);
          var currEvents = _this2.stringToArray(item.event);
          //console.log(currEvents);

          for (var i = 0; i < currEvents.length; i++) {
            if (~$.inArray(currEvents[i], events)) continue;

            events.push(currEvents[i]);
          }
        });

        return events;
      }
    }, {
      key: 'getEligibleScenario',
      value: function getEligibleScenario(scenario) {
        var cashedScenario = this.getCookies(scenario);
        var result = false;
        var date = new Date();

        if (!cashedScenario) {
          this.putCookies(scenario);

          result = true;
        } else {
          var comparator = this.compareScenario(scenario, cashedScenario);

          switch (comparator) {
            case 1:
              this.deleteCookies(cashedScenario);
              this.putCookies(scenario);
              result = true;
              break;
            case 0:
              scenario = cashedScenario;
              result = true;
              break;
            case -1:
              result = false;
              break;
            default:
              result = false;
              break;
          }
        }

        if (!scenario.date) {
          scenario = $.extend(true, {}, scenario, { date: date });
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

        return result ? scenario : false;
      }
    }, {
      key: 'getScenarioByEvent',
      value: function getScenarioByEvent(scenarioArr, event) {
        var _this3 = this;

        return scenarioArr.filter(function (item) {
          var currEvents = _this3.stringToArray(item.event);

          for (var i = 0; i < currEvents.length; i++) {
            if (currEvents[i] === event) return true;
          }

          return false;
        });
      }
    }, {
      key: 'compareScenario',
      value: function compareScenario(scenario1, scenario2) {
        var priorityCompare = null;

        if (scenario1.priority > scenario2.priority) {
          priorityCompare = 1;
        } else if (scenario1.priority === scenario2.priority) {
          priorityCompare = 0;
        } else {
          priorityCompare = -1;
        }

        return priorityCompare;
      }
    }, {
      key: 'isEligibleDate',
      value: function isEligibleDate(scenario) {
        var date = new Date() - Date.parse(scenario.date);
        //console.log(scenario.date);
        //console.log(Date.parse(scenario.date));

        if (+scenario.showAfter === 0 && scenario.sessionId === defaultScenario.sessionId) {
          return true;
        }

        if (typeof scenario.showAfter === 'string') {
          var timers = this.parseTimer(scenario.showAfter);

          for (var i = 0; i < timers.length; i++) {
            //console.log('now = ' + date);
            //console.log('timer from = ' + timers[i].from);
            //console.log('timer to = ' +timers[i].to);
            if (timers[i].from <= date && timers[i].to >= date) return true;
          }
        }

        return false;
      }
    }, {
      key: 'parseTimer',
      value: function parseTimer(timerStr) {
        var timersArr = this.stringToArray(timerStr);
        var parsedTimersArr = [];
        var minutes = 60 * 1000;

        for (var i = 0; i < timersArr.length; i++) {
          var fromTo = this.stringToArray(timersArr[i], '-');

          //fromTo[0] = parseInt(fromTo[0]) * minutes;
          //fromTo[1] = parseInt(fromTo[1]) * minutes;

          parsedTimersArr.push({
            from: parseInt(fromTo[0]) * minutes,
            to: parseInt(fromTo[1]) * minutes
          });
        }

        return parsedTimersArr;
      }
    }, {
      key: 'setupUserInfo',
      value: function setupUserInfo() {
        var userGlobal = $.cookie(defaultScenario.newUserGlobal);
        var userPage = $.cookie(defaultScenario.newUserPage);
        var cachedJsonOption = $.cookie.json;
        var userInfo = {
          date: new Date()
        };

        var mess = void 0;

        //console.log(userInfo);
        //console.log(userGlobal);
        //console.log(userPage);

        $.cookie.json = true;

        if (!userGlobal) {
          mess = $.cookie(defaultScenario.newUserGlobal, userInfo, { path: '/' }); //$.cookie(defaultScenario.newUserGlobal, userInfo, {path: '/'});
          //console.log(mess);
        }

        if (!userPage) {
          mess = $.cookie(defaultScenario.newUserPage, userInfo);
          //console.log(mess);
        }

        $.cookie.json = cachedJsonOption;
      }
    }, {
      key: 'isNewUser',
      value: function isNewUser(scenario) {
        var currDate = new Date();
        var timeIndex = 24 * 60 * 60 * 1000; //day in milliseconds
        var cachedJsonOption = $.cookie.json;
        var userName = void 0;
        var userInfo = void 0;

        $.cookie.json = true;

        if (scenario.newUserEntrance === 'page') {
          userName = scenario.newUserPage;
        } else {
          //if (scenario.newUserEntrance === 'site') возможно надо точное сравнение
          userName = scenario.newUserGlobal;
        }
        userInfo = $.cookie(userName);

        if (!userInfo || !userInfo.date) {
          var userData = this.setupUserInfo();
          //userInfo = userData[userName];

          userInfo = $.cookie(userName);
        }

        if (userInfo === undefined) {
          return true;
        }

        $.cookie.json = cachedJsonOption;

        return currDate - Date.parse(userInfo.date) < scenario.newUserStatus * timeIndex;
      }
    }, {
      key: 'eventHandler',
      value: function eventHandler(eName, e) {
        var scenarioArr = this.getScenarioByEvent(this._scenario, eName);

        for (var i = 0; i < scenarioArr.length; i++) {
          var scenario = this.getEligibleScenario(scenarioArr[i]);

          if (!scenario) continue;

          this.playScenario(scenario);
        }
      }
    }, {
      key: 'playScenario',
      value: function playScenario(scenario) {
        var _this4 = this;

        if (!scenario) return;

        var isOnShow = typeof scenario.onShow === 'function';

        if (scenario.delay) {
          setTimeout(function () {
            //console.log('playscenario');
            if (isOnShow) scenario.onShow(scenario, _this4);

            $(_this4._listenedBlock).trigger(scenario.triggeredEvent, [scenario]);
          }, scenario.delay * 1000);
        } else {
          //console.log('playscenario');
          if (isOnShow) scenario.onShow(scenario, this);

          $(this._listenedBlock).trigger(scenario.triggeredEvent, [scenario]);
        }
      }
    }, {
      key: 'autoplayScenario',
      value: function autoplayScenario(scenario) {
        var _this5 = this;

        if (!scenario.autoplay) return false;

        return setTimeout(function () {
          _this5.playScenario(_this5.getEligibleScenario(scenario));
        }, parseInt(scenario.autoplayDelay) * 1000);
      }
    }, {
      key: 'getCookies',
      value: function getCookies(scenario) {
        var cachedJsonOption = $.cookie.json;
        $.cookie.json = true;
        var cookie = $.cookie(scenario.target);
        $.cookie.json = cachedJsonOption;

        return cookie;
      }
    }, {
      key: 'putCookies',
      value: function putCookies(scenario) {
        if (!scenario.date) {
          scenario = $.extend(true, {}, scenario, { date: new Date() });
        }

        var cachedJsonOption = $.cookie.json;
        $.cookie.json = true;
        $.cookie(scenario.target, scenario);
        $.cookie.json = cachedJsonOption;
      }
    }, {
      key: 'deleteCookies',
      value: function deleteCookies(scenario) {
        return $.removeCookie(scenario.target);
      }
    }, {
      key: 'stringToArray',
      value: function stringToArray(str, comparator) {
        comparator = comparator || ', ';

        if (typeof str !== 'string') return false;

        return str.split(comparator).map(function (item) {
          return $.trim(item);
        });
      }
    }]);

    return JPageEventLiveController;
  }();

  var defaultScenario = {
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
    var options = _typeof(arguments[0]) === 'object' ? arguments[0] : {};

    $(this).each(function () {
      var controller = new JPageEventLiveController(this, options);
      //console.dir(controller);
      controller.init();
    });
  };
});

/*simple block opener*/
(function ($) {
  var SimpleBox = function () {
    function SimpleBox() {
      _classCallCheck(this, SimpleBox);

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

    _createClass(SimpleBox, [{
      key: 'init',
      value: function init() {
        //let _ = this;
        //let listenedEvent = _.listenedEvent;

        $('body').on(this.listenedEvent, this.eventHandler.bind(this)).on('click', this.outerClickChecker.bind(this)).on('click', this.closeBtnHandler.bind(this));
      }
    }, {
      key: 'showBlock',
      value: function showBlock(block) {
        var _this6 = this;

        var $block = this.setupBlock(block);

        if (this._isOpening) {
          this._isOpening = this._isOpening.add($block);
        } else {
          this._isOpening = $block;
        }

        $block.fadeIn(function () {
          _this6._isOpening = null;
        });
        /*this._isActive = true;
         this._activeCounter += $(block).length;*/
      }
    }, {
      key: 'hideBlock',
      value: function hideBlock(block) {
        var _this7 = this;

        var $block = $(block);

        /*this._activeCounter = (this._activeCounter - $block.length) >= 0 ?
         this._activeCounter - $block.length : 0;
          if(!this._activeCounter) this._isActive = false;*/

        $block.add($block.find(this.contentSelector)).fadeOut(function () {
          _this7.stripBlock($block);
        });
      }
    }, {
      key: 'setupBlock',
      value: function setupBlock(block) {
        var _this8 = this;

        /*return $(block)
         .addClass(this.contentSelector.slice(1))
         .show()
         .wrap(this.outer)
         .wrap(this.inner)
         .parent(this.outerSelector)
         .append(this.closeBtn)
         .hide();*/

        var $block = $(block);

        $block.each(function (index, item) {
          var $item = $(item);

          if ($item.closest(_this8.outerSelector).length) return;

          $(item).addClass(_this8.contentSelector.slice(1)).wrap(_this8.outer).wrap(_this8.inner).show().closest(_this8.outerSelector).append(_this8.closeBtn).hide();
        });

        var $lightbox = $block.closest(this.lightboxSelector);
        //console.log($block[0]);

        /*$block = $block
          .closest(this.outerSelector)
          .append(this.closeBtn)
          .hide();*/

        //console.log($block[0]);

        return $lightbox;
      }
    }, {
      key: 'stripBlock',
      value: function stripBlock(block) {
        var $outer = $(block).closest(this.outerSelector);
        var $block = $outer.find(this.contentSelector);

        //console.log($outer[0]);
        $outer.find(this.closeBtnSelector).remove();
        //console.log($outer[0]);
        $block.unwrap().unwrap().removeClass(this.contentSelector.slice(1));
      }
    }, {
      key: 'eventHandler',
      value: function eventHandler(e, scenario) {
        if (scenario.openingMethod !== 'simplebox') return;

        var target = scenario.target;

        this.showBlock(target);
      }
    }, {
      key: 'outerClickChecker',
      value: function outerClickChecker(e) {
        var el = e.target;
        var target = el.closest(this.lightboxSelector);

        if (target) return;
        if (!$(this.lightboxSelector).length) return;

        if (this._isOpening) {
          this.hideBlock($(this.lightboxSelector).not(this._isOpening));
          return;
        }

        this.hideBlock(this.lightboxSelector);
      }
    }, {
      key: 'closeBtnHandler',
      value: function closeBtnHandler(e) {
        var el = e.target;
        var closeBtn = el.closest(this.closeBtnSelector);

        if (!closeBtn) return;

        this.hideBlock(closeBtn.closest(this.lightboxSelector));
      }
    }]);

    return SimpleBox;
  }();

  /*block opener init*/


  var simpleLightbox = new SimpleBox();

  simpleLightbox.init();
})(jQuery);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpzL2pQYWdlRXZlbnRMaXZlLmVzNi5qcyJdLCJuYW1lcyI6WyJmYWN0b3J5IiwiZGVmaW5lIiwiYW1kIiwiZXhwb3J0cyIsIm1vZHVsZSIsInJlcXVpcmUiLCJqUXVlcnkiLCIkIiwiSlBhZ2VFdmVudExpdmVDb250cm9sbGVyIiwibGlzdGVuZWRCbG9jayIsInNjZW5hcmlvIiwiX2xpc3RlbmVkQmxvY2siLCJfc2NlbmFyaW8iLCJmbGl0ZXJTY2VuYXJpbyIsIl9ldmVudHMiLCJnZXRFdmVudHMiLCJmb3JFYWNoIiwiZXZlbnQiLCJvbiIsImV2ZW50SGFuZGxlciIsImJpbmQiLCJhdXRvcGxheVNjZW5hcmlvIiwicmVzdWx0IiwiaXNBcnJheSIsImZpbHRlciIsIml0ZW0iLCJpc1BsYWluT2JqZWN0IiwidGFyZ2V0IiwibGVuZ3RoIiwibWFwIiwiZXh0ZW5kIiwiZGVmYXVsdFNjZW5hcmlvIiwicHVzaCIsInNjZW5hcmlvQXJyIiwiZXZlbnRzIiwiY3VyckV2ZW50cyIsInN0cmluZ1RvQXJyYXkiLCJpIiwiaW5BcnJheSIsImNhc2hlZFNjZW5hcmlvIiwiZ2V0Q29va2llcyIsImRhdGUiLCJEYXRlIiwicHV0Q29va2llcyIsImNvbXBhcmF0b3IiLCJjb21wYXJlU2NlbmFyaW8iLCJkZWxldGVDb29raWVzIiwiaXNFbGlnaWJsZURhdGUiLCJ1c2VyU3RhdHVzIiwiaXNOZXdVc2VyIiwic2NlbmFyaW8xIiwic2NlbmFyaW8yIiwicHJpb3JpdHlDb21wYXJlIiwicHJpb3JpdHkiLCJwYXJzZSIsInNob3dBZnRlciIsInNlc3Npb25JZCIsInRpbWVycyIsInBhcnNlVGltZXIiLCJmcm9tIiwidG8iLCJ0aW1lclN0ciIsInRpbWVyc0FyciIsInBhcnNlZFRpbWVyc0FyciIsIm1pbnV0ZXMiLCJmcm9tVG8iLCJwYXJzZUludCIsInVzZXJHbG9iYWwiLCJjb29raWUiLCJuZXdVc2VyR2xvYmFsIiwidXNlclBhZ2UiLCJuZXdVc2VyUGFnZSIsImNhY2hlZEpzb25PcHRpb24iLCJqc29uIiwidXNlckluZm8iLCJtZXNzIiwicGF0aCIsImN1cnJEYXRlIiwidGltZUluZGV4IiwidXNlck5hbWUiLCJuZXdVc2VyRW50cmFuY2UiLCJ1c2VyRGF0YSIsInNldHVwVXNlckluZm8iLCJ1bmRlZmluZWQiLCJuZXdVc2VyU3RhdHVzIiwiZU5hbWUiLCJlIiwiZ2V0U2NlbmFyaW9CeUV2ZW50IiwiZ2V0RWxpZ2libGVTY2VuYXJpbyIsInBsYXlTY2VuYXJpbyIsImlzT25TaG93Iiwib25TaG93IiwiZGVsYXkiLCJzZXRUaW1lb3V0IiwidHJpZ2dlciIsInRyaWdnZXJlZEV2ZW50IiwiYXV0b3BsYXkiLCJhdXRvcGxheURlbGF5IiwicmVtb3ZlQ29va2llIiwic3RyIiwic3BsaXQiLCJ0cmltIiwib3BlbmluZ01ldGhvZCIsIk1hdGgiLCJyYW5kb20iLCJvbkNsb3NlIiwicHJvdG90eXBlIiwiY2FsbCIsImZuIiwialBhZ2VFdmVudExpdmUiLCJvcHRpb25zIiwiYXJndW1lbnRzIiwiZWFjaCIsImNvbnRyb2xsZXIiLCJpbml0IiwiU2ltcGxlQm94IiwiX2lzQWN0aXZlIiwiX2FjdGl2ZUNvdW50ZXIiLCJfaXNPcGVuaW5nIiwibGlzdGVuZWRFdmVudCIsImNsb3NlQnRuIiwiaW5uZXIiLCJvdXRlciIsImNsb3NlQnRuU2VsZWN0b3IiLCJpbm5lclNlbGVjdG9yIiwib3V0ZXJTZWxlY3RvciIsImNvbnRlbnRTZWxlY3RvciIsImxpZ2h0Ym94U2VsZWN0b3IiLCJvdXRlckNsaWNrQ2hlY2tlciIsImNsb3NlQnRuSGFuZGxlciIsImJsb2NrIiwiJGJsb2NrIiwic2V0dXBCbG9jayIsImFkZCIsImZhZGVJbiIsImZpbmQiLCJmYWRlT3V0Iiwic3RyaXBCbG9jayIsImluZGV4IiwiJGl0ZW0iLCJjbG9zZXN0IiwiYWRkQ2xhc3MiLCJzbGljZSIsIndyYXAiLCJzaG93IiwiYXBwZW5kIiwiaGlkZSIsIiRsaWdodGJveCIsIiRvdXRlciIsInJlbW92ZSIsInVud3JhcCIsInJlbW92ZUNs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QUFJNkYsV0FBV2lDLEdBQUdiLE9BQUgsQ0FBVyxLQUFLakIsZ0JBQWhCLENBQWY7O0FBRUEsWUFBSSxDQUFDSCxRQUFMLEVBQWU7O0FBRWYsYUFBS2tDLFNBQUwsQ0FBZWxDLFNBQVNvQixPQUFULENBQWlCLEtBQUtiLGdCQUF0QixDQUFmO0FBQ0Q7QUE3SVM7O0FBQUE7QUFBQTs7QUFnSlo7OztBQUNBLE1BQUk2QixpQkFBaUIsSUFBSXpDLFNBQUosRUFBckI7O0FBRUF5QyxpQkFBZTFDLElBQWY7QUFDRCxDQXBKRCxFQW9KRzVHLE1BcEpIIiwiZmlsZSI6ImpzL2pQYWdlRXZlbnRMaXZlLmVzNi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uIChmYWN0b3J5KSB7XG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAvLyBBTUQgKFJlZ2lzdGVyIGFzIGFuIGFub255bW91cyBtb2R1bGUpXG4gICAgZGVmaW5lKFsnanF1ZXJ5J10sIGZhY3RvcnkpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuICAgIC8vIE5vZGUvQ29tbW9uSlNcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkocmVxdWlyZSgnanF1ZXJ5JykpO1xuICB9IGVsc2Uge1xuICAgIC8vIEJyb3dzZXIgZ2xvYmFsc1xuICAgIGZhY3RvcnkoalF1ZXJ5KTtcbiAgfVxufShmdW5jdGlvbiAoJCkge1xuICBjbGFzcyBKUGFnZUV2ZW50TGl2ZUNvbnRyb2xsZXIge1xuICAgIGNvbnN0cnVjdG9yIChsaXN0ZW5lZEJsb2NrLCBzY2VuYXJpbykge1xuICAgICAgdGhpcy5fbGlzdGVuZWRCbG9jayA9IGxpc3RlbmVkQmxvY2s7XG4gICAgICB0aGlzLl9zY2VuYXJpbyA9IHNjZW5hcmlvO1xuICAgIH1cblxuICAgIGluaXQoKSB7XG4gICAgICB0aGlzLl9zY2VuYXJpbyA9IHRoaXMuZmxpdGVyU2NlbmFyaW8odGhpcy5fc2NlbmFyaW8pO1xuXG4gICAgICBpZiAoIXRoaXMuX3NjZW5hcmlvKSByZXR1cm47XG4gICAgICAvL2NvbnNvbGUubG9nKHRoaXMuX3NjZW5hcmlvKTtcblxuICAgICAgdGhpcy5fZXZlbnRzID0gdGhpcy5nZXRFdmVudHModGhpcy5fc2NlbmFyaW8pO1xuXG4gICAgICB0aGlzLl9ldmVudHMuZm9yRWFjaCgoZXZlbnQpID0+IHtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhldmVudCk7XG4gICAgICAgIGlmIChldmVudCA9PT0gJ25vbmUnKSByZXR1cm47XG5cbiAgICAgICAgJCh0aGlzLl9saXN0ZW5lZEJsb2NrKS5vbihldmVudCwgdGhpcy5ldmVudEhhbmRsZXIuYmluZCh0aGlzLCBldmVudCkpO1xuICAgICAgfSk7XG5cbiAgICAgIC8qYXV0b3BsYXkqL1xuICAgICAgdGhpcy5fc2NlbmFyaW8uZm9yRWFjaCgoc2NlbmFyaW8pID0+IHtcbiAgICAgICAgdGhpcy5hdXRvcGxheVNjZW5hcmlvKHNjZW5hcmlvKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGZsaXRlclNjZW5hcmlvKHNjZW5hcmlvKSB7XG4gICAgICBsZXQgcmVzdWx0ID0gW107XG5cbiAgICAgIGlmICghc2NlbmFyaW8pIHJldHVybiBmYWxzZTtcblxuICAgICAgaWYgKCQuaXNBcnJheShzY2VuYXJpbykpIHtcbiAgICAgICAgcmVzdWx0ID0gc2NlbmFyaW8uZmlsdGVyKChpdGVtKSA9PiB7XG4gICAgICAgICAgcmV0dXJuICQuaXNQbGFpbk9iamVjdChpdGVtKSAmJiBpdGVtLnRhcmdldCAmJiBpdGVtLmV2ZW50O1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoIXJlc3VsdC5sZW5ndGgpIHJldHVybiBmYWxzZTtcblxuICAgICAgICByZXN1bHQgPSByZXN1bHQubWFwKChpdGVtKSA9PiB7XG4gICAgICAgICAgcmV0dXJuICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0U2NlbmFyaW8sIGl0ZW0pO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfVxuXG4gICAgICBpZiAoJC5pc1BsYWluT2JqZWN0KHNjZW5hcmlvKSAmJiBzY2VuYXJpby50YXJnZXQgJiYgc2NlbmFyaW8uZXZlbnQpIHtcbiAgICAgICAgcmVzdWx0LnB1c2goJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRTY2VuYXJpbywgc2NlbmFyaW8pKTtcblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZ2V0RXZlbnRzKHNjZW5hcmlvQXJyKSB7XG4gICAgICBsZXQgZXZlbnRzID0gW107XG5cbiAgICAgIHNjZW5hcmlvQXJyLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhpdGVtLmV2ZW50KTtcbiAgICAgICAgbGV0IGN1cnJFdmVudHMgPSB0aGlzLnN0cmluZ1RvQXJyYXkoaXRlbS5ldmVudCk7XG4gICAgICAgIC8vY29uc29sZS5sb2coY3VyckV2ZW50cyk7XG5cbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IGN1cnJFdmVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpZiAofiQuaW5BcnJheShjdXJyRXZlbnRzW2ldLCBldmVudHMpKSBjb250aW51ZTtcblxuICAgICAgICAgIGV2ZW50cy5wdXNoKGN1cnJFdmVudHNbaV0pO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIGV2ZW50cztcbiAgICB9XG5cbiAgICBnZXRFbGlnaWJsZVNjZW5hcmlvKHNjZW5hcmlvKSB7XG4gICAgICBsZXQgY2FzaGVkU2NlbmFyaW8gPSB0aGlzLmdldENvb2tpZXMoc2NlbmFyaW8pO1xuICAgICAgbGV0IHJlc3VsdCA9IGZhbHNlO1xuICAgICAgbGV0IGRhdGUgPSBuZXcgRGF0ZSgpO1xuXG5cbiAgICAgIGlmICghY2FzaGVkU2NlbmFyaW8pIHtcbiAgICAgICAgdGhpcy5wdXRDb29raWVzKHNjZW5hcmlvKTtcblxuICAgICAgICByZXN1bHQgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IGNvbXBhcmF0b3IgPSB0aGlzLmNvbXBhcmVTY2VuYXJpbyhzY2VuYXJpbywgY2FzaGVkU2NlbmFyaW8pO1xuXG4gICAgICAgIHN3aXRjaCAoY29tcGFyYXRvcikge1xuICAgICAgICAgIGNhc2UgMSA6XG4gICAgICAgICAgICB0aGlzLmRlbGV0ZUNvb2tpZXMoY2FzaGVkU2NlbmFyaW8pO1xuICAgICAgICAgICAgdGhpcy5wdXRDb29raWVzKHNjZW5hcmlvKTtcbiAgICAgICAgICAgIHJlc3VsdCA9IHRydWU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIDAgOlxuICAgICAgICAgICAgc2NlbmFyaW8gPSBjYXNoZWRTY2VuYXJpbztcbiAgICAgICAgICAgIHJlc3VsdCA9IHRydWU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIC0xIDpcbiAgICAgICAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgZGVmYXVsdCA6XG4gICAgICAgICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICghc2NlbmFyaW8uZGF0ZSkge1xuICAgICAgICBzY2VuYXJpbyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBzY2VuYXJpbywge2RhdGU6IGRhdGV9KTtcbiAgICAgIH1cblxuICAgICAgLypjaGVjayB0aW1pbmcqL1xuICAgICAgaWYgKHJlc3VsdCAmJiB0aGlzLmlzRWxpZ2libGVEYXRlKHNjZW5hcmlvKSkge1xuICAgICAgICByZXN1bHQgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIC8qbmV3L29sZCB1c2VyKi9cbiAgICAgIGlmIChyZXN1bHQgJiYgc2NlbmFyaW8udXNlclN0YXR1cykge1xuICAgICAgICBpZiAoc2NlbmFyaW8udXNlclN0YXR1cyA9PT0gJ25ldycpIHtcbiAgICAgICAgICByZXN1bHQgPSB0aGlzLmlzTmV3VXNlcihzY2VuYXJpbyk7XG4gICAgICAgIH0gZWxzZSBpZiAoc2NlbmFyaW8udXNlclN0YXR1cyA9PT0gJ29sZCcpIHtcbiAgICAgICAgICByZXN1bHQgPSAhdGhpcy5pc05ld1VzZXIoc2NlbmFyaW8pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHQgPyBzY2VuYXJpbzogZmFsc2U7XG4gICAgfVxuXG4gICAgZ2V0U2NlbmFyaW9CeUV2ZW50KHNjZW5hcmlvQXJyLCBldmVudCkge1xuICAgICAgcmV0dXJuIHNjZW5hcmlvQXJyLmZpbHRlcigoaXRlbSkgPT4ge1xuICAgICAgICBsZXQgY3VyckV2ZW50cyA9IHRoaXMuc3RyaW5nVG9BcnJheShpdGVtLmV2ZW50KTtcblxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgY3VyckV2ZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmIChjdXJyRXZlbnRzW2ldID09PSBldmVudCkgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBjb21wYXJlU2NlbmFyaW8oc2NlbmFyaW8xLCBzY2VuYXJpbzIpIHtcbiAgICAgIGxldCBwcmlvcml0eUNvbXBhcmUgPSBudWxsO1xuXG4gICAgICBpZiAoc2NlbmFyaW8xLnByaW9yaXR5ID4gc2NlbmFyaW8yLnByaW9yaXR5KSB7XG4gICAgICAgIHByaW9yaXR5Q29tcGFyZSA9IDE7XG4gICAgICB9IGVsc2UgaWYgKHNjZW5hcmlvMS5wcmlvcml0eSA9PT0gc2NlbmFyaW8yLnByaW9yaXR5KSB7XG4gICAgICAgIHByaW9yaXR5Q29tcGFyZSA9IDA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwcmlvcml0eUNvbXBhcmUgPSAtMTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHByaW9yaXR5Q29tcGFyZTtcbiAgICB9XG5cbiAgICBpc0VsaWdpYmxlRGF0ZShzY2VuYXJpbykge1xuICAgICAgbGV0IGRhdGUgPSBuZXcgRGF0ZSgpIC0gRGF0ZS5wYXJzZShzY2VuYXJpby5kYXRlKTtcbiAgICAgIC8vY29uc29sZS5sb2coc2NlbmFyaW8uZGF0ZSk7XG4gICAgICAvL2NvbnNvbGUubG9nKERhdGUucGFyc2Uoc2NlbmFyaW8uZGF0ZSkpO1xuXG4gICAgICBpZiAoK3NjZW5hcmlvLnNob3dBZnRlciA9PT0gMCAmJlxuICAgICAgICBzY2VuYXJpby5zZXNzaW9uSWQgPT09IGRlZmF1bHRTY2VuYXJpby5zZXNzaW9uSWQpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2Ygc2NlbmFyaW8uc2hvd0FmdGVyID09PSAnc3RyaW5nJykge1xuICAgICAgICBsZXQgdGltZXJzID0gdGhpcy5wYXJzZVRpbWVyKHNjZW5hcmlvLnNob3dBZnRlcik7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aW1lcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAvL2NvbnNvbGUubG9nKCdub3cgPSAnICsgZGF0ZSk7XG4gICAgICAgICAgLy9jb25zb2xlLmxvZygndGltZXIgZnJvbSA9ICcgKyB0aW1lcnNbaV0uZnJvbSk7XG4gICAgICAgICAgLy9jb25zb2xlLmxvZygndGltZXIgdG8gPSAnICt0aW1lcnNbaV0udG8pO1xuICAgICAgICAgIGlmICh0aW1lcnNbaV0uZnJvbSA8PSBkYXRlICYmIHRpbWVyc1tpXS50byA+PSBkYXRlKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcGFyc2VUaW1lcih0aW1lclN0cikge1xuICAgICAgbGV0IHRpbWVyc0FyciA9IHRoaXMuc3RyaW5nVG9BcnJheSh0aW1lclN0cik7XG4gICAgICBsZXQgcGFyc2VkVGltZXJzQXJyID0gW107XG4gICAgICBsZXQgbWludXRlcyA9IDYwICogMTAwMDtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aW1lcnNBcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbGV0IGZyb21UbyA9IHRoaXMuc3RyaW5nVG9BcnJheSh0aW1lcnNBcnJbaV0sICctJyk7XG5cbiAgICAgICAgLy9mcm9tVG9bMF0gPSBwYXJzZUludChmcm9tVG9bMF0pICogbWludXRlcztcbiAgICAgICAgLy9mcm9tVG9bMV0gPSBwYXJzZUludChmcm9tVG9bMV0pICogbWludXRlcztcblxuICAgICAgICBwYXJzZWRUaW1lcnNBcnIucHVzaCh7XG4gICAgICAgICAgZnJvbTogcGFyc2VJbnQoZnJvbVRvWzBdKSAqIG1pbnV0ZXMsXG4gICAgICAgICAgdG86IHBhcnNlSW50KGZyb21Ub1sxXSkgKiBtaW51dGVzXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcGFyc2VkVGltZXJzQXJyO1xuICAgIH1cblxuICAgIHNldHVwVXNlckluZm8oKSB7XG4gICAgICBsZXQgdXNlckdsb2JhbCA9ICQuY29va2llKGRlZmF1bHRTY2VuYXJpby5uZXdVc2VyR2xvYmFsKTtcbiAgICAgIGxldCB1c2VyUGFnZSA9ICQuY29va2llKGRlZmF1bHRTY2VuYXJpby5uZXdVc2VyUGFnZSk7XG4gICAgICBsZXQgY2FjaGVkSnNvbk9wdGlvbiA9ICQuY29va2llLmpzb247XG4gICAgICBsZXQgdXNlckluZm8gPSB7XG4gICAgICAgIGRhdGU6IG5ldyBEYXRlKClcbiAgICAgIH07XG5cbiAgICAgIGxldCBtZXNzO1xuXG4gICAgICAvL2NvbnNvbGUubG9nKHVzZXJJbmZvKTtcbiAgICAgIC8vY29uc29sZS5sb2codXNlckdsb2JhbCk7XG4gICAgICAvL2NvbnNvbGUubG9nKHVzZXJQYWdlKTtcblxuICAgICAgJC5jb29raWUuanNvbiA9IHRydWU7XG5cbiAgICAgIGlmICghdXNlckdsb2JhbCkge1xuICAgICAgICBtZXNzID0gJC5jb29raWUoZGVmYXVsdFNjZW5hcmlvLm5ld1VzZXJHbG9iYWwsIHVzZXJJbmZvLCB7cGF0aDogJy8nfSk7IC8vJC5jb29raWUoZGVmYXVsdFNjZW5hcmlvLm5ld1VzZXJHbG9iYWwsIHVzZXJJbmZvLCB7cGF0aDogJy8nfSk7XG4gICAgICAgIC8vY29uc29sZS5sb2cobWVzcyk7XG4gICAgICB9XG5cbiAgICAgIGlmICghdXNlclBhZ2UpIHtcbiAgICAgICAgbWVzcyA9ICQuY29va2llKGRlZmF1bHRTY2VuYXJpby5uZXdVc2VyUGFnZSwgdXNlckluZm8pO1xuICAgICAgICAvL2NvbnNvbGUubG9nKG1lc3MpO1xuICAgICAgfVxuXG4gICAgICAkLmNvb2tpZS5qc29uID0gY2FjaGVkSnNvbk9wdGlvbjtcbiAgICB9XG5cbiAgICBpc05ld1VzZXIoc2NlbmFyaW8pIHtcbiAgICAgIGxldCBjdXJyRGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICBsZXQgdGltZUluZGV4ID0gMjQgKiA2MCAqIDYwICogMTAwMDsgLy9kYXkgaW4gbWlsbGlzZWNvbmRzXG4gICAgICBsZXQgY2FjaGVkSnNvbk9wdGlvbiA9ICQuY29va2llLmpzb247XG4gICAgICBsZXQgdXNlck5hbWU7XG4gICAgICBsZXQgdXNlckluZm87XG5cbiAgICAgICQuY29va2llLmpzb24gPSB0cnVlO1xuXG4gICAgICBpZiAoc2NlbmFyaW8ubmV3VXNlckVudHJhbmNlID09PSAncGFnZScpIHtcbiAgICAgICAgdXNlck5hbWUgPSBzY2VuYXJpby5uZXdVc2VyUGFnZTtcbiAgICAgIH0gZWxzZSAgeyAvL2lmIChzY2VuYXJpby5uZXdVc2VyRW50cmFuY2UgPT09ICdzaXRlJykg0LLQvtC30LzQvtC20L3QviDQvdCw0LTQviDRgtC+0YfQvdC+0LUg0YHRgNCw0LLQvdC10L3QuNC1XG4gICAgICAgIHVzZXJOYW1lID0gc2NlbmFyaW8ubmV3VXNlckdsb2JhbDtcbiAgICAgIH1cbiAgICAgIHVzZXJJbmZvID0gJC5jb29raWUodXNlck5hbWUpO1xuXG4gICAgICBpZiAoIXVzZXJJbmZvIHx8ICF1c2VySW5mby5kYXRlKSB7XG4gICAgICAgIGxldCB1c2VyRGF0YSA9IHRoaXMuc2V0dXBVc2VySW5mbygpO1xuICAgICAgICAvL3VzZXJJbmZvID0gdXNlckRhdGFbdXNlck5hbWVdO1xuXG4gICAgICAgIHVzZXJJbmZvID0gJC5jb29raWUodXNlck5hbWUpO1xuICAgICAgfVxuXG4gICAgICBpZiAodXNlckluZm8gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgJC5jb29raWUuanNvbiA9IGNhY2hlZEpzb25PcHRpb247XG5cbiAgICAgIHJldHVybiBjdXJyRGF0ZSAtIERhdGUucGFyc2UodXNlckluZm8uZGF0ZSkgPCBzY2VuYXJpby5uZXdVc2VyU3RhdHVzICogdGltZUluZGV4O1xuICAgIH1cblxuICAgIGV2ZW50SGFuZGxlcihlTmFtZSwgZSkge1xuICAgICAgbGV0IHNjZW5hcmlvQXJyID0gdGhpcy5nZXRTY2VuYXJpb0J5RXZlbnQodGhpcy5fc2NlbmFyaW8sIGVOYW1lKTtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzY2VuYXJpb0Fyci5sZW5ndGg7IGkrKykge1xuICAgICAgICBsZXQgc2NlbmFyaW8gPSB0aGlzLmdldEVsaWdpYmxlU2NlbmFyaW8oc2NlbmFyaW9BcnJbaV0pO1xuXG4gICAgICAgIGlmICghc2NlbmFyaW8pIGNvbnRpbnVlO1xuXG4gICAgICAgIHRoaXMucGxheVNjZW5hcmlvKHNjZW5hcmlvKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBwbGF5U2NlbmFyaW8oc2NlbmFyaW8pIHtcbiAgICAgIGlmICghc2NlbmFyaW8pIHJldHVybjtcblxuICAgICAgbGV0IGlzT25TaG93ID0gdHlwZW9mIHNjZW5hcmlvLm9uU2hvdyA9PT0gJ2Z1bmN0aW9uJztcblxuICAgICAgaWYgKHNjZW5hcmlvLmRlbGF5KSB7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIC8vY29uc29sZS5sb2coJ3BsYXlzY2VuYXJpbycpO1xuICAgICAgICAgIGlmIChpc09uU2hvdykgc2NlbmFyaW8ub25TaG93KHNjZW5hcmlvLCB0aGlzKTtcblxuICAgICAgICAgICQodGhpcy5fbGlzdGVuZWRCbG9jaykudHJpZ2dlcihzY2VuYXJpby50cmlnZ2VyZWRFdmVudCwgW3NjZW5hcmlvXSk7XG4gICAgICAgIH0sIHNjZW5hcmlvLmRlbGF5ICogMTAwMCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdwbGF5c2NlbmFyaW8nKTtcbiAgICAgICAgaWYgKGlzT25TaG93KSBzY2VuYXJpby5vblNob3coc2NlbmFyaW8sIHRoaXMpO1xuXG4gICAgICAgICQodGhpcy5fbGlzdGVuZWRCbG9jaykudHJpZ2dlcihzY2VuYXJpby50cmlnZ2VyZWRFdmVudCwgW3NjZW5hcmlvXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgYXV0b3BsYXlTY2VuYXJpbyhzY2VuYXJpbykge1xuICAgICAgaWYgKCFzY2VuYXJpby5hdXRvcGxheSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgICByZXR1cm4gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMucGxheVNjZW5hcmlvKHRoaXMuZ2V0RWxpZ2libGVTY2VuYXJpbyhzY2VuYXJpbykpO1xuICAgICAgfSwgcGFyc2VJbnQoc2NlbmFyaW8uYXV0b3BsYXlEZWxheSkgKiAxMDAwKTtcbiAgICB9XG5cbiAgICBnZXRDb29raWVzKHNjZW5hcmlvKSB7XG4gICAgICBsZXQgY2FjaGVkSnNvbk9wdGlvbiA9ICQuY29va2llLmpzb247XG4gICAgICAkLmNvb2tpZS5qc29uID0gdHJ1ZTtcbiAgICAgIGxldCBjb29raWUgPSAkLmNvb2tpZShzY2VuYXJpby50YXJnZXQpO1xuICAgICAgJC5jb29raWUuanNvbiA9IGNhY2hlZEpzb25PcHRpb247XG5cbiAgICAgIHJldHVybiBjb29raWU7XG4gICAgfVxuXG4gICAgcHV0Q29va2llcyhzY2VuYXJpbykge1xuICAgICAgaWYgKCFzY2VuYXJpby5kYXRlKSB7XG4gICAgICAgIHNjZW5hcmlvID0gJC5leHRlbmQodHJ1ZSwge30sIHNjZW5hcmlvLCB7ZGF0ZTogbmV3IERhdGUoKX0pO1xuICAgICAgfVxuXG4gICAgICBsZXQgY2FjaGVkSnNvbk9wdGlvbiA9ICQuY29va2llLmpzb247XG4gICAgICAkLmNvb2tpZS5qc29uID0gdHJ1ZTtcbiAgICAgICQuY29va2llKHNjZW5hcmlvLnRhcmdldCwgc2NlbmFyaW8pO1xuICAgICAgJC5jb29raWUuanNvbiA9IGNhY2hlZEpzb25PcHRpb247XG4gICAgfVxuXG4gICAgZGVsZXRlQ29va2llcyhzY2VuYXJpbykge1xuICAgICAgcmV0dXJuICQucmVtb3ZlQ29va2llKHNjZW5hcmlvLnRhcmdldCk7XG4gICAgfVxuXG4gICAgc3RyaW5nVG9BcnJheShzdHIsIGNvbXBhcmF0b3IpIHtcbiAgICAgIGNvbXBhcmF0b3IgPSBjb21wYXJhdG9yIHx8ICcsICc7XG5cbiAgICAgIGlmICh0eXBlb2Ygc3RyICE9PSAnc3RyaW5nJykgcmV0dXJuIGZhbHNlO1xuXG4gICAgICByZXR1cm4gc3RyXG4gICAgICAgIC5zcGxpdChjb21wYXJhdG9yKVxuICAgICAgICAubWFwKChpdGVtKSA9PiB7XG4gICAgICAgICAgcmV0dXJuICQudHJpbShpdGVtKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICB9XG5cblxuICBjb25zdCBkZWZhdWx0U2NlbmFyaW8gPSB7XG4gICAgdGFyZ2V0OiBudWxsLCAvL3N0cmluZywgalF1ZXJ5IE9iamVjdDogdGFyZ2V0IGJsb2NrLCB1c2luZyBtdWx0aXBsZSBzZWxlY3RvcnMgb3Igb2JqZWN0cyBvbmx5IHdpdGggc2ltcGxlYm94XG4gICAgZXZlbnQ6IG51bGwsIC8qc3RyaW5nOiBuYXRpdmUgb3IgY3VzdG9tIGV2ZW50cywgbXVsdGlwbGUgZXZlbnRzIGFsbG93ZWQgbGlrZSAnY2xpY2ssIGhvdmVyLCBteUN1c3RvbUV2ZW50JyxcbiAgICAgICAgICAgICAgICAnbm9uZScgZXZlbnQgZm9yIGF1dG9wbGF5IHVzYWdlLCBpZiBubyBuZWVkIHRvIHRyaWdnZXIgcGxheSBzY2VuYXJpbyBhZ2FpbmUgKi9cbiAgICB0cmlnZ2VyZWRFdmVudDogJ2pQYWdlRXZlbnRMaXZlOnBsYXlTY2VuYXJpbycsIC8vIHN0cmluZzogJ3BsYXlTY2VuYXJpbycgdHJpZ2dlcmVkIGV2ZW50IG5hbWVcbiAgICBvcGVuaW5nTWV0aG9kOiAnakJveCcsIC8vIHN0cmluZzogJ3NpbXBsZWJveCcsICdqQm94J1xuICAgIHNob3dBZnRlcjogMCwgLy8gc3RyaW5nOiAnMCAtIDEwLCAyMCAtIDMwJywgdGltZXIgY3ljbGVzIGluIG1pbnV0ZXNcbiAgICBwcmlvcml0eTogMSwgLy8gaW50ZWdyZXJcbiAgICBhdXRvcGxheTogZmFsc2UsIC8vYm9vbGVhbjogZW5hYmxlIGF1dG9wbGF5XG4gICAgYXV0b3BsYXlEZWxheTogMCwgLy8gc2Vjb25kc1xuICAgIGRlbGF5OiAwLCAvLyBldmVudCB0cmlnZ2VyaW5nIGRlbGF5XG4gICAgc2Vzc2lvbklkOiBNYXRoLnJhbmRvbSgpLCAvL2ludGVncmVyOiB1bmlxdWUgY3VycmVudCBzZXNzaW9uIGlkXG4gICAgdXNlclN0YXR1czogZmFsc2UsIC8vc3RyaW5nOiAnbmV3JywgJ29sZCcsIGZhbHNlXG4gICAgbmV3VXNlckdsb2JhbDogJ3VzZXJJbmZvR2xvYmFsJywgLy9zdHJpbmc6IGdsb2JhbCAoY3VycmVudCB3ZWJzaXRlKSB1c2VyIGNvb2tpZXMgbmFtZVxuICAgIG5ld1VzZXJQYWdlOiAndXNlckluZm9QYWdlJywgLy9zdHJpbmc6IGxvY2FsIChjdXJyZW50IHBhZ2UpIHVzZXIgY29va2llcyBuYW1lXG4gICAgbmV3VXNlclN0YXR1czogNywgLy8gaW50ZWdyZXI6IGRheXMgdXNlciBpcyBuZXdcbiAgICBuZXdVc2VyRW50cmFuY2U6ICdwYWdlJywgLy8gJ3BhZ2UnLCAnc2l0ZSdcbiAgICBvblNob3c6IG51bGwsIC8vZnVuY3Rpb246IGNhbGxiYWNrIG9uIHNob3dcbiAgICBvbkNsb3NlOiBudWxsIC8vZnVuY3Rpb24gbm90IHVzZWRcbiAgfTtcblxuXG4gIC8qc2V0dXAgbmV3IHVzZXIqL1xuICBKUGFnZUV2ZW50TGl2ZUNvbnRyb2xsZXIucHJvdG90eXBlLnNldHVwVXNlckluZm8uY2FsbChudWxsKTtcblxuICAkLmZuLmpQYWdlRXZlbnRMaXZlID0gZnVuY3Rpb24gKCkge1xuICAgIGxldCBvcHRpb25zID0gdHlwZW9mIGFyZ3VtZW50c1swXSA9PT0gJ29iamVjdCcgPyBhcmd1bWVudHNbMF0gOiB7fTtcblxuICAgICQodGhpcykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICBsZXQgY29udHJvbGxlciA9IG5ldyBKUGFnZUV2ZW50TGl2ZUNvbnRyb2xsZXIodGhpcywgb3B0aW9ucyk7XG4gICAgICAvL2NvbnNvbGUuZGlyKGNvbnRyb2xsZXIpO1xuICAgICAgY29udHJvbGxlci5pbml0KCk7XG4gICAgfSk7XG4gIH07XG59KSk7XG5cblxuLypzaW1wbGUgYmxvY2sgb3BlbmVyKi9cbihmdW5jdGlvbiAoJCkge1xuXG4gIGNsYXNzIFNpbXBsZUJveHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgIHRoaXMuX2lzQWN0aXZlID0gZmFsc2U7XG4gICAgICB0aGlzLl9hY3RpdmVDb3VudGVyID0gMDtcbiAgICAgIHRoaXMuX2lzT3BlbmluZyA9IG51bGw7XG4gICAgICB0aGlzLmxpc3RlbmVkRXZlbnQgPSAnalBhZ2VFdmVudExpdmU6cGxheVNjZW5hcmlvJztcbiAgICAgIHRoaXMuY2xvc2VCdG4gPSAnPHNwYW4gY2xhc3M9XCJsaWdodGJveC1jbG9zZVwiPng8L3NwYW4+JztcbiAgICAgIHRoaXMuaW5uZXIgPSAnPGRpdiBjbGFzcz1cImxpZ2h0Ym94LWlubmVyXCI+PC9kaXY+JztcbiAgICAgIHRoaXMub3V0ZXIgPSAnPGRpdiBjbGFzcz1cInNpbXBsZS1ib3ggbGlnaHRib3gtb3V0ZXJcIj48L2Rpdj4nO1xuICAgICAgdGhpcy5jbG9zZUJ0blNlbGVjdG9yID0gJy5saWdodGJveC1jbG9zZSc7XG4gICAgICB0aGlzLmlubmVyU2VsZWN0b3IgPSAnLmxpZ2h0Ym94LWlubmVyJztcbiAgICAgIHRoaXMub3V0ZXJTZWxlY3RvciA9ICcubGlnaHRib3gtb3V0ZXInO1xuICAgICAgdGhpcy5jb250ZW50U2VsZWN0b3IgPSAnLmxpZ2h0Ym94LWNvbnRlbnQnO1xuICAgICAgdGhpcy5saWdodGJveFNlbGVjdG9yID0gJy5zaW1wbGUtYm94JztcbiAgICB9XG5cbiAgICBpbml0KCkge1xuICAgICAgLy9sZXQgXyA9IHRoaXM7XG4gICAgICAvL2xldCBsaXN0ZW5lZEV2ZW50ID0gXy5saXN0ZW5lZEV2ZW50O1xuXG4gICAgICAkKCdib2R5JylcbiAgICAgICAgLm9uKHRoaXMubGlzdGVuZWRFdmVudCwgdGhpcy5ldmVudEhhbmRsZXIuYmluZCh0aGlzKSlcbiAgICAgICAgLm9uKCdjbGljaycsIHRoaXMub3V0ZXJDbGlja0NoZWNrZXIuYmluZCh0aGlzKSlcbiAgICAgICAgLm9uKCdjbGljaycsIHRoaXMuY2xvc2VCdG5IYW5kbGVyLmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIHNob3dCbG9jayhibG9jaykge1xuICAgICAgbGV0ICRibG9jayA9IHRoaXMuc2V0dXBCbG9jayhibG9jayk7XG5cbiAgICAgIGlmICh0aGlzLl9pc09wZW5pbmcpIHtcbiAgICAgICAgdGhpcy5faXNPcGVuaW5nID0gdGhpcy5faXNPcGVuaW5nLmFkZCgkYmxvY2spO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5faXNPcGVuaW5nID0gJGJsb2NrO1xuICAgICAgfVxuXG4gICAgICAkYmxvY2suZmFkZUluKCgpID0+IHtcbiAgICAgICAgdGhpcy5faXNPcGVuaW5nID0gbnVsbDtcbiAgICAgIH0pO1xuICAgICAgLyp0aGlzLl9pc0FjdGl2ZSA9IHRydWU7XG4gICAgICAgdGhpcy5fYWN0aXZlQ291bnRlciArPSAkKGJsb2NrKS5sZW5ndGg7Ki9cbiAgICB9XG5cbiAgICBoaWRlQmxvY2soYmxvY2spIHtcbiAgICAgIGxldCAkYmxvY2sgPSAkKGJsb2NrKTtcblxuICAgICAgLyp0aGlzLl9hY3RpdmVDb3VudGVyID0gKHRoaXMuX2FjdGl2ZUNvdW50ZXIgLSAkYmxvY2subGVuZ3RoKSA+PSAwID9cbiAgICAgICB0aGlzLl9hY3RpdmVDb3VudGVyIC0gJGJsb2NrLmxlbmd0aCA6IDA7XG5cbiAgICAgICBpZighdGhpcy5fYWN0aXZlQ291bnRlcikgdGhpcy5faXNBY3RpdmUgPSBmYWxzZTsqL1xuXG4gICAgICAkYmxvY2suYWRkKCRibG9jay5maW5kKHRoaXMuY29udGVudFNlbGVjdG9yKSkuZmFkZU91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMuc3RyaXBCbG9jaygkYmxvY2spO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgc2V0dXBCbG9jayhibG9jaykge1xuICAgICAgLypyZXR1cm4gJChibG9jaylcbiAgICAgICAuYWRkQ2xhc3ModGhpcy5jb250ZW50U2VsZWN0b3Iuc2xpY2UoMSkpXG4gICAgICAgLnNob3coKVxuICAgICAgIC53cmFwKHRoaXMub3V0ZXIpXG4gICAgICAgLndyYXAodGhpcy5pbm5lcilcbiAgICAgICAucGFyZW50KHRoaXMub3V0ZXJTZWxlY3RvcilcbiAgICAgICAuYXBwZW5kKHRoaXMuY2xvc2VCdG4pXG4gICAgICAgLmhpZGUoKTsqL1xuXG4gICAgICBsZXQgJGJsb2NrID0gJChibG9jayk7XG5cbiAgICAgICRibG9jay5lYWNoKChpbmRleCwgaXRlbSkgPT4ge1xuICAgICAgICBsZXQgJGl0ZW0gPSAkKGl0ZW0pO1xuXG4gICAgICAgIGlmICgkaXRlbS5jbG9zZXN0KHRoaXMub3V0ZXJTZWxlY3RvcikubGVuZ3RoKSByZXR1cm47XG5cbiAgICAgICAgJChpdGVtKVxuICAgICAgICAgIC5hZGRDbGFzcyh0aGlzLmNvbnRlbnRTZWxlY3Rvci5zbGljZSgxKSlcbiAgICAgICAgICAud3JhcCh0aGlzLm91dGVyKVxuICAgICAgICAgIC53cmFwKHRoaXMuaW5uZXIpXG4gICAgICAgICAgLnNob3coKVxuICAgICAgICAgIC5jbG9zZXN0KHRoaXMub3V0ZXJTZWxlY3RvcilcbiAgICAgICAgICAuYXBwZW5kKHRoaXMuY2xvc2VCdG4pXG4gICAgICAgICAgLmhpZGUoKTtcbiAgICAgIH0pO1xuXG4gICAgICBsZXQgJGxpZ2h0Ym94ID0gJGJsb2NrLmNsb3Nlc3QodGhpcy5saWdodGJveFNlbGVjdG9yKTtcbiAgICAgIC8vY29uc29sZS5sb2coJGJsb2NrWzBdKTtcblxuICAgICAgLyokYmxvY2sgPSAkYmxvY2tcbiAgICAgICAgLmNsb3Nlc3QodGhpcy5vdXRlclNlbGVjdG9yKVxuICAgICAgICAuYXBwZW5kKHRoaXMuY2xvc2VCdG4pXG4gICAgICAgIC5oaWRlKCk7Ki9cblxuICAgICAgLy9jb25zb2xlLmxvZygkYmxvY2tbMF0pO1xuXG4gICAgICByZXR1cm4gJGxpZ2h0Ym94O1xuICAgIH1cblxuICAgIHN0cmlwQmxvY2soYmxvY2spIHtcbiAgICAgIHZhciAkb3V0ZXIgPSAkKGJsb2NrKS5jbG9zZXN0KHRoaXMub3V0ZXJTZWxlY3Rvcik7XG4gICAgICB2YXIgJGJsb2NrID0gJG91dGVyLmZpbmQodGhpcy5jb250ZW50U2VsZWN0b3IpO1xuXG4gICAgICAvL2NvbnNvbGUubG9nKCRvdXRlclswXSk7XG4gICAgICAkb3V0ZXIuZmluZCh0aGlzLmNsb3NlQnRuU2VsZWN0b3IpLnJlbW92ZSgpO1xuICAgICAgLy9jb25zb2xlLmxvZygkb3V0ZXJbMF0pO1xuICAgICAgJGJsb2NrXG4gICAgICAgIC51bndyYXAoKVxuICAgICAgICAudW53cmFwKClcbiAgICAgICAgLnJlbW92ZUNsYXNzKHRoaXMuY29udGVudFNlbGVjdG9yLnNsaWNlKDEpKTtcbiAgICB9XG5cbiAgICBldmVudEhhbmRsZXIoZSwgc2NlbmFyaW8pIHtcbiAgICAgIGlmIChzY2VuYXJpby5vcGVuaW5nTWV0aG9kICE9PSAnc2ltcGxlYm94JykgcmV0dXJuO1xuXG4gICAgICBsZXQgdGFyZ2V0ID0gc2NlbmFyaW8udGFyZ2V0O1xuXG4gICAgICB0aGlzLnNob3dCbG9jayh0YXJnZXQpO1xuICAgIH1cblxuICAgIG91dGVyQ2xpY2tDaGVja2VyKGUpIHtcbiAgICAgIGxldCBlbCA9IGUudGFyZ2V0O1xuICAgICAgbGV0IHRhcmdldCA9IGVsLmNsb3Nlc3QodGhpcy5saWdodGJveFNlbGVjdG9yKTtcblxuXG4gICAgICBpZiAodGFyZ2V0KSByZXR1cm47XG4gICAgICBpZiAoISQodGhpcy5saWdodGJveFNlbGVjdG9yKS5sZW5ndGgpIHJldHVybjtcblxuICAgICAgaWYgKHRoaXMuX2lzT3BlbmluZykge1xuICAgICAgICB0aGlzLmhpZGVCbG9jaygkKHRoaXMubGlnaHRib3hTZWxlY3Rvcikubm90KHRoaXMuX2lzT3BlbmluZykpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMuaGlkZUJsb2NrKHRoaXMubGlnaHRib3hTZWxlY3Rvcik7XG4gICAgfVxuXG4gICAgY2xvc2VCdG5IYW5kbGVyKGUpIHtcbiAgICAgIGxldCBlbCA9IGUudGFyZ2V0O1xuICAgICAgbGV0IGNsb3NlQnRuID0gZWwuY2xvc2VzdCh0aGlzLmNsb3NlQnRuU2VsZWN0b3IpO1xuXG4gICAgICBpZiAoIWNsb3NlQnRuKSByZXR1cm47XG5cbiAgICAgIHRoaXMuaGlkZUJsb2NrKGNsb3NlQnRuLmNsb3Nlc3QodGhpcy5saWdodGJveFNlbGVjdG9yKSk7XG4gICAgfVxuICB9XG5cbiAgLypibG9jayBvcGVuZXIgaW5pdCovXG4gIGxldCBzaW1wbGVMaWdodGJveCA9IG5ldyBTaW1wbGVCb3goKTtcblxuICBzaW1wbGVMaWdodGJveC5pbml0KCk7XG59KShqUXVlcnkpO1xuIl19
