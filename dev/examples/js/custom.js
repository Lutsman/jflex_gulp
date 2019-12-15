/* custom jquery */

jQuery(document).ready(function ($) {

  /*tour*/
  (function () {
    var options = {
      steps: [
        {
          element: '.js__jtour-step1',
          title: 'step 1',
          content: 'some bla-bla-bla'
        },
        {
          element: '.js__jtour-step2',
          title: 'step 2',
          content: 'some bla-bla-bla'
        },
        {
          element: '.js__jtour-step3',
          title: 'step 3',
          content: 'some bla-bla-bla'
        },
        {
          element: '.js__jtour-step4',
          title: 'step 4',
          content: 'some bla-bla-bla',
          animateType: 'highlight'
        },
        {
          element: '.js__jtour-step5',
          title: 'step 4',
          content: 'some bla-bla-bla',
          path: '/review/master/test.html'
        }
      ]
    };
    var tour = $.jTour(options);
    var $startBtn = $('.start-tour');

    $startBtn.on('click', function () {
      tour.start();
    });
  })();

  /*janimator refresh*/
  (function () {
    /*$('span').on('click', function () {
      $(this).trigger('jEventAnimation:refreshEl');
    });*/
  })();

  /*slide counter catalog init*/
  /*(function () {
    // Filter price on page catalog for 2 fields
    var $filterPrice = $('form#views-exposed-form-taxonomy-term-page-mefibs-form-filter-price, ' +
      'form#views-exposed-form-taxonomy-term-shopsearch-mefibs-form-filter-price');
    if (!$filterPrice.length) return;

    var $parent = $('#edit-mefibs-form-filter-price-sell-price-wrapper');
    var $min = $('input[name="mefibs-form-filter-price-sell_price[min]"]', $filterPrice);
    var $max = $('input[name="mefibs-form-filter-price-sell_price[max]"]', $filterPrice);
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

    $parent.jRangeBar(options);

    $min.before('<span class="preffix">' + 'от' + '</span>');
    $max.before('<span class="preffix">' + 'до' + '</span>');

    submitBtnLogic();

    function submitBtnLogic() {
      $submit.hide();

      $submit.hover(function (e) {
        if (!$max.val()) {
          $max.val(1000000);
        }
      });
      $min.on('input slidecounter:change', btFn);
      $max.on('input slidecounter:change', btFn);
    }

    function btFn() {
      if ($max.val() || $min.val()) {
        $submit.show();
      }
      else {
        $submit.hide();
      }
    }
  })();*/

  /*retina emulation*/
  (function () {
    initImgRetina();

    /* img scale for retina displays */
    function initImgRetina() {
      var $ = jQuery;

      $('img.retina, .photo.retina>img').each(function () {
        var imgSize = getImgSize(this);
        var src = this.getAttribute('src');
        var dataSrc = this.getAttribute('data-src');

        if (imgSize.natWidth > 30 && (!dataSrc || dataSrc === src)) {
          resize(this);
        }
        else {
          loadImg(this);
        }
      });

      function resize (img) {
        var $img = $(img);
        if (!$img.hasClass('retina-show')) {
          var imgSize = getImgSize(img);
          var retinawidth = imgSize.natWidth / 2;
          var retinaheight = imgSize.natHeight / 2;

          $img.css({
            'width' : retinawidth,
            'height' : retinaheight
          }).addClass('retina-show');

          $img.trigger('retina:show');
        }
      }

      function getImgSize (img) {
        var $img = $(img);

        return {
          natHeight: $img.naturalHeight(),
          natWidth: $img.naturalWidth()
        };
      }

      function loadImg(img) {
        var $imgSource = $(img);
        var src = $imgSource.attr('data-src') || $imgSource.attr('src');
        var $imgClone = $('<img>');

        $imgClone.on('load', function() {
          $imgClone.remove();
          $imgSource
            .attr('src', src);

          resize($imgSource);
        });

        $imgClone.attr('src', src);
      }
    }
  })();

});


