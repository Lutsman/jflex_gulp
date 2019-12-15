jQuery(document).ready(function () {

  /* mobile panel */

 /* function hideanimation() {
    jQuery('#m-panel').animate({left: '-100%'}, 150);
  }

  //mobile panel opening

  jQuery('#mm-menu .tab-name').toggle(function () {
    if(jQuery(this).hasClass('cart') && jQuery('body.page-cart-checkout').length) {
      return;
    }
    jQuery(this).addClass('active');
    jQuery('body').addClass('m-view');
    jQuery('#m-panel').animate({left: '0'}, 300);
  }, function () {
    if(jQuery(this).hasClass('cart') && jQuery('body.page-cart-checkout').length) {
      return;
    }
    jQuery('body').removeClass('m-view');
    jQuery(this).removeClass('active');
    return hideanimation();
  });*/


  // Enable swiping...
 /* var $mPanel = jQuery('#m-panel');
  if ($mPanel.length) {
    $mPanel.swipe({
      //Generic swipe handler for all directions
      swipe: function (event, direction, distance, duration, fingerCount, fingerData) {
        switch (direction) {
          case 'left':
            jQuery('#mm-menu .tab-name.active').click();
            break;
          case 'right':
            break;
        }
      },
      allowPageScroll: "vertical"
    });
  }*/

  /*jQuery('#mm-menu .tab-name.navigation').click(function () {
    jQuery(this).toggleClass('close');
  });*/


  /* jbox mobile fix, works only with drupal mobile_switch module */

  /*jQuery('.ismobiledevice .jbox').click(function () {
    jQuery('body').addClass('m-view');
  });*/


  /* filters and categories toggle */

  jQuery('.ismobiledevice .leftside .views-exposed-widgets label').toggle(function () {
    jQuery(this).parent().find('.views-widget').slideDown(300);
  }, function () {
    jQuery(this).parent().find('.views-widget').slideUp(200);
  });


  jQuery('.ismobiledevice .leftside .block .title').toggle(function () {
    jQuery(this).parent().find('.content').slideDown(300);
  }, function () {
    jQuery(this).parent().find('.content').slideUp(200);
  });


  jQuery('.ismobiledevice .checkout .cart-info h3').toggle(function () {
    jQuery(this).parents().find('.cart-content').slideDown(300);
  }, function () {
    jQuery(this).parents().find('.cart-content').slideUp(200);
  });


  jQuery('.ismobiledevice .leftside .views-exposed-widgets input[type="checkbox"]').click(function () {
    jQuery(this).parents().find('.views-widget').delay(1000).slideUp(200);
  });

  /* jQuery('#mpanel').swipe( {
   swipe:function(event, direction, distance, duration) {
   return hideanimation();
   }, threshold:20
   });
   */

});