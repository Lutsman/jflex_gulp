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

    let $stickycart_container = $('.cart-info.sticky').closest('#checkout');

    if (!$stickycart_container.length) return;

    let checkout_bottom_spacing = $(document).height() - ($stickycart_container.height() + $stickycart_container.offset().top);
    let checkout_margin_top = parseInt($('.cart-info.sticky').css('margin-top'));
    $('.cart-info.sticky').sticky({
      topSpacing: checkout_margin_top,
      bottomSpacing: checkout_bottom_spacing,
    });
    $('.cart-info.sticky').on('sticky-start', function () {
      $(this).css('margin-top', 0);
    })
    $('.cart-info.sticky').on('sticky-end', function () {
      $(this).css('margin-top', checkout_margin_top);
    })
    $('.cart-info.sticky').sticky('update');
  })();

  /*cart toggler*/
  (function () {
    let $cartBtn = $('.js__et-cart-toggler');
    let $overlay = $('#jbox-overlay');
    let options = {
      animation: 'none',
      onBeforeOpen: function (controller) {

        let $parent = controller._$togglerBtn.closest('.btn_cart__wrap');
        $overlay
          .fadeIn(200)
          .one('click', {controller: controller}, onOverlay);
        $parent.addClass('active');
      },
      onAfterOpen: function () {
        $(window).trigger('scroll');
      },
      onBeforeClose: function (controller) {
        let $parent = controller._$togglerBtn.closest('.btn_cart__wrap');

        $overlay
          .fadeOut(200)
          .off('click', onOverlay);
        $parent.removeClass('active');
      },
      getTarget: function ($btn) {
        return $btn.closest('.btn_cart__wrap').find('.cart__wrap');
      }
    };

    $cartBtn.jElementToggler(options);
    cartTogglerOnOff();
    $(window).on('resize', cartTogglerOnOff);

    function onOverlay(e) {
      let controller = e.data.controller;

      controller.hideEl();
    }

    function cartTogglerOnOff() {
      let wWidth = document.documentElement.clientWidth;

      if (wWidth >= 960) {
        $cartBtn.trigger('jElementToggler:start');
      } else {
        $cartBtn.trigger('jElementToggler:stop');
      }
    }
  })();

  /*show catr toggler*/
  (function () {
    let $cartBtn = $('.btn_cart');
    let $btnBox = $('.buttons__box');
    let isHiddenCartBtn = true;

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
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      let wWidth = document.documentElement.clientWidth;

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
    let $btn = $('.js__et-capture');

    if (!$btn.length) return;

    let $target = $('.capture__wrap');
    let lastUrl = document.referrer;
    let currHost = window.location.host;
    let isClosed = $.cookie('capture-closed');
    let isOuterCome = !~lastUrl.indexOf(currHost);
    let options = {
      animation: 'fade',
      onAfterClose: function () {
        $.cookie('capture-closed', true, {path: '/'});
      }
    };

    if (!isOuterCome && isClosed === 'true') return; //isOuterCome &&  непонятно зачем было это условие, уточнить

    $.removeCookie('capture-closed', {path: '/'});
    $(window).on('scroll', init);

    function init() {
      let ww = document.documentElement.clientWidth;

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
    let $searchToggler = $('.js__search-et-toggler');
    let options = {
      animationDuration: 200
    };
    let responsiveSwitcher = createResponsiveSwitch($searchToggler);

    $searchToggler.jElementToggler(options);
    responsiveSwitcher();
    $(window).on('resize', responsiveSwitcher);

    function createResponsiveSwitch($toggler) {
      return () => {
        let wWidth = document.documentElement.clientWidth;

        if (wWidth < 960) {
          $toggler.trigger('jElementToggler:start');
          $searchToggler.trigger('jElementToggler:close');
        } else {
          $toggler.trigger('jElementToggler:open');
          $toggler.trigger('jElementToggler:stop');
        }
      }
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
    const $btn = $('.flex_theme_block_show');
    const options = {
      animation: 'fade'
    };

    $btn.jElementToggler(options);
  })();

  /*lazy loader fixes*/
  (function () {
    /*sticky tables scroll triggering*/
    (function () {
      let $stickyTable = $(document.querySelectorAll('.sticky-table'));

      $stickyTable.on('scroll', function () {
        $(window).trigger('scroll');
      });
    })();
  })();

  /*main menu change behaviour*/
  (function () {
    let $menu = $('#main-menu');
    let $list = $menu.find('li.group');
    let $anchor = $list.children('a');
    let options = {
      animation: 'slide',
      animationDuration: 100,
      outerClick: true,
      className: {
        active: 'active-menu'
      },
      getTarget: function ($btn) {
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
    let fastorderBtn = document.querySelector('.btn__fastorder');

    if (!fastorderBtn) return;

    let qtyInput = document.getElementById('edit-qty');
    let form = document.querySelector('.form__fast-order');

    if (!form) return;

    let targetQtyInput = form.querySelector('input[name="submitted[qty]"]');

    fastorderBtn.addEventListener('click', function (e) {
      e.preventDefault();

      targetQtyInput.value = qtyInput.value;
      renderFormHead(form);

      //$.jBox.clean();
      //$.jBox.jboxhtml(form);
    });

    function renderFormHead(form) {
      let targetQtyInput = form.querySelector('input[name="submitted[qty]"]');
      let targetPriceEl = document.querySelector('.info-block .prices .current');
      let title = document.getElementById('page-title'); // form.querySelector('input[name="submitted[title]"]') || ;
      let content = form.querySelector('.content');
      let existedHead = form.querySelector('.form-head');

      let qty = parseInt(targetQtyInput.value);
      let price = parseFloat(targetPriceEl.textContent.replace(/\s/g, ""));
      let totalPrice = parsePrice(price * qty);


      let newHead =
        '<div class="form-head">' +
        '<div>' +
        '<span class="qty">' + qty + '</span>' +
        ' x ' +
        '<span class="title">' + title.textContent + '</span>' +
        '</div>' +
        '<div class="total-amount">' +
        'Сумма: ' +
        '<span class="amount icon ic-rub">' + totalPrice + '</span>' +
        '</div>' +
        '</div>';

      if (existedHead) {
        $(existedHead).replaceWith(newHead);
      } else {
        $(content).prepend(newHead);
      }
    }

    function parsePrice(price) {
      let precisePrice = Math.round(price * 100) / 100;
      let priceStr = precisePrice + '';
      let beforeDot = Math.floor(precisePrice);
      let beforeDotStr = beforeDot + '';
      let afterDotStr = priceStr.indexOf('.') ? priceStr.slice(priceStr.indexOf('.')) : '';
      let resultArr = beforeDotStr.split('');
      let resultStr = '';

      for (let i = beforeDotStr.length - 1, j = 1; i >= 0; i--, j++) {
        let isThird = !(j % 3) && j;

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
    let $dMode = $('body.displaymode');
    let isAttachedHandler = false;

    if (!$dMode.length) return;

    setDisplayMode();
    $(document).on('infiniteScrollComplete', setDisplayMode);

    /* SET MODE. Set view mode switcher. */
    function setDisplayMode() {
      let $dMode = $('body.displaymode');
      // Set mode after loaded page
      let hash = document.location.hash;

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
        }
        else {
          hash == 'linear' ? setMode('linear', true) : '';
        }
      }
      else {
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
        $('#display-switch a.' + mode)
          .addClass('active')
          .siblings()
          .removeClass('active');
        if (!onlyLink) {
          $dMode
            .removeClass('grid linear')
            .addClass(mode);
          $.cookie('displaymode', mode, {expires: 30});
        }
      }
    }
  })();

  /*range bar*/
  (function () {
    /*left bar*/
    (function () {
      let $parent = $(document.getElementById('edit-mfb-filter-price-sell-price-wrapper'));

      if (!$parent.length) return;

      let $min = $(document.getElementById('edit-mfb-filter-price-sell-price-min')).val(0);
      let $max = $(document.getElementById('edit-mfb-filter-price-sell-price-max')).val(200000);
      let $submit = $('.views-exposed-widget.views-submit-button', document.getElementById('views-exposed-form-taxonomy-term-page-category-mfb-filter-price'));
      let options = {
        min: $min,
        max: $max,
        ranges: [
          {
            pixelRange: '50%',
            unitRange: '10%'
          },
          {
            pixelRange: '80%',
            unitRange: '30%'
          }
        ]
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
          $submit
            .removeClass('hidden')
            .show();
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
      let holder = document.getElementById('jbox-holder');

      if (!holder) return;

      let $holder = $(holder);

      $holder.on('jBox:afterOpen', refreshRangeBar);

      function refreshRangeBar() {
        let $rangeBar = $(this).find('.jrangebar-wrapper');

        $rangeBar.trigger('jRangeBar:refresh');
      }
    })();

    /*hide jbox after rangebar submit*/
    (function () {
      let $submit = $('.views-exposed-widget.views-submit-button .form-submit', document.getElementById('views-exposed-form-taxonomy-term-page-category-mfb-filter-price'));

      if (!$submit.length) return;

      $submit.on('click', function (e) {
        let jboxHolder = this.closest('#jbox-holder');

        if (!jboxHolder) return;

        $.jBox.hideBlock();
      });
    })();
  })();

  /*hide jbox on click*/
  (function () {
    let $closeBtn = $('.js__jbox-close');

    $closeBtn.on('click', function (e) {
      e.preventDefault();

      $.jBox.close();
    });
  })();

  /*cookies confirm button*/
  (function () {
    let confirmName = 'cookiesConfirmed';
    let isConfirmed = $.cookie(confirmName);


    /*debugger*/
    window.deleteCookieConfirm = function () {
      let options = {
        expires: 365,
        path: '/'
      };

      $.removeCookie(confirmName, options);
    };

    if (isConfirmed) return;

    let $cookiesBlock = $(document.getElementById('cookie'));//renderCookiesConfirm();
    let $confirmBtn = $cookiesBlock.find('.btn_confirm');
    let $parentBlock = $('.fulldata');


    $parentBlock
      .prepend($cookiesBlock)
      .css({
        marginTop: $cookiesBlock.outerHeight() + 'px'
      });

    $confirmBtn.on('click', confirmHandler);

    function renderCookiesConfirm() {
      let tpl =
        '<div id="cookie" class="cookie">' +
        '<div class="hold pad-h">' +
        '<div class="row sp-10">' +
        '<div class="col d7">' +
        '<div class="text">Для наилучшей работы сайта используются cookies. ' +
        '<a href="#">Подробнее о cookies.</a>' +
        '</div>' +
        '</div>' +
        '<div class="col d5">' +
        '<a href="#" class="btn_confirm btn small simple icon icon-uniE65A">Подтвердить использование cookies</a>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';

      return $(tpl);
    }

    function confirmHandler(e) {
      e.preventDefault();

      let val = true;
      let options = {
        expires: 365,
        path: '/'
      };

      $parentBlock
        .animate({
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
    let totalRows = document.querySelector('.total-rows');

    if (!totalRows) return;

    let goodsCount = document.querySelector('.page-title .goods-count');

    if (!goodsCount) return;

    goodsCount.textContent = '(' + totalRows.textContent + ')';
  })();

  /*product reviews*/
  (function () {
    let $reviewsBtn = $('.product .reviews a');

    $reviewsBtn.on('click', function (e) {
      //e.preventDefault();

      let id = this.getAttribute('href').replace(/#/g, '');
      let $commentTab = $(document.getElementById(id));

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
      let elem = e.target;
      let anchor = elem.closest('a[href*="#"]:not([data-scroll="disable"]):not(.js__scroll-disable):not(.jbox)');

      if (!anchor) return;

      let anchorWithHash = anchor.closest('a[href^="#"]');
      let windowPath = window.location.origin + window.location.pathname;
      let anchorPath = anchor.href.slice(0, anchor.href.indexOf('#'));

      if (windowPath === anchorPath) {
        anchorWithHash = anchor;
      }

      if (!anchorWithHash || anchorWithHash.hash.length < 2) return;

      e.preventDefault();

      let target = anchorWithHash.hash;
      let translation = this.getTranslation(anchorWithHash);

      if (!document.querySelector(target)) return;

      this.smoothScroll(target, translation);
    };
    ScrollToAnchor.prototype.getTranslation = function (anchor) {
      let translation = 0;

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
        },
        this._animationSpeed
      );
    };

    let pageScroll = new ScrollToAnchor({
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
      let target = e.target;
      let sourceBtn = target.closest('[data-submit-target]');

      if (!sourceBtn) return;

      let sourceData = sourceBtn.getAttribute('data-submit-source') || sourceBtn.textContent;
      let selector = sourceBtn.getAttribute('href') + ' ' + sourceBtn.getAttribute('data-submit-target');
      let sourceInput = document.querySelector(selector);

      if (!sourceInput) return;

      sourceInput.setAttribute('value', sourceData);
    }

    function setSourceFromFormHandler(e) {
      let target = e.target;
      let submitBtn = target.closest('input[type="submit"]');

      if (!submitBtn) return;

      let sourceDataEl = submitBtn.closest('[data-webform-source]');

      if (!sourceDataEl) return;

      let sourceData = sourceDataEl.getAttribute('data-webform-source');
      let sourceInput = submitBtn.closest('form').querySelector(sourceDataEl.getAttribute('data-webform-target'));

      if (!sourceInput || sourceInput.getAttribute('value')) return;

      sourceInput.setAttribute('value', sourceData);
    }
  })();

  /*show subscribe*/
  (function () {
    let $popUpSimpleNews = $(document.querySelector('.newsblock'));

    if (!$popUpSimpleNews.length) return;
    if (document.documentElement.clientWidth < 960) return;

    let $subscribe = $popUpSimpleNews.find('.simplenews-subscribe');
    let $subscribeDisable = $popUpSimpleNews.find('.subscribed');
    let showPopUpFunc = showPopUpDec();


    let userOpt = {
      status: 'anonim',
      date: new Date(),
      lastShown: new Date(),
      showEach: 3,
      isSubscribed: false,
      isUnsubscribed: false
    };
    let cookieOpt = {
      path: '/',
      expires: 365
    };
    let userName = 'userGlobalData';
    let userData = getCookie();
    let nowDate = new Date();
    let dateIndex = 24 * 60 * 60 * 1000;//24 * 60 * 60 * 1000;
    let mobileClass = 'ismobiledevice';

    let submitOkMess = {
      'title': 'Спасибо!',
      'mess': 'Мы отправили промо код на Ваш email.'
    };
    let submitFailMess = {
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

      let lastShown = Date.parse(userOpt.lastShown);

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
      let cachedJsonOption = $.cookie.json;
      $.cookie.json = true;
      let cookie = $.cookie(userName, userOpt, cookieOpt);
      $.cookie.json = cachedJsonOption;

      return cookie;
    }

    function getCookie() {
      let cachedJsonOption = $.cookie.json;
      $.cookie.json = true;
      let cookie = $.cookie(userName);
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
            userOpt.lastShown = new Date;
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
        userOpt.lastShown = new Date;
        setCookie();

      }
    }

    function showPopUpDec() {
      let isShown = false;

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
      let $formOk = $(renderMess(submitOkMess)).appendTo($('body'));
      let $formFail = $(renderMess(submitFailMess)).appendTo($('body'));

      let $email = $subscribe.find('input[name="mail"]');
      let $submit = $subscribe.find('input[type="submit"]');
      let $wrapper = $submit.parent();
      let $pending = $('<div class="pending-block center mb20 mt20 hide">Отправляем данные ...</div>');
      let $error = $('<div class="err-block center mb20 mt20 hide">Почта уже подписана</div>');

      $wrapper
        .append($pending)
        .append($error);

      $popUpSimpleNews.formController({
        resolve: function (form) {
          let $submit = $formOk.find('input[type="submit"]');
          let email = $(form).find('input[name="mail"]').val();
          //console.log(email);

          showJbox($formOk);
          onSubscribe();

          if (dataLayer && $.isArray(dataLayer)) {
            //console.log('data layer');
            //console.dir(dataLayer);
            //console.log('email = ' + email);
            dataLayer.push(
              {'event': 'popupSubscription', 'popupSubscrEmail': email}
            );
          }

          $submit.one('click', function (e) {
            e.preventDefault();

            hideJbox();
          });

          $('body').one('jBox:afterClose', function () {
            window.location.reload(true);
          });
        },
        reject: function () {
          let $submit = $formFail.find('input[type="submit"]');

          showJbox($formFail);

          $submit.one('click', function (e) {
            e.preventDefault();

            showJbox($popUpSimpleNews);
          });
        },
        afterValidate: function (form) {
          let $error = $(form).find('.err-block');
          let $pending = $(form).find('.pending-block');
          let controller = this;

          if ($error.is(':visible')) {
            $error.fadeOut(200, function () {
              $pending.fadeIn(200);
            })
          } else {
            $pending.fadeIn(200);
          }

          //console.log($email.val());

          $.ajax({
            type: 'GET',
            url: '/simplenews/verify-subscribe/262/' + $email.val(),
            success: function (response) {
              //console.dir(arguments);

              if (parseInt(response.subscribed) === 0) {
                controller.sendRequest.apply(controller, [form, controller._resolve, controller._reject, controller._beforeSend]);
              } else {
                $pending.fadeOut(200, function () {
                  $error.fadeIn(200);
                });
              }

            },
            error: function (response) {
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
      let respondFormSource =
        '<div class="subscribe-form__box center hide">' +
        '<h2 class="mb20">' + (data.title) + '</h2>' +
        '<div class="mb30">' + (data.mess) + '</div>' +
        '<form>' +
        '<input class="form-submit" type="submit" value="Ok"/>' +
        '</form>' +
        '</div>';

      return respondFormSource;
    }

  })();

  /*mmenu tabs*/
  (function () {
    let mMenu = document.getElementById('mm-menu');
    let mMenuPanel = document.getElementById('m-panel');
    let $mMenuPanel = $(mMenuPanel);

    if (!mMenu || !mMenuPanel) return;

    let $tabName = $(mMenu.querySelectorAll('.tab-name'));

    $tabName.each(function () {
      let togglerController = this.jElementToggler;

      if (!togglerController) return;

      togglerController._onBeforeOpen = onBeforeOpen;
    });

    let $activeTab = $tabName.filter('.active');
    let activeToggler = $activeTab[0].jElementToggler;

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
      swipe: function (event, direction, distance, duration, fingerCount, fingerData) {
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
      $mMenuPanel.animate({left: '0'}, 300);
    }

    function onBeforeClose() {
      document.body.classList.remove('m-view');
      $mMenuPanel.animate({left: '-100%'}, 150);
    }
  })();

  /*hide footer mess*/
  (function () {
    let $toggler = $('.js__et-af-s');
    let options = {
      animation: 'fade',
      onBeforeClose: setCookie
    };

    if (checkCookie() || document.documentElement.clientWidth < 960) return;

    $toggler.jElementToggler(options);

    function checkCookie() {
      return !!$.cookie('hide-footer-capture');
    }

    function setCookie() {
      $.cookie('hide-footer-capture', true, {expires: 365, path: '/'});
    }
  })();

  /*cart*/
  (function () {
    let $cartBtn = $('.mm-menu .icon-shopping-cart.jbox');
    let isFullPage = false;
    let $window = $(window);

    setFullPageJbox();
    $window.on('resize', setFullPageJbox);

    function setFullPageJbox() {
      let ww = document.documentElement.clientWidth;

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
    let $mapWrappers = $('.map-wrap');

    if (!$mapWrappers.length) return;

    let firstScript = document.querySelectorAll('script')[0];
    let script = document.createElement('script');
    script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU';
    script.async = true;
    firstScript.parentNode.insertBefore(script, firstScript);

    script.addEventListener('load', function () {
      ymaps.ready(function () {
        $('body')
          .trigger('yamap:ready')
          .addClass('yamap-ready');

      });
    });

    $mapWrappers.each(function (i) {
      let $mapWrapper = $(this);
      let $map = $('<div></div>');
      let mapOverlayInit = mapOverlayInitClosure(this);

      $map
        .attr('id', 'map-' + i)
        .css({
          width: '100%',
          height: '400px'
        })
        .appendTo($mapWrapper);
      mapOverlayInit();

      let mapData = {
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
      let $mapWrapper = $(mapWrapper);
      let isActiveMap = false;

      return function () {
        $mapWrapper.on('mouseleave', function () {
          $mapWrapper.removeClass('active');
          isActiveMap = false;
        });
        $('body').on('click', function (e) {
          let target = e.target;

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
      }
    }

    function init(mapData) {
      let myMap = new ymaps.Map(mapData.id, {
        center: mapData.center,
        zoom: mapData.zoom
      }, {
        searchControlProvider: 'yandex#search'
      });

      //myMap.behaviors.disable('scrollZoom');

      let placemark = new ymaps.Placemark(mapData.placemarkData.coords,
        {
          hintContent: mapData.placemarkData.hintContent,
          balloonContent: mapData.placemarkData.balloonContent
        },
        {
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
    let $input = $('[name="mfb-shopsearch-populate"]');

    if (!$input.length) return;

    let _addOverlay = waiter(addOverlay, 1000);
    let $overlay = $('<div class="ajax-progress-overlay"></div>');

    $input.on({
      'input': _addOverlay,
      'autocompleteresponse': removeOverlay
    });

    function addOverlay() {
      //let input = this;
      let $input = $(this);
      let $parent = $input.closest('.container-inline');

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
      let timer;

      return function () {
        let args = arguments;

        if (bindedThis === undefined) {
          bindedThis = this;
        }

        clearTimeout(timer);
        timer = setTimeout(function () {
          func.apply(bindedThis, args);
        }, ms);
      }
    }
  })();

  /*preloader*/
  (function () {
    let $preloader = $(document.getElementById('preloader'));

    $preloader.fadeOut();
  })();

  /*tour master*/
  (function () {
    let $startBtn = $('.tour-master-start');
    let $adminMenu = $('.menu_adminflex__wrap');
    let $fullPage = $('.fullpage');
    let cachedFullPagePaddingLeft;
    let steps = [
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
      {
        element: '.js__jtour-step3',
        title: 'step 3',
        tag: 'Функциональные опции интернет-магазина',
        content: 'some bla-bla-bla',
        path: '/review/flex_admin_tour/test2.html'
      },
      {
        element: '.js__jtour-step4',
        title: 'step 4',
        tag: 'Процессы для юридических лиц',
        content: 'some bla-bla-bla',
        animateType: 'highlight',
        path: '/review/flex_admin_tour/test2.html'
      },
      {
        element: '.js__jtour-step5',
        title: 'step 5',
        tag: 'Процессы для юридических лиц',
        content: 'some bla-bla-bla',
        path: '/review/flex_admin_tour/test.html'
      }
    ];
    let options = {
      tours: [],
      steps: steps,
      defaultTourOptions: {
        isMenu: true,
        addMenuMethod: function ($menu, container, controller) {
          $menu
            .find('.title')
            .text(controller.title);
          cachedFullPagePaddingLeft = $fullPage.css('padding-left');

          $menu
            .css({left: '-100%', zIndex: '9750'})
            .appendTo($(document.body))
            .animate({left: '0'},
              {
                duration: 400,
                queue: false
              }
            );
          $adminMenu.animate({left: '-100%'}, {duration: 400, queue: false});
          $(document.body).addClass('tour-menu-active');

        },
        removeMenuMethod: function ($menu) {
          $menu.animate({left: '-100%'},
            {
              duration: 400,
              queue: false,
              complete: () => {
                $menu.remove();
              }
            }
          );
          $adminMenu.animate({left: '0'}, {duration: 400, queue: false});
          $(document.body).removeClass('tour-menu-active');
        }
      }
    };
    let tourMaster = null;

    getTours()
      .then(tours => {
        options.tours = tours;
        tourMaster = $.jTourMaster(options);

        $startBtn.on('click', function (e) {
          e.preventDefault();

          tourMaster.start();
        });

        startMasterOnAdmin($.extend({}, options));
      })
      .catch(error => {
        console.dir(error);
      });


    function startMasterOnAdmin(options) {
      let isAdminPage = $adminMenu.length;
      let isNew = !$.cookie('admin-tour-first');
      let extraOptions = $.extend(true, {}, options, {
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

      let tourMaster = $.jTourMaster(extraOptions);
      tourMaster.start();
      $.cookie('admin-tour-first', 'true', {path: '/', expires: 365});
    }

    function getTours() {
      return new Promise((resolve, reject) => {
        $.getJSON('/admin/flex-master', function (response, status, xhr) {
          if (xhr.status === 200) {
            resolve(parseTours(response));
          } else {
            reject(response);
          }

        })
          .fail(function (response) {
            reject(response);
          });
      });
    }

    function parseTours(tours) {
      let newTours = [];

      tours.forEach((tour) => {
        let newTour = {
          steps: []
        };
        let steps = tour.steps;

        for (let key in tour) {
          if (key === 'steps') {
            continue;
          }

          newTour[key] = tour[key];
        }

        steps.forEach((step) => {
          newTour.steps.push(parseStep(step));
        });

        newTours.push(newTour);
      });

      return newTours;
    }

    function parseStep(step) {
      let stepMapper = {
        animatetype: 'animateType',
        ismenustep: 'isMenuStep',
        menutitle: 'menuTitle',
        onelement: 'onElement'
      };
      let handlerMapper = {
        'saveNGo': saveNGo
      };
      let newStep = {};

      for (let key in step) {
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
      let $target = $(e.target);
      let tour = e.data.tourController;

      e.preventDefault();

      setTimeout(() => {
        $target.trigger(tour.activeStep.onElement.event);
      }, 50);
      tour.bindNextStep();
    }

    /*debugger*/
    window.deleteCookieTour = function () {
      $.removeCookie('admin-tour-first', {path: '/', expires: 365});
    };
  })();

  /*admin menu extention*/
  (function () {
    const menu = document.querySelector('.menu_adminflex.operations .menu');

    if (!menu) return;

    class AdminMenu {
      constructor(options) {
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

      init() {
        let $menu = this.$menu = $(this.menu);

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

      stop() {
        this.$menu.off({
          'click touch': this._closeHandler,
          'mouseover': this._onMouseover,
          'mouseout': this._onMouseout
        });
        this.$menu.off({
          'click touch': this._spinnerActivate
        });
        this.$liFullscreen
          .find(this.closeBtnSelector)
          .remove();
      }

      onMouseover(e) {
        if (this.$liHovered) return;

        let $target = $(e.target);
        let $liCurrent = $target.closest(this.$liExpanded);

        if (!$liCurrent.length) return;

        this.$liHovered = $liCurrent;
        this.hoverDebounce($liCurrent);
      }

      onMouseout(e) {
        if (!this.$liHovered) return;

        let $relatedTarget = $(e.relatedTarget);
        let $liCurrent = $relatedTarget.closest(this.$liHovered);

        if ($liCurrent.length) return;

        this.$liHovered.removeClass(this.classHovered);
        this.$liHovered = null;
      }

      closeHandler(e) {
        const $target = $(e.target);

        if (!$target.closest(`${this.closeBtnSelector}, a`).length) return;

        let $liHovered = this.$liHovered;

        if (!$liHovered) return;

        $liHovered
          .addClass(this.classUnhovered)
          .removeClass(this.classHovered);

        setTimeout(function () {
          $liHovered.removeClass(this.classUnhovered);
          this.$liHovered = null; //на всякий случай обнуляем активный li
        }.bind(this), 50);
      }

      hoverDebounce($el) {
        setTimeout(function () {
          if (!this.$liHovered || !$el.is(this.$liHovered)) return;

          $el.addClass(this.classHovered);
        }.bind(this), this.hoverDelay);
      }

      renderCloseBtn(i, el) {
        let $ul = $(el).children('.menu');

        $ul.append(this.closeBtnTpl);
      }

      spinnerActivate(e) {
        let target = e.target;

        if (!target.closest('a')) return;

        this.$preloader.addClass('active');
      }
    }

    const adminMenu = new AdminMenu({
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
    const menu = document.querySelector('.menu_adminflex.operations .menu');

    if (!menu) return;

    class Search {
      constructor(options) {
        this.menu = options.menu;
        this.className = {
          hidden: 'js__search-hidden'
        };

        this.init();
      }

      init() {
        this.bindElements();
        this.bindHandlers();
        this.attachHandlers();
      }

      searchHandler(e) {
        let target = e.target;
        let type = e.type;

        switch (type) {
          case 'input' :
            let search = target.value;

            this.filterFields(this.$searchItemns, search);

            if (search) {
              this.$searchReset.removeClass(this.className.hidden);
              this.$searchSubmit.addClass(this.className.hidden);
            } else {
              this.$searchReset.addClass(this.className.hidden);
              this.$searchSubmit.removeClass(this.className.hidden);
            }
            break;
          case 'submit' :
            e.preventDefault();
            this.filterFields(this.$searchItemns, this.$searchInput.val());
            break;
          case 'click' :
            if ($(target).closest(this.$searchReset).length) {
              this.$searchInput.val('');
              this.$searchReset.addClass(this.className.hidden);
              this.$searchSubmit.removeClass(this.className.hidden);
              this.filterFields(this.$searchItemns, null);
            }
            break;
        }

      }

      renderSearch() {
        let searchTpl = `<li class="search-field">
            <form>
                <label class="search-input"><input type="text" placeholder="${Drupal.t('search in menu')}" name="search"/></label>
                <div class="search-reset ${this.className.hidden}"></div>
                <label class="search-submit"><input type="submit"/></label>
            </form>
           </li>`;
        let $searchBlock = $(searchTpl);
        this.$searchInput = $searchBlock.find('.search-input input');
        this.$searchReset = $searchBlock.find('.search-reset');
        this.$searchSubmit = $searchBlock.find('.search-submit');

        //this.$menu.append($searchBlock);

        return $searchBlock;
      }

      bindElements() {
        this.$menu = $(this.menu);
        this.$searchItemns = this.$menu.children('li.expanded, li.leaf');
        this.$searchBlock = this.renderSearch();

        this.$menu.prepend(this.$searchBlock);
      }

      bindHandlers() {
        this._searchHandler = this.searchHandler.bind(this);
      }

      attachHandlers() {
        this.$searchBlock.on('input submit click', this._searchHandler);
      }

      filterFields($searchItems, search) {
        let _ = this;

        if (!search) {
          $searchItems
            .removeClass(_.className.hidden)
            .find(`.${_.className.hidden}`)
            .removeClass(_.className.hidden);

          return;
        }

        $searchItems.each(function () {
          let $el = $(this);
          let text = this.textContent.toLowerCase();
          let loweredSearch = `${search}`.toLowerCase();

          if (!search) {
            $el.removeClass(_.className.hidden);
            return;
          }

          if (~text.indexOf(loweredSearch)) {
            let $submenu = $el.children('ul.menu');
            let $childrenNotMenu = $el.children().not('ul.menu');
            let submenuText = $submenu.text().toLowerCase();
            let childrenNotMenuText = $childrenNotMenu.text().toLowerCase();

            $el.removeClass(_.className.hidden);

            if ($submenu.length
              && ~submenuText.indexOf(loweredSearch)
              && !~childrenNotMenuText.indexOf(loweredSearch)) {
              _.filterFields($submenu.children('li'), loweredSearch);
            } else if ($submenu.length) {
              $submenu
                .find(`.${_.className.hidden}`)
                .removeClass(_.className.hidden);
            }

          } else {
            $el.addClass(_.className.hidden);
          }
        });
      }
    }

    let $menu = $(menu);
    let $searchedMenus = $menu.find('> li.expanded > .menu');

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
    const $targetInput = $('[name="submitted[source]"]');
    const pathname = window.location.pathname;

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
      attach: function (context) {
        let $promocodeWrap = $('.coupon-expand-block', context);
        let $error = $('.messages.error', context);

        if ($promocodeWrap.length) {
          $promocodeWrap.once(function () {
            let $el = $(this);

            $el.on('click', 'label[for="edit-coupons-skidka"]', function () {
              let $btnPromo = $el.find('.btn_promo');

              $el.removeClass('active');
              $btnPromo.show();
            });

            $el.on('click', '.btn_promo', function () {
              let $promocode = $el.find('.promo-code');
              let $btn = $(this);

              $btn.hide();
              $el.addClass('active');
              $promocode.show();
            });

            afterUpdateCupon($el);
          });
        } else if ($error.length) {
          $error.once(function () {
            let $el = $(this);
            let $promocodeWrap = $el.closest('.coupon-expand-block');
            let $btn = $promocodeWrap.siblings('.btn_promo');

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
      let cuponWasDeleted = ~$cuponHtml.text().indexOf('был удален из вашего заказа');
      let $cuponActive = $cuponHtml.find('#uc-coupon-active-coupons');
      let $error = $cuponHtml.find('.messages.error');
      let discount = parseInt($('.line-item-discount .amount').text());
      let $cuponInputWrapper = $cuponHtml.find('.code');
      // let $updateCartBtn = $('#edit-actions input[id^="edit-update-ajax"]');
      let $updateCartBtn = $('.form-actions input[id^="edit-update-ajax"]');


      if ($error.length) {
        $cuponInputWrapper.addClass('error-code');
      }

      if (($cuponActive.length && !discount) || (!$cuponActive.length && discount) || (cuponWasDeleted && discount)) {
        $updateCartBtn.trigger('mousedown');
      }

      if (!$cuponActive.length && !$error.length) {
        renderButton($cuponHtml);
      }
    }

    /*render cupon*/
    function renderButton($cuponHtml) {
      let $renderedBtn = $cuponHtml.siblings('.btn_promo');
      let $newBtn = $('<div class="btn_promo btn small simple">У меня есть промо-код</div>');

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
    let options = {
      searchedEl: '.price, .prices, .subtotal, .sum, .total-sum, .shipping, .total, .uc-price, .amount, .icon-cashback',
      pattern: 'руб.',
      classes: 'icon ic-rub'
    };
    let textReplacer = $.jFlex.textReplacer(options);

    Drupal.behaviors.lettersToIcon = {
      attach: function (context) {
        textReplacer.run(context);
      }
    };
  })();

  /*cart toggler drupal behavior*/
  (function () {
    Drupal.behaviors.buttonsBox = {
      attach: function (context) {
        $(context).once(function () {
          let $el = $(this);

          if (!$el.hasClass('cart-qty-items-count')) return;

          togglerCartWorking($el);
        });

        $('.buttons__box .cart-qty-items-count', context).once(function () {
          togglerCartWorking($(this));
        });
      }
    };


    function togglerCartWorking($counter) {
      let $cartBtn = $('.js__et-cart-toggler');
      let qty = parseInt($counter.text());

      if (qty > 0) {
        $cartBtn.trigger('jElementToggler:start');
      } else if (qty === 0) {
        $cartBtn
          .trigger('jElementToggler:close')
          .trigger('jElementToggler:stop');
      }
    }
  })();

  /*cart content-toggler checkout*/
  (function () {
    let isDisabled = false;

    Drupal.behaviors.contentTogglerCheckout = {
      attach: function (context) {
        $('.cart-info .content-toggler', context).once(function () {
          let $toggler = $(this);

          togglerEnabling($toggler);
          $(window).on('resize', togglerEnabling.bind(null, $toggler));
        });

      }
    };

    function togglerEnabling($toggler) {
      let wWidth = document.documentElement.clientWidth;

      if (wWidth > 640 && !isDisabled) {
        $toggler
          .trigger('jElementToggler:open', ['simple'])
          .trigger('jElementToggler:stop');
        isDisabled = true;
      } else if (wWidth <= 640 && isDisabled) {
        $toggler
          .trigger('jElementToggler:start')
          .trigger('jElementToggler:close', ['simple']);
        isDisabled = false;
      }
    }
  })();

  /*toggler live chat*/
  (function () {
    Drupal.behaviors.liveChatContentToggler = {
      attach: context => {
        const $togglerBtn = $('.js__et-support-chat', context);
        const $openBtn = $('.support-chat-open', context);

        $togglerBtn.once(function () {
          const $btn = $(this);
          const $parent = $('.j_crm-chat--content-wrap');
          const options = {
            onBeforeOpen: () => {
              $parent.removeClass('j_crm-chat--collapsed');
              if ($btn.hasClass('j_crm-chat--button-circle')) {
                if (document.documentElement.clientWidth < 960) {
                  $btn.animate({bottom: "-70px",}, 200);
                } else {
                  $btn.animate({right: "-70px",}, 200);
                }
              } else {
                $btn.animate({bottom: "-50px"}, 200);
              }
            },
            onAfterClose: () => {
              $parent.addClass('j_crm-chat--collapsed');
              if ($btn.hasClass('j_crm-chat--button-circle')) {
                if (document.documentElement.clientWidth < 960) {
                  $btn.animate({bottom: "20px",}, 200);
                } else {
                  $btn.animate({right: "15px",}, 200);
                }
              } else {
                $btn.animate({bottom: "0"}, 200);
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
          const $btn = $(this);

          $btn.on('click', e => {
            e.preventDefault();
            const $toggler = $('.js__et-support-chat');

            $toggler.trigger('jElementToggler:open');
          });
        });
      }
    };

    Drupal.behaviors.liveChatKeyMap = {
      attach: context => {
        const $message = $('.support-chat__message', context);

        $message.once(function () {
          /*send message*/
          (()=> {
            const $textarea = $(this).find('textarea');
            const $submit = $(this).find('.message-submit input[type="submit"]');
            const options = {
              extraSpace : 0,
              limit: 120
            };

            $textarea.autoResize(options);
            $textarea.on('keydown', e => {
              if (e.keyCode !== 13) return;
              e.preventDefault();

              if (e.shiftKey) {
                e.target.value = `${e.target.value}\n`;
              } else {
                $submit.trigger('mousedown');
              }
            });
          })();

          /*upload attachment*/
          (()=>{
            const $fileWidget = $(this).find('.file-widget.form-managed-file');
            const $input = $fileWidget.find('input[type="file"]');
            const $submit = $fileWidget.find('input[type="submit"]');

            $input.on('change', () => {
              setTimeout(()=>{
                if (
                  $fileWidget.find('.file-upload-js-error').length
                  || ($input.prop('files') && !$input.prop('files').length)
                ) return;
                $submit.trigger('mousedown');
              }, 50);
            });
          })();

          /*input[type=file] open*/
          (()=>{
            const $openFileBtn = $('.btn_file-open', $message);
            const $toggler = $('.file-widget.form-managed-file input[type=file]', $message);

            $openFileBtn.once(function () {
              const $btn = $(this);

              $btn.on('click', e => {
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
      attach: context => {
        const $chatElements = $('.file-widget', context);

        $chatElements.once(setHeightChatBody);
      }
    };

    Drupal.behaviors.liveChatBodySetHeightOnResize = {
      attach: context => {
        const $body = $('body', context);

        $body.once(function () {
          const $chat = $('.j_crm-chat');

          if (!$chat.length) return;
          $(window).on('resize', setHeightChatBody);
        })
      }
    };

    /*support chat body height set*/
    function setHeightChatBody() {
      const $contentWrap = $('.j_crm-chat--content-wrap');
      const $topBlock = $('.support-chat__top-block');
      const $message = $('.support-chat__message');
      const $chatBody = $('.support-chat__body');
      const $operatorList = $('.support-chat__operator_list');

      $contentWrap.show();

      const mainHeight = document.documentElement.clientHeight;
      const messageHeight = $message.outerHeight();

      let topBlockHeight = $topBlock.outerHeight();
      let chatBodyHeight = (mainHeight - topBlockHeight - messageHeight) + 'px';

      if (parseFloat(chatBodyHeight) < 300) {
        $operatorList.hide();
        topBlockHeight = $topBlock.outerHeight();
        chatBodyHeight = (mainHeight - topBlockHeight - messageHeight) + 'px';
      }

      if (parseFloat(chatBodyHeight) > 299 && document.documentElement.clientWidth >= 960) {
        $operatorList.show();
        topBlockHeight = $topBlock.outerHeight();
        chatBodyHeight = (mainHeight - topBlockHeight - messageHeight) + 'px';
      }

      if ($contentWrap.hasClass('j_crm-chat--collapsed')) {
        $contentWrap.hide();
      }

      $chatBody.css({
        height: chatBodyHeight
      })
    }
  })();

  /*userLogin on cart*/
  (function () {
    Drupal.behaviors.userLoginCart = {
      attach: function (context) {
        let $userLoginWrap = $('#user_login__wrap', context);

        $userLoginWrap.once(function () {
          let $wrap = $(this);
          let $btn = $wrap.find('#user_login_btn');
          let $userLogin = $wrap.find('.user_login');
          let $userLoginForm = $wrap.find('.user_login_form');

          $btn.on('click', function (e) {
            e.preventDefault();

            $userLogin.hide();
            $userLoginForm
              .removeClass('hidden')
              .hide()
              .slideDown(200);
          });
        });
      }
    };
  })();

  /*ajax overlay on*/
  (function () {
    Drupal.behaviors.ajaxOverlayOnTrobber = {
      attach: function (context) {
        let $throbbers = $('.ajax-progress-throbber', context);
        let $ajaxOverlay = $('.ajax-progress-overlay.ajax-custom', context);
        let $throbberGlobal = $('.ajax-progress-throbber');

        $ajaxOverlay.once(function () {
          let $currOverlay = $(this);
          let $throbber = $currOverlay.siblings('.ajax-progress-throbber');
          let $parent = $currOverlay.parent();


          if ($throbber.length) return;

          $currOverlay.remove();
          $parent.css({
            position: ''
          });
        });


        $throbbers.once(function () {
          let $throbber = $(this);
          let $overlay = $('<div class="ajax-progress-overlay ajax-custom"></div>');
          let $parent = $throbber.parent();

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
      attach: function (context) {
        $('.editablefield-item').once('editablefield', function () {
          var $this = $(this);

          // There is only one editable field in that form, we can hide the submit
          // button.
          if ($this.find('input[type=text],input[type=checkbox],textarea,select').length == 1 || $this.find('select.use-select-2').length == 1 || $this.find('input[type=radio] ').length > 1) {
            $this.find('input.form-submit').hide();
            $this.find('input[type=text],input[type=checkbox],input[type=radio],textarea,select').change(function () {
              var $input = $this.find('textarea, input[type="text"], select');

              $input
                .css('background', '')
                .addClass('input-disabled input-progress')
                .prop('readonly', true);

              if ($input.is('select.use-select-2')) {
                $input.select2('readonly', true);
                $input
                  .siblings('.select2-container')
                  .find('.select2-choice')
                  .addClass('input-progress');
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
      attach: function (context) {
        let $cities = $('.city-block .cities', context);

        $cities.once(function () {
          let $currCities = $(this);
          let $citiesGroup = $currCities.find('.cities-group');
          let citiesWidth = ($currCities.outerWidth() - $currCities.width()) + $currCities.width() * $citiesGroup.length;

          $currCities.width(citiesWidth);
        });
      }
    };


  })();

  /*development admin menu toggler*/
  (function () {
    Drupal.behaviors.adminMenuToggler = {
      attach: function (context) {
        let $adminMenu = $('.menu_adminflex__wrap', context);

        $adminMenu.once(function () {
          let $menu = $(this);
          let isMenuDisabled = $.cookie('adminMenuDisabled');

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
      $.cookie('adminMenuDisabled', true, {path: '/'});
    }

    function enableAdminMenu() {
      $.removeCookie('adminMenuDisabled', {path: '/'});
    }
  })();

  /* delegate submit click in ctools-modal-content*/
  (function () {
    Drupal.behaviors.delegatedSubmit = {
      attach: context => {
        if (context !== '#modalContent') return;
        $(context).once(function () {
          const $modal = $(this);
          const $submitBtn = $('#edit-submit', $modal);
          const $modalHeader = $('.modal-header', $modal);
          const $delegatedBtn = $('<div class="btn_delegated-submit btn small simple">Сохранить конфигурацию</div>');

          $modalHeader.append($delegatedBtn);
          $delegatedBtn.on('click', () => {
            $submitBtn.trigger('click');
          });
        });
      },
  };
    
  })();
})(jQuery);
