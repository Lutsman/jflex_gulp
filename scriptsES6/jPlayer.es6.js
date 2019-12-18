'use strict';

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
}(function ($) {
  class JPlayer {
    constructor() {
      this.volume = 30;
      this.player = null;
      this.loop = false;
    }

    init(source, loop, volume) {
      if (!source) {
        return;
      }

      this.source = source;
      this.volume = volume || this.volume;
      this.loop = loop || this.loop;
      this.activate();
    }

    activate() {
      let player = this.player;

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

    play() {
      if (!this.player) return;

      this.player.play();
    }

    pause() {
      if (!this.player) return;

      this.player.pause();
    }

    stop() {
      this.pause();
      this.player = null;
    }

    volumeUp(volume) {
      if (!this.player) return;

      if (this.isNumeric(volume)) {
        this.volume += volume;
      } else {
        this.volume += 10;
      }

      this.volume = this.volume <= 100 ? this.volume : 100;
      this.player.volume = this.volume / 100;
    }

    volumeDown(volume) {
      if (!this.player) return;

      if (this.isNumeric(volume)) {
        this.volume -= volume;
      } else {
        this.volume -= 10;
      }

      this.volume = this.volume >= 0 ? this.volume : 0;
      this.player.volume = this.volume / 100;
    }

    loopToggler(loop) {
      if (!this.player) return;

      if (loop !== undefined) {
        this.loop = loop;
      } else {
        this.loop = !this.loop;
      }

      this.player.loop = this.loop;
    }

    isNumeric(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    }
  }

  let player = new JPlayer();

  $.jPlayer = player;
}));