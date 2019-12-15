/*Form*/
(function ($) {
  function FormController(options) {
    this._submitSelector = options.submitSelector || 'input[type="submit"]';
    this._listenedBlock = options.listenedBlock || 'body';
    this._customValidation = options.validation || [];
    /*{
      selector: '',
      meth: function($field) { return boolean},
      errorMes: ''
    }*/
    this._resetForm = options.resetForm || true;
    this._afterValidate = options.afterValidate || null;
    this._beforeSend = options.beforeSend || null;
    this._resolve = options.resolve || null;
    this._reject = options.reject || null;
    this._maxFileSize = options.maxFileSize || 2; //MB
  }

  FormController.prototype.init = function () {
    var $listenedBlock = this._$listenedBlock = $(this._listenedBlock);
    var $submitBtn = this._$submitBtn = $listenedBlock.find(this._submitSelector);

    if (!$listenedBlock.length) return;

    $listenedBlock.on('click', this.formListeners.bind(this));

    if ($listenedBlock.find('input[type="file"]').length) {
      $listenedBlock.on('change', this.uploadListener.bind(this));
    }
  };
  FormController.prototype.validateForm = function (form) {
    var vResult = true;
    var passCurr = false;
    var self = this;

    $('input[name!="submit"][type!="submit"], textarea', $(form))
      .not('input[name="submit"], input[type="submit"], :hidden')
      .each(function () {
        var $field = $(this);
        var filedTitle =
          $field.attr('data-old-placeholder') ||
          $field.attr('data-name') ||
          $field.attr('placeholder') ||
          '';
        var vVal = $field.val();
        var requiredField = $field.attr('required') || $field.hasClass('required');
        var pattern = '';
        var placeholderMess = '';
        var customValidated = false;

        $field.removeClass('form-fail'); //чистим классы, если остались после прошлого раза
        $field.removeClass('form-success');

        if (filedTitle) {
          filedTitle = filedTitle.replace(/\*|:?/g, '');
          filedTitle = '"' + filedTitle + '" ';
        }


        for (var i = 0; i < self._customValidation.length; i++) {
          var customValidation = self._customValidation[i];

          if ($field.is(customValidation.selector)) {
            var currResult = customValidation.meth($field);
            customValidated = true;

            if (!currResult) {
              placeholderMess = customValidation.errorMes || 'Поле ' + filedTitle + 'обязательное!';
              vResult = false;
            } else {
              $field.addClass('form-success');
            }

            break;
          }
        }

        if (requiredField && !customValidated) {
          if (vVal.length === 0 && requiredField) {
            placeholderMess = 'Поле ' + filedTitle + 'обязательное!';
            vResult = false;
          } else if ($field.attr('name') === 'mail' && vVal.length) {
            pattern = /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i;

            if (pattern.test($field.val())) {
              $field.addClass('form-success');
            } else {
              placeholderMess = 'Введите корректный E-mail!';
              vResult = false;
            }
          } else if ($field.attr('name') === 'phone' && vVal.length) {
            pattern = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/i;

            if (pattern.test($(this).val())) {
              $field.addClass('form-success');
            } else {
              placeholderMess = 'Введите корректный телефон!';
              vResult = false;
            }
          } else if ($field.attr('name') === 'passCurr' && vVal.length) {
            passCurr = this;
          } else if ($field.attr('name') === 'passNew' && vVal.length) {
            if (vVal === $(passCurr).val()) {
              $(passCurr).val('').addClass('form-fail').attr('placeholder', 'Новый пароль, не должен совпадать с текущим!');
              placeholderMess = 'Новый пароль, не должен совпадать с текущим!';
            } else {
              $field.addClass('form-success');
              $(passCurr).addClass('form-success');
            }
          } else if ($field.is('textarea') && vVal.length < 10 && vVal.length > 0 && requiredField) {
            placeholderMess = 'Сообщение слишком короткое!';
            vResult = false;
          } else if (requiredField && vVal.length) {
            $field.addClass('form-success');
          }
        }

        if (placeholderMess) {
          if (!$field.attr('data-old-placeholder')) {
            $field.attr('data-old-placeholder', $field.attr('placeholder'));
          }

          $field.val('')
            .attr('placeholder', placeholderMess)
            .addClass('form-fail');
          placeholderMess = '<span class="form-fail">' + placeholderMess + '</span>';
          self.changeLabel($field, placeholderMess, 'span.placeholder');
        }
      });

    return vResult;
  };
  FormController.prototype.uploadListener = function (e) {
    var elem = e.target;

    if (!elem.matches('input[type="file"]'))  return;

    var size = this.getFileSize(elem);

    if (size < this._maxFileSize * 1024 * 1024) return;

    alert("Файл слишком большой. Размер вашего файла " + (size / 1024 / 1024).toFixed(2) +
      " MB. Загружайте файлы меньше " + this._maxFileSize + "MB.");
    $(elem).val('');
  };
  FormController.prototype.getFileSize = function (input) {
    var file;

    if (typeof ActiveXObject == "function") { // IE
      file = (new ActiveXObject("Scripting.FileSystemObject")).getFile(input.value);
    } else {
      file = input.files[0];
    }

    return file.size;
  };
  FormController.prototype.changeLabel = function (elem, val, insideLabelSelector) {
    var selector = 'label[for="' + $(elem).attr('id') + '"] ' + insideLabelSelector || '';
    var $label = $(selector);

    if ($label.length) {
      $label.each(function () {
        this.innerHTML = val;
      });
    }
  };
  FormController.prototype.resetForms = function (formContainer) {
    var $form;
    var self = this;

    if (formContainer.tagName === 'FORM') {
      $form = $(formContainer);
    } else {
      $form = $('form', $(formContainer));
    }

    $form.each(function () {
      self.resetPlaceholders(this);
      if (self._resetForm) {
        this.reset();
        self.triggerChange(this);
      }
    });
  };
  FormController.prototype.resetPlaceholders = function (inputContainer) {
    var self = this;
    var $input;

    if (inputContainer.tagName === 'INPUT') {
      $input = $(inputContainer);
    } else {
      $input = $('input[name != submit]', $(inputContainer));
    }

    $input.each(function () {
      var name = $(this).attr('name');
      var placeholderMess = $(this).attr('data-old-placeholder');

      $(this).removeClass('form-success');
      $(this).removeClass('form-fail');

      if (!placeholderMess) return;

      $(this).attr('placeholder', placeholderMess);
      self.changeLabel(this, placeholderMess, 'span.placeholder');
    });
  };
  FormController.prototype.triggerChange = function (inputContainer) {
    var $input = null;

    if (inputContainer.tagName === 'INPUT') {
      $input = $(inputContainer);
    } else {
      $input = $('input[name != submit]', $(inputContainer));
    }

    $input.each(function () {
      $(this).trigger('change');
    });
  };
  FormController.prototype.formListeners = function (e) {
    var elem = e.target;

    if (!elem.matches(this._submitSelector)) return;

    e.preventDefault();

    if (this._sendingData) return;

    var form = elem.closest('form');

    if (this.validateForm(form)) {
      if (typeof this._afterValidate === 'function') {
        this.afterValidateProcessing(form);
      } else {
        this.sendRequest(form, this._resolve, this._reject, this._beforeSend);
      }
    }
  };
  FormController.prototype.afterValidateProcessing = function (form) {
    this._afterValidate.apply(this, [form]);
  };
  FormController.prototype.sendRequest = function (form, resolve, reject, beforeSend) {
    var formData = $(form).serializeArray(); //собираем все данные из формы
    var self = this;

    this._sendingData = true;

    if (beforeSend) {
      beforeSend.call(this, formData, form);
    }
    //console.dir(formData);

    this.showPending(form);

    $.ajax({
      type: form.method,
      url: form.action,
      data: $.param(formData),
      success: function (response, status, responseObj) {
        console.dir(arguments);

        if (responseObj.statusText === 'OK') {
          self.hidePending(form, self.showSuccess.bind(self, form));

          if (resolve) {
            resolve.apply(self, [form, response, status, responseObj]);
          }
        } else {
          self.hidePending(form, self.showError.bind(self, form));

          if (reject) {
            reject.apply(self, [form, response, status, responseObj]);
          }
        }

        self.resetForms(form);
        this._sendingData = false;
      },
      error: function (response) {

        //console.log(response);
        //throw new Error(response.statusText);
        self.hidePending(form, self.showError.bind(self, form));
        self.resetForms(form);
        this._sendingData = false;
      }
    });
  };
  FormController.prototype.showError = function (form) {
    var $errBlock = $('.err-block', $(form));

    $('.form-success', $(form)).removeClass('form-success');
    $errBlock.fadeIn(200);

    setTimeout(function () {
      $errBlock.fadeOut(200);
    }, 10000);
  };
  FormController.prototype.showSuccess = function (form) {
    var $succBlock = $('.succ-block', $(form));

    $('.form-success', $(form)).removeClass('form-success');
    $succBlock.fadeIn(200);

    setTimeout(function () {
      $succBlock.fadeOut('normal');
    }, 10000);
  };
  FormController.prototype.showPending = function (form) {
    var $pendingBlock = $('.pending-block', $(form));

    $pendingBlock.fadeIn(200);
  };
  FormController.prototype.hidePending = function (form, callback) {
    var $pendingBlock = $('.pend-block', $(form));

    if (!$pendingBlock[0]) {
      callback();
      return;
    }

    $pendingBlock.fadeOut('normal', 'linear', callback);
  };

  $.fn.formController = function () {
    var options = typeof arguments[0] === 'object' ? arguments[0] : {};
    var controllersArr = [];

    $(this).each(function () {
      if (isElement(this)) {
        options.listenedBlock = this;
      }

      var controller = new FormController(options);
      controller.init();
      //controllersArr.push(controller);
    });

    //return controllersArr;
  };

  //Returns true if it is a DOM element
  function isElement(o) {
    return (
      typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
      o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName === "string"
    );
  }
})(jQuery);