/*initial*/
jQuery(document).ready(function($) {

  /*slick init*/
  (function() {
    if (!$.fn.slick) return;

    /*default slick*/
    (function () {
      var $simpleSlick = $('.js__slick');

      $simpleSlick.each(function () {
        var options = {};
        var $slick = $(this);
        var dataStr = $slick.attr('data-slick-options');
        var hasCustomStyleClass = !!$slick.find('[class*="js__slick-s_"]').length;
        var addToCartCelector = 'input.node-add-to-cart.form-submit.ajax-processed';

        if (dataStr) {
          options = $.extend(true, {}, options, JSON.parse(dataStr))
        }

        if ($slick.hasClass('js__slick-dots')) {
          options.dots = true;
        }

        if (hasCustomStyleClass) {
          var customClassHandler = customClassAttacher();

          $slick
            .on({
              'afterChange init reinit': customClassHandler
            });
        }

        if ($slick.find(addToCartCelector).length) {
          /*fix for duplicating add to cart buttons*/
          $slick.on('ucAjaxCartAltResponse', refreshOnUcAjaxCartAltResponse.bind(null, $slick));
        }

        refreshOnRetinaShow($slick);

        $slick.slick(options);
      });
    })();

    /*slick with thumbs*/
    (function() {
      var $slickWThumbs = $('.js__slick-thumbs-master');

      $slickWThumbs.each(function() {
        var $sliderMaster = $(this);
        var slickMaster = $sliderMaster.slick('getSlick');
        var $sliderSlave = $sliderMaster.parent().find('.js__slick-thumbs-slave');

        proccessSliderVisibilityOptions($sliderSlave, 1);
        $sliderSlave.on('click', {slickMaster: slickMaster}, onSlaveSlide);
      });
    })();

    /*default slick func*/

    function customClassAttacher() {
      var currStyleClass = null;

      return function (e, controller, slideIndex) {
        slideIndex = slideIndex || 0;
        var $slider = controller.$slider;
        var currSlide = controller.$slides[slideIndex];

        if (currStyleClass) {
          $slider.removeClass(currStyleClass);
        }

        currStyleClass = getPartialClass(currSlide, 'js__slick-s_');

        if (currStyleClass) {
          $slider.addClass(currStyleClass);
        }
      }
    }

    function getPartialClass(el, classStart) {
      var classStr = el.className;
      var startPos = classStr.indexOf(classStart);

      if (!~startPos) return null;

      var endPos = ~classStr.indexOf(' ', startPos) ? classStr.indexOf(' ', startPos) : undefined;

      return classStr.slice(startPos, endPos);
    }

    function refreshSlider(slider) {
      var $slider = $(slider);

      if (!$slider.length) return;

      $slider.each(function (i, el) {
        el.slick.refresh(true);
      });
    }

    function getRetinaImg(el) {
      return $(el).find('.retina:not(.retina-show)');
    }

    function refreshOnRetinaShow(slider) {
      var $retinaNotLoadedImg = getRetinaImg(slider);
      var $retinaLoadedImg = $(0);

      if (!$retinaNotLoadedImg.length) return;

      var retinaShowHandler = function (e) {
        $retinaLoadedImg = $retinaNotLoadedImg.add(e.target);

        if ($retinaNotLoadedImg.not($retinaLoadedImg).length) return;

        refreshSlider(slider);
      };

      $(slider).on('retina:show', retinaShowHandler);
    }

    function refreshOnUcAjaxCartAltResponse(slider) {
      setTimeout(function() {
        refreshSlider(slider);
      }, 1000);
    }

    /*slick with thumbs func*/

    function onSlaveSlide(e) {
      var el = e.target;
      var slide = el.closest('.slick-slide');
      var slaveSlider = el.closest('.slick-slider');

      if (!slide) return;
      e.preventDefault();

      var slickMaster = e.data.slickMaster;
      var slideIndex = parseInt(slide.getAttribute('data-slick-index'));

      slideIndex = slideIndex >= 0 ? slideIndex: slideIndex * -1;

      slickMaster.slickGoTo(slideIndex);
      setFocusedSlide($(slaveSlider), $(slide));
    }

    function setFocusedSlide($slider, $focusedSlide) {
      var focusedClass = 'focused';
      var $oldFocusedSlides = $slider.find('.' + focusedClass).not($focusedSlide);

      $oldFocusedSlides.removeClass(focusedClass);
      $focusedSlide.addClass(focusedClass);
    }

    function proccessSliderVisibilityOptions($slider, unslickCount) {
      var slick = $slider.slick('getSlick');
      var slidesCount = $slider.find('.slick-slide:not(.slick-cloned)').length;
      var slidesToShowOption = slick.slickGetOption('slidesToShow');
      var responsiveOptions = slick.slickGetOption('responsive');

      if (slidesCount <= unslickCount) {
        $slider
          .hide()
          .slick('unslick');
        return;
      }

      if (slidesToShowOption > 1 && slidesToShowOption > slidesCount) {
        slick.slickSetOption('slidesToShow', slidesCount, true);
      }

      if (responsiveOptions) {
        var isChanged = false;

        for (var key in responsiveOptions) {
          var settings = responsiveOptions[key].settings;

          if (settings.slidesToShow && settings.slidesToShow > slidesCount) {
            settings.slidesToShow = slidesCount;
            isChanged = true;
          }
        }

        if (isChanged) {
          slick.slickSetOption('responsive', responsiveOptions, true);
        }
      }
    }
  })();

  /*fixedMenu init*/
  (function() {
    if (!$.fn.fixedMenu) return;

    /*main menu*/
    (function () {
      var $menu = $('.js__fixed-menu');

      $menu.each(function () {
        var $currMenu = $(this);

        $currMenu.fixedMenu({
          fixedClass: 'js__top-fixed shadow',
          pageSearch: $currMenu.hasClass('js__fixed-menu-pagesearch'),
          pageSearchBlock: $currMenu.attr('data-fixed-menu-searchtarget') || undefined
        });
      });


      /*$(menuElem).fixedMenu({
       fixedClass: 'js-top-fixed', //string, default = 'js-top-fixed', class for menu block
       pageSearch: true, //boolean, dafault = true, search blocks by anchors in menu, under menu
       pageSearchBlock: '.someSearchBlock', //dom element , default equal to menu element
       pageSearchClass: 'active', // default = 'active', class for active link
       delay: 100 //default = 100, integrer, delay setting active link on scroll for better perfomance
       });*/
    })();
  })();

  /*jElementToggler init*/
  (function() {
    if (!$.fn.jElementToggler) return;

    /*toggler simple*/
    (function() {
      var $toggler = $('.js__et');
      var options = {};

      $toggler.each(function () {
        $(this).jElementToggler(options);
      });
    })();

    /*toggler no animate*/
    (function() {
      var $toggler = $('.js__et-na');
      var options = {
        animation: 'none'
      };

      $toggler.each(function () {
        $(this).jElementToggler(options);
      });
    })();

    /*toggler fade*/
    (function() {
      var $toggler = $('.js__et-fa');
      var options = {
        animation: 'fade'
      };

      $toggler.each(function () {
        $(this).jElementToggler(options);
      });
    })();

    /*toggler slide*/
    (function() {
      var $toggler = $('.js__et-sla');
      var options = {
        animation: 'slide'
      };

      $toggler.each(function () {
        $(this).jElementToggler(options);
      });
    })();

    /*toggler simple parent lvl 1*/
    (function() {
      var $toggler = $('.js__et-p1');
      var options = {
        getTarget: function ($btn) {
          return $btn.parent().find($btn.attr('data-et-target') || $btn.attr('href'));
        }
      };

      $toggler.each(function () {
        $(this).jElementToggler(options);
      });
    })();

    /*toggler no animate  parent lvl 1*/
    (function() {
      var $toggler = $('.js__et-na-p1');
      var options = {
        getTarget: function ($btn) {
          return $btn.parent().find($btn.attr('data-et-target') || $btn.attr('href'));
        },
        animation: 'none'
      };

      $toggler.each(function () {
        $(this).jElementToggler(options);
      });
    })();

    /*toggler fade  parent lvl 1*/
    (function() {
      var $toggler = $('.js__et-fa-p1');
      var options = {
        getTarget: function ($btn) {
          return $btn.parent().find($btn.attr('data-et-target') || $btn.attr('href'));
        },
        animation: 'fade'
      };

      $toggler.each(function () {
        $(this).jElementToggler(options);
      });
    })();

    /*toggler slide  parent lvl 1*/
    (function() {
      var $toggler = $('.js__et-sla');
      var options = {
        getTarget: function ($btn) {
          return $btn.parent().find($btn.attr('data-et-target') || $btn.attr('href'));
        },
        animation: 'slide'
      };

      $toggler.each(function () {
        $(this).jElementToggler(options);
      });
    })();

    /*tabs*/
    (function() {
      var $tabWrapper = $('.tab-name-wrap');

      $tabWrapper.each(function (i) {
        var $currTabWrapper = $(this);
        var $tabs = $currTabWrapper.children('.tab-name');
        var $activeTab = chooseActiveTab($tabs);
        var $select = $($currTabWrapper.attr('data-select-selector'));
        var options = {
          listenedEl: $currTabWrapper,
          groupName: 'tab-group-' + i,
          disallowedActions: ['close'],
          getTarget: function ($currTab) {
            var index = $tabs.index($currTab);
            var $targetContainer = $($currTabWrapper.attr('data-selector'));

            return $targetContainer.children().eq(index);
          },
          onBeforeOpen: function (controller) {
            var $target = controller._$target;

            $target.show();
            refreshSlider($target);
            $target.hide();
          }
        };

        $currTabWrapper.children().first().addClass('first');
        $currTabWrapper.children().last().addClass('last');


        if ($select.length) {
          var selectData = [];

          $tabs.each(function(i) {
            selectData.push({
              id: '' + i,
              text: this.textContent
            });
          });

          $select.select2({
            data: selectData,
            minimumResultsForSearch: 100
          });

          setActiveSelect($activeTab, $select);

          $select
            .on('change', function(e) {
              $tabs.eq(+e.val).trigger('jElementToggler:open');
            });

          $currTabWrapper.on('jElementToggler:beforeOpen', function (e, controller) {
            setActiveSelect(controller._$togglerBtn, $select);
          });
        }

        $tabs.each(function () {
          $(this).jElementToggler(options);
        });
      });

      function chooseActiveTab($tabs) {
        var $activeTab = $tabs.filter('.active');

        if ($activeTab.length === 0) {
          $activeTab = $tabs.first();
          $activeTab.addClass('active');
        } else if ($activeTab.length > 1) {
          $activeTab.not($activeTab.eq(0)).removeClass('active');
        }

        return $activeTab;
      }

      function refreshSlider(el) {
        var $el = $(el);
        var $slider = $el.find('.js__slick');

        if (!$slider.length) return;

        $slider.each(function(i, el) {
          el.slick.refresh(true);
        });
      }

      function setActiveSelect($currActiveTab, $select) {
        var index = $currActiveTab.parent().children().index($currActiveTab);

        if ($select && $select.length) {
          $select.select2("val", '' + index);
        }
      }
    })();
  })();

  /*jEqualSize init*/
  (function() {
    if (!$.fn.jEqualSize) return;

    /*equal size simple*/
    (function () {
      var $equalContainer = $('.js__equal');

      $equalContainer.each(function () {
        $(this).jEqualSize();
      });
    })();

    /*equal size selective*/
    (function () {
      var $equalContainer = $('.js__equal-select');
      var options = {
        children: '.js__equal-child'
      };

      $equalContainer.each(function () {
        $(this).jEqualSize(options);
      });
    })();

    /*equal size selective multiple children*/
    (function () {
      var $equalContainer = $('.js__equal-select-mult');
      var options = {
        children: ['.js__equal-child-1', '.js__equal-child-2', '.js__equal-child-3']
      };

      $equalContainer.each(function () {
        $(this).jEqualSize(options);
      });
    })();
  })();

  /*jEventAnimation init*/
  (function() {
    if (!$.fn.jEventAnimation) return;

    (function() {
      var $animatedEl = $('.js__jeventanimation');

      $animatedEl.each(function () {
        $(this).jEventAnimation();
      });
    })();
  })();

  /*jRangeBar init*/
  /*(function() {
   if (!$.fn.jRangeBar) return;

   Drupal.behaviors.jRangeBarInit = {
   attach: function(context) {
   /!*jRangeBar drupal catalog init*!/
   (function () {
   // Filter price on page catalog for 2 fields
   var $filterPrice = $('form#views-exposed-form-taxonomy-term-page-mefibs-form-filter-price, ' +
   'form#views-exposed-form-taxonomy-term-shopsearch-mefibs-form-filter-price');

   $filterPrice.each(function () {
   var $filterPrice = $(this);
   var $parent = $('#edit-mefibs-form-filter-price-sell-price-wrapper');
   var $min = $('input[name="mefibs-form-filter-price-sell_price[min]"]', $filterPrice).val(0);
   var $max = $('input[name="mefibs-form-filter-price-sell_price[max]"]', $filterPrice).val(200000);
   var $submit = $('.views-exposed-widget.views-submit-button', $filterPrice);
   var options = {
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

   //$min.before('<span class="preffix">' + 'от' + '</span>');
   //$max.before('<span class="preffix">' + 'до' + '</span>');

   $parent.jRangeBar(options);

   submitBtnLogic();

   function submitBtnLogic() {
   $submit.hide();

   $submit.hover(function (e) {
   if (!$max.val()) {
   $max.val(1000000);
   }
   });
   $min.on('input jRangeBar:change', btFn);
   $max.on('input jRangeBar:change', btFn);
   }

   function btFn() {
   if ($max.val() || $min.val()) {
   $submit.show();
   }
   else {
   $submit.hide();
   }
   }
   });
   })();
   }
   };
   })();*/

  /*jTooltip  init*/
  (function() {
    if (!$.fn.jTooltip) return;

    /*tooltip*/
    (function() {
      var $tooltips = $('[class*="js__jtooltip"]');

      $tooltips.each(function () {
        var $tooltip = $(this);
        var className = {
          positionTop: 'js__jtooltip-t',
          positionRight: 'js__jtooltip-r',
          positionBottom: 'js__jtooltip-b',
          positionleft: 'js__jtooltip-l'
        };
        var options = {};


        if ($tooltip.hasClass('js__jtooltip') || $tooltip.hasClass('js__jtooltip-horizontal')) { //temporary patch for changing hml layout
          return;
        }

        if ($tooltip.hasClass(className.positionTop)) {
          options.position = 'top';
        } else if ($tooltip.hasClass(className.positionRight)) {
          options.position = 'right';
        } else if ($tooltip.hasClass(className.positionBottom)) {
          options.position = 'bottom';
        } else if ($tooltip.hasClass(className.positionleft)) {
          options.position = 'left';
        }

        $tooltip.jTooltip(options);
      });
    })();

    /*depricated*/
    /*vertical*/
    (function () {
      var $tooltip = $('.js__jtooltip');
      var options = {};

      $tooltip.each(function() {
        $(this).jTooltip(options);
      });
    })();

    /*horizontal*/
    (function () {
      var $tooltip = $('.js__jtooltip-horizontal');
      var options = {
        position: 'right'
      };

      $tooltip.each(function() {
        $(this).jTooltip(options);
      });
    })();
  })();

  /*select2 init*/
  (function() {
    if (!$.fn.select2) return;

    /*simple no search*/
    (function () {
      var $simpleSelect = $('.js__select');
      var options = {
        minimumResultsForSearch: 100
      };
      var partialClass = 'js__select-s_';

      $simpleSelect.each(function() {
        var el = this;
        var $el = $(this);
        var currOptions = $.extend({}, options);
        var styleClass = getPartialClass(el, partialClass);

        if (styleClass) {
          currOptions.containerCssClass = styleClass;
          currOptions.dropdownCssClass = styleClass;
        }

        $el.select2(currOptions);
      });
    })();

    /*simple w search*/
    (function () {
      var $simpleSelectWSearch = $('.js__select-search');
      var options = {};
      var partialClass = 'js__select-s_';

      $simpleSelectWSearch.each(function() {
        var $el = $(this);
        var currOptions = $.extend({}, options);
        var styleClass = getPartialClass(this, partialClass);

        if (styleClass) {
          currOptions.containerCssClass = styleClass;
          currOptions.dropdownCssClass = styleClass;
        }

        $el.select2(currOptions);
      });
    })();

    /*dropdown*/
    (function () {
      var $dropdown = $('.js__dropdown');
      var options = {
        minimumResultsForSearch: 100
      };
      var partialClass = 'js__select-s_';

      $dropdown.each(function() {
        var $el = $(this);
        var currOptions = $.extend({}, options);
        var styleClass = getPartialClass(this, partialClass);

        if (styleClass) {
          currOptions.containerCssClass = styleClass;
          currOptions.dropdownCssClass = styleClass;
        }

        $el.select2(currOptions);
      });
    })();

    function getPartialClass(el, classStart) {
      var classStr = el.className;
      var startPos = classStr.indexOf(classStart);

      if (!~startPos) return null;

      var endPos = ~classStr.indexOf(' ', startPos) ? classStr.indexOf(' ', startPos) : undefined;

      return classStr.slice(startPos, endPos);
    }
  })();

  /*input mask init*/
  (function() {
    if (!$.fn.mask) return;

    (function () {
      var $phone = $('input.phone');
      var $date = $('input.date');

      $phone.each(function () {
        $(this).mask("+7 (999) 999-99-99?9");
      });
      $date.each(function() {
        $(this).mask("99/99/9999", {placeholder: "дд/мм/гггг"});
      });
    })();
  })();
});