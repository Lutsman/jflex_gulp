'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD (Register as an anonymous module)
    define(['jquery'], factory);
  } else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {
    // Node/CommonJS
    module.exports = factory(require('jquery'));
  } else {
    // Browser globals
    factory(jQuery);
  }
})(function ($) {
  var EqualSizeController = function () {
    function EqualSizeController(options) {
      _classCallCheck(this, EqualSizeController);

      this.$container = $(options.container);
      this.childrenSelectors = options.children || null;
      this.childrenArr = [];
      this.isActive = false;
    }

    _createClass(EqualSizeController, [{
      key: 'init',
      value: function init() {
        var _this = this;

        if (!this.$container.length) return;

        if ($.isArray(this.childrenSelectors)) {
          this.childrenSelectors.forEach(function (currChildrenSelector) {
            var currChildrenObj = {
              selector: null,
              included: [],
              excluded: []
            };
            currChildrenObj.selector = currChildrenSelector;
            _this.childrenArr.push(currChildrenObj);
          });
        } else if (typeof this.childrenSelectors === 'string') {
          var childrenObj = {
            selector: null,
            included: [],
            excluded: []
          };

          childrenObj.selector = this.childrenSelectors;
          this.childrenArr.push(childrenObj);
        }

        this.processingContainer();

        this._onResize = this._onResize ? this._onResize.bind(this) : this.processingContainer.bind(this);

        $(window).on('resize', this._onResize);
        this.isActive = true;
      }
    }, {
      key: 'stop',
      value: function stop() {
        var _this2 = this;

        if (this.childrenArr.length) {
          this.childrenArr.forEach(function (currChildren) {
            _this2.getChildren(_this2.$container, currChildren).each(function (index, el) {
              el.style.height = '';
            });
          });
        } else {
          this.getChildren(this.$container).each(function (index, el) {
            el.style.height = '';
          });
        }

        $(window).off('resize', this._onResize);
        this.isActive = false;
      }
    }, {
      key: 'run',
      value: function run() {
        if (this.isActive || !this.$container.length) return false;

        if (!this._onResize) {
          this._onResize = this.processingContainer.bind(this);
        }

        this._onResize();
        $(window).on('resize', this._onResize);
        return true;
      }
    }, {
      key: 'oneRun',
      value: function oneRun() {
        this.processingContainer();
      }
    }, {
      key: 'processingContainer',
      value: function processingContainer() {
        var $container = this.$container;
        var children = this.childrenArr;

        if (children.length) {
          var i = children.length - 1;
          var reverse = true;

          while (i < children.length) {
            this.setEqualSize($container, children[i]);

            if (i <= 0) {
              reverse = false;
            }

            if (reverse) {
              i--;
            } else {
              i++;
            }
          }
        } else {
          this.setEqualSize($container);
        }
      }
    }, {
      key: 'setEqualSize',
      value: function setEqualSize(container, children) {
        var _this3 = this;

        this.getMaxSize(container, children).then(function (size) {
          var $children = _this3.getChildren(container, children);

          $children.each(function (index, el) {
            el.style.height = size + 'px';
          });
        });
      }
    }, {
      key: 'getMaxSize',
      value: function getMaxSize(container, children) {
        var _this4 = this;

        return new Promise(function (resolve) {
          var $container = $(container);
          var $innerBlocks = _this4.getChildren($container, children);
          var maxHeight = 0;
          var _ = _this4;
          var $img = $innerBlocks.find('img');

          if ($img.length) {
            _this4.loadImg($img).then(function () {
              $innerBlocks.each(function () {
                var height = _.getSize($(this));

                if (height <= maxHeight) return;

                maxHeight = height;
              });

              /*$containerClone.remove();*/

              resolve(maxHeight);
            });
          } else {
            $innerBlocks.each(function () {
              var height = _.getSize($(this));

              if (height <= maxHeight) return;

              maxHeight = height;
            });

            /*$containerClone.remove();*/

            resolve(maxHeight);
          }
        });
      }
    }, {
      key: 'getSize',
      value: function getSize($el) {
        var height = 0;

        if (!$el.is(':hidden')) {
          height = $el.outerHeight();
          return height;
        }

        var $parents = $el.parents();

        if ($el.attr('style')) {
          $el.attr('data-cashed-style', $el.attr('style'));
          $el.show();
        }

        for (var i = 0; i < $parents.length; i++) {
          var $currParent = $parents.eq(i);

          if ($currParent.attr('style')) {
            $currParent.attr('data-cashed-style', $currParent.attr('style'));
          }

          $currParent.show();
        }

        height = $el.outerHeight();

        for (var _i = 0; _i < $parents.length; _i++) {
          var _$currParent = $parents.eq(_i);
          var cashedStyle = _$currParent.attr('data-cashed-style');

          if (cashedStyle) {
            _$currParent.attr('style', cashedStyle);
            _$currParent.removeAttr('data-cashed-style');
          }
        }

        return height;
      }
    }, {
      key: 'getChildren',
      value: function getChildren(container, children) {
        var $container = $(container);

        if (!children) {
          return $container.children();
        }

        if (typeof children === 'string' || (typeof children === 'undefined' ? 'undefined' : _typeof(children)) === $) {
          //probably could come just jq object
          return $container.find(children);
        }

        if ((typeof children === 'undefined' ? 'undefined' : _typeof(children)) === 'object' && children.selector) {
          var selector = children.selector;
          var $resultedChildren = $container.find(selector);

          if (children.included && children.included.length) {
            var $includedChildren = $container.find(children.included.join(', '));
            $resultedChildren = $resultedChildren.add($includedChildren);

            /*children.included.forEach((currIncluded) => {
             $resultedChildren = $resultedChildren.add($container.find(currIncluded));
             });*/
          }

          if (children.excluded && children.excluded.length) {
            var excludedChildren = children.excluded.join(', ');
            $resultedChildren = $resultedChildren.not(excludedChildren);
          }

          return $resultedChildren;
        }

        return false;
      }
    }, {
      key: 'addChildren',
      value: function addChildren(children, index) {
        if (typeof children !== 'string' || !this.childrenArr.length) return false;

        index = index || 0;
        var included = this.childrenArr[index].included;
        var excluded = this.childrenArr[index].excluded;
        var includedIndex = included.indexOf(children);
        var excludedIndex = excluded.indexOf(children);

        if (~includedIndex) return true;

        if (~excludedIndex) {
          excluded.splice(excludedIndex, 1);
        }

        included.push(children);
        this.oneRun();
        return true;
      }
    }, {
      key: 'removeChildren',
      value: function removeChildren(children, index) {
        if (typeof children !== 'string' || !this.childrenArr) return false;

        index = index || 0;
        var included = this.childrenArr[index].included;
        var excluded = this.childrenArr[index].excluded;
        var includedIndex = included.indexOf(children);
        var excludedIndex = excluded.indexOf(children);

        if (~excludedIndex) return true;

        this.stop();

        if (~includedIndex) {
          included.splice(includedIndex, 1);
        }

        excluded.push(children);
        this.run();
        return true;
      }
    }, {
      key: 'loadImg',
      value: function loadImg($img) {
        return new Promise(function (resolve) {
          var loadedImg = 0;

          $img.each(function () {
            var $currImg = $(this);
            var $imgClone = $('<img>');

            $imgClone.on('load error', function () {
              loadedImg++;

              if (loadedImg === $img.length) {
                resolve();
              }
            });

            $imgClone.attr('src', $currImg.attr('src'));
          });
        });
      }
    }, {
      key: 'getSelf',
      value: function getSelf() {
        return this;
      }
    }]);

    return EqualSizeController;
  }();

  $.fn.jEqualSize = function () {
    var _ = this;
    var options = arguments[0];
    var args = Array.prototype.slice.call(arguments, 1);

    for (var i = 0; i < _.length; i++) {
      if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
        options.container = _;
        _[i].jEqualSize = new EqualSizeController(options);
        _[i].jEqualSize.init();
      } else if (typeof options === 'undefined') {
        options = {
          container: _
        };
        _[i].jEqualSize = new EqualSizeController(options);
        _[i].jEqualSize.init();
      } else {
        var result = _[i].jEqualSize[options].call(_[i].jEqualSize, args);

        if (typeof result !== 'undefined') return result;
      }

      return _;
    }
  };
});

