 /*main menu*/
  (function () {
    var $menu = $('.js__fixed-menu');

    $menu.each(function () {
      var $currMenu = $(this);

      $currMenu.fixedMenu({
        pageSearch: $currMenu.hasClass('js__fixed-menu-pagesearch'),
        pageSearchBlock: $currMenu.attr('data-fixed-menu-searchtarget') || undefined
      });
    });


    /*$(menuElem).fixedMenu({
      fixedClass: 'js__top-fixed', //string, default = 'js-top-fixed', class for menu block
      pageSearch: true, //boolean, dafault = true, search blocks by anchors in menu, under menu
      pageSearchBlock: '.someSearchBlock', //dom element , default equal to menu element
      pageSearchClass: 'active', // default = 'active', class for active link
      delay: 100 //default = 100, integrer, delay setting active link on scroll for better perfomance
    });*/