$(document).ready(function () {

  /*simplebox*/
 (function () {
   var $event1 = $('.jevent1');
   var $event2 = $('.jevent2');
   var $currSessionOnly = $('.jevent3');
   var $newUserOnly = $('.jevent4');
   var $oldUserOnly = $('.jevent9');
   var $oldUser = $('.jevent5');
   var $newUser = $('.jevent6');
   var $multipleBlocks = $('.jevent7');
   var $multipleScenario = $('.jevent8');
   var $reset = $('.reset');


   $event1.jPageEventLive({
     target: '.jPageEventLive-target1',
     event: 'click',
     showAfter: '0 - 1, 2 - 10',
     openingMethod: 'simplebox'
   });

   $event2.jPageEventLive({
     target: '.jPageEventLive-target1',
     event: 'click',
     showAfter: '0 - 5, 10 - 15',
     priority: 2,
     openingMethod: 'simplebox'
   });

   $currSessionOnly.jPageEventLive({
     target: '.jPageEventLive-target2',
     event: 'click',
     showAfter: 0,
     openingMethod: 'simplebox'
   });

   $newUserOnly.jPageEventLive({
     target: '.jPageEventLive-target3',
     event: 'click',
     showAfter: '0 - 5, 10 - 15',
     newUserOnly: 'new',
     openingMethod: 'simplebox'
   });

   $oldUserOnly.jPageEventLive({
     target: '.jPageEventLive-target4',
     event: 'click',
     showAfter: '0 - 5, 10 - 15',
     userStatus: 'old',
     openingMethod: 'simplebox'
   });

   $oldUser.on('click', function () {
     var oldUser = {
       date: new Date(0)
     };
     var options = {
       path: '/'
     };
     var cachedJsonOption = $.cookie.json;
     $.cookie.json = true;

     $.cookie('userInfoPage', oldUser);
     $.cookie('userInfoGlobal', oldUser, options);

     $.cookie.json = cachedJsonOption;
   });

   $newUser.on('click', function () {
     var newUser = {
       date: new Date()
     };
     var options = {
       path: '/'
     };
     var cachedJsonOption = $.cookie.json;
     $.cookie.json = true;

     $.cookie('userInfoPage', newUser);
     $.cookie('userInfoGlobal', newUser, options);

     $.cookie.json = cachedJsonOption;
   });

   $multipleBlocks.jPageEventLive({
     target: '.jPageEventLive-target1, .jPageEventLive-target2, .jPageEventLive-target3, .jPageEventLive-target4, .jPageEventLive-target5, .jPageEventLive-target6',
     event: 'click',
     showAfter: '0 - 5, 10 - 15',
     openingMethod: 'simplebox'
   });

   $multipleScenario.jPageEventLive([
     {
       target: '.jPageEventLive-target5',
       event: 'focus',
       showAfter: '0 - 5, 10 - 15',
       openingMethod: 'simplebox'
     },
     {
       target: '.jPageEventLive-target6',
       event: 'blur',
       showAfter: '0 - 5, 10 - 15',
       openingMethod: 'simplebox'
     }
   ]);

   $reset.on('click', function () {
     for (var it in $.cookie()) {
       //console.log(it);
       //console.log($.removeCookie(it));
       $.removeCookie(it)
     }
     //console.log('userglobal' + $.removeCookie('userInfoGlobal', {path: '/'}));
     $.removeCookie('userInfoGlobal', {path: '/'});

   });
 })();

  /*jBox*/
  (function () {
    var $event1 = $('.jevent1-jbox');
    var $event2 = $('.jevent2-jbox');
    var $currSessionOnly = $('.jevent3-jbox');
    var $newUserOnly = $('.jevent4-jbox');
    var $oldUserOnly = $('.jevent5-jbox');
    var $autoplayAndDelay = $('.jevent6-jbox');

    $event1.jPageEventLive({
      target: '.jbox-anchor',
      event: 'click',
      showAfter: '0 - 1'
    });

    $event2.jPageEventLive({
      target: '.jbox-anchor',
      event: 'click',
      showAfter: '0 - 5, 10 - 15',
      priority: 2
    });

    $currSessionOnly.jPageEventLive({
      target: '#form-1',
      event: 'click',
      showAfter: 0
    });

    $newUserOnly.jPageEventLive({
      target: '.img-2',
      event: 'click',
      showAfter: '0 - 5, 10 - 15',
      userStatus: 'new'
    });

    $oldUserOnly.jPageEventLive({
      target: '.img-2',
      event: 'click',
      showAfter: '0 - 5, 10 - 15',
      userStatus: 'old'
    });

    $autoplayAndDelay.jPageEventLive([
      {
        target: 'img/panda/panda3.jpg',
        event: 'none',
        showAfter: '0 - 300',
        autoplay: true,
        autoplayDelay: 5
      },
      {
        target: 'img/panda/panda3.jpg',
        event: 'click',
        showAfter: '0 - 300',
        priority: 2,
        delay: 5
      }
    ]);
  })();



/*  $('body').on('playScenario', function (scenario, e) {
    console.dir(scenario);
  });*/




});