/*equal init*/
/*jQuery(document).ready(function ($) {
  /!*equal size simple*!/
  (function () {
    let $equalContainer = $('.js__equal');

    $equalContainer.jEqualSize();
  })();

  /!*equal size selective*!/
  (function () {
    let $equalContainer = $('.js__equal-select');
    let options = {
      children: '.js__equal-child'
    };

    $equalContainer.jEqualSize(options);
  })();

  /!*equal size selective multiple children*!/
  (function () {
    let $equalContainer = $('.js__equal-select-mult');
    let options = {
      children: ['.js__equal-child-1', '.js__equal-child-2', '.js__equal-child-3']
    };

    $equalContainer.jEqualSize(options);
  })();
});*/
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpzL2pFcXVhbFNpemUuZXM2LmpzIl0sIm5hbWVzIjpbImZhY3RvcnkiLCJkZWZpbmUiLCJhbWQiLCJleHBvcnRzIiwibW9kdWxlIiwicmVxdWlyZSIsImpRdWVyeSIsIiQiLCJFcXVhbFNpemVDb250cm9sbGVyIiwib3B0aW9ucyIsIiRjb250YWluZXIiLCJjb250YWluZXIiLCJjaGlsZHJlblNlbGVjdG9ycyIsImNoaWxkcmVuIiwiY2hpbGRyZW5BcnIiLCJpc0FjdGl2ZSIsImxlbmd0aCIsImlzQXJyYXkiLCJmb3JFYWNoIiwiY3VyckNoaWxkcmVuU2VsZWN0b3IiLCJjdXJyQ2hpbGRyZW5PYmoiLCJzZWxlY3RvciIsImluY2x1ZGVkIiwiZXhjbHVkZWQiLCJwdXNoIiwiY2hpbGRyZW5PYmoiLCJwcm9jZXNzaW5nQ29udGFpbmVyIiwiX29uUmVzaXplIiwiYmluZCIsIndpbmRvdyIsIm9uIiwiY3VyckNoaWxkcmVuIiwiZ2V0Q2hpbGRyZW4iLCJlYWNoIiwiaW5kZXgiLCJlbCIsInN0eWxlIiwiaGVpZ2h0Iiwib2ZmIiwiaSIsInJldmVyc2UiLCJzZXRFcXVhbFNpemUiLCJnZXRNYXhTaXplIiwidGhlbiIsIiRjaGlsZHJlbiIsInNpemUiLCJQcm9taXNlIiwicmVzb2x2ZSIsIiRpbm5lckJsb2NrcyIsIm1heEhlaWdodCIsIl8iLCIkaW1nIiwiZmluZCIsImxvYWRJbWciLCJnZXRTaXplIiwiJGVsIiwiaXMiLCJvdXRlckhlaWdodCIsIiRwYXJlbnRzIiwicGFyZW50cyIsImF0dHIiLCJzaG93IiwiJGN1cnJQYXJlbnQiLCJlcSIsImNhc2hlZFN0eWxlIiwicmVtb3ZlQXR0ciIsIiRyZXN1bHRlZENoaWxkcmVuIiwiJGluY2x1ZGVkQ2hpbGRyZW4iLCJqb2luIiwiYWRkIiwiZXhjbHVkZWRDaGlsZHJlbiIsIm5vdCIsImluY2x1ZGVkSW5kZXgiLCJpbmRleE9mIiwiZXhjbHVkZWRJbmRleCIsInNwbGljZSIsIm9uZVJ1biIsInN0b3AiLCJydW4iLCJsb2FkZWRJbWciLCIkY3VyckltZyIsIiRpbWdDbG9uZSIsImZuIiwiakVxdWFsU2l6ZSIsImFyZ3VtZW50cyIsImFyZ3MiLCJBcnJheSIsInByb3RvdHlwZSIsInNsaWNlIiwiY2FsbCIsImluaXQiLCJyZXN1bHQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsQ0FBQyxVQUFVQSxPQUFWLEVBQW1CO0FBQ2xCLE1BQUksT0FBT0MsTUFBUCxLQUFrQixVQUFsQixJQUFnQ0EsT0FBT0MsR0FBM0MsRUFBZ0Q7QUFDOUM7QUFDQUQsV0FBTyxDQUFDLFFBQUQsQ0FBUCxFQUFtQkQsT0FBbkI7QUFDRCxHQUhELE1BR08sSUFBSSxRQUFPRyxPQUFQLHlDQUFPQSxPQUFQLE9BQW1CLFFBQXZCLEVBQWlDO0FBQ3RDO0FBQ0FDLFdBQU9ELE9BQVAsR0FBaUJILFFBQVFLLFFBQVEsUUFBUixDQUFSLENBQWpCO0FBQ0QsR0FITSxNQUdBO0FBQ0w7QUFDQUwsWUFBUU0sTUFBUjtBQUNEO0FBQ0YsQ0FYRCxFQVdHLFVBQVVDLENBQVYsRUFBYTtBQUFBLE1BRVJDLG1CQUZRO0FBR1osaUNBQVlDLE9BQVosRUFBcUI7QUFBQTs7QUFDbkIsV0FBS0MsVUFBTCxHQUFrQkgsRUFBRUUsUUFBUUUsU0FBVixDQUFsQjtBQUNBLFdBQUtDLGlCQUFMLEdBQXlCSCxRQUFRSSxRQUFSLElBQW9CLElBQTdDO0FBQ0EsV0FBS0MsV0FBTCxHQUFtQixFQUFuQjtBQUNBLFdBQUtDLFFBQUwsR0FBZ0IsS0FBaEI7QUFDRDs7QUFSVztBQUFBO0FBQUEsNkJBVUw7QUFBQTs7QUFDTCxZQUFJLENBQUMsS0FBS0wsVUFBTCxDQUFnQk0sTUFBckIsRUFBNkI7O0FBRTdCLFlBQUlULEVBQUVVLE9BQUYsQ0FBVSxLQUFLTCxpQkFBZixDQUFKLEVBQXVDO0FBQ3JDLGVBQUtBLGlCQUFMLENBQXVCTSxPQUF2QixDQUErQixVQUFDQyxvQkFBRCxFQUEwQjtBQUN2RCxnQkFBSUMsa0JBQWtCO0FBQ3BCQyx3QkFBVSxJQURVO0FBRXBCQyx3QkFBVSxFQUZV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QyxDQUFQO0FBQ0Q7QUFDRixHQXhCRDtBQXlCRCxDQWpWRDs7QUFtVkE7QUFDQSIsImZpbGUiOiJqcy9qRXF1YWxTaXplLmVzNi5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiAoZmFjdG9yeSkge1xuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgLy8gQU1EIChSZWdpc3RlciBhcyBhbiBhbm9ueW1vdXMgbW9kdWxlKVxuICAgIGRlZmluZShbJ2pxdWVyeSddLCBmYWN0b3J5KTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAvLyBOb2RlL0NvbW1vbkpTXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJlcXVpcmUoJ2pxdWVyeScpKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBCcm93c2VyIGdsb2JhbHNcbiAgICBmYWN0b3J5KGpRdWVyeSk7XG4gIH1cbn0pKGZ1bmN0aW9uICgkKSB7XG5cbiAgY2xhc3MgRXF1YWxTaXplQ29udHJvbGxlciB7XG4gICAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgICAgdGhpcy4kY29udGFpbmVyID0gJChvcHRpb25zLmNvbnRhaW5lcik7XG4gICAgICB0aGlzLmNoaWxkcmVuU2VsZWN0b3JzID0gb3B0aW9ucy5jaGlsZHJlbiB8fCBudWxsO1xuICAgICAgdGhpcy5jaGlsZHJlbkFyciA9IFtdO1xuICAgICAgdGhpcy5pc0FjdGl2ZSA9IGZhbHNlO1xuICAgIH1cblxuICAgIGluaXQoKSB7XG4gICAgICBpZiAoIXRoaXMuJGNvbnRhaW5lci5sZW5ndGgpIHJldHVybjtcblxuICAgICAgaWYgKCQuaXNBcnJheSh0aGlzLmNoaWxkcmVuU2VsZWN0b3JzKSkge1xuICAgICAgICB0aGlzLmNoaWxkcmVuU2VsZWN0b3JzLmZvckVhY2goKGN1cnJDaGlsZHJlblNlbGVjdG9yKSA9PiB7XG4gICAgICAgICAgbGV0IGN1cnJDaGlsZHJlbk9iaiA9IHtcbiAgICAgICAgICAgIHNlbGVjdG9yOiBudWxsLFxuICAgICAgICAgICAgaW5jbHVkZWQ6IFtdLFxuICAgICAgICAgICAgZXhjbHVkZWQ6IFtdXG4gICAgICAgICAgfTtcbiAgICAgICAgICBjdXJyQ2hpbGRyZW5PYmouc2VsZWN0b3IgPSBjdXJyQ2hpbGRyZW5TZWxlY3RvcjtcbiAgICAgICAgICB0aGlzLmNoaWxkcmVuQXJyLnB1c2goY3VyckNoaWxkcmVuT2JqKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiB0aGlzLmNoaWxkcmVuU2VsZWN0b3JzID09PSAnc3RyaW5nJykge1xuICAgICAgICBsZXQgY2hpbGRyZW5PYmogPSB7XG4gICAgICAgICAgc2VsZWN0b3I6IG51bGwsXG4gICAgICAgICAgaW5jbHVkZWQ6IFtdLFxuICAgICAgICAgIGV4Y2x1ZGVkOiBbXVxuICAgICAgICB9O1xuXG5cbiAgICAgICAgY2hpbGRyZW5PYmouc2VsZWN0b3IgPSB0aGlzLmNoaWxkcmVuU2VsZWN0b3JzO1xuICAgICAgICB0aGlzLmNoaWxkcmVuQXJyLnB1c2goY2hpbGRyZW5PYmopO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnByb2Nlc3NpbmdDb250YWluZXIoKTtcblxuICAgICAgdGhpcy5fb25SZXNpemUgPSB0aGlzLl9vblJlc2l6ZSA/IHRoaXMuX29uUmVzaXplLmJpbmQodGhpcykgOiB0aGlzLnByb2Nlc3NpbmdDb250YWluZXIuYmluZCh0aGlzKTtcblxuICAgICAgJCh3aW5kb3cpLm9uKCdyZXNpemUnLCB0aGlzLl9vblJlc2l6ZSk7XG4gICAgICB0aGlzLmlzQWN0aXZlID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBzdG9wKCkge1xuICAgICAgaWYgKHRoaXMuY2hpbGRyZW5BcnIubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuY2hpbGRyZW5BcnIuZm9yRWFjaCgoY3VyckNoaWxkcmVuKSA9PiB7XG4gICAgICAgICAgdGhpcy5nZXRDaGlsZHJlbih0aGlzLiRjb250YWluZXIsIGN1cnJDaGlsZHJlbilcbiAgICAgICAgICAgIC5lYWNoKChpbmRleCwgZWwpID0+IHtcbiAgICAgICAgICAgICAgZWwuc3R5bGUuaGVpZ2h0ID0gJyc7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmdldENoaWxkcmVuKHRoaXMuJGNvbnRhaW5lcilcbiAgICAgICAgICAuZWFjaCgoaW5kZXgsIGVsKSA9PiB7XG4gICAgICAgICAgICBlbC5zdHlsZS5oZWlnaHQgPSAnJztcbiAgICAgICAgICB9KTtcbiAgICAgIH1cblxuXG4gICAgICAkKHdpbmRvdykub2ZmKCdyZXNpemUnLCB0aGlzLl9vblJlc2l6ZSk7XG4gICAgICB0aGlzLmlzQWN0aXZlID0gZmFsc2U7XG4gICAgfVxuXG4gICAgcnVuKCkge1xuICAgICAgaWYgKHRoaXMuaXNBY3RpdmUgfHwgIXRoaXMuJGNvbnRhaW5lci5sZW5ndGgpIHJldHVybiBmYWxzZTtcblxuICAgICAgaWYgKCF0aGlzLl9vblJlc2l6ZSkge1xuICAgICAgICB0aGlzLl9vblJlc2l6ZSA9IHRoaXMucHJvY2Vzc2luZ0NvbnRhaW5lci5iaW5kKHRoaXMpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9vblJlc2l6ZSgpO1xuICAgICAgJCh3aW5kb3cpLm9uKCdyZXNpemUnLCB0aGlzLl9vblJlc2l6ZSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBvbmVSdW4oKSB7XG4gICAgICB0aGlzLnByb2Nlc3NpbmdDb250YWluZXIoKTtcbiAgICB9XG5cbiAgICBwcm9jZXNzaW5nQ29udGFpbmVyKCkge1xuICAgICAgbGV0ICRjb250YWluZXIgPSB0aGlzLiRjb250YWluZXI7XG4gICAgICBsZXQgY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuQXJyO1xuXG5cbiAgICAgIGlmIChjaGlsZHJlbi5sZW5ndGgpIHtcbiAgICAgICAgbGV0IGkgPSBjaGlsZHJlbi5sZW5ndGggLSAxO1xuICAgICAgICBsZXQgcmV2ZXJzZSA9IHRydWU7XG5cbiAgICAgICAgd2hpbGUgKGkgPCBjaGlsZHJlbi5sZW5ndGgpIHtcbiAgICAgICAgICB0aGlzLnNldEVxdWFsU2l6ZSgkY29udGFpbmVyLCBjaGlsZHJlbltpXSk7XG5cbiAgICAgICAgICBpZiAoaSA8PSAwKSB7XG4gICAgICAgICAgICByZXZlcnNlID0gZmFsc2U7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHJldmVyc2UpIHtcbiAgICAgICAgICAgIGktLTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaSsrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zZXRFcXVhbFNpemUoJGNvbnRhaW5lcik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgc2V0RXF1YWxTaXplKGNvbnRhaW5lciwgY2hpbGRyZW4pIHtcbiAgICAgIHRoaXMuZ2V0TWF4U2l6ZShjb250YWluZXIsIGNoaWxkcmVuKVxuICAgICAgICAudGhlbihzaXplID0+IHtcbiAgICAgICAgICBsZXQgJGNoaWxkcmVuID0gdGhpcy5nZXRDaGlsZHJlbihjb250YWluZXIsIGNoaWxkcmVuKTtcblxuICAgICAgICAgICRjaGlsZHJlbi5lYWNoKChpbmRleCwgZWwpID0+IHtcbiAgICAgICAgICAgIGVsLnN0eWxlLmhlaWdodCA9IHNpemUgKyAncHgnO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIGdldE1heFNpemUoY29udGFpbmVyLCBjaGlsZHJlbikge1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgIGxldCAkY29udGFpbmVyID0gJChjb250YWluZXIpO1xuICAgICAgICBsZXQgJGlubmVyQmxvY2tzID0gdGhpcy5nZXRDaGlsZHJlbigkY29udGFpbmVyLCBjaGlsZHJlbik7XG4gICAgICAgIGxldCBtYXhIZWlnaHQgPSAwO1xuICAgICAgICBsZXQgXyA9IHRoaXM7XG4gICAgICAgIGxldCAkaW1nID0gJGlubmVyQmxvY2tzLmZpbmQoJ2ltZycpO1xuXG4gICAgICAgIGlmICgkaW1nLmxlbmd0aCkge1xuICAgICAgICAgIHRoaXMubG9hZEltZygkaW1nKVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAkaW5uZXJCbG9ja3MuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgbGV0IGhlaWdodCA9IF8uZ2V0U2l6ZSgkKHRoaXMpKTtcblxuICAgICAgICAgICAgICAgIGlmIChoZWlnaHQgPD0gbWF4SGVpZ2h0KSByZXR1cm47XG5cbiAgICAgICAgICAgICAgICBtYXhIZWlnaHQgPSBoZWlnaHQ7XG4gICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgIC8qJGNvbnRhaW5lckNsb25lLnJlbW92ZSgpOyovXG5cbiAgICAgICAgICAgICAgcmVzb2x2ZShtYXhIZWlnaHQpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAkaW5uZXJCbG9ja3MuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBsZXQgaGVpZ2h0ID0gXy5nZXRTaXplKCQodGhpcykpO1xuXG4gICAgICAgICAgICBpZiAoaGVpZ2h0IDw9IG1heEhlaWdodCkgcmV0dXJuO1xuXG4gICAgICAgICAgICBtYXhIZWlnaHQgPSBoZWlnaHQ7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICAvKiRjb250YWluZXJDbG9uZS5yZW1vdmUoKTsqL1xuXG4gICAgICAgICAgcmVzb2x2ZShtYXhIZWlnaHQpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBnZXRTaXplKCRlbCkge1xuICAgICAgbGV0IGhlaWdodCA9IDA7XG5cbiAgICAgIGlmICghJGVsLmlzKCc6aGlkZGVuJykpIHtcbiAgICAgICAgaGVpZ2h0ID0gJGVsLm91dGVySGVpZ2h0KCk7XG4gICAgICAgIHJldHVybiBoZWlnaHQ7XG4gICAgICB9XG5cbiAgICAgIGxldCAkcGFyZW50cyA9ICRlbC5wYXJlbnRzKCk7XG5cbiAgICAgIGlmICgkZWwuYXR0cignc3R5bGUnKSkge1xuICAgICAgICAkZWwuYXR0cignZGF0YS1jYXNoZWQtc3R5bGUnLCAkZWwuYXR0cignc3R5bGUnKSk7XG4gICAgICAgICRlbC5zaG93KCk7XG4gICAgICB9XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgJHBhcmVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbGV0ICRjdXJyUGFyZW50ID0gJHBhcmVudHMuZXEoaSk7XG5cbiAgICAgICAgaWYgKCRjdXJyUGFyZW50LmF0dHIoJ3N0eWxlJykpIHtcbiAgICAgICAgICAkY3VyclBhcmVudC5hdHRyKCdkYXRhLWNhc2hlZC1zdHlsZScsICRjdXJyUGFyZW50LmF0dHIoJ3N0eWxlJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgJGN1cnJQYXJlbnQuc2hvdygpO1xuICAgICAgfVxuXG4gICAgICBoZWlnaHQgPSAkZWwub3V0ZXJIZWlnaHQoKTtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAkcGFyZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBsZXQgJGN1cnJQYXJlbnQgPSAkcGFyZW50cy5lcShpKTtcbiAgICAgICAgbGV0IGNhc2hlZFN0eWxlID0gJGN1cnJQYXJlbnQuYXR0cignZGF0YS1jYXNoZWQtc3R5bGUnKTtcblxuICAgICAgICBpZiAoY2FzaGVkU3R5bGUpIHtcbiAgICAgICAgICAkY3VyclBhcmVudC5hdHRyKCdzdHlsZScsIGNhc2hlZFN0eWxlKTtcbiAgICAgICAgICAkY3VyclBhcmVudC5yZW1vdmVBdHRyKCdkYXRhLWNhc2hlZC1zdHlsZScpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBoZWlnaHQ7XG4gICAgfVxuXG4gICAgZ2V0Q2hpbGRyZW4oY29udGFpbmVyLCBjaGlsZHJlbikge1xuICAgICAgbGV0ICRjb250YWluZXIgPSAkKGNvbnRhaW5lcik7XG5cbiAgICAgIGlmICghY2hpbGRyZW4pIHtcbiAgICAgICAgcmV0dXJuICRjb250YWluZXIuY2hpbGRyZW4oKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBjaGlsZHJlbiA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIGNoaWxkcmVuID09PSAkKSB7IC8vcHJvYmFibHkgY291bGQgY29tZSBqdXN0IGpxIG9iamVjdFxuICAgICAgICByZXR1cm4gJGNvbnRhaW5lci5maW5kKGNoaWxkcmVuKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBjaGlsZHJlbiA9PT0gJ29iamVjdCcgJiYgY2hpbGRyZW4uc2VsZWN0b3IpIHtcbiAgICAgICAgbGV0IHNlbGVjdG9yID0gY2hpbGRyZW4uc2VsZWN0b3I7XG4gICAgICAgIGxldCAkcmVzdWx0ZWRDaGlsZHJlbiA9ICRjb250YWluZXIuZmluZChzZWxlY3Rvcik7XG5cbiAgICAgICAgaWYgKGNoaWxkcmVuLmluY2x1ZGVkICYmIGNoaWxkcmVuLmluY2x1ZGVkLmxlbmd0aCkge1xuICAgICAgICAgIGxldCAkaW5jbHVkZWRDaGlsZHJlbiA9ICRjb250YWluZXIuZmluZChjaGlsZHJlbi5pbmNsdWRlZC5qb2luKCcsICcpKTtcbiAgICAgICAgICAkcmVzdWx0ZWRDaGlsZHJlbiA9ICRyZXN1bHRlZENoaWxkcmVuLmFkZCgkaW5jbHVkZWRDaGlsZHJlbik7XG5cbiAgICAgICAgICAvKmNoaWxkcmVuLmluY2x1ZGVkLmZvckVhY2goKGN1cnJJbmNsdWRlZCkgPT4ge1xuICAgICAgICAgICAkcmVzdWx0ZWRDaGlsZHJlbiA9ICRyZXN1bHRlZENoaWxkcmVuLmFkZCgkY29udGFpbmVyLmZpbmQoY3VyckluY2x1ZGVkKSk7XG4gICAgICAgICAgIH0pOyovXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY2hpbGRyZW4uZXhjbHVkZWQgJiYgY2hpbGRyZW4uZXhjbHVkZWQubGVuZ3RoKSB7XG4gICAgICAgICAgbGV0IGV4Y2x1ZGVkQ2hpbGRyZW4gPSBjaGlsZHJlbi5leGNsdWRlZC5qb2luKCcsICcpO1xuICAgICAgICAgICRyZXN1bHRlZENoaWxkcmVuID0gJHJlc3VsdGVkQ2hpbGRyZW4ubm90KGV4Y2x1ZGVkQ2hpbGRyZW4pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICRyZXN1bHRlZENoaWxkcmVuO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgYWRkQ2hpbGRyZW4oY2hpbGRyZW4sIGluZGV4KSB7XG4gICAgICBpZiAodHlwZW9mIGNoaWxkcmVuICE9PSAnc3RyaW5nJyB8fCAhdGhpcy5jaGlsZHJlbkFyci5sZW5ndGgpIHJldHVybiBmYWxzZTtcblxuICAgICAgaW5kZXggPSBpbmRleCB8fCAwO1xuICAgICAgbGV0IGluY2x1ZGVkID0gdGhpcy5jaGlsZHJlbkFycltpbmRleF0uaW5jbHVkZWQ7XG4gICAgICBsZXQgZXhjbHVkZWQgPSB0aGlzLmNoaWxkcmVuQXJyW2luZGV4XS5leGNsdWRlZDtcbiAgICAgIGxldCBpbmNsdWRlZEluZGV4ID0gaW5jbHVkZWQuaW5kZXhPZihjaGlsZHJlbik7XG4gICAgICBsZXQgZXhjbHVkZWRJbmRleCA9IGV4Y2x1ZGVkLmluZGV4T2YoY2hpbGRyZW4pO1xuXG4gICAgICBpZiAofmluY2x1ZGVkSW5kZXgpIHJldHVybiB0cnVlO1xuXG4gICAgICBpZiAofmV4Y2x1ZGVkSW5kZXgpIHtcbiAgICAgICAgZXhjbHVkZWQuc3BsaWNlKGV4Y2x1ZGVkSW5kZXgsIDEpO1xuICAgICAgfVxuXG4gICAgICBpbmNsdWRlZC5wdXNoKGNoaWxkcmVuKTtcbiAgICAgIHRoaXMub25lUnVuKCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZW1vdmVDaGlsZHJlbihjaGlsZHJlbiwgaW5kZXgpIHtcbiAgICAgIGlmICh0eXBlb2YgY2hpbGRyZW4gIT09ICdzdHJpbmcnIHx8ICF0aGlzLmNoaWxkcmVuQXJyKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgIGluZGV4ID0gaW5kZXggfHwgMDtcbiAgICAgIGxldCBpbmNsdWRlZCA9IHRoaXMuY2hpbGRyZW5BcnJbaW5kZXhdLmluY2x1ZGVkO1xuICAgICAgbGV0IGV4Y2x1ZGVkID0gdGhpcy5jaGlsZHJlbkFycltpbmRleF0uZXhjbHVkZWQ7XG4gICAgICBsZXQgaW5jbHVkZWRJbmRleCA9IGluY2x1ZGVkLmluZGV4T2YoY2hpbGRyZW4pO1xuICAgICAgbGV0IGV4Y2x1ZGVkSW5kZXggPSBleGNsdWRlZC5pbmRleE9mKGNoaWxkcmVuKTtcblxuICAgICAgaWYgKH5leGNsdWRlZEluZGV4KSByZXR1cm4gdHJ1ZTtcblxuICAgICAgdGhpcy5zdG9wKCk7XG5cbiAgICAgIGlmICh+aW5jbHVkZWRJbmRleCkge1xuICAgICAgICBpbmNsdWRlZC5zcGxpY2UoaW5jbHVkZWRJbmRleCwgMSk7XG4gICAgICB9XG5cbiAgICAgIGV4Y2x1ZGVkLnB1c2goY2hpbGRyZW4pO1xuICAgICAgdGhpcy5ydW4oKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGxvYWRJbWcoJGltZykge1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgIGxldCBsb2FkZWRJbWcgPSAwO1xuXG4gICAgICAgICRpbWcuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgbGV0ICRjdXJySW1nID0gJCh0aGlzKTtcbiAgICAgICAgICBsZXQgJGltZ0Nsb25lID0gJCgnPGltZz4nKTtcblxuICAgICAgICAgICRpbWdDbG9uZS5vbignbG9hZCBlcnJvcicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGxvYWRlZEltZysrO1xuXG4gICAgICAgICAgICBpZiAobG9hZGVkSW1nID09PSAkaW1nLmxlbmd0aCkge1xuICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICAkaW1nQ2xvbmUuYXR0cignc3JjJywgJGN1cnJJbWcuYXR0cignc3JjJykpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGdldFNlbGYoKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH1cblxuXG4gICQuZm4uakVxdWFsU2l6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgXyA9IHRoaXM7XG4gICAgbGV0IG9wdGlvbnMgPSBhcmd1bWVudHNbMF07XG4gICAgbGV0IGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBfLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIG9wdGlvbnMuY29udGFpbmVyID0gXztcbiAgICAgICAgX1tpXS5qRXF1YWxTaXplID0gbmV3IEVxdWFsU2l6ZUNvbnRyb2xsZXIob3B0aW9ucyk7XG4gICAgICAgIF9baV0uakVxdWFsU2l6ZS5pbml0KCk7XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBvcHRpb25zID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICBvcHRpb25zID0ge1xuICAgICAgICAgIGNvbnRhaW5lcjogX1xuICAgICAgICB9O1xuICAgICAgICBfW2ldLmpFcXVhbFNpemUgPSBuZXcgRXF1YWxTaXplQ29udHJvbGxlcihvcHRpb25zKTtcbiAgICAgICAgX1tpXS5qRXF1YWxTaXplLmluaXQoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCByZXN1bHQgPSBfW2ldLmpFcXVhbFNpemVbb3B0aW9uc10uY2FsbChfW2ldLmpFcXVhbFNpemUsIGFyZ3MpO1xuXG4gICAgICAgIGlmICh0eXBlb2YgcmVzdWx0ICE9PSAndW5kZWZpbmVkJykgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIF87XG4gICAgfVxuICB9O1xufSk7XG5cbi8qZXF1YWwgaW5pdCovXG4vKmpRdWVyeShkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCQpIHtcbiAgLyEqZXF1YWwgc2l6ZSBzaW1wbGUqIS9cbiAgKGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgJGVxdWFsQ29udGFpbmVyID0gJCgnLmpzX19lcXVhbCcpO1xuXG4gICAgJGVxdWFsQ29udGFpbmVyLmpFcXVhbFNpemUoKTtcbiAgfSkoKTtcblxuICAvISplcXVhbCBzaXplIHNlbGVjdGl2ZSohL1xuICAoZnVuY3Rpb24gKCkge1xuICAgIGxldCAkZXF1YWxDb250YWluZXIgPSAkKCcuanNfX2VxdWFsLXNlbGVjdCcpO1xuICAgIGxldCBvcHRpb25zID0ge1xuICAgICAgY2hpbGRyZW46ICcuanNfX2VxdWFsLWNoaWxkJ1xuICAgIH07XG5cbiAgICAkZXF1YWxDb250YWluZXIuakVxdWFsU2l6ZShvcHRpb25zKTtcbiAgfSkoKTtcblxuICAvISplcXVhbCBzaXplIHNlbGVjdGl2ZSBtdWx0aXBsZSBjaGlsZHJlbiohL1xuICAoZnVuY3Rpb24gKCkge1xuICAgIGxldCAkZXF1YWxDb250YWluZXIgPSAkKCcuanNfX2VxdWFsLXNlbGVjdC1tdWx0Jyk7XG4gICAgbGV0IG9wdGlvbnMgPSB7XG4gICAgICBjaGlsZHJlbjogWycuanNfX2VxdWFsLWNoaWxkLTEnLCAnLmpzX19lcXVhbC1jaGlsZC0yJywgJy5qc19fZXF1YWwtY2hpbGQtMyddXG4gICAgfTtcblxuICAgICRlcXVhbENvbnRhaW5lci5qRXF1YWxTaXplKG9wdGlvbnMpO1xuICB9KSgpO1xufSk7Ki9cbiJdfQ==
