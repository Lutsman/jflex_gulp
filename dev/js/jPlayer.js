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
  var JPlayer = function () {
    function JPlayer() {
      _classCallCheck(this, JPlayer);

      this.volume = 30;
      this.player = null;
      this.loop = false;
    }

    _createClass(JPlayer, [{
      key: 'init',
      value: function init(source, loop, volume) {
        if (!source) {
          return;
        }

        this.source = source;
        this.volume = volume || this.volume;
        this.loop = loop || this.loop;
        this.activate();
      }
    }, {
      key: 'activate',
      value: function activate() {
        var player = this.player;

        if (player) {
          this.pause();
        } else {
          player = this.player = new Audio();
          player.autoplay = true;
        }

        player.loop = this.loop;
        player.src = this.source;
        player.volume = this.volume / 100; // min volume 0, max 1
      }
    }, {
      key: 'play',
      value: function play() {
        if (!this.player) return;

        this.player.play();
      }
    }, {
      key: 'pause',
      value: function pause() {
        if (!this.player) return;

        this.player.pause();
      }
    }, {
      key: 'stop',
      value: function stop() {
        this.pause();
        this.player = null;
      }
    }, {
      key: 'volumeUp',
      value: function volumeUp(volume) {
        if (!this.player) return;

        if (this.isNumeric(volume)) {
          this.volume += volume;
        } else {
          this.volume += 10;
        }

        this.volume = this.volume <= 100 ? this.volume : 100;
        this.player.volume = this.volume / 100;
      }
    }, {
      key: 'volumeDown',
      value: function volumeDown(volume) {
        if (!this.player) return;

        if (this.isNumeric(volume)) {
          this.volume -= volume;
        } else {
          this.volume -= 10;
        }

        this.volume = this.volume >= 0 ? this.volume : 0;
        this.player.volume = this.volume / 100;
      }
    }, {
      key: 'loopToggler',
      value: function loopToggler(loop) {
        if (!this.player) return;

        if (loop !== undefined) {
          this.loop = loop;
        } else {
          this.loop = !this.loop;
        }

        this.player.loop = this.loop;
      }
    }, {
      key: 'isNumeric',
      value: function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
      }
    }]);

    return JPlayer;
  }();

  var player = new JPlayer();

  $.jPlayer = player;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpzL2pQbGF5ZXIuZXM2LmpzIl0sIm5hbWVzIjpbImZhY3RvcnkiLCJkZWZpbmUiLCJhbWQiLCJleHBvcnRzIiwibW9kdWxlIiwicmVxdWlyZSIsImpRdWVyeSIsIiQiLCJKUGxheWVyIiwidm9sdW1lIiwicGxheWVyIiwibG9vcCIsInNvdXJjZSIsImFjdGl2YXRlIiwicGF1c2UiLCJBdWRpbyIsImF1dG9wbGF5Iiwic3JjIiwicGxheSIsImlzTnVtZXJpYyIsInVuZGVmaW5lZCIsIm4iLCJpc05hTiIsInBhcnNlRmxvYXQiLCJpc0Zpbml0ZSIsImpQbGF5ZXIiXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7OztBQUVDLFdBQVVBLE9BQVYsRUFBbUI7QUFDbEIsTUFBSSxPQUFPQyxNQUFQLEtBQWtCLFVBQWxCLElBQWdDQSxPQUFPQyxHQUEzQyxFQUFnRDtBQUM5QztBQUNBRCxXQUFPLENBQUMsUUFBRCxDQUFQLEVBQW1CRCxPQUFuQjtBQUNELEdBSEQsTUFHTyxJQUFJLFFBQU9HLE9BQVAseUNBQU9BLE9BQVAsT0FBbUIsUUFBdkIsRUFBaUM7QUFDdEM7QUFDQUMsV0FBT0QsT0FBUCxHQUFpQkgsUUFBUUssUUFBUSxRQUFSLENBQVIsQ0FBakI7QUFDRCxHQUhNLE1BR0E7QUFDTDtBQUNBTCxZQUFRTSxNQUFSO0FBQ0Q7QUFDRixDQVhBLEVBV0MsVUFBVUMsQ0FBVixFQUFhO0FBQUEsTUFDUEMsT0FETztBQUVYLHVCQUFjO0FBQUE7O0FBQ1osV0FBS0MsTUFBTCxHQUFjLEVBQWQ7QUFDQSxXQUFLQyxNQUFMLEdBQWMsSUFBZDtBQUNBLFdBQUtDLElBQUwsR0FBWSxLQUFaO0FBQ0Q7O0FBTlU7QUFBQTtBQUFBLDJCQVFOQyxNQVJNLEVBUUVELElBUkYsRUFRUUYsTUFSUixFQVFnQjtBQUN6QixZQUFJLENBQUNHLE1BQUwsRUFBYTtBQUNYO0FBQ0Q7O0FBRUQsYUFBS0EsTUFBTCxHQUFjQSxNQUFkO0FBQ0EsYUFBS0gsTUFBTCxHQUFjQSxVQUFVLEtBQUtBLE1BQTdCO0FBQ0EsYUFBS0UsSUFBTCxHQUFZQSxRQUFRLEtBQUtBLElBQXpCO0FBQ0EsYUFBS0UsUUFBTDtBQUNEO0FBakJVO0FBQUE7QUFBQSxpQ0FtQkE7QUFDVCxZQUFJSCxTQUFTLEtBQUtBLE1BQWxCOztBQUVBLFlBQUlBLE1BQUosRUFBWTtBQUNWLGVBQUtJLEtBQUw7QUFDRCxTQUZELE1BRU87QUFDTEosbUJBQVMsS0FBS0EsTUFBTCxHQUFjLElBQUlLLEtBQUosRUFBdkI7QUFDQUwsaUJBQU9NLFFBQVAsR0FBa0IsSUFBbEI7QUFDRDs7QUFFRE4sZUFBT0MsSUFBUCxHQUFjLEtBQUtBLElBQW5CO0FBQ0FELGVBQU9PLEdBQVAsR0FBYSxLQUFLTCxNQUFsQjtBQUNBRixlQUFPRCxNQUFQLEdBQWdCLEtBQUtBLE1BQUwsR0FBYyxHQUE5QixDQVpTLENBWTBCO0FBQ3BDO0FBaENVO0FBQUE7QUFBQSw2QkFrQ0o7QUFDTCxZQUFJLENBQUMsS0FBS0MsTUFBVixFQUFrQjs7QUFFbEIsYUFBS0EsTUFBTCxDQUFZUSxJQUFaO0FBQ0Q7QUF0Q1U7QUFBQTtBQUFBLDhCQXdDSDtBQUNOLFlBQUksQ0FBQyxLQUFLUixNQUFWLEVBQWtCOztBQUVsQixhQUFLQSxNQUFMLENBQVlJLEtBQVo7QUFDRDtBQTVDVTtBQUFBO0FBQUEsNkJBOENKO0FBQ0wsYUFBS0EsS0FBTDtBQUNBLGFBQUtKLE1BQUwsR0FBYyxJQUFkO0FBQ0Q7QUFqRFU7QUFBQTtBQUFBLCtCQW1ERkQsTUFuREUsRUFtRE07QUFDZixZQUFJLENBQUMsS0FBS0MsTUFBVixFQUFrQjs7QUFFbEIsWUFBSSxLQUFLUyxTQUFMLENBQWVWLE1BQWYsQ0FBSixFQUE0QjtBQUMxQixlQUFLQSxNQUFMLElBQWVBLE1BQWY7QUFDRCxTQUZELE1BRU87QUFDTCxlQUFLQSxNQUFMLElBQWUsRUFBZjtBQUNEOztBQUVELGFBQUtBLE1BQUwsR0FBYyxLQUFLQSxNQUFMLElBQWUsR0FBZixHQUFxQixLQUFLQSxNQUExQixHQUFtQyxHQUFqRDtBQUNBLGFBQUtDLE1BQUwsQ0FBWUQsTUFBWixHQUFxQixLQUFLQSxNQUFMLEdBQWMsR0FBbkM7QUFDRDtBQTlEVTtBQUFBO0FBQUEsaUNBZ0VBQSxNQWhFQSxFQWdFUTtBQUNqQixZQUFJLENBQUMsS0FBS0MsTUFBVixFQUFrQjs7QUFFbEIsWUFBSSxLQUFLUyxTQUFMLENBQWVWLE1BQWYsQ0FBSixFQUE0QjtBQUMxQixlQUFLQSxNQUFMLElBQWVBLE1BQWY7QUFDRCxTQUZELE1BRU87QUFDTCxlQUFLQSxNQUFMLElBQWUsRUFBZjtBQUNEOztBQUVELGFBQUtBLE1BQUwsR0FBYyxLQUFLQSxNQUFMLElBQWUsQ0FBZixHQUFtQixLQUFLQSxNQUF4QixHQUFpQyxDQUEvQztBQUNBLGFBQUtDLE1BQUwsQ0FBWUQsTUFBWixHQUFxQixLQUFLQSxNQUFMLEdBQWMsR0FBbkM7QUFDRDtBQTNFVTtBQUFBO0FBQUEsa0NBNkVDRSxJQTdFRCxFQTZFTztBQUNoQixZQUFJLENBQUMsS0FBS0QsTUFBVixFQUFrQjs7QUFFbEIsWUFBSUMsU0FBU1MsU0FBYixFQUF3QjtBQUN0QixlQUFLVCxJQUFMLEdBQVlBLElBQVo7QUFDRCxTQUZELE1BRU87QUFDTCxlQUFLQSxJQUFMLEdBQVksQ0FBQyxLQUFLQSxJQUFsQjtBQUNEOztBQUVELGFBQUtELE1BQUwsQ0FBWUMsSUFBWixHQUFtQixLQUFLQSxJQUF4QjtBQUNEO0FBdkZVO0FBQUE7QUFBQSxnQ0F5RkRVLENBekZDLEVBeUZFO0FBQ1gsZUFBTyxDQUFDQyxNQUFNQyxXQUFXRixDQUFYLENBQU4sQ0FBRCxJQUF5QkcsU0FBU0gsQ0FBVCxDQUFoQztBQUNEO0FBM0ZVOztBQUFBO0FBQUE7O0FBOEZiLE1BQUlYLFNBQVMsSUFBSUYsT0FBSixFQUFiOztBQUVBRCxJQUFFa0IsT0FBRixHQUFZZixNQUFaO0FBQ0QsQ0E1R0EsQ0FBRCIsImZpbGUiOiJqcy9qUGxheWVyLmVzNi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uIChmYWN0b3J5KSB7XG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAvLyBBTUQgKFJlZ2lzdGVyIGFzIGFuIGFub255bW91cyBtb2R1bGUpXG4gICAgZGVmaW5lKFsnanF1ZXJ5J10sIGZhY3RvcnkpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuICAgIC8vIE5vZGUvQ29tbW9uSlNcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkocmVxdWlyZSgnanF1ZXJ5JykpO1xuICB9IGVsc2Uge1xuICAgIC8vIEJyb3dzZXIgZ2xvYmFsc1xuICAgIGZhY3RvcnkoalF1ZXJ5KTtcbiAgfVxufShmdW5jdGlvbiAoJCkge1xuICBjbGFzcyBKUGxheWVyIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgIHRoaXMudm9sdW1lID0gMzA7XG4gICAgICB0aGlzLnBsYXllciA9IG51bGw7XG4gICAgICB0aGlzLmxvb3AgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBpbml0KHNvdXJjZSwgbG9vcCwgdm9sdW1lKSB7XG4gICAgICBpZiAoIXNvdXJjZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc291cmNlID0gc291cmNlO1xuICAgICAgdGhpcy52b2x1bWUgPSB2b2x1bWUgfHwgdGhpcy52b2x1bWU7XG4gICAgICB0aGlzLmxvb3AgPSBsb29wIHx8IHRoaXMubG9vcDtcbiAgICAgIHRoaXMuYWN0aXZhdGUoKTtcbiAgICB9XG5cbiAgICBhY3RpdmF0ZSgpIHtcbiAgICAgIGxldCBwbGF5ZXIgPSB0aGlzLnBsYXllcjtcblxuICAgICAgaWYgKHBsYXllcikge1xuICAgICAgICB0aGlzLnBhdXNlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwbGF5ZXIgPSB0aGlzLnBsYXllciA9IG5ldyBBdWRpbygpO1xuICAgICAgICBwbGF5ZXIuYXV0b3BsYXkgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICBwbGF5ZXIubG9vcCA9IHRoaXMubG9vcDtcbiAgICAgIHBsYXllci5zcmMgPSB0aGlzLnNvdXJjZTtcbiAgICAgIHBsYXllci52b2x1bWUgPSB0aGlzLnZvbHVtZSAvIDEwMDsgLy8gbWluIHZvbHVtZSAwLCBtYXggMVxuICAgIH1cblxuICAgIHBsYXkoKSB7XG4gICAgICBpZiAoIXRoaXMucGxheWVyKSByZXR1cm47XG5cbiAgICAgIHRoaXMucGxheWVyLnBsYXkoKTtcbiAgICB9XG5cbiAgICBwYXVzZSgpIHtcbiAgICAgIGlmICghdGhpcy5wbGF5ZXIpIHJldHVybjtcblxuICAgICAgdGhpcy5wbGF5ZXIucGF1c2UoKTtcbiAgICB9XG5cbiAgICBzdG9wKCkge1xuICAgICAgdGhpcy5wYXVzZSgpO1xuICAgICAgdGhpcy5wbGF5ZXIgPSBudWxsO1xuICAgIH1cblxuICAgIHZvbHVtZVVwKHZvbHVtZSkge1xuICAgICAgaWYgKCF0aGlzLnBsYXllcikgcmV0dXJuO1xuXG4gICAgICBpZiAodGhpcy5pc051bWVyaWModm9sdW1lKSkge1xuICAgICAgICB0aGlzLnZvbHVtZSArPSB2b2x1bWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnZvbHVtZSArPSAxMDtcbiAgICAgIH1cblxuICAgICAgdGhpcy52b2x1bWUgPSB0aGlzLnZvbHVtZSA8PSAxMDAgPyB0aGlzLnZvbHVtZSA6IDEwMDtcbiAgICAgIHRoaXMucGxheWVyLnZvbHVtZSA9IHRoaXMudm9sdW1lIC8gMTAwO1xuICAgIH1cblxuICAgIHZvbHVtZURvd24odm9sdW1lKSB7XG4gICAgICBpZiAoIXRoaXMucGxheWVyKSByZXR1cm47XG5cbiAgICAgIGlmICh0aGlzLmlzTnVtZXJpYyh2b2x1bWUpKSB7XG4gICAgICAgIHRoaXMudm9sdW1lIC09IHZvbHVtZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudm9sdW1lIC09IDEwO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnZvbHVtZSA9IHRoaXMudm9sdW1lID49IDAgPyB0aGlzLnZvbHVtZSA6IDA7XG4gICAgICB0aGlzLnBsYXllci52b2x1bWUgPSB0aGlzLnZvbHVtZSAvIDEwMDtcbiAgICB9XG5cbiAgICBsb29wVG9nZ2xlcihsb29wKSB7XG4gICAgICBpZiAoIXRoaXMucGxheWVyKSByZXR1cm47XG5cbiAgICAgIGlmIChsb29wICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5sb29wID0gbG9vcDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMubG9vcCA9ICF0aGlzLmxvb3A7XG4gICAgICB9XG5cbiAgICAgIHRoaXMucGxheWVyLmxvb3AgPSB0aGlzLmxvb3A7XG4gICAgfVxuXG4gICAgaXNOdW1lcmljKG4pIHtcbiAgICAgIHJldHVybiAhaXNOYU4ocGFyc2VGbG9hdChuKSkgJiYgaXNGaW5pdGUobik7XG4gICAgfVxuICB9XG5cbiAgbGV0IHBsYXllciA9IG5ldyBKUGxheWVyKCk7XG5cbiAgJC5qUGxheWVyID0gcGxheWVyO1xufSkpOyJdfQ==
