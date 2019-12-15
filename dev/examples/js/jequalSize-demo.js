jQuery(document).ready(function ($) {
  /*equal size*/
  (function () {
    // TODO добавить тест добавления ребенка
    var $stopBtn = $('.stop');
    var $startBtn = $('.start');
    var $addOneBtn = $('.add-one');
    var $removeOneBtn = $('.remove-one');
    var $addFewBtn = $('.add-few');
    var $removeFewBtn = $('.remove-few');

    $stopBtn.on('click', function (e) {
      var $equalCont = $($(this).attr('data-target'));
      var equalObj = $equalCont.jEqualSize('getSelf');

      equalObj.stop();
    });

    $startBtn.on('click', function (e) {
      var $equalCont = $($(this).attr('data-target'));
      var equalObj = $equalCont.jEqualSize('getSelf');

      equalObj.run();
    });

    $addOneBtn.on('click', function (e) {
      var $equalCont = $($(this).attr('data-target'));
      var equalObj = $equalCont.jEqualSize('getSelf');
      var newChildren = '.js__equal-child-added-1';

      equalObj.addChildren(newChildren);
    });

    $removeOneBtn.on('click', function (e) {
      var $equalCont = $($(this).attr('data-target'));
      var equalObj = $equalCont.jEqualSize('getSelf');
      var newChildren = '.js__equal-child-added-1';

      equalObj.removeChildren(newChildren);
    });

    $addFewBtn.on('click', function (e) {
      var $equalCont = $($(this).attr('data-target'));
      var equalObj = $equalCont.jEqualSize('getSelf');
      var newChildrenArr = [
        '.js__equal-child-added-1',
        '.js__equal-child-added-2',
        '.js__equal-child-added-3'
      ];

      for (var i = 0; i < newChildrenArr.length; i++) {
        equalObj.addChildren(newChildrenArr[i], i);
      }

    });

    $removeFewBtn.on('click', function (e) {
      var $equalCont = $($(this).attr('data-target'));
      var equalObj = $equalCont.jEqualSize('getSelf');
      var newChildrenArr = [
        '.js__equal-child-added-1',
        '.js__equal-child-added-2',
        '.js__equal-child-added-3'
      ];

      for (var i = 0; i < newChildrenArr.length; i++) {
        equalObj.removeChildren(newChildrenArr[i], i);
      }
    });
  })();
});