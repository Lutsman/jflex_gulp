'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* jflex readyshop jquery */
/*from ES6*/

jQuery(document).ready(function ($) {
  /* newsletter title search label control */
  (function () {
    $('#newsblock label[for="edit-mail"]').on('click', function () {
      $(this).fadeOut(200);
      $(this).parent().find('input.form-text').focus();
    });

    $('#newsblock input.form-text').on('focus', function () {
      $('#newsblock label[for="edit-mail"]').fadeOut(200);
    });

    $('#newsblock input.form-text').on('blur', function () {
      if ($(this).val() == "") {
        $('#newsblock label[for="edit-mail"]').fadeIn(200);
      }
    });
  })();

  /* block title search label control */
  (function () {
    $('.globalsearch .block-title').on('click', function () {
      $(this).fadeOut(200);
      $(this).parent().find('input.form-text').focus();
    });

    $('.globalsearch input.form-text').on('focus', function () {
      $('.globalsearch .block-title').fadeOut(200);
    });

    $('.globalsearch input.form-text').on('blur', function () {
      if ($(this).val() == "") {
        $('.globalsearch .block-title').fadeIn(200);
      }
    });
  })();

  /* checkout cart sticky */
  (function () {
    if (!$('body').hasClass('ismobiledevice')) return;

    var $stickycart_container = $('.cart-info.sticky').closest('#checkout');

    if (!$stickycart_container.length) return;

    var checkout_bottom_spacing = $(document).height() - ($stickycart_container.height() + $stickycart_container.offset().top);
    var checkout_margin_top = parseInt($('.cart-info.sticky').css('margin-top'));
    $('.cart-info.sticky').sticky({
      topSpacing: checkout_margin_top,
      bottomSpacing: checkout_bottom_spacing
    });
    $('.cart-info.sticky').on('sticky-start', function () {
      $(this).css('margin-top', 0);
    });
    $('.cart-info.sticky').on('sticky-end', function () {
      $(this).css('margin-top', checkout_margin_top);
    });
    $('.cart-info.sticky').sticky('update');
  })();

  /*cart toggler*/
  (function () {
    var $cartBtn = $('.js__et-cart-toggler');
    var $overlay = $('#jbox-overlay');
    var options = {
      animation: 'none',
      onBeforeOpen: function onBeforeOpen(controller) {

        var $parent = controller._$togglerBtn.closest('.btn_cart__wrap');
        $overlay.fadeIn(200).one('click', { controller: controller }, onOverlay);
        $parent.addClass('active');
      },
      onAfterOpen: function onAfterOpen() {
        $(window).trigger('scroll');
      },
      onBeforeClose: function onBeforeClose(controller) {
        var $parent = controller._$togglerBtn.closest('.btn_cart__wrap');

        $overlay.fadeOut(200).off('click', onOverlay);
        $parent.removeClass('active');
      },
      getTarget: function getTarget($btn) {
        return $btn.closest('.btn_cart__wrap').find('.cart__wrap');
      }
    };

    $cartBtn.jElementToggler(options);
    cartTogglerOnOff();
    $(window).on('resize', cartTogglerOnOff);

    function onOverlay(e) {
      var controller = e.data.controller;

      controller.hideEl();
    }

    function cartTogglerOnOff() {
      var wWidth = document.documentElement.clientWidth;

      if (wWidth >= 960) {
        $cartBtn.trigger('jElementToggler:start');
      } else {
        $cartBtn.trigger('jElementToggler:stop');
      }
    }
  })();

  /*show catr toggler*/
  (function () {
    var $cartBtn = $('.btn_cart');
    var $btnBox = $('.buttons__box');
    var isHiddenCartBtn = true;

    if (!$btnBox.children().length) return;

    toggleCartBtnVisibility();
    $(window).on('scroll', toggleCartBtnVisibility);

    function showCartBtn() {
      $btnBox.addClass('visible');
      isHiddenCartBtn = false;
    }

    function hideCartBtn() {
      $btnBox.removeClass('visible');
      isHiddenCartBtn = true;
    }

    function toggleCartBtnVisibility() {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      var wWidth = document.documentElement.clientWidth;

      if (wWidth < 960) {
        if (!isHiddenCartBtn) {
          hideCartBtn();
        }

        return;
      }

      if (scrollTop > 100 && isHiddenCartBtn) {
        showCartBtn();
      } else if (scrollTop <= 100 && !isHiddenCartBtn) {
        if ($cartBtn.hasClass('et-active')) return;
        hideCartBtn();
      }
    }
  })();

  /*capture toggler*/
  (function () {
    var $btn = $('.js__et-capture');

    if (!$btn.length) return;

    var $target = $('.capture__wrap');
    var lastUrl = document.referrer;
    var currHost = window.location.host;
    var isClosed = $.cookie('capture-closed');
    var isOuterCome = !~lastUrl.indexOf(currHost);
    var options = {
      animation: 'fade',
      onAfterClose: function onAfterClose() {
        $.cookie('capture-closed', true, { path: '/' });
      }
    };

    if (!isOuterCome && isClosed === 'true') return; //isOuterCome &&  непонятно зачем было это условие, уточнить

    $.removeCookie('capture-closed', { path: '/' });
    $(window).on('scroll', init);

    function init() {
      var ww = document.documentElement.clientWidth;

      if (ww < 960) return;

      setTimeout(function () {
        $target.fadeIn(function () {
          $btn.addClass('et-active'); //КОСТЫЛЬ надо добавить этот класс в шаблоне
          $btn.jElementToggler(options);
        });
      }, 4000);

      $(window).off('scroll', init);
    }
  })();

  /*search toggler*/
  (function () {
    var $searchToggler = $('.js__search-et-toggler');
    var options = {
      animationDuration: 200
    };
    var responsiveSwitcher = createResponsiveSwitch($searchToggler);

    $searchToggler.jElementToggler(options);
    responsiveSwitcher();
    $(window).on('resize', responsiveSwitcher);

    function createResponsiveSwitch($toggler) {
      return function () {
        var wWidth = document.documentElement.clientWidth;

        if (wWidth < 960) {
          $toggler.trigger('jElementToggler:start');
          $searchToggler.trigger('jElementToggler:close');
        } else {
          $toggler.trigger('jElementToggler:open');
          $toggler.trigger('jElementToggler:stop');
        }
      };
    }
  })();

  /*online support chat toggler*/
  /* (function () {
     const $togglerBtn = $('.js__et-support-chat');
     const $header = $('.js__et-support-chat-open');
     const $parent = $('.j_crm-chat');
     const options = {
       onBeforeOpen: () => $parent.addClass('opened'),
       onAfterOpen: () => $header.addClass('opened'),
       onAfterClose: () => $header.add($parent).removeClass('opened'),
       animation: 'slide'
     };
  
     $togglerBtn.jElementToggler(options);
  
     $header.on('click', e => {
       const $target = $(e.target);
  
       if ($target.closest($togglerBtn).length) return;
  
       $togglerBtn.trigger('jElementToggler:open');
     });
   })();*/

  /*block-flex-theme show toggler*/
  (function () {
    var $btn = $('.flex_theme_block_show');
    var options = {
      animation: 'fade'
    };

    $btn.jElementToggler(options);
  })();

  /*lazy loader fixes*/
  (function () {
    /*sticky tables scroll triggering*/
    (function () {
      var $stickyTable = $(document.querySelectorAll('.sticky-table'));

      $stickyTable.on('scroll', function () {
        $(window).trigger('scroll');
      });
    })();
  })();

  /*main menu change behaviour*/
  (function () {
    var $menu = $('#main-menu');
    var $list = $menu.find('li.group');
    var $anchor = $list.children('a');
    var options = {
      animation: 'slide',
      animationDuration: 100,
      outerClick: true,
      className: {
        active: 'active-menu'
      },
      getTarget: function getTarget($btn) {
        return $btn.children('.menu');
      }
    };

    $list.jElementToggler(options);
    $anchor.on('click', function (e) {
      e.preventDefault();
    }); //detach default behaviour link
    $list.off('hover'); //detach open on hover
  })();

  /*fast order DISABLED*/
  (function () {
    return;
    var fastorderBtn = document.querySelector('.btn__fastorder');

    if (!fastorderBtn) return;

    var qtyInput = document.getElementById('edit-qty');
    var form = document.querySelector('.form__fast-order');

    if (!form) return;

    var targetQtyInput = form.querySelector('input[name="submitted[qty]"]');

    fastorderBtn.addEventListener('click', function (e) {
      e.preventDefault();

      targetQtyInput.value = qtyInput.value;
      renderFormHead(form);

      //$.jBox.clean();
      //$.jBox.jboxhtml(form);
    });

    function renderFormHead(form) {
      var targetQtyInput = form.querySelector('input[name="submitted[qty]"]');
      var targetPriceEl = document.querySelector('.info-block .prices .current');
      var title = document.getElementById('page-title'); // form.querySelector('input[name="submitted[title]"]') || ;
      var content = form.querySelector('.content');
      var existedHead = form.querySelector('.form-head');

      var qty = parseInt(targetQtyInput.value);
      var price = parseFloat(targetPriceEl.textContent.replace(/\s/g, ""));
      var totalPrice = parsePrice(price * qty);

      var newHead = '<div class="form-head">' + '<div>' + '<span class="qty">' + qty + '</span>' + ' x ' + '<span class="title">' + title.textContent + '</span>' + '</div>' + '<div class="total-amount">' + 'Сумма: ' + '<span class="amount icon ic-rub">' + totalPrice + '</span>' + '</div>' + '</div>';

      if (existedHead) {
        $(existedHead).replaceWith(newHead);
      } else {
        $(content).prepend(newHead);
      }
    }

    function parsePrice(price) {
      var precisePrice = Math.round(price * 100) / 100;
      var priceStr = precisePrice + '';
      var beforeDot = Math.floor(precisePrice);
      var beforeDotStr = beforeDot + '';
      var afterDotStr = priceStr.indexOf('.') ? priceStr.slice(priceStr.indexOf('.')) : '';
      var resultArr = beforeDotStr.split('');
      var resultStr = '';

      for (var i = beforeDotStr.length - 1, j = 1; i >= 0; i--, j++) {
        var isThird = !(j % 3) && j;

        if (!isThird) continue;

        resultArr.splice(i, 0, ' ');
      }

      resultStr = resultArr.join('');

      if (price > beforeDot) {
        resultStr += afterDotStr;
      }

      return resultStr;
    }
  })();

  /*display mode patch*/
  (function () {
    var $dMode = $('body.displaymode');
    var isAttachedHandler = false;

    if (!$dMode.length) return;

    setDisplayMode();
    $(document).on('infiniteScrollComplete', setDisplayMode);

    /* SET MODE. Set view mode switcher. */
    function setDisplayMode() {
      var $dMode = $('body.displaymode');
      // Set mode after loaded page
      var hash = document.location.hash;

      if (hash) {
        hash = hash.replace('#', '');
        if (!$dMode.hasClass(hash)) {
          switch (hash) {
            case 'grid':
              setMode('grid');
              break;
            case 'linear':
              setMode('linear');
              break;
          }
        } else {
          hash == 'linear' ? setMode('linear', true) : '';
        }
      } else {
        $dMode.hasClass('linear') ? setMode('linear', true) : '';
      }

      // Event click on link MODE
      if (!isAttachedHandler) {
        $dMode.on('click', '#display-switch a', function () {
          setMode(jQuery(this).attr('href').replace('#', ''));
        });
        isAttachedHandler = true;
      }

      function setMode(mode, onlyLink) {
        $('#display-switch a.' + mode).addClass('active').siblings().removeClass('active');
        if (!onlyLink) {
          $dMode.removeClass('grid linear').addClass(mode);
          $.cookie('displaymode', mode, { expires: 30 });
        }
      }
    }
  })();

  /*range bar*/
  (function () {
    /*left bar*/
    (function () {
      var $parent = $(document.getElementById('edit-mfb-filter-price-sell-price-wrapper'));

      if (!$parent.length) return;

      var $min = $(document.getElementById('edit-mfb-filter-price-sell-price-min')).val(0);
      var $max = $(document.getElementById('edit-mfb-filter-price-sell-price-max')).val(200000);
      var $submit = $('.views-exposed-widget.views-submit-button', document.getElementById('views-exposed-form-taxonomy-term-page-category-mfb-filter-price'));
      var options = {
        min: $min,
        max: $max,
        ranges: [{
          pixelRange: '50%',
          unitRange: '10%'
        }, {
          pixelRange: '80%',
          unitRange: '30%'
        }]
      };

      $parent.jRangeBar(options);

      submitBtnLogic();

      function submitBtnLogic() {
        $submit.hide();

        $min.on('input jRangeBar:change', btFn);
        $max.on('input jRangeBar:change', btFn);
      }

      function btFn() {
        if ($max.val() > 0 || $min.val() > 0) {
          //modifySubmitUrl();
          $submit.removeClass('hidden').show();
        } else {
          $submit.hide();
        }
      }

      /*function modifySubmitUrl() {
       let url = renderUrl($min.val(), $max.val());
         $submit.attr('href', url);
       }*/

      /*function renderUrl(min, max) {
       return 'http://hamleys.ru/shop/catalog/konstruktory/konstruktory-lego?mefibs-form-filter-price-sell_price%5Bmin%5D=' +
       min +
       '&mefibs-form-filter-price-sell_price%5Bmax%5D=' +
       max +
       '&mefibs-form-filter-price-mefibs_block_id=filter_price';
       }*/
    })();

    /*refresh jRangeBar in jbox*/
    (function () {
      /*in jbox*/
      var holder = document.getElementById('jbox-holder');

      if (!holder) return;

      var $holder = $(holder);

      $holder.on('jBox:afterOpen', refreshRangeBar);

      function refreshRangeBar() {
        var $rangeBar = $(this).find('.jrangebar-wrapper');

        $rangeBar.trigger('jRangeBar:refresh');
      }
    })();

    /*hide jbox after rangebar submit*/
    (function () {
      var $submit = $('.views-exposed-widget.views-submit-button .form-submit', document.getElementById('views-exposed-form-taxonomy-term-page-category-mfb-filter-price'));

      if (!$submit.length) return;

      $submit.on('click', function (e) {
        var jboxHolder = this.closest('#jbox-holder');

        if (!jboxHolder) return;

        $.jBox.hideBlock();
      });
    })();
  })();

  /*hide jbox on click*/
  (function () {
    var $closeBtn = $('.js__jbox-close');

    $closeBtn.on('click', function (e) {
      e.preventDefault();

      $.jBox.close();
    });
  })();

  /*cookies confirm button*/
  (function () {
    var confirmName = 'cookiesConfirmed';
    var isConfirmed = $.cookie(confirmName);

    /*debugger*/
    window.deleteCookieConfirm = function () {
      var options = {
        expires: 365,
        path: '/'
      };

      $.removeCookie(confirmName, options);
    };

    if (isConfirmed) return;

    var $cookiesBlock = $(document.getElementById('cookie')); //renderCookiesConfirm();
    var $confirmBtn = $cookiesBlock.find('.btn_confirm');
    var $parentBlock = $('.fulldata');

    $parentBlock.prepend($cookiesBlock).css({
      marginTop: $cookiesBlock.outerHeight() + 'px'
    });

    $confirmBtn.on('click', confirmHandler);

    function renderCookiesConfirm() {
      var tpl = '<div id="cookie" class="cookie">' + '<div class="hold pad-h">' + '<div class="row sp-10">' + '<div class="col d7">' + '<div class="text">Для наилучшей работы сайта используются cookies. ' + '<a href="#">Подробнее о cookies.</a>' + '</div>' + '</div>' + '<div class="col d5">' + '<a href="#" class="btn_confirm btn small simple icon icon-uniE65A">Подтвердить использование cookies</a>' + '</div>' + '</div>' + '</div>' + '</div>';

      return $(tpl);
    }

    function confirmHandler(e) {
      e.preventDefault();

      var val = true;
      var options = {
        expires: 365,
        path: '/'
      };

      $parentBlock.animate({
        marginTop: 0
      }, 400);

      $cookiesBlock.slideUp(400, function () {
        $cookiesBlock.remove();
      });
      $.cookie(confirmName, val, options);
    }
  })();

  /*goods count mooving*/
  (function () {
    var totalRows = document.querySelector('.total-rows');

    if (!totalRows) return;

    var goodsCount = document.querySelector('.page-title .goods-count');

    if (!goodsCount) return;

    goodsCount.textContent = '(' + totalRows.textContent + ')';
  })();

  /*product reviews*/
  (function () {
    var $reviewsBtn = $('.product .reviews a');

    $reviewsBtn.on('click', function (e) {
      //e.preventDefault();

      var id = this.getAttribute('href').replace(/#/g, '');
      var $commentTab = $(document.getElementById(id));

      $commentTab.trigger('jElementToggler:open');
    });
  })();

  /*smooth scroll*/
  (function () {
    /*ScrollToAnchor class*/
    function ScrollToAnchor(options) {
      this._listenedBlock = options.listenedBlock || document.body;
      this._translationElementSelector = options.translation || false;
      this._animationSpeed = options.animationSpeed || 500;
    }

    ScrollToAnchor.prototype.init = function () {
      $(this._listenedBlock).on('click', this.anchorClickListener.bind(this));
    };
    ScrollToAnchor.prototype.anchorClickListener = function (e) {
      var elem = e.target;
      var anchor = elem.closest('a[href*="#"]:not([data-scroll="disable"]):not(.js__scroll-disable):not(.jbox)');

      if (!anchor) return;

      var anchorWithHash = anchor.closest('a[href^="#"]');
      var windowPath = window.location.origin + window.location.pathname;
      var anchorPath = anchor.href.slice(0, anchor.href.indexOf('#'));

      if (windowPath === anchorPath) {
        anchorWithHash = anchor;
      }

      if (!anchorWithHash || anchorWithHash.hash.length < 2) return;

      e.preventDefault();

      var target = anchorWithHash.hash;
      var translation = this.getTranslation(anchorWithHash);

      if (!document.querySelector(target)) return;

      this.smoothScroll(target, translation);
    };
    ScrollToAnchor.prototype.getTranslation = function (anchor) {
      var translation = 0;

      if (anchor.hasAttribute('data-translation')) {
        translation = anchor.getAttribute('data-translation');
      } else if (this._translationElementSelector) {
        $(this._translationElementSelector).each(function () {
          translation += this.offsetHeight;
        });
        //translation = document.querySelector(this._translationElementSelector).offsetHeight;
      }

      return translation;
    };
    ScrollToAnchor.prototype.smoothScroll = function (selector, translation) {
      $("html, body").animate({
        scrollTop: $(selector).offset().top - (translation || 0)
      }, this._animationSpeed);
    };

    var pageScroll = new ScrollToAnchor({
      translation: '#main-menu'
    });
    pageScroll.init();
  })();

  /*submit source*/
  (function () {
    document.body.addEventListener('mousedown', setSourceFromAnchorHandler);
    document.body.addEventListener('touchstart', setSourceFromAnchorHandler);
    document.body.addEventListener('mousedown', setSourceFromFormHandler);
    document.body.addEventListener('touchstart', setSourceFromFormHandler);

    function setSourceFromAnchorHandler(e) {
      var target = e.target;
      var sourceBtn = target.closest('[data-submit-target]');

      if (!sourceBtn) return;

      var sourceData = sourceBtn.getAttribute('data-submit-source') || sourceBtn.textContent;
      var selector = sourceBtn.getAttribute('href') + ' ' + sourceBtn.getAttribute('data-submit-target');
      var sourceInput = document.querySelector(selector);

      if (!sourceInput) return;

      sourceInput.setAttribute('value', sourceData);
    }

    function setSourceFromFormHandler(e) {
      var target = e.target;
      var submitBtn = target.closest('input[type="submit"]');

      if (!submitBtn) return;

      var sourceDataEl = submitBtn.closest('[data-webform-source]');

      if (!sourceDataEl) return;

      var sourceData = sourceDataEl.getAttribute('data-webform-source');
      var sourceInput = submitBtn.closest('form').querySelector(sourceDataEl.getAttribute('data-webform-target'));

      if (!sourceInput || sourceInput.getAttribute('value')) return;

      sourceInput.setAttribute('value', sourceData);
    }
  })();

  /*show subscribe*/
  (function () {
    var $popUpSimpleNews = $(document.querySelector('.newsblock'));

    if (!$popUpSimpleNews.length) return;
    if (document.documentElement.clientWidth < 960) return;

    var $subscribe = $popUpSimpleNews.find('.simplenews-subscribe');
    var $subscribeDisable = $popUpSimpleNews.find('.subscribed');
    var showPopUpFunc = showPopUpDec();

    var userOpt = {
      status: 'anonim',
      date: new Date(),
      lastShown: new Date(),
      showEach: 3,
      isSubscribed: false,
      isUnsubscribed: false
    };
    var cookieOpt = {
      path: '/',
      expires: 365
    };
    var userName = 'userGlobalData';
    var userData = getCookie();
    var nowDate = new Date();
    var dateIndex = 24 * 60 * 60 * 1000; //24 * 60 * 60 * 1000;
    var mobileClass = 'ismobiledevice';

    var submitOkMess = {
      'title': 'Спасибо!',
      'mess': 'Мы отправили промо код на Ваш email.'
    };
    var submitFailMess = {
      'title': 'Ошибка!',
      'mess': 'На сервере произошла ошибка, попробуйте еще раз.'
    };

    /*debuggers*/
    window.cleanCookie = cleanCookie;
    window.getCookie = getCookie;

    init();

    function init() {
      if (isLogged()) {
        userOpt.status = 'user';
      }

      if (!userData) {
        setCookie();
        startShowing();
        return;
      }

      userOpt = userData;
      //console.log(userOpt);

      if (isLogged()) {
        userOpt.status = 'user';
      }

      if (userOpt.isSubscribed || userOpt.isUnsubscribed) {
        //setCookie();
        return;
      }

      var lastShown = Date.parse(userOpt.lastShown);

      if (nowDate - lastShown > userOpt.showEach * dateIndex) {
        setCookie();
        startShowing();
        return;
      }
    }

    function isLogged() {
      return !!$('body.logged-in').length;
    }

    function setCookie() {
      var cachedJsonOption = $.cookie.json;
      $.cookie.json = true;
      var cookie = $.cookie(userName, userOpt, cookieOpt);
      $.cookie.json = cachedJsonOption;

      return cookie;
    }

    function getCookie() {
      var cachedJsonOption = $.cookie.json;
      $.cookie.json = true;
      var cookie = $.cookie(userName);
      $.cookie.json = cachedJsonOption;

      return cookie;
    }

    function startShowing() {
      //if (!$popUpSimpleNews.length) return;

      if ($subscribe.length) {
        formControlInit();
        $subscribeDisable.on('click', function (e) {
          e.preventDefault();

          onUnsubscribe();
          hideJbox();
        });

        if ($('body').hasClass(mobileClass)) {
          setTimeout(function () {
            showPopUpFunc($popUpSimpleNews);
            userOpt.lastShown = new Date();
            setCookie();
          }, 30000);
        } else {
          $(document).on('mouseleave', onMouseLeaveBody);
        }
      }
    }

    function stopShowing() {
      $(document).off('mouseleave', onMouseLeaveBody);
    }

    function onMouseLeaveBody(e) {
      if (e.clientY < 0) {
        //показываем попап
        showPopUpFunc($popUpSimpleNews);
        stopShowing();

        //userOpt.isShown = true;
        userOpt.lastShown = new Date();
        setCookie();
      }
    }

    function showPopUpDec() {
      var isShown = false;

      return function (el) {
        if (isShown) return;

        showJbox(el);
        isShown = true;
      };
    }

    function showJbox(el) {
      $.jBox.clean();
      $('#jbox-holder').addClass('subscribe-bg');
      $.jBox.jboxhtml(el);
    }

    function hideJbox() {
      $.jBox.hideBlock();
    }

    function cleanCookie() {
      console.dir($.removeCookie(userName, cookieOpt));
    }

    function formControlInit() {
      var $formOk = $(renderMess(submitOkMess)).appendTo($('body'));
      var $formFail = $(renderMess(submitFailMess)).appendTo($('body'));

      var $email = $subscribe.find('input[name="mail"]');
      var $submit = $subscribe.find('input[type="submit"]');
      var $wrapper = $submit.parent();
      var $pending = $('<div class="pending-block center mb20 mt20 hide">Отправляем данные ...</div>');
      var $error = $('<div class="err-block center mb20 mt20 hide">Почта уже подписана</div>');

      $wrapper.append($pending).append($error);

      $popUpSimpleNews.formController({
        resolve: function resolve(form) {
          var $submit = $formOk.find('input[type="submit"]');
          var email = $(form).find('input[name="mail"]').val();
          //console.log(email);

          showJbox($formOk);
          onSubscribe();

          if (dataLayer && $.isArray(dataLayer)) {
            //console.log('data layer');
            //console.dir(dataLayer);
            //console.log('email = ' + email);
            dataLayer.push({ 'event': 'popupSubscription', 'popupSubscrEmail': email });
          }

          $submit.one('click', function (e) {
            e.preventDefault();

            hideJbox();
          });

          $('body').one('jBox:afterClose', function () {
            window.location.reload(true);
          });
        },
        reject: function reject() {
          var $submit = $formFail.find('input[type="submit"]');

          showJbox($formFail);

          $submit.one('click', function (e) {
            e.preventDefault();

            showJbox($popUpSimpleNews);
          });
        },
        afterValidate: function afterValidate(form) {
          var $error = $(form).find('.err-block');
          var $pending = $(form).find('.pending-block');
          var controller = this;

          if ($error.is(':visible')) {
            $error.fadeOut(200, function () {
              $pending.fadeIn(200);
            });
          } else {
            $pending.fadeIn(200);
          }

          //console.log($email.val());

          $.ajax({
            type: 'GET',
            url: '/simplenews/verify-subscribe/262/' + $email.val(),
            success: function success(response) {
              //console.dir(arguments);

              if (parseInt(response.subscribed) === 0) {
                controller.sendRequest.apply(controller, [form, controller._resolve, controller._reject, controller._beforeSend]);
              } else {
                $pending.fadeOut(200, function () {
                  $error.fadeIn(200);
                });
              }
            },
            error: function error(response) {
              //console.dir(arguments);
              //console.log(response);
              //throw new Error(response.statusText);
            }
          });
        }
      });
    }

    function onSubscribe() {
      userOpt.isSubscribed = true;
      setCookie();
    }

    function onUnsubscribe() {
      userOpt.isUnsubscribed = true;
      setCookie();
    }

    function renderMess(data) {
      var respondFormSource = '<div class="subscribe-form__box center hide">' + '<h2 class="mb20">' + data.title + '</h2>' + '<div class="mb30">' + data.mess + '</div>' + '<form>' + '<input class="form-submit" type="submit" value="Ok"/>' + '</form>' + '</div>';

      return respondFormSource;
    }
  })();

  /*mmenu tabs*/
  (function () {
    var mMenu = document.getElementById('mm-menu');
    var mMenuPanel = document.getElementById('m-panel');
    var $mMenuPanel = $(mMenuPanel);

    if (!mMenu || !mMenuPanel) return;

    var $tabName = $(mMenu.querySelectorAll('.tab-name'));

    $tabName.each(function () {
      var togglerController = this.jElementToggler;

      if (!togglerController) return;

      togglerController._onBeforeOpen = onBeforeOpen;
    });

    var $activeTab = $tabName.filter('.active');
    var activeToggler = $activeTab[0].jElementToggler;

    activeToggler._disallowedActions = [];
    activeToggler._onAfterOpen = function () {
      $activeTab.addClass('close');
    };
    activeToggler._onBeforeClose = onBeforeClose;
    activeToggler._onAfterClose = function () {
      $activeTab.removeClass('close');
    };
    $activeTab.trigger('jElementToggler:close');

    // Enable swiping...
    $mMenuPanel.swipe({
      //Generic swipe handler for all directions
      swipe: function swipe(event, direction, distance, duration, fingerCount, fingerData) {
        switch (direction) {
          case 'left':
            $activeTab.trigger('jElementToggler:close');
            break;
          case 'right':
            break;
        }
      },
      allowPageScroll: "vertical"
    });

    function onBeforeOpen() {
      document.body.classList.add('m-view');
      $mMenuPanel.animate({ left: '0' }, 300);
    }

    function onBeforeClose() {
      document.body.classList.remove('m-view');
      $mMenuPanel.animate({ left: '-100%' }, 150);
    }
  })();

  /*hide footer mess*/
  (function () {
    var $toggler = $('.js__et-af-s');
    var options = {
      animation: 'fade',
      onBeforeClose: setCookie
    };

    if (checkCookie() || document.documentElement.clientWidth < 960) return;

    $toggler.jElementToggler(options);

    function checkCookie() {
      return !!$.cookie('hide-footer-capture');
    }

    function setCookie() {
      $.cookie('hide-footer-capture', true, { expires: 365, path: '/' });
    }
  })();

  /*cart*/
  (function () {
    var $cartBtn = $('.mm-menu .icon-shopping-cart.jbox');
    var isFullPage = false;
    var $window = $(window);

    setFullPageJbox();
    $window.on('resize', setFullPageJbox);

    function setFullPageJbox() {
      var ww = document.documentElement.clientWidth;

      if (ww > 740 && isFullPage) {
        $cartBtn.removeClass('jbox-anchor-fullscreen');
        isFullPage = false;
      } else if (ww <= 740 && !isFullPage) {
        $cartBtn.addClass('jbox-anchor-fullscreen');
        isFullPage = true;
      }
    }
  })();

  /*Yandex map*/
  (function () {
    var $mapWrappers = $('.map-wrap');

    if (!$mapWrappers.length) return;

    var firstScript = document.querySelectorAll('script')[0];
    var script = document.createElement('script');
    script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU';
    script.async = true;
    firstScript.parentNode.insertBefore(script, firstScript);

    script.addEventListener('load', function () {
      ymaps.ready(function () {
        $('body').trigger('yamap:ready').addClass('yamap-ready');
      });
    });

    $mapWrappers.each(function (i) {
      var $mapWrapper = $(this);
      var $map = $('<div></div>');
      var mapOverlayInit = mapOverlayInitClosure(this);

      $map.attr('id', 'map-' + i).css({
        width: '100%',
        height: '400px'
      }).appendTo($mapWrapper);
      mapOverlayInit();

      var mapData = {
        id: $map.attr('id'),
        center: JSON.parse($mapWrapper.attr('data-center')),
        zoom: +$mapWrapper.attr('data-zoom') || 15,
        placemarkData: {
          coords: JSON.parse($mapWrapper.attr('data-placemark')),
          hintContent: $mapWrapper.attr('data-hint') || '',
          balloonContent: $mapWrapper.attr('data-balloon') || ""
        }
      };

      if ($('body').hasClass('yamap-ready')) {
        init(mapData);
      } else {
        $('body').on('yamap:ready', init.bind(null, mapData));
      }

      //counter++;
    });

    function mapOverlayInitClosure(mapWrapper) {
      var $mapWrapper = $(mapWrapper);
      var isActiveMap = false;

      return function () {
        $mapWrapper.on('mouseleave', function () {
          $mapWrapper.removeClass('active');
          isActiveMap = false;
        });
        $('body').on('click', function (e) {
          var target = e.target;

          if ($(target).closest($mapWrapper).length) {
            if (isActiveMap) return;

            $mapWrapper.addClass('active');
            isActiveMap = true;
          } else {
            if (!isActiveMap) return;

            $mapWrapper.removeClass('active');
            isActiveMap = false;
          }
        });
      };
    }

    function init(mapData) {
      var myMap = new ymaps.Map(mapData.id, {
        center: mapData.center,
        zoom: mapData.zoom
      }, {
        searchControlProvider: 'yandex#search'
      });

      //myMap.behaviors.disable('scrollZoom');

      var placemark = new ymaps.Placemark(mapData.placemarkData.coords, {
        hintContent: mapData.placemarkData.hintContent,
        balloonContent: mapData.placemarkData.balloonContent
      }, {
        preset: "islands#dotCircleIcon"
        /*iconLayout: 'default#image',
        iconImageHref: 'images/map-point.png',
        iconImageSize: [29, 39],
        iconImageOffset: [-14, -39]*/
      });

      myMap.geoObjects.add(placemark);
    }
  })();

  /*search autocomplete*/
  (function () {
    var $input = $('[name="mfb-shopsearch-populate"]');

    if (!$input.length) return;

    var _addOverlay = waiter(addOverlay, 1000);
    var $overlay = $('<div class="ajax-progress-overlay"></div>');

    $input.on({
      'input': _addOverlay,
      'autocompleteresponse': removeOverlay
    });

    function addOverlay() {
      //let input = this;
      var $input = $(this);
      var $parent = $input.closest('.container-inline');

      if (!$input.val()) return;

      //input.readOnly = true;
      $parent.append($overlay);

      setTimeout(function () {
        removeOverlay();
        //input.readOnly = false;
      }, 2000);
    }

    function removeOverlay() {
      $overlay = $overlay.remove();
    }

    function waiter(func, ms, bindedThis) {
      var timer = void 0;

      return function () {
        var args = arguments;

        if (bindedThis === undefined) {
          bindedThis = this;
        }

        clearTimeout(timer);
        timer = setTimeout(function () {
          func.apply(bindedThis, args);
        }, ms);
      };
    }
  })();

  /*preloader*/
  (function () {
    var $preloader = $(document.getElementById('preloader'));

    $preloader.fadeOut();
  })();

  /*tour master*/
  (function () {
    var $startBtn = $('.tour-master-start');
    var $adminMenu = $('.menu_adminflex__wrap');
    var $fullPage = $('.fullpage');
    var cachedFullPagePaddingLeft = void 0;
    var steps = [{
      element: '.js__jtour-step1',
      title: 'step 1',
      tag: 'Функциональные опции интернет-магазина', //в турмастере в popup4 шаги по одной теме группируются вместе, с одним заголовком
      content: 'some bla-bla-bla',
      path: '/review/flex_admin_tour/test2.html'
    }, {
      element: '.js__jtour-step2',
      title: 'step 2',
      tag: 'Функциональные опции интернет-магазина',
      content: 'some bla-bla-bla',
      path: '/review/flex_admin_tour/test2.html'
    }, {
      element: '.js__jtour-step3',
      title: 'step 3',
      tag: 'Функциональные опции интернет-магазина',
      content: 'some bla-bla-bla',
      path: '/review/flex_admin_tour/test2.html'
    }, {
      element: '.js__jtour-step4',
      title: 'step 4',
      tag: 'Процессы для юридических лиц',
      content: 'some bla-bla-bla',
      animateType: 'highlight',
      path: '/review/flex_admin_tour/test2.html'
    }, {
      element: '.js__jtour-step5',
      title: 'step 5',
      tag: 'Процессы для юридических лиц',
      content: 'some bla-bla-bla',
      path: '/review/flex_admin_tour/test.html'
    }];
    var options = {
      tours: [],
      steps: steps,
      defaultTourOptions: {
        isMenu: true,
        addMenuMethod: function addMenuMethod($menu, container, controller) {
          $menu.find('.title').text(controller.title);
          cachedFullPagePaddingLeft = $fullPage.css('padding-left');

          $menu.css({ left: '-100%', zIndex: '9750' }).appendTo($(document.body)).animate({ left: '0' }, {
            duration: 400,
            queue: false
          });
          $adminMenu.animate({ left: '-100%' }, { duration: 400, queue: false });
          $(document.body).addClass('tour-menu-active');
        },
        removeMenuMethod: function removeMenuMethod($menu) {
          $menu.animate({ left: '-100%' }, {
            duration: 400,
            queue: false,
            complete: function complete() {
              $menu.remove();
            }
          });
          $adminMenu.animate({ left: '0' }, { duration: 400, queue: false });
          $(document.body).removeClass('tour-menu-active');
        }
      }
    };
    var tourMaster = null;

    getTours().then(function (tours) {
      options.tours = tours;
      tourMaster = $.jTourMaster(options);

      $startBtn.on('click', function (e) {
        e.preventDefault();

        tourMaster.start();
      });

      startMasterOnAdmin($.extend({}, options));
    }).catch(function (error) {
      console.dir(error);
    });

    function startMasterOnAdmin(options) {
      var isAdminPage = $adminMenu.length;
      var isNew = !$.cookie('admin-tour-first');
      var extraOptions = $.extend(true, {}, options, {
        jboxOptions: {
          customHolderClass: 'jbox__bg-full-white',
          customOverlayClass: 'jbox__bg-full-white',
          disableCloseBtnHandler: true,
          disableOverlayHandler: true
        }
      });

      if (!isAdminPage || !isNew) return;

      extraOptions.customHolderClass = 'jbox__bg-full-white';
      extraOptions.customOverlayClass = 'jbox__bg-full-white';

      var tourMaster = $.jTourMaster(extraOptions);
      tourMaster.start();
      $.cookie('admin-tour-first', 'true', { path: '/', expires: 365 });
    }

    function getTours() {
      return new Promise(function (resolve, reject) {
        $.getJSON('/admin/flex-master', function (response, status, xhr) {
          if (xhr.status === 200) {
            resolve(parseTours(response));
          } else {
            reject(response);
          }
        }).fail(function (response) {
          reject(response);
        });
      });
    }

    function parseTours(tours) {
      var newTours = [];

      tours.forEach(function (tour) {
        var newTour = {
          steps: []
        };
        var steps = tour.steps;

        for (var key in tour) {
          if (key === 'steps') {
            continue;
          }

          newTour[key] = tour[key];
        }

        steps.forEach(function (step) {
          newTour.steps.push(parseStep(step));
        });

        newTours.push(newTour);
      });

      return newTours;
    }

    function parseStep(step) {
      var stepMapper = {
        animatetype: 'animateType',
        ismenustep: 'isMenuStep',
        menutitle: 'menuTitle',
        onelement: 'onElement'
      };
      var handlerMapper = {
        'saveNGo': saveNGo
      };
      var newStep = {};

      for (var key in step) {
        if (stepMapper[key]) {
          if (key === 'onelement') {
            newStep[stepMapper[key]] = {
              event: step[key].event,
              handler: handlerMapper[step[key].handler]
            };
          } else {
            newStep[stepMapper[key]] = step[key];
          }
        } else if (key === 'path') {
          if (step.path && step.path !== '/') {
            newStep.path = '/' + step.path;
          } else if (step.path === '/') {
            newStep.path = step.path;
          } else {
            newStep.path = '';
          }
        } else {
          newStep[key] = step[key];
        }
      }

      return newStep;
    }

    function saveNGo(e) {
      var $target = $(e.target);
      var tour = e.data.tourController;

      e.preventDefault();

      setTimeout(function () {
        $target.trigger(tour.activeStep.onElement.event);
      }, 50);
      tour.bindNextStep();
    }

    /*debugger*/
    window.deleteCookieTour = function () {
      $.removeCookie('admin-tour-first', { path: '/', expires: 365 });
    };
  })();

  /*admin menu extention*/
  (function () {
    var menu = document.querySelector('.menu_adminflex.operations .menu');

    if (!menu) return;

    var AdminMenu = function () {
      function AdminMenu(options) {
        _classCallCheck(this, AdminMenu);

        this.menu = options.menu;
        this.spinnerActivateArea = options.spinnerActivateArea;
        this.classHovered = options.classHovered || 'hover';
        this.classUnhovered = options.classUnhovered || 'unhover';
        this.preloaderSelector = options.preloaderSelector;
        this.liFullscreenSelector = options.liFullscreenSelector;
        this.liExpandedSelector = options.liExpandedSelector;
        this.closeBtnSelector = options.closeBtnSelector || '.menu_adminflex__close';
        this.closeBtnTpl = options.closeBtnTpl || '<li class="menu_adminflex__close"></li>';
        this.hoverDelay = options.hoverDelay || 300;
      }

      _createClass(AdminMenu, [{
        key: 'init',
        value: function init() {
          var $menu = this.$menu = $(this.menu);

          if (!$menu.length) return;

          this.$spinnerActivateArea = $(this.spinnerActivateArea);
          this.$liFullscreen = $menu.children(this.liFullscreenSelector);
          this.$liExpanded = $menu.children(this.liExpandedSelector);
          this.$preloader = $(this.preloaderSelector);
          this.$liHovered = null;

          /*close btn*/
          this._closeHandler = this.closeHandler.bind(this);
          this._renderCloseBtn = this.renderCloseBtn.bind(this);
          /*delayed menu opening*/
          this._onMouseover = this.onMouseover.bind(this);
          this._onMouseout = this.onMouseout.bind(this);
          /*spinner*/
          this._spinnerActivate = this.spinnerActivate.bind(this);

          this.$liFullscreen.each(this._renderCloseBtn);

          $menu.on({
            'click touch': this._closeHandler,
            'mouseover': this._onMouseover,
            'mouseout': this._onMouseout
          });
          this.$spinnerActivateArea.on({
            'click touch': this._spinnerActivate
          });
        }
      }, {
        key: 'stop',
        value: function stop() {
          this.$menu.off({
            'click touch': this._closeHandler,
            'mouseover': this._onMouseover,
            'mouseout': this._onMouseout
          });
          this.$menu.off({
            'click touch': this._spinnerActivate
          });
          this.$liFullscreen.find(this.closeBtnSelector).remove();
        }
      }, {
        key: 'onMouseover',
        value: function onMouseover(e) {
          if (this.$liHovered) return;

          var $target = $(e.target);
          var $liCurrent = $target.closest(this.$liExpanded);

          if (!$liCurrent.length) return;

          this.$liHovered = $liCurrent;
          this.hoverDebounce($liCurrent);
        }
      }, {
        key: 'onMouseout',
        value: function onMouseout(e) {
          if (!this.$liHovered) return;

          var $relatedTarget = $(e.relatedTarget);
          var $liCurrent = $relatedTarget.closest(this.$liHovered);

          if ($liCurrent.length) return;

          this.$liHovered.removeClass(this.classHovered);
          this.$liHovered = null;
        }
      }, {
        key: 'closeHandler',
        value: function closeHandler(e) {
          var $target = $(e.target);

          if (!$target.closest(this.closeBtnSelector + ', a').length) return;

          var $liHovered = this.$liHovered;

          if (!$liHovered) return;

          $liHovered.addClass(this.classUnhovered).removeClass(this.classHovered);

          setTimeout(function () {
            $liHovered.removeClass(this.classUnhovered);
            this.$liHovered = null; //на всякий случай обнуляем активный li
          }.bind(this), 50);
        }
      }, {
        key: 'hoverDebounce',
        value: function hoverDebounce($el) {
          setTimeout(function () {
            if (!this.$liHovered || !$el.is(this.$liHovered)) return;

            $el.addClass(this.classHovered);
          }.bind(this), this.hoverDelay);
        }
      }, {
        key: 'renderCloseBtn',
        value: function renderCloseBtn(i, el) {
          var $ul = $(el).children('.menu');

          $ul.append(this.closeBtnTpl);
        }
      }, {
        key: 'spinnerActivate',
        value: function spinnerActivate(e) {
          var target = e.target;

          if (!target.closest('a')) return;

          this.$preloader.addClass('active');
        }
      }]);

      return AdminMenu;
    }();

    var adminMenu = new AdminMenu({
      menu: menu,
      spinnerActivateArea: '.menu_adminflex',
      preloaderSelector: '#logo-preloader',
      liFullscreenSelector: '.expanded',
      liExpandedSelector: '.expanded',
      hoverDelay: 300
    });

    adminMenu.init();
  })();

  /*serch menu*/
  (function () {
    var menu = document.querySelector('.menu_adminflex.operations .menu');

    if (!menu) return;

    var Search = function () {
      function Search(options) {
        _classCallCheck(this, Search);

        this.menu = options.menu;
        this.className = {
          hidden: 'js__search-hidden'
        };

        this.init();
      }

      _createClass(Search, [{
        key: 'init',
        value: function init() {
          this.bindElements();
          this.bindHandlers();
          this.attachHandlers();
        }
      }, {
        key: 'searchHandler',
        value: function searchHandler(e) {
          var target = e.target;
          var type = e.type;

          switch (type) {
            case 'input':
              var search = target.value;

              this.filterFields(this.$searchItemns, search);

              if (search) {
                this.$searchReset.removeClass(this.className.hidden);
                this.$searchSubmit.addClass(this.className.hidden);
              } else {
                this.$searchReset.addClass(this.className.hidden);
                this.$searchSubmit.removeClass(this.className.hidden);
              }
              break;
            case 'submit':
              e.preventDefault();
              this.filterFields(this.$searchItemns, this.$searchInput.val());
              break;
            case 'click':
              if ($(target).closest(this.$searchReset).length) {
                this.$searchInput.val('');
                this.$searchReset.addClass(this.className.hidden);
                this.$searchSubmit.removeClass(this.className.hidden);
                this.filterFields(this.$searchItemns, null);
              }
              break;
          }
        }
      }, {
        key: 'renderSearch',
        value: function renderSearch() {
          var searchTpl = '<li class="search-field">\n            <form>\n                <label class="search-input"><input type="text" placeholder="' + Drupal.t('search in menu') + '" name="search"/></label>\n                <div class="search-reset ' + this.className.hidden + '"></div>\n                <label class="search-submit"><input type="submit"/></label>\n            </form>\n           </li>';
          var $searchBlock = $(searchTpl);
          this.$searchInput = $searchBlock.find('.search-input input');
          this.$searchReset = $searchBlock.find('.search-reset');
          this.$searchSubmit = $searchBlock.find('.search-submit');

          //this.$menu.append($searchBlock);

          return $searchBlock;
        }
      }, {
        key: 'bindElements',
        value: function bindElements() {
          this.$menu = $(this.menu);
          this.$searchItemns = this.$menu.children('li.expanded, li.leaf');
          this.$searchBlock = this.renderSearch();

          this.$menu.prepend(this.$searchBlock);
        }
      }, {
        key: 'bindHandlers',
        value: function bindHandlers() {
          this._searchHandler = this.searchHandler.bind(this);
        }
      }, {
        key: 'attachHandlers',
        value: function attachHandlers() {
          this.$searchBlock.on('input submit click', this._searchHandler);
        }
      }, {
        key: 'filterFields',
        value: function filterFields($searchItems, search) {
          var _ = this;

          if (!search) {
            $searchItems.removeClass(_.className.hidden).find('.' + _.className.hidden).removeClass(_.className.hidden);

            return;
          }

          $searchItems.each(function () {
            var $el = $(this);
            var text = this.textContent.toLowerCase();
            var loweredSearch = ('' + search).toLowerCase();

            if (!search) {
              $el.removeClass(_.className.hidden);
              return;
            }

            if (~text.indexOf(loweredSearch)) {
              var $submenu = $el.children('ul.menu');
              var $childrenNotMenu = $el.children().not('ul.menu');
              var submenuText = $submenu.text().toLowerCase();
              var childrenNotMenuText = $childrenNotMenu.text().toLowerCase();

              $el.removeClass(_.className.hidden);

              if ($submenu.length && ~submenuText.indexOf(loweredSearch) && !~childrenNotMenuText.indexOf(loweredSearch)) {
                _.filterFields($submenu.children('li'), loweredSearch);
              } else if ($submenu.length) {
                $submenu.find('.' + _.className.hidden).removeClass(_.className.hidden);
              }
            } else {
              $el.addClass(_.className.hidden);
            }
          });
        }
      }]);

      return Search;
    }();

    var $menu = $(menu);
    var $searchedMenus = $menu.find('> li.expanded > .menu');

    $searchedMenus.each(function () {
      new Search({
        menu: this
      });
    });
  })();

  /*open live chat*/
  (function () {
    var $startBtn = $('.livechat-start');

    $startBtn.on('click', function (e) {
      var $rocketChat = $('.rocketchat-widget');

      e.preventDefault();

      if ($rocketChat.attr('data-state') !== 'opened') {
        $rocketChat.attr('data-state', 'opened');
      } else {
        $rocketChat.attr('data-state', 'closed');
      }
    });
  })();

  /*add current page url to input*/
  (function () {
    var $targetInput = $('[name="submitted[source]"]');
    var pathname = window.location.pathname;

    $targetInput.val(pathname);
  })();

  /*textarea auto-resizer*/
  /* (function () {
     const $textarea = $('.support-chat__message textarea');
     const options = {
       limit: 120
     };
  
     $textarea.autoResize(options);
   })();*/
});

/*Drupal behaviors*/
(function ($) {
  /*cupon update*/
  (function () {
    Drupal.behaviors.cuponUpdate = {
      attach: function attach(context) {
        var $promocodeWrap = $('.coupon-expand-block', context);
        var $error = $('.messages.error', context);

        if ($promocodeWrap.length) {
          $promocodeWrap.once(function () {
            var $el = $(this);

            $el.on('click', 'label[for="edit-coupons-skidka"]', function () {
              var $btnPromo = $el.find('.btn_promo');

              $el.removeClass('active');
              $btnPromo.show();
            });

            $el.on('click', '.btn_promo', function () {
              var $promocode = $el.find('.promo-code');
              var $btn = $(this);

              $btn.hide();
              $el.addClass('active');
              $promocode.show();
            });

            afterUpdateCupon($el);
          });
        } else if ($error.length) {
          $error.once(function () {
            var $el = $(this);
            var $promocodeWrap = $el.closest('.coupon-expand-block');
            var $btn = $promocodeWrap.siblings('.btn_promo');

            if (!$promocodeWrap.length) return;

            $btn.hide();
            $promocodeWrap.show();

            afterUpdateCupon($promocodeWrap);
          });
        }
      }
    };

    /**
     * Custom script after update cupon
     */

    function afterUpdateCupon($cuponHtml) {
      var cuponWasDeleted = ~$cuponHtml.text().indexOf('был удален из вашего заказа');
      var $cuponActive = $cuponHtml.find('#uc-coupon-active-coupons');
      var $error = $cuponHtml.find('.messages.error');
      var discount = parseInt($('.line-item-discount .amount').text());
      var $cuponInputWrapper = $cuponHtml.find('.code');
      // let $updateCartBtn = $('#edit-actions input[id^="edit-update-ajax"]');
      var $updateCartBtn = $('.form-actions input[id^="edit-update-ajax"]');

      if ($error.length) {
        $cuponInputWrapper.addClass('error-code');
      }

      if ($cuponActive.length && !discount || !$cuponActive.length && discount || cuponWasDeleted && discount) {
        $updateCartBtn.trigger('mousedown');
      }

      if (!$cuponActive.length && !$error.length) {
        renderButton($cuponHtml);
      }
    }

    /*render cupon*/
    function renderButton($cuponHtml) {
      var $renderedBtn = $cuponHtml.siblings('.btn_promo');
      var $newBtn = $('<div class="btn_promo btn small simple">У меня есть промо-код</div>');

      $cuponHtml.hide();

      if (!$renderedBtn.length) {
        $cuponHtml.before($newBtn);
        $newBtn.on('click', function () {
          $(this).hide();
          $cuponHtml.fadeIn(200);
        });
      } else {
        $renderedBtn.show();
      }
    }
  })();

  /*change currency letters to icon*/
  (function () {
    var options = {
      searchedEl: '.price, .prices, .subtotal, .sum, .total-sum, .shipping, .total, .uc-price, .amount, .icon-cashback',
      pattern: 'руб.',
      classes: 'icon ic-rub'
    };
    var textReplacer = $.jFlex.textReplacer(options);

    Drupal.behaviors.lettersToIcon = {
      attach: function attach(context) {
        textReplacer.run(context);
      }
    };
  })();

  /*cart toggler drupal behavior*/
  (function () {
    Drupal.behaviors.buttonsBox = {
      attach: function attach(context) {
        $(context).once(function () {
          var $el = $(this);

          if (!$el.hasClass('cart-qty-items-count')) return;

          togglerCartWorking($el);
        });

        $('.buttons__box .cart-qty-items-count', context).once(function () {
          togglerCartWorking($(this));
        });
      }
    };

    function togglerCartWorking($counter) {
      var $cartBtn = $('.js__et-cart-toggler');
      var qty = parseInt($counter.text());

      if (qty > 0) {
        $cartBtn.trigger('jElementToggler:start');
      } else if (qty === 0) {
        $cartBtn.trigger('jElementToggler:close').trigger('jElementToggler:stop');
      }
    }
  })();

  /*cart content-toggler checkout*/
  (function () {
    var isDisabled = false;

    Drupal.behaviors.contentTogglerCheckout = {
      attach: function attach(context) {
        $('.cart-info .content-toggler', context).once(function () {
          var $toggler = $(this);

          togglerEnabling($toggler);
          $(window).on('resize', togglerEnabling.bind(null, $toggler));
        });
      }
    };

    function togglerEnabling($toggler) {
      var wWidth = document.documentElement.clientWidth;

      if (wWidth > 640 && !isDisabled) {
        $toggler.trigger('jElementToggler:open', ['simple']).trigger('jElementToggler:stop');
        isDisabled = true;
      } else if (wWidth <= 640 && isDisabled) {
        $toggler.trigger('jElementToggler:start').trigger('jElementToggler:close', ['simple']);
        isDisabled = false;
      }
    }
  })();

  /*toggler live chat*/
  (function () {
    Drupal.behaviors.liveChatContentToggler = {
      attach: function attach(context) {
        var $togglerBtn = $('.js__et-support-chat', context);
        var $openBtn = $('.support-chat-open', context);

        // @TODO здесь не работает, не сворачивает блок, в консоле это работает!
        $('.j_crm-chat--content-type--comment').once(function () {
          $(this).find('.support-chat__top-wrap').slideUp(200);
          setHeightChatBody();
        });

        $togglerBtn.once(function () {
          var $btn = $(this);
          var $parent = $('.j_crm-chat--content-wrap');
          var options = {
            onBeforeOpen: function onBeforeOpen() {
              $parent.removeClass('j_crm-chat--collapsed');
              if ($btn.hasClass('j_crm-chat--button-circle')) {
                if (document.documentElement.clientWidth < 960) {
                  $btn.animate({ bottom: "-70px" }, 200);
                } else {
                  $btn.animate({ right: "-70px" }, 200);
                }
              } else {
                $btn.animate({ bottom: "-50px" }, 200);
              }
            },
            onAfterClose: function onAfterClose() {
              $parent.addClass('j_crm-chat--collapsed');
              if ($btn.hasClass('j_crm-chat--button-circle')) {
                if (document.documentElement.clientWidth < 960) {
                  $btn.animate({ bottom: "20px" }, 200);
                } else {
                  $btn.animate({ right: "15px" }, 200);
                }
              } else {
                $btn.animate({ bottom: "0" }, 200);
              }
            },
            animation: 'slide',
            openAnimationDuration: 200,
            closeAnimationDuration: 100
          };

          if (!$parent.hasClass('j_crm-chat--collapsed') && document.documentElement.clientWidth >= 960) {
            $btn.addClass('et-active');
          }

          $btn.jElementToggler(options);
        });

        $openBtn.once(function () {
          var $btn = $(this);

          $btn.on('click', function (e) {
            e.preventDefault();
            var $toggler = $('.js__et-support-chat');

            $toggler.trigger('jElementToggler:open');
          });
        });
      }
    };

    Drupal.behaviors.liveChatKeyMap = {
      attach: function attach(context) {
        var $message = $('.support-chat__message', context);

        $message.once(function () {
          var _this = this;

          /*send message*/
          (function () {
            var $textarea = $(_this).find('textarea');
            var $submit = $(_this).find('.message-submit input[type="submit"]');
            var options = {
              extraSpace: 0,
              limit: 120
            };

            $textarea.autoResize(options);
            $textarea.on('keydown', function (e) {
              if (e.keyCode !== 13) return;
              e.preventDefault();

              if (e.shiftKey) {
                e.target.value = e.target.value + '\n';
              } else {
                $submit.trigger('mousedown');
              }
            });
          })();

          /*upload attachment*/
          (function () {
            var $fileWidget = $(_this).find('.file-widget.form-managed-file');
            var $input = $fileWidget.find('input[type="file"]');
            var $submit = $fileWidget.find('input[type="submit"]');

            $input.on('change', function () {
              setTimeout(function () {
                if ($fileWidget.find('.file-upload-js-error').length || $input.prop('files') && !$input.prop('files').length) return;
                $submit.trigger('mousedown');
              }, 50);
            });
          })();

          /*input[type=file] open*/
          (function () {
            var $openFileBtn = $('.btn_file-open', $message);
            var $toggler = $('.file-widget.form-managed-file input[type=file]', $message);

            $openFileBtn.once(function () {
              var $btn = $(this);

              $btn.on('click', function (e) {
                e.preventDefault();

                if (!$toggler.parents($message).length) return;

                $toggler.trigger('click');
              });
            });
          })();
        });
      }
    };

    Drupal.behaviors.liveChatBodySetHeight = {
      attach: function attach(context) {
        var $chatElements = $('.file-widget', context);

        $chatElements.once(setHeightChatBody);
      }
    };

    Drupal.behaviors.liveChatBodySetHeightOnResize = {
      attach: function attach(context) {
        var $body = $('body', context);

        $body.once(function () {
          var $chat = $('.j_crm-chat');

          if (!$chat.length) return;
          $(window).on('resize', setHeightChatBody);
        });
      }
    };

    /*support chat body height set*/
    function setHeightChatBody() {
      var $contentWrap = $('.j_crm-chat--content-wrap');
      var $topBlock = $('.support-chat__top-block');
      var $message = $('.support-chat__message');
      var $chatBody = $('.support-chat__body');
      var $operatorList = $('.support-chat__operator_list');

      $contentWrap.show();

      var mainHeight = document.documentElement.clientHeight;
      var messageHeight = $message.outerHeight();

      var topBlockHeight = $topBlock.outerHeight();
      var chatBodyHeight = mainHeight - topBlockHeight - messageHeight + 'px';

      if (parseFloat(chatBodyHeight) < 300) {
        $operatorList.hide();
        topBlockHeight = $topBlock.outerHeight();
        chatBodyHeight = mainHeight - topBlockHeight - messageHeight + 'px';
      }

      if (parseFloat(chatBodyHeight) > 299 && document.documentElement.clientWidth >= 960) {
        $operatorList.show();
        topBlockHeight = $topBlock.outerHeight();
        chatBodyHeight = mainHeight - topBlockHeight - messageHeight + 'px';
      }

      if ($contentWrap.hasClass('j_crm-chat--collapsed')) {
        $contentWrap.hide();
      }

      $chatBody.css({
        height: chatBodyHeight
      });
    }
  })();

  /*userLogin on cart*/
  (function () {
    Drupal.behaviors.userLoginCart = {
      attach: function attach(context) {
        var $userLoginWrap = $('#user_login__wrap', context);

        $userLoginWrap.once(function () {
          var $wrap = $(this);
          var $btn = $wrap.find('#user_login_btn');
          var $userLogin = $wrap.find('.user_login');
          var $userLoginForm = $wrap.find('.user_login_form');

          $btn.on('click', function (e) {
            e.preventDefault();

            $userLogin.hide();
            $userLoginForm.removeClass('hidden').hide().slideDown(200);
          });
        });
      }
    };
  })();

  /*ajax overlay on*/
  (function () {
    Drupal.behaviors.ajaxOverlayOnTrobber = {
      attach: function attach(context) {
        var $throbbers = $('.ajax-progress-throbber', context);
        var $ajaxOverlay = $('.ajax-progress-overlay.ajax-custom', context);
        var $throbberGlobal = $('.ajax-progress-throbber');

        $ajaxOverlay.once(function () {
          var $currOverlay = $(this);
          var $throbber = $currOverlay.siblings('.ajax-progress-throbber');
          var $parent = $currOverlay.parent();

          if ($throbber.length) return;

          $currOverlay.remove();
          $parent.css({
            position: ''
          });
        });

        $throbbers.once(function () {
          var $throbber = $(this);
          var $overlay = $('<div class="ajax-progress-overlay ajax-custom"></div>');
          var $parent = $throbber.parent();

          $throbber.before($overlay);
          $parent.css({
            position: 'relative'
          });
        });
      }
    };
  })();

  /*editable fields*/
  (function () {
    Drupal.behaviors.editablefields_submit = {
      attach: function attach(context) {
        $('.editablefield-item').once('editablefield', function () {
          var $this = $(this);

          // There is only one editable field in that form, we can hide the submit
          // button.
          if ($this.find('input[type=text],input[type=checkbox],textarea,select').length == 1 || $this.find('select.use-select-2').length == 1 || $this.find('input[type=radio] ').length > 1) {
            $this.find('input.form-submit').hide();
            $this.find('input[type=text],input[type=checkbox],input[type=radio],textarea,select').change(function () {
              var $input = $this.find('textarea, input[type="text"], select');

              $input.css('background', '').addClass('input-disabled input-progress').prop('readonly', true);

              if ($input.is('select.use-select-2')) {
                $input.select2('readonly', true);
                $input.siblings('.select2-container').find('.select2-choice').addClass('input-progress');
              }

              $this.find('input.form-submit').triggerHandler('click');
            });
          }

          var submitName = 'input.form-submit.editablefield-edit-hover';
          var linkName = '.editablefield-hover-link';

          var $submit = $this.find(submitName);
          $submit.hide().after('<a href="#" class="editablefield-hover-link">' + $submit.attr('value') + '</a>');

          $this.find(linkName).hide().click(function () {
            $this.find(submitName).click();
            return false;
          });

          $this.hover(function () {
            $this.find(linkName).fadeToggle('fast');
          });
        });
      }
    };
  })();

  /*city block width*/
  (function () {
    Drupal.behaviors.cityBlock = {
      attach: function attach(context) {
        var $cities = $('.city-block .cities', context);

        $cities.once(function () {
          var $currCities = $(this);
          var $citiesGroup = $currCities.find('.cities-group');
          var citiesWidth = $currCities.outerWidth() - $currCities.width() + $currCities.width() * $citiesGroup.length;

          $currCities.width(citiesWidth);
        });
      }
    };
  })();

  /*development admin menu toggler*/
  (function () {
    Drupal.behaviors.adminMenuToggler = {
      attach: function attach(context) {
        var $adminMenu = $('.menu_adminflex__wrap', context);

        $adminMenu.once(function () {
          var $menu = $(this);
          var isMenuDisabled = $.cookie('adminMenuDisabled');

          if (isMenuDisabled) {
            $menu.hide();
            $('.fullpage').css('paddingLeft', '0');
          }
        });
      }
    };

    window.on = enableAdminMenu;
    window.off = disableAdminMenu;

    function disableAdminMenu() {
      $.cookie('adminMenuDisabled', true, { path: '/' });
    }

    function enableAdminMenu() {
      $.removeCookie('adminMenuDisabled', { path: '/' });
    }
  })();

  /* delegate submit click in ctools-modal-content*/
  (function () {
    Drupal.behaviors.delegatedSubmit = {
      attach: function attach(context) {
        if (context !== '#modalContent') return;
        $(context).once(function () {
          var $modal = $(this);
          var $submitBtn = $('#edit-submit', $modal);
          var $modalHeader = $('.modal-header', $modal);
          var $delegatedBtn = $('<div class="btn_delegated-submit btn small simple">Сохранить конфигурацию</div>');

          $modalHeader.append($delegatedBtn);
          $delegatedBtn.on('click', function () {
            $submitBtn.trigger('click');
          });
        });
      }
    };
  })();
})(jQuery);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpzL3JlYWR5c2hvcC5lczYuanMiXSwibmFtZXMiOlsialF1ZXJ5IiwiZG9jdW1lbnQiLCJyZWFkeSIsIiQiLCJvbiIsImZhZGVPdXQiLCJwYXJlbnQiLCJmaW5kIiwiZm9jdXMiLCJ2YWwiLCJmYWRlSW4iLCJoYXNDbGFzcyIsIiRzdGlja3ljYXJ0X2NvbnRhaW5lciIsImNsb3Nlc3QiLCJsZW5ndGgiLCJjaGVja291dF9ib3R0b21fc3BhY2luZyIsImhlaWdodCIsIm9mZnNldCIsInRvcCIsImNoZWNrb3V0X21hcmdpbl90b3AiLCJwYXJzZUludCIsImNzcyIsInN0aWNreSIsInRvcFNwYWNpbmciLCJib3R0b21TcGFjaW5nIiwiJGNhcnRCdG4iLCIkb3ZlcmxheSIsIm9wdGlvbnMiLCJhbmltYXRpb24iLCJvbkJlZm9yZU9wZW4iLCJjb250cm9sbGVyIiwiJHBhcmVudCIsIl8kdG9nZ2xlckJ0biIsIm9uZSIsIm9uT3ZlcmxheSIsImFkZENsYXNzIiwib25BZnRlck9wZW4iLCJ3aW5kb3ciLCJ0cmlnZ2VyIiwib25CZWZvcmVDbG9zZSIsIm9mZiIsInJlbW92ZUNsYXNzIiwiZ2V0VGFyZ2V0IiwiJGJ0biIsImpFbGVtZW50VG9nZ2xlciIsImNhcnRUb2dnbGVyT25PZmYiLCJlIiwiZGF0YSIsImhpZGVFbCIsIndXaWR0aCIsImRvY3VtZW50RWxlbWVudCIsImNsaWVudFdpZHRoIiwiJGJ0bkJveCIsImlzSGlkZGVuQ2FydEJ0biIsImNoaWxkcmVuIiwidG9nZ2xlQ2FydEJ0blZpc2liaWxpdHkiLCJzaG93Q2FydEJ0biIsImhpZGVDYXJ0QnRuIiwic2Nyb2xsVG9wIiwicGFnZVlPZmZzZXQiLCIkdGFyZ2V0IiwibGFzdFVybCIsInJlZmVycmVyIiwiY3Vyckhvc3QiLCJsb2NhdGlvbiIsImhvc3QiLCJpc0Nsb3NlZCIsImNvb2tpZSIsImlzT3V0ZXJDb21lIiwiaW5kZXhPZiIsIm9uQWZ0ZXJDbG9zZSIsInBhdGgiLCJyZW1vdmVDb29raWUiLCJpbml0Iiwid3ciLCJzZXRUaW1lb3V0IiwiJHNlYXJjaFRvZ2dsZXIiLCJhbmltYXRpb25EdXJhdGlvbiIsInJlc3BvbnNpdmVTd2l0Y2hlciIsImNyZWF0ZVJlc3BvbnNpdmVTd2l0Y2giLCIkdG9nZ2xlciIsIiRzdGlja3lUYWJsZSIsInF1ZXJ5U2VsZWN0b3JBbGwiLCIkbWVudSIsIiRsaXN0IiwiJGFuY2hvciIsIm91dGVyQ2xpY2siLCJjbGFzc05hbWUiLCJhY3RpdmUiLCJwcmV2ZW50RGVmYXVsdCIsImZhc3RvcmRlckJ0biIsInF1ZXJ5U2VsZWN0b3IiLCJxdHlJbnB1dCIsImdldEVsZW1lbnRCeUlkIiwiZm9ybSIsInRhcmdldFF0eUlucHV0IiwiYWRkRXZlbnRMaXN0ZW5lciIsInZhbHVlIiwicmVuZGVyRm9ybUhlYWQiLCJ0YXJnZXRQcmljZUVsIiwidGl0bGUiLCJjb250ZW50IiwiZXhpc3RlZEhlYWQiLCJxdHkiLCJwcmljZSIsInBhcnNlRmxvYXQiLCJ0ZXh0Q29udGVudCIsInJlcGxhY2UiLCJ0b3RhbFByaWNlIiwicGFyc2VQcmljZSIsIm5ld0hlYWQiLCJyZXBsYWNlV2l0aCIsInByZXBlbmQiLCJwcmVjaXNlUHJpY2UiLCJNYXRoIiwicm91bmQiLCJwcmljZVN0ciIsImJlZm9yZURvdCIsImZsb29yIiwiYmVmb3JlRG90U3RyIiwiYWZ0ZXJEb3RTdHIiLCJzbGljZSIsInJlc3VsdEFyciIsInNwbGl0IiwicmVzdWx0U3RyIiwiaSIsImoiLCJpc1RoaXJkIiwic3BsaWNlIiwiam9pbiIsIiRkTW9kZSIsImlzQXR0YWNoZWRIYW5kbGVyIiwic2V0RGlzcGxheU1vZGUiLCJoYXNoIiwic2V0TW9kZSIsImF0dHIiLCJtb2RlIiwib25seUxpbmsiLCJzaWJsaW5ncyIsImV4cGlyZXMiLCIkbWluIiwiJG1heCIsIiRzdWJtaXQiLCJtaW4iLCJtYXgiLCJyYW5nZXMiLCJwaXhlbFJhbmdlIiwidW5pdFJhbmdlIiwialJhbmdlQmFyIiwic3VibWl0QnRuTG9naWMiLCJoaWRlIiwiYnRGbiIsInNob3ciLCJob2xkZXIiLCIkaG9sZGVyIiwicmVmcmVzaFJhbmdlQmFyIiwiJHJhbmdlQmFyIiwiamJveEhvbGRlciIsImpCb3giLCJoaWRlQmxvY2siLCIkY2xvc2VCdG4iLCJjbG9zZSIsImNvbmZpcm1OYW1lIiwiaXNDb25maXJtZWQiLCJkZWxldGVDb29raWVDb25maXJtIiwiJGNvb2tpZXNCbG9jayIsIiRjb25maXJtQnRuIiwiJHBhcmVudEJsb2NrIiwibWFyZ2luVG9wIiwib3V0ZXJIZWlnaHQiLCJjb25maXJtSGFuZGxlciIsInJlbmRlckNvb2tpZXNDb25maXJtIiwidHBsIiwiYW5pbWF0ZSIsInNsaWRlVXAiLCJyZW1vdmUiLCJ0b3RhbFJvd3MiLCJnb29kc0NvdW50IiwiJHJldmlld3NCdG4iLCJpZCIsImdldEF0dHJpYnV0ZSIsIiRjb21tZW50VGFiIiwiU2Nyb2xsVG9BbmNob3IiLCJfbGlzdGVuZWRCbG9jayIsImxpc3RlbmVkQmxvY2siLCJib2R5IiwiX3RyYW5zbGF0aW9uRWxlbWVudFNlbGVjdG9yIiwidHJhbnNsYXRpb24iLCJfYW5pbWF0aW9uU3BlZWQiLCJhbmltYXRpb25TcGVlZCIsInByb3RvdHlwZSIsImFuY2hvckNsaWNrTGlzdGVuZXIiLCJiaW5kIiwiZWxlbSIsInRhcmdldCIsImFuY2hvciIsImFuY2hvcldpdGhIYXNoIiwid2luZG93UGF0aCIsIm9yaWdpbiIsInBhdGhuYW1lIiwiYW5jaG9yUGF0aCIsImhyZWYiLCJnZXRUcmFuc2xhdGlvbiIsInNtb290aFNjcm9sbCIsImhhc0F0dHJpYnV0ZSIsImVhY2giLCJvZmZzZXRIZWlnaHQiLCJzZWxlY3RvciIsInBhZ2VTY3JvbGwiLCJzZXRTb3VyY2VGcm9tQW5jaG9ySGFuZGxlciIsInNldFNvdXJjZUZyb21Gb3JtSGFuZGxlciIsInNvdXJjZUJ0biIsInNvdXJjZURhdGEiLCJzb3VyY2VJbnB1dCIsInNldEF0dHJpYnV0ZSIsInN1Ym1pdEJ0biIsInNvdXJjZURhdGFFbCIsIiRwb3BVcFNpbXBsZU5ld3MiLCIkc3Vic2NyaWJlIiwiJHN1YnNjcmliZURpc2FibGUiLCJzaG93UG9wVXBGdW5jIiwic2hvd1BvcFVwRGVjIiwidXNlck9wdCIsInN0YXR1cyIsImRhdGUiLCJEYXRlIiwibGFzdFNob3duIiwic2hvd0VhY2giLCJpc1N1YnNjcmliZWQiLCJpc1Vuc3Vic2NyaWJlZCIsImNvb2tpZU9wdCIsInVzZXJOYW1lIiwidXNlckRhdGEiLCJnZXRDb29raWUiLCJub3dEYXRlIiwiZGF0ZUluZGV4IiwibW9iaWxlQ2xhc3MiLCJzdWJtaXRPa01lc3MiLCJzdWJtaXRGYWlsTWVzcyIsImNsZWFuQ29va2llIiwiaXNMb2dnZWQiLCJzZXRDb29raWUiLCJzdGFydFNob3dpbmciLCJwYXJzZSIsImNhY2hlZEpzb25PcHRpb24iLCJqc29uIiwiZm9ybUNvbnRyb2xJbml0Iiwib25VbnN1YnNjcmliZSIsImhpZGVKYm94Iiwib25Nb3VzZUxlYXZlQm9keSIsInN0b3BTaG93aW5nIiwiY2xpZW50WSIsImlzU2hvd24iLCJlbCIsInNob3dKYm94IiwiY2xlYW4iLCJqYm94aHRtbCIsImNvbnNvbGUiLCJkaXIiLCIkZm9ybU9rIiwicmVuZGVyTWVzcyIsImFwcGVuZFRvIiwiJGZvcm1GYWlsIiwiJGVtYWlsIiwiJHdyYXBwZXIiLCIkcGVuZGluZyIsIiRlcnJvciIsImFwcGVuZCIsImZvcm1Db250cm9sbGVyIiwicmVzb2x2ZSIsImVtYWlsIiwib25TdWJzY3JpYmUiLCJkYXRhTGF5ZXIiLCJpc0FycmF5IiwicHVzaCIsInJlbG9hZCIsInJlamVjdCIsImFmdGVyVmFsaWRhdGUiLCJpcyIsImFqYXgiLCJ0eXBlIiwidXJsIiwic3VjY2VzcyIsInJlc3BvbnNlIiwic3Vic2NyaWJlZCIsInNlbmRSZXF1ZXN0IiwiYXBwbHkiLCJfcmVzb2x2ZSIsIl9yZWplY3QiLCJfYmVmb3JlU2VuZCIsImVycm9yIiwicmVzcG9uZEZvcm1Tb3VyY2UiLCJtZXNzIiwibU1lbnUiLCJtTWVudVBhbmVsIiwiJG1NZW51UGFuZWwiLCIkdGFiTmFtZSIsInRvZ2dsZXJDb250cm9sbGVyIiwiX29uQmVmb3JlT3BlbiIsIiRhY3RpdmVUYWIiLCJmaWx0ZXIiLCJhY3RpdmVUb2dnbGVyIiwiX2Rpc2FsbG93ZWRBY3Rpb25zIiwiX29uQWZ0ZXJPcGVuIiwiX29uQmVmb3JlQ2xvc2UiLCJfb25BZnRlckNsb3NlIiwic3dpcGUiLCJldmVudCIsImRpcmVjdGlvbiIsImRpc3RhbmNlIiwiZHVyYXRpb24iLCJmaW5nZXJDb3VudCIsImZpbmdlckRhdGEiLCJhbGxvd1BhZ2VTY3JvbGwiLCJjbGFzc0xpc3QiLCJhZGQiLCJsZWZ0IiwiY2hlY2tDb29raWUiLCJpc0Z1bGxQYWdlIiwiJHdpbmRvdyIsInNldEZ1bGxQYWdlSmJveCIsIiRtYXBXcmFwcGVycyIsImZpcnN0U2NyaXB0Iiwic2NyaXB0IiwiY3JlYXRlRWxlbWVudCIsInNyYyIsImFzeW5jIiwicGFyZW50Tm9kZSIsImluc2VydEJlZm9yZSIsInltYXBzIiwiJG1hcFdyYXBwZXIiLCIkbWFwIiwibWFwT3ZlcmxheUluaXQiLCJtYXBPdmVybGF5SW5pdENsb3N1cmUiLCJ3aWR0aCIsIm1hcERhdGEiLCJjZW50ZXIiLCJKU09OIiwiem9vbSIsInBsYWNlbWFya0RhdGEiLCJjb29yZHMiLCJoaW50Q29udGVudCIsImJhbGxvb25Db250ZW50IiwibWFwV3JhcHBlciIsImlzQWN0aXZlTWFwIiwibXlNYXAiLCJNYXAiLCJzZWFyY2hDb250cm9sUHJvdmlkZXIiLCJwbGFjZW1hcmsiLCJQbGFjZW1hcmsiLCJwcmVzZXQiLCJnZW9PYmplY3RzIiwiJGlucHV0IiwiX2FkZE92ZXJsYXkiLCJ3YWl0ZXIiLCJhZGRPdmVybGF5IiwicmVtb3ZlT3ZlcmxheSIsImZ1bmMiLCJtcyIsImJpbmRlZFRoaXMiLCJ0aW1lciIsImFyZ3MiLCJhcmd1bWVudHMiLCJ1bmRlZmluZWQiLCJjbGVhclRpbWVvdXQiLCIkcHJlbG9hZGVyIiwiJHN0YXJ0QnRuIiwiJGFkbWluTWVudSIsIiRmdWxsUGFnZSIsImNhY2hlZEZ1bGxQYWdlUGFkZGluZ0xlZnQiLCJzdGVwcyIsImVsZW1lbnQiLCJ0YWciLCJhbmltYXRlVHlwZSIsInRvdXJzIiwiZGVmYXVsdFRvdXJPcHRpb25zIiwiaXNNZW51IiwiYWRkTWVudU1ldGhvZCIsImNvbnRhaW5lciIsInRleHQiLCJ6SW5kZXgiLCJxdWV1ZSIsInJlbW92ZU1lbnVNZXRob2QiLCJjb21wbGV0ZSIsInRvdXJNYXN0ZXIiLCJnZXRUb3VycyIsInRoZW4iLCJqVG91ck1hc3RlciIsInN0YXJ0Iiwic3RhcnRNYXN0ZXJPbkFkbWluIiwiZXh0ZW5kIiwiY2F0Y2giLCJpc0FkbWluUGFnZSIsImlzTmV3IiwiZXh0cmFPcHRpb25zIiwiamJveE9wdGlvbnMiLCJjdXN0b21Ib2xkZXJDbGFzcyIsImN1c3RvbU92ZXJsYXlDbGFzcyIsImRpc2FibGVDbG9zZUJ0bkhhbmRsZXIiLCJkaXNhYmxlT3ZlcmxheUhhbmRsZXIiLCJQcm9taXNlIiwiZ2V0SlNPTiIsInhociIsInBhcnNlVG91cnMiLCJmYWlsIiwibmV3VG91cnMiLCJmb3JFYWNoIiwidG91ciIsIm5ld1RvdXIiLCJrZXkiLCJzdGVwIiwicGFyc2VTdGVwIiwic3RlcE1hcHBlciIsImFuaW1hdGV0eXBlIiwiaXNtZW51c3RlcCIsIm1lbnV0aXRsZSIsIm9uZWxlbWVudCIsImhhbmRsZXJNYXBwZXIiLCJzYXZlTkdvIiwibmV3U3RlcCIsImhhbmRsZXIiLCJ0b3VyQ29udHJvbGxlciIsImFjdGl2ZVN0ZXAiLCJvbkVsZW1lbnQiLCJiaW5kTmV4dFN0ZXAiLCJkZWxldGVDb29raWVUb3VyIiwibWVudSIsIkFkbWluTWVudSIsInNwaW5uZXJBY3RpdmF0ZUFyZWEiLCJjbGFzc0hvdmVyZWQiLCJjbGFzc1VuaG92ZXJlZCIsInByZWxvYWRlclNlbGVjdG9yIiwibGlGdWxsc2NyZWVuU2VsZWN0b3IiLCJsaUV4cGFuZGVkU2VsZWN0b3IiLCJjbG9zZUJ0blNlbGVjdG9yIiwiY2xvc2VCdG5UcGwiLCJob3ZlckRlbGF5IiwiJHNwaW5uZXJBY3RpdmF0ZUFyZWEiLCIkbGlGdWxsc2NyZWVuIiwiJGxpRXhwYW5kZWQiLCIkbGlIb3ZlcmVkIiwiX2Nsb3NlSGFuZGxlciIsImNsb3NlSGFuZGxlciIsIl9yZW5kZXJDbG9zZUJ0biIsInJlbmRlckNsb3NlQnRuIiwiX29uTW91c2VvdmVyIiwib25Nb3VzZW92ZXIiLCJfb25Nb3VzZW91dCIsIm9uTW91c2VvdXQiLCJfc3Bpbm5lckFjdGl2YXRlIiwic3Bpbm5lckFjdGl2YXRlIiwiJGxpQ3VycmVudCIsImhvdmVyRGVib3VuY2UiLCIkcmVsYXRlZFRhcmdldCIsInJlbGF0ZWRUYXJnZXQiLCIkZWwiLCIkdWwiLCJhZG1pbk1lbnUiLCJTZWFyY2giLCJoaWRkZW4iLCJiaW5kRWxlbWVudHMiLCJiaW5kSGFuZGxlcnMiLCJhdHRhY2hIYW5kbGVycyIsInNlYXJjaCIsImZpbHRlckZpZWxkcyIsIiRzZWFyY2hJdGVtbnMiLCIkc2VhcmNoUmVzZXQiLCIkc2VhcmNoU3VibWl0IiwiJHNlYXJjaElucHV0Iiwic2VhcmNoVHBsIiwiRHJ1cGFsIiwidCIsIiRzZWFyY2hCbG9jayIsInJlbmRlclNlYXJjaCIsIl9zZWFyY2hIYW5kbGVyIiwic2VhcmNoSGFuZGxlciIsIiRzZWFyY2hJdGVtcyIsIl8iLCJ0b0xvd2VyQ2FzZSIsImxvd2VyZWRTZWFyY2giLCIkc3VibWVudSIsIiRjaGlsZHJlbk5vdE1lbnUiLCJub3QiLCJzdWJtZW51VGV4dCIsImNoaWxkcmVuTm90TWVudVRleHQiLCIkc2VhcmNoZWRNZW51cyIsIiRyb2NrZXRDaGF0IiwiJHRhcmdldElucHV0IiwiYmVoYXZpb3JzIiwiY3Vwb25VcGRhdGUiLCJhdHRhY2giLCJjb250ZXh0IiwiJHByb21vY29kZVdyYXAiLCJvbmNlIiwiJGJ0blByb21vIiwiJHByb21vY29kZSIsImFmdGVyVXBkYXRlQ3Vwb24iLCIkY3Vwb25IdG1sIiwiY3Vwb25XYXNEZWxldGVkIiwiJGN1cG9uQWN0aXZlIiwiZGlzY291bnQiLCIkY3Vwb25JbnB1dFdyYXBwZXIiLCIkdXBkYXRlQ2FydEJ0biIsInJlbmRlckJ1dHRvbiIsIiRyZW5kZXJlZEJ0biIsIiRuZXdCdG4iLCJiZWZvcmUiLCJzZWFyY2hlZEVsIiwicGF0dGVybiIsImNsYXNzZXMiLCJ0ZXh0UmVwbGFjZXIiLCJqRmxleCIsImxldHRlcnNUb0ljb24iLCJydW4iLCJidXR0b25zQm94IiwidG9nZ2xlckNhcnRXb3JraW5nIiwiJGNvdW50ZXIiLCJpc0Rpc2FibGVkIiwiY29udGVudFRvZ2dsZXJDaGVja291dCIsInRvZ2dsZXJFbmFibGluZyIsImxpdmVDaGF0Q29udGVudFRvZ2dsZXIiLCIkdG9nZ2xlckJ0biIsIiRvcGVuQnRuIiwiYm90dG9tIiwicmlnaHQiLCJvcGVuQW5pbWF0aW9uRHVyYXRpb24iLCJjbG9zZUFuaW1hdGlvbkR1cmF0aW9uIiwibGl2ZUNoYXRLZXlNYXAiLCIkbWVzc2FnZSIsIiR0ZXh0YXJlYSIsImV4dHJhU3BhY2UiLCJsaW1pdCIsImF1dG9SZXNpemUiLCJrZXlDb2RlIiwic2hpZnRLZXkiLCIkZmlsZVdpZGdldCIsInByb3AiLCIkb3BlbkZpbGVCdG4iLCJwYXJlbnRzIiwibGl2ZUNoYXRCb2R5U2V0SGVpZ2h0IiwiJGNoYXRFbGVtZW50cyIsInNldEhlaWdodENoYXRCb2R5IiwibGl2ZUNoYXRCb2R5U2V0SGVpZ2h0T25SZXNpemUiLCIkYm9keSIsIiRjaGF0IiwiJGNvbnRlbnRXcmFwIiwiJHRvcEJsb2NrIiwiJGNoYXRCb2R5IiwiJG9wZXJhdG9yTGlzdCIsIm1haW5IZWlnaHQiLCJjbGllbnRIZWlnaHQiLCJtZXNzYWdlSGVpZ2h0IiwidG9wQmxvY2tIZWlnaHQiLCJjaGF0Qm9keUhlaWdodCIsInVzZXJMb2dpbkNhcnQiLCIkdXNlckxvZ2luV3JhcCIsIiR3cmFwIiwiJHVzZXJMb2dpbiIsIiR1c2VyTG9naW5Gb3JtIiwic2xpZGVEb3duIiwiYWpheE92ZXJsYXlPblRyb2JiZXIiLCIkdGhyb2JiZXJzIiwiJGFqYXhPdmVybGF5IiwiJHRocm9iYmVyR2xvYmFsIiwiJGN1cnJPdmVybGF5IiwiJHRocm9iYmVyIiwicG9zaXRpb24iLCJlZGl0YWJsZWZpZWxkc19zdWJtaXQiLCIkdGhpcyIsImNoYW5nZSIsInNlbGVjdDIiLCJ0cmlnZ2VySGFuZGxlciIsInN1Ym1pdE5hbWUiLCJsaW5rTmFtZSIsImFmdGVyIiwiY2xpY2siLCJob3ZlciIsImZhZGVUb2dnbGUiLCJjaXR5QmxvY2siLCIkY2l0aWVzIiwiJGN1cnJDaXRpZXMiLCIkY2l0aWVzR3JvdXAiLCJjaXRpZXNXaWR0aCIsIm91dGVyV2lkdGgiLCJhZG1pbk1lbnVUb2dnbGVyIiwiaXNNZW51RGlzYWJsZWQiLCJlbmFibGVBZG1pbk1lbnUiLCJkaXNhYmxlQWRtaW5NZW51IiwiZGVsZWdhdGVkU3VibWl0IiwiJG1vZGFsIiwiJHN1Ym1pdEJ0biIsIiRtb2RhbEhlYWRlciIsIiRkZWxlZ2F0ZWRCdG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBO0FBQ0E7O0FBR0FBLE9BQU9DLFFBQVAsRUFBaUJDLEtBQWpCLENBQXVCLFVBQVVDLENBQVYsRUFBYTtBQUNsQztBQUNBLEdBQUMsWUFBWTtBQUNYQSxNQUFFLG1DQUFGLEVBQXVDQyxFQUF2QyxDQUEwQyxPQUExQyxFQUFtRCxZQUFZO0FBQzdERCxRQUFFLElBQUYsRUFBUUUsT0FBUixDQUFnQixHQUFoQjtBQUNBRixRQUFFLElBQUYsRUFBUUcsTUFBUixHQUFpQkMsSUFBakIsQ0FBc0IsaUJBQXRCLEVBQXlDQyxLQUF6QztBQUNELEtBSEQ7O0FBS0FMLE1BQUUsNEJBQUYsRUFBZ0NDLEVBQWhDLENBQW1DLE9BQW5DLEVBQTRDLFlBQVk7QUFDdERELFFBQUUsbUNBQUYsRUFBdUNFLE9BQXZDLENBQStDLEdBQS9DO0FBQ0QsS0FGRDs7QUFJQUYsTUFBRSw0QkFBRixFQUFnQ0MsRUFBaEMsQ0FBbUMsTUFBbkMsRUFBMkMsWUFBWTtBQUNyRCxVQUFJRCxFQUFFLElBQUYsRUFBUU0sR0FBUixNQUFpQixFQUFyQixFQUF5QjtBQUN2Qk4sVUFBRSxtQ0FBRixFQUF1Q08sTUFBdkMsQ0FBOEMsR0FBOUM7QUFD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QUFJQyxZQUFZLGVBQWhCLEVBQWlDO0FBQ2pDeGUsVUFBRXdlLE9BQUYsRUFBV0UsSUFBWCxDQUFnQixZQUFZO0FBQzFCLGNBQU1nRyxTQUFTMWtCLEVBQUUsSUFBRixDQUFmO0FBQ0EsY0FBTTJrQixhQUFhM2tCLEVBQUUsY0FBRixFQUFrQjBrQixNQUFsQixDQUFuQjtBQUNBLGNBQU1FLGVBQWU1a0IsRUFBRSxlQUFGLEVBQW1CMGtCLE1BQW5CLENBQXJCO0FBQ0EsY0FBTUcsZ0JBQWdCN2tCLEVBQUUsaUZBQUYsQ0FBdEI7O0FBRUE0a0IsdUJBQWFwVSxNQUFiLENBQW9CcVUsYUFBcEI7QUFDQUEsd0JBQWM1a0IsRUFBZCxDQUFpQixPQUFqQixFQUEwQixZQUFNO0FBQzlCMGtCLHVCQUFXeGlCLE9BQVgsQ0FBbUIsT0FBbkI7QUFDRCxXQUZEO0FBR0QsU0FWRDtBQVdEO0FBZGdDLEtBQW5DO0FBaUJELEdBbEJEO0FBbUJELENBOWhCRCxFQThoQkd0QyxNQTloQkgiLCJmaWxlIjoianMvcmVhZHlzaG9wLmVzNi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGpmbGV4IHJlYWR5c2hvcCBqcXVlcnkgKi9cclxuLypmcm9tIEVTNiovXHJcblxyXG5cclxualF1ZXJ5KGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoJCkge1xyXG4gIC8qIG5ld3NsZXR0ZXIgdGl0bGUgc2VhcmNoIGxhYmVsIGNvbnRyb2wgKi9cclxuICAoZnVuY3Rpb24gKCkge1xyXG4gICAgJCgnI25ld3NibG9jayBsYWJlbFtmb3I9XCJlZGl0LW1haWxcIl0nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICQodGhpcykuZmFkZU91dCgyMDApO1xyXG4gICAgICAkKHRoaXMpLnBhcmVudCgpLmZpbmQoJ2lucHV0LmZvcm0tdGV4dCcpLmZvY3VzKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKCcjbmV3c2Jsb2NrIGlucHV0LmZvcm0tdGV4dCcpLm9uKCdmb2N1cycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgJCgnI25ld3NibG9jayBsYWJlbFtmb3I9XCJlZGl0LW1haWxcIl0nKS5mYWRlT3V0KDIwMCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKCcjbmV3c2Jsb2NrIGlucHV0LmZvcm0tdGV4dCcpLm9uKCdibHVyJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICBpZiAoJCh0aGlzKS52YWwoKSA9PSBcIlwiKSB7XHJcbiAgICAgICAgJCgnI25ld3NibG9jayBsYWJlbFtmb3I9XCJlZGl0LW1haWxcIl0nKS5mYWRlSW4oMjAwKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfSkoKTtcclxuXHJcbiAgLyogYmxvY2sgdGl0bGUgc2VhcmNoIGxhYmVsIGNvbnRyb2wgKi9cclxuICAoZnVuY3Rpb24gKCkge1xyXG4gICAgJCgnLmdsb2JhbHNlYXJjaCAuYmxvY2stdGl0bGUnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICQodGhpcykuZmFkZU91dCgyMDApO1xyXG4gICAgICAkKHRoaXMpLnBhcmVudCgpLmZpbmQoJ2lucHV0LmZvcm0tdGV4dCcpLmZvY3VzKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKCcuZ2xvYmFsc2VhcmNoIGlucHV0LmZvcm0tdGV4dCcpLm9uKCdmb2N1cycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgJCgnLmdsb2JhbHNlYXJjaCAuYmxvY2stdGl0bGUnKS5mYWRlT3V0KDIwMCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKCcuZ2xvYmFsc2VhcmNoIGlucHV0LmZvcm0tdGV4dCcpLm9uKCdibHVyJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICBpZiAoJCh0aGlzKS52YWwoKSA9PSBcIlwiKSB7XHJcbiAgICAgICAgJCgnLmdsb2JhbHNlYXJjaCAuYmxvY2stdGl0bGUnKS5mYWRlSW4oMjAwKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfSkoKTtcclxuXHJcbiAgLyogY2hlY2tvdXQgY2FydCBzdGlja3kgKi9cclxuICAoZnVuY3Rpb24gKCkge1xyXG4gICAgaWYgKCEkKCdib2R5JykuaGFzQ2xhc3MoJ2lzbW9iaWxlZGV2aWNlJykpIHJldHVybjtcclxuXHJcbiAgICBsZXQgJHN0aWNreWNhcnRfY29udGFpbmVyID0gJCgnLmNhcnQtaW5mby5zdGlja3knKS5jbG9zZXN0KCcjY2hlY2tvdXQnKTtcclxuXHJcbiAgICBpZiAoISRzdGlja3ljYXJ0X2NvbnRhaW5lci5sZW5ndGgpIHJldHVybjtcclxuXHJcbiAgICBsZXQgY2hlY2tvdXRfYm90dG9tX3NwYWNpbmcgPSAkKGRvY3VtZW50KS5oZWlnaHQoKSAtICgkc3RpY2t5Y2FydF9jb250YWluZXIuaGVpZ2h0KCkgKyAkc3RpY2t5Y2FydF9jb250YWluZXIub2Zmc2V0KCkudG9wKTtcclxuICAgIGxldCBjaGVja291dF9tYXJnaW5fdG9wID0gcGFyc2VJbnQoJCgnLmNhcnQtaW5mby5zdGlja3knKS5jc3MoJ21hcmdpbi10b3AnKSk7XHJcbiAgICAkKCcuY2FydC1pbmZvLnN0aWNreScpLnN0aWNreSh7XHJcbiAgICAgIHRvcFNwYWNpbmc6IGNoZWNrb3V0X21hcmdpbl90b3AsXHJcbiAgICAgIGJvdHRvbVNwYWNpbmc6IGNoZWNrb3V0X2JvdHRvbV9zcGFjaW5nLFxyXG4gICAgfSk7XHJcbiAgICAkKCcuY2FydC1pbmZvLnN0aWNreScpLm9uKCdzdGlja3ktc3RhcnQnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICQodGhpcykuY3NzKCdtYXJnaW4tdG9wJywgMCk7XHJcbiAgICB9KVxyXG4gICAgJCgnLmNhcnQtaW5mby5zdGlja3knKS5vbignc3RpY2t5LWVuZCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgJCh0aGlzKS5jc3MoJ21hcmdpbi10b3AnLCBjaGVja291dF9tYXJnaW5fdG9wKTtcclxuICAgIH0pXHJcbiAgICAkKCcuY2FydC1pbmZvLnN0aWNreScpLnN0aWNreSgndXBkYXRlJyk7XHJcbiAgfSkoKTtcclxuXHJcbiAgLypjYXJ0IHRvZ2dsZXIqL1xyXG4gIChmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgJGNhcnRCdG4gPSAkKCcuanNfX2V0LWNhcnQtdG9nZ2xlcicpO1xyXG4gICAgbGV0ICRvdmVybGF5ID0gJCgnI2pib3gtb3ZlcmxheScpO1xyXG4gICAgbGV0IG9wdGlvbnMgPSB7XHJcbiAgICAgIGFuaW1hdGlvbjogJ25vbmUnLFxyXG4gICAgICBvbkJlZm9yZU9wZW46IGZ1bmN0aW9uIChjb250cm9sbGVyKSB7XHJcblxyXG4gICAgICAgIGxldCAkcGFyZW50ID0gY29udHJvbGxlci5fJHRvZ2dsZXJCdG4uY2xvc2VzdCgnLmJ0bl9jYXJ0X193cmFwJyk7XHJcbiAgICAgICAgJG92ZXJsYXlcclxuICAgICAgICAgIC5mYWRlSW4oMjAwKVxyXG4gICAgICAgICAgLm9uZSgnY2xpY2snLCB7Y29udHJvbGxlcjogY29udHJvbGxlcn0sIG9uT3ZlcmxheSk7XHJcbiAgICAgICAgJHBhcmVudC5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgIH0sXHJcbiAgICAgIG9uQWZ0ZXJPcGVuOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJCh3aW5kb3cpLnRyaWdnZXIoJ3Njcm9sbCcpO1xyXG4gICAgICB9LFxyXG4gICAgICBvbkJlZm9yZUNsb3NlOiBmdW5jdGlvbiAoY29udHJvbGxlcikge1xyXG4gICAgICAgIGxldCAkcGFyZW50ID0gY29udHJvbGxlci5fJHRvZ2dsZXJCdG4uY2xvc2VzdCgnLmJ0bl9jYXJ0X193cmFwJyk7XHJcblxyXG4gICAgICAgICRvdmVybGF5XHJcbiAgICAgICAgICAuZmFkZU91dCgyMDApXHJcbiAgICAgICAgICAub2ZmKCdjbGljaycsIG9uT3ZlcmxheSk7XHJcbiAgICAgICAgJHBhcmVudC5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGdldFRhcmdldDogZnVuY3Rpb24gKCRidG4pIHtcclxuICAgICAgICByZXR1cm4gJGJ0bi5jbG9zZXN0KCcuYnRuX2NhcnRfX3dyYXAnKS5maW5kKCcuY2FydF9fd3JhcCcpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgICRjYXJ0QnRuLmpFbGVtZW50VG9nZ2xlcihvcHRpb25zKTtcclxuICAgIGNhcnRUb2dnbGVyT25PZmYoKTtcclxuICAgICQod2luZG93KS5vbigncmVzaXplJywgY2FydFRvZ2dsZXJPbk9mZik7XHJcblxyXG4gICAgZnVuY3Rpb24gb25PdmVybGF5KGUpIHtcclxuICAgICAgbGV0IGNvbnRyb2xsZXIgPSBlLmRhdGEuY29udHJvbGxlcjtcclxuXHJcbiAgICAgIGNvbnRyb2xsZXIuaGlkZUVsKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY2FydFRvZ2dsZXJPbk9mZigpIHtcclxuICAgICAgbGV0IHdXaWR0aCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aDtcclxuXHJcbiAgICAgIGlmICh3V2lkdGggPj0gOTYwKSB7XHJcbiAgICAgICAgJGNhcnRCdG4udHJpZ2dlcignakVsZW1lbnRUb2dnbGVyOnN0YXJ0Jyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgJGNhcnRCdG4udHJpZ2dlcignakVsZW1lbnRUb2dnbGVyOnN0b3AnKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pKCk7XHJcblxyXG4gIC8qc2hvdyBjYXRyIHRvZ2dsZXIqL1xyXG4gIChmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgJGNhcnRCdG4gPSAkKCcuYnRuX2NhcnQnKTtcclxuICAgIGxldCAkYnRuQm94ID0gJCgnLmJ1dHRvbnNfX2JveCcpO1xyXG4gICAgbGV0IGlzSGlkZGVuQ2FydEJ0biA9IHRydWU7XHJcblxyXG4gICAgaWYgKCEkYnRuQm94LmNoaWxkcmVuKCkubGVuZ3RoKSByZXR1cm47XHJcblxyXG4gICAgdG9nZ2xlQ2FydEJ0blZpc2liaWxpdHkoKTtcclxuICAgICQod2luZG93KS5vbignc2Nyb2xsJywgdG9nZ2xlQ2FydEJ0blZpc2liaWxpdHkpO1xyXG5cclxuICAgIGZ1bmN0aW9uIHNob3dDYXJ0QnRuKCkge1xyXG4gICAgICAkYnRuQm94LmFkZENsYXNzKCd2aXNpYmxlJyk7XHJcbiAgICAgIGlzSGlkZGVuQ2FydEJ0biA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGhpZGVDYXJ0QnRuKCkge1xyXG4gICAgICAkYnRuQm94LnJlbW92ZUNsYXNzKCd2aXNpYmxlJyk7XHJcbiAgICAgIGlzSGlkZGVuQ2FydEJ0biA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdG9nZ2xlQ2FydEJ0blZpc2liaWxpdHkoKSB7XHJcbiAgICAgIGxldCBzY3JvbGxUb3AgPSB3aW5kb3cucGFnZVlPZmZzZXQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcDtcclxuICAgICAgbGV0IHdXaWR0aCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aDtcclxuXHJcbiAgICAgIGlmICh3V2lkdGggPCA5NjApIHtcclxuICAgICAgICBpZiAoIWlzSGlkZGVuQ2FydEJ0bikge1xyXG4gICAgICAgICAgaGlkZUNhcnRCdG4oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHNjcm9sbFRvcCA+IDEwMCAmJiBpc0hpZGRlbkNhcnRCdG4pIHtcclxuICAgICAgICBzaG93Q2FydEJ0bigpO1xyXG4gICAgICB9IGVsc2UgaWYgKHNjcm9sbFRvcCA8PSAxMDAgJiYgIWlzSGlkZGVuQ2FydEJ0bikge1xyXG4gICAgICAgIGlmICgkY2FydEJ0bi5oYXNDbGFzcygnZXQtYWN0aXZlJykpIHJldHVybjtcclxuICAgICAgICBoaWRlQ2FydEJ0bigpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSkoKTtcclxuXHJcbiAgLypjYXB0dXJlIHRvZ2dsZXIqL1xyXG4gIChmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgJGJ0biA9ICQoJy5qc19fZXQtY2FwdHVyZScpO1xyXG5cclxuICAgIGlmICghJGJ0bi5sZW5ndGgpIHJldHVybjtcclxuXHJcbiAgICBsZXQgJHRhcmdldCA9ICQoJy5jYXB0dXJlX193cmFwJyk7XHJcbiAgICBsZXQgbGFzdFVybCA9IGRvY3VtZW50LnJlZmVycmVyO1xyXG4gICAgbGV0IGN1cnJIb3N0ID0gd2luZG93LmxvY2F0aW9uLmhvc3Q7XHJcbiAgICBsZXQgaXNDbG9zZWQgPSAkLmNvb2tpZSgnY2FwdHVyZS1jbG9zZWQnKTtcclxuICAgIGxldCBpc091dGVyQ29tZSA9ICF+bGFzdFVybC5pbmRleE9mKGN1cnJIb3N0KTtcclxuICAgIGxldCBvcHRpb25zID0ge1xyXG4gICAgICBhbmltYXRpb246ICdmYWRlJyxcclxuICAgICAgb25BZnRlckNsb3NlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJC5jb29raWUoJ2NhcHR1cmUtY2xvc2VkJywgdHJ1ZSwge3BhdGg6ICcvJ30pO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGlmICghaXNPdXRlckNvbWUgJiYgaXNDbG9zZWQgPT09ICd0cnVlJykgcmV0dXJuOyAvL2lzT3V0ZXJDb21lICYmICDQvdC10L/QvtC90Y/RgtC90L4g0LfQsNGH0LXQvCDQsdGL0LvQviDRjdGC0L4g0YPRgdC70L7QstC40LUsINGD0YLQvtGH0L3QuNGC0YxcclxuXHJcbiAgICAkLnJlbW92ZUNvb2tpZSgnY2FwdHVyZS1jbG9zZWQnLCB7cGF0aDogJy8nfSk7XHJcbiAgICAkKHdpbmRvdykub24oJ3Njcm9sbCcsIGluaXQpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICAgIGxldCB3dyA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aDtcclxuXHJcbiAgICAgIGlmICh3dyA8IDk2MCkgcmV0dXJuO1xyXG5cclxuICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJHRhcmdldC5mYWRlSW4oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgJGJ0bi5hZGRDbGFzcygnZXQtYWN0aXZlJyk7IC8v0JrQntCh0KLQq9Cb0Kwg0L3QsNC00L4g0LTQvtCx0LDQstC40YLRjCDRjdGC0L7RgiDQutC70LDRgdGBINCyINGI0LDQsdC70L7QvdC1XHJcbiAgICAgICAgICAkYnRuLmpFbGVtZW50VG9nZ2xlcihvcHRpb25zKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSwgNDAwMCk7XHJcblxyXG4gICAgICAkKHdpbmRvdykub2ZmKCdzY3JvbGwnLCBpbml0KTtcclxuICAgIH1cclxuICB9KSgpO1xyXG5cclxuICAvKnNlYXJjaCB0b2dnbGVyKi9cclxuICAoZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0ICRzZWFyY2hUb2dnbGVyID0gJCgnLmpzX19zZWFyY2gtZXQtdG9nZ2xlcicpO1xyXG4gICAgbGV0IG9wdGlvbnMgPSB7XHJcbiAgICAgIGFuaW1hdGlvbkR1cmF0aW9uOiAyMDBcclxuICAgIH07XHJcbiAgICBsZXQgcmVzcG9uc2l2ZVN3aXRjaGVyID0gY3JlYXRlUmVzcG9uc2l2ZVN3aXRjaCgkc2VhcmNoVG9nZ2xlcik7XHJcblxyXG4gICAgJHNlYXJjaFRvZ2dsZXIuakVsZW1lbnRUb2dnbGVyKG9wdGlvbnMpO1xyXG4gICAgcmVzcG9uc2l2ZVN3aXRjaGVyKCk7XHJcbiAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIHJlc3BvbnNpdmVTd2l0Y2hlcik7XHJcblxyXG4gICAgZnVuY3Rpb24gY3JlYXRlUmVzcG9uc2l2ZVN3aXRjaCgkdG9nZ2xlcikge1xyXG4gICAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICAgIGxldCB3V2lkdGggPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGg7XHJcblxyXG4gICAgICAgIGlmICh3V2lkdGggPCA5NjApIHtcclxuICAgICAgICAgICR0b2dnbGVyLnRyaWdnZXIoJ2pFbGVtZW50VG9nZ2xlcjpzdGFydCcpO1xyXG4gICAgICAgICAgJHNlYXJjaFRvZ2dsZXIudHJpZ2dlcignakVsZW1lbnRUb2dnbGVyOmNsb3NlJyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICR0b2dnbGVyLnRyaWdnZXIoJ2pFbGVtZW50VG9nZ2xlcjpvcGVuJyk7XHJcbiAgICAgICAgICAkdG9nZ2xlci50cmlnZ2VyKCdqRWxlbWVudFRvZ2dsZXI6c3RvcCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pKCk7XHJcblxyXG4gIC8qb25saW5lIHN1cHBvcnQgY2hhdCB0b2dnbGVyKi9cclxuIC8qIChmdW5jdGlvbiAoKSB7XHJcbiAgICBjb25zdCAkdG9nZ2xlckJ0biA9ICQoJy5qc19fZXQtc3VwcG9ydC1jaGF0Jyk7XHJcbiAgICBjb25zdCAkaGVhZGVyID0gJCgnLmpzX19ldC1zdXBwb3J0LWNoYXQtb3BlbicpO1xyXG4gICAgY29uc3QgJHBhcmVudCA9ICQoJy5qX2NybS1jaGF0Jyk7XHJcbiAgICBjb25zdCBvcHRpb25zID0ge1xyXG4gICAgICBvbkJlZm9yZU9wZW46ICgpID0+ICRwYXJlbnQuYWRkQ2xhc3MoJ29wZW5lZCcpLFxyXG4gICAgICBvbkFmdGVyT3BlbjogKCkgPT4gJGhlYWRlci5hZGRDbGFzcygnb3BlbmVkJyksXHJcbiAgICAgIG9uQWZ0ZXJDbG9zZTogKCkgPT4gJGhlYWRlci5hZGQoJHBhcmVudCkucmVtb3ZlQ2xhc3MoJ29wZW5lZCcpLFxyXG4gICAgICBhbmltYXRpb246ICdzbGlkZSdcclxuICAgIH07XHJcblxyXG4gICAgJHRvZ2dsZXJCdG4uakVsZW1lbnRUb2dnbGVyKG9wdGlvbnMpO1xyXG5cclxuICAgICRoZWFkZXIub24oJ2NsaWNrJywgZSA9PiB7XHJcbiAgICAgIGNvbnN0ICR0YXJnZXQgPSAkKGUudGFyZ2V0KTtcclxuXHJcbiAgICAgIGlmICgkdGFyZ2V0LmNsb3Nlc3QoJHRvZ2dsZXJCdG4pLmxlbmd0aCkgcmV0dXJuO1xyXG5cclxuICAgICAgJHRvZ2dsZXJCdG4udHJpZ2dlcignakVsZW1lbnRUb2dnbGVyOm9wZW4nKTtcclxuICAgIH0pO1xyXG4gIH0pKCk7Ki9cclxuXHJcbiAgLypibG9jay1mbGV4LXRoZW1lIHNob3cgdG9nZ2xlciovXHJcbiAgKGZ1bmN0aW9uICgpIHtcclxuICAgIGNvbnN0ICRidG4gPSAkKCcuZmxleF90aGVtZV9ibG9ja19zaG93Jyk7XHJcbiAgICBjb25zdCBvcHRpb25zID0ge1xyXG4gICAgICBhbmltYXRpb246ICdmYWRlJ1xyXG4gICAgfTtcclxuXHJcbiAgICAkYnRuLmpFbGVtZW50VG9nZ2xlcihvcHRpb25zKTtcclxuICB9KSgpO1xyXG5cclxuICAvKmxhenkgbG9hZGVyIGZpeGVzKi9cclxuICAoZnVuY3Rpb24gKCkge1xyXG4gICAgLypzdGlja3kgdGFibGVzIHNjcm9sbCB0cmlnZ2VyaW5nKi9cclxuICAgIChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGxldCAkc3RpY2t5VGFibGUgPSAkKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zdGlja3ktdGFibGUnKSk7XHJcblxyXG4gICAgICAkc3RpY2t5VGFibGUub24oJ3Njcm9sbCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkKHdpbmRvdykudHJpZ2dlcignc2Nyb2xsJyk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSkoKTtcclxuICB9KSgpO1xyXG5cclxuICAvKm1haW4gbWVudSBjaGFuZ2UgYmVoYXZpb3VyKi9cclxuICAoZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0ICRtZW51ID0gJCgnI21haW4tbWVudScpO1xyXG4gICAgbGV0ICRsaXN0ID0gJG1lbnUuZmluZCgnbGkuZ3JvdXAnKTtcclxuICAgIGxldCAkYW5jaG9yID0gJGxpc3QuY2hpbGRyZW4oJ2EnKTtcclxuICAgIGxldCBvcHRpb25zID0ge1xyXG4gICAgICBhbmltYXRpb246ICdzbGlkZScsXHJcbiAgICAgIGFuaW1hdGlvbkR1cmF0aW9uOiAxMDAsXHJcbiAgICAgIG91dGVyQ2xpY2s6IHRydWUsXHJcbiAgICAgIGNsYXNzTmFtZToge1xyXG4gICAgICAgIGFjdGl2ZTogJ2FjdGl2ZS1tZW51J1xyXG4gICAgICB9LFxyXG4gICAgICBnZXRUYXJnZXQ6IGZ1bmN0aW9uICgkYnRuKSB7XHJcbiAgICAgICAgcmV0dXJuICRidG4uY2hpbGRyZW4oJy5tZW51Jyk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgJGxpc3QuakVsZW1lbnRUb2dnbGVyKG9wdGlvbnMpO1xyXG4gICAgJGFuY2hvci5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICB9KTsgLy9kZXRhY2ggZGVmYXVsdCBiZWhhdmlvdXIgbGlua1xyXG4gICAgJGxpc3Qub2ZmKCdob3ZlcicpOyAvL2RldGFjaCBvcGVuIG9uIGhvdmVyXHJcbiAgfSkoKTtcclxuXHJcbiAgLypmYXN0IG9yZGVyIERJU0FCTEVEKi9cclxuICAoZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuO1xyXG4gICAgbGV0IGZhc3RvcmRlckJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idG5fX2Zhc3RvcmRlcicpO1xyXG5cclxuICAgIGlmICghZmFzdG9yZGVyQnRuKSByZXR1cm47XHJcblxyXG4gICAgbGV0IHF0eUlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2VkaXQtcXR5Jyk7XHJcbiAgICBsZXQgZm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mb3JtX19mYXN0LW9yZGVyJyk7XHJcblxyXG4gICAgaWYgKCFmb3JtKSByZXR1cm47XHJcblxyXG4gICAgbGV0IHRhcmdldFF0eUlucHV0ID0gZm9ybS5xdWVyeVNlbGVjdG9yKCdpbnB1dFtuYW1lPVwic3VibWl0dGVkW3F0eV1cIl0nKTtcclxuXHJcbiAgICBmYXN0b3JkZXJCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICB0YXJnZXRRdHlJbnB1dC52YWx1ZSA9IHF0eUlucHV0LnZhbHVlO1xyXG4gICAgICByZW5kZXJGb3JtSGVhZChmb3JtKTtcclxuXHJcbiAgICAgIC8vJC5qQm94LmNsZWFuKCk7XHJcbiAgICAgIC8vJC5qQm94Lmpib3hodG1sKGZvcm0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZnVuY3Rpb24gcmVuZGVyRm9ybUhlYWQoZm9ybSkge1xyXG4gICAgICBsZXQgdGFyZ2V0UXR5SW5wdXQgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W25hbWU9XCJzdWJtaXR0ZWRbcXR5XVwiXScpO1xyXG4gICAgICBsZXQgdGFyZ2V0UHJpY2VFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5pbmZvLWJsb2NrIC5wcmljZXMgLmN1cnJlbnQnKTtcclxuICAgICAgbGV0IHRpdGxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2UtdGl0bGUnKTsgLy8gZm9ybS5xdWVyeVNlbGVjdG9yKCdpbnB1dFtuYW1lPVwic3VibWl0dGVkW3RpdGxlXVwiXScpIHx8IDtcclxuICAgICAgbGV0IGNvbnRlbnQgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoJy5jb250ZW50Jyk7XHJcbiAgICAgIGxldCBleGlzdGVkSGVhZCA9IGZvcm0ucXVlcnlTZWxlY3RvcignLmZvcm0taGVhZCcpO1xyXG5cclxuICAgICAgbGV0IHF0eSA9IHBhcnNlSW50KHRhcmdldFF0eUlucHV0LnZhbHVlKTtcclxuICAgICAgbGV0IHByaWNlID0gcGFyc2VGbG9hdCh0YXJnZXRQcmljZUVsLnRleHRDb250ZW50LnJlcGxhY2UoL1xccy9nLCBcIlwiKSk7XHJcbiAgICAgIGxldCB0b3RhbFByaWNlID0gcGFyc2VQcmljZShwcmljZSAqIHF0eSk7XHJcblxyXG5cclxuICAgICAgbGV0IG5ld0hlYWQgPVxyXG4gICAgICAgICc8ZGl2IGNsYXNzPVwiZm9ybS1oZWFkXCI+JyArXHJcbiAgICAgICAgJzxkaXY+JyArXHJcbiAgICAgICAgJzxzcGFuIGNsYXNzPVwicXR5XCI+JyArIHF0eSArICc8L3NwYW4+JyArXHJcbiAgICAgICAgJyB4ICcgK1xyXG4gICAgICAgICc8c3BhbiBjbGFzcz1cInRpdGxlXCI+JyArIHRpdGxlLnRleHRDb250ZW50ICsgJzwvc3Bhbj4nICtcclxuICAgICAgICAnPC9kaXY+JyArXHJcbiAgICAgICAgJzxkaXYgY2xhc3M9XCJ0b3RhbC1hbW91bnRcIj4nICtcclxuICAgICAgICAn0KHRg9C80LzQsDogJyArXHJcbiAgICAgICAgJzxzcGFuIGNsYXNzPVwiYW1vdW50IGljb24gaWMtcnViXCI+JyArIHRvdGFsUHJpY2UgKyAnPC9zcGFuPicgK1xyXG4gICAgICAgICc8L2Rpdj4nICtcclxuICAgICAgICAnPC9kaXY+JztcclxuXHJcbiAgICAgIGlmIChleGlzdGVkSGVhZCkge1xyXG4gICAgICAgICQoZXhpc3RlZEhlYWQpLnJlcGxhY2VXaXRoKG5ld0hlYWQpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICQoY29udGVudCkucHJlcGVuZChuZXdIZWFkKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHBhcnNlUHJpY2UocHJpY2UpIHtcclxuICAgICAgbGV0IHByZWNpc2VQcmljZSA9IE1hdGgucm91bmQocHJpY2UgKiAxMDApIC8gMTAwO1xyXG4gICAgICBsZXQgcHJpY2VTdHIgPSBwcmVjaXNlUHJpY2UgKyAnJztcclxuICAgICAgbGV0IGJlZm9yZURvdCA9IE1hdGguZmxvb3IocHJlY2lzZVByaWNlKTtcclxuICAgICAgbGV0IGJlZm9yZURvdFN0ciA9IGJlZm9yZURvdCArICcnO1xyXG4gICAgICBsZXQgYWZ0ZXJEb3RTdHIgPSBwcmljZVN0ci5pbmRleE9mKCcuJykgPyBwcmljZVN0ci5zbGljZShwcmljZVN0ci5pbmRleE9mKCcuJykpIDogJyc7XHJcbiAgICAgIGxldCByZXN1bHRBcnIgPSBiZWZvcmVEb3RTdHIuc3BsaXQoJycpO1xyXG4gICAgICBsZXQgcmVzdWx0U3RyID0gJyc7XHJcblxyXG4gICAgICBmb3IgKGxldCBpID0gYmVmb3JlRG90U3RyLmxlbmd0aCAtIDEsIGogPSAxOyBpID49IDA7IGktLSwgaisrKSB7XHJcbiAgICAgICAgbGV0IGlzVGhpcmQgPSAhKGogJSAzKSAmJiBqO1xyXG5cclxuICAgICAgICBpZiAoIWlzVGhpcmQpIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICByZXN1bHRBcnIuc3BsaWNlKGksIDAsICcgJyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJlc3VsdFN0ciA9IHJlc3VsdEFyci5qb2luKCcnKTtcclxuXHJcbiAgICAgIGlmIChwcmljZSA+IGJlZm9yZURvdCkge1xyXG4gICAgICAgIHJlc3VsdFN0ciArPSBhZnRlckRvdFN0cjtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHJlc3VsdFN0cjtcclxuICAgIH1cclxuICB9KSgpO1xyXG5cclxuICAvKmRpc3BsYXkgbW9kZSBwYXRjaCovXHJcbiAgKGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCAkZE1vZGUgPSAkKCdib2R5LmRpc3BsYXltb2RlJyk7XHJcbiAgICBsZXQgaXNBdHRhY2hlZEhhbmRsZXIgPSBmYWxzZTtcclxuXHJcbiAgICBpZiAoISRkTW9kZS5sZW5ndGgpIHJldHVybjtcclxuXHJcbiAgICBzZXREaXNwbGF5TW9kZSgpO1xyXG4gICAgJChkb2N1bWVudCkub24oJ2luZmluaXRlU2Nyb2xsQ29tcGxldGUnLCBzZXREaXNwbGF5TW9kZSk7XHJcblxyXG4gICAgLyogU0VUIE1PREUuIFNldCB2aWV3IG1vZGUgc3dpdGNoZXIuICovXHJcbiAgICBmdW5jdGlvbiBzZXREaXNwbGF5TW9kZSgpIHtcclxuICAgICAgbGV0ICRkTW9kZSA9ICQoJ2JvZHkuZGlzcGxheW1vZGUnKTtcclxuICAgICAgLy8gU2V0IG1vZGUgYWZ0ZXIgbG9hZGVkIHBhZ2VcclxuICAgICAgbGV0IGhhc2ggPSBkb2N1bWVudC5sb2NhdGlvbi5oYXNoO1xyXG5cclxuICAgICAgaWYgKGhhc2gpIHtcclxuICAgICAgICBoYXNoID0gaGFzaC5yZXBsYWNlKCcjJywgJycpO1xyXG4gICAgICAgIGlmICghJGRNb2RlLmhhc0NsYXNzKGhhc2gpKSB7XHJcbiAgICAgICAgICBzd2l0Y2ggKGhhc2gpIHtcclxuICAgICAgICAgICAgY2FzZSAnZ3JpZCc6XHJcbiAgICAgICAgICAgICAgc2V0TW9kZSgnZ3JpZCcpO1xyXG4gICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdsaW5lYXInOlxyXG4gICAgICAgICAgICAgIHNldE1vZGUoJ2xpbmVhcicpO1xyXG4gICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIGhhc2ggPT0gJ2xpbmVhcicgPyBzZXRNb2RlKCdsaW5lYXInLCB0cnVlKSA6ICcnO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICAkZE1vZGUuaGFzQ2xhc3MoJ2xpbmVhcicpID8gc2V0TW9kZSgnbGluZWFyJywgdHJ1ZSkgOiAnJztcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gRXZlbnQgY2xpY2sgb24gbGluayBNT0RFXHJcbiAgICAgIGlmICghaXNBdHRhY2hlZEhhbmRsZXIpIHtcclxuICAgICAgICAkZE1vZGUub24oJ2NsaWNrJywgJyNkaXNwbGF5LXN3aXRjaCBhJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgc2V0TW9kZShqUXVlcnkodGhpcykuYXR0cignaHJlZicpLnJlcGxhY2UoJyMnLCAnJykpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGlzQXR0YWNoZWRIYW5kbGVyID0gdHJ1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gc2V0TW9kZShtb2RlLCBvbmx5TGluaykge1xyXG4gICAgICAgICQoJyNkaXNwbGF5LXN3aXRjaCBhLicgKyBtb2RlKVxyXG4gICAgICAgICAgLmFkZENsYXNzKCdhY3RpdmUnKVxyXG4gICAgICAgICAgLnNpYmxpbmdzKClcclxuICAgICAgICAgIC5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgaWYgKCFvbmx5TGluaykge1xyXG4gICAgICAgICAgJGRNb2RlXHJcbiAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnZ3JpZCBsaW5lYXInKVxyXG4gICAgICAgICAgICAuYWRkQ2xhc3MobW9kZSk7XHJcbiAgICAgICAgICAkLmNvb2tpZSgnZGlzcGxheW1vZGUnLCBtb2RlLCB7ZXhwaXJlczogMzB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KSgpO1xyXG5cclxuICAvKnJhbmdlIGJhciovXHJcbiAgKGZ1bmN0aW9uICgpIHtcclxuICAgIC8qbGVmdCBiYXIqL1xyXG4gICAgKGZ1bmN0aW9uICgpIHtcclxuICAgICAgbGV0ICRwYXJlbnQgPSAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlZGl0LW1mYi1maWx0ZXItcHJpY2Utc2VsbC1wcmljZS13cmFwcGVyJykpO1xyXG5cclxuICAgICAgaWYgKCEkcGFyZW50Lmxlbmd0aCkgcmV0dXJuO1xyXG5cclxuICAgICAgbGV0ICRtaW4gPSAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlZGl0LW1mYi1maWx0ZXItcHJpY2Utc2VsbC1wcmljZS1taW4nKSkudmFsKDApO1xyXG4gICAgICBsZXQgJG1heCA9ICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2VkaXQtbWZiLWZpbHRlci1wcmljZS1zZWxsLXByaWNlLW1heCcpKS52YWwoMjAwMDAwKTtcclxuICAgICAgbGV0ICRzdWJtaXQgPSAkKCcudmlld3MtZXhwb3NlZC13aWRnZXQudmlld3Mtc3VibWl0LWJ1dHRvbicsIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2aWV3cy1leHBvc2VkLWZvcm0tdGF4b25vbXktdGVybS1wYWdlLWNhdGVnb3J5LW1mYi1maWx0ZXItcHJpY2UnKSk7XHJcbiAgICAgIGxldCBvcHRpb25zID0ge1xyXG4gICAgICAgIG1pbjogJG1pbixcclxuICAgICAgICBtYXg6ICRtYXgsXHJcbiAgICAgICAgcmFuZ2VzOiBbXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHBpeGVsUmFuZ2U6ICc1MCUnLFxyXG4gICAgICAgICAgICB1bml0UmFuZ2U6ICcxMCUnXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBwaXhlbFJhbmdlOiAnODAlJyxcclxuICAgICAgICAgICAgdW5pdFJhbmdlOiAnMzAlJ1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIF1cclxuICAgICAgfTtcclxuXHJcbiAgICAgICRwYXJlbnQualJhbmdlQmFyKG9wdGlvbnMpO1xyXG5cclxuICAgICAgc3VibWl0QnRuTG9naWMoKTtcclxuXHJcbiAgICAgIGZ1bmN0aW9uIHN1Ym1pdEJ0bkxvZ2ljKCkge1xyXG4gICAgICAgICRzdWJtaXQuaGlkZSgpO1xyXG5cclxuICAgICAgICAkbWluLm9uKCdpbnB1dCBqUmFuZ2VCYXI6Y2hhbmdlJywgYnRGbik7XHJcbiAgICAgICAgJG1heC5vbignaW5wdXQgalJhbmdlQmFyOmNoYW5nZScsIGJ0Rm4pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiBidEZuKCkge1xyXG4gICAgICAgIGlmICgkbWF4LnZhbCgpID4gMCB8fCAkbWluLnZhbCgpID4gMCkge1xyXG4gICAgICAgICAgLy9tb2RpZnlTdWJtaXRVcmwoKTtcclxuICAgICAgICAgICRzdWJtaXRcclxuICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdoaWRkZW4nKVxyXG4gICAgICAgICAgICAuc2hvdygpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAkc3VibWl0LmhpZGUoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8qZnVuY3Rpb24gbW9kaWZ5U3VibWl0VXJsKCkge1xyXG4gICAgICAgbGV0IHVybCA9IHJlbmRlclVybCgkbWluLnZhbCgpLCAkbWF4LnZhbCgpKTtcclxuXHJcbiAgICAgICAkc3VibWl0LmF0dHIoJ2hyZWYnLCB1cmwpO1xyXG4gICAgICAgfSovXHJcblxyXG4gICAgICAvKmZ1bmN0aW9uIHJlbmRlclVybChtaW4sIG1heCkge1xyXG4gICAgICAgcmV0dXJuICdodHRwOi8vaGFtbGV5cy5ydS9zaG9wL2NhdGFsb2cva29uc3RydWt0b3J5L2tvbnN0cnVrdG9yeS1sZWdvP21lZmlicy1mb3JtLWZpbHRlci1wcmljZS1zZWxsX3ByaWNlJTVCbWluJTVEPScgK1xyXG4gICAgICAgbWluICtcclxuICAgICAgICcmbWVmaWJzLWZvcm0tZmlsdGVyLXByaWNlLXNlbGxfcHJpY2UlNUJtYXglNUQ9JyArXHJcbiAgICAgICBtYXggK1xyXG4gICAgICAgJyZtZWZpYnMtZm9ybS1maWx0ZXItcHJpY2UtbWVmaWJzX2Jsb2NrX2lkPWZpbHRlcl9wcmljZSc7XHJcbiAgICAgICB9Ki9cclxuICAgIH0pKCk7XHJcblxyXG4gICAgLypyZWZyZXNoIGpSYW5nZUJhciBpbiBqYm94Ki9cclxuICAgIChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIC8qaW4gamJveCovXHJcbiAgICAgIGxldCBob2xkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnamJveC1ob2xkZXInKTtcclxuXHJcbiAgICAgIGlmICghaG9sZGVyKSByZXR1cm47XHJcblxyXG4gICAgICBsZXQgJGhvbGRlciA9ICQoaG9sZGVyKTtcclxuXHJcbiAgICAgICRob2xkZXIub24oJ2pCb3g6YWZ0ZXJPcGVuJywgcmVmcmVzaFJhbmdlQmFyKTtcclxuXHJcbiAgICAgIGZ1bmN0aW9uIHJlZnJlc2hSYW5nZUJhcigpIHtcclxuICAgICAgICBsZXQgJHJhbmdlQmFyID0gJCh0aGlzKS5maW5kKCcuanJhbmdlYmFyLXdyYXBwZXInKTtcclxuXHJcbiAgICAgICAgJHJhbmdlQmFyLnRyaWdnZXIoJ2pSYW5nZUJhcjpyZWZyZXNoJyk7XHJcbiAgICAgIH1cclxuICAgIH0pKCk7XHJcblxyXG4gICAgLypoaWRlIGpib3ggYWZ0ZXIgcmFuZ2ViYXIgc3VibWl0Ki9cclxuICAgIChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGxldCAkc3VibWl0ID0gJCgnLnZpZXdzLWV4cG9zZWQtd2lkZ2V0LnZpZXdzLXN1Ym1pdC1idXR0b24gLmZvcm0tc3VibWl0JywgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZpZXdzLWV4cG9zZWQtZm9ybS10YXhvbm9teS10ZXJtLXBhZ2UtY2F0ZWdvcnktbWZiLWZpbHRlci1wcmljZScpKTtcclxuXHJcbiAgICAgIGlmICghJHN1Ym1pdC5sZW5ndGgpIHJldHVybjtcclxuXHJcbiAgICAgICRzdWJtaXQub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICBsZXQgamJveEhvbGRlciA9IHRoaXMuY2xvc2VzdCgnI2pib3gtaG9sZGVyJyk7XHJcblxyXG4gICAgICAgIGlmICghamJveEhvbGRlcikgcmV0dXJuO1xyXG5cclxuICAgICAgICAkLmpCb3guaGlkZUJsb2NrKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSkoKTtcclxuICB9KSgpO1xyXG5cclxuICAvKmhpZGUgamJveCBvbiBjbGljayovXHJcbiAgKGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCAkY2xvc2VCdG4gPSAkKCcuanNfX2pib3gtY2xvc2UnKTtcclxuXHJcbiAgICAkY2xvc2VCdG4ub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgJC5qQm94LmNsb3NlKCk7XHJcbiAgICB9KTtcclxuICB9KSgpO1xyXG5cclxuICAvKmNvb2tpZXMgY29uZmlybSBidXR0b24qL1xyXG4gIChmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgY29uZmlybU5hbWUgPSAnY29va2llc0NvbmZpcm1lZCc7XHJcbiAgICBsZXQgaXNDb25maXJtZWQgPSAkLmNvb2tpZShjb25maXJtTmFtZSk7XHJcblxyXG5cclxuICAgIC8qZGVidWdnZXIqL1xyXG4gICAgd2luZG93LmRlbGV0ZUNvb2tpZUNvbmZpcm0gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGxldCBvcHRpb25zID0ge1xyXG4gICAgICAgIGV4cGlyZXM6IDM2NSxcclxuICAgICAgICBwYXRoOiAnLydcclxuICAgICAgfTtcclxuXHJcbiAgICAgICQucmVtb3ZlQ29va2llKGNvbmZpcm1OYW1lLCBvcHRpb25zKTtcclxuICAgIH07XHJcblxyXG4gICAgaWYgKGlzQ29uZmlybWVkKSByZXR1cm47XHJcblxyXG4gICAgbGV0ICRjb29raWVzQmxvY2sgPSAkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb29raWUnKSk7Ly9yZW5kZXJDb29raWVzQ29uZmlybSgpO1xyXG4gICAgbGV0ICRjb25maXJtQnRuID0gJGNvb2tpZXNCbG9jay5maW5kKCcuYnRuX2NvbmZpcm0nKTtcclxuICAgIGxldCAkcGFyZW50QmxvY2sgPSAkKCcuZnVsbGRhdGEnKTtcclxuXHJcblxyXG4gICAgJHBhcmVudEJsb2NrXHJcbiAgICAgIC5wcmVwZW5kKCRjb29raWVzQmxvY2spXHJcbiAgICAgIC5jc3Moe1xyXG4gICAgICAgIG1hcmdpblRvcDogJGNvb2tpZXNCbG9jay5vdXRlckhlaWdodCgpICsgJ3B4J1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAkY29uZmlybUJ0bi5vbignY2xpY2snLCBjb25maXJtSGFuZGxlcik7XHJcblxyXG4gICAgZnVuY3Rpb24gcmVuZGVyQ29va2llc0NvbmZpcm0oKSB7XHJcbiAgICAgIGxldCB0cGwgPVxyXG4gICAgICAgICc8ZGl2IGlkPVwiY29va2llXCIgY2xhc3M9XCJjb29raWVcIj4nICtcclxuICAgICAgICAnPGRpdiBjbGFzcz1cImhvbGQgcGFkLWhcIj4nICtcclxuICAgICAgICAnPGRpdiBjbGFzcz1cInJvdyBzcC0xMFwiPicgK1xyXG4gICAgICAgICc8ZGl2IGNsYXNzPVwiY29sIGQ3XCI+JyArXHJcbiAgICAgICAgJzxkaXYgY2xhc3M9XCJ0ZXh0XCI+0JTQu9GPINC90LDQuNC70YPRh9GI0LXQuSDRgNCw0LHQvtGC0Ysg0YHQsNC50YLQsCDQuNGB0L/QvtC70YzQt9GD0Y7RgtGB0Y8gY29va2llcy4gJyArXHJcbiAgICAgICAgJzxhIGhyZWY9XCIjXCI+0J/QvtC00YDQvtCx0L3QtdC1INC+IGNvb2tpZXMuPC9hPicgK1xyXG4gICAgICAgICc8L2Rpdj4nICtcclxuICAgICAgICAnPC9kaXY+JyArXHJcbiAgICAgICAgJzxkaXYgY2xhc3M9XCJjb2wgZDVcIj4nICtcclxuICAgICAgICAnPGEgaHJlZj1cIiNcIiBjbGFzcz1cImJ0bl9jb25maXJtIGJ0biBzbWFsbCBzaW1wbGUgaWNvbiBpY29uLXVuaUU2NUFcIj7Qn9C+0LTRgtCy0LXRgNC00LjRgtGMINC40YHQv9C+0LvRjNC30L7QstCw0L3QuNC1IGNvb2tpZXM8L2E+JyArXHJcbiAgICAgICAgJzwvZGl2PicgK1xyXG4gICAgICAgICc8L2Rpdj4nICtcclxuICAgICAgICAnPC9kaXY+JyArXHJcbiAgICAgICAgJzwvZGl2Pic7XHJcblxyXG4gICAgICByZXR1cm4gJCh0cGwpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNvbmZpcm1IYW5kbGVyKGUpIHtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgbGV0IHZhbCA9IHRydWU7XHJcbiAgICAgIGxldCBvcHRpb25zID0ge1xyXG4gICAgICAgIGV4cGlyZXM6IDM2NSxcclxuICAgICAgICBwYXRoOiAnLydcclxuICAgICAgfTtcclxuXHJcbiAgICAgICRwYXJlbnRCbG9ja1xyXG4gICAgICAgIC5hbmltYXRlKHtcclxuICAgICAgICAgIG1hcmdpblRvcDogMFxyXG4gICAgICAgIH0sIDQwMCk7XHJcblxyXG4gICAgICAkY29va2llc0Jsb2NrLnNsaWRlVXAoNDAwLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJGNvb2tpZXNCbG9jay5yZW1vdmUoKTtcclxuICAgICAgfSk7XHJcbiAgICAgICQuY29va2llKGNvbmZpcm1OYW1lLCB2YWwsIG9wdGlvbnMpO1xyXG4gICAgfVxyXG4gIH0pKCk7XHJcblxyXG4gIC8qZ29vZHMgY291bnQgbW9vdmluZyovXHJcbiAgKGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCB0b3RhbFJvd3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudG90YWwtcm93cycpO1xyXG5cclxuICAgIGlmICghdG90YWxSb3dzKSByZXR1cm47XHJcblxyXG4gICAgbGV0IGdvb2RzQ291bnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGFnZS10aXRsZSAuZ29vZHMtY291bnQnKTtcclxuXHJcbiAgICBpZiAoIWdvb2RzQ291bnQpIHJldHVybjtcclxuXHJcbiAgICBnb29kc0NvdW50LnRleHRDb250ZW50ID0gJygnICsgdG90YWxSb3dzLnRleHRDb250ZW50ICsgJyknO1xyXG4gIH0pKCk7XHJcblxyXG4gIC8qcHJvZHVjdCByZXZpZXdzKi9cclxuICAoZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0ICRyZXZpZXdzQnRuID0gJCgnLnByb2R1Y3QgLnJldmlld3MgYScpO1xyXG5cclxuICAgICRyZXZpZXdzQnRuLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgIC8vZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgbGV0IGlkID0gdGhpcy5nZXRBdHRyaWJ1dGUoJ2hyZWYnKS5yZXBsYWNlKC8jL2csICcnKTtcclxuICAgICAgbGV0ICRjb21tZW50VGFiID0gJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkpO1xyXG5cclxuICAgICAgJGNvbW1lbnRUYWIudHJpZ2dlcignakVsZW1lbnRUb2dnbGVyOm9wZW4nKTtcclxuICAgIH0pO1xyXG4gIH0pKCk7XHJcblxyXG4gIC8qc21vb3RoIHNjcm9sbCovXHJcbiAgKGZ1bmN0aW9uICgpIHtcclxuICAgIC8qU2Nyb2xsVG9BbmNob3IgY2xhc3MqL1xyXG4gICAgZnVuY3Rpb24gU2Nyb2xsVG9BbmNob3Iob3B0aW9ucykge1xyXG4gICAgICB0aGlzLl9saXN0ZW5lZEJsb2NrID0gb3B0aW9ucy5saXN0ZW5lZEJsb2NrIHx8IGRvY3VtZW50LmJvZHk7XHJcbiAgICAgIHRoaXMuX3RyYW5zbGF0aW9uRWxlbWVudFNlbGVjdG9yID0gb3B0aW9ucy50cmFuc2xhdGlvbiB8fCBmYWxzZTtcclxuICAgICAgdGhpcy5fYW5pbWF0aW9uU3BlZWQgPSBvcHRpb25zLmFuaW1hdGlvblNwZWVkIHx8IDUwMDtcclxuICAgIH1cclxuXHJcbiAgICBTY3JvbGxUb0FuY2hvci5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgJCh0aGlzLl9saXN0ZW5lZEJsb2NrKS5vbignY2xpY2snLCB0aGlzLmFuY2hvckNsaWNrTGlzdGVuZXIuYmluZCh0aGlzKSk7XHJcbiAgICB9O1xyXG4gICAgU2Nyb2xsVG9BbmNob3IucHJvdG90eXBlLmFuY2hvckNsaWNrTGlzdGVuZXIgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICBsZXQgZWxlbSA9IGUudGFyZ2V0O1xyXG4gICAgICBsZXQgYW5jaG9yID0gZWxlbS5jbG9zZXN0KCdhW2hyZWYqPVwiI1wiXTpub3QoW2RhdGEtc2Nyb2xsPVwiZGlzYWJsZVwiXSk6bm90KC5qc19fc2Nyb2xsLWRpc2FibGUpOm5vdCguamJveCknKTtcclxuXHJcbiAgICAgIGlmICghYW5jaG9yKSByZXR1cm47XHJcblxyXG4gICAgICBsZXQgYW5jaG9yV2l0aEhhc2ggPSBhbmNob3IuY2xvc2VzdCgnYVtocmVmXj1cIiNcIl0nKTtcclxuICAgICAgbGV0IHdpbmRvd1BhdGggPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luICsgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lO1xyXG4gICAgICBsZXQgYW5jaG9yUGF0aCA9IGFuY2hvci5ocmVmLnNsaWNlKDAsIGFuY2hvci5ocmVmLmluZGV4T2YoJyMnKSk7XHJcblxyXG4gICAgICBpZiAod2luZG93UGF0aCA9PT0gYW5jaG9yUGF0aCkge1xyXG4gICAgICAgIGFuY2hvcldpdGhIYXNoID0gYW5jaG9yO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoIWFuY2hvcldpdGhIYXNoIHx8IGFuY2hvcldpdGhIYXNoLmhhc2gubGVuZ3RoIDwgMikgcmV0dXJuO1xyXG5cclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgbGV0IHRhcmdldCA9IGFuY2hvcldpdGhIYXNoLmhhc2g7XHJcbiAgICAgIGxldCB0cmFuc2xhdGlvbiA9IHRoaXMuZ2V0VHJhbnNsYXRpb24oYW5jaG9yV2l0aEhhc2gpO1xyXG5cclxuICAgICAgaWYgKCFkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCkpIHJldHVybjtcclxuXHJcbiAgICAgIHRoaXMuc21vb3RoU2Nyb2xsKHRhcmdldCwgdHJhbnNsYXRpb24pO1xyXG4gICAgfTtcclxuICAgIFNjcm9sbFRvQW5jaG9yLnByb3RvdHlwZS5nZXRUcmFuc2xhdGlvbiA9IGZ1bmN0aW9uIChhbmNob3IpIHtcclxuICAgICAgbGV0IHRyYW5zbGF0aW9uID0gMDtcclxuXHJcbiAgICAgIGlmIChhbmNob3IuaGFzQXR0cmlidXRlKCdkYXRhLXRyYW5zbGF0aW9uJykpIHtcclxuICAgICAgICB0cmFuc2xhdGlvbiA9IGFuY2hvci5nZXRBdHRyaWJ1dGUoJ2RhdGEtdHJhbnNsYXRpb24nKTtcclxuICAgICAgfSBlbHNlIGlmICh0aGlzLl90cmFuc2xhdGlvbkVsZW1lbnRTZWxlY3Rvcikge1xyXG4gICAgICAgICQodGhpcy5fdHJhbnNsYXRpb25FbGVtZW50U2VsZWN0b3IpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgdHJhbnNsYXRpb24gKz0gdGhpcy5vZmZzZXRIZWlnaHQ7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgLy90cmFuc2xhdGlvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGhpcy5fdHJhbnNsYXRpb25FbGVtZW50U2VsZWN0b3IpLm9mZnNldEhlaWdodDtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHRyYW5zbGF0aW9uO1xyXG4gICAgfTtcclxuICAgIFNjcm9sbFRvQW5jaG9yLnByb3RvdHlwZS5zbW9vdGhTY3JvbGwgPSBmdW5jdGlvbiAoc2VsZWN0b3IsIHRyYW5zbGF0aW9uKSB7XHJcbiAgICAgICQoXCJodG1sLCBib2R5XCIpLmFuaW1hdGUoe1xyXG4gICAgICAgICAgc2Nyb2xsVG9wOiAkKHNlbGVjdG9yKS5vZmZzZXQoKS50b3AgLSAodHJhbnNsYXRpb24gfHwgMClcclxuICAgICAgICB9LFxyXG4gICAgICAgIHRoaXMuX2FuaW1hdGlvblNwZWVkXHJcbiAgICAgICk7XHJcbiAgICB9O1xyXG5cclxuICAgIGxldCBwYWdlU2Nyb2xsID0gbmV3IFNjcm9sbFRvQW5jaG9yKHtcclxuICAgICAgdHJhbnNsYXRpb246ICcjbWFpbi1tZW51J1xyXG4gICAgfSk7XHJcbiAgICBwYWdlU2Nyb2xsLmluaXQoKTtcclxuICB9KSgpO1xyXG5cclxuICAvKnN1Ym1pdCBzb3VyY2UqL1xyXG4gIChmdW5jdGlvbiAoKSB7XHJcbiAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHNldFNvdXJjZUZyb21BbmNob3JIYW5kbGVyKTtcclxuICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHNldFNvdXJjZUZyb21BbmNob3JIYW5kbGVyKTtcclxuICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgc2V0U291cmNlRnJvbUZvcm1IYW5kbGVyKTtcclxuICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHNldFNvdXJjZUZyb21Gb3JtSGFuZGxlcik7XHJcblxyXG4gICAgZnVuY3Rpb24gc2V0U291cmNlRnJvbUFuY2hvckhhbmRsZXIoZSkge1xyXG4gICAgICBsZXQgdGFyZ2V0ID0gZS50YXJnZXQ7XHJcbiAgICAgIGxldCBzb3VyY2VCdG4gPSB0YXJnZXQuY2xvc2VzdCgnW2RhdGEtc3VibWl0LXRhcmdldF0nKTtcclxuXHJcbiAgICAgIGlmICghc291cmNlQnRuKSByZXR1cm47XHJcblxyXG4gICAgICBsZXQgc291cmNlRGF0YSA9IHNvdXJjZUJ0bi5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3VibWl0LXNvdXJjZScpIHx8IHNvdXJjZUJ0bi50ZXh0Q29udGVudDtcclxuICAgICAgbGV0IHNlbGVjdG9yID0gc291cmNlQnRuLmdldEF0dHJpYnV0ZSgnaHJlZicpICsgJyAnICsgc291cmNlQnRuLmdldEF0dHJpYnV0ZSgnZGF0YS1zdWJtaXQtdGFyZ2V0Jyk7XHJcbiAgICAgIGxldCBzb3VyY2VJbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xyXG5cclxuICAgICAgaWYgKCFzb3VyY2VJbnB1dCkgcmV0dXJuO1xyXG5cclxuICAgICAgc291cmNlSW5wdXQuc2V0QXR0cmlidXRlKCd2YWx1ZScsIHNvdXJjZURhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHNldFNvdXJjZUZyb21Gb3JtSGFuZGxlcihlKSB7XHJcbiAgICAgIGxldCB0YXJnZXQgPSBlLnRhcmdldDtcclxuICAgICAgbGV0IHN1Ym1pdEJ0biA9IHRhcmdldC5jbG9zZXN0KCdpbnB1dFt0eXBlPVwic3VibWl0XCJdJyk7XHJcblxyXG4gICAgICBpZiAoIXN1Ym1pdEJ0bikgcmV0dXJuO1xyXG5cclxuICAgICAgbGV0IHNvdXJjZURhdGFFbCA9IHN1Ym1pdEJ0bi5jbG9zZXN0KCdbZGF0YS13ZWJmb3JtLXNvdXJjZV0nKTtcclxuXHJcbiAgICAgIGlmICghc291cmNlRGF0YUVsKSByZXR1cm47XHJcblxyXG4gICAgICBsZXQgc291cmNlRGF0YSA9IHNvdXJjZURhdGFFbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtd2ViZm9ybS1zb3VyY2UnKTtcclxuICAgICAgbGV0IHNvdXJjZUlucHV0ID0gc3VibWl0QnRuLmNsb3Nlc3QoJ2Zvcm0nKS5xdWVyeVNlbGVjdG9yKHNvdXJjZURhdGFFbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtd2ViZm9ybS10YXJnZXQnKSk7XHJcblxyXG4gICAgICBpZiAoIXNvdXJjZUlucHV0IHx8IHNvdXJjZUlucHV0LmdldEF0dHJpYnV0ZSgndmFsdWUnKSkgcmV0dXJuO1xyXG5cclxuICAgICAgc291cmNlSW5wdXQuc2V0QXR0cmlidXRlKCd2YWx1ZScsIHNvdXJjZURhdGEpO1xyXG4gICAgfVxyXG4gIH0pKCk7XHJcblxyXG4gIC8qc2hvdyBzdWJzY3JpYmUqL1xyXG4gIChmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgJHBvcFVwU2ltcGxlTmV3cyA9ICQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5ld3NibG9jaycpKTtcclxuXHJcbiAgICBpZiAoISRwb3BVcFNpbXBsZU5ld3MubGVuZ3RoKSByZXR1cm47XHJcbiAgICBpZiAoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoIDwgOTYwKSByZXR1cm47XHJcblxyXG4gICAgbGV0ICRzdWJzY3JpYmUgPSAkcG9wVXBTaW1wbGVOZXdzLmZpbmQoJy5zaW1wbGVuZXdzLXN1YnNjcmliZScpO1xyXG4gICAgbGV0ICRzdWJzY3JpYmVEaXNhYmxlID0gJHBvcFVwU2ltcGxlTmV3cy5maW5kKCcuc3Vic2NyaWJlZCcpO1xyXG4gICAgbGV0IHNob3dQb3BVcEZ1bmMgPSBzaG93UG9wVXBEZWMoKTtcclxuXHJcblxyXG4gICAgbGV0IHVzZXJPcHQgPSB7XHJcbiAgICAgIHN0YXR1czogJ2Fub25pbScsXHJcbiAgICAgIGRhdGU6IG5ldyBEYXRlKCksXHJcbiAgICAgIGxhc3RTaG93bjogbmV3IERhdGUoKSxcclxuICAgICAgc2hvd0VhY2g6IDMsXHJcbiAgICAgIGlzU3Vic2NyaWJlZDogZmFsc2UsXHJcbiAgICAgIGlzVW5zdWJzY3JpYmVkOiBmYWxzZVxyXG4gICAgfTtcclxuICAgIGxldCBjb29raWVPcHQgPSB7XHJcbiAgICAgIHBhdGg6ICcvJyxcclxuICAgICAgZXhwaXJlczogMzY1XHJcbiAgICB9O1xyXG4gICAgbGV0IHVzZXJOYW1lID0gJ3VzZXJHbG9iYWxEYXRhJztcclxuICAgIGxldCB1c2VyRGF0YSA9IGdldENvb2tpZSgpO1xyXG4gICAgbGV0IG5vd0RhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgbGV0IGRhdGVJbmRleCA9IDI0ICogNjAgKiA2MCAqIDEwMDA7Ly8yNCAqIDYwICogNjAgKiAxMDAwO1xyXG4gICAgbGV0IG1vYmlsZUNsYXNzID0gJ2lzbW9iaWxlZGV2aWNlJztcclxuXHJcbiAgICBsZXQgc3VibWl0T2tNZXNzID0ge1xyXG4gICAgICAndGl0bGUnOiAn0KHQv9Cw0YHQuNCx0L4hJyxcclxuICAgICAgJ21lc3MnOiAn0JzRiyDQvtGC0L/RgNCw0LLQuNC70Lgg0L/RgNC+0LzQviDQutC+0LQg0L3QsCDQktCw0YggZW1haWwuJ1xyXG4gICAgfTtcclxuICAgIGxldCBzdWJtaXRGYWlsTWVzcyA9IHtcclxuICAgICAgJ3RpdGxlJzogJ9Ce0YjQuNCx0LrQsCEnLFxyXG4gICAgICAnbWVzcyc6ICfQndCwINGB0LXRgNCy0LXRgNC1INC/0YDQvtC40LfQvtGI0LvQsCDQvtGI0LjQsdC60LAsINC/0L7Qv9GA0L7QsdGD0LnRgtC1INC10YnQtSDRgNCw0LcuJ1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLypkZWJ1Z2dlcnMqL1xyXG4gICAgd2luZG93LmNsZWFuQ29va2llID0gY2xlYW5Db29raWU7XHJcbiAgICB3aW5kb3cuZ2V0Q29va2llID0gZ2V0Q29va2llO1xyXG5cclxuICAgIGluaXQoKTtcclxuXHJcblxyXG4gICAgZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgICAgaWYgKGlzTG9nZ2VkKCkpIHtcclxuICAgICAgICB1c2VyT3B0LnN0YXR1cyA9ICd1c2VyJztcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCF1c2VyRGF0YSkge1xyXG4gICAgICAgIHNldENvb2tpZSgpO1xyXG4gICAgICAgIHN0YXJ0U2hvd2luZygpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgdXNlck9wdCA9IHVzZXJEYXRhO1xyXG4gICAgICAvL2NvbnNvbGUubG9nKHVzZXJPcHQpO1xyXG5cclxuICAgICAgaWYgKGlzTG9nZ2VkKCkpIHtcclxuICAgICAgICB1c2VyT3B0LnN0YXR1cyA9ICd1c2VyJztcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHVzZXJPcHQuaXNTdWJzY3JpYmVkIHx8IHVzZXJPcHQuaXNVbnN1YnNjcmliZWQpIHtcclxuICAgICAgICAvL3NldENvb2tpZSgpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgbGV0IGxhc3RTaG93biA9IERhdGUucGFyc2UodXNlck9wdC5sYXN0U2hvd24pO1xyXG5cclxuICAgICAgaWYgKG5vd0RhdGUgLSBsYXN0U2hvd24gPiB1c2VyT3B0LnNob3dFYWNoICogZGF0ZUluZGV4KSB7XHJcbiAgICAgICAgc2V0Q29va2llKCk7XHJcbiAgICAgICAgc3RhcnRTaG93aW5nKCk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gaXNMb2dnZWQoKSB7XHJcbiAgICAgIHJldHVybiAhISQoJ2JvZHkubG9nZ2VkLWluJykubGVuZ3RoO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHNldENvb2tpZSgpIHtcclxuICAgICAgbGV0IGNhY2hlZEpzb25PcHRpb24gPSAkLmNvb2tpZS5qc29uO1xyXG4gICAgICAkLmNvb2tpZS5qc29uID0gdHJ1ZTtcclxuICAgICAgbGV0IGNvb2tpZSA9ICQuY29va2llKHVzZXJOYW1lLCB1c2VyT3B0LCBjb29raWVPcHQpO1xyXG4gICAgICAkLmNvb2tpZS5qc29uID0gY2FjaGVkSnNvbk9wdGlvbjtcclxuXHJcbiAgICAgIHJldHVybiBjb29raWU7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0Q29va2llKCkge1xyXG4gICAgICBsZXQgY2FjaGVkSnNvbk9wdGlvbiA9ICQuY29va2llLmpzb247XHJcbiAgICAgICQuY29va2llLmpzb24gPSB0cnVlO1xyXG4gICAgICBsZXQgY29va2llID0gJC5jb29raWUodXNlck5hbWUpO1xyXG4gICAgICAkLmNvb2tpZS5qc29uID0gY2FjaGVkSnNvbk9wdGlvbjtcclxuXHJcbiAgICAgIHJldHVybiBjb29raWU7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gc3RhcnRTaG93aW5nKCkge1xyXG4gICAgICAvL2lmICghJHBvcFVwU2ltcGxlTmV3cy5sZW5ndGgpIHJldHVybjtcclxuXHJcbiAgICAgIGlmICgkc3Vic2NyaWJlLmxlbmd0aCkge1xyXG4gICAgICAgIGZvcm1Db250cm9sSW5pdCgpO1xyXG4gICAgICAgICRzdWJzY3JpYmVEaXNhYmxlLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgb25VbnN1YnNjcmliZSgpO1xyXG4gICAgICAgICAgaGlkZUpib3goKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKCQoJ2JvZHknKS5oYXNDbGFzcyhtb2JpbGVDbGFzcykpIHtcclxuICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBzaG93UG9wVXBGdW5jKCRwb3BVcFNpbXBsZU5ld3MpO1xyXG4gICAgICAgICAgICB1c2VyT3B0Lmxhc3RTaG93biA9IG5ldyBEYXRlO1xyXG4gICAgICAgICAgICBzZXRDb29raWUoKTtcclxuICAgICAgICAgIH0sIDMwMDAwKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgJChkb2N1bWVudCkub24oJ21vdXNlbGVhdmUnLCBvbk1vdXNlTGVhdmVCb2R5KTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHN0b3BTaG93aW5nKCkge1xyXG4gICAgICAkKGRvY3VtZW50KS5vZmYoJ21vdXNlbGVhdmUnLCBvbk1vdXNlTGVhdmVCb2R5KTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBvbk1vdXNlTGVhdmVCb2R5KGUpIHtcclxuICAgICAgaWYgKGUuY2xpZW50WSA8IDApIHtcclxuICAgICAgICAvL9C/0L7QutCw0LfRi9Cy0LDQtdC8INC/0L7Qv9Cw0L9cclxuICAgICAgICBzaG93UG9wVXBGdW5jKCRwb3BVcFNpbXBsZU5ld3MpO1xyXG4gICAgICAgIHN0b3BTaG93aW5nKCk7XHJcblxyXG4gICAgICAgIC8vdXNlck9wdC5pc1Nob3duID0gdHJ1ZTtcclxuICAgICAgICB1c2VyT3B0Lmxhc3RTaG93biA9IG5ldyBEYXRlO1xyXG4gICAgICAgIHNldENvb2tpZSgpO1xyXG5cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHNob3dQb3BVcERlYygpIHtcclxuICAgICAgbGV0IGlzU2hvd24gPSBmYWxzZTtcclxuXHJcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoZWwpIHtcclxuICAgICAgICBpZiAoaXNTaG93bikgcmV0dXJuO1xyXG5cclxuICAgICAgICBzaG93SmJveChlbCk7XHJcbiAgICAgICAgaXNTaG93biA9IHRydWU7XHJcbiAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gc2hvd0pib3goZWwpIHtcclxuICAgICAgJC5qQm94LmNsZWFuKCk7XHJcbiAgICAgICQoJyNqYm94LWhvbGRlcicpLmFkZENsYXNzKCdzdWJzY3JpYmUtYmcnKTtcclxuICAgICAgJC5qQm94Lmpib3hodG1sKGVsKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBoaWRlSmJveCgpIHtcclxuICAgICAgJC5qQm94LmhpZGVCbG9jaygpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNsZWFuQ29va2llKCkge1xyXG4gICAgICBjb25zb2xlLmRpcigkLnJlbW92ZUNvb2tpZSh1c2VyTmFtZSwgY29va2llT3B0KSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZm9ybUNvbnRyb2xJbml0KCkge1xyXG4gICAgICBsZXQgJGZvcm1PayA9ICQocmVuZGVyTWVzcyhzdWJtaXRPa01lc3MpKS5hcHBlbmRUbygkKCdib2R5JykpO1xyXG4gICAgICBsZXQgJGZvcm1GYWlsID0gJChyZW5kZXJNZXNzKHN1Ym1pdEZhaWxNZXNzKSkuYXBwZW5kVG8oJCgnYm9keScpKTtcclxuXHJcbiAgICAgIGxldCAkZW1haWwgPSAkc3Vic2NyaWJlLmZpbmQoJ2lucHV0W25hbWU9XCJtYWlsXCJdJyk7XHJcbiAgICAgIGxldCAkc3VibWl0ID0gJHN1YnNjcmliZS5maW5kKCdpbnB1dFt0eXBlPVwic3VibWl0XCJdJyk7XHJcbiAgICAgIGxldCAkd3JhcHBlciA9ICRzdWJtaXQucGFyZW50KCk7XHJcbiAgICAgIGxldCAkcGVuZGluZyA9ICQoJzxkaXYgY2xhc3M9XCJwZW5kaW5nLWJsb2NrIGNlbnRlciBtYjIwIG10MjAgaGlkZVwiPtCe0YLQv9GA0LDQstC70Y/QtdC8INC00LDQvdC90YvQtSAuLi48L2Rpdj4nKTtcclxuICAgICAgbGV0ICRlcnJvciA9ICQoJzxkaXYgY2xhc3M9XCJlcnItYmxvY2sgY2VudGVyIG1iMjAgbXQyMCBoaWRlXCI+0J/QvtGH0YLQsCDRg9C20LUg0L/QvtC00L/QuNGB0LDQvdCwPC9kaXY+Jyk7XHJcblxyXG4gICAgICAkd3JhcHBlclxyXG4gICAgICAgIC5hcHBlbmQoJHBlbmRpbmcpXHJcbiAgICAgICAgLmFwcGVuZCgkZXJyb3IpO1xyXG5cclxuICAgICAgJHBvcFVwU2ltcGxlTmV3cy5mb3JtQ29udHJvbGxlcih7XHJcbiAgICAgICAgcmVzb2x2ZTogZnVuY3Rpb24gKGZvcm0pIHtcclxuICAgICAgICAgIGxldCAkc3VibWl0ID0gJGZvcm1Pay5maW5kKCdpbnB1dFt0eXBlPVwic3VibWl0XCJdJyk7XHJcbiAgICAgICAgICBsZXQgZW1haWwgPSAkKGZvcm0pLmZpbmQoJ2lucHV0W25hbWU9XCJtYWlsXCJdJykudmFsKCk7XHJcbiAgICAgICAgICAvL2NvbnNvbGUubG9nKGVtYWlsKTtcclxuXHJcbiAgICAgICAgICBzaG93SmJveCgkZm9ybU9rKTtcclxuICAgICAgICAgIG9uU3Vic2NyaWJlKCk7XHJcblxyXG4gICAgICAgICAgaWYgKGRhdGFMYXllciAmJiAkLmlzQXJyYXkoZGF0YUxheWVyKSkge1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdkYXRhIGxheWVyJyk7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5kaXIoZGF0YUxheWVyKTtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnZW1haWwgPSAnICsgZW1haWwpO1xyXG4gICAgICAgICAgICBkYXRhTGF5ZXIucHVzaChcclxuICAgICAgICAgICAgICB7J2V2ZW50JzogJ3BvcHVwU3Vic2NyaXB0aW9uJywgJ3BvcHVwU3Vic2NyRW1haWwnOiBlbWFpbH1cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAkc3VibWl0Lm9uZSgnY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICBoaWRlSmJveCgpO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgJCgnYm9keScpLm9uZSgnakJveDphZnRlckNsb3NlJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKHRydWUpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICByZWplY3Q6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIGxldCAkc3VibWl0ID0gJGZvcm1GYWlsLmZpbmQoJ2lucHV0W3R5cGU9XCJzdWJtaXRcIl0nKTtcclxuXHJcbiAgICAgICAgICBzaG93SmJveCgkZm9ybUZhaWwpO1xyXG5cclxuICAgICAgICAgICRzdWJtaXQub25lKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgIHNob3dKYm94KCRwb3BVcFNpbXBsZU5ld3MpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBhZnRlclZhbGlkYXRlOiBmdW5jdGlvbiAoZm9ybSkge1xyXG4gICAgICAgICAgbGV0ICRlcnJvciA9ICQoZm9ybSkuZmluZCgnLmVyci1ibG9jaycpO1xyXG4gICAgICAgICAgbGV0ICRwZW5kaW5nID0gJChmb3JtKS5maW5kKCcucGVuZGluZy1ibG9jaycpO1xyXG4gICAgICAgICAgbGV0IGNvbnRyb2xsZXIgPSB0aGlzO1xyXG5cclxuICAgICAgICAgIGlmICgkZXJyb3IuaXMoJzp2aXNpYmxlJykpIHtcclxuICAgICAgICAgICAgJGVycm9yLmZhZGVPdXQoMjAwLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgJHBlbmRpbmcuZmFkZUluKDIwMCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAkcGVuZGluZy5mYWRlSW4oMjAwKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAvL2NvbnNvbGUubG9nKCRlbWFpbC52YWwoKSk7XHJcblxyXG4gICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdHlwZTogJ0dFVCcsXHJcbiAgICAgICAgICAgIHVybDogJy9zaW1wbGVuZXdzL3ZlcmlmeS1zdWJzY3JpYmUvMjYyLycgKyAkZW1haWwudmFsKCksXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgIC8vY29uc29sZS5kaXIoYXJndW1lbnRzKTtcclxuXHJcbiAgICAgICAgICAgICAgaWYgKHBhcnNlSW50KHJlc3BvbnNlLnN1YnNjcmliZWQpID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyLnNlbmRSZXF1ZXN0LmFwcGx5KGNvbnRyb2xsZXIsIFtmb3JtLCBjb250cm9sbGVyLl9yZXNvbHZlLCBjb250cm9sbGVyLl9yZWplY3QsIGNvbnRyb2xsZXIuX2JlZm9yZVNlbmRdKTtcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJHBlbmRpbmcuZmFkZU91dCgyMDAsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgJGVycm9yLmZhZGVJbigyMDApO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgIC8vY29uc29sZS5kaXIoYXJndW1lbnRzKTtcclxuICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAvL3Rocm93IG5ldyBFcnJvcihyZXNwb25zZS5zdGF0dXNUZXh0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBvblN1YnNjcmliZSgpIHtcclxuICAgICAgdXNlck9wdC5pc1N1YnNjcmliZWQgPSB0cnVlO1xyXG4gICAgICBzZXRDb29raWUoKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBvblVuc3Vic2NyaWJlKCkge1xyXG4gICAgICB1c2VyT3B0LmlzVW5zdWJzY3JpYmVkID0gdHJ1ZTtcclxuICAgICAgc2V0Q29va2llKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcmVuZGVyTWVzcyhkYXRhKSB7XHJcbiAgICAgIGxldCByZXNwb25kRm9ybVNvdXJjZSA9XHJcbiAgICAgICAgJzxkaXYgY2xhc3M9XCJzdWJzY3JpYmUtZm9ybV9fYm94IGNlbnRlciBoaWRlXCI+JyArXHJcbiAgICAgICAgJzxoMiBjbGFzcz1cIm1iMjBcIj4nICsgKGRhdGEudGl0bGUpICsgJzwvaDI+JyArXHJcbiAgICAgICAgJzxkaXYgY2xhc3M9XCJtYjMwXCI+JyArIChkYXRhLm1lc3MpICsgJzwvZGl2PicgK1xyXG4gICAgICAgICc8Zm9ybT4nICtcclxuICAgICAgICAnPGlucHV0IGNsYXNzPVwiZm9ybS1zdWJtaXRcIiB0eXBlPVwic3VibWl0XCIgdmFsdWU9XCJPa1wiLz4nICtcclxuICAgICAgICAnPC9mb3JtPicgK1xyXG4gICAgICAgICc8L2Rpdj4nO1xyXG5cclxuICAgICAgcmV0dXJuIHJlc3BvbmRGb3JtU291cmNlO1xyXG4gICAgfVxyXG5cclxuICB9KSgpO1xyXG5cclxuICAvKm1tZW51IHRhYnMqL1xyXG4gIChmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgbU1lbnUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW0tbWVudScpO1xyXG4gICAgbGV0IG1NZW51UGFuZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbS1wYW5lbCcpO1xyXG4gICAgbGV0ICRtTWVudVBhbmVsID0gJChtTWVudVBhbmVsKTtcclxuXHJcbiAgICBpZiAoIW1NZW51IHx8ICFtTWVudVBhbmVsKSByZXR1cm47XHJcblxyXG4gICAgbGV0ICR0YWJOYW1lID0gJChtTWVudS5xdWVyeVNlbGVjdG9yQWxsKCcudGFiLW5hbWUnKSk7XHJcblxyXG4gICAgJHRhYk5hbWUuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGxldCB0b2dnbGVyQ29udHJvbGxlciA9IHRoaXMuakVsZW1lbnRUb2dnbGVyO1xyXG5cclxuICAgICAgaWYgKCF0b2dnbGVyQ29udHJvbGxlcikgcmV0dXJuO1xyXG5cclxuICAgICAgdG9nZ2xlckNvbnRyb2xsZXIuX29uQmVmb3JlT3BlbiA9IG9uQmVmb3JlT3BlbjtcclxuICAgIH0pO1xyXG5cclxuICAgIGxldCAkYWN0aXZlVGFiID0gJHRhYk5hbWUuZmlsdGVyKCcuYWN0aXZlJyk7XHJcbiAgICBsZXQgYWN0aXZlVG9nZ2xlciA9ICRhY3RpdmVUYWJbMF0uakVsZW1lbnRUb2dnbGVyO1xyXG5cclxuICAgIGFjdGl2ZVRvZ2dsZXIuX2Rpc2FsbG93ZWRBY3Rpb25zID0gW107XHJcbiAgICBhY3RpdmVUb2dnbGVyLl9vbkFmdGVyT3BlbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgJGFjdGl2ZVRhYi5hZGRDbGFzcygnY2xvc2UnKTtcclxuICAgIH07XHJcbiAgICBhY3RpdmVUb2dnbGVyLl9vbkJlZm9yZUNsb3NlID0gb25CZWZvcmVDbG9zZTtcclxuICAgIGFjdGl2ZVRvZ2dsZXIuX29uQWZ0ZXJDbG9zZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgJGFjdGl2ZVRhYi5yZW1vdmVDbGFzcygnY2xvc2UnKTtcclxuICAgIH07XHJcbiAgICAkYWN0aXZlVGFiLnRyaWdnZXIoJ2pFbGVtZW50VG9nZ2xlcjpjbG9zZScpO1xyXG5cclxuICAgIC8vIEVuYWJsZSBzd2lwaW5nLi4uXHJcbiAgICAkbU1lbnVQYW5lbC5zd2lwZSh7XHJcbiAgICAgIC8vR2VuZXJpYyBzd2lwZSBoYW5kbGVyIGZvciBhbGwgZGlyZWN0aW9uc1xyXG4gICAgICBzd2lwZTogZnVuY3Rpb24gKGV2ZW50LCBkaXJlY3Rpb24sIGRpc3RhbmNlLCBkdXJhdGlvbiwgZmluZ2VyQ291bnQsIGZpbmdlckRhdGEpIHtcclxuICAgICAgICBzd2l0Y2ggKGRpcmVjdGlvbikge1xyXG4gICAgICAgICAgY2FzZSAnbGVmdCc6XHJcbiAgICAgICAgICAgICRhY3RpdmVUYWIudHJpZ2dlcignakVsZW1lbnRUb2dnbGVyOmNsb3NlJyk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgY2FzZSAncmlnaHQnOlxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIGFsbG93UGFnZVNjcm9sbDogXCJ2ZXJ0aWNhbFwiXHJcbiAgICB9KTtcclxuXHJcbiAgICBmdW5jdGlvbiBvbkJlZm9yZU9wZW4oKSB7XHJcbiAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnbS12aWV3Jyk7XHJcbiAgICAgICRtTWVudVBhbmVsLmFuaW1hdGUoe2xlZnQ6ICcwJ30sIDMwMCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gb25CZWZvcmVDbG9zZSgpIHtcclxuICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdtLXZpZXcnKTtcclxuICAgICAgJG1NZW51UGFuZWwuYW5pbWF0ZSh7bGVmdDogJy0xMDAlJ30sIDE1MCk7XHJcbiAgICB9XHJcbiAgfSkoKTtcclxuXHJcbiAgLypoaWRlIGZvb3RlciBtZXNzKi9cclxuICAoZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0ICR0b2dnbGVyID0gJCgnLmpzX19ldC1hZi1zJyk7XHJcbiAgICBsZXQgb3B0aW9ucyA9IHtcclxuICAgICAgYW5pbWF0aW9uOiAnZmFkZScsXHJcbiAgICAgIG9uQmVmb3JlQ2xvc2U6IHNldENvb2tpZVxyXG4gICAgfTtcclxuXHJcbiAgICBpZiAoY2hlY2tDb29raWUoKSB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGggPCA5NjApIHJldHVybjtcclxuXHJcbiAgICAkdG9nZ2xlci5qRWxlbWVudFRvZ2dsZXIob3B0aW9ucyk7XHJcblxyXG4gICAgZnVuY3Rpb24gY2hlY2tDb29raWUoKSB7XHJcbiAgICAgIHJldHVybiAhISQuY29va2llKCdoaWRlLWZvb3Rlci1jYXB0dXJlJyk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gc2V0Q29va2llKCkge1xyXG4gICAgICAkLmNvb2tpZSgnaGlkZS1mb290ZXItY2FwdHVyZScsIHRydWUsIHtleHBpcmVzOiAzNjUsIHBhdGg6ICcvJ30pO1xyXG4gICAgfVxyXG4gIH0pKCk7XHJcblxyXG4gIC8qY2FydCovXHJcbiAgKGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCAkY2FydEJ0biA9ICQoJy5tbS1tZW51IC5pY29uLXNob3BwaW5nLWNhcnQuamJveCcpO1xyXG4gICAgbGV0IGlzRnVsbFBhZ2UgPSBmYWxzZTtcclxuICAgIGxldCAkd2luZG93ID0gJCh3aW5kb3cpO1xyXG5cclxuICAgIHNldEZ1bGxQYWdlSmJveCgpO1xyXG4gICAgJHdpbmRvdy5vbigncmVzaXplJywgc2V0RnVsbFBhZ2VKYm94KTtcclxuXHJcbiAgICBmdW5jdGlvbiBzZXRGdWxsUGFnZUpib3goKSB7XHJcbiAgICAgIGxldCB3dyA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aDtcclxuXHJcbiAgICAgIGlmICh3dyA+IDc0MCAmJiBpc0Z1bGxQYWdlKSB7XHJcbiAgICAgICAgJGNhcnRCdG4ucmVtb3ZlQ2xhc3MoJ2pib3gtYW5jaG9yLWZ1bGxzY3JlZW4nKTtcclxuICAgICAgICBpc0Z1bGxQYWdlID0gZmFsc2U7XHJcbiAgICAgIH0gZWxzZSBpZiAod3cgPD0gNzQwICYmICFpc0Z1bGxQYWdlKSB7XHJcbiAgICAgICAgJGNhcnRCdG4uYWRkQ2xhc3MoJ2pib3gtYW5jaG9yLWZ1bGxzY3JlZW4nKTtcclxuICAgICAgICBpc0Z1bGxQYWdlID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pKCk7XHJcblxyXG4gIC8qWWFuZGV4IG1hcCovXHJcbiAgKGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCAkbWFwV3JhcHBlcnMgPSAkKCcubWFwLXdyYXAnKTtcclxuXHJcbiAgICBpZiAoISRtYXBXcmFwcGVycy5sZW5ndGgpIHJldHVybjtcclxuXHJcbiAgICBsZXQgZmlyc3RTY3JpcHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdzY3JpcHQnKVswXTtcclxuICAgIGxldCBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcclxuICAgIHNjcmlwdC5zcmMgPSAnaHR0cHM6Ly9hcGktbWFwcy55YW5kZXgucnUvMi4xLz9sYW5nPXJ1X1JVJztcclxuICAgIHNjcmlwdC5hc3luYyA9IHRydWU7XHJcbiAgICBmaXJzdFNjcmlwdC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShzY3JpcHQsIGZpcnN0U2NyaXB0KTtcclxuXHJcbiAgICBzY3JpcHQuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgeW1hcHMucmVhZHkoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQoJ2JvZHknKVxyXG4gICAgICAgICAgLnRyaWdnZXIoJ3lhbWFwOnJlYWR5JylcclxuICAgICAgICAgIC5hZGRDbGFzcygneWFtYXAtcmVhZHknKTtcclxuXHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJG1hcFdyYXBwZXJzLmVhY2goZnVuY3Rpb24gKGkpIHtcclxuICAgICAgbGV0ICRtYXBXcmFwcGVyID0gJCh0aGlzKTtcclxuICAgICAgbGV0ICRtYXAgPSAkKCc8ZGl2PjwvZGl2PicpO1xyXG4gICAgICBsZXQgbWFwT3ZlcmxheUluaXQgPSBtYXBPdmVybGF5SW5pdENsb3N1cmUodGhpcyk7XHJcblxyXG4gICAgICAkbWFwXHJcbiAgICAgICAgLmF0dHIoJ2lkJywgJ21hcC0nICsgaSlcclxuICAgICAgICAuY3NzKHtcclxuICAgICAgICAgIHdpZHRoOiAnMTAwJScsXHJcbiAgICAgICAgICBoZWlnaHQ6ICc0MDBweCdcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5hcHBlbmRUbygkbWFwV3JhcHBlcik7XHJcbiAgICAgIG1hcE92ZXJsYXlJbml0KCk7XHJcblxyXG4gICAgICBsZXQgbWFwRGF0YSA9IHtcclxuICAgICAgICBpZDogJG1hcC5hdHRyKCdpZCcpLFxyXG4gICAgICAgIGNlbnRlcjogSlNPTi5wYXJzZSgkbWFwV3JhcHBlci5hdHRyKCdkYXRhLWNlbnRlcicpKSxcclxuICAgICAgICB6b29tOiArJG1hcFdyYXBwZXIuYXR0cignZGF0YS16b29tJykgfHwgMTUsXHJcbiAgICAgICAgcGxhY2VtYXJrRGF0YToge1xyXG4gICAgICAgICAgY29vcmRzOiBKU09OLnBhcnNlKCRtYXBXcmFwcGVyLmF0dHIoJ2RhdGEtcGxhY2VtYXJrJykpLFxyXG4gICAgICAgICAgaGludENvbnRlbnQ6ICRtYXBXcmFwcGVyLmF0dHIoJ2RhdGEtaGludCcpIHx8ICcnLFxyXG4gICAgICAgICAgYmFsbG9vbkNvbnRlbnQ6ICRtYXBXcmFwcGVyLmF0dHIoJ2RhdGEtYmFsbG9vbicpIHx8IFwiXCJcclxuICAgICAgICB9XHJcbiAgICAgIH07XHJcblxyXG4gICAgICBpZiAoJCgnYm9keScpLmhhc0NsYXNzKCd5YW1hcC1yZWFkeScpKSB7XHJcbiAgICAgICAgaW5pdChtYXBEYXRhKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAkKCdib2R5Jykub24oJ3lhbWFwOnJlYWR5JywgaW5pdC5iaW5kKG51bGwsIG1hcERhdGEpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy9jb3VudGVyKys7XHJcbiAgICB9KTtcclxuXHJcbiAgICBmdW5jdGlvbiBtYXBPdmVybGF5SW5pdENsb3N1cmUobWFwV3JhcHBlcikge1xyXG4gICAgICBsZXQgJG1hcFdyYXBwZXIgPSAkKG1hcFdyYXBwZXIpO1xyXG4gICAgICBsZXQgaXNBY3RpdmVNYXAgPSBmYWxzZTtcclxuXHJcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJG1hcFdyYXBwZXIub24oJ21vdXNlbGVhdmUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAkbWFwV3JhcHBlci5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICBpc0FjdGl2ZU1hcCA9IGZhbHNlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICQoJ2JvZHknKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgbGV0IHRhcmdldCA9IGUudGFyZ2V0O1xyXG5cclxuICAgICAgICAgIGlmICgkKHRhcmdldCkuY2xvc2VzdCgkbWFwV3JhcHBlcikubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGlmIChpc0FjdGl2ZU1hcCkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgJG1hcFdyYXBwZXIuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICBpc0FjdGl2ZU1hcCA9IHRydWU7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoIWlzQWN0aXZlTWFwKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICAkbWFwV3JhcHBlci5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgIGlzQWN0aXZlTWFwID0gZmFsc2U7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBpbml0KG1hcERhdGEpIHtcclxuICAgICAgbGV0IG15TWFwID0gbmV3IHltYXBzLk1hcChtYXBEYXRhLmlkLCB7XHJcbiAgICAgICAgY2VudGVyOiBtYXBEYXRhLmNlbnRlcixcclxuICAgICAgICB6b29tOiBtYXBEYXRhLnpvb21cclxuICAgICAgfSwge1xyXG4gICAgICAgIHNlYXJjaENvbnRyb2xQcm92aWRlcjogJ3lhbmRleCNzZWFyY2gnXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgLy9teU1hcC5iZWhhdmlvcnMuZGlzYWJsZSgnc2Nyb2xsWm9vbScpO1xyXG5cclxuICAgICAgbGV0IHBsYWNlbWFyayA9IG5ldyB5bWFwcy5QbGFjZW1hcmsobWFwRGF0YS5wbGFjZW1hcmtEYXRhLmNvb3JkcyxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBoaW50Q29udGVudDogbWFwRGF0YS5wbGFjZW1hcmtEYXRhLmhpbnRDb250ZW50LFxyXG4gICAgICAgICAgYmFsbG9vbkNvbnRlbnQ6IG1hcERhdGEucGxhY2VtYXJrRGF0YS5iYWxsb29uQ29udGVudFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgcHJlc2V0OiBcImlzbGFuZHMjZG90Q2lyY2xlSWNvblwiXHJcbiAgICAgICAgICAvKmljb25MYXlvdXQ6ICdkZWZhdWx0I2ltYWdlJyxcclxuICAgICAgICAgIGljb25JbWFnZUhyZWY6ICdpbWFnZXMvbWFwLXBvaW50LnBuZycsXHJcbiAgICAgICAgICBpY29uSW1hZ2VTaXplOiBbMjksIDM5XSxcclxuICAgICAgICAgIGljb25JbWFnZU9mZnNldDogWy0xNCwgLTM5XSovXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICBteU1hcC5nZW9PYmplY3RzLmFkZChwbGFjZW1hcmspO1xyXG4gICAgfVxyXG4gIH0pKCk7XHJcblxyXG4gIC8qc2VhcmNoIGF1dG9jb21wbGV0ZSovXHJcbiAgKGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCAkaW5wdXQgPSAkKCdbbmFtZT1cIm1mYi1zaG9wc2VhcmNoLXBvcHVsYXRlXCJdJyk7XHJcblxyXG4gICAgaWYgKCEkaW5wdXQubGVuZ3RoKSByZXR1cm47XHJcblxyXG4gICAgbGV0IF9hZGRPdmVybGF5ID0gd2FpdGVyKGFkZE92ZXJsYXksIDEwMDApO1xyXG4gICAgbGV0ICRvdmVybGF5ID0gJCgnPGRpdiBjbGFzcz1cImFqYXgtcHJvZ3Jlc3Mtb3ZlcmxheVwiPjwvZGl2PicpO1xyXG5cclxuICAgICRpbnB1dC5vbih7XHJcbiAgICAgICdpbnB1dCc6IF9hZGRPdmVybGF5LFxyXG4gICAgICAnYXV0b2NvbXBsZXRlcmVzcG9uc2UnOiByZW1vdmVPdmVybGF5XHJcbiAgICB9KTtcclxuXHJcbiAgICBmdW5jdGlvbiBhZGRPdmVybGF5KCkge1xyXG4gICAgICAvL2xldCBpbnB1dCA9IHRoaXM7XHJcbiAgICAgIGxldCAkaW5wdXQgPSAkKHRoaXMpO1xyXG4gICAgICBsZXQgJHBhcmVudCA9ICRpbnB1dC5jbG9zZXN0KCcuY29udGFpbmVyLWlubGluZScpO1xyXG5cclxuICAgICAgaWYgKCEkaW5wdXQudmFsKCkpIHJldHVybjtcclxuXHJcbiAgICAgIC8vaW5wdXQucmVhZE9ubHkgPSB0cnVlO1xyXG4gICAgICAkcGFyZW50LmFwcGVuZCgkb3ZlcmxheSk7XHJcblxyXG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZW1vdmVPdmVybGF5KCk7XHJcbiAgICAgICAgLy9pbnB1dC5yZWFkT25seSA9IGZhbHNlO1xyXG4gICAgICB9LCAyMDAwKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiByZW1vdmVPdmVybGF5KCkge1xyXG4gICAgICAkb3ZlcmxheSA9ICRvdmVybGF5LnJlbW92ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHdhaXRlcihmdW5jLCBtcywgYmluZGVkVGhpcykge1xyXG4gICAgICBsZXQgdGltZXI7XHJcblxyXG4gICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGxldCBhcmdzID0gYXJndW1lbnRzO1xyXG5cclxuICAgICAgICBpZiAoYmluZGVkVGhpcyA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICBiaW5kZWRUaGlzID0gdGhpcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNsZWFyVGltZW91dCh0aW1lcik7XHJcbiAgICAgICAgdGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIGZ1bmMuYXBwbHkoYmluZGVkVGhpcywgYXJncyk7XHJcbiAgICAgICAgfSwgbXMpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSkoKTtcclxuXHJcbiAgLypwcmVsb2FkZXIqL1xyXG4gIChmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgJHByZWxvYWRlciA9ICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ByZWxvYWRlcicpKTtcclxuXHJcbiAgICAkcHJlbG9hZGVyLmZhZGVPdXQoKTtcclxuICB9KSgpO1xyXG5cclxuICAvKnRvdXIgbWFzdGVyKi9cclxuICAoZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0ICRzdGFydEJ0biA9ICQoJy50b3VyLW1hc3Rlci1zdGFydCcpO1xyXG4gICAgbGV0ICRhZG1pbk1lbnUgPSAkKCcubWVudV9hZG1pbmZsZXhfX3dyYXAnKTtcclxuICAgIGxldCAkZnVsbFBhZ2UgPSAkKCcuZnVsbHBhZ2UnKTtcclxuICAgIGxldCBjYWNoZWRGdWxsUGFnZVBhZGRpbmdMZWZ0O1xyXG4gICAgbGV0IHN0ZXBzID0gW1xyXG4gICAgICB7XHJcbiAgICAgICAgZWxlbWVudDogJy5qc19fanRvdXItc3RlcDEnLFxyXG4gICAgICAgIHRpdGxlOiAnc3RlcCAxJyxcclxuICAgICAgICB0YWc6ICfQpNGD0L3QutGG0LjQvtC90LDQu9GM0L3Ri9C1INC+0L/RhtC40Lgg0LjQvdGC0LXRgNC90LXRgi3QvNCw0LPQsNC30LjQvdCwJywgLy/QsiDRgtGD0YDQvNCw0YHRgtC10YDQtSDQsiBwb3B1cDQg0YjQsNCz0Lgg0L/QviDQvtC00L3QvtC5INGC0LXQvNC1INCz0YDRg9C/0L/QuNGA0YPRjtGC0YHRjyDQstC80LXRgdGC0LUsINGBINC+0LTQvdC40Lwg0LfQsNCz0L7Qu9C+0LLQutC+0LxcclxuICAgICAgICBjb250ZW50OiAnc29tZSBibGEtYmxhLWJsYScsXHJcbiAgICAgICAgcGF0aDogJy9yZXZpZXcvZmxleF9hZG1pbl90b3VyL3Rlc3QyLmh0bWwnXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBlbGVtZW50OiAnLmpzX19qdG91ci1zdGVwMicsXHJcbiAgICAgICAgdGl0bGU6ICdzdGVwIDInLFxyXG4gICAgICAgIHRhZzogJ9Ck0YPQvdC60YbQuNC+0L3QsNC70YzQvdGL0LUg0L7Qv9GG0LjQuCDQuNC90YLQtdGA0L3QtdGCLdC80LDQs9Cw0LfQuNC90LAnLFxyXG4gICAgICAgIGNvbnRlbnQ6ICdzb21lIGJsYS1ibGEtYmxhJyxcclxuICAgICAgICBwYXRoOiAnL3Jldmlldy9mbGV4X2FkbWluX3RvdXIvdGVzdDIuaHRtbCdcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIGVsZW1lbnQ6ICcuanNfX2p0b3VyLXN0ZXAzJyxcclxuICAgICAgICB0aXRsZTogJ3N0ZXAgMycsXHJcbiAgICAgICAgdGFnOiAn0KTRg9C90LrRhtC40L7QvdCw0LvRjNC90YvQtSDQvtC/0YbQuNC4INC40L3RgtC10YDQvdC10YIt0LzQsNCz0LDQt9C40L3QsCcsXHJcbiAgICAgICAgY29udGVudDogJ3NvbWUgYmxhLWJsYS1ibGEnLFxyXG4gICAgICAgIHBhdGg6ICcvcmV2aWV3L2ZsZXhfYWRtaW5fdG91ci90ZXN0Mi5odG1sJ1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgZWxlbWVudDogJy5qc19fanRvdXItc3RlcDQnLFxyXG4gICAgICAgIHRpdGxlOiAnc3RlcCA0JyxcclxuICAgICAgICB0YWc6ICfQn9GA0L7RhtC10YHRgdGLINC00LvRjyDRjtGA0LjQtNC40YfQtdGB0LrQuNGFINC70LjRhicsXHJcbiAgICAgICAgY29udGVudDogJ3NvbWUgYmxhLWJsYS1ibGEnLFxyXG4gICAgICAgIGFuaW1hdGVUeXBlOiAnaGlnaGxpZ2h0JyxcclxuICAgICAgICBwYXRoOiAnL3Jldmlldy9mbGV4X2FkbWluX3RvdXIvdGVzdDIuaHRtbCdcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIGVsZW1lbnQ6ICcuanNfX2p0b3VyLXN0ZXA1JyxcclxuICAgICAgICB0aXRsZTogJ3N0ZXAgNScsXHJcbiAgICAgICAgdGFnOiAn0J/RgNC+0YbQtdGB0YHRiyDQtNC70Y8g0Y7RgNC40LTQuNGH0LXRgdC60LjRhSDQu9C40YYnLFxyXG4gICAgICAgIGNvbnRlbnQ6ICdzb21lIGJsYS1ibGEtYmxhJyxcclxuICAgICAgICBwYXRoOiAnL3Jldmlldy9mbGV4X2FkbWluX3RvdXIvdGVzdC5odG1sJ1xyXG4gICAgICB9XHJcbiAgICBdO1xyXG4gICAgbGV0IG9wdGlvbnMgPSB7XHJcbiAgICAgIHRvdXJzOiBbXSxcclxuICAgICAgc3RlcHM6IHN0ZXBzLFxyXG4gICAgICBkZWZhdWx0VG91ck9wdGlvbnM6IHtcclxuICAgICAgICBpc01lbnU6IHRydWUsXHJcbiAgICAgICAgYWRkTWVudU1ldGhvZDogZnVuY3Rpb24gKCRtZW51LCBjb250YWluZXIsIGNvbnRyb2xsZXIpIHtcclxuICAgICAgICAgICRtZW51XHJcbiAgICAgICAgICAgIC5maW5kKCcudGl0bGUnKVxyXG4gICAgICAgICAgICAudGV4dChjb250cm9sbGVyLnRpdGxlKTtcclxuICAgICAgICAgIGNhY2hlZEZ1bGxQYWdlUGFkZGluZ0xlZnQgPSAkZnVsbFBhZ2UuY3NzKCdwYWRkaW5nLWxlZnQnKTtcclxuXHJcbiAgICAgICAgICAkbWVudVxyXG4gICAgICAgICAgICAuY3NzKHtsZWZ0OiAnLTEwMCUnLCB6SW5kZXg6ICc5NzUwJ30pXHJcbiAgICAgICAgICAgIC5hcHBlbmRUbygkKGRvY3VtZW50LmJvZHkpKVxyXG4gICAgICAgICAgICAuYW5pbWF0ZSh7bGVmdDogJzAnfSxcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogNDAwLFxyXG4gICAgICAgICAgICAgICAgcXVldWU6IGZhbHNlXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgJGFkbWluTWVudS5hbmltYXRlKHtsZWZ0OiAnLTEwMCUnfSwge2R1cmF0aW9uOiA0MDAsIHF1ZXVlOiBmYWxzZX0pO1xyXG4gICAgICAgICAgJChkb2N1bWVudC5ib2R5KS5hZGRDbGFzcygndG91ci1tZW51LWFjdGl2ZScpO1xyXG5cclxuICAgICAgICB9LFxyXG4gICAgICAgIHJlbW92ZU1lbnVNZXRob2Q6IGZ1bmN0aW9uICgkbWVudSkge1xyXG4gICAgICAgICAgJG1lbnUuYW5pbWF0ZSh7bGVmdDogJy0xMDAlJ30sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBkdXJhdGlvbjogNDAwLFxyXG4gICAgICAgICAgICAgIHF1ZXVlOiBmYWxzZSxcclxuICAgICAgICAgICAgICBjb21wbGV0ZTogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgJG1lbnUucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICApO1xyXG4gICAgICAgICAgJGFkbWluTWVudS5hbmltYXRlKHtsZWZ0OiAnMCd9LCB7ZHVyYXRpb246IDQwMCwgcXVldWU6IGZhbHNlfSk7XHJcbiAgICAgICAgICAkKGRvY3VtZW50LmJvZHkpLnJlbW92ZUNsYXNzKCd0b3VyLW1lbnUtYWN0aXZlJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gICAgbGV0IHRvdXJNYXN0ZXIgPSBudWxsO1xyXG5cclxuICAgIGdldFRvdXJzKClcclxuICAgICAgLnRoZW4odG91cnMgPT4ge1xyXG4gICAgICAgIG9wdGlvbnMudG91cnMgPSB0b3VycztcclxuICAgICAgICB0b3VyTWFzdGVyID0gJC5qVG91ck1hc3RlcihvcHRpb25zKTtcclxuXHJcbiAgICAgICAgJHN0YXJ0QnRuLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgdG91ck1hc3Rlci5zdGFydCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBzdGFydE1hc3Rlck9uQWRtaW4oJC5leHRlbmQoe30sIG9wdGlvbnMpKTtcclxuICAgICAgfSlcclxuICAgICAgLmNhdGNoKGVycm9yID0+IHtcclxuICAgICAgICBjb25zb2xlLmRpcihlcnJvcik7XHJcbiAgICAgIH0pO1xyXG5cclxuXHJcbiAgICBmdW5jdGlvbiBzdGFydE1hc3Rlck9uQWRtaW4ob3B0aW9ucykge1xyXG4gICAgICBsZXQgaXNBZG1pblBhZ2UgPSAkYWRtaW5NZW51Lmxlbmd0aDtcclxuICAgICAgbGV0IGlzTmV3ID0gISQuY29va2llKCdhZG1pbi10b3VyLWZpcnN0Jyk7XHJcbiAgICAgIGxldCBleHRyYU9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgb3B0aW9ucywge1xyXG4gICAgICAgIGpib3hPcHRpb25zOiB7XHJcbiAgICAgICAgICBjdXN0b21Ib2xkZXJDbGFzczogJ2pib3hfX2JnLWZ1bGwtd2hpdGUnLFxyXG4gICAgICAgICAgY3VzdG9tT3ZlcmxheUNsYXNzOiAnamJveF9fYmctZnVsbC13aGl0ZScsXHJcbiAgICAgICAgICBkaXNhYmxlQ2xvc2VCdG5IYW5kbGVyOiB0cnVlLFxyXG4gICAgICAgICAgZGlzYWJsZU92ZXJsYXlIYW5kbGVyOiB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGlmICghaXNBZG1pblBhZ2UgfHwgIWlzTmV3KSByZXR1cm47XHJcblxyXG4gICAgICBleHRyYU9wdGlvbnMuY3VzdG9tSG9sZGVyQ2xhc3MgPSAnamJveF9fYmctZnVsbC13aGl0ZSc7XHJcbiAgICAgIGV4dHJhT3B0aW9ucy5jdXN0b21PdmVybGF5Q2xhc3MgPSAnamJveF9fYmctZnVsbC13aGl0ZSc7XHJcblxyXG4gICAgICBsZXQgdG91ck1hc3RlciA9ICQualRvdXJNYXN0ZXIoZXh0cmFPcHRpb25zKTtcclxuICAgICAgdG91ck1hc3Rlci5zdGFydCgpO1xyXG4gICAgICAkLmNvb2tpZSgnYWRtaW4tdG91ci1maXJzdCcsICd0cnVlJywge3BhdGg6ICcvJywgZXhwaXJlczogMzY1fSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0VG91cnMoKSB7XHJcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgJC5nZXRKU09OKCcvYWRtaW4vZmxleC1tYXN0ZXInLCBmdW5jdGlvbiAocmVzcG9uc2UsIHN0YXR1cywgeGhyKSB7XHJcbiAgICAgICAgICBpZiAoeGhyLnN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgIHJlc29sdmUocGFyc2VUb3VycyhyZXNwb25zZSkpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmVqZWN0KHJlc3BvbnNlKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSlcclxuICAgICAgICAgIC5mYWlsKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICByZWplY3QocmVzcG9uc2UpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHBhcnNlVG91cnModG91cnMpIHtcclxuICAgICAgbGV0IG5ld1RvdXJzID0gW107XHJcblxyXG4gICAgICB0b3Vycy5mb3JFYWNoKCh0b3VyKSA9PiB7XHJcbiAgICAgICAgbGV0IG5ld1RvdXIgPSB7XHJcbiAgICAgICAgICBzdGVwczogW11cclxuICAgICAgICB9O1xyXG4gICAgICAgIGxldCBzdGVwcyA9IHRvdXIuc3RlcHM7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGtleSBpbiB0b3VyKSB7XHJcbiAgICAgICAgICBpZiAoa2V5ID09PSAnc3RlcHMnKSB7XHJcbiAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIG5ld1RvdXJba2V5XSA9IHRvdXJba2V5XTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN0ZXBzLmZvckVhY2goKHN0ZXApID0+IHtcclxuICAgICAgICAgIG5ld1RvdXIuc3RlcHMucHVzaChwYXJzZVN0ZXAoc3RlcCkpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBuZXdUb3Vycy5wdXNoKG5ld1RvdXIpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHJldHVybiBuZXdUb3VycztcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBwYXJzZVN0ZXAoc3RlcCkge1xyXG4gICAgICBsZXQgc3RlcE1hcHBlciA9IHtcclxuICAgICAgICBhbmltYXRldHlwZTogJ2FuaW1hdGVUeXBlJyxcclxuICAgICAgICBpc21lbnVzdGVwOiAnaXNNZW51U3RlcCcsXHJcbiAgICAgICAgbWVudXRpdGxlOiAnbWVudVRpdGxlJyxcclxuICAgICAgICBvbmVsZW1lbnQ6ICdvbkVsZW1lbnQnXHJcbiAgICAgIH07XHJcbiAgICAgIGxldCBoYW5kbGVyTWFwcGVyID0ge1xyXG4gICAgICAgICdzYXZlTkdvJzogc2F2ZU5Hb1xyXG4gICAgICB9O1xyXG4gICAgICBsZXQgbmV3U3RlcCA9IHt9O1xyXG5cclxuICAgICAgZm9yIChsZXQga2V5IGluIHN0ZXApIHtcclxuICAgICAgICBpZiAoc3RlcE1hcHBlcltrZXldKSB7XHJcbiAgICAgICAgICBpZiAoa2V5ID09PSAnb25lbGVtZW50Jykge1xyXG4gICAgICAgICAgICBuZXdTdGVwW3N0ZXBNYXBwZXJba2V5XV0gPSB7XHJcbiAgICAgICAgICAgICAgZXZlbnQ6IHN0ZXBba2V5XS5ldmVudCxcclxuICAgICAgICAgICAgICBoYW5kbGVyOiBoYW5kbGVyTWFwcGVyW3N0ZXBba2V5XS5oYW5kbGVyXVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbmV3U3RlcFtzdGVwTWFwcGVyW2tleV1dID0gc3RlcFtrZXldO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAoa2V5ID09PSAncGF0aCcpIHtcclxuICAgICAgICAgIGlmIChzdGVwLnBhdGggJiYgc3RlcC5wYXRoICE9PSAnLycpIHtcclxuICAgICAgICAgICAgbmV3U3RlcC5wYXRoID0gJy8nICsgc3RlcC5wYXRoO1xyXG4gICAgICAgICAgfSBlbHNlIGlmIChzdGVwLnBhdGggPT09ICcvJykge1xyXG4gICAgICAgICAgICBuZXdTdGVwLnBhdGggPSBzdGVwLnBhdGg7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBuZXdTdGVwLnBhdGggPSAnJztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbmV3U3RlcFtrZXldID0gc3RlcFtrZXldO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIG5ld1N0ZXA7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gc2F2ZU5HbyhlKSB7XHJcbiAgICAgIGxldCAkdGFyZ2V0ID0gJChlLnRhcmdldCk7XHJcbiAgICAgIGxldCB0b3VyID0gZS5kYXRhLnRvdXJDb250cm9sbGVyO1xyXG5cclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgJHRhcmdldC50cmlnZ2VyKHRvdXIuYWN0aXZlU3RlcC5vbkVsZW1lbnQuZXZlbnQpO1xyXG4gICAgICB9LCA1MCk7XHJcbiAgICAgIHRvdXIuYmluZE5leHRTdGVwKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLypkZWJ1Z2dlciovXHJcbiAgICB3aW5kb3cuZGVsZXRlQ29va2llVG91ciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgJC5yZW1vdmVDb29raWUoJ2FkbWluLXRvdXItZmlyc3QnLCB7cGF0aDogJy8nLCBleHBpcmVzOiAzNjV9KTtcclxuICAgIH07XHJcbiAgfSkoKTtcclxuXHJcbiAgLyphZG1pbiBtZW51IGV4dGVudGlvbiovXHJcbiAgKGZ1bmN0aW9uICgpIHtcclxuICAgIGNvbnN0IG1lbnUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubWVudV9hZG1pbmZsZXgub3BlcmF0aW9ucyAubWVudScpO1xyXG5cclxuICAgIGlmICghbWVudSkgcmV0dXJuO1xyXG5cclxuICAgIGNsYXNzIEFkbWluTWVudSB7XHJcbiAgICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcclxuICAgICAgICB0aGlzLm1lbnUgPSBvcHRpb25zLm1lbnU7XHJcbiAgICAgICAgdGhpcy5zcGlubmVyQWN0aXZhdGVBcmVhID0gb3B0aW9ucy5zcGlubmVyQWN0aXZhdGVBcmVhO1xyXG4gICAgICAgIHRoaXMuY2xhc3NIb3ZlcmVkID0gb3B0aW9ucy5jbGFzc0hvdmVyZWQgfHwgJ2hvdmVyJztcclxuICAgICAgICB0aGlzLmNsYXNzVW5ob3ZlcmVkID0gb3B0aW9ucy5jbGFzc1VuaG92ZXJlZCB8fCAndW5ob3Zlcic7XHJcbiAgICAgICAgdGhpcy5wcmVsb2FkZXJTZWxlY3RvciA9IG9wdGlvbnMucHJlbG9hZGVyU2VsZWN0b3I7XHJcbiAgICAgICAgdGhpcy5saUZ1bGxzY3JlZW5TZWxlY3RvciA9IG9wdGlvbnMubGlGdWxsc2NyZWVuU2VsZWN0b3I7XHJcbiAgICAgICAgdGhpcy5saUV4cGFuZGVkU2VsZWN0b3IgPSBvcHRpb25zLmxpRXhwYW5kZWRTZWxlY3RvcjtcclxuICAgICAgICB0aGlzLmNsb3NlQnRuU2VsZWN0b3IgPSBvcHRpb25zLmNsb3NlQnRuU2VsZWN0b3IgfHwgJy5tZW51X2FkbWluZmxleF9fY2xvc2UnO1xyXG4gICAgICAgIHRoaXMuY2xvc2VCdG5UcGwgPSBvcHRpb25zLmNsb3NlQnRuVHBsIHx8ICc8bGkgY2xhc3M9XCJtZW51X2FkbWluZmxleF9fY2xvc2VcIj48L2xpPic7XHJcbiAgICAgICAgdGhpcy5ob3ZlckRlbGF5ID0gb3B0aW9ucy5ob3ZlckRlbGF5IHx8IDMwMDtcclxuICAgICAgfVxyXG5cclxuICAgICAgaW5pdCgpIHtcclxuICAgICAgICBsZXQgJG1lbnUgPSB0aGlzLiRtZW51ID0gJCh0aGlzLm1lbnUpO1xyXG5cclxuICAgICAgICBpZiAoISRtZW51Lmxlbmd0aCkgcmV0dXJuO1xyXG5cclxuICAgICAgICB0aGlzLiRzcGlubmVyQWN0aXZhdGVBcmVhID0gJCh0aGlzLnNwaW5uZXJBY3RpdmF0ZUFyZWEpO1xyXG4gICAgICAgIHRoaXMuJGxpRnVsbHNjcmVlbiA9ICRtZW51LmNoaWxkcmVuKHRoaXMubGlGdWxsc2NyZWVuU2VsZWN0b3IpO1xyXG4gICAgICAgIHRoaXMuJGxpRXhwYW5kZWQgPSAkbWVudS5jaGlsZHJlbih0aGlzLmxpRXhwYW5kZWRTZWxlY3Rvcik7XHJcbiAgICAgICAgdGhpcy4kcHJlbG9hZGVyID0gJCh0aGlzLnByZWxvYWRlclNlbGVjdG9yKTtcclxuICAgICAgICB0aGlzLiRsaUhvdmVyZWQgPSBudWxsO1xyXG5cclxuICAgICAgICAvKmNsb3NlIGJ0biovXHJcbiAgICAgICAgdGhpcy5fY2xvc2VIYW5kbGVyID0gdGhpcy5jbG9zZUhhbmRsZXIuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLl9yZW5kZXJDbG9zZUJ0biA9IHRoaXMucmVuZGVyQ2xvc2VCdG4uYmluZCh0aGlzKTtcclxuICAgICAgICAvKmRlbGF5ZWQgbWVudSBvcGVuaW5nKi9cclxuICAgICAgICB0aGlzLl9vbk1vdXNlb3ZlciA9IHRoaXMub25Nb3VzZW92ZXIuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLl9vbk1vdXNlb3V0ID0gdGhpcy5vbk1vdXNlb3V0LmJpbmQodGhpcyk7XHJcbiAgICAgICAgLypzcGlubmVyKi9cclxuICAgICAgICB0aGlzLl9zcGlubmVyQWN0aXZhdGUgPSB0aGlzLnNwaW5uZXJBY3RpdmF0ZS5iaW5kKHRoaXMpO1xyXG5cclxuICAgICAgICB0aGlzLiRsaUZ1bGxzY3JlZW4uZWFjaCh0aGlzLl9yZW5kZXJDbG9zZUJ0bik7XHJcblxyXG4gICAgICAgICRtZW51Lm9uKHtcclxuICAgICAgICAgICdjbGljayB0b3VjaCc6IHRoaXMuX2Nsb3NlSGFuZGxlcixcclxuICAgICAgICAgICdtb3VzZW92ZXInOiB0aGlzLl9vbk1vdXNlb3ZlcixcclxuICAgICAgICAgICdtb3VzZW91dCc6IHRoaXMuX29uTW91c2VvdXRcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLiRzcGlubmVyQWN0aXZhdGVBcmVhLm9uKHtcclxuICAgICAgICAgICdjbGljayB0b3VjaCc6IHRoaXMuX3NwaW5uZXJBY3RpdmF0ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBzdG9wKCkge1xyXG4gICAgICAgIHRoaXMuJG1lbnUub2ZmKHtcclxuICAgICAgICAgICdjbGljayB0b3VjaCc6IHRoaXMuX2Nsb3NlSGFuZGxlcixcclxuICAgICAgICAgICdtb3VzZW92ZXInOiB0aGlzLl9vbk1vdXNlb3ZlcixcclxuICAgICAgICAgICdtb3VzZW91dCc6IHRoaXMuX29uTW91c2VvdXRcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLiRtZW51Lm9mZih7XHJcbiAgICAgICAgICAnY2xpY2sgdG91Y2gnOiB0aGlzLl9zcGlubmVyQWN0aXZhdGVcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLiRsaUZ1bGxzY3JlZW5cclxuICAgICAgICAgIC5maW5kKHRoaXMuY2xvc2VCdG5TZWxlY3RvcilcclxuICAgICAgICAgIC5yZW1vdmUoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgb25Nb3VzZW92ZXIoZSkge1xyXG4gICAgICAgIGlmICh0aGlzLiRsaUhvdmVyZWQpIHJldHVybjtcclxuXHJcbiAgICAgICAgbGV0ICR0YXJnZXQgPSAkKGUudGFyZ2V0KTtcclxuICAgICAgICBsZXQgJGxpQ3VycmVudCA9ICR0YXJnZXQuY2xvc2VzdCh0aGlzLiRsaUV4cGFuZGVkKTtcclxuXHJcbiAgICAgICAgaWYgKCEkbGlDdXJyZW50Lmxlbmd0aCkgcmV0dXJuO1xyXG5cclxuICAgICAgICB0aGlzLiRsaUhvdmVyZWQgPSAkbGlDdXJyZW50O1xyXG4gICAgICAgIHRoaXMuaG92ZXJEZWJvdW5jZSgkbGlDdXJyZW50KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgb25Nb3VzZW91dChlKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLiRsaUhvdmVyZWQpIHJldHVybjtcclxuXHJcbiAgICAgICAgbGV0ICRyZWxhdGVkVGFyZ2V0ID0gJChlLnJlbGF0ZWRUYXJnZXQpO1xyXG4gICAgICAgIGxldCAkbGlDdXJyZW50ID0gJHJlbGF0ZWRUYXJnZXQuY2xvc2VzdCh0aGlzLiRsaUhvdmVyZWQpO1xyXG5cclxuICAgICAgICBpZiAoJGxpQ3VycmVudC5sZW5ndGgpIHJldHVybjtcclxuXHJcbiAgICAgICAgdGhpcy4kbGlIb3ZlcmVkLnJlbW92ZUNsYXNzKHRoaXMuY2xhc3NIb3ZlcmVkKTtcclxuICAgICAgICB0aGlzLiRsaUhvdmVyZWQgPSBudWxsO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjbG9zZUhhbmRsZXIoZSkge1xyXG4gICAgICAgIGNvbnN0ICR0YXJnZXQgPSAkKGUudGFyZ2V0KTtcclxuXHJcbiAgICAgICAgaWYgKCEkdGFyZ2V0LmNsb3Nlc3QoYCR7dGhpcy5jbG9zZUJ0blNlbGVjdG9yfSwgYWApLmxlbmd0aCkgcmV0dXJuO1xyXG5cclxuICAgICAgICBsZXQgJGxpSG92ZXJlZCA9IHRoaXMuJGxpSG92ZXJlZDtcclxuXHJcbiAgICAgICAgaWYgKCEkbGlIb3ZlcmVkKSByZXR1cm47XHJcblxyXG4gICAgICAgICRsaUhvdmVyZWRcclxuICAgICAgICAgIC5hZGRDbGFzcyh0aGlzLmNsYXNzVW5ob3ZlcmVkKVxyXG4gICAgICAgICAgLnJlbW92ZUNsYXNzKHRoaXMuY2xhc3NIb3ZlcmVkKTtcclxuXHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAkbGlIb3ZlcmVkLnJlbW92ZUNsYXNzKHRoaXMuY2xhc3NVbmhvdmVyZWQpO1xyXG4gICAgICAgICAgdGhpcy4kbGlIb3ZlcmVkID0gbnVsbDsgLy/QvdCwINCy0YHRj9C60LjQuSDRgdC70YPRh9Cw0Lkg0L7QsdC90YPQu9GP0LXQvCDQsNC60YLQuNCy0L3Ri9C5IGxpXHJcbiAgICAgICAgfS5iaW5kKHRoaXMpLCA1MCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGhvdmVyRGVib3VuY2UoJGVsKSB7XHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICBpZiAoIXRoaXMuJGxpSG92ZXJlZCB8fCAhJGVsLmlzKHRoaXMuJGxpSG92ZXJlZCkpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAkZWwuYWRkQ2xhc3ModGhpcy5jbGFzc0hvdmVyZWQpO1xyXG4gICAgICAgIH0uYmluZCh0aGlzKSwgdGhpcy5ob3ZlckRlbGF5KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmVuZGVyQ2xvc2VCdG4oaSwgZWwpIHtcclxuICAgICAgICBsZXQgJHVsID0gJChlbCkuY2hpbGRyZW4oJy5tZW51Jyk7XHJcblxyXG4gICAgICAgICR1bC5hcHBlbmQodGhpcy5jbG9zZUJ0blRwbCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHNwaW5uZXJBY3RpdmF0ZShlKSB7XHJcbiAgICAgICAgbGV0IHRhcmdldCA9IGUudGFyZ2V0O1xyXG5cclxuICAgICAgICBpZiAoIXRhcmdldC5jbG9zZXN0KCdhJykpIHJldHVybjtcclxuXHJcbiAgICAgICAgdGhpcy4kcHJlbG9hZGVyLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGFkbWluTWVudSA9IG5ldyBBZG1pbk1lbnUoe1xyXG4gICAgICBtZW51OiBtZW51LFxyXG4gICAgICBzcGlubmVyQWN0aXZhdGVBcmVhOiAnLm1lbnVfYWRtaW5mbGV4JyxcclxuICAgICAgcHJlbG9hZGVyU2VsZWN0b3I6ICcjbG9nby1wcmVsb2FkZXInLFxyXG4gICAgICBsaUZ1bGxzY3JlZW5TZWxlY3RvcjogJy5leHBhbmRlZCcsXHJcbiAgICAgIGxpRXhwYW5kZWRTZWxlY3RvcjogJy5leHBhbmRlZCcsXHJcbiAgICAgIGhvdmVyRGVsYXk6IDMwMFxyXG4gICAgfSk7XHJcblxyXG4gICAgYWRtaW5NZW51LmluaXQoKTtcclxuICB9KSgpO1xyXG4gIFxyXG4gIC8qc2VyY2ggbWVudSovXHJcbiAgKGZ1bmN0aW9uICgpIHtcclxuICAgIGNvbnN0IG1lbnUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubWVudV9hZG1pbmZsZXgub3BlcmF0aW9ucyAubWVudScpO1xyXG5cclxuICAgIGlmICghbWVudSkgcmV0dXJuO1xyXG5cclxuICAgIGNsYXNzIFNlYXJjaCB7XHJcbiAgICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcclxuICAgICAgICB0aGlzLm1lbnUgPSBvcHRpb25zLm1lbnU7XHJcbiAgICAgICAgdGhpcy5jbGFzc05hbWUgPSB7XHJcbiAgICAgICAgICBoaWRkZW46ICdqc19fc2VhcmNoLWhpZGRlbidcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmluaXQoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaW5pdCgpIHtcclxuICAgICAgICB0aGlzLmJpbmRFbGVtZW50cygpO1xyXG4gICAgICAgIHRoaXMuYmluZEhhbmRsZXJzKCk7XHJcbiAgICAgICAgdGhpcy5hdHRhY2hIYW5kbGVycygpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBzZWFyY2hIYW5kbGVyKGUpIHtcclxuICAgICAgICBsZXQgdGFyZ2V0ID0gZS50YXJnZXQ7XHJcbiAgICAgICAgbGV0IHR5cGUgPSBlLnR5cGU7XHJcblxyXG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xyXG4gICAgICAgICAgY2FzZSAnaW5wdXQnIDpcclxuICAgICAgICAgICAgbGV0IHNlYXJjaCA9IHRhcmdldC52YWx1ZTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZmlsdGVyRmllbGRzKHRoaXMuJHNlYXJjaEl0ZW1ucywgc2VhcmNoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChzZWFyY2gpIHtcclxuICAgICAgICAgICAgICB0aGlzLiRzZWFyY2hSZXNldC5yZW1vdmVDbGFzcyh0aGlzLmNsYXNzTmFtZS5oaWRkZW4pO1xyXG4gICAgICAgICAgICAgIHRoaXMuJHNlYXJjaFN1Ym1pdC5hZGRDbGFzcyh0aGlzLmNsYXNzTmFtZS5oaWRkZW4pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHRoaXMuJHNlYXJjaFJlc2V0LmFkZENsYXNzKHRoaXMuY2xhc3NOYW1lLmhpZGRlbik7XHJcbiAgICAgICAgICAgICAgdGhpcy4kc2VhcmNoU3VibWl0LnJlbW92ZUNsYXNzKHRoaXMuY2xhc3NOYW1lLmhpZGRlbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICBjYXNlICdzdWJtaXQnIDpcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB0aGlzLmZpbHRlckZpZWxkcyh0aGlzLiRzZWFyY2hJdGVtbnMsIHRoaXMuJHNlYXJjaElucHV0LnZhbCgpKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICBjYXNlICdjbGljaycgOlxyXG4gICAgICAgICAgICBpZiAoJCh0YXJnZXQpLmNsb3Nlc3QodGhpcy4kc2VhcmNoUmVzZXQpLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgIHRoaXMuJHNlYXJjaElucHV0LnZhbCgnJyk7XHJcbiAgICAgICAgICAgICAgdGhpcy4kc2VhcmNoUmVzZXQuYWRkQ2xhc3ModGhpcy5jbGFzc05hbWUuaGlkZGVuKTtcclxuICAgICAgICAgICAgICB0aGlzLiRzZWFyY2hTdWJtaXQucmVtb3ZlQ2xhc3ModGhpcy5jbGFzc05hbWUuaGlkZGVuKTtcclxuICAgICAgICAgICAgICB0aGlzLmZpbHRlckZpZWxkcyh0aGlzLiRzZWFyY2hJdGVtbnMsIG51bGwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJlbmRlclNlYXJjaCgpIHtcclxuICAgICAgICBsZXQgc2VhcmNoVHBsID0gYDxsaSBjbGFzcz1cInNlYXJjaC1maWVsZFwiPlxyXG4gICAgICAgICAgICA8Zm9ybT5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cInNlYXJjaC1pbnB1dFwiPjxpbnB1dCB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwiJHtEcnVwYWwudCgnc2VhcmNoIGluIG1lbnUnKX1cIiBuYW1lPVwic2VhcmNoXCIvPjwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2VhcmNoLXJlc2V0ICR7dGhpcy5jbGFzc05hbWUuaGlkZGVufVwiPjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwic2VhcmNoLXN1Ym1pdFwiPjxpbnB1dCB0eXBlPVwic3VibWl0XCIvPjwvbGFiZWw+XHJcbiAgICAgICAgICAgIDwvZm9ybT5cclxuICAgICAgICAgICA8L2xpPmA7XHJcbiAgICAgICAgbGV0ICRzZWFyY2hCbG9jayA9ICQoc2VhcmNoVHBsKTtcclxuICAgICAgICB0aGlzLiRzZWFyY2hJbnB1dCA9ICRzZWFyY2hCbG9jay5maW5kKCcuc2VhcmNoLWlucHV0IGlucHV0Jyk7XHJcbiAgICAgICAgdGhpcy4kc2VhcmNoUmVzZXQgPSAkc2VhcmNoQmxvY2suZmluZCgnLnNlYXJjaC1yZXNldCcpO1xyXG4gICAgICAgIHRoaXMuJHNlYXJjaFN1Ym1pdCA9ICRzZWFyY2hCbG9jay5maW5kKCcuc2VhcmNoLXN1Ym1pdCcpO1xyXG5cclxuICAgICAgICAvL3RoaXMuJG1lbnUuYXBwZW5kKCRzZWFyY2hCbG9jayk7XHJcblxyXG4gICAgICAgIHJldHVybiAkc2VhcmNoQmxvY2s7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGJpbmRFbGVtZW50cygpIHtcclxuICAgICAgICB0aGlzLiRtZW51ID0gJCh0aGlzLm1lbnUpO1xyXG4gICAgICAgIHRoaXMuJHNlYXJjaEl0ZW1ucyA9IHRoaXMuJG1lbnUuY2hpbGRyZW4oJ2xpLmV4cGFuZGVkLCBsaS5sZWFmJyk7XHJcbiAgICAgICAgdGhpcy4kc2VhcmNoQmxvY2sgPSB0aGlzLnJlbmRlclNlYXJjaCgpO1xyXG5cclxuICAgICAgICB0aGlzLiRtZW51LnByZXBlbmQodGhpcy4kc2VhcmNoQmxvY2spO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBiaW5kSGFuZGxlcnMoKSB7XHJcbiAgICAgICAgdGhpcy5fc2VhcmNoSGFuZGxlciA9IHRoaXMuc2VhcmNoSGFuZGxlci5iaW5kKHRoaXMpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBhdHRhY2hIYW5kbGVycygpIHtcclxuICAgICAgICB0aGlzLiRzZWFyY2hCbG9jay5vbignaW5wdXQgc3VibWl0IGNsaWNrJywgdGhpcy5fc2VhcmNoSGFuZGxlcik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZpbHRlckZpZWxkcygkc2VhcmNoSXRlbXMsIHNlYXJjaCkge1xyXG4gICAgICAgIGxldCBfID0gdGhpcztcclxuXHJcbiAgICAgICAgaWYgKCFzZWFyY2gpIHtcclxuICAgICAgICAgICRzZWFyY2hJdGVtc1xyXG4gICAgICAgICAgICAucmVtb3ZlQ2xhc3MoXy5jbGFzc05hbWUuaGlkZGVuKVxyXG4gICAgICAgICAgICAuZmluZChgLiR7Xy5jbGFzc05hbWUuaGlkZGVufWApXHJcbiAgICAgICAgICAgIC5yZW1vdmVDbGFzcyhfLmNsYXNzTmFtZS5oaWRkZW4pO1xyXG5cclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICRzZWFyY2hJdGVtcy5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIGxldCAkZWwgPSAkKHRoaXMpO1xyXG4gICAgICAgICAgbGV0IHRleHQgPSB0aGlzLnRleHRDb250ZW50LnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgICBsZXQgbG93ZXJlZFNlYXJjaCA9IGAke3NlYXJjaH1gLnRvTG93ZXJDYXNlKCk7XHJcblxyXG4gICAgICAgICAgaWYgKCFzZWFyY2gpIHtcclxuICAgICAgICAgICAgJGVsLnJlbW92ZUNsYXNzKF8uY2xhc3NOYW1lLmhpZGRlbik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAofnRleHQuaW5kZXhPZihsb3dlcmVkU2VhcmNoKSkge1xyXG4gICAgICAgICAgICBsZXQgJHN1Ym1lbnUgPSAkZWwuY2hpbGRyZW4oJ3VsLm1lbnUnKTtcclxuICAgICAgICAgICAgbGV0ICRjaGlsZHJlbk5vdE1lbnUgPSAkZWwuY2hpbGRyZW4oKS5ub3QoJ3VsLm1lbnUnKTtcclxuICAgICAgICAgICAgbGV0IHN1Ym1lbnVUZXh0ID0gJHN1Ym1lbnUudGV4dCgpLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgICAgIGxldCBjaGlsZHJlbk5vdE1lbnVUZXh0ID0gJGNoaWxkcmVuTm90TWVudS50ZXh0KCkudG9Mb3dlckNhc2UoKTtcclxuXHJcbiAgICAgICAgICAgICRlbC5yZW1vdmVDbGFzcyhfLmNsYXNzTmFtZS5oaWRkZW4pO1xyXG5cclxuICAgICAgICAgICAgaWYgKCRzdWJtZW51Lmxlbmd0aFxyXG4gICAgICAgICAgICAgICYmIH5zdWJtZW51VGV4dC5pbmRleE9mKGxvd2VyZWRTZWFyY2gpXHJcbiAgICAgICAgICAgICAgJiYgIX5jaGlsZHJlbk5vdE1lbnVUZXh0LmluZGV4T2YobG93ZXJlZFNlYXJjaCkpIHtcclxuICAgICAgICAgICAgICBfLmZpbHRlckZpZWxkcygkc3VibWVudS5jaGlsZHJlbignbGknKSwgbG93ZXJlZFNlYXJjaCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoJHN1Ym1lbnUubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgJHN1Ym1lbnVcclxuICAgICAgICAgICAgICAgIC5maW5kKGAuJHtfLmNsYXNzTmFtZS5oaWRkZW59YClcclxuICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcyhfLmNsYXNzTmFtZS5oaWRkZW4pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgJGVsLmFkZENsYXNzKF8uY2xhc3NOYW1lLmhpZGRlbik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBsZXQgJG1lbnUgPSAkKG1lbnUpO1xyXG4gICAgbGV0ICRzZWFyY2hlZE1lbnVzID0gJG1lbnUuZmluZCgnPiBsaS5leHBhbmRlZCA+IC5tZW51Jyk7XHJcblxyXG4gICAgJHNlYXJjaGVkTWVudXMuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIG5ldyBTZWFyY2goe1xyXG4gICAgICAgIG1lbnU6IHRoaXNcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgfSkoKTtcclxuXHJcbiAgLypvcGVuIGxpdmUgY2hhdCovXHJcbiAgKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciAkc3RhcnRCdG4gPSAkKCcubGl2ZWNoYXQtc3RhcnQnKTtcclxuXHJcbiAgICAkc3RhcnRCdG4ub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgdmFyICRyb2NrZXRDaGF0ID0gJCgnLnJvY2tldGNoYXQtd2lkZ2V0Jyk7XHJcblxyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICBpZiAoJHJvY2tldENoYXQuYXR0cignZGF0YS1zdGF0ZScpICE9PSAnb3BlbmVkJykge1xyXG4gICAgICAgICRyb2NrZXRDaGF0LmF0dHIoJ2RhdGEtc3RhdGUnLCAnb3BlbmVkJyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgJHJvY2tldENoYXQuYXR0cignZGF0YS1zdGF0ZScsICdjbG9zZWQnKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfSkoKTtcclxuXHJcbiAgLyphZGQgY3VycmVudCBwYWdlIHVybCB0byBpbnB1dCovXHJcbiAgKGZ1bmN0aW9uICgpIHtcclxuICAgIGNvbnN0ICR0YXJnZXRJbnB1dCA9ICQoJ1tuYW1lPVwic3VibWl0dGVkW3NvdXJjZV1cIl0nKTtcclxuICAgIGNvbnN0IHBhdGhuYW1lID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lO1xyXG5cclxuICAgICR0YXJnZXRJbnB1dC52YWwocGF0aG5hbWUpO1xyXG4gIH0pKCk7XHJcblxyXG4gIC8qdGV4dGFyZWEgYXV0by1yZXNpemVyKi9cclxuIC8qIChmdW5jdGlvbiAoKSB7XHJcbiAgICBjb25zdCAkdGV4dGFyZWEgPSAkKCcuc3VwcG9ydC1jaGF0X19tZXNzYWdlIHRleHRhcmVhJyk7XHJcbiAgICBjb25zdCBvcHRpb25zID0ge1xyXG4gICAgICBsaW1pdDogMTIwXHJcbiAgICB9O1xyXG5cclxuICAgICR0ZXh0YXJlYS5hdXRvUmVzaXplKG9wdGlvbnMpO1xyXG4gIH0pKCk7Ki9cclxufSk7XHJcblxyXG4vKkRydXBhbCBiZWhhdmlvcnMqL1xyXG4oZnVuY3Rpb24gKCQpIHtcclxuICAvKmN1cG9uIHVwZGF0ZSovXHJcbiAgKGZ1bmN0aW9uICgpIHtcclxuICAgIERydXBhbC5iZWhhdmlvcnMuY3Vwb25VcGRhdGUgPSB7XHJcbiAgICAgIGF0dGFjaDogZnVuY3Rpb24gKGNvbnRleHQpIHtcclxuICAgICAgICBsZXQgJHByb21vY29kZVdyYXAgPSAkKCcuY291cG9uLWV4cGFuZC1ibG9jaycsIGNvbnRleHQpO1xyXG4gICAgICAgIGxldCAkZXJyb3IgPSAkKCcubWVzc2FnZXMuZXJyb3InLCBjb250ZXh0KTtcclxuXHJcbiAgICAgICAgaWYgKCRwcm9tb2NvZGVXcmFwLmxlbmd0aCkge1xyXG4gICAgICAgICAgJHByb21vY29kZVdyYXAub25jZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGxldCAkZWwgPSAkKHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgJGVsLm9uKCdjbGljaycsICdsYWJlbFtmb3I9XCJlZGl0LWNvdXBvbnMtc2tpZGthXCJdJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgIGxldCAkYnRuUHJvbW8gPSAkZWwuZmluZCgnLmJ0bl9wcm9tbycpO1xyXG5cclxuICAgICAgICAgICAgICAkZWwucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICRidG5Qcm9tby5zaG93KCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgJGVsLm9uKCdjbGljaycsICcuYnRuX3Byb21vJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgIGxldCAkcHJvbW9jb2RlID0gJGVsLmZpbmQoJy5wcm9tby1jb2RlJyk7XHJcbiAgICAgICAgICAgICAgbGV0ICRidG4gPSAkKHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgICAkYnRuLmhpZGUoKTtcclxuICAgICAgICAgICAgICAkZWwuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICRwcm9tb2NvZGUuc2hvdygpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGFmdGVyVXBkYXRlQ3Vwb24oJGVsKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoJGVycm9yLmxlbmd0aCkge1xyXG4gICAgICAgICAgJGVycm9yLm9uY2UoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBsZXQgJGVsID0gJCh0aGlzKTtcclxuICAgICAgICAgICAgbGV0ICRwcm9tb2NvZGVXcmFwID0gJGVsLmNsb3Nlc3QoJy5jb3Vwb24tZXhwYW5kLWJsb2NrJyk7XHJcbiAgICAgICAgICAgIGxldCAkYnRuID0gJHByb21vY29kZVdyYXAuc2libGluZ3MoJy5idG5fcHJvbW8nKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghJHByb21vY29kZVdyYXAubGVuZ3RoKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICAkYnRuLmhpZGUoKTtcclxuICAgICAgICAgICAgJHByb21vY29kZVdyYXAuc2hvdygpO1xyXG5cclxuICAgICAgICAgICAgYWZ0ZXJVcGRhdGVDdXBvbigkcHJvbW9jb2RlV3JhcCk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3VzdG9tIHNjcmlwdCBhZnRlciB1cGRhdGUgY3Vwb25cclxuICAgICAqL1xyXG5cclxuICAgIGZ1bmN0aW9uIGFmdGVyVXBkYXRlQ3Vwb24oJGN1cG9uSHRtbCkge1xyXG4gICAgICBsZXQgY3Vwb25XYXNEZWxldGVkID0gfiRjdXBvbkh0bWwudGV4dCgpLmluZGV4T2YoJ9Cx0YvQuyDRg9C00LDQu9C10L0g0LjQtyDQstCw0YjQtdCz0L4g0LfQsNC60LDQt9CwJyk7XHJcbiAgICAgIGxldCAkY3Vwb25BY3RpdmUgPSAkY3Vwb25IdG1sLmZpbmQoJyN1Yy1jb3Vwb24tYWN0aXZlLWNvdXBvbnMnKTtcclxuICAgICAgbGV0ICRlcnJvciA9ICRjdXBvbkh0bWwuZmluZCgnLm1lc3NhZ2VzLmVycm9yJyk7XHJcbiAgICAgIGxldCBkaXNjb3VudCA9IHBhcnNlSW50KCQoJy5saW5lLWl0ZW0tZGlzY291bnQgLmFtb3VudCcpLnRleHQoKSk7XHJcbiAgICAgIGxldCAkY3Vwb25JbnB1dFdyYXBwZXIgPSAkY3Vwb25IdG1sLmZpbmQoJy5jb2RlJyk7XHJcbiAgICAgIC8vIGxldCAkdXBkYXRlQ2FydEJ0biA9ICQoJyNlZGl0LWFjdGlvbnMgaW5wdXRbaWRePVwiZWRpdC11cGRhdGUtYWpheFwiXScpO1xyXG4gICAgICBsZXQgJHVwZGF0ZUNhcnRCdG4gPSAkKCcuZm9ybS1hY3Rpb25zIGlucHV0W2lkXj1cImVkaXQtdXBkYXRlLWFqYXhcIl0nKTtcclxuXHJcblxyXG4gICAgICBpZiAoJGVycm9yLmxlbmd0aCkge1xyXG4gICAgICAgICRjdXBvbklucHV0V3JhcHBlci5hZGRDbGFzcygnZXJyb3ItY29kZScpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoKCRjdXBvbkFjdGl2ZS5sZW5ndGggJiYgIWRpc2NvdW50KSB8fCAoISRjdXBvbkFjdGl2ZS5sZW5ndGggJiYgZGlzY291bnQpIHx8IChjdXBvbldhc0RlbGV0ZWQgJiYgZGlzY291bnQpKSB7XHJcbiAgICAgICAgJHVwZGF0ZUNhcnRCdG4udHJpZ2dlcignbW91c2Vkb3duJyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICghJGN1cG9uQWN0aXZlLmxlbmd0aCAmJiAhJGVycm9yLmxlbmd0aCkge1xyXG4gICAgICAgIHJlbmRlckJ1dHRvbigkY3Vwb25IdG1sKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qcmVuZGVyIGN1cG9uKi9cclxuICAgIGZ1bmN0aW9uIHJlbmRlckJ1dHRvbigkY3Vwb25IdG1sKSB7XHJcbiAgICAgIGxldCAkcmVuZGVyZWRCdG4gPSAkY3Vwb25IdG1sLnNpYmxpbmdzKCcuYnRuX3Byb21vJyk7XHJcbiAgICAgIGxldCAkbmV3QnRuID0gJCgnPGRpdiBjbGFzcz1cImJ0bl9wcm9tbyBidG4gc21hbGwgc2ltcGxlXCI+0KMg0LzQtdC90Y8g0LXRgdGC0Ywg0L/RgNC+0LzQvi3QutC+0LQ8L2Rpdj4nKTtcclxuXHJcbiAgICAgICRjdXBvbkh0bWwuaGlkZSgpO1xyXG5cclxuICAgICAgaWYgKCEkcmVuZGVyZWRCdG4ubGVuZ3RoKSB7XHJcbiAgICAgICAgJGN1cG9uSHRtbC5iZWZvcmUoJG5ld0J0bik7XHJcbiAgICAgICAgJG5ld0J0bi5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAkKHRoaXMpLmhpZGUoKTtcclxuICAgICAgICAgICRjdXBvbkh0bWwuZmFkZUluKDIwMCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgJHJlbmRlcmVkQnRuLnNob3coKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pKCk7XHJcblxyXG4gIC8qY2hhbmdlIGN1cnJlbmN5IGxldHRlcnMgdG8gaWNvbiovXHJcbiAgKGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBvcHRpb25zID0ge1xyXG4gICAgICBzZWFyY2hlZEVsOiAnLnByaWNlLCAucHJpY2VzLCAuc3VidG90YWwsIC5zdW0sIC50b3RhbC1zdW0sIC5zaGlwcGluZywgLnRvdGFsLCAudWMtcHJpY2UsIC5hbW91bnQsIC5pY29uLWNhc2hiYWNrJyxcclxuICAgICAgcGF0dGVybjogJ9GA0YPQsS4nLFxyXG4gICAgICBjbGFzc2VzOiAnaWNvbiBpYy1ydWInXHJcbiAgICB9O1xyXG4gICAgbGV0IHRleHRSZXBsYWNlciA9ICQuakZsZXgudGV4dFJlcGxhY2VyKG9wdGlvbnMpO1xyXG5cclxuICAgIERydXBhbC5iZWhhdmlvcnMubGV0dGVyc1RvSWNvbiA9IHtcclxuICAgICAgYXR0YWNoOiBmdW5jdGlvbiAoY29udGV4dCkge1xyXG4gICAgICAgIHRleHRSZXBsYWNlci5ydW4oY29udGV4dCk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgfSkoKTtcclxuXHJcbiAgLypjYXJ0IHRvZ2dsZXIgZHJ1cGFsIGJlaGF2aW9yKi9cclxuICAoZnVuY3Rpb24gKCkge1xyXG4gICAgRHJ1cGFsLmJlaGF2aW9ycy5idXR0b25zQm94ID0ge1xyXG4gICAgICBhdHRhY2g6IGZ1bmN0aW9uIChjb250ZXh0KSB7XHJcbiAgICAgICAgJChjb250ZXh0KS5vbmNlKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIGxldCAkZWwgPSAkKHRoaXMpO1xyXG5cclxuICAgICAgICAgIGlmICghJGVsLmhhc0NsYXNzKCdjYXJ0LXF0eS1pdGVtcy1jb3VudCcpKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgdG9nZ2xlckNhcnRXb3JraW5nKCRlbCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICQoJy5idXR0b25zX19ib3ggLmNhcnQtcXR5LWl0ZW1zLWNvdW50JywgY29udGV4dCkub25jZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICB0b2dnbGVyQ2FydFdvcmtpbmcoJCh0aGlzKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG5cclxuICAgIGZ1bmN0aW9uIHRvZ2dsZXJDYXJ0V29ya2luZygkY291bnRlcikge1xyXG4gICAgICBsZXQgJGNhcnRCdG4gPSAkKCcuanNfX2V0LWNhcnQtdG9nZ2xlcicpO1xyXG4gICAgICBsZXQgcXR5ID0gcGFyc2VJbnQoJGNvdW50ZXIudGV4dCgpKTtcclxuXHJcbiAgICAgIGlmIChxdHkgPiAwKSB7XHJcbiAgICAgICAgJGNhcnRCdG4udHJpZ2dlcignakVsZW1lbnRUb2dnbGVyOnN0YXJ0Jyk7XHJcbiAgICAgIH0gZWxzZSBpZiAocXR5ID09PSAwKSB7XHJcbiAgICAgICAgJGNhcnRCdG5cclxuICAgICAgICAgIC50cmlnZ2VyKCdqRWxlbWVudFRvZ2dsZXI6Y2xvc2UnKVxyXG4gICAgICAgICAgLnRyaWdnZXIoJ2pFbGVtZW50VG9nZ2xlcjpzdG9wJyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KSgpO1xyXG5cclxuICAvKmNhcnQgY29udGVudC10b2dnbGVyIGNoZWNrb3V0Ki9cclxuICAoZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IGlzRGlzYWJsZWQgPSBmYWxzZTtcclxuXHJcbiAgICBEcnVwYWwuYmVoYXZpb3JzLmNvbnRlbnRUb2dnbGVyQ2hlY2tvdXQgPSB7XHJcbiAgICAgIGF0dGFjaDogZnVuY3Rpb24gKGNvbnRleHQpIHtcclxuICAgICAgICAkKCcuY2FydC1pbmZvIC5jb250ZW50LXRvZ2dsZXInLCBjb250ZXh0KS5vbmNlKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIGxldCAkdG9nZ2xlciA9ICQodGhpcyk7XHJcblxyXG4gICAgICAgICAgdG9nZ2xlckVuYWJsaW5nKCR0b2dnbGVyKTtcclxuICAgICAgICAgICQod2luZG93KS5vbigncmVzaXplJywgdG9nZ2xlckVuYWJsaW5nLmJpbmQobnVsbCwgJHRvZ2dsZXIpKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgZnVuY3Rpb24gdG9nZ2xlckVuYWJsaW5nKCR0b2dnbGVyKSB7XHJcbiAgICAgIGxldCB3V2lkdGggPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGg7XHJcblxyXG4gICAgICBpZiAod1dpZHRoID4gNjQwICYmICFpc0Rpc2FibGVkKSB7XHJcbiAgICAgICAgJHRvZ2dsZXJcclxuICAgICAgICAgIC50cmlnZ2VyKCdqRWxlbWVudFRvZ2dsZXI6b3BlbicsIFsnc2ltcGxlJ10pXHJcbiAgICAgICAgICAudHJpZ2dlcignakVsZW1lbnRUb2dnbGVyOnN0b3AnKTtcclxuICAgICAgICBpc0Rpc2FibGVkID0gdHJ1ZTtcclxuICAgICAgfSBlbHNlIGlmICh3V2lkdGggPD0gNjQwICYmIGlzRGlzYWJsZWQpIHtcclxuICAgICAgICAkdG9nZ2xlclxyXG4gICAgICAgICAgLnRyaWdnZXIoJ2pFbGVtZW50VG9nZ2xlcjpzdGFydCcpXHJcbiAgICAgICAgICAudHJpZ2dlcignakVsZW1lbnRUb2dnbGVyOmNsb3NlJywgWydzaW1wbGUnXSk7XHJcbiAgICAgICAgaXNEaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSkoKTtcclxuXHJcbiAgLyp0b2dnbGVyIGxpdmUgY2hhdCovXHJcbiAgKGZ1bmN0aW9uICgpIHtcclxuICAgIERydXBhbC5iZWhhdmlvcnMubGl2ZUNoYXRDb250ZW50VG9nZ2xlciA9IHtcclxuICAgICAgYXR0YWNoOiBjb250ZXh0ID0+IHtcclxuICAgICAgICBjb25zdCAkdG9nZ2xlckJ0biA9ICQoJy5qc19fZXQtc3VwcG9ydC1jaGF0JywgY29udGV4dCk7XHJcbiAgICAgICAgY29uc3QgJG9wZW5CdG4gPSAkKCcuc3VwcG9ydC1jaGF0LW9wZW4nLCBjb250ZXh0KTtcclxuXHJcbiAgICAgICAgJHRvZ2dsZXJCdG4ub25jZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICBjb25zdCAkYnRuID0gJCh0aGlzKTtcclxuICAgICAgICAgIGNvbnN0ICRwYXJlbnQgPSAkKCcual9jcm0tY2hhdC0tY29udGVudC13cmFwJyk7XHJcbiAgICAgICAgICBjb25zdCBvcHRpb25zID0ge1xyXG4gICAgICAgICAgICBvbkJlZm9yZU9wZW46ICgpID0+IHtcclxuICAgICAgICAgICAgICAkcGFyZW50LnJlbW92ZUNsYXNzKCdqX2NybS1jaGF0LS1jb2xsYXBzZWQnKTtcclxuICAgICAgICAgICAgICBpZiAoJGJ0bi5oYXNDbGFzcygnal9jcm0tY2hhdC0tYnV0dG9uLWNpcmNsZScpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoIDwgOTYwKSB7XHJcbiAgICAgICAgICAgICAgICAgICRidG4uYW5pbWF0ZSh7Ym90dG9tOiBcIi03MHB4XCIsfSwgMjAwKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICRidG4uYW5pbWF0ZSh7cmlnaHQ6IFwiLTcwcHhcIix9LCAyMDApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkYnRuLmFuaW1hdGUoe2JvdHRvbTogXCItNTBweFwifSwgMjAwKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG9uQWZ0ZXJDbG9zZTogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICRwYXJlbnQuYWRkQ2xhc3MoJ2pfY3JtLWNoYXQtLWNvbGxhcHNlZCcpO1xyXG4gICAgICAgICAgICAgIGlmICgkYnRuLmhhc0NsYXNzKCdqX2NybS1jaGF0LS1idXR0b24tY2lyY2xlJykpIHtcclxuICAgICAgICAgICAgICAgIGlmIChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGggPCA5NjApIHtcclxuICAgICAgICAgICAgICAgICAgJGJ0bi5hbmltYXRlKHtib3R0b206IFwiMjBweFwiLH0sIDIwMCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAkYnRuLmFuaW1hdGUoe3JpZ2h0OiBcIjE1cHhcIix9LCAyMDApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkYnRuLmFuaW1hdGUoe2JvdHRvbTogXCIwXCJ9LCAyMDApO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgYW5pbWF0aW9uOiAnc2xpZGUnLFxyXG4gICAgICAgICAgICBvcGVuQW5pbWF0aW9uRHVyYXRpb246IDIwMCxcclxuICAgICAgICAgICAgY2xvc2VBbmltYXRpb25EdXJhdGlvbjogMTAwXHJcbiAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgIGlmICghJHBhcmVudC5oYXNDbGFzcygnal9jcm0tY2hhdC0tY29sbGFwc2VkJykgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoID49IDk2MCkge1xyXG4gICAgICAgICAgICAkYnRuLmFkZENsYXNzKCdldC1hY3RpdmUnKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAkYnRuLmpFbGVtZW50VG9nZ2xlcihvcHRpb25zKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJG9wZW5CdG4ub25jZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICBjb25zdCAkYnRuID0gJCh0aGlzKTtcclxuXHJcbiAgICAgICAgICAkYnRuLm9uKCdjbGljaycsIGUgPT4ge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIGNvbnN0ICR0b2dnbGVyID0gJCgnLmpzX19ldC1zdXBwb3J0LWNoYXQnKTtcclxuXHJcbiAgICAgICAgICAgICR0b2dnbGVyLnRyaWdnZXIoJ2pFbGVtZW50VG9nZ2xlcjpvcGVuJyk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBEcnVwYWwuYmVoYXZpb3JzLmxpdmVDaGF0S2V5TWFwID0ge1xyXG4gICAgICBhdHRhY2g6IGNvbnRleHQgPT4ge1xyXG4gICAgICAgIGNvbnN0ICRtZXNzYWdlID0gJCgnLnN1cHBvcnQtY2hhdF9fbWVzc2FnZScsIGNvbnRleHQpO1xyXG5cclxuICAgICAgICAkbWVzc2FnZS5vbmNlKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIC8qc2VuZCBtZXNzYWdlKi9cclxuICAgICAgICAgICgoKT0+IHtcclxuICAgICAgICAgICAgY29uc3QgJHRleHRhcmVhID0gJCh0aGlzKS5maW5kKCd0ZXh0YXJlYScpO1xyXG4gICAgICAgICAgICBjb25zdCAkc3VibWl0ID0gJCh0aGlzKS5maW5kKCcubWVzc2FnZS1zdWJtaXQgaW5wdXRbdHlwZT1cInN1Ym1pdFwiXScpO1xyXG4gICAgICAgICAgICBjb25zdCBvcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgIGV4dHJhU3BhY2UgOiAwLFxyXG4gICAgICAgICAgICAgIGxpbWl0OiAxMjBcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICR0ZXh0YXJlYS5hdXRvUmVzaXplKG9wdGlvbnMpO1xyXG4gICAgICAgICAgICAkdGV4dGFyZWEub24oJ2tleWRvd24nLCBlID0+IHtcclxuICAgICAgICAgICAgICBpZiAoZS5rZXlDb2RlICE9PSAxMykgcmV0dXJuO1xyXG4gICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgICAgaWYgKGUuc2hpZnRLZXkpIHtcclxuICAgICAgICAgICAgICAgIGUudGFyZ2V0LnZhbHVlID0gYCR7ZS50YXJnZXQudmFsdWV9XFxuYDtcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJHN1Ym1pdC50cmlnZ2VyKCdtb3VzZWRvd24nKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSkoKTtcclxuXHJcbiAgICAgICAgICAvKnVwbG9hZCBhdHRhY2htZW50Ki9cclxuICAgICAgICAgICgoKT0+e1xyXG4gICAgICAgICAgICBjb25zdCAkZmlsZVdpZGdldCA9ICQodGhpcykuZmluZCgnLmZpbGUtd2lkZ2V0LmZvcm0tbWFuYWdlZC1maWxlJyk7XHJcbiAgICAgICAgICAgIGNvbnN0ICRpbnB1dCA9ICRmaWxlV2lkZ2V0LmZpbmQoJ2lucHV0W3R5cGU9XCJmaWxlXCJdJyk7XHJcbiAgICAgICAgICAgIGNvbnN0ICRzdWJtaXQgPSAkZmlsZVdpZGdldC5maW5kKCdpbnB1dFt0eXBlPVwic3VibWl0XCJdJyk7XHJcblxyXG4gICAgICAgICAgICAkaW5wdXQub24oJ2NoYW5nZScsICgpID0+IHtcclxuICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpPT57XHJcbiAgICAgICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICAgICRmaWxlV2lkZ2V0LmZpbmQoJy5maWxlLXVwbG9hZC1qcy1lcnJvcicpLmxlbmd0aFxyXG4gICAgICAgICAgICAgICAgICB8fCAoJGlucHV0LnByb3AoJ2ZpbGVzJykgJiYgISRpbnB1dC5wcm9wKCdmaWxlcycpLmxlbmd0aClcclxuICAgICAgICAgICAgICAgICkgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgJHN1Ym1pdC50cmlnZ2VyKCdtb3VzZWRvd24nKTtcclxuICAgICAgICAgICAgICB9LCA1MCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSkoKTtcclxuXHJcbiAgICAgICAgICAvKmlucHV0W3R5cGU9ZmlsZV0gb3BlbiovXHJcbiAgICAgICAgICAoKCk9PntcclxuICAgICAgICAgICAgY29uc3QgJG9wZW5GaWxlQnRuID0gJCgnLmJ0bl9maWxlLW9wZW4nLCAkbWVzc2FnZSk7XHJcbiAgICAgICAgICAgIGNvbnN0ICR0b2dnbGVyID0gJCgnLmZpbGUtd2lkZ2V0LmZvcm0tbWFuYWdlZC1maWxlIGlucHV0W3R5cGU9ZmlsZV0nLCAkbWVzc2FnZSk7XHJcblxyXG4gICAgICAgICAgICAkb3BlbkZpbGVCdG4ub25jZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgY29uc3QgJGJ0biA9ICQodGhpcyk7XHJcblxyXG4gICAgICAgICAgICAgICRidG4ub24oJ2NsaWNrJywgZSA9PiB7XHJcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCEkdG9nZ2xlci5wYXJlbnRzKCRtZXNzYWdlKS5sZW5ndGgpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgICAgICAkdG9nZ2xlci50cmlnZ2VyKCdjbGljaycpO1xyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0pKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgRHJ1cGFsLmJlaGF2aW9ycy5saXZlQ2hhdEJvZHlTZXRIZWlnaHQgPSB7XHJcbiAgICAgIGF0dGFjaDogY29udGV4dCA9PiB7XHJcbiAgICAgICAgY29uc3QgJGNoYXRFbGVtZW50cyA9ICQoJy5maWxlLXdpZGdldCcsIGNvbnRleHQpO1xyXG5cclxuICAgICAgICAkY2hhdEVsZW1lbnRzLm9uY2Uoc2V0SGVpZ2h0Q2hhdEJvZHkpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIERydXBhbC5iZWhhdmlvcnMubGl2ZUNoYXRCb2R5U2V0SGVpZ2h0T25SZXNpemUgPSB7XHJcbiAgICAgIGF0dGFjaDogY29udGV4dCA9PiB7XHJcbiAgICAgICAgY29uc3QgJGJvZHkgPSAkKCdib2R5JywgY29udGV4dCk7XHJcblxyXG4gICAgICAgICRib2R5Lm9uY2UoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgY29uc3QgJGNoYXQgPSAkKCcual9jcm0tY2hhdCcpO1xyXG5cclxuICAgICAgICAgIGlmICghJGNoYXQubGVuZ3RoKSByZXR1cm47XHJcbiAgICAgICAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIHNldEhlaWdodENoYXRCb2R5KTtcclxuICAgICAgICB9KVxyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8qc3VwcG9ydCBjaGF0IGJvZHkgaGVpZ2h0IHNldCovXHJcbiAgICBmdW5jdGlvbiBzZXRIZWlnaHRDaGF0Qm9keSgpIHtcclxuICAgICAgY29uc3QgJGNvbnRlbnRXcmFwID0gJCgnLmpfY3JtLWNoYXQtLWNvbnRlbnQtd3JhcCcpO1xyXG4gICAgICBjb25zdCAkdG9wQmxvY2sgPSAkKCcuc3VwcG9ydC1jaGF0X190b3AtYmxvY2snKTtcclxuICAgICAgY29uc3QgJG1lc3NhZ2UgPSAkKCcuc3VwcG9ydC1jaGF0X19tZXNzYWdlJyk7XHJcbiAgICAgIGNvbnN0ICRjaGF0Qm9keSA9ICQoJy5zdXBwb3J0LWNoYXRfX2JvZHknKTtcclxuICAgICAgY29uc3QgJG9wZXJhdG9yTGlzdCA9ICQoJy5zdXBwb3J0LWNoYXRfX29wZXJhdG9yX2xpc3QnKTtcclxuXHJcbiAgICAgICRjb250ZW50V3JhcC5zaG93KCk7XHJcblxyXG4gICAgICBjb25zdCBtYWluSGVpZ2h0ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodDtcclxuICAgICAgY29uc3QgbWVzc2FnZUhlaWdodCA9ICRtZXNzYWdlLm91dGVySGVpZ2h0KCk7XHJcblxyXG4gICAgICBsZXQgdG9wQmxvY2tIZWlnaHQgPSAkdG9wQmxvY2sub3V0ZXJIZWlnaHQoKTtcclxuICAgICAgbGV0IGNoYXRCb2R5SGVpZ2h0ID0gKG1haW5IZWlnaHQgLSB0b3BCbG9ja0hlaWdodCAtIG1lc3NhZ2VIZWlnaHQpICsgJ3B4JztcclxuXHJcbiAgICAgIGlmIChwYXJzZUZsb2F0KGNoYXRCb2R5SGVpZ2h0KSA8IDMwMCkge1xyXG4gICAgICAgICRvcGVyYXRvckxpc3QuaGlkZSgpO1xyXG4gICAgICAgIHRvcEJsb2NrSGVpZ2h0ID0gJHRvcEJsb2NrLm91dGVySGVpZ2h0KCk7XHJcbiAgICAgICAgY2hhdEJvZHlIZWlnaHQgPSAobWFpbkhlaWdodCAtIHRvcEJsb2NrSGVpZ2h0IC0gbWVzc2FnZUhlaWdodCkgKyAncHgnO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAocGFyc2VGbG9hdChjaGF0Qm9keUhlaWdodCkgPiAyOTkgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoID49IDk2MCkge1xyXG4gICAgICAgICRvcGVyYXRvckxpc3Quc2hvdygpO1xyXG4gICAgICAgIHRvcEJsb2NrSGVpZ2h0ID0gJHRvcEJsb2NrLm91dGVySGVpZ2h0KCk7XHJcbiAgICAgICAgY2hhdEJvZHlIZWlnaHQgPSAobWFpbkhlaWdodCAtIHRvcEJsb2NrSGVpZ2h0IC0gbWVzc2FnZUhlaWdodCkgKyAncHgnO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoJGNvbnRlbnRXcmFwLmhhc0NsYXNzKCdqX2NybS1jaGF0LS1jb2xsYXBzZWQnKSkge1xyXG4gICAgICAgICRjb250ZW50V3JhcC5oaWRlKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgICRjaGF0Qm9keS5jc3Moe1xyXG4gICAgICAgIGhlaWdodDogY2hhdEJvZHlIZWlnaHRcclxuICAgICAgfSlcclxuICAgIH1cclxuICB9KSgpO1xyXG5cclxuICAvKnVzZXJMb2dpbiBvbiBjYXJ0Ki9cclxuICAoZnVuY3Rpb24gKCkge1xyXG4gICAgRHJ1cGFsLmJlaGF2aW9ycy51c2VyTG9naW5DYXJ0ID0ge1xyXG4gICAgICBhdHRhY2g6IGZ1bmN0aW9uIChjb250ZXh0KSB7XHJcbiAgICAgICAgbGV0ICR1c2VyTG9naW5XcmFwID0gJCgnI3VzZXJfbG9naW5fX3dyYXAnLCBjb250ZXh0KTtcclxuXHJcbiAgICAgICAgJHVzZXJMb2dpbldyYXAub25jZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICBsZXQgJHdyYXAgPSAkKHRoaXMpO1xyXG4gICAgICAgICAgbGV0ICRidG4gPSAkd3JhcC5maW5kKCcjdXNlcl9sb2dpbl9idG4nKTtcclxuICAgICAgICAgIGxldCAkdXNlckxvZ2luID0gJHdyYXAuZmluZCgnLnVzZXJfbG9naW4nKTtcclxuICAgICAgICAgIGxldCAkdXNlckxvZ2luRm9ybSA9ICR3cmFwLmZpbmQoJy51c2VyX2xvZ2luX2Zvcm0nKTtcclxuXHJcbiAgICAgICAgICAkYnRuLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgICR1c2VyTG9naW4uaGlkZSgpO1xyXG4gICAgICAgICAgICAkdXNlckxvZ2luRm9ybVxyXG4gICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnaGlkZGVuJylcclxuICAgICAgICAgICAgICAuaGlkZSgpXHJcbiAgICAgICAgICAgICAgLnNsaWRlRG93bigyMDApO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgfSkoKTtcclxuXHJcbiAgLyphamF4IG92ZXJsYXkgb24qL1xyXG4gIChmdW5jdGlvbiAoKSB7XHJcbiAgICBEcnVwYWwuYmVoYXZpb3JzLmFqYXhPdmVybGF5T25Ucm9iYmVyID0ge1xyXG4gICAgICBhdHRhY2g6IGZ1bmN0aW9uIChjb250ZXh0KSB7XHJcbiAgICAgICAgbGV0ICR0aHJvYmJlcnMgPSAkKCcuYWpheC1wcm9ncmVzcy10aHJvYmJlcicsIGNvbnRleHQpO1xyXG4gICAgICAgIGxldCAkYWpheE92ZXJsYXkgPSAkKCcuYWpheC1wcm9ncmVzcy1vdmVybGF5LmFqYXgtY3VzdG9tJywgY29udGV4dCk7XHJcbiAgICAgICAgbGV0ICR0aHJvYmJlckdsb2JhbCA9ICQoJy5hamF4LXByb2dyZXNzLXRocm9iYmVyJyk7XHJcblxyXG4gICAgICAgICRhamF4T3ZlcmxheS5vbmNlKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIGxldCAkY3Vyck92ZXJsYXkgPSAkKHRoaXMpO1xyXG4gICAgICAgICAgbGV0ICR0aHJvYmJlciA9ICRjdXJyT3ZlcmxheS5zaWJsaW5ncygnLmFqYXgtcHJvZ3Jlc3MtdGhyb2JiZXInKTtcclxuICAgICAgICAgIGxldCAkcGFyZW50ID0gJGN1cnJPdmVybGF5LnBhcmVudCgpO1xyXG5cclxuXHJcbiAgICAgICAgICBpZiAoJHRocm9iYmVyLmxlbmd0aCkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICRjdXJyT3ZlcmxheS5yZW1vdmUoKTtcclxuICAgICAgICAgICRwYXJlbnQuY3NzKHtcclxuICAgICAgICAgICAgcG9zaXRpb246ICcnXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgICR0aHJvYmJlcnMub25jZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICBsZXQgJHRocm9iYmVyID0gJCh0aGlzKTtcclxuICAgICAgICAgIGxldCAkb3ZlcmxheSA9ICQoJzxkaXYgY2xhc3M9XCJhamF4LXByb2dyZXNzLW92ZXJsYXkgYWpheC1jdXN0b21cIj48L2Rpdj4nKTtcclxuICAgICAgICAgIGxldCAkcGFyZW50ID0gJHRocm9iYmVyLnBhcmVudCgpO1xyXG5cclxuICAgICAgICAgICR0aHJvYmJlci5iZWZvcmUoJG92ZXJsYXkpO1xyXG4gICAgICAgICAgJHBhcmVudC5jc3Moe1xyXG4gICAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJ1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgfSkoKTtcclxuXHJcbiAgLyplZGl0YWJsZSBmaWVsZHMqL1xyXG4gIChmdW5jdGlvbiAoKSB7XHJcbiAgICBEcnVwYWwuYmVoYXZpb3JzLmVkaXRhYmxlZmllbGRzX3N1Ym1pdCA9IHtcclxuICAgICAgYXR0YWNoOiBmdW5jdGlvbiAoY29udGV4dCkge1xyXG4gICAgICAgICQoJy5lZGl0YWJsZWZpZWxkLWl0ZW0nKS5vbmNlKCdlZGl0YWJsZWZpZWxkJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKTtcclxuXHJcbiAgICAgICAgICAvLyBUaGVyZSBpcyBvbmx5IG9uZSBlZGl0YWJsZSBmaWVsZCBpbiB0aGF0IGZvcm0sIHdlIGNhbiBoaWRlIHRoZSBzdWJtaXRcclxuICAgICAgICAgIC8vIGJ1dHRvbi5cclxuICAgICAgICAgIGlmICgkdGhpcy5maW5kKCdpbnB1dFt0eXBlPXRleHRdLGlucHV0W3R5cGU9Y2hlY2tib3hdLHRleHRhcmVhLHNlbGVjdCcpLmxlbmd0aCA9PSAxIHx8ICR0aGlzLmZpbmQoJ3NlbGVjdC51c2Utc2VsZWN0LTInKS5sZW5ndGggPT0gMSB8fCAkdGhpcy5maW5kKCdpbnB1dFt0eXBlPXJhZGlvXSAnKS5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgICR0aGlzLmZpbmQoJ2lucHV0LmZvcm0tc3VibWl0JykuaGlkZSgpO1xyXG4gICAgICAgICAgICAkdGhpcy5maW5kKCdpbnB1dFt0eXBlPXRleHRdLGlucHV0W3R5cGU9Y2hlY2tib3hdLGlucHV0W3R5cGU9cmFkaW9dLHRleHRhcmVhLHNlbGVjdCcpLmNoYW5nZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgdmFyICRpbnB1dCA9ICR0aGlzLmZpbmQoJ3RleHRhcmVhLCBpbnB1dFt0eXBlPVwidGV4dFwiXSwgc2VsZWN0Jyk7XHJcblxyXG4gICAgICAgICAgICAgICRpbnB1dFxyXG4gICAgICAgICAgICAgICAgLmNzcygnYmFja2dyb3VuZCcsICcnKVxyXG4gICAgICAgICAgICAgICAgLmFkZENsYXNzKCdpbnB1dC1kaXNhYmxlZCBpbnB1dC1wcm9ncmVzcycpXHJcbiAgICAgICAgICAgICAgICAucHJvcCgncmVhZG9ubHknLCB0cnVlKTtcclxuXHJcbiAgICAgICAgICAgICAgaWYgKCRpbnB1dC5pcygnc2VsZWN0LnVzZS1zZWxlY3QtMicpKSB7XHJcbiAgICAgICAgICAgICAgICAkaW5wdXQuc2VsZWN0MigncmVhZG9ubHknLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICRpbnB1dFxyXG4gICAgICAgICAgICAgICAgICAuc2libGluZ3MoJy5zZWxlY3QyLWNvbnRhaW5lcicpXHJcbiAgICAgICAgICAgICAgICAgIC5maW5kKCcuc2VsZWN0Mi1jaG9pY2UnKVxyXG4gICAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ2lucHV0LXByb2dyZXNzJyk7XHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAkdGhpcy5maW5kKCdpbnB1dC5mb3JtLXN1Ym1pdCcpLnRyaWdnZXJIYW5kbGVyKCdjbGljaycpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICB2YXIgc3VibWl0TmFtZSA9ICdpbnB1dC5mb3JtLXN1Ym1pdC5lZGl0YWJsZWZpZWxkLWVkaXQtaG92ZXInO1xyXG4gICAgICAgICAgdmFyIGxpbmtOYW1lID0gJy5lZGl0YWJsZWZpZWxkLWhvdmVyLWxpbmsnO1xyXG5cclxuICAgICAgICAgIHZhciAkc3VibWl0ID0gJHRoaXMuZmluZChzdWJtaXROYW1lKTtcclxuICAgICAgICAgICRzdWJtaXQuaGlkZSgpLmFmdGVyKCc8YSBocmVmPVwiI1wiIGNsYXNzPVwiZWRpdGFibGVmaWVsZC1ob3Zlci1saW5rXCI+JyArICRzdWJtaXQuYXR0cigndmFsdWUnKSArICc8L2E+Jyk7XHJcblxyXG4gICAgICAgICAgJHRoaXMuZmluZChsaW5rTmFtZSkuaGlkZSgpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJHRoaXMuZmluZChzdWJtaXROYW1lKS5jbGljaygpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAkdGhpcy5ob3ZlcihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICR0aGlzLmZpbmQobGlua05hbWUpLmZhZGVUb2dnbGUoJ2Zhc3QnKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gIH0pKCk7XHJcblxyXG4gIC8qY2l0eSBibG9jayB3aWR0aCovXHJcbiAgKGZ1bmN0aW9uICgpIHtcclxuICAgIERydXBhbC5iZWhhdmlvcnMuY2l0eUJsb2NrID0ge1xyXG4gICAgICBhdHRhY2g6IGZ1bmN0aW9uIChjb250ZXh0KSB7XHJcbiAgICAgICAgbGV0ICRjaXRpZXMgPSAkKCcuY2l0eS1ibG9jayAuY2l0aWVzJywgY29udGV4dCk7XHJcblxyXG4gICAgICAgICRjaXRpZXMub25jZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICBsZXQgJGN1cnJDaXRpZXMgPSAkKHRoaXMpO1xyXG4gICAgICAgICAgbGV0ICRjaXRpZXNHcm91cCA9ICRjdXJyQ2l0aWVzLmZpbmQoJy5jaXRpZXMtZ3JvdXAnKTtcclxuICAgICAgICAgIGxldCBjaXRpZXNXaWR0aCA9ICgkY3VyckNpdGllcy5vdXRlcldpZHRoKCkgLSAkY3VyckNpdGllcy53aWR0aCgpKSArICRjdXJyQ2l0aWVzLndpZHRoKCkgKiAkY2l0aWVzR3JvdXAubGVuZ3RoO1xyXG5cclxuICAgICAgICAgICRjdXJyQ2l0aWVzLndpZHRoKGNpdGllc1dpZHRoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcblxyXG4gIH0pKCk7XHJcblxyXG4gIC8qZGV2ZWxvcG1lbnQgYWRtaW4gbWVudSB0b2dnbGVyKi9cclxuICAoZnVuY3Rpb24gKCkge1xyXG4gICAgRHJ1cGFsLmJlaGF2aW9ycy5hZG1pbk1lbnVUb2dnbGVyID0ge1xyXG4gICAgICBhdHRhY2g6IGZ1bmN0aW9uIChjb250ZXh0KSB7XHJcbiAgICAgICAgbGV0ICRhZG1pbk1lbnUgPSAkKCcubWVudV9hZG1pbmZsZXhfX3dyYXAnLCBjb250ZXh0KTtcclxuXHJcbiAgICAgICAgJGFkbWluTWVudS5vbmNlKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIGxldCAkbWVudSA9ICQodGhpcyk7XHJcbiAgICAgICAgICBsZXQgaXNNZW51RGlzYWJsZWQgPSAkLmNvb2tpZSgnYWRtaW5NZW51RGlzYWJsZWQnKTtcclxuXHJcbiAgICAgICAgICBpZiAoaXNNZW51RGlzYWJsZWQpIHtcclxuICAgICAgICAgICAgJG1lbnUuaGlkZSgpO1xyXG4gICAgICAgICAgICAkKCcuZnVsbHBhZ2UnKS5jc3MoJ3BhZGRpbmdMZWZ0JywgJzAnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICB3aW5kb3cub24gPSBlbmFibGVBZG1pbk1lbnU7XHJcbiAgICB3aW5kb3cub2ZmID0gZGlzYWJsZUFkbWluTWVudTtcclxuXHJcbiAgICBmdW5jdGlvbiBkaXNhYmxlQWRtaW5NZW51KCkge1xyXG4gICAgICAkLmNvb2tpZSgnYWRtaW5NZW51RGlzYWJsZWQnLCB0cnVlLCB7cGF0aDogJy8nfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZW5hYmxlQWRtaW5NZW51KCkge1xyXG4gICAgICAkLnJlbW92ZUNvb2tpZSgnYWRtaW5NZW51RGlzYWJsZWQnLCB7cGF0aDogJy8nfSk7XHJcbiAgICB9XHJcbiAgfSkoKTtcclxuXHJcbiAgLyogZGVsZWdhdGUgc3VibWl0IGNsaWNrIGluIGN0b29scy1tb2RhbC1jb250ZW50Ki9cclxuICAoZnVuY3Rpb24gKCkge1xyXG4gICAgRHJ1cGFsLmJlaGF2aW9ycy5kZWxlZ2F0ZWRTdWJtaXQgPSB7XHJcbiAgICAgIGF0dGFjaDogY29udGV4dCA9PiB7XHJcbiAgICAgICAgaWYgKGNvbnRleHQgIT09ICcjbW9kYWxDb250ZW50JykgcmV0dXJuO1xyXG4gICAgICAgICQoY29udGV4dCkub25jZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICBjb25zdCAkbW9kYWwgPSAkKHRoaXMpO1xyXG4gICAgICAgICAgY29uc3QgJHN1Ym1pdEJ0biA9ICQoJyNlZGl0LXN1Ym1pdCcsICRtb2RhbCk7XHJcbiAgICAgICAgICBjb25zdCAkbW9kYWxIZWFkZXIgPSAkKCcubW9kYWwtaGVhZGVyJywgJG1vZGFsKTtcclxuICAgICAgICAgIGNvbnN0ICRkZWxlZ2F0ZWRCdG4gPSAkKCc8ZGl2IGNsYXNzPVwiYnRuX2RlbGVnYXRlZC1zdWJtaXQgYnRuIHNtYWxsIHNpbXBsZVwiPtCh0L7RhdGA0LDQvdC40YLRjCDQutC+0L3RhNC40LPRg9GA0LDRhtC40Y48L2Rpdj4nKTtcclxuXHJcbiAgICAgICAgICAkbW9kYWxIZWFkZXIuYXBwZW5kKCRkZWxlZ2F0ZWRCdG4pO1xyXG4gICAgICAgICAgJGRlbGVnYXRlZEJ0bi5vbignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICRzdWJtaXRCdG4udHJpZ2dlcignY2xpY2snKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9LFxyXG4gIH07XHJcbiAgICBcclxuICB9KSgpO1xyXG59KShqUXVlcnkpO1xyXG4iXX0=
