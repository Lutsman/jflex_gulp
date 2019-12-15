/**
 * behaviors
 */
(function ($, Drupal, window, document, undefined) {
  // JS
  $(document).ready(function () {


    /* adding plus and minus controld to uc addto cart forms */
    //jQuery('<span class="control min l">–</span>').insertBefore('#uc-cart-view-form .qty input[type=text], .form-item-qty input[type=text]');
    //jQuery('<span class="control plus l">+</span>').insertAfter('#uc-cart-view-form .qty input[type=text], .form-item-qty input[type=text]');

    jQuery('.plus').live("click", function (e) {
      e.preventDefault();
      var isCart = $(this).closest('#uc-cart-view-form').length;
      var currentVal = 0;
      var maxProducts = 20;
      var currentValEl = parseInt(jQuery(this).parent().find('input[type=text]').val());
      if (!isCart) {
        var nid = $(this).closest('form').attr('id');
        var re = /([a-z\-])+/;
        nid = nid.replace(re, "");
        currentVal = parseInt(jQuery('#uc-cart-view-form tr[nid="' + nid + '"] .qty input[type=text]').val());
      }
      if (!currentVal) {
        currentVal = currentValEl;
      }
      if (isCart) {
        if (currentVal < maxProducts) {
          jQuery(this).parent().find('input[type=text]').val(currentVal + 1);
        } else {
          jQuery(this).parent().find('input[type=text]').val(maxProducts);
        }
      }
      else {
        if ((currentVal + currentValEl) < maxProducts) {
          currentVal = currentValEl ? currentValEl + 1 : 0;
          jQuery(this).parent().find('input[type=text]').val(currentVal);
        } else {
          jQuery(this).parent().find('input[type=text]').val(currentValEl);
        }
      }
      if (isCart) {
        setTimeout(function () {
          jQuery('#uc-cart-view-form #edit-update-ajax').click().trigger('keypress').trigger('mousedown');
        }, 500);
      }
    });
    jQuery('.min').live("click", function (e) {
      e.preventDefault();
      var isCart = $(this).closest('#uc-cart-view-form').length;
      var fieldName = jQuery(this).parent().find('input[type=text]');
      var currentVal = parseInt(jQuery(this).parent().find('input[type=text]').val());
      if (currentVal > 1) {
        jQuery(this).parent().find('input[type=text]').val(currentVal - 1);
      } else {
        jQuery(this).parent().find('input[type=text]').val(1);
      }
      if (isCart) {
        setTimeout(function () {
          jQuery('#uc-cart-view-form #edit-update-ajax').click().trigger('keypress').trigger('mousedown');
        }, 500);
      }
    });

  });

  /* Modale window then run ajax. */
  (function($) {
    if (typeof(Drupal.ajax) != 'undefined') {
      var beforeSend = Drupal.ajax.prototype.beforeSend;
      var success = Drupal.ajax.prototype.success;
      var error = Drupal.ajax.prototype.error;
      /**
       * Prepare the Ajax request before it is sent.
       */
      Drupal.ajax.prototype.beforeSend = function (xmlhttprequest, options) {
        // Вызываем код, который описан в Drupal.ajax.prototype.beforeSend в файле misc/ajax.js,
        // чтобы не нарушить работу AJAX.
        beforeSend.apply(this, arguments);

        var $el = $(this.element);
        var $parents = $el.parents('form.uc-cart-checkout-form, form#uc-cart-view-form, .apo-show');
        var $widgets = $el.closest('.views-exposed-widgets');
        var overlayTpl = '<div class="ajax-progress-overlay"></div>';

        $parents.prepend(overlayTpl);

        if ($widgets.length) {
          $widgets.add('.apo-show').prepend(overlayTpl);
        }
      };

      /**
       * Handler for the form redirection completion.
       */
      Drupal.ajax.prototype.success = function (xmlhttprequest, options) {
        success.call(this, xmlhttprequest, options);
        // show activity on view filters sort
        var wrap = jQuery('form.uc-cart-checkout-form, form#uc-cart-view-form, .apo-show, .views-exposed-widgets');
        if (wrap.length) {
          jQuery('.ajax-progress-overlay', wrap).remove();
          if (this.element.type == 'radio') {
            jQuery(this.element).closest('.form-type-radio').addClass('active').siblings().removeClass('active');
          }
        }
      };

    }
  })(jQuery);

  // Behaviors.
  (function() {
    Drupal.behaviors.jflexDrupal = {
      attach: function (context, settings) {
        /**
         * Order sent to 1C
         */
        //function exchange_1c_fn() {
        //  if (Drupal.settings.hasOwnProperty('exchange_1c')) {
        //    var order_id = Drupal.settings.exchange_1c;
        //    if (order_id) {
        //      $.get("/request-send/" + order_id);
        //    }
        //  }
        //}
        //$('body').once('exchange_1c', exchange_1c_fn);

        // Set active class for :radio wrapp
        jQuery('input:radio:checked').once().closest('.form-type-radio').addClass('active').siblings().removeClass('active');

        /* img scale for retina displays */
        jQuery.jFlex.retinaImg();

        /* adding plus and minus controld to uc addto cart forms */
        $('#uc-cart-view-form .qty, .form-item-qty').each(function () {
          if (!$('.control.plus', this).length) {
            jQuery('<span class="control min l">–</span>').insertBefore($('input[type=text]', this));
            jQuery('<span class="control plus l">+</span>').insertAfter($('input[type=text]', this));
          }
        });

        // filters as tabs first-last
        jQuery('.views-widget .form-item-edit-field-product-marker-tid-all').remove();
        jQuery('.bef-select-as-links a:first').addClass('first');
        jQuery('.bef-select-as-links a:last').addClass('last');


        /* animations for compact product mode view */

        jQuery('.product.teaser.compact').hover(function (e) {
          jQuery(this).find('.title').addClass('active');
          jQuery(this).find('.overflow').hoverFlow(e.type, {
            'opacity': 'show'
          }, 150);

          jQuery(this).find('.sku, .add-to-cart').hoverFlow(e.type, {
            'height': 'show',
            'marginTop': 'show',
            'marginBottom': 'show',
            'paddingTop': 'show',
            'paddingBottom': 'show'
          }, 150);

        }, function (e) {

          jQuery(this).find('.title').removeClass('active');
          jQuery(this).find('.overflow').hoverFlow(e.type, {
            'opacity': 'hide'
          }, 150);

          jQuery(this).find('.sku, .add-to-cart').hoverFlow(e.type, {
            'height': 'hide',
            'marginTop': 'hide',
            'marginBottom': 'hide',
            'paddingTop': 'hide',
            'paddingBottom': 'hide'
          }, 100);
        });

        /* SET MODE. Set view mode switcher. */
        function setDisplayMode(key, el) {
          var $dSwitch = $(el);
          var $dMode = $('body.displaymode');
          var setMode = function (mode, onlyLink) {
            jQuery('#display-switch a.' + mode).addClass('active').siblings().removeClass('active');
            if (!onlyLink) {
              $dMode.removeClass('grid linear').addClass(mode);
              jQuery.cookie('displaymode', mode, {expires: 30});
            }
          };
          // Set mode after loaded page
          var hash = document.location.hash;
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
          $('#display-switch a').click(function () {
            setMode(jQuery(this).attr('href').replace('#', ''));
          });
        }

        $('body.displaymode .switcher #display-switch:first').once('displaymode', setDisplayMode);
        /* END SET MODE. */


        /* removing view fileters if only one product in view */
        var prodcount = jQuery('.view-content .product').length;
        if (prodcount == 1) {
          jQuery('.view-filters').once().remove();
        }


      }
    };
  })();

  /* phone number in href */
  (function() {
    Drupal.behaviors.clearPhone = {
      attach: function (context) {
        $('.tel', context).once('tel-proccessed',function () {
          var $el = $(this);
          var tel = $el.text();
          var cleartel = tel.replace(/[^0-9]/g, '');

          if (cleartel.indexOf('8800') !== 0) {
            cleartel = '+' + cleartel;
          }

          $el.replaceWith('<a class="telline" href="tel:' + cleartel + '"><span class="tel tel-proccessed">' + $el.html() + '</span></a>');
        });
      }
    };
  })();

  /*field_ui.js fix*/
  (function() {
    /**
     * Populates options in a select input.
     */
    jQuery.fn.fieldUIPopulateOptions = function (options, selected) {
      return this.each(function () {
        var disabled = false;
        if (options.length == 0) {
          options = [this.initialValue];
          disabled = true;
        }

        // If possible, keep the same widget selected when changing field type.
        // This is based on textual value, since the internal value might be
        // different (options_buttons vs. node_reference_buttons).
        var previousSelectedText = '';

        if (~this.selectedIndex) {
          previousSelectedText = this.options[this.selectedIndex].text;
        }

        var html = '';
        jQuery.each(options, function (value, text) {
          // Figure out which value should be selected. The 'selected' param
          // takes precedence.
          var is_selected = ((typeof selected != 'undefined' && value == selected) || (typeof selected == 'undefined' && text == previousSelectedText));
          html += '<option value="' + value + '"' + (is_selected ? ' selected="selected"' : '') + '>' + text + '</option>';
        });

        $(this).html(html).attr('disabled', disabled ? 'disabled' : false);
      });
    };
  })();

  /*sites/all/modules/contrib/views_bulk_operations/js/views_bulk_operations.js fix*/
  (function() {
    if (!Drupal.vbo) return;

    Drupal.vbo.initTableBehaviors = function(form) {
      // If the table is not grouped, "Select all on this page / all pages"
      // markup gets inserted below the table header.
      var selectAllMarkup = $('.vbo-table-select-all-markup', form);
      if (selectAllMarkup.length) {
        $('.views-table > tbody', form).prepend('<tr class="views-table-row-select-all even">></tr>');
        var colspan = $('table th', form).length;
        $('.views-table-row-select-all', form).html('<td colspan="' + colspan + '">' + selectAllMarkup.html() + '</td>');

        $('.vbo-table-select-all-pages', form).click(function() {
          Drupal.vbo.tableSelectAllPages(form);
          return false;
        });
        $('.vbo-table-select-this-page', form).click(function() {
          Drupal.vbo.tableSelectThisPage(form);
          return false;
        });
      }

      $('.vbo-table-select-all', form).show();
      // This is the "select all" checkbox in (each) table header.
      $('.vbo-table-select-all', form).click(function() {
        var table = $(this).closest('table')[0];
        $('input[id^="edit-views-bulk-operations"]:not(:disabled)', table).attr('checked', this.checked);

        // Toggle the visibility of the "select all" row (if any).
        if (this.checked) {
          $('.views-table-row-select-all', table).show();
        }
        else {
          $('.views-table-row-select-all', table).hide();
          // Disable "select all across pages".
          Drupal.vbo.tableSelectThisPage(form);
        }
      });

      // Set up the ability to click anywhere on the row to select it.
      if (Drupal.settings.vbo.row_clickable) {
        $('.views-table tbody tr', form).click(function(event) {
          if (event.target.tagName.toLowerCase() != 'input' &&
            event.target.tagName.toLowerCase() != 'a' &&
            !Drupal.vbo.helper.isConnectedLabel(event.target)) {
            $('input[id^="edit-views-bulk-operations"]:not(:disabled)', this).each(function() {
              var checked = this.checked;
              // trigger() toggles the checkmark *after* the event is set,
              // whereas manually clicking the checkbox toggles it *beforehand*.
              // that's why we manually set the checkmark first, then trigger the
              // event (so that listeners get notified), then re-set the checkmark
              // which the trigger will have toggled. yuck!
              this.checked = !checked;
              $(this).trigger('click');
              this.checked = !checked;
            });
          }
        });
      }
    };

    Drupal.vbo.helper = {};

    Drupal.vbo.helper.isConnectedLabel = function isConnectedLabel(el) {
      var $el = $(el);

      if (!$el.is('label')) return false;

      return !!$el.attr('for') || !!$el.find('input').length;
    };
  })();

  /*token test*/
  (function() {
    //Drupal.behaviors.tokenTree = {};
    //Drupal.behaviors.tokenDialog = {};

    if (!Drupal.behaviors.tokenInsert) return;

    function TokenController() {
      this.maxList = 50;
      this.visiblePages = 10;
      this.activePaginatorInterval = 0;
      this.activePage = 0;
    }
    TokenController.prototype.setupTokenList = function ($target, response) {
      var $sourceTable = this.$sourceTable = $(this.getTable(response));
      //var rows = this.getRows(response);
      //this.sourceTr = $sourceTable[0].tBodies[0].rows;
      this.sourceTr = this.getRows(response);
      this.$target = $target;
      var $targetTable = this.$targetTable = $('<div class="table-wrapper"></div>').append($sourceTable.clone());

      /*.find('tbody')
       .empty();*/

      //$targetTable.find('tbody').empty();

      $target
        .empty()
        .append($targetTable);
      //console.dir($dialogModel);

      //var $targetTBody = $targetTable.find('tbody');

      //var $tokenKey = $targetTable.find('.token-key');

      this.renderPagination();
      this.fillTargetTable(this.activePage, true);
      //this.processTokenClickInsert($tokenKey);
    };
    TokenController.prototype.getTable = function(response) {
     /* var $html = $(response);

      for(var i = 0; i < $html.length; i++) {
        var node = $html.eq(i);

        if (!node.is('table.token-tree')) continue;

        return $(node);
      }*/

      var table = this.getElementFromStr(response, 'table');
      var tbodyStart = table.indexOf('<tbody>') + '<tbody>'.length;
      var tbodyEnd = table.indexOf('</tbody>', tbodyStart);

      return table.slice(0, tbodyStart) + table.slice(tbodyEnd);
    };
    TokenController.prototype.getRows = function (response) {
      var tbody = this.getElementFromStr(response, 'tbody');
      var trArr = [];
      var start = 0;

      while (1) {
        var tr = this.getElementFromStr(tbody, 'tr', start);

        if (!tr) break;

        trArr.push(tr);
        start = tbody.indexOf(tr, start) + tr.length;
      }

      return trArr;
    };
    TokenController.prototype.getElementFromStr = function (str, elName, startPos) {
      var start = str.indexOf('<' + elName, startPos);
      var end = str.indexOf('</' + elName, start);
      var currStart = start;
      var childrenStart;

      if (!~start || !~end) return null;

      while (1) {
        childrenStart = str.indexOf('<' + elName, currStart + 1);

        if (!~childrenStart || childrenStart > end) break;

        currStart = childrenStart;
        end = str.indexOf('</' + elName, end + 1);
      }

      return str.slice(start, end + elName.length + 1);
    };
    TokenController.prototype.processTokenClickInsert = function processTokenClickInsert(token) {
     $(token).each(function () {
       var newThis = $('<a href="javascript:void(0);" title="' + Drupal.t('Insert this token into your form') + '">' + $(this).html() + '</a>').click(function(){
         if (typeof Drupal.settings.tokenFocusedField == 'undefined') {
           alert(Drupal.t('First click a text field to insert your tokens into.'));
         }
         else {
           var myField = Drupal.settings.tokenFocusedField;
           var myValue = $(this).text();

           //IE support
           if (document.selection) {
             myField.focus();
             sel = document.selection.createRange();
             sel.text = myValue;
           }

           //MOZILLA/NETSCAPE support
           else if (myField.selectionStart || myField.selectionStart == '0') {
             var startPos = myField.selectionStart;
             var endPos = myField.selectionEnd;
             myField.value = myField.value.substring(0, startPos)
               + myValue
               + myField.value.substring(endPos, myField.value.length);
           } else {
             myField.value += myValue;
           }

           $('html,body').animate({scrollTop: $(myField).offset().top}, 500);
         }
         return false;
       });
       $(this).html(newThis);
     });
    };
    TokenController.prototype.renderPagination = function () {
      var $target = this.$target;
      var $pagination = $('<div class="pagination pager"></div>');
      var $list = this.$list = $('<ul class="pagination-list"></ul>');
      var $prev = this.$prev = $('<li class="pagination-prev"><</li>');
      var $next = this.$next = $('<li class="pagination-next">></li>');
      var activePaginatorInterval = this.activePage <= 0 ? 0 : Math.ceil(this.activePage / this.visiblePages) - 1;

      $list
        .append($prev)
        .append($next);

      $pagination
        .append($list);

      this.activePaginatorInterval = activePaginatorInterval;
      this.fillPagination(activePaginatorInterval, true);
      $pagination.on('click', this.paginationHandler.bind(this));
      $target.prepend($pagination);
    };
    TokenController.prototype.fillTargetTable = function (page, force) {
      //var $targetTable = this.$targetTable;
      var $targetTBody = this.$targetTable.find('tbody');
      page = page || 0;
      var start = page * this.maxList;
      var end = start + this.maxList;
      var sourceTr = this.sourceTr;

      if (this.activePage === page && !force) return;

      $targetTBody.empty();
      this.activePage = page;

      for (var i = start; i < end; i++) {
        if (!sourceTr[i]) break;

        $targetTBody.append(sourceTr[i]);
      }

      this.processTokenClickInsert($targetTBody.find('.token-key'));
    };
    TokenController.prototype.fillPagination = function (intervalIndex, force) {
      var $page = $('<li class="pagination-page"></li>');
      var $prev = this.$prev;
      var $next = this.$next;
      var sourceTr = this.sourceTr;
      var pageCount = Math.ceil(sourceTr.length / this.maxList);
      var activePage = this.activePage;
      var $list = this.$list;
      var visiblePages = this.visiblePages;
      var start = intervalIndex * this.visiblePages;
      var end = start + visiblePages >= pageCount ? pageCount : start + visiblePages;

      if (intervalIndex < 0 || intervalIndex > pageCount) return;
      if (this.activePaginatorInterval === intervalIndex && !force && $list.children.length) return;

      $list.empty();

      for (var i = start; i < end; i++) {
        var $currPage = $page.clone().text(i + 1);

        if (i === activePage) {
          $currPage.addClass('pager-current');
        }

        $list.append($currPage);
      }

      if (start > 0) {
        $list.prepend($prev);
      }

      if (end < pageCount) {
        $list.append($next);
      }

      this.activePaginatorInterval = intervalIndex;
    };
    TokenController.prototype.paginationHandler = function (e) {
      e.preventDefault();

      var $target = $(e.target);

      if ($target.is('.pagination-page')) {
        $target
          .addClass('pager-current')
          .siblings()
          .removeClass('pager-current');
        this.fillTargetTable(+$target.text() - 1);
      }

      if ($target.is('.pagination-prev')) {
        this.fillPagination(this.activePaginatorInterval - 1);
      }

      if ($target.is('.pagination-next')) {
        this.fillPagination(this.activePaginatorInterval + 1);
      }

    };

    var tokenController = new TokenController();

    /*Drupal.behaviors.tokenTree = {
      attach: function (context, settings) {
        $('table.token-tree', context).once('token-tree', function () {
          $(this).treeTable();
        });
      }
    };*/

    Drupal.behaviors.tokenDialog = {
      attach: function (context, settings) {
        $('a.token-dialog', context).once('token-dialog').click(function() {
          var url = $(this).attr('href');
          var dialog = $('<div style="display: none" class="loading">' + Drupal.t('Loading token browser...') + '</div>').appendTo('body');

          // Emulate the AJAX data sent normally so that we get the same theme.
          var data = {};
          data['ajax_page_state[theme]'] = Drupal.settings.ajaxPageState.theme;
          data['ajax_page_state[theme_token]'] = Drupal.settings.ajaxPageState.theme_token;

          dialog.dialog({
            title: $(this).attr('title') || Drupal.t('Available tokens'),
            width: 700,
            close: function(event, ui) {
              dialog.remove();
            }
          });
          // Load the token tree using AJAX.
          $.ajax({
            type: 'POST',
            url: url,
            data: data,
            success: function (response, status, responseObj) {
              console.dir(arguments);

              var $table = $(getTable(response));
              var link = document.createElement('link');
              var firstScript = document.querySelector('script');
              var firstLink = document.querySelector('link');
              var script = document.createElement('script');

              link.rel = 'stylesheet';
              link.href = '/sites/all/modules/contrib/token/jquery.treeTable.css';
              script.async = true;
              firstScript.parentNode.insertBefore(script, firstScript);
              firstLink.parentNode.insertBefore(link, firstLink);

              script.addEventListener('load', function () {
                dialog
                  .empty()
                  .append($table);

                Drupal.attachBehaviors(dialog);
                //Drupal.behaviors.tokenTree.attach(dialog);
                //Drupal.behaviors.tokenInsert.attach(dialog);

                dialog.removeClass('loading');
              });


              script.src = '/sites/all/modules/contrib/token/jquery.treeTable.js';
              //tokenController.setupTokenList(dialog, response);
            }
          });
          // Prevent browser from following the link.
          return false;
        });
      }
    };

    /*Drupal.behaviors.tokenDialog = {
      attach: function (context, settings) {
        $('a.token-dialog', context).once('token-dialog').click(function() {
          var url = $(this).attr('href');
          var dialog = $('<div style="display: none" class="loading">' + Drupal.t('Loading token browser...') + '</div>').appendTo('body');

          // Emulate the AJAX data sent normally so that we get the same theme.
          var data = {};
          data['ajax_page_state[theme]'] = Drupal.settings.ajaxPageState.theme;
          data['ajax_page_state[theme_token]'] = Drupal.settings.ajaxPageState.theme_token;
          //var $sourceTable;
          //var $targetTable;

          dialog.dialog({
            title: $(this).attr('title') || Drupal.t('Available tokens'),
            width: 800,
            close: function(event, ui) {
              dialog.remove();
            }
          });

          /!*console.dir($dialogModel);*!/

          $.ajax({
            type: 'POST',
            url: url,
            data: data,
            success: function (response, status, responseObj) {
              console.dir(arguments);
              dialog.removeClass('loading');

              tokenController.setupTokenList(dialog, response);

              /!*dialog.removeClass('loading');

              $sourceTable = getTable(response);
              $targetTable =
                $sourceTable
                  .clone();
                  /!*.find('tbody')
                  .empty();*!/

              dialog
                .empty()
                .append($targetTable);
              //console.dir($dialogModel);

              var $tokenKey = $targetTable
                .find('.token-key');


              $tokenKey.each(processTokenClickInsert);*!/

              //$($sourceTable).treeTable();
            }
          });
          // Prevent browser from following the link.
          return false;
        });
      }
    };*/

    /*Drupal.behaviors.tokenInsert = {
      attach: function (context, settings) {
        // Keep track of which textfield was last selected/focused.
        var $inputs = $('textarea, input[type="text"]', context);

        $inputs.once(function () {
          $(this).focus(function() {
            Drupal.settings.tokenFocusedField = this;
          });
        });

        var $tokenClickInsert = $('.token-click-insert .token-key', context);

        for (var i = 0; i < $tokenClickInsert.length; i += 5000) {
          var lastRun = false;
          var start = i;
          var end;

          if (start + 5000 <= $tokenClickInsert.length) {
            end = start + 500;
          } else {
            end = $tokenClickInsert.length;
            lastRun = true;
          }

          var $currtokenClickInsert = $tokenClickInsert.slice(start, end);

          $currtokenClickInsert.once('token-click-insert', processTokenClickInsert);

          if (lastRun) break;
        }


        /!*$tokenClickInsert.once('token-click-insert', function() {
         var newThis = $('<a href="javascript:void(0);" title="' + Drupal.t('Insert this token into your form') + '">' + $(this).html() + '</a>').click(function(){
         if (typeof Drupal.settings.tokenFocusedField == 'undefined') {
         alert(Drupal.t('First click a text field to insert your tokens into.'));
         }
         else {
         var myField = Drupal.settings.tokenFocusedField;
         var myValue = $(this).text();

         //IE support
         if (document.selection) {
         myField.focus();
         sel = document.selection.createRange();
         sel.text = myValue;
         }

         //MOZILLA/NETSCAPE support
         else if (myField.selectionStart || myField.selectionStart == '0') {
         var startPos = myField.selectionStart;
         var endPos = myField.selectionEnd;
         myField.value = myField.value.substring(0, startPos)
         + myValue
         + myField.value.substring(endPos, myField.value.length);
         } else {
         myField.value += myValue;
         }

         $('html,body').animate({scrollTop: $(myField).offset().top}, 500);
         }
         return false;
         });
         $(this).html(newThis);
         });*!/
      }
    };*/

    function getTable(response) {
      var startPattern = '<table';
      var endPattern = '</table>';
      var start = response.indexOf(startPattern);
      var end = response.indexOf(endPattern);

      if (~start && ~end) {
        end += endPattern.length;
      } else {
        return null;
      }

      return response.slice(start, end);



      /*var $html = $(response);

      for(var i = 0; i < $html.length; i++) {
        var node = $html.eq(i);

        if (!node.is('table.token-tree')) continue;

        return $(node);
      }*/
    }

    function processTokenClickInsert() {
      var newThis = $('<a href="javascript:void(0);" title="' + Drupal.t('Insert this token into your form') + '">' + $(this).html() + '</a>').click(function(){
        if (typeof Drupal.settings.tokenFocusedField == 'undefined') {
          alert(Drupal.t('First click a text field to insert your tokens into.'));
        }
        else {
          var myField = Drupal.settings.tokenFocusedField;
          var myValue = $(this).text();

          //IE support
          if (document.selection) {
            myField.focus();
            sel = document.selection.createRange();
            sel.text = myValue;
          }

          //MOZILLA/NETSCAPE support
          else if (myField.selectionStart || myField.selectionStart == '0') {
            var startPos = myField.selectionStart;
            var endPos = myField.selectionEnd;
            myField.value = myField.value.substring(0, startPos)
              + myValue
              + myField.value.substring(endPos, myField.value.length);
          } else {
            myField.value += myValue;
          }

          $('html,body').animate({scrollTop: $(myField).offset().top}, 500);
        }
        return false;
      });
      $(this).html(newThis);
    }

    /*Drupal.behaviors.tokenInsert = {
      attach: function (context, settings) {
        // Keep track of which textfield was last selected/focused.
        $('textarea, input[type="text"]', context).focus(function() {
          Drupal.settings.tokenFocusedField = this;
        });

        $('.token-click-insert .token-key', context).once('token-click-insert', function() {
          var newThis = $('<a href="javascript:void(0);" title="' + Drupal.t('Insert this token into your form') + '">' + $(this).html() + '</a>').click(function(){
            if (typeof Drupal.settings.tokenFocusedField == 'undefined') {
              alert(Drupal.t('First click a text field to insert your tokens into.'));
            }
            else {
              var myField = Drupal.settings.tokenFocusedField;
              var myValue = $(this).text();

              //IE support
              if (document.selection) {
                myField.focus();
                sel = document.selection.createRange();
                sel.text = myValue;
              }

              //MOZILLA/NETSCAPE support
              else if (myField.selectionStart || myField.selectionStart == '0') {
                var startPos = myField.selectionStart;
                var endPos = myField.selectionEnd;
                myField.value = myField.value.substring(0, startPos)
                  + myValue
                  + myField.value.substring(endPos, myField.value.length);
              } else {
                myField.value += myValue;
              }

              $('html,body').animate({scrollTop: $(myField).offset().top}, 500);
            }
            return false;
          });
          $(this).html(newThis);
        });
      }
    };*/
  })();


  (function ($) {



  })(jQuery);

})(jQuery, Drupal, this, this.document);