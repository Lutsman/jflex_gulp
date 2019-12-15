(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD (Register as an anonymous module)
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node/CommonJS
    module.exports = factory(require('jquery'));
  } else {
    // Browser globals
    factory(jQuery);
  }
})(function ($) {

  class EqualSizeController {
    constructor(options) {
      this.$container = $(options.container);
      this.childrenSelectors = options.children || null;
      this.childrenArr = [];
      this.isActive = false;
    }

    init() {
      if (!this.$container.length) return;

      if ($.isArray(this.childrenSelectors)) {
        this.childrenSelectors.forEach((currChildrenSelector) => {
          let currChildrenObj = {
            selector: null,
            included: [],
            excluded: []
          };
          currChildrenObj.selector = currChildrenSelector;
          this.childrenArr.push(currChildrenObj);
        });
      } else if (typeof this.childrenSelectors === 'string') {
        let childrenObj = {
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

    stop() {
      if (this.childrenArr.length) {
        this.childrenArr.forEach((currChildren) => {
          this.getChildren(this.$container, currChildren)
            .each((index, el) => {
              el.style.height = '';
            });
        });
      } else {
        this.getChildren(this.$container)
          .each((index, el) => {
            el.style.height = '';
          });
      }


      $(window).off('resize', this._onResize);
      this.isActive = false;
    }

    run() {
      if (this.isActive || !this.$container.length) return false;

      if (!this._onResize) {
        this._onResize = this.processingContainer.bind(this);
      }

      this._onResize();
      $(window).on('resize', this._onResize);
      return true;
    }

    oneRun() {
      this.processingContainer();
    }

    processingContainer() {
      let $container = this.$container;
      let children = this.childrenArr;


      if (children.length) {
        let i = children.length - 1;
        let reverse = true;

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

    setEqualSize(container, children) {
      this.getMaxSize(container, children)
        .then(size => {
          let $children = this.getChildren(container, children);

          $children.each((index, el) => {
            el.style.height = size + 'px';
          });
        });

    }

    getMaxSize(container, children) {
      return new Promise((resolve) => {
        let $container = $(container);
        let $innerBlocks = this.getChildren($container, children);
        let maxHeight = 0;
        let _ = this;
        let $img = $innerBlocks.find('img');

        if ($img.length) {
          this.loadImg($img)
            .then(() => {
              $innerBlocks.each(function () {
                let height = _.getSize($(this));

                if (height <= maxHeight) return;

                maxHeight = height;
              });

              /*$containerClone.remove();*/

              resolve(maxHeight);
            })
        } else {
          $innerBlocks.each(function () {
            let height = _.getSize($(this));

            if (height <= maxHeight) return;

            maxHeight = height;
          });

          /*$containerClone.remove();*/

          resolve(maxHeight);
        }
      });
    }

    getSize($el) {
      let height = 0;

      if (!$el.is(':hidden')) {
        height = $el.outerHeight();
        return height;
      }

      let $parents = $el.parents();

      if ($el.attr('style')) {
        $el.attr('data-cashed-style', $el.attr('style'));
        $el.show();
      }

      for (let i = 0; i < $parents.length; i++) {
        let $currParent = $parents.eq(i);

        if ($currParent.attr('style')) {
          $currParent.attr('data-cashed-style', $currParent.attr('style'));
        }

        $currParent.show();
      }

      height = $el.outerHeight();

      for (let i = 0; i < $parents.length; i++) {
        let $currParent = $parents.eq(i);
        let cashedStyle = $currParent.attr('data-cashed-style');

        if (cashedStyle) {
          $currParent.attr('style', cashedStyle);
          $currParent.removeAttr('data-cashed-style');
        }
      }

      return height;
    }

    getChildren(container, children) {
      let $container = $(container);

      if (!children) {
        return $container.children();
      }

      if (typeof children === 'string' || typeof children === $) { //probably could come just jq object
        return $container.find(children);
      }

      if (typeof children === 'object' && children.selector) {
        let selector = children.selector;
        let $resultedChildren = $container.find(selector);

        if (children.included && children.included.length) {
          let $includedChildren = $container.find(children.included.join(', '));
          $resultedChildren = $resultedChildren.add($includedChildren);

          /*children.included.forEach((currIncluded) => {
           $resultedChildren = $resultedChildren.add($container.find(currIncluded));
           });*/
        }

        if (children.excluded && children.excluded.length) {
          let excludedChildren = children.excluded.join(', ');
          $resultedChildren = $resultedChildren.not(excludedChildren);
        }

        return $resultedChildren;
      }

      return false;
    }

    addChildren(children, index) {
      if (typeof children !== 'string' || !this.childrenArr.length) return false;

      index = index || 0;
      let included = this.childrenArr[index].included;
      let excluded = this.childrenArr[index].excluded;
      let includedIndex = included.indexOf(children);
      let excludedIndex = excluded.indexOf(children);

      if (~includedIndex) return true;

      if (~excludedIndex) {
        excluded.splice(excludedIndex, 1);
      }

      included.push(children);
      this.oneRun();
      return true;
    }

    removeChildren(children, index) {
      if (typeof children !== 'string' || !this.childrenArr) return false;

      index = index || 0;
      let included = this.childrenArr[index].included;
      let excluded = this.childrenArr[index].excluded;
      let includedIndex = included.indexOf(children);
      let excludedIndex = excluded.indexOf(children);

      if (~excludedIndex) return true;

      this.stop();

      if (~includedIndex) {
        included.splice(includedIndex, 1);
      }

      excluded.push(children);
      this.run();
      return true;
    }

    loadImg($img) {
      return new Promise((resolve) => {
        let loadedImg = 0;

        $img.each(function () {
          let $currImg = $(this);
          let $imgClone = $('<img>');

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

    getSelf() {
      return this;
    }
  }


  $.fn.jEqualSize = function () {
    let _ = this;
    let options = arguments[0];
    let args = Array.prototype.slice.call(arguments, 1);

    for (let i = 0; i < _.length; i++) {
      if (typeof options === 'object') {
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
        let result = _[i].jEqualSize[options].call(_[i].jEqualSize, args);

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