jQuery(document).ready(function ($) {
  /*tour master*/
  (function () {
    if (typeof $.jTourMaster !== 'function') return;

    var tours = [
      {
        name: 'tour_1',
        title: 'Интернет-магазин на основе dropshipping-процессов',
        steps: [
          {
            element: '.js__jtour-step5',
            title: 'step 4',
            content: 'some bla-bla-bla',
            path: '/jflex/test.html'
          },
          {
            element: '.js__jtour-step3',
            title: 'step 3',
            content: 'some bla-bla-bla',
            path: '/jflex/test2.html'
          },
          {
            element: '.js__jtour-step2',
            title: 'step 2',
            content: 'some bla-bla-bla'
          },
          {
            element: '.js__jtour-step4',
            title: 'step 4',
            content: 'some bla-bla-bla',
            animateType: 'highlight'
          },
          {
            element: '.js__jtour-step1',
            title: 'step 1',
            content: 'some bla-bla-bla'
          },
          {
            element: '.js__jtour-step7',
            title: 'step 7',
            content: 'some bla-bla-bla',
            path: '/jflex/test3.html'
          },
          {
            element: '.js__jtour-step9',
            title: 'step 8',
            content: 'some bla-bla-bla',
          },
          {
            element: '.js__jtour-step3',
            title: 'step 9',
            content: 'some bla-bla-bla',
            path: '/jflex/test2.html'
          }
        ]
      },
      {
        name: 'tour_2',
        title: 'Интернет-магазин на основе классического построения',
        steps: [
          {
            element: '.js__jtour-step1',
            title: 'step 1',
            content: 'some bla-bla-bla'
          },
          {
            element: '.js__jtour-step2',
            title: 'step 2',
            content: 'some bla-bla-bla'
          },
          {
            element: '.js__jtour-step3',
            title: 'step 3',
            content: 'some bla-bla-bla'
          },
          {
            element: '.js__jtour-step4',
            title: 'step 4',
            content: 'some bla-bla-bla',
            animateType: 'highlight'
          },
          {
            element: '.js__jtour-step5',
            title: 'step 5',
            content: 'some bla-bla-bla',
            path: '/review/master/test.html'
          }
        ]
      },
      {
        name: 'tour_4',
        title: 'Оператор связи: хостинг-процессы',
        steps: [
          {
            element: '.js__jtour-step1',
            title: 'step 1',
            content: 'some bla-bla-bla'
          },
          {
            element: '.js__jtour-step2',
            title: 'step 2',
            content: 'some bla-bla-bla'
          },
          {
            element: '.js__jtour-step3',
            title: 'step 3',
            content: 'some bla-bla-bla'
          },
          {
            element: '.js__jtour-step4',
            title: 'step 4',
            content: 'some bla-bla-bla',
            animateType: 'highlight'
          },
          {
            element: '.js__jtour-step5',
            title: 'step 4',
            content: 'some bla-bla-bla',
            path: '/review/master/test.html'
          }
        ]
      },
      {
        name: 'tour_3',
        title: 'Поддержка клиентов',
        steps: [
          {
            element: '.js__jtour-step1',
            title: 'step 1',
            content: 'some bla-bla-bla'
          },
          {
            element: '.js__jtour-step2',
            title: 'step 2',
            content: 'some bla-bla-bla'
          },
          {
            element: '.js__jtour-step3',
            title: 'step 3',
            content: 'some bla-bla-bla'
          },
          {
            element: '.js__jtour-step4',
            title: 'step 4',
            content: 'some bla-bla-bla',
            animateType: 'highlight'
          },
          {
            element: '.js__jtour-step5',
            title: 'step 4',
            content: 'some bla-bla-bla',
            path: '/review/master/test.html'
          }
        ]
      },
      {
        name: 'tour_5',
        title: 'Интернет-магазин на основе dropshipping-процессов',
        steps: [
          {
            element: '.js__jtour-step1',
            title: 'step 1',
            content: 'some bla-bla-bla'
          },
          {
            element: '.js__jtour-step2',
            title: 'step 2',
            content: 'some bla-bla-bla'
          },
          {
            element: '.js__jtour-step3',
            title: 'step 3',
            content: 'some bla-bla-bla'
          },
          {
            element: '.js__jtour-step4',
            title: 'step 4',
            content: 'some bla-bla-bla',
            animateType: 'highlight'
          },
          {
            element: '.js__jtour-step5',
            title: 'step 4',
            content: 'some bla-bla-bla',
            path: '/review/master/test.html'
          }
        ]
      },
      {
        name: 'tour_6',
        title: 'Интернет-магазин на основе классического построения',
        steps: [
          {
            element: '.js__jtour-step1',
            title: 'step 1',
            content: 'some bla-bla-bla'
          },
          {
            element: '.js__jtour-step2',
            title: 'step 2',
            content: 'some bla-bla-bla'
          },
          {
            element: '.js__jtour-step3',
            title: 'step 3',
            content: 'some bla-bla-bla'
          },
          {
            element: '.js__jtour-step4',
            title: 'step 4',
            content: 'some bla-bla-bla',
            animateType: 'highlight'
          },
          {
            element: '.js__jtour-step5',
            title: 'step 4',
            content: 'some bla-bla-bla',
            path: '/review/master/test.html'
          }
        ]
      },
      {
        name: 'tour_7',
        title: 'Оператор связи: хостинг-процессы',
        steps: [
          {
            element: '.js__jtour-step1',
            title: 'step 1',
            content: 'some bla-bla-bla'
          },
          {
            element: '.js__jtour-step2',
            title: 'step 2',
            content: 'some bla-bla-bla'
          },
          {
            element: '.js__jtour-step3',
            title: 'step 3',
            content: 'some bla-bla-bla'
          },
          {
            element: '.js__jtour-step4',
            title: 'step 4',
            content: 'some bla-bla-bla',
            animateType: 'highlight'
          },
          {
            element: '.js__jtour-step5',
            title: 'step 4',
            content: 'some bla-bla-bla',
            path: '/review/master/test.html'
          }
        ]
      },
      {
        name: 'tour_8',
        title: 'Поддержка клиентов',
        steps: [
          {
            element: '.js__jtour-step1',
            title: 'step 1',
            content: 'some bla-bla-bla'
          },
          {
            element: '.js__jtour-step2',
            title: 'step 2',
            content: 'some bla-bla-bla'
          },
          {
            element: '.js__jtour-step3',
            title: 'step 3',
            content: 'some bla-bla-bla'
          },
          {
            element: '.js__jtour-step4',
            title: 'step 4',
            content: 'some bla-bla-bla',
            animateType: 'highlight'
          },
          {
            element: '.js__jtour-step5',
            title: 'step 4',
            content: 'some bla-bla-bla',
            path: '/review/master/test.html'
          }
        ]
      }
    ];
    var steps = [
      {
        element: '.js__jtour-step1',
        title: 'step 1',
        tag: 'Функциональные опции интернет-магазина',
        content: 'some bla-bla-bla'
      },
      {
        element: '.js__jtour-step2',
        title: 'step 2',
        tag: 'Функциональные опции интернет-магазина',
        content: 'some bla-bla-bla'
      },
      {
        element: '.js__jtour-step3',
        title: 'step 3',
        tag: 'Функциональные опции интернет-магазина',
        content: 'some bla-bla-bla'
      },
      {
        element: '.js__jtour-step4',
        title: 'step 4',
        tag: 'Процессы для юридических лиц',
        content: 'some bla-bla-bla',
        animateType: 'highlight'
      },
      {
        element: '.js__jtour-step5',
        title: 'step 5',
        tag: 'Процессы для юридических лиц',
        content: 'some bla-bla-bla',
        path: '/jflex/test.html'
      }
    ];
    var options = {
      tours: tours,
      steps: steps,
      autostart: true,
      autostartPath: '/jflex/test2.html',
      autostartCondition: 'new',
      layoutContainer: '#hidden',
      defaultTourOptions: {
        isMenu: true,
        menuContainer: '.admin-menu',
        addMenuMethod: function(menu) {
          var $container = $(menuContainerTpl);

          $container
            .append(menu)
            .appendTo($('body'));
        },
        removeMenuMethod: function(menu, container) {
          var $container = $(container);
          $container.remove();
        }
      }
    };
    var menuContainerTpl =
      '<div class="admin-menu">' +
      '<button  class="btn_back btn small simple icon icon-uniE7DC">назад</button>' +
      '<div class="title">Настройка системы</div>' +
      '</div>';
    var tourMaster = $.jTourMaster(options);
    var $startBtn = $('.js__tour-master-start');

    $startBtn.on('click', function (e) {
      e.preventDefault();

      tourMaster.start();
    });



    /*debugger*/
    window.deleteCookieTour = function () {
      $.removeCookie('tour-master', {domain: window.location.hostname});
    };
  })();
});