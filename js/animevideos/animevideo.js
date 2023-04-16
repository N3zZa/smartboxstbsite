(function () {
  "use strict";

  window.App = {
    currentScene: null,
    scenes: {},
    isShown: true,

    initialize: function () {
      this.$wrap = $(".wrap");

      $$legend.show();

      this.setEvents();

      // start navigation
      $$nav.on();
    },

    setEvents: function () {
      var url = "https://c45n.bazonserver.site/manifest/92519/1/s1e1_720.mp4/index.m3u8?hash=aHhU90EQRzezcY4P2r6Fhg&expires=1681715238&id=92519&s=1&name=s1e1_720.mp4"
      Player.play({
        url: url,
        type: "m3u8",
      });
      $(document.body).on({
        // on keyboard 'd' by default
        "nav_key:blue": _.bind(this.toggleView, this),

        // remote events
        "nav_key:stop": function () {
          Player.stop();
        },
        "nav_key:pause": function () {
          Player.togglePause();
        },
        "nav_key:exit": function () {
          SB.exit();
        },
      });

      // toggling background when player start/stop
      Player.on("ready", function () {
        $$log("player ready");
      });
      Player.on("stop", function () {
        $$log("player stop");
      });
    },

    toggleView: function () {
      if (this.isShown) {
        this.$wrap.hide();
        $$legend.hide();
      } else {
        this.$wrap.show();
        $$legend.show();
      }
      this.isShown = !this.isShown;
    },

    showContent: function (scene) {
      var cur = this.currentScene,
        newScene = this.scenes[scene];

      if (cur !== newScene) {
        if (!newScene) {
          $$error("Scene " + scene + " doesn't exist");
        } else {
          if (cur) {
            cur.hide();
          }
          newScene.show();
          this.currentScene = newScene;
        }
      }
    },
  };

  // main app initialize when smartbox ready
  SB(_.bind(App.initialize, App));
})();
