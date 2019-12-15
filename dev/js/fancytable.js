(function($) {

$.fn.ColumnHide = function ($col_num, first_element_num, last_element_num, hide_cols_with_colspan) {
    if (hide_cols_with_colspan != true) {
        hide_cols_with_colspan = false;
    }
    if ($col_num < first_element_num || $col_num > last_element_num) {
        return;
    }
    var col_num = $col_num;
    var hide_cols_with_colspan = hide_cols_with_colspan;
    $(this).find('tr').each(function(index, value) {
        tr = $(this);
        var td = $(tr).find('td').eq(col_num);

        if ($(td).hasClass('td-hidden')) {
            return;
        }

        if ($(td).hasClass('processed')) {
            return;
        }
        $(td).addClass('processed');

        if ($(td).attr('colspan') != undefined && hide_cols_with_colspan == false) {
            return;
        }

        $(td).addClass('td-hidden').removeClass('td-visible').removeClass('processed');
        $(td).hide();

        /*
        $(td).fadeOut(400, function(){
            $(td).addClass('td-hidden').removeClass('td-visible').removeClass('processed');
        });
        */

        /*
        var $td_content = $(td).html();

        $(td).wrapInner('<div class="td-wrapper"></div>');
        var div_wrapper = $(td).find('.td-wrapper');
        $(div_wrapper)
            .height($(td).height() - 15)
            .css({
                'overflow' : 'hidden',
            });

        $(div_wrapper).animate({
            'width': 0,
            },
            250,
            function() {
                $(td).hide();
                $(td).addClass('td-hidden').removeClass('td-visible').removeClass('processed');
                $(td).html($td_content);
            }
        );
        */
    });
};

$.fn.ColumnShow = function ($col_num, first_element_num, last_element_num) {
    if ($col_num < first_element_num || $col_num > last_element_num) {
        return;
    }
    var col_num = $col_num;
    $(this).find('tr').each(function(index, value) {
        tr = $(this);
        var td = $(tr).find('td').eq(col_num);

        if ($(td).hasClass('td-visible')) {
            return;
        }

        if ($(td).hasClass('processed')) {
            return;
        }
        $(td).addClass('processed');

        $(td).fadeIn(250, function(e){
            $(td).addClass('td-visible').removeClass('td-hidden').removeClass('processed');
        });

        /*
        var $td_content = $(td).html();
        $(td).wrapInner('<div class="td-wrapper"></div>');
        var $div_wrapper = $(td).find('.td-wrapper');
        $($div_wrapper)
            .height($(td).height())
            .css({
                'overflow' : 'hidden',
                'width' : 0,
            });
        $(td).show();
        $($div_wrapper).animate({
            'width': $($div_wrapper).closest('td').outerWidth(),
            },
            250,
            function() {
                $(window).trigger('scroll');
                $(td).html($td_content);
                $(td).addClass('td-visible').removeClass('td-hidden').removeClass('processed');
            }
        );
        */
    });
};

$.fn.fancytable = function (options) {

    this.init = function(options) {
        if ($(this).find('tr').length == 0) {
            return false;
        }

        var $table = this;
        /*
        $('.prodentity.noorder, .prodentity.preorder').each(function(key, val){
            var $prodentity = $(this);
            id = $(this).attr('id').replace(/sku-/g, "");
            $td = $($table).find('#' + id).closest('td');
            if ($td.length) {
              var col_index = $($td).closest('tr').find('td').index($td);
              $($table).find('tr').each(function(key, val){
                $(this).find('td').eq(col_index).each(function(){
                  if ($prodentity.hasClass('noorder')) {
                    $(this).remove();
                  }
                  if ($prodentity.hasClass('preorder')) {
                    $(this).addClass('preorder');
                  }
                });
              });
            }
        });
        */

        $($table).wrap('<div class="fancyTable-wrapper"></div>');
        var options = options;
        if (!options) {
            options = {};
        }
        this.options = options;
        this.default_options = {
            visible_columns : 'auto',
            max_visible_columns : 6,
            show_close_btn : true,
            show_hide_col_btn : true,
            left_offset : 1,
            right_offset : 0,
            step_size : 1,
            mode : ($('#p-tbl-compact').length == 0) ? 'compare' : 'compact',
            sticky_rows_visible : true,
            hidden_columns : [],
        }
        $.each(this.default_options, function(key, value){
            if (!(key in $table.options)) {
                $table_attr_option = $($table).attr('data-'+key);
                if (!$table_attr_option){
                    $table.options[key] = value;
                }
                else {
                    $table.options[key] = $table_attr_option;
                }
            }
        });
        if ($($table).attr('data-visible-columns') != undefined) {
            this.options.visible_columns = $($table).attr('data-visible-columns');
        }
        this.options.default_table = $(this).clone();
        this.options.first_element_num = this.options.left_offset;
        this.options.total_columns_count = this.GetColumnsCount();
        this.options.moving_columns_count = this.GetMovingColsCount();
        this.options.last_element_num = this.options.total_columns_count - this.options.right_offset;

        // вычисляем количество видимых колонок
        if (this.options.visible_columns == 'auto') {
            // количество колонок должно быть таково, чтобы они вмещались в блок "прокручиваемой"
            // таблицы.
            // Сам контейнер создаётся ниже по коду, исходя из количества колонок.
            // Для того чтобы узнать только ширину будущего контейнера - создаём временный блок того же класса
            $st_cont_temp = $('<div/>').addClass('scrolledTable-wrapper').appendTo('.alltext');
            $table_clone = $(this).clone();
            $($table_clone).appendTo($st_cont_temp);
            // Получаем ширину блока-контейнера
            var max_width = $($st_cont_temp).width();
            // Удаляем блок
            for (var i = 0; i < this.options.first_element_num; i++) {
                max_width -= $($table_clone).find('tr:first td').eq(i).outerWidth();
            }

            for (var i = this.options.last_element_num + 1; i < this.options.total_columns_count; i++) {
                max_width -= $($table_clone).find('tr:first td').eq(i).outerWidth();
            }
            var column_width = 0;
            for (var i = this.options.first_element_num; i <= this.options.last_element_num; i++) {
                column_width += $($table_clone).find('tr:first td').eq(i).outerWidth(true);
            }
            column_width = column_width / this.options.moving_columns_count | 0;

            this.options.visible_columns = max_width / column_width | 0; // деление без остатка
            if (this.options.visible_columns > this.options.max_visible_columns) {
                this.options.visible_columns = this.options.max_visible_columns;
            }
            $($table_clone).remove();
            $($st_cont_temp).remove();
        }

        this.SetPagesCount();

        this.SetTableCompact();
        this.SetTableCompare();
        this.SetMode(this.options.mode);
    }

    this.SetPagesCount = function (pages_count) {
        if (isNaN(pages_count)) {
            pages_count = (this.options.moving_columns_count - this.options.visible_columns) / this.options.step_size + 1;
            pages_count_round = Math.round(pages_count);
            this.options.pages_count = pages_count_round;
            if (pages_count > pages_count_round) {
                this.options.pages_count++;
            }
        }
        else if (pages_count < 1) {
            this.options.pages_count = 1;
        }
        else {
            this.options.pages_count = pages_count;
        }
    }

    this.SetMode = function (mode) {
        if(mode == 'compact') {
            $('.fancyTable-wrapper .scrolledTable-wrapper').hide();
            $('.fancyTable-wrapper .compactTable-wrapper').show();
        }
        else if (mode == 'compare') {
            this.options.hidden_columns = [];
            this.SetPagesCount();
            this.SetPage(0);
            if (this.options.counter != undefined) {
                this.options.counter.RefreshTitle();
            }
            $('.fancyTable-wrapper .compactTable-wrapper').hide();
            $('.fancyTable-wrapper .scrolledTable-wrapper').show();
        }
        $(window).trigger('scroll');
    }

    this.SetTableCompact = function () {
        var $table = this;
        var $compactWrapper = $('<div/>')
            .addClass('compactTable-wrapper');
        var $compact_table = $($table).clone();
        $($compact_table).html('');
        $($compact_table).attr('width', '100%');
        $($compact_table).append('<thead></thead>');

        var thead_rows_count = $($table).find('thead tr').length;

        from = this.options.first_element_num;
        to = from + this.options.visible_columns;

        while (true) {
            for (var i = 0; i < thead_rows_count; i++) {
                var $tr = $('<tr></tr>')
                        .attr('class', $($table).find('thead tr').eq(i).attr('class'));
                for (var j = from; j < to; j++) {
                    var $td = $($table).find('thead tr').eq(i).find('td').eq(j).clone();
                    if (j > from && $($td).hasClass('new-line') && !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))) {
                        to = j;
                        break;
                    }
                    $($tr).append($td);
                }
                $($compact_table).find('thead').append($($tr).clone());
            }
            if (j >= this.options.last_element_num) {
                break;
            }
            from = to;
            to += this.options.visible_columns;
        };

        $($compact_table).find('thead h4').each(function(index, value){
            $close_btn = $('<span/>')
                .addClass('compare')
                .text('сравнить');
            $(this).after($close_btn);
        });
        $($compactWrapper).append($compact_table);
        $($compactWrapper).on('click', 'span.compare', function(e){
            $table.SetMode('compare');
        });
        $(this).closest('.fancyTable-wrapper').append($compactWrapper);
    }

    this.SetTableCompare = function () {
        var $table = this;
        if (this.options.show_hide_col_btn) {
          $(this).find('thead h4').each(function(i, v){
            index = i + parseInt($table.options.left_offset);
            $close_btn = $('<span/>')
            .addClass('compare')
            .addClass('hideCol')
            .attr('data-col-num', index)
            .text('убрать');
            $($close_btn).on('click', function(e){
              if ( ($table.options.hidden_columns.length + 1) == $table.options.moving_columns_count) {
                return;
              }
              col_num = parseInt($(this).attr('data-col-num'));
              if ($.inArray(col_num, $table.options.hidden_columns) < 0) {
                $table.options.hidden_columns.push(col_num);
                $table.SetPagesCount($table.options.pages_count - 1);
                $table.options.counter.RefreshTitle();
              }
              $table.SetPage($table.options.page);
            });
            $(this).after($close_btn);
          });
        }

        this.SetScrolledTableWrapper();

        this.SetStickyRows();
        this.SetPage(0);

        this.options.counter = this.GetCounter();
        $(this.options.counter).find('.close-compare').click(function(e){
            $table.SetMode('compact');
        });
        this.options.counter.RefreshTitle();
        $(this).closest('.scrolledTable-wrapper').append(this.options.counter);
        $(this).attr('width', '100%');
    }

    this.destroy = function () {
        $(this).closest('.fancyTable-wrapper').replaceWith($(this.options.default_table));
    };

    this.SetStickyRows = function () {
        var fancytable = this;
        var $table = $(this);
        var $sticky_rows_count = this.options.sticky_rows_count = $($table).find('tr.sticky').length;

        $(this).find('tr.sticky').each(function(index, value){
            var $sticky_tr = $(this);
            var $sticky_row_num = index;
            $($sticky_tr).find('td').each(function(index, value){
                var $sticky_td = $(this);
                var $sticky_td_block = $('<div/>')
                    .addClass('sticky-td')
                    .addClass('sticky-row-' + $sticky_row_num)
                    .attr('data-sticky-row', $sticky_row_num)
                    .css({
                        'position' : 'absolute',
                        'z-index' : '9999',
                    })
                    .height($($sticky_td).outerHeight())
                    .hide();
                $($sticky_td_block).append($($sticky_td).html());
                $($sticky_td_block).find('.hideCol').replaceWith($($sticky_td).find('.hideCol').clone(true, true));

                $(window).on('scroll', function(e){

                    td_offset_top = $($sticky_td)[0].getBoundingClientRect().top * -1;
                    for (var i = 0; i < $($sticky_td_block).attr('data-sticky-row'); i++) {
                        td_offset_top += $($table).find('.sticky-td.sticky-row-'+i).height();
                    };
                    $($sticky_td).find('.sticky-td').css({
                        'top' : td_offset_top + 'px',
                    });

                    // Убираем меню если прилипает таблица
                    var elTop = $('.scrolledTable-navigation.floatyClone.floatyClone-element').css('top');
                    if (parseInt(elTop) > 30) {
                        $('#int-menu').css('top', '-100px');
                    }
                    else {
                        $('#int-menu').css('top', '0px');
                    }
                });

                $(this).append($($sticky_td_block));
            });
        });

        $(window).on('scroll', function(e){
          if ($($table).find('.sticky-td').length) {
            first_sticky_block = $($table).find('.sticky-td').first();
            last_sticky_block = $($table).find('.sticky-td').last();
            window_offset_top = $($(first_sticky_block).closest('td'))[0].getBoundingClientRect().top;
            cur_td_offset_top = window_offset_top * -1;

            if((window_offset_top < cur_td_offset_top) && ($(window).scrollTop() < ($($table).offset().top+$($table).height()-$(last_sticky_block).height()))) {
              $($table).find('.sticky-td').each(function(){
                $(this).addClass('show').removeClass('hide').show();
              });
            }
            else{
              $($table).find('.sticky-td').each(function(){
                $(this).addClass('hide').removeClass('show').hide();
              });
            }
          }
        });
    }

    this.SetPage = function ($page_num) {
        if ($page_num < 1 || isNaN($page_num)) {
            $page_num = 1;
        }
        if ($page_num > this.options.pages_count) {
            $page_num = this.options.pages_count;
        }
        from = this.options.first_element_num;
        to = this.options.last_element_num;
        visible_cols_indexes = [];
        for(var i = from; i < to; i++){
            if ($.inArray(i, this.options.hidden_columns) < 0) {
                visible_cols_indexes.push(i);
            }
        }
        start = ($page_num - 1) * this.options.step_size;
        visible_cols_indexes = visible_cols_indexes.slice(start);
        visible_cols_indexes = visible_cols_indexes.slice(0, this.options.visible_columns);

        for(var i = from; i < to; i++){
            if ($.inArray(i, visible_cols_indexes) < 0) {
                $(this).ColumnHide(i, this.options.first_element_num,  this.options.last_element_num);
            }
            else{
                $(this).ColumnShow(i, this.options.first_element_num,  this.options.last_element_num);
            }
        }
        this.options.page = $page_num;
        if (this.options.counter != undefined) {
            this.options.counter.RefreshTitle();
        }
        $(window).trigger('scroll');
    }

    this.GetPage = function () {
        return this.options.page;
    }

    this.NextPage = function () {
        return this.SetPage(this.GetPage() + 1);
    }

    this.PrevPage = function () {
        return this.SetPage(this.GetPage() - 1);
    }

    this.GetColumnsCount = function () {
        var count = $(this).find('tr').first().find('td').length;
        return count;
    };

    this.GetMovingColsCount = function () {
        var count = this.GetColumnsCount() - this.options.left_offset - this.options.right_offset;
        return count;
    };

    this.SetScrolledTableWrapper = function () {
        $wrapper = $('<div/>')
            .addClass('scrolledTable-wrapper')
            .addClass('scrolledTable-noLeftScroll');
        if (this.options.moving_columns_count > this.options.visible_columns) {
          $($wrapper).addClass('scrolledTable-wrapper--counter');
        }
        $(this).wrap($wrapper);
    };

    this.GetCounter = function () {
        var $table = this;

        var $counter = $('<div/>')
            .addClass('scrolledTable-navigation')
            .addClass('floatyClone')
            .addClass('floatyClone-element');
        $title = $('<span/>')
            .addClass('scrolledTable-navigation-text')
            .addClass('scrolledTable-text')
            .addClass('scrolledTable-text-shownColumns-total-shownFrom-shownTo');
        $controls = $('<span/>')
            .addClass('scrolledTable-navigation-controls');
        $arrow_left = $('<span/>')
            .addClass('scrolledTable-navigation-sctollLeft');
        $arrow_right = $('<span/>')
            .addClass('scrolledTable-navigation-sctollRight');
        $counter.blocks = [];
        $counter.blocks.title = $title;

        $controls.append($arrow_left);
        $controls.append($arrow_right);

        if (this.options.show_close_btn) {
          $close_btn = $('<div/>')
          .addClass('lvl-b-1')
          .wrapInner($('<a/>').addClass('close-compare').text('закрыть'));
          $controls.append($close_btn);
        }

        $counter.append($title);
        $counter.append($controls);

        if (this.options.moving_columns_count <= this.options.visible_columns) {
            $($arrow_left).hide();
            $($arrow_right).hide();
            $($title).hide();
        }

        $counter.RefreshTitle = function (text) {
            if (text == undefined) {
                text = $table.options.page + '/' + $table.options.pages_count;
            }
            $(this.blocks.title).text(text);
        }

        $($arrow_left).click(function(e){
            $table.PrevPage();
            $counter.RefreshTitle();
        });

        $($arrow_right).click(function(e){
            $table.NextPage();
            $counter.RefreshTitle();
        });


        $(window).on('scroll', function(e){
            table_wrapper_window_offset_top = $($table).closest('.scrolledTable-wrapper')[0].getBoundingClientRect().top;
            counter_window_offset_top = $($counter)[0].getBoundingClientRect().top;
            offset = $($counter).offset();
            if((table_wrapper_window_offset_top < 0) && ($(window).scrollTop() < ($($table).offset().top+$($table).height()-$($counter).height()))) {
                offset_top = $($table)[0].getBoundingClientRect().top * -1;
                $($counter).css({
                    'top' : offset_top + 'px',
                });
            }
            else {
                $($counter).removeAttr('style');
            }
        });

        return $counter;
    };

    this.init(options);

    return this;
};




})(jQuery);
