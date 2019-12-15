/*initial*/
(function($) {

  /*slick init*/
  (function() {
    if (!$.fn.slick) return;

    Drupal.behaviors.slickInit = {
      attach: function(context) {
        /*default slick*/
        (function () {
          var $simpleSlick = $('.js__slick', context);

          $simpleSlick.once(function () {
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

            if ($slick.children().length <= 1) {
              options.dots = false;
            }

            refreshOnRetinaShow($slick);

            $slick.slick(options);

            initArrowSpace($slick);
          });
        })();

        /*slick with thumbs*/
        (function() {
          var $slickWThumbs = $('.js__slick-thumbs-master', context);

          $slickWThumbs.once(function() {
            var $sliderMaster = $(this);
            var slickMaster = $sliderMaster.slick('getSlick');
            var $sliderSlave = $sliderMaster.parent().find('.js__slick-thumbs-slave');
            var slaveSlick = $sliderSlave.slick('getSlick');
            var $slaveSlides = slaveSlick.$slides;

            $sliderSlave.slick('slickGoTo', slickMaster.slickCurrentSlide(), true);
            setFocusedSlide($sliderSlave,  $slaveSlides.eq(slickMaster.slickCurrentSlide()));
            //slaveSlick.$slides.eq(slickMaster.slickCurrentSlide()).trigger('click');

            proccessSliderVisibilityOptions($sliderSlave, 1);
            $sliderSlave.on('click', {slickMaster: slickMaster}, onSlaveSlide);
            $sliderMaster.on('afterChange', function (e, slick, currentSlide) {
              $sliderSlave.slick('slickGoTo', currentSlide, true);
              //slaveSlick.$slides.eq(currentSlide).trigger('click');
              setFocusedSlide($sliderSlave, $slaveSlides.eq(currentSlide));
            });
          });
        })();
      }
    };

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

    function initArrowSpace($slider) {
      var className = 'arrowspace';

      if (!$slider.hasClass(className)) return;

      var slick = $slider.slick('getSlick');
      var arrowsOpt = slick.slickGetOption('arrows');

      if (!arrowsOpt) {
        $slider.removeClass(className);
        return;
      }

      processArrowSpace($slider);
      $slider.on('setPosition', processArrowSpaceHandler)
    }

    function processArrowSpaceHandler(e) {
      var $slider = $(e.target);

      processArrowSpace($slider);
    }

    function processArrowSpace($slider) {
      var className = 'arrowspace';
      var hasArrows = !!$slider.find('.slick-arrow').length;

      if (hasArrows) {
        $slider.addClass(className);
      } else {
        $slider.removeClass(className);
      }
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
      var $slide = $slider.find('.slick-slide');
      var slidesCount = $slider.find('.slick-slide:not(.slick-cloned)').length;
      var slidesToShowOption = slick.slickGetOption('slidesToShow');
      var responsiveOptions = slick.slickGetOption('responsive');
      var vertical = slick.slickGetOption('vertical');

      if (slidesCount <= unslickCount) {
        $slider
          .hide()
          .slick('unslick');
        return;
      }

      if (slidesToShowOption > 1 && slidesToShowOption > slidesCount) {

        if (vertical) {
          $slider.css({
            height: ($slide.outerHeight() * slidesCount) + 'px',
            width: ''
          });
        } else {
          $slider.css({
            height: '',
            width: ($slide.outerWidth() * slidesCount) + 'px'
          });
        }

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
          slick.slickSetOption({}, true);
        }
      }
    }
  })();

  /*fixedMenu init*/
  (function() {
    if (!$.fn.fixedMenu) return;

    Drupal.behaviors.fixedMenuInit = {
      attach: function(context) {
        /*main menu*/
        (function () {
          var $menu = $('.js__fixed-menu', context);

          $menu.once(function () {
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
      }
    };
  })();

  /*jElementToggler init*/
  (function() {
    if (!$.fn.jElementToggler) return;

    Drupal.behaviors.jElementTogglerInit = {
      attach: function() {

        /*toggler simple*/
        (function() {
          var $toggler = $('.js__et');
          var options = {};

          $toggler.once(function () {
            $(this).jElementToggler(options);
          });
        })();

        /*toggler no animate*/
        (function() {
          var $toggler = $('.js__et-na', context);
          var options = {
            animation: 'none'
          };

          $toggler.once(function () {
            $(this).jElementToggler(options);
          });
        })();

        /*toggler fade*/
        (function() {
          var $toggler = $('.js__et-fa', context);
          var options = {
            animation: 'fade'
          };

          $toggler.once(function () {
            $(this).jElementToggler(options);
          });
        })();

        /*toggler slide*/
        (function() {
          var $toggler = $('.js__et-sla', context);
          var options = {
            animation: 'slide'
          };

          $toggler.once(function () {
            $(this).jElementToggler(options);
          });
        })();

        /*toggler simple parent lvl 1*/
        (function() {
          var $toggler = $('.js__et-p1', context);
          var options = {
            getTarget: function ($btn) {
              return $btn.parent().find($btn.attr('data-et-target') || $btn.attr('href'));
            }
          };

          $toggler.once(function () {
            $(this).jElementToggler(options);
          });
        })();

        /*toggler no animate  parent lvl 1*/
        (function() {
          var $toggler = $('.js__et-na-p1', context);
          var options = {
            getTarget: function ($btn) {
              return $btn.parent().find($btn.attr('data-et-target') || $btn.attr('href'));
            },
            animation: 'none'
          };

          $toggler.once(function () {
            $(this).jElementToggler(options);
          });
        })();

        /*toggler fade  parent lvl 1*/
        (function() {
          var $toggler = $('.js__et-fa-p1', context);
          var options = {
            getTarget: function ($btn) {
              return $btn.parent().find($btn.attr('data-et-target') || $btn.attr('href'));
            },
            animation: 'fade'
          };

          $toggler.once(function () {
            $(this).jElementToggler(options);
          });
        })();

        /*toggler slide  parent lvl 1*/
        (function() {
          var $toggler = $('.js__et-sla-p1', context);
          var options = {
            getTarget: function ($btn) {
              return $btn.parent().find($btn.attr('data-et-target') || $btn.attr('href'));
            },
            animation: 'slide'
          };

          $toggler.once(function () {
            $(this).jElementToggler(options);
          });
        })();

        /*tabs*/
        (function() {
          var $tabWrapper = $('.tab-name-wrap', context);

          $tabWrapper.once(function (i) {
            var $currTabWrapper = $(this);
            var $tabs = $currTabWrapper.children('.tab-name');
            var $activeTab = chooseActiveTab($tabs);
            var $select = $($currTabWrapper.attr('data-select-selector'));
            var options = {
              listenedEl: $currTabWrapper,
              groupName: 'tab-group-' + i,
              disallowedActions: ['close'],
              className: {
                active: 'active'
              },
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

            $tabs.once(function () {
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
      }
    };
  })();

  /*jEqualSize init*/
  (function() {
    if (!$.fn.jEqualSize) return;

    Drupal.behaviors.jEqualSizeInit = {
      attach: function(context) {
        /*equal size simple*/
        (function () {
          var $equalContainer = $('.js__equal', context);

          $equalContainer.once(function () {
            $(this).jEqualSize();
          });
        })();

        /*equal size selective*/
        (function () {
          var $equalContainer = $('.js__equal-select', context);
          var options = {
            children: '.js__equal-child'
          };

          $equalContainer.once(function () {
            $(this).jEqualSize(options);
          });
        })();

        /*equal size selective multiple children*/
        (function () {
          var $equalContainer = $('.js__equal-select-mult', context);
          var options = {
            children: ['.js__equal-child-1', '.js__equal-child-2', '.js__equal-child-3']
          };

          $equalContainer.once(function () {
            $(this).jEqualSize(options);
          });
        })();
      }
    };
  })();

  /*jEventAnimation init*/
  (function() {
    if (!$.fn.jEventAnimation) return;

    Drupal.behaviors.jEventAnimation = {
      attach: function(context) {
        (function() {
          var $animatedEl = $('.js__jeventanimation', context);

          $animatedEl.once(function () {
            $(this).jEventAnimation();
          });
        })();
      }
    };
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
            'form#views-exposed-form-taxonomy-term-shopsearch-mefibs-form-filter-price', context);

          $filterPrice.once(function () {
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

    Drupal.behaviors.jTooltipInit = {
      attach: function(context) {
        /*tooltip*/
        (function() {
          var $tooltips = $('[class*="js__jtooltip"]', context);

          $tooltips.once(function () {
            var $tooltip = $(this);
            var className = {
              positionTop: 'js__jtooltip-t',
              positionRight: 'js__jtooltip-r',
              positionBottom: 'js__jtooltip-b',
              positionleft: 'js__jtooltip-l'
            };
            var options = {};


            /*if ($tooltip.hasClass('js__jtooltip') || $tooltip.hasClass('js__jtooltip-horizontal')) { //temporary patch for changing hml layout
              return;
            }*/

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

        /*/!*depricated*!/
        /!*vertical*!/
        (function () {
          var $tooltip = $('.js__jtooltip', context);
          var options = {};

          $tooltip.once(function() {
            $(this).jTooltip(options);
          });
        })();

        /!*horizontal*!/
        (function () {
          var $tooltip = $('.js__jtooltip-horizontal', context);
          var options = {
            position: 'right'
          };

          $tooltip.once(function() {
            $(this).jTooltip(options);
          });
        })();*/
      }
    };
  })();

  /*select2 init*/
  (function() {
    if (!$.fn.select2) return;

    Drupal.behaviors.select2Init = {
      attach: function(context) {
        /*simple no search*/
        (function () {
          var $simpleSelect = $('.js__select', context);
          var options = {
            minimumResultsForSearch: 100
          };
          var partialClass = 'js__select-s_';

          $simpleSelect.once(function() {
            var el = this;
            var $el = $(this);
            var currOptions = $.extend({}, options);
            var styleClass = getPartialClass(el, partialClass);

            if (styleClass) {
              currOptions.containerCssClass = styleClass;
              currOptions.dropdownCssClass = styleClass;
            }

            $el.select2(currOptions);
            preventKeyboardOpen($el);
          });
        })();

        /*simple w search*/
        (function () {
          var $simpleSelectWSearch = $('.js__select-search', context);
          var options = {};
          var partialClass = 'js__select-s_';

          $simpleSelectWSearch.once(function() {
            var $el = $(this);
            var currOptions = $.extend({}, options);
            var styleClass = getPartialClass(this, partialClass);

            if (styleClass) {
              currOptions.containerCssClass = styleClass;
              currOptions.dropdownCssClass = styleClass;
            }

            $el.select2(currOptions);
            preventKeyboardOpen($el);
          });
        })();

        /*dropdown*/
        (function () {
          var $dropdown = $('.js__dropdown', context);
          var options = {
            minimumResultsForSearch: 100
          };
          var partialClass = 'js__select-s_';

          $dropdown.once(function() {
            var $el = $(this);
            var currOptions = $.extend({}, options);
            var styleClass = getPartialClass(this, partialClass);

            if (styleClass) {
              currOptions.containerCssClass = styleClass;
              currOptions.dropdownCssClass = styleClass;
            }

            $el.select2(currOptions);
            preventKeyboardOpen($el);
          });
        })();

        /*Virtual keyboard open on select fix*/
        (function () {
          if (!isMobile()) return;

          var $focusser = $('.select2-focusser', context);
          var $selectSearch = $('.select2-search', context);

          $focusser.remove();
          $selectSearch.remove();

          //var $select = $('select.use-select-2', context);

          //preventKeyboardOpen($select);

          //var $targetWrapper = $(('.select2-container', context);
          //var $selectDrop = $('.select2-drop', context);//.not('.select2-with-searchbox');

          /*$selectDrop.once(function () {
            $('.select2-search', this).remove();
          });*/

          /*$targetWrapper
            .find('.select2-focusser')
            //.prop('focus',false)
            //.hide()
            .remove();
          $targetWrapper
            .find('.select2-drop') //.not('.select2-with-searchbox')
            .find('.select2-search')
            //.prop('focus',false)
            //.hide()
            .remove();*/


          //var $selectContainer = $('.select2-container', context);

          /*$selectContainer.once(function () {
            $(this).find('.select2-focusser').hide();
            $(this).find('.select2-drop').not('.select2-with-searchbox').find('.select2-search').hide();
          });*/
        })();

        function getPartialClass(el, classStart) {
          var classStr = el.className;
          var startPos = classStr.indexOf(classStart);

          if (!~startPos) return null;

          var endPos = ~classStr.indexOf(' ', startPos) ? classStr.indexOf(' ', startPos) : undefined;

          return classStr.slice(startPos, endPos);
        }

        function isMobile() {
          return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
            || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4));
        }

        function preventKeyboardOpen($select) {
          //if (!isMobile()) return;

          $select.once(function () {
            $(this).on('select2-open select2-focus', function () {
              var $targetWrapper = $(this).siblings('.select2-container');

              $targetWrapper
                .find('.select2-focusser')
                //.prop('focus',false)
                //.hide()
                .remove();
              $targetWrapper
                .find('.select2-drop').not('.select2-with-searchbox')
                .find('.select2-search')
                //.prop('focus',false)
                //.hide()
                .remove();
            });
          });

        }
      }
    };
  })();

  /*input mask init*/
  (function() {
    if (!$.fn.mask) return;

    Drupal.behaviors.maskInit = {
      attach: function(context) {
        (function () {
          var $phone = $('input.phone', context);
          var $date = $('input.date', context);

          $phone.once(function () {
            $(this).mask("+7 (999) 999-99-99?9");
          });
          $date.once(function() {
            $(this).mask("99/99/9999", {placeholder: "дд/мм/гггг"});
          });
        })();
      }
    };
  })();
})(jQuery);

jQuery(document).ready(function ($) {
  /*scroll top btn*/
  (function () {
    var options = {
      tpl: '<div class="upper"></div>',
      animateSpeed: 200,
      offsetShow: '0'
    };
    var scrollBtn = $.scrollTopBtn(options);
  })();
});
