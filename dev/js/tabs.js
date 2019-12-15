
jQuery(document).ready(function ($) {
  /* Делаем обвертку для табов, устанавливаем для нее атрибут data-selector
   *  и прописываем селектор до списка страниц.
   *  символ > меняем на |
   *  класс .tab-block - расстягивает кнопки по ширине.
   *
   * ТАБЫ:
   * <div class="tab-name-wrap" data-selector=".page-partner-coupons|.attachment">
   *  <div class="tab-name">Таб1</div>
   *  <div class="tab-name">Таб2</div>
   *  <div class="tab-name">Таб3</div>
   * </div>
   *
   * СТРАНИЦЫ:
   * <div class="tab-page">страница1</div>
   * <div class="tab-page">страница2</div>
   * <div class="tab-page">страница3</div>
   */
  (function () {
    var $tabsAll = $('.tab-name');
    var $tabWrappersAll = $('.tab-name-wrap');

    if (!$tabsAll.length) return;

    $tabWrappersAll.each(function (i) {
      var $tabWrapper = $(this);
      var $tabs = $('.tab-name', $tabWrapper);
      var $activeTab = $tabs.filter('.active');

      if ($activeTab.length === 0) {
        $activeTab = $tabs.first().addClass('active');
      } else if ($activeTab.length > 1) {
        $activeTab.not($activeTab.eq(0)).removeClass('active');
        $activeTab = $activeTab.eq(0);
      }

      $tabs.each(function (i) {
        $(this).attr('data-tn-id', (i + 1));
      });
      $tabs.first().addClass('first'); // TODO зачем эти классы?
      $tabs.last().addClass('last');  // +1

      $tabs.wrapAll("<div class='tabs-all' />");
      //$tabs = $('.tab-name', $tabWrapper); //костыль, получаем снова табы в переменную после оборачивания

      // проверка наличия страниц
      var isPages = false;
      var tabPageWrapperSelector = $tabWrapper.attr('data-selector');

      if (tabPageWrapperSelector) {
        var $tabPageWrapper = $(tabPageWrapperSelector.replace(/\|/g, ">"));
        var $tabPages = $('.tab-page', $tabPageWrapper);

        if ($tabPageWrapper.length && $tabPages.length) {
          var $activeTabPage = $tabPages.eq($tabs.index($activeTab));

          isPages = true;
          $tabPages.each(function (i) { //TODO зачем эта разметка, если мы все равно ориентируемся по индексу табов
            $(this).attr('data-tp-id', (i + 1));
            $(this).hide();
          });
          $activeTabPage.show();
        }
      }

      var select = $tabWrapper.attr('data-select-selector');
      var $select = $(select);

      if ($select.length) {
        var selectData = [];

        $tabs.each(function() {
          selectData.push({
            id: this.getAttribute('data-tn-id'),
            text: this.textContent
          });
        });

        $select.select2({
          data: selectData,
          minimumResultsForSearch: 100
        });

        setActiveSelect($activeTab, $select);

        $select
          .on("change", function(e) {
            var $currActiveTab = $tabs.filter('[data-tn-id="' + e.val + '"]');

            setActiveTab($currActiveTab);
          })
      }

      // клик по табу
      $tabs.on('click', changeActiveTab);

      function changeActiveTab(e) {
        var $currActiveTab = $(this);

        e.preventDefault();

        setActiveTab($currActiveTab);

        //устанавливаем активный select
        setActiveSelect($currActiveTab, $select);
      }

      function refreshSlider(el) {
        var $el = $(el);
        var $slider = $el.find('.js__slick');

        if (!$slider.length) return;

        $slider.each(function(i, el) {
          el.slick.refresh(true);
        });
      }

      function setActiveTab($currActiveTab) {
        $tabs.removeClass('active');
        $currActiveTab.addClass('active');

        // если нет страниц, у табов просто будет меняться класс
        if (isPages) {
          var tabPageId = $currActiveTab.attr('data-tn-id');

          $tabPages.hide();

          $activeTabPage = $('.tab-page[data-tp-id=' + tabPageId + ']', $tabPageWrapper);
          $activeTabPage.show();

          refreshSlider($activeTabPage);
        }
      }

      function setActiveSelect($currActiveTab, $select) {
        if ($select && $select.length) {
          $select.select2("val", $currActiveTab.attr('data-tn-id'));
        }
      }
    });
  })();
});


