jQuery(document).ready(function ($) {
  /*preloader*/
  (function () {
    var $preloader = $(document.getElementById('preloader'));

    $preloader.fadeOut();
  })();
});


/*Behaviors*/
(function($) {

  /*span to placeholder*/
  (function() {
    Drupal.behaviors.adminCuponToPlaceholder = {
      attach: function (context) {
        $('.field-wrap .label', context).once(function(){
          var $label = $(this);
          var $input = $label.parent().find('input[type="text"]');

          $input.attr('placeholder', $label.text());
          $label.hide();
        });
      }
    };
  })();

  /*adding label for radio and checkbox*/
  (function() {
    Drupal.behaviors.radioNcheckboxLabelAdd = {
      attach: function (context) {
        var $input = $('input[type = "radio"], input[type = "checkbox"]', context);

        $input.once(function () {
          var $currInput = $(this);
          var $label = $currInput.next('label');
          var type = $currInput.attr('type');
          var hasName = this.hasAttribute('name');
          var $siblingsInput = $currInput.siblings('input[type = "' + type + '"][name]');

          if ($label.length) return;
          if (!hasName && $siblingsInput.length) return;

          $currInput.hide();
          renderLabel($currInput);
        });
      }
    };

    var idCounter = 0;

    function renderLabel($input) {
      $input.each(function () {
        var $currInput = $(this);
        var id = $currInput.attr('id') || 'input-id-renedered-' + (idCounter++);
        var $label = $('<label class="option">');


        if (!$currInput.attr('id')) {
          $currInput.attr('id', id);
        }

        $label
          .attr('for', id)
          .insertAfter($currInput);
      });
    }
  })();

  /*task chekbox togglers*/
  (function() {
    Drupal.behaviors.checkboxToggler = {
      attach: function (context) {
        var options = {
          getTarget: function ($checkbox) {
            var $parent = $checkbox.closest('.js__checkboxTogglerDelegated');
            var $target = $($parent.attr('data-ctd-target'));

            return $target;
          }
        };

        $('input[type="checkbox"]', context).once('checkbox-toggler-processed').each(function () {
          var checkboxTogglerDelegated =  this.closest('.js__checkboxTogglerDelegated');

          if (!checkboxTogglerDelegated) return;

          var checkboxSelector = checkboxTogglerDelegated.getAttribute('data-ctd-checkbox');

          if (checkboxSelector && !this.matches(checkboxSelector)) return;

          var $checkbox = $(this);

          $checkbox.jElementToggler(options);
        });
      }
    };
  })();

  /*input mask phone disabling*/
  (function() {
    var pradiz = 'pradizdev.ru';
    var host = window.location.hostname;

    if (!~host.indexOf(pradiz)) return;
    if (!$.fn.mask) return;

    Drupal.behaviors.masksDestroy = {
      attach: function(context) {
        (function () {
          var $phone = $('input.phone, input[name="submitted"], input[name="phone"], .field-delivery_phone input[type="text"]', context);

          setTimeout(function () {
            $phone.once(function () {
              var $tel = $(this);

              $tel.unmask();
            });
          }, 200);
        })();
      }
    };
  })();

  /*comments length validation for sms*/
  (function() {
    /*Validator*/
    function Validator(options) {
      this.submit = options.submit || null;
      this.select = options.select || null;
      this.sourceInput = options.sourceInput || null;
      this.maxSmsLen = options.maxSmsLen || 160;
      this.$submitClone = null;
      this.events = {
        action: 'click keyup',
        change: 'change',
        input: 'input'
      };
      this.className = {
        error: 'error',
        success: 'success',
        processed: 'validator-processed',
        submitClone: 'submit-clone'
      };
    }
    Validator.prototype.init = function () {
      var isElements = this.bindElements();

      if (!isElements) return;

      //this.detachHandlers(); //if reinit dataching all old handlers
      this.renderSubmitClone();
      this.bindHandlers();
      this.attachHandlers();
    };
    Validator.prototype.submitHandler = function (e) {
      e.preventDefault();

      if (!this.validate()) return;

      //this.showOriginal(true);

      this.$submitOriginal.trigger(e.type);
    };
    Validator.prototype.validate = function() {
      var $comments = this.$sourceInput;
      var isValid = true;
      var _ = this;

      $comments.each(function () {
        var str = this.value || this.textContent;

        if (_.isSms && str.length > _.maxSmsLen) {
          isValid = false;
          _.showError($(this).parents('.form-textarea-wrapper'));
        } else {
          _.hideError($(this).parents('.form-textarea-wrapper'));
        }
      });

      return isValid;
    };
    Validator.prototype.renderSubmitClone = function () {
      var $submitOriginal = this.$submitOriginal;
      var $submitClone = this.$submitClone;

      if ($submitClone && $submitClone.length && $submitOriginal.siblings($submitClone)) {
        return;
      }

      $submitClone = $('<input>');

      $submitClone
        .attr('type', $submitOriginal.attr('type'))
        .attr('class', $submitOriginal.attr('class'))
        .val($submitOriginal.val())
        .addClass(this.className.submitClone);

      //this.$submitClone = this.$submitOriginal.clone();
      this.$submitClone = $(this.$submitClone).add($submitClone);

      $submitOriginal.eq(0).after($submitClone);
      this.showClone();
    };
    Validator.prototype.showOriginal = function (removeClone) {
      this.$submitOriginal.show();
      this.$submitClone
        .hide();

      if (removeClone) {
        this.$submitClone.remove();
      }
    };
    Validator.prototype.showClone = function () {
      this.$submitOriginal.hide();
      this.$submitClone.show();
    };
    Validator.prototype.showError = function (el) {
      var $parent = $(el);
      var $errorMess = $parent.find('.messages.error');

      if (!$errorMess.length) {
        $errorMess = this.renderError();
        $parent.append($errorMess);
      }

      $errorMess.fadeIn(200);
    };
    Validator.prototype.hideError = function (el) {
      var $parent = $(el);
      var $errorMess = $parent.find('.messages.error');

      if (!$errorMess) return;

      $errorMess.fadeOut(200);
    };
    Validator.prototype.renderError = function () {
      var $errorMess = $('<div class="messages error">' + Drupal.t('SMS reply works only with 160 symbols. You sould decrease symbols quantity to allowed value.') + '</div>');

      return $errorMess;
    };
    Validator.prototype.onSelectChange = function (e) {
      this.isSms = !!~e.val.indexOf('sms');
      this.validate();
    };
    Validator.prototype.onSourceInput = function () {
      this.validate();
    };
    Validator.prototype.once = function (el, func) {
      var className = this.className.processed;

      $(el).each(function () {
        var $currEl = $(this);

        if ($currEl.hasClass(className)) return;

        $currEl.addClass(className);
        func.call(this);
      });
    };
    Validator.prototype.bindElements = function () {
      this.$submitOriginal = $(this.submit)
        .not(this.$submitClone)
        .not('.' + this.className.submitClone);
      this.$select = $(this.select);
      this.$sourceInput = $(this.sourceInput);

      return !!(this.$submitOriginal.length
        && this.$select.length
        && this.$sourceInput.length);
    };
    Validator.prototype.bindHandlers = function () {
      this._submitHandler = this.submitHandler.bind(this);
      this._onSelectChange = this.onSelectChange.bind(this);
      this._onSourceInput = this.onSourceInput.bind(this);
    };
    Validator.prototype.attachHandlers = function () {
      var _ = this;

      this.once(this.$submitClone, function () {
        $(this).on(_.events.action, _._submitHandler);
      });

      this.once(this.$select, function () {
        $(this).on(_.events.change, _._onSelectChange);
      });

      this.once(this.$sourceInput, function () {
        $(this).on(_.events.input, _._onSourceInput);
      });

    };
    Validator.prototype.detachHandlers = function () {

    };

    var options = {
      submit: '.comment-form .form-actions .form-submit:not(.submit-clone)',
      select: '.comment-form select[name="field_reminder_type[und][]"]',
      sourceInput: '#field-comment-body-add-more-wrapper .form-textarea-wrapper textarea'
    };
    var validator = new Validator(options);
    var selectorEl = '';

    for (var key in options) {
      selectorEl += options[key] + ',';
    }
    selectorEl = selectorEl.slice(0, selectorEl.length - 1);

    Drupal.behaviors.smsLengthValidation = {
      attach: function (context) {
        var $el = $(selectorEl, context);

        $el.once(function () {
          validator.init();
        });
      }
    };
  })();
})(jQuery);
