// Start timer.
function startTimer(timerTimeEnd) {
  var date1_tmp = new Date();
  var date1 = Math.round(date1_tmp.getTime() / 1000);
  var delta = (timerTimeEnd * 1) - date1;
  //количество дней
  var days = Math.floor(delta / (60 * 60 * 24));
  //количество часов
  var hours = Math.floor((delta - (days * 60 * 60 * 24)) / (60 * 60));
  //колчичество минут
  var minut = Math.floor((delta - (days * 60 * 60 * 24) - (hours * 60 * 60)) / 60);
  //количество секунд
  var secund = delta - (days * 60 * 60 * 24) - (hours * 60 * 60) - (minut * 60);
  date_1 = '%02d%02d%02d%02d'.sprintf(days, hours, minut, secund);
  timeout = jQuery('#timeout');
  jQuery('.val.days>span', timeout).html(date_1[0] + date_1[1]);
  jQuery('.val.hours>span', timeout).html(date_1[2] + date_1[3]);
  jQuery('.val.minutes>span', timeout).html(date_1[4] + date_1[5]);
  jQuery('.val.seconds>span', timeout).html(date_1[6] + date_1[7]);

  setTimeout('startTimer(timerTimeEnd);', 999);
}

(function ($, Drupal, window, document, undefined) {

  // behaviors
  Drupal.behaviors.timerDate = {
    attach: function (context, settings) {
      var TB = $('#timer-box', context);
      if (!TB.length) {
        return;
      }
      var EvDSt = $('.field-timer-date .date-display-start', TB).text();
      var EvDEnd = $('.field-timer-date .date-display-end', TB).text();
      var EvDInd = $('.field-timer-date-individ .field-item', TB).text();
      var isStartTimer = false;

      // Получаем время
      var date = new Date();
      var timeCurrent = Math.round(date.getTime() / 1000);

      if (EvDSt && EvDEnd && EvDSt <= timeCurrent && timeCurrent < EvDEnd) {
        timerTimeEnd = EvDEnd;
        startTimer(parseInt(timerTimeEnd));
        isStartTimer = true;
      }
      else if (EvDInd) {
        EvDInd = parseInt(EvDInd);
        if (EvDInd) {
          EvDInd = parseInt(EvDInd) * 24 * 60 * 60;
          var node = $('body.page-node');
          var nid = node[0].className.match(/page-node-([\d]+) /);
          if (nid[1] !== undefined) {
            nid = parseInt(nid[1]);

            // Проверяем куку
            var setting = false;
            var cookEvDI = $.cookie('timer_date_individ');
            if (cookEvDI) {
              cookEvDI = JSON.parse(cookEvDI);
              if (typeof cookEvDI == 'object') {
                setting = true;
                if (cookEvDI[nid] === undefined) {
                  cookEvDI[nid] = timeCurrent;
                  var str = JSON.stringify(cookEvDI);
                  $.cookie('timer_date_individ', str, {expires: 365});
                }
              }
            }
            if (setting === false) {
              cookEvDI = {};
              cookEvDI[nid] = timeCurrent;
              var str = JSON.stringify(cookEvDI);
              $.cookie('timer_date_individ', str, {expires: 365});
            }

            // Проверяем остаток времени
            // Переводим период события в секунды, получаем остаток времени события
            var timerTimeLast = (cookEvDI[nid] + EvDInd) - timeCurrent;
            timerTimeEnd = cookEvDI[nid] + EvDInd;
            // сравниваем с текущим временем, отображаем счетчик
            if (timerTimeLast > 0) {
              startTimer(parseInt(timerTimeEnd));
              isStartTimer = true;
            }
          }
        }
      }

      // Discount.
      if (isStartTimer) {
        var discount = parseFloat($('.discount .discount', TB).text());
        var selectorOldprice = $('.discount .selector-oldprice', TB).text();
        var selectorPercent = $('.discount .selector-percent', TB).text();
        if (discount) {
          if (selectorOldprice && $(selectorOldprice).length) {
            var oldPrice = parseFloat($(selectorOldprice).text());
            var oldPriceNew = oldPrice + discount;
            $(selectorOldprice).text(oldPriceNew);

            if (selectorPercent && $(selectorPercent).length) {
              var percent = parseFloat($(selectorPercent).text());
              percent = percent / oldPrice * oldPriceNew;
              $(selectorPercent).text(percent.toFixed(2) + ' %');
            }
          }
        }
      }

    }
  }

})
(jQuery, Drupal, this, this.document);

