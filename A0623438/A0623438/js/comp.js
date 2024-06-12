myView.controller("popupcompCtrl", [
  "$scope",
  "$rootScope",
  "appService",
  "$sce",
  function (e, t, a, n) {
    (e.state = {}), (e.popupOn = !1), (e.autoClose = 0);
    var o,
      l = !1;
    (e.fetchComponentData = function (e) {
      o = a.getConfigData().data[e];
    }),
      (e.initComp = function (t) {
        (e.state = o[e.contentid]),
          (e.hideHeader = e.state.hideHeader || !1),
          (e.type = e.state.type),
          (e.headerText = e.state.headerText || ""),
          (e.textContent = n.trustAsHtml(e.state.textContent) || ""),
          (e.imageCaption = e.state.imageCaption || ""),
          e.dynamicpopuptext && (e.textContent = e.dynamicpopuptext),
          (e.imagePath = e.state.imagePath),
          (e.imageHeight = e.state.imageHeight || 100),
          (e.imageWidth = e.state.imageWidth || 150),
          (e.audioPath = e.state.audioPath || ""),
          (e.hideClose = e.state.hideClose || !1),
          (e.containerDiv = e.state.container || ""),
          (e.confirmBtns = e.state.confirmBtns || !1),
          (e.okTxt = e.state.okTxt || "ok"),
          (e.cancelTxt = e.state.cancelTxt || "cancel"),
          e.state.autoClose
            ? (e.autoClose = 1e3 * e.state.autoClose)
            : (e.autoClose = 0);
      }),
      (e.closePopup = function (t) {
        (e.popupOn = !1), e.$emit("popupClosed", e.contentid);
      }),
      (e.closeBtnClick = function () {
        1 != l && e.closePopup();
      }),
      (e.cancelClick = function () {
        1 != l && e.closePopup();
      }),
      (e.okClick = function () {
        e.contentid.indexOf("_") &&
          ((e.contentid = e.contentid.split("_")),
          (e.contentid = e.contentid[0])),
          1 != l && ((e.popupOn = !1), e.$emit("popupConfirm", e.contentid));
      }),
      e.$on("closePopup", function (t) {
        e.popupOn = !1;
      }),
      e.$on("showPopup", function (t, a, n) {
        if (!a || !o[a])
          return void console.warn(
            "Popup data not found. Check JSON. Type --- ",
            a
          );
        (e.contentid = a),
          n && (e.dynamicpopuptext = n),
          e.initComp(),
          (e.popupOn = !0),
          1 == e.popupOn &&
            e.autoClose > 0 &&
            $timeout(function (t) {
              e.closePopup();
            }, e.autoClose),
          e.containerDiv && $(".popupParent").appendTo(e.containerDiv);
      }),
      e.$on("togglepopup", function (t, a, n) {
        if (!a || !o[a])
          return void console.warn(
            "Popup data not found. Check JSON. Type --- ",
            a
          );
        (e.contentid = a),
          n && (e.dynamicpopuptext = n),
          e.initComp(),
          (e.popupOn = !e.popupOn),
          1 == e.popupOn &&
            e.autoClose > 0 &&
            $timeout(function (t) {
              e.closePopup();
            }, e.autoClose),
          e.containerDiv && $(".popupParent").appendTo(e.containerDiv);
      }),
      e.$on("disablePopupClicks", function () {
        l = !0;
      }),
      e.$on("enablePopupClicks", function () {
        l = !1;
      });
  },
]),
  myView.directive("popupcompDirective", function () {
    return {
      retrict: "E",
      replace: !0,
      scope: {},
      controller: "popupcompCtrl",
      templateUrl: "templates/popupcompTemplate.html",
      link: function (e, t, a) {
        a.id
          ? (e.fetchComponentData(a.id), (e.compId = a.id))
          : console.log("Provide id and json to component");
      },
    };
  }),
  myView.controller("audioplayerCtrl", [
    "$scope",
    "$rootScope",
    "appService",
    "$timeout",
    function (e, t, a, n) {
      (e.state = null),
        (e.lang = "en"),
        (e.audioType = "audio/mp3"),
        (e.audioSrc = null),
        (e.active = !0),
        (e.playingState = !1),
        (e.pauseState = !1),
        (e.replyState = !1),
        (e.source = ""),
        (e.sourceArr = []),
        (e.sourceIndex = 0),
        (e.endCallback = null),
        (e.fetchComponentData = function (t) {
          (e.state = a.getConfigData().data[t]),
            (e.lang = a.getConfigData().language || "en");
          var n = a.getConfigData().type || "mp3";
          (e.audioType = "audio/" + n),
            (e.source = e.state.default ? e.state.default : ""),
            e.preCacheAudio();
        }),
        (e.preCacheAudio = function () {
          function t() {}
          for (var a in e.state)
            e.state[a][e.lang] &&
              (function (e) {
                var a = new Audio();
                a.addEventListener("canplaythrough", t, !1), (a.src = e);
              })(e.state[a][e.lang]);
        }),
        (e.initComp = function () {}),
        (e.playAudio = function () {
          e.stopAudio(),
            (e.audioControl.src = e.source),
            e.audioControl &&
              ((e.playingState = !0),
              (e.pauseState = !1),
              (e.replyState = !0),
              (e.active = !1),
              e.audioControl.play(),
              e.audioControl.paused && e.audioEndHandler(),
              e.$emit("audioStarted", e.audioSrc, e.endCallback));
        }),
        (e.pauseAudio = function () {
          e.audioControl.pause(),
            (e.playingState = !1),
            (e.pauseState = !0),
            (e.replyState = !0);
        }),
        (e.replayAudio = function () {
          e.playAudio();
        }),
        (e.stopAudio = function () {
          e.audioControl &&
            (e.audioControl.pause(),
            (e.playingState = !1),
            (e.pauseState = !1),
            (e.replyState = !1),
            (e.active = !0),
            (e.audioControl.src = ""),
            e.$emit("audioStop", e.audioSrc));
        }),
        e.$on("playAudio", function (t, a, n) {
          e.active && e.triggerAudio(a, n);
        }),
        (e.triggerAudio = function (t, a) {
          e.state && e.state[t]
            ? ((e.audioSrc = t), (e.source = e.state[e.audioSrc][e.lang]))
            : ((e.audioSrc = t), (e.source = t)),
            (e.endCallback = a || null),
            e.playAudio();
        }),
        e.$on("pauseAudio", function (t, a) {
          e.pauseAudio();
        }),
        e.$on("replayAudio", function (t, a) {
          e.replayAudio();
        }),
        e.$on("stopAudio", function () {
          (e.sourceArr = []), e.stopAudio();
        }),
        e.$on("playAudioArray", function (t, a, n) {
          if (e.active) {
            (e.sourceArr = a), (e.sourceIndex = 0), (e.arrCallback = n);
            var o = e.arrCallback;
            o && o.arrIndex >= 0 && e.sourceIndex != o.arrIndex && (o = null),
              e.triggerAudio(e.sourceArr[e.sourceIndex], o);
          }
        });
    },
  ]),
  myView.directive("audioplayerDirective", function () {
    return {
      retrict: "EA",
      replace: !0,
      scope: {},
      controller: "audioplayerCtrl",
      templateUrl: "templates/audioplayerTemplate.html",
      link: function (e, t, a) {
        a.id
          ? (e.fetchComponentData(a.id),
            (e.compId = a.id),
            (e.audioControl = t.find("#audioTag")[0]),
            e.$watch("source", function () {}),
            t.ready(function () {
              e.initComp();
            }),
            e.audioControl.addEventListener(
              "timeupdate",
              function (t) {
                var a = e.audioControl.currentTime.toFixed(1);
                a = parseFloat(a);
                var n = e.audioControl.duration.toFixed(2);
                (n = parseFloat(n)),
                  a >= n &&
                    ((e.playingState = !1),
                    (e.pauseState = !1),
                    (e.replyState = !1),
                    e.$apply());
              },
              !1
            ),
            e.audioControl.addEventListener("ended", function (t) {
              e.audioEndHandler();
            }),
            e.audioControl.addEventListener("error", function (t) {
              "" != $(t.target).attr("src") && e.audioEndHandler();
            }),
            (e.audioEndHandler = function () {
              if (
                ((e.playingState = !1),
                (e.pauseState = !1),
                (e.replyState = !1),
                (e.active = !0),
                (e.audioControl.src = ""),
                e.$emit("audioEnd", e.audioSrc, e.endCallback),
                e.sourceArr.length >= 0 && e.sourceIndex++,
                e.$apply(),
                e.sourceIndex < e.sourceArr.length)
              ) {
                var t = e.arrCallback;
                t &&
                  t.arrIndex >= 0 &&
                  e.sourceIndex != t.arrIndex &&
                  (t = null),
                  e.triggerAudio(e.sourceArr[e.sourceIndex], t);
              }
              e.sourceIndex >= e.sourceArr.length && (e.sourceArr = []);
            }))
          : console.log("Provide id and json to component");
      },
    };
  }),
  myView.controller("closecaptionsCtrl", [
    "$scope",
    "$rootScope",
    "appService",
    "$timeout",
    function (e, t, a, n) {
      (e.state = {}),
        (e.showCaption = !1),
        (e.captionText = ""),
        (e.lang = "en"),
        (e.fetchComponentData = function (t) {
          (e.state = a.getConfigData().data[t]),
            (e.lang = a.getConfigData().language || "en");
        }),
        (e.initComp = function () {}),
        e.$on("showCaption", function (t, a, n) {
          e.state && e.state[a] && (e.captionText = e.state[a][e.lang]),
            n && (e.captionText = e.captionText + n),
            "" != e.captionText && (e.showCaption = !0);
        }),
        e.$on("hideCaption", function (t, a, o) {
          e.showCaption &&
            (o
              ? n(function () {
                  (e.captionText = ""), (e.showCaption = !1);
                }, o)
              : ((e.captionText = ""), (e.showCaption = !1)));
        });
    },
  ]),
  myView.directive("closecaptionsDirective", function () {
    return {
      retrict: "E",
      replace: !0,
      scope: !0,
      controller: "closecaptionsCtrl",
      templateUrl: "templates/closecaptionsTemplate.html",
      link: function (e, t, a) {
        a.id
          ? (e.fetchComponentData(a.id),
            (e.compId = a.id),
            t.ready(function () {
              e.initComp();
            }))
          : console.log("Provide id and json to component");
      },
    };
  }),
  myView.controller("VideoPlayerCtrl", [
    "$scope",
    function (e) {
      function t(e) {
        var t = "0",
          a = "0",
          n = parseInt(e);
        if (n >= 60 && n < 3600) {
          var t = ("0" + Math.floor(n / 60)).slice(-2);
          n %= 60;
        }
        if (n < 60) var a = ("0" + Math.floor(n)).slice(-2);
        return t + ":" + a;
      }
      function a() {
        isNaN(o.duration)
          ? (e.percentage = 0)
          : ((o.volume = 0),
            (e.videoTime = t(o.currentTime)),
            (e.videoDuration = t(o.duration)),
            (e.percentage = Math.floor((100 / o.duration) * o.currentTime))),
          e.$apply();
      }
      (e.isEnablePlayBtn = !1),
        (e.showTaskbar = !0),
        (e.enable_AD_btn = !0),
        (e.enable_dropdown = !1),
        (e.setting_dropdown = !1),
        (e.speed_dropdown = !1),
        (e.enable_settingOption = !1),
        (e.is_fullscreen = !0),
        (e.percentage = 0),
        (e.videoTime = 0),
        (e.audio_volume = 3),
        (e.speeds = [0.5, 1, 1.25, 1.5, 2]),
        (e.myPopup = !0),
        (e.centre_playing = !0);
      var n = document.getElementsByClassName("slider"),
        o = "",
        l = "";
      (e.videoSrc = ""),
        document.addEventListener("fullscreenchange", function () {
          e.is_fullscreen = !e.is_fullscreen;
        }),
        (e.renderFunctions = function () {
          function n(e, t) {
            (e.style.height = t.scrollHeight + "px"),
              (e.style.width = t.scrollWidth + "px"),
              (e.style.display = "block");
          }
          function r(e, t) {
            e.style.display = "none";
          }
          (o = document.getElementById("video")),
            (l = document.getElementById("fullScreenBtn"));
          var i = document.getElementById("placeholder_1");
          (i.style.top = o.offsetTop + "px"),
            (i.style.left = o.offsetLeft + "px"),
            (o.onwaiting = function () {
              n(i, this);
            }),
            (o.onplaying = function () {
              r(i, this);
            }),
            -1 != navigator.userAgent.indexOf("iPhone") ||
            -1 != navigator.userAgent.indexOf("iPod") ||
            -1 != navigator.userAgent.indexOf("iPad")
              ? (l.style.display = "none")
              : (l.style.display = "block"),
            (e.videoTime = t(o.currentTime)),
            (e.videoDuration = t(o.duration)),
            (o.src = e.videoSrc),
            o.addEventListener("timeupdate", a, !1),
            o.addEventListener("loadedmetadata", function () {
              (e.videoDuration = t(o.duration)),
                0 == e.videoTime && (e.videoTime = "0.00"),
                e.$apply();
            });
        }),
        (e.toggle = function () {
          (e.myPopup = !e.myPopup),
            (e.playing = !1),
            o.pause(),
            (e.centre_playing = !0);
        }),
        (e.playing = !1),
        (e.ad = !0),
        (e.add = function () {
          e.ad = !1;
        }),
        (e.unadd = function () {
          e.ad = !0;
        }),
        (e.audio = !0),
        (e.mute = function () {
          (e.audio = !1), (o.muted = !0);
        }),
        (e.unmute = function () {
          (e.audio = !0), (o.muted = !1);
        }),
        (e.playVideo = function () {
          return (
            (e.centre_playing = !1),
            (e.playing = !0),
            o.play(),
            (o.onended = function (a) {
              $(".control-box").removeClass("mystyle"),
                (e.playing = !1),
                (e.centre_playing = !0),
                (e.videoTime = 0),
                (e.videoDuration = t(o.duration)),
                (e.videoTime = "0.00"),
                e.$apply();
            }),
            setTimeout(function () {
              $(".control-box").addClass("mystyle");
            }, 1e3),
            !1
          );
        }),
        (e.pauseVideo = function () {
          (e.playing = !1), o.pause(), console.log("paused");
        }),
        $("#video").hover(
          function () {
            $(".control-box").removeClass("mystyle");
          },
          function () {
            $(".control-box").addClass("mystyle");
          }
        ),
        (e.seek = function (a) {
          var l = a.offsetX / n[0].offsetWidth,
            r = l * o.duration;
          (o.currentTime = r),
            (e.percentage = Math.floor((100 / o.duration) * r)),
            (e.videoTime = t(o.currentTime));
        }),
        (e.setVolume = function () {
          0 == e.audio_volume
            ? (e.audio_volume = currVolume)
            : ((currVolume = e.audio_volume), (e.audio_volume = 0));
        }),
        (e.enable_AD = function () {
          e.enable_AD_btn = !e.enable_AD_btn;
        }),
        (e.settingBtn = function () {
          (e.enable_dropdown = !e.enable_dropdown),
            e.enable_dropdown
              ? (e.enable_settingOption = !0)
              : ((e.enable_settingOption = !1), (e.speed_dropdown = !1));
        }),
        (e.settingOption = function (t) {
          (e.enable_settingOption = !1),
            "speed" === t && (e.speed_dropdown = !0);
        }),
        (e.changeSpeed = function (t) {
          "setting" === t
            ? ((e.enable_settingOption = !0), (e.speed_dropdown = !1))
            : (o.playbackRate = t);
        }),
        e.$on("playVideo", function (t, a) {
          (e.videoSrc = a), e.renderFunctions(), (e.percentage = 0);
        }),
        e.$on("stopVideo", function (t, a) {
          (e.playing = !1), o && o.pause(), (e.centre_playing = !0);
        }),
        (e.fullScreen = function () {
          e.is_fullscreen
            ? o.requestFullscreen
              ? (o.requestFullscreen(), console.log(o.requestFullscreen()))
              : o.mozRequestFullScreen
              ? o.mozRequestFullScreen()
              : o.webkitRequestFullscreen
              ? o.webkitRequestFullscreen()
              : o.msRequestFullscreen && o.msRequestFullscreen()
            : document.exitFullscreen
            ? document.exitFullscreen()
            : document.webkitExitFullscreen
            ? document.webkitExitFullscreen()
            : document.mozCancelFullScreen
            ? document.mozCancelFullScreen()
            : document.msExitFullscreen && document.msExitFullscreen();
        });
    },
  ]),
  myView.directive("videoplayerDirective", function () {
    return {
      retrict: "E",
      replace: !0,
      controller: "VideoPlayerCtrl",
      templateUrl: "templates/videoControl.html",
    };
  }),
  myView.controller("VideoPlayerIntroInstructionCtrl", [
    "$scope",
    function (e) {
      function t(e) {
        var t = "0",
          a = "0",
          n = parseInt(e);
        if (n >= 60 && n < 3600) {
          var t = ("0" + Math.floor(n / 60)).slice(-2);
          n %= 60;
        }
        if (n < 60) var a = ("0" + Math.floor(n)).slice(-2);
        return t + ":" + a;
      }
      function a() {
        isNaN(o.duration)
          ? (e.percentage = 0)
          : ((o.volume = 0),
            (e.videoTime = t(o.currentTime)),
            (e.videoDuration = t(o.duration)),
            (e.percentage = Math.floor((100 / o.duration) * o.currentTime))),
          e.$apply();
      }
      (e.isEnablePlayBtn = !1),
        (e.showTaskbar = !0),
        (e.enable_AD_btn = !0),
        (e.enable_dropdown = !1),
        (e.setting_dropdown = !1),
        (e.speed_dropdown = !1),
        (e.enable_settingOption = !1),
        (e.is_fullscreen = !0),
        (e.percentage = 0),
        (e.videoTime = 0),
        (e.audio_volume = 3),
        (e.speeds = [0.5, 1, 1.25, 1.5, 2]),
        (e.myPopup = !0),
        (e.centre_playing = !0);
      var n = document.getElementsByClassName("slider"),
        o = "",
        l = "";
      (e.videoSrc = ""),
        document.addEventListener("fullscreenchange", function () {
          e.is_fullscreen = !e.is_fullscreen;
        }),
        (e.renderFunctions2 = function () {
          function n(e, t) {
            (e.style.height = t.scrollHeight + "px"),
              (e.style.width = t.scrollWidth + "px"),
              (e.style.display = "block");
          }
          function r(e, t) {
            e.style.display = "none";
          }
          (o = document.getElementById("videoIntroInstruction")),
            (l = document.getElementById("fullScreenBtn"));
          var i = document.getElementById("placeholder_1");
          (i.style.top = o.offsetTop + "px"),
            (i.style.left = o.offsetLeft + "px"),
            (o.onwaiting = function () {
              n(i, this);
            }),
            (o.onplaying = function () {
              r(i, this);
            }),
            -1 != navigator.userAgent.indexOf("iPhone") ||
            -1 != navigator.userAgent.indexOf("iPod") ||
            -1 != navigator.userAgent.indexOf("iPad")
              ? (l.style.display = "none")
              : (l.style.display = "block"),
            (e.videoTime = t(o.currentTime)),
            (e.videoDuration = t(o.duration)),
            (o.src = e.videoSrc),
            o.addEventListener("timeupdate", a, !1),
            o.addEventListener("loadedmetadata", function () {
              (e.videoDuration = t(o.duration)),
                0 == e.videoTime && (e.videoTime = "0.00"),
                e.$apply();
            });
        }),
        (e.toggle = function () {
          (e.myPopup = !e.myPopup),
            (e.playing = !1),
            o.pause(),
            (e.centre_playing = !0);
        }),
        (e.playing = !1),
        (e.ad = !0),
        (e.add = function () {
          e.ad = !1;
        }),
        (e.unadd = function () {
          e.ad = !0;
        }),
        (e.audio = !0),
        (e.mute = function () {
          (e.audio = !1), (o.muted = !0);
        }),
        (e.unmute = function () {
          (e.audio = !0), (o.muted = !1);
        }),
        (e.playIntroInstructionVideo = function () {
          return (
            (e.centre_playing = !1),
            (e.playing = !0),
            o.play(),
            (o.onended = function (a) {
              $(".control-box").removeClass("mystyle"),
                (e.playing = !1),
                (e.centre_playing = !0),
                (e.videoTime = 0),
                (e.videoDuration = t(o.duration)),
                (e.videoTime = "0.00"),
                e.$apply();
            }),
            setTimeout(function () {
              $(".control-box").addClass("mystyle");
            }, 1e3),
            !1
          );
        }),
        e.$on("playIntroInstructionVideo", function (t, a) {
          (e.videoSrc = a),
            console.log("data", a),
            e.renderFunctions2(),
            (e.percentage = 0);
        }),
        (e.pauseIntroInstructionVideo = function () {
          (e.playing = !1), o.pause();
        }),
        $("#videoIntroInstruction").hover(
          function () {
            $(".control-box").removeClass("mystyle");
          },
          function () {
            $(".control-box").addClass("mystyle");
          }
        ),
        (e.seek = function (a) {
          var l = a.offsetX / n[0].offsetWidth,
            r = l * o.duration;
          (o.currentTime = r),
            (e.percentage = Math.floor((100 / o.duration) * r)),
            (e.videoTime = t(o.currentTime));
        }),
        (e.setVolume = function () {
          0 == e.audio_volume
            ? (e.audio_volume = currVolume)
            : ((currVolume = e.audio_volume), (e.audio_volume = 0));
        }),
        (e.enable_AD = function () {
          e.enable_AD_btn = !e.enable_AD_btn;
        }),
        (e.settingBtn = function () {
          (e.enable_dropdown = !e.enable_dropdown),
            e.enable_dropdown
              ? (e.enable_settingOption = !0)
              : ((e.enable_settingOption = !1), (e.speed_dropdown = !1));
        }),
        (e.settingOption = function (t) {
          (e.enable_settingOption = !1),
            "speed" === t && (e.speed_dropdown = !0);
        }),
        (e.changeSpeed = function (t) {
          "setting" === t
            ? ((e.enable_settingOption = !0), (e.speed_dropdown = !1))
            : (o.playbackRate = t);
        }),
        e.$on("stopVideo", function (t, a) {
          (e.videoSrc = ""),
            (e.playing = !1),
            o && o.pause(),
            (e.centre_playing = !0);
        }),
        (e.fullScreen2 = function () {
          e.is_fullscreen
            ? o.requestFullscreen
              ? (o.requestFullscreen(), console.log(o.requestFullscreen()))
              : o.mozRequestFullScreen
              ? o.mozRequestFullScreen()
              : o.webkitRequestFullscreen
              ? o.webkitRequestFullscreen()
              : o.msRequestFullscreen && o.msRequestFullscreen()
            : document.exitFullscreen
            ? document.exitFullscreen()
            : document.webkitExitFullscreen
            ? document.webkitExitFullscreen()
            : document.mozCancelFullScreen
            ? document.mozCancelFullScreen()
            : document.msExitFullscreen && document.msExitFullscreen();
        });
    },
  ]),
  myView.directive("videoplayerintroinstructionDirective", function () {
    return {
      retrict: "E",
      replace: !0,
      controller: "VideoPlayerIntroInstructionCtrl",
      templateUrl: "templates/videoControlIntroInstruction.html",
    };
  }),
  myView.controller("viewCtrl", [
    "$scope",
    "APPCONSTANT",
    "$timeout",
    "$interval",
    "$animate",
    "appService",
    function (e, t, a, n, o, l) {
      function r() {
        var e = window.innerWidth,
          t = window.innerHeight,
          a = 1,
          n = 1;
        e < 710 && (n = e / 1280),
          t > 1080 && (a = t / 1080),
          t <= 800 && (a = t / 800);
        var o = "scale(" + n + "," + a + ")",
          l = Math.min(e / 1920, t / 1080),
          o = "scale(" + l + ") translate(-50%, -50%)";
        $(".allLevelsView").css({ "-webkit-transform": o, transform: o });
      }
      function i(e) {
        for (var t, a, n = e.length; 0 !== n; )
          (a = Math.floor(Math.random() * n)),
            (n -= 1),
            (t = e[n]),
            (e[n] = e[a]),
            (e[a] = t);
        return e;
      }
      function s(t) {
        if ("en" == e.language) {
          var a = ".m4a";
          if (
            e.$parent.appData.extra_words_audio_fix.indexOf(t.toLowerCase()) >=
            0
          ) {
            a = ".mp3";
            var n = "assets/audios/data/" + t.toLowerCase() + a;
          } else {
            (t = t.toUpperCase()),
              (t = t.replace("'", "_")),
              (t = t.replace(".", "_")),
              (t += a);
            var n = "assets/audios/data/DATA_" + t;
          }
        } else {
          var o = {
            "sï¿½laba": "sílaba",
            "acentuaciï¿½n": "acentuación",
            "estï¿½bamos": "estábamos",
            "ï¿½ltimo": "último",
            "adiï¿½s": "adiós",
            "ahï¿½": "ahí",
            "seï¿½al": "señal",
            "plï¿½tano": "plátano",
            "frï¿½o": "frío",
            "guï¿½a": "guía",
            "ï¿½rbol": "árbol",
            "aquï¿½": "aquí",
            "niï¿½o": "niño",
            "adï¿½nde": "adónde",
            "estaciï¿½n": "estación",
            "miï¿½rcoles": "miércoles",
            "botï¿½n": "botón",
            "sï¿½bado": "sábado",
            "al revï¿½s": "al revés",
            "pequeï¿½a": "pequeña",
            "quizï¿½s": "quizás",
            "canciï¿½n": "canción",
            "escribï¿½": "escribí",
            "dï¿½nde": "dónde",
            "despuï¿½s": "después",
            "saliï¿½": "salió",
            "habï¿½a": "había",
            "querï¿½a": "quería",
            "decï¿½an": "decían",
            "asï¿½": "así",
            "cuï¿½ndo": "cuándo",
            "sï¿½": "sí",
            "tambiï¿½n": "también",
            "quï¿½": "qué",
            "detrï¿½s": "detrás",
            "tï¿½": "tú",
            "dï¿½a": "día",
            "cï¿½mo": "cómo",
            "estï¿½": "está",
            "niï¿½a": "niña",
            "rï¿½o": "río",
            "dï¿½": "dé",
            "allï¿½": "allí",
            "llamï¿½": "llamó",
            "luchï¿½": "luchó",
            "naciï¿½n": "nación",
            "seï¿½or": "señor",
            "alimentaciï¿½n": "alimentación",
            "antigï¿½edad": "antigüedad",
            "sï¿½": "sé",
            "telï¿½fono": "teléfono",
            "acciï¿½n": "acción",
            "llegï¿½": "llegó",
            "mï¿½s": "más",
            "quiï¿½n": "quién",
            "papï¿½": "papá",
            "mamï¿½": "mamá",
          };
          (t = t in o ? o[t] : t),
            (t = t.replace(/ñ/g, "n")),
            (t = t.replace(/á/g, "a")),
            (t = t.replace(/ú/g, "u")),
            (t = t.replace(/í/g, "i")),
            (t = t.replace(/é/g, "e")),
            (t = t.replace(/ó/g, "o")),
            (t = t.replace(/ü/g, "u")),
            (t = t.replace(/con/g, "_con")),
            (t = t.replace(/tal vez/g, "tal_vez")),
            (t = t.replace("al revés", "al_reves")),
            (t = t.replace("al reves", "al_reves"));
          var n = "assets/audios/data_spanish/" + t.toLowerCase() + ".mp3";
        }
        return n;
      }
      function c(t) {
        return (
          (t = t.toLowerCase()),
          (t = t.replace("'", "")),
          (t = t.replace(".", "")),
          (t = t.replace(".", "")),
          (t = t.replace("'", "")),
          (t = t.replace(/ñ/g, "n")),
          (t = t.replace(/á/g, "a")),
          (t = t.replace(/ú/g, "u")),
          (t = t.replace(/í/g, "i")),
          (t = t.replace(/é/g, "e")),
          (t = t.replace(/ó/g, "o")),
          (t = t.replace(/ü/g, "u")),
          (t = t.replace(/ /g, "_")),
          "Homophones" ==
            e.levelGroups[e.currentLevelGroup][e.currentLevel].rule &&
            (t += "_example"),
          "assets/videos/word/DATA_" + (t += ".mp4")
        );
      }
      function u(t) {
        return (
          (t = t.toLowerCase()),
          (t = t.replace("'", "")),
          (t = t.replace(".", "")),
          (t = t.replace(".", "")),
          (t = t.replace("'", "")),
          (t = t.replace(/ñ/g, "n")),
          (t = t.replace(/á/g, "a")),
          (t = t.replace(/ú/g, "u")),
          (t = t.replace(/í/g, "i")),
          (t = t.replace(/é/g, "e")),
          (t = t.replace(/ó/g, "o")),
          (t = t.replace(/ü/g, "u")),
          (t = t.replace(/ /g, "_")),
          "Homophones" ==
            e.levelGroups[e.currentLevelGroup][e.currentLevel].rule &&
            (t += "_example"),
          "assets/videos/instruction/" + (t += ".mp4")
        );
      }
      var p = !0;
      (e.languageTxt = null),
        (e.screenType = -1),
        (e.showLevelInfo = !1),
        (e.levelInfoAudioActive = !1),
        (e.levelGroups = {}),
        (e.totalGroups = 0),
        (e.totalLevels = 0),
        (e.currentLevelGroup = 1),
        (e.currentLevel = 0),
        (e.levelScore = 0),
        (e.currentLvlPoints = 0),
        e.levelLaunched,
        (e.correctOptionsArr = []),
        (e.totalScore = 0),
        (e.userScore = 0),
        (e.scorePoints = [60, 80, 95]),
        (e.unlockThresh = 70),
        (e.userName = ""),
        (e.showInstOverlay = !1),
        (e.showRepeatWordBtn = !1),
        (e.modeInstruction = ""),
        (e.showInstructionCaption = !1),
        (e.playMode = "easy"),
        (e.encouragingwords = ""),
        e.leafData,
        e.wordSet,
        (e.showInstructionOverlay = !1),
        (e.timeoutext = !1),
        (e.dancingurchin = !1),
        (e.replaygame = !1),
        (e.savexit = !1),
        (e.activeLeafSet = {
          easy: [1, 1, 1, 0],
          medium: [1, 1, 1, 1],
          challenger: [1, 1, 1, 1],
        }),
        (e.currentActiveLeaves = []),
        (e.currentOptions = -1),
        e.correctOption,
        (e.wordlistData = []),
        e.progress,
        e.creatures,
        e.timer,
        (e.pauseTimer = !1),
        e.popupType,
        (e.ccOn = !1),
        (e.leafHoverAnim = !1),
        (e.audioCallback = {
          thisRef: e,
          params: [],
          type: "end",
          delay: -1,
          arrIndex: -1,
          callbackRef: null,
        }),
        (e.midLevelState = null),
        (e.showReport = !1),
        (e.autoCorrectAnim = !1),
        (e.screenOverlay = !1),
        (e.zoomedLevel = 0);
      var d = 2,
        v = [],
        m = !0,
        g = [],
        f = [],
        h = [];
      e.IsVisible = !1;
      var b = null,
        y = 0,
        C = 1,
        L = "",
        w = "",
        A = "",
        S = !1,
        T = [];
      (e.showAllView = !1),
        (e.devDesignMode = !1),
        (e.isLevelClicked = !1),
        (e.allowOptionClick = !1),
        e.$on(t.ACTIVITY_LOADED, function () {
          e.init(), r();
        }),
        e.$on(t.RESIZE, function () {
          r();
        }),
        e.$on(t.ORIENTATION, function () {
          a(function () {
            r();
          }, 500);
        }),
        angular.element(".aslIntroInstructionVideoBtn").hover(
          function () {
            $(".aslIcon").removeClass("svgHandIcon"),
              $(".aslIcon").addClass("svgHandIconHover");
          },
          function () {
            $(".aslIcon").removeClass("svgHandIconHover"),
              $(".aslIcon").addClass("svgHandIcon");
          }
        ),
        angular.element(".aslInstructionVideoBtn").hover(
          function () {
            $(".imgHovHand").removeClass("svgHandIcon"),
              $(".imgHovHand").addClass("svgHandIconHover");
          },
          function () {
            $(".imgHovHand").removeClass("svgHandIconHover"),
              $(".imgHovHand").addClass("svgHandIcon");
          }
        ),
        angular.element(".repeatAudIcon11").hover(
          function () {
            $(".imgHovHandword").removeClass("wordsvgHandIconHover"),
              $(".imgHovHandword").addClass("wordsvgHandIcon");
          },
          function () {
            $(".imgHovHandword").removeClass("wordsvgHandIcon"),
              $(".imgHovHandword").addClass("wordsvgHandIconHover");
          }
        ),
        angular.element(".audioBtnHov").hover(
          function () {
            $(".rep").removeClass("repeatAudIcon"),
              $(".rep").addClass("repeatAudIconHover");
          },
          function () {
            $(".rep").removeClass("repeatAudIconHover"),
              $(".rep").addClass("repeatAudIcon");
          }
        ),
        angular.element(".InsBtnHov").hover(
          function () {
            $(".ins").removeClass("repeatAudIconHover"),
              $(".ins").addClass("repeatAudIcon");
          },
          function () {
            $(".ins").removeClass("repeatAudIcon"),
              $(".ins").addClass("repeatAudIconHover");
          }
        ),
        (e.ShowHide = function () {
          e.IsVisible = !0;
        }),
        (e.init = function () {
          (e.popupOn = !1),
            (e.savexit = !1),
            e.processRawDB(),
            (e.languageTxt =
              e.$parent.appData.lang_txt[e.$parent.appData.language]),
            (e.language = e.$parent.appData.language),
            (m = !1),
            e.$emit("initAccessibility"),
            e.setupIdleTimer(),
            e.refreshAudioCallbackObj(),
            (m = !0),
            (e.audioCallback.type = "end"),
            (e.audioCallback.callbackRef = function () {
              m = !1;
            }),
            e.$parent.appData.data.tincan.restoreGame
              ? (e.restoreGameState(),
                AccessibilityManager.setTabGroup("savestatePopup"),
                AccessibilityManager.updateTabOrder(
                  "savestatePopup",
                  function () {
                    AccessibilityManager.setFocus(
                      ".popupContainer .textContainer"
                    );
                  }
                ))
              : (e.$broadcast("playAudio", "splash", e.audioCallback),
                e.setupLevelGroups(),
                e.showHomeScreen(),
                (e.levelGroups[e.currentLevelGroup][
                  e.currentLevel
                ].modes.medium.active = !1),
                (e.levelGroups[e.currentLevelGroup][
                  e.currentLevel
                ].modes.challenger.active = !1));
        }),
        (e.setupIdleTimer = function () {
          C = 0;
          (e.idleInterval = n(function () {
            C++;
          }, 1e3)),
            angular.element(document).on("mousemove", function () {
              C = 0;
            }),
            angular.element(document).on("touchstart", function () {
              C = 0;
            });
        }),
        (e.playClick = function () {
          !0 !== m &&
            (e.$broadcast("stopAudio"),
            e.refreshAudioCallbackObj(),
            (e.audioCallback.type = "end"),
            (e.audioCallback.delay = 1e3),
            (e.audioCallback.callbackRef = function () {
              e.enableFirstLevel(),
                (e.screenType = 2),
                (e.showAllView = !0),
                (e.showInstructionsAfterAnim = !0),
                a(function () {
                  var t = $(".allLevelsView .levelIsland")[e.zoomedLevel],
                    n = t.getBoundingClientRect(),
                    o = $(".allLevelsView")[0].getBoundingClientRect(),
                    l =
                      (n.left,
                      o.left,
                      n.top,
                      o.top,
                      $(".connectingProgression")[0]);
                  $(l).css({
                    "-webkit-transform-origin": n.left + "px " + n.top + "px",
                    "-moz-transform-origin": n.left + "px " + n.top + "px",
                    "-ms-transform-origin": n.left + "px " + n.top + "px",
                    "transform-origin": n.left + "px " + n.top + "px",
                  }),
                    $(l).removeClass("animationEndState"),
                    $(l).addClass("allLevelAnimation"),
                    a(function () {
                      $(l).removeClass("allLevelAnimation"),
                        $(l).addClass("animationEndState"),
                        e.allViewClick(e.currentLevelGroup),
                        a(function () {
                          a(function () {
                            AccessibilityManager.setTabGroup(
                              "levelScreenInstruction"
                            ),
                              AccessibilityManager.updateTabOrder(
                                "levelScreenInstruction",
                                function () {
                                  AccessibilityManager.setFocus(
                                    ".playLevelInformation span"
                                  );
                                }
                              );
                          }, 100);
                        }, 2500);
                    }, 2500);
                }, 100);
            }),
            e.$broadcast("playAudio", "click", e.audioCallback));
        }),
        (e.splashAudioClick = function () {
          e.$broadcast("stopAudio"),
            e.refreshAudioCallbackObj(),
            e.$broadcast("playAudio", "splash", null);
        }),
        (e.allViewClick = function (t) {
          (e.currentLevelGroup = t),
            (e.showAllView = !1),
            a(function () {
              (e.showInstructionsAfterAnim = !1), e.showLevelScreen();
            }, 100);
        }),
        (e.showHomeScreen = function (a) {
          (m = !1),
            (e.screenType = 1),
            AccessibilityManager.updateTabOrder("splashScreen", function () {
              AccessibilityManager.setFocus(".splashScreen .playBtn");
            }),
            e.refreshAudioCallbackObj(),
            e.$emit(t.SAVE_TINCAN_DATA);
        }),
        (e.showLevelScreen = function () {
          (e.screenType = 2),
            1 == S
              ? ((e.showInstBtn = !0),
                (e.screenOverlay = !1),
                (e.showLevelInfo = !1),
                (e.savexit = !1),
                (S = !1))
              : ((e.showReport = !1),
                (e.showInstBtn = !1),
                (e.IsVisible = !1),
                e.refreshAudioCallbackObj(),
                (m = !0),
                (e.audioCallback.type = "end"),
                (e.savexit = !1),
                (e.screenOverlay = !0),
                (e.showLevelInfo = !0),
                (e.audioCallback.callbackRef = function () {
                  (e.showInstBtn = !0),
                    (m = !1),
                    (e.showLevelInfo = !1),
                    (e.screenOverlay = !1);
                }),
                e.$broadcast("playAudio", "letsgo", e.audioCallback)),
            AccessibilityManager.updateTabOrder("levelScreen", function () {
              AccessibilityManager.setFocus($(".levelInfoContainer"));
            }),
            e.$emit(t.SAVE_TINCAN_DATA),
            r();
        }),
        (e.closePopupClick = function () {
          e.$broadcast("stopAudio"),
            (e.screenOverlay = !1),
            (e.showLevelInfo = !1),
            (e.showInstBtn = !0),
            (m = !1),
            AccessibilityManager.updateTabOrder("levelScreen", function () {
              AccessibilityManager.setFocus($(".levelMode")[0]);
            });
        }),
        (e.showQnsScreen = function () {
          if (
            ((e.screenType = 3),
            e.restoreMidLevelState(),
            (e.leafData = e.$parent.appData.leafData.easy),
            (e.showInstructionCaption = !1),
            (e.showRepeatWordBtn = !0),
            (e.showInstBtn = !0),
            (e.showInstOverlay = !1),
            "challenger" == e.playMode)
          ) {
            if (e.timeLimit < 360)
              return e.loadNextQuestion(), void e.startTimer();
            e.timeLimit < 360 && (e.currentOptions, e.wordSet.length),
              e.levelCompleteHandle();
          } else e.loadNextQuestion();
          e.$emit(t.SAVE_TINCAN_DATA);
        }),
        (e.cancelbtn = function () {
          e.savexit = !1;
        }),
        (e.cancelBtnClick = function () {
          (e.savexit = !1),
            (e.showEndPopup = !1),
            (e.showAllView = !0),
            (e.showInstBtn = !1),
            (e.dancingurchin = !1);
        }),
        (e.lvlbackBtnClick = function () {
          e.savexit = !0;
        }),
        (e.setupLevelGroups = function () {
          (e.totalGroups = 0),
            (e.totalLevels = 0),
            (e.levelGroups = {}),
            (e.allLevels = e.$parent.appData.levelData),
            angular.forEach(e.$parent.appData.allViewPos, function (t, a) {
              (e.allLevels[a + 1].pos = {}),
                (e.allLevels[a + 1].pos.top = t.top),
                (e.allLevels[a + 1].pos.left = t.left);
            }),
            angular.forEach(e.$parent.appData.levelData, function (t, a) {
              if (!t.group)
                return (
                  console.log(
                    "Invalid JSON. Level group missing --- " + a + " --- " + t
                  ),
                  void (p = !1)
                );
              e.levelGroups.hasOwnProperty(t.group)
                ? ((t.level = a),
                  (t.name = e.languageTxt.islands[parseInt(a) - 1]),
                  angular.forEach(t.modes, function (a, n) {
                    (a.modelabels = e.languageTxt.modelabels[n]),
                      (a.date = ""),
                      (a.timeSpent = ""),
                      (a.percentComplete = "0%"),
                      (a.targetWordLevel = t.grade),
                      (a.isPass = "No"),
                      (a.responses = []);
                  }),
                  e.levelGroups[t.group].push(t),
                  (e.totalLevels = e.totalLevels + 1))
                : ((e.totalGroups = e.totalGroups + 1),
                  (e.levelGroups[t.group] = []),
                  (t.level = a),
                  (t.name = e.languageTxt.islands[parseInt(a) - 1]),
                  angular.forEach(t.modes, function (a, n) {
                    (a.modelabels = e.languageTxt.modelabels[n]),
                      (a.date = ""),
                      (a.timeSpent = ""),
                      (a.percentComplete = "0%"),
                      (a.targetWordLevel = t.grade),
                      (a.isPass = "No"),
                      (a.responses = []);
                  }),
                  e.levelGroups[t.group].push(t),
                  (e.totalLevels = e.totalLevels + 1));
            });
        }),
        (e.enableFirstLevel = function () {
          (e.currentLevelGroup = 1),
            (e.currentLevel = 0),
            (e.totalScore = e.totalScore + 3 * e.scorePoints.length),
            (e.levelGroups[e.currentLevelGroup][
              e.currentLevel
            ].modes.easy.active = !0);
        }),
        (e.restoreGameState = function () {
          (y = e.$parent.appData.data.tincan.total_score),
            (b = e.$parent.appData.data.tincan.savedState),
            (e.currentLevelGroup = b.levelGroup),
            (e.currentLevel = parseInt(b.level) - 1),
            (e.totalGroups = b.totalGroups),
            (e.totalLevels = b.totalLevels),
            (e.totalScore = b.totalScore),
            (e.userScore = b.userScore),
            (e.levelGroups = b.levelGroups),
            (e.midLevelState = b.midLevelState),
            (e.wordlistData = b.wordlistData),
            (e.allLevels = b.allViewState),
            (e.currentOptions = b.currentIndex),
            (e.wordSet = b.wordSet),
            (e.levelScore = b.levelScore),
            (e.levelLaunched = b.levelLaunched),
            (e.playMode = b.playMode),
            (e.gameStartTime = new Date(b.gameStartTime)),
            (e.levelEndTime = new Date(b.levelEndTime)),
            (g = e.wordlistData);
          try {
            e.levelGroups[e.currentLevelGroup][e.currentLevel].modes[e.playMode]
              .responses &&
              (T =
                e.levelGroups[e.currentLevelGroup][e.currentLevel].modes[
                  e.playMode
                ].responses);
          } catch (e) {}
          a(function () {
            if ("review" === TincanManager.mode) e.showHomeScreen();
            else
              switch (b.screenType) {
                case 1:
                  e.showHomeScreen();
                  break;
                case 2:
                  e.showLevelScreen();
                  break;
                case 3:
                  e.showQnsScreen();
              }
          }, 500);
        }),
        (e.saveGameState = function () {
          e.setupMidLevelStateObj(),
            (e.$parent.appData.data.tincan.savedState = {
              screenType: e.screenType,
              levelGroup: e.currentLevelGroup,
              level: parseInt(e.currentLevel) + 1,
              totalGroups: e.totalGroups,
              totalLevels: e.totalLevels,
              totalScore: e.totalScore,
              userScore: e.userScore,
              levelGroups: e.levelGroups,
              midLevelState: e.midLevelState,
              wordlistData: e.wordlistData,
              allViewState: e.allLevels,
              currentIndex: e.currentOptions,
              wordSet: e.wordSet,
              levelScore: e.levelScore,
              levelLaunched: e.levelLaunched,
              playMode: e.playMode,
              gameStartTime: e.gameStartTime,
              levelEndTime: e.levelEndTime,
            });
        }),
        (e.setupMidLevelStateObj = function () {
          3 == e.screenType
            ? (e.midLevelState = {
                levelLaunched: e.levelLaunched,
                points: e.currentLvlPoints,
                score: e.levelScore,
                mode: e.playMode,
                wordset: e.wordSet,
                currentIndex: parseInt(e.currentOptions) - 1,
                progress: e.progress,
                timeLimit: e.timeLimit,
                wordlistData: e.wordlistData,
                userScore: e.userScore,
                gameStartTime: e.gameStartTime,
                levelLaunched: e.levelLaunched,
                playMode: e.playMode,
                levelEndTime: e.levelEndTime,
              })
            : (e.midLevelState = null);
        }),
        (e.restoreMidLevelState = function () {
          (e.levelLaunched = e.midLevelState.levelLaunched),
            (e.currentLvlPoints = e.midLevelState.points),
            (e.levelScore = e.midLevelState.score),
            (e.playMode = e.midLevelState.mode),
            (e.wordSet = e.midLevelState.wordset),
            (e.currentOptions = e.midLevelState.currentIndex),
            (e.progress = e.midLevelState.progress),
            (e.timeLimit = e.midLevelState.timeLimit),
            (e.wordlistData = e.midLevelState.wordlistData),
            (e.gameStartTime = new Date(e.midLevelState.gameStartTime)),
            (e.userScore = e.midLevelState.userScore),
            (e.levelLaunched = e.midLevelState.levelLaunched),
            (e.playMode = e.midLevelState.playMode),
            (e.levelEndTime = new Date(e.midLevelState.levelEndTime));
        }),
        (e.levelClick = function (a, n, o, l, r, s) {
          if (
            angular.element(a.target).hasClass("locked") ||
            -1 != e.currentOptions
          )
            e.startGamePlay(),
              AccessibilityManager.updateTabOrder("playScreen", function () {
                AccessibilityManager.setFocus(
                  $(".playScreen  .playLevelInformation")
                );
              });
          else {
            (e.zoomedLevel = r),
              (e.isLevelClicked = !0),
              (e.replaygame = !1),
              (m = !0);
            var c = 0;
            switch (o) {
              case "easy":
                c = 1;
                break;
              case "medium":
                c = 2;
                break;
              case "challenger":
                c = 3;
            }
            var u;
            (u = "restart" != s ? y + c : y),
              (y = u),
              (e.levelLaunched = n),
              (e.currentLevel = r),
              (e.levelScore = 0),
              (e.playMode = o),
              (e.time = ""),
              (e.pauseTimer = !1),
              (e.wordSet = i(
                e.$parent.appData.data.dataset[e.$parent.appData.language][
                  n
                ].slice()
              )),
              (e.levelGroups[e.currentLevelGroup][e.currentLevel].modes[
                e.playMode
              ].wordset = e.wordSet),
              (e.gameStartTime = new Date()),
              e.refreshAudioCallbackObj(),
              (e.audioCallback.type = "end"),
              (e.audioCallback.callbackRef = function () {
                (m = !1), e.startGamePlay();
              }),
              (T = e.levelGroups[e.currentLevelGroup][e.currentLevel].modes[
                e.playMode
              ].responses
                ? e.levelGroups[e.currentLevelGroup][e.currentLevel].modes[
                    e.playMode
                  ].responses
                : []),
              (e.levelGroups[e.currentLevelGroup][e.currentLevel].modes[
                e.playMode
              ].responses = []),
              (e.wordlistData = []);
            for (var p = 0; p < e.wordSet.length; p++)
              e.wordlistData.push({ audio: "", word: "", attempts: -1 }),
                e.levelGroups[e.currentLevelGroup][e.currentLevel].modes[
                  e.playMode
                ].responses.push({ target: "", attempt1: "-", attempt2: "-" });
            e.$emit(t.SAVE_TINCAN_DATA),
              e.startGamePlay(),
              AccessibilityManager.updateTabOrder("playScreen", function () {
                AccessibilityManager.setFocus(
                  $(".playScreen  .playLevelInformation")
                );
              });
          }
        }),
        (e.backToLevelScreen = function () {
          1 != m &&
            (e.$broadcast("stopAudio"),
            (e.pauseTimer = !0),
            (S = !0),
            e.showLevelScreen());
        }),
        (e.lvlbackBtnClick1 = function () {
          (e.currentOptions = -1),
            e.$broadcast("stopAudio"),
            (e.popupOn = !1),
            (e.showInstBtn = !1),
            (e.dancingurchin = !1),
            (e.showInstructionsAfterAnim = !0),
            e.gotoLevelScreen(),
            a(function () {
              (S = !0), e.allViewClick(e.currentLevelGroup);
            }, 100);
        }),
        (e.saveandexitbtn = function () {
          (e.savexit = !1), e.showHomeScreen(!0), e.$emit("SUBMIT_TINCAN_DATA");
        }),
        (e.saveandexit = function () {
          (e.currentOptions = -1),
            e.$broadcast("stopAudio"),
            (e.showEndPopup = !1),
            (e.savexit = !0),
            e.percentComplete >= e.unlockThresh &&
              ((e.replaygame = !0), e.gotoLevelScreen());
        }),
        (e.endLevelHandler = function () {
          (e.currentOptions = -1),
            e.$broadcast("stopAudio"),
            (e.popupOn = !1),
            (e.dancingurchin = !1),
            e.percentComplete >= e.unlockThresh
              ? ((e.replaygame = !0),
                e.gotoLevelScreen(),
                "easy" == e.playMode
                  ? e.levelClick(
                      "",
                      e.levelLaunched,
                      "medium",
                      "",
                      e.currentLevel,
                      ""
                    )
                  : "medium" == e.playMode
                  ? e.levelClick(
                      "",
                      e.levelLaunched,
                      "challenger",
                      "",
                      e.currentLevel,
                      ""
                    )
                  : "challenger" == e.playMode
                  ? e.levelLaunched < e.totalLevels &&
                    (e.currentLevel <
                    e.levelGroups[e.currentLevelGroup].length - 1
                      ? e.levelClick(
                          "",
                          parseInt(e.levelLaunched) + 1,
                          "easy",
                          "",
                          e.currentLevel + 1,
                          ""
                        )
                      : (e.currentLevelGroup++,
                        (e.currentLevel = 0),
                        e.levelClick(
                          "",
                          parseInt(e.levelLaunched) + 1,
                          "easy",
                          "",
                          e.currentLevel,
                          ""
                        )))
                  : e.gotoLevelScreen())
              : ((e.userScore = e.userScore - e.levelScore),
                (e.levelGroups[e.currentLevelGroup][e.currentLevel].modes[
                  e.playMode
                ].score = 0),
                (e.levelGroups[e.currentLevelGroup][e.currentLevel].modes[
                  e.playMode
                ].percentComplete = "0%"),
                (e.levelGroups[e.currentLevelGroup][e.currentLevel].modes[
                  e.playMode
                ].timeSpent = ""),
                e.levelClick(
                  "",
                  e.levelLaunched,
                  e.playMode,
                  "",
                  e.currentLevel,
                  "restart"
                ));
        }),
        (e.gotoIslands = function () {
          1 != m &&
            ((e.popupOn = !1),
            (e.showInstructionsAfterAnim = !0),
            e.gotoLevelScreen(),
            a(function () {
              e.allViewClick(e.currentLevelGroup);
            }, 1500));
        }),
        (e.startGamePlay = function (a) {
          (e.leafData = e.$parent.appData.leafData.easy),
            (e.dancingurchin = !1),
            (e.popupOn = !1),
            (e.screenType = 3),
            -1 == e.currentOptions &&
              ((e.currentOptions = -1),
              (e.progress = 0),
              (g = []),
              (f = []),
              (h = []),
              angular.forEach(e.wordSet, function (e) {
                g.push(e[0]);
              })),
            e.$emit(t.SAVE_TINCAN_DATA),
            "challenger" == e.playMode
              ? (e.refreshAudioCallbackObj(),
                (e.showInstructionCaption = !0),
                (e.showInstBtn = !1),
                (e.showInstOverlay = !0),
                (m = !0),
                (e.audioCallback.type = "end"),
                (e.level1Info = e.languageTxt.levelInfo2),
                (e.audioCallback.callbackRef = function () {
                  (e.showInstructionCaption = !1),
                    (e.showRepeatWordBtn = !0),
                    (e.showInstBtn = !0),
                    (e.showInstOverlay = !1),
                    (m = !1),
                    -1 == e.currentOptions
                      ? ((e.timeLimit = 0),
                        e.loadNextQuestion(),
                        e.startTimer())
                      : ((e.pauseTimer = !1),
                        (m = !0),
                        e.refreshAudioCallbackObj(),
                        (e.audioCallback.type = "end"),
                        (e.audioCallback.callbackRef = e.setupNextQns),
                        (e.audioCallback.delay = -1),
                        e.$broadcast("stopAudio"),
                        e.$broadcast("playAudio", "appear", e.audioCallback));
                }),
                e.$broadcast("playAudio", "timerstart1", e.audioCallback))
              : (e.refreshAudioCallbackObj(),
                (e.showInstructionCaption = !0),
                (e.showInstBtn = !1),
                (e.showInstOverlay = !0),
                (e.level1Info = e.languageTxt.levelInfo),
                (e.audioCallback.callbackRef = function () {
                  (e.showInstructionCaption = !1),
                    (e.showRepeatWordBtn = !0),
                    (e.showInstBtn = !0),
                    e.$broadcast("stopVideo"),
                    (e.IsVisible = !1),
                    (e.showInstOverlay = !1),
                    -1 == e.currentOptions
                      ? e.loadNextQuestion()
                      : ((m = !0),
                        e.refreshAudioCallbackObj(),
                        (e.audioCallback.type = "end"),
                        (e.audioCallback.callbackRef = e.setupNextQns),
                        (e.audioCallback.delay = -1),
                        e.$broadcast("stopAudio"),
                        e.$broadcast("playAudio", "appear", e.audioCallback));
                }),
                e.$broadcast("playAudio", "instructionmode", e.audioCallback)),
            e.$emit(t.SAVE_TINCAN_DATA);
        }),
        (e.closeInstructionInnerPanel = function () {
          (e.IsVisible = !1),
            e.$broadcast("stopVideo"),
            (e.showInstOverlay = !1),
            (e.showInstructionCaption = !1),
            (e.showInstBtn = !0),
            e.refreshAudioCallbackObj(),
            "challenger" == e.playMode
              ? ((e.showRepeatWordBtn = !0),
                (e.showInstructionCaption = !1),
                (e.showInstBtn = !0),
                (e.showInstOverlay = !1))
              : "easy" == e.playMode
              ? (e.refreshAudioCallbackObj(),
                (e.showRepeatWordBtn = !0),
                (e.showInstructionCaption = !1),
                (e.showInstBtn = !0),
                (e.showInstOverlay = !1))
              : "medium" == e.playMode &&
                (e.refreshAudioCallbackObj(),
                (e.showRepeatWordBtn = !0),
                (e.showInstructionCaption = !1),
                (e.showInstBtn = !0),
                (e.showInstOverlay = !1));
        }),
        (e.closeAslInstructionPanel = function () {
          (e.IsVisible = !1),
            e.$broadcast("stopVideo"),
            e.$broadcast("stopAudio"),
            (e.showInstOverlay = !1),
            (e.showInstructionCaption = !1),
            (e.showInstBtn = !0),
            (m = !1),
            e.refreshAudioCallbackObj();
        }),
        (e.closeInstructionPanel = function () {
          if (
            ((e.IsVisible = !1),
            e.$broadcast("stopVideo"),
            e.$broadcast("stopAudio"),
            (e.showInstOverlay = !1),
            (e.showInstructionCaption = !1),
            (e.showInstBtn = !0),
            (m = !1),
            e.isLevelClicked)
          )
            return (
              (e.timeLimit = 0),
              e.loadNextQuestion(),
              void ("challenger" == e.playMode && e.startTimer())
            );
          e.refreshAudioCallbackObj(),
            "challenger" == e.playMode
              ? ((e.showRepeatWordBtn = !0),
                (e.showInstructionCaption = !1),
                (e.showInstBtn = !0),
                -1 !== e.currentOptions && (e.pauseTimer = !1),
                (e.showInstOverlay = !1))
              : "easy" == e.playMode
              ? (e.refreshAudioCallbackObj(),
                (e.showRepeatWordBtn = !0),
                (e.showInstructionCaption = !1),
                (e.showInstBtn = !0),
                (e.showInstOverlay = !1))
              : "medium" == e.playMode &&
                (e.refreshAudioCallbackObj(),
                (e.showRepeatWordBtn = !0),
                (e.showInstructionCaption = !1),
                (e.showInstBtn = !0),
                (e.showInstOverlay = !1)),
            (m = !0),
            e.refreshAudioCallbackObj(),
            (e.audioCallback.type = "end"),
            (e.audioCallback.callbackRef = e.setupNextQns),
            (e.audioCallback.delay = -1),
            e.$broadcast("stopAudio"),
            e.$broadcast("playAudio", "appear", e.audioCallback);
        }),
        (e.instructBtnClickHandler = function () {
          1 != m &&
            ((e.IsVisible = !1),
            e.$broadcast("stopAudio"),
            "challenger" == e.playMode
              ? (e.refreshAudioCallbackObj(),
                (e.showInstructionCaption = !0),
                (e.showInstBtn = !1),
                (e.showInstOverlay = !0),
                (e.level1Info = e.languageTxt.levelInfo2))
              : (e.refreshAudioCallbackObj(),
                (e.showInstructionCaption = !0),
                (e.showInstBtn = !1),
                (e.showInstOverlay = !0),
                (e.level1Info = e.languageTxt.levelInfo)));
        }),
        (e.loadNextQuestion = function () {
          if (
            (e.currentOptions++,
            (e.autoCorrectAnim = !1),
            (e.isLevelClicked = !1),
            e.currentOptions >= e.wordSet.length)
          )
            "challenger" == e.playMode && n.cancel(e.timer),
              e.levelCompleteHandle();
          else {
            angular.forEach(e.currentActiveLeaves, function (t, a) {
              e.currentActiveLeaves[a] = "";
            }),
              $(".leaf").removeClass("selectedLeaf"),
              (e.creatures = []),
              (m = !0),
              e.refreshAudioCallbackObj(),
              (e.audioCallback.type = "end"),
              (e.audioCallback.callbackRef = e.setupNextQns),
              (e.audioCallback.delay = -1),
              e.$broadcast("stopAudio"),
              e.$broadcast("playAudio", "appear", e.audioCallback),
              (e.levelScore = (function (e, t) {
                for (var a = 0, n = 0; n < t.length; n++)
                  "attempts" in t[n] && t[n].attempts === e && a++;
                return a;
              })(2, e.wordlistData));
            var t =
              e.levelGroups[e.currentLevelGroup][e.currentLevel].modes[
                e.playMode
              ].score;
            e.levelScore > t &&
              ((e.levelGroups[e.currentLevelGroup][e.currentLevel].modes[
                e.playMode
              ].score = e.levelScore),
              (e.levelGroups[e.currentLevelGroup][e.currentLevel].modes[
                e.playMode
              ].percentComplete =
                (100 * e.levelScore) / e.wordSet.length + "%"),
              (e.userScore = e.userScore + (e.levelScore - t)));
          }
        }),
        (e.setupNextQns = function () {
          //NM (MELLITR-5680): Check and reset the Variable 
          if(e.currentOptions==-1 || e.currentOptions>=e.wordSet.length) e.currentOptions = 0;
          //NM: end Remove
          (e.currentActiveLeaves = e.activeLeafSet[e.playMode].slice()),
            (e.correctOption = e.wordSet[e.currentOptions][0]);
          for (var n = 0; n < e.currentActiveLeaves.length; )
            1 == e.currentActiveLeaves[n]
              ? (e.currentActiveLeaves[n] = e.wordSet[e.currentOptions][n])
              : (e.currentActiveLeaves[n] = ""),
              n++;
          i(e.currentActiveLeaves),
            e.generateCreatures(),
            (d = 2),
            e.$emit(t.SAVE_TINCAN_DATA),
            a(function () {
              (v = ["find", s(e.correctOption)]),
                e.playCurrentWord(),
                AccessibilityManager.updateTabOrder("playScreen", function () {
                  AccessibilityManager.setFocus($(".leafCover.active")[0]);
                });
            }, 1e3);
        }),
        (e.playCurrentWord = function () {
          e.refreshAudioCallbackObj(),
            (e.audioCallback.type = "end"),
            (e.audioCallback.callbackRef = function () {
              m = !1;
            }),
            (e.audioCallback.arrIndex = v.length - 1),
            e.$broadcast("playAudioArray", v, e.audioCallback);
        }),
        (e.generateCreatures = function () {
          (e.creatures = []),
            angular.forEach(e.currentActiveLeaves, function (t, a) {
              if ("" == t) e.creatures.push(0);
              else {
                var n = Math.floor(3 * Math.random()) + 1;
                e.creatures.push(n);
              }
            });
        }),
        (e.startTimer = function () {
          (e.pauseTimer = !1),
            (e.timer = n(function () {
              e.timeLimit >= 360 &&
                ((e.timeLimit = 360),
                n.cancel(e.timer),
                (m = !0),
                e.refreshAudioCallbackObj(),
                (e.audioCallback.type = "end"),
                (e.audioCallback.callbackRef = function () {
                  (m = !1), e.levelCompleteHandle();
                }),
                a(function () {
                  e.$broadcast("stopAudio"),
                    e.$broadcast("playAudio", "timerend", e.audioCallback);
                }, 100));
              var o, l;
              (o = parseInt(e.timeLimit / 60)),
                o < 10 && (o = "0" + o),
                (l = parseInt(e.timeLimit % 60)),
                l < 10 && (l = "0" + l),
                (e.time = o + ":" + l),
                !1 === e.pauseTimer && e.timeLimit++,
                e.timeLimit % 5 == 0 && e.$emit(t.SAVE_TINCAN_DATA);
            }, 1e3));
        }),
        (e.optionClick = function (t, n) {
          if (
            ((e.levelGroups[e.currentLevelGroup][e.currentLevel].modes[
              e.playMode
            ].responses[e.currentOptions].target = e.correctOption),
            1 != m)
          ) {
            var o = "",
              l = !1;
            if (
              ((o = e.currentActiveLeaves[n]),
              !angular.element(t.currentTarget).hasClass("disabledOption") &&
                !0 !== m)
            ) {
              if (
                ((m = !0),
                (e.leafHoverAnim = !1),
                angular.element(".leafCreature").removeClass("hoverAnim"),
                $(t.currentTarget).addClass("selectedLeaf"),
                e.currentActiveLeaves[n] == e.correctOption)
              )
                (l = !0),
                  angular.forEach(e.currentActiveLeaves, function (t, a) {
                    t != e.correctOption && (e.currentActiveLeaves[a] = "");
                  }),
                  (e.answerInattempt1 = !0),
                  f.push(e.correctOption),
                  (e.progress = e.progress + 100 / e.wordSet.length),
                  2 == d && e.levelScore++,
                  I(d, l),
                  e.refreshAudioCallbackObj(),
                  (m = !0),
                  (e.audioCallback.type = "end"),
                  (e.audioCallback.callbackRef = function () {
                    (m = !1), e.loadNextQuestion();
                  }),
                  (e.audioCallback.arrIndex = 1),
                  e.$broadcast(
                    "playAudioArray",
                    [s(e.correctOption), "correct"],
                    e.audioCallback
                  );
              else {
                $(t.currentTarget).addClass("disabledOption"),
                  e.refreshAudioCallbackObj(),
                  (e.audioCallback.callbackRef = function () {
                    if (
                      ((m = !1), d--, (e.currentActiveLeaves[n] = ""), 0 == d)
                    ) {
                      (l = !1),
                        (e.answerInattempt3 = !0),
                        angular.forEach(e.currentActiveLeaves, function (e, t) {
                          t != n && "";
                        }),
                        l || I(d, l),
                        h.push(e.correctOption);
                      for (var t = 0; t < e.currentActiveLeaves.length; ++t)
                        e.currentActiveLeaves[t] != e.correctOption &&
                          (e.currentActiveLeaves[t] = "");
                      (e.autoCorrectAnim = !0),
                        (m = !0),
                        e.refreshAudioCallbackObj(),
                        (e.audioCallback.callbackRef = function () {
                          (m = !1), e.loadNextQuestion();
                        }),
                        (e.audioCallback.type = "end"),
                        (e.audioCallback.arrIndex = 1),
                        e.$broadcast("stopAudio"),
                        e.$broadcast(
                          "playAudioArray",
                          ["correctans", s(e.correctOption)],
                          e.audioCallback
                        );
                    } else
                      (e.answerInattempt2 = !0),
                        AccessibilityManager.updateTabOrder(
                          "playScreen",
                          function () {
                            AccessibilityManager.setFocus(
                              $(".leafCover.active")[0]
                            );
                          }
                        );
                  }),
                  (e.audioCallback.arrIndex = 1),
                  (e.audioCallback.type = "end"),
                  d > 1 && (e.allowOptionClick = !0);
                var r = [s(e.currentActiveLeaves[n]), "incorrect"];
                d > 1 && (r = r.concat(v)),
                  (e.audioCallback.arrIndex = r.length - 1),
                  e.$broadcast("playAudioArray", r, e.audioCallback);
              }
              2 == d
                ? (e.levelGroups[e.currentLevelGroup][e.currentLevel].modes[
                    e.playMode
                  ].responses[e.currentOptions].attempt1 = o)
                : 1 == d &&
                  (e.levelGroups[e.currentLevelGroup][e.currentLevel].modes[
                    e.playMode
                  ].responses[e.currentOptions].attempt2 = o);
            }
          } else if (1 == e.allowOptionClick) {
            e.$broadcast("stopAudio"), (e.allowOptionClick = !1), (m = !1);
            var i = t,
              c = n,
              u = e.audioCallback;
            u &&
              u.callbackRef &&
              "end" == u.type &&
              (u.delay >= 0
                ? a(function () {
                    u.callbackRef.apply(u.thisRef, u.params),
                      e.optionClick(i, c);
                  }, 0)
                : (u.callbackRef.apply(u.thisRef, u.params),
                  e.optionClick(i, c)));
          }
        });
      var I = function (t, a) {
        for (var n = 0; n < e.wordlistData.length; n++)
          if ("" == e.wordlistData[n].word) {
            (e.wordlistData[n].word = e.correctOption),
              (e.wordlistData[n].attempts = t);
            break;
          }
      };
      (e.backBtnClick = function () {
        !0 !== m &&
          (e.$broadcast("stopAudio"),
          e.$broadcast("togglepopup", "back"),
          (e.pauseTimer = !0),
          AccessibilityManager.disableElements([".playScreen"]));
      }),
        e.$on("popupConfirm", function (t, a) {
          "back" == a &&
            ((e.pauseTimer = !1),
            n.cancel(e.timer),
            AccessibilityManager.enableElements([".playScreen"]),
            e.showLevelScreen()),
            "end" == a &&
              (AccessibilityManager.panelCloseHandler(),
              (m = !0),
              e.refreshAudioCallbackObj(),
              (e.audioCallback.type = "end"),
              (e.audioCallback.callbackRef = function () {
                (m = !1), e.gotoLevelScreen();
              }),
              e.$broadcast("playAudio", "click", e.audioCallback)),
            "reload" == a &&
              (e.setupLevelGroups(),
              (e.$parent.appData.data.tincan.total_score = 0),
              (e.$parent.appData.data.tincan.percentage_completion = "0%"),
              (e.$parent.appData.data.tincan.savedState = {
                screenType: 1,
                levelGroup: 1,
                level: 1,
                totalGroups: e.totalGroups,
                totalLevels: e.totalLevels,
                totalScore: 0,
                userScore: 0,
                levelGroups: e.levelGroups,
                midLevelState: null,
              }),
              e.restoreGameState());
        }),
        e.$on("popupClosed", function (t, a) {
          "back" == a &&
            AccessibilityManager.enableElements([".playScreen"], function () {
              AccessibilityManager.updateTabOrder("playScreen", function () {
                AccessibilityManager.setFocus($(".leafCover.active")[0]),
                  (e.pauseTimer = !1);
              });
            }),
            "reload" == a && e.restoreGameState();
        }),
        (e.audioBtnClick = function () {
          !0 !== m &&
            ((m = !0), e.$broadcast("stopAudio"), e.playCurrentWord());
        }),
        (e.playAslVideo = function () {
          e.myPopup = !1;
          var t = c(e.correctOption);
          e.$broadcast("playVideo", t),
            a(function () {
              AccessibilityManager.setTabGroup("aslScreenInstruction"),
                AccessibilityManager.updateTabOrder(
                  "aslScreenInstruction",
                  function () {
                    AccessibilityManager.setFocus(".popup1 .aslvideopop");
                  }
                );
            }, 200);
        }),
        (e.playAslInstructionVideo = function () {
          var t;
          (e.myPopup = !1),
            ("easy" != e.playMode && "medium" != e.playMode) ||
              (t = u("SS_info2")),
            ("challenge" != e.playMode && "challenger" != e.playMode) ||
              (t = u("SS_info3")),
            e.$broadcast("playVideo", t),
            a(function () {
              AccessibilityManager.setTabGroup("aslScreenInstruction"),
                AccessibilityManager.updateTabOrder(
                  "aslScreenInstruction",
                  function () {
                    AccessibilityManager.setFocus(".popup1 .aslvideopop");
                  }
                );
            }, 200);
        }),
        (e.playAslIntoInstructionVideo = function () {
          var t = u("SS_info1");
          e.$broadcast("playIntroInstructionVideo", t),
            a(function () {
              AccessibilityManager.setTabGroup("aslScreenInstruction"),
                AccessibilityManager.updateTabOrder(
                  "aslScreenInstruction",
                  function () {
                    AccessibilityManager.setFocus(".popup1 .aslvideopop");
                  }
                );
            }, 200);
        }),
        (e.wordaudioBtn = function (t) {
          !0 !== m &&
            (e.refreshAudioCallbackObj(),
            e.$broadcast("stopAudio"),
            (e.audioCallback.type = "end"),
            (e.audioCallback.callbackRef = function () {
              m = !1;
            }),
            e.$broadcast(
              "playAudioArray",
              [s(e.wordlistData[t].word)],
              e.audioCallback
            ));
        }),
        (e.audioBtnClick1 = function () {
          !0 !== m &&
            (e.refreshAudioCallbackObj(),
            e.$broadcast("stopAudio"),
            (m = !1),
            "challenger" == e.playMode
              ? e.$broadcast("playAudio", "timerstart1")
              : "easy" == e.playMode
              ? e.$broadcast("playAudio", "instructionmode")
              : "medium" == e.playMode &&
                e.$broadcast("playAudio", "instructionmode"));
        }),
        (e.levelCompleteHandle = function (o) {
          (e.popupOn = !0),
            n.cancel(e.timer),
            (e.correctmessageatpopup = (100 * e.levelScore) / e.wordSet.length),
            (e.levelEndTime = new Date()),
            e.updateScore();
          var l = e.languageTxt.feedbacks[e.currentLvlPoints];
          (angular.element(".popupContainer").scope().cancelTxt = l),
            $(".popupParent.end .scoreUrchin").removeClass("active"),
            AccessibilityManager.setTabGroup("popupContainer"),
            AccessibilityManager.updateTabOrder("popupContainer", function () {
              var t =
                e.languageTxt.awesomeTxt +
                " " +
                e.languageTxt.foundTxt +
                " " +
                e.levelScore +
                e.languageTxt.ofTxt +
                " " +
                s +
                e.languageTxt.wordsTxt;
              AccessibilityManager.toggleState(
                ".popupContainer .textContainer",
                t
              ),
                AccessibilityManager.setFocus(".popupContainer .textContainer");
            }),
            e.percentComplete < e.unlockThresh &&
              ((e.encouragingwords = e.languageTxt.tryagain),
              (e.BtnStatus = e.languageTxt.TryAgainBtn)),
            e.percentComplete >= e.unlockThresh &&
              ((e.dancingurchin = !0),
              (e.encouragingwords = e.languageTxt.awesomeTxt),
              (e.BtnStatus = e.languageTxt.nextLvl)),
            e.percentComplete >= e.unlockThresh &&
              "challenger" == e.playMode &&
              ((e.encouragingwords = e.languageTxt.awesomeTxt),
              (e.BtnStatus = e.languageTxt.nextLevel)),
            e.percentComplete >= e.unlockThresh &&
              e.timeLimit >= 360 &&
              "challenger" == e.playMode &&
              ((e.encouragingwords = e.languageTxt.awesomeTxt),
              (e.BtnStatus = e.languageTxt.nextLevel)),
            e.percentComplete < e.unlockThresh &&
              e.timeLimit >= 360 &&
              "challenger" == e.playMode &&
              ((e.BtnStatus = e.languageTxt.TryAgainBtn),
              (e.timeoutext = !0),
              (e.encouragingwords = e.languageTxt.outofTime));
          var r = [],
            i = e.levelScore.toString(),
            s = e.wordSet.length;
          e.wordSet.length > 10 && (s %= 20),
            (s = s.toString()),
            (r =
              e.percentComplete >= e.unlockThresh
                ? ["r1", i, "r3", s, "r2"]
                : "en" == e.language
                ? ["r7", "r4", i, "r3", s, "r2"]
                : ["r4", i, "r3", s, "r2"]),
            e.percentComplete >= e.unlockThresh &&
              e.timeLimit >= 360 &&
              "challenger" == e.playMode &&
              (r = ["r1", i, "r3", s, "r2"]),
            e.percentComplete < e.unlockThresh &&
              e.timeLimit >= 360 &&
              "challenger" == e.playMode &&
              (r =
                "en" == e.language
                  ? ["r5", "r4", i, "r3", s, "r2"]
                  : ["r5", i, "r3", s, "r2"]),
            e.$broadcast("stopAudio"),
            (e.showEndPopup = !0),
            e.refreshAudioCallbackObj(),
            (e.audioCallback.type = "end"),
            (e.audioCallback.arrIndex = r.length - 1),
            (e.audioCallback.callbackRef = function () {}),
            (e.levelGroups[e.currentLevelGroup][e.currentLevel].modes[
              e.playMode
            ].timeSpent = e.millisToMinutesAndSeconds(
              new Date(e.levelEndTime) - new Date(e.gameStartTime)
            )),
            (e.levelGroups[e.currentLevelGroup][e.currentLevel].modes[
              e.playMode
            ].date =
              e.getDateString(e.gameStartTime) +
              " " +
              e.getTimeString(e.levelEndTime)),
            a(function () {
              e.$broadcast("playAudioArray", r, e.audioCallback);
            }, 500),
            e.$emit(t.SAVE_TINCAN_DATA);
        }),
        (e.updateScore = function () {
          var t =
            e.levelGroups[e.currentLevelGroup][e.currentLevel].modes[e.playMode]
              .score;
          e.percentComplete = (100 * e.levelScore) / e.wordSet.length;
          var a = e.levelScore;
          e.percentComplete >= 70
            ? (e.levelGroups[e.currentLevelGroup][e.currentLevel].modes[
                e.playMode
              ].isPass = e.languageTxt.yesTxt)
            : (e.levelGroups[e.currentLevelGroup][e.currentLevel].modes[
                e.playMode
              ].isPass = e.languageTxt.noTxt),
            a > t &&
              ((e.levelGroups[e.currentLevelGroup][e.currentLevel].modes[
                e.playMode
              ].score = a),
              (e.userScore = e.userScore + (a - t)),
              (e.levelGroups[e.currentLevelGroup][e.currentLevel].modes[
                e.playMode
              ].wordset = g),
              (e.levelGroups[e.currentLevelGroup][e.currentLevel].modes[
                e.playMode
              ].incorrectWords = h),
              (e.levelGroups[e.currentLevelGroup][e.currentLevel].modes[
                e.playMode
              ].correctWords = f)),
            (e.levelGroups[e.currentLevelGroup][e.currentLevel].modes[
              e.playMode
            ].percentComplete = e.percentComplete + "%");
        }),
        (e.gotoLevelScreen = function () {
          L = [];
          var t = "none",
            a = !1;
          (e.levelGroups[e.currentLevelGroup][e.currentLevel].modes[
            e.playMode
          ].attempt = !0),
            e.percentComplete >= e.unlockThresh &&
              (e.levelGroups[e.currentLevelGroup][e.currentLevel].modes[
                e.playMode
              ].complete = !0);
          if (
            ("easy" != e.playMode ||
              e.levelGroups[e.currentLevelGroup][e.currentLevel].modes.medium
                .active ||
              (e.percentComplete >= e.unlockThresh
                ? ((e.levelGroups[e.currentLevelGroup][
                    e.currentLevel
                  ].modes.medium.active = !0),
                  (e.totalScore = e.totalScore + e.scorePoints.length),
                  ["unlock", "lvlUnlock"],
                  (t = "node"))
                : (a = !0)),
            "medium" != e.playMode ||
              e.levelGroups[e.currentLevelGroup][e.currentLevel].modes
                .challenger.active ||
              (e.percentComplete >= e.unlockThresh
                ? ((e.levelGroups[e.currentLevelGroup][
                    e.currentLevel
                  ].modes.challenger.active = !0),
                  (e.totalScore = e.totalScore + e.scorePoints.length),
                  ["unlock", "lvlUnlock"],
                  (t = "node"))
                : (a = !0)),
            "challenger" == e.playMode &&
              (e.currentLevel < e.levelGroups[e.currentLevelGroup].length - 1 &&
              !e.levelGroups[e.currentLevelGroup][e.currentLevel + 1].modes.easy
                .active
                ? e.percentComplete >= e.unlockThresh
                  ? ((e.levelGroups[e.currentLevelGroup][
                      e.currentLevel + 1
                    ].modes.easy.active = !0),
                    (e.totalScore = e.totalScore + 3 * e.scorePoints.length),
                    ["unlock", "lvlUnlock"],
                    (t = "level"),
                    e.zoomedLevel++)
                  : (a = !0)
                : e.currentLevel >=
                    e.levelGroups[e.currentLevelGroup].length - 1 &&
                  e.currentLevelGroup < e.totalGroups &&
                  !e.levelGroups[e.currentLevelGroup + 1][0].modes.easy
                    .active &&
                  (e.percentComplete >= e.unlockThresh
                    ? ((e.levelGroups[
                        e.currentLevelGroup + 1
                      ][0].modes.easy.active = !0),
                      (e.totalScore = e.totalScore + 3 * e.scorePoints.length),
                      ["unlock", "lvlUnlock"],
                      (t = "level"))
                    : (a = !0))),
            "challenger" == e.playMode)
          )
            if ("level" == t)
              switch (e.currentLvlPoints) {
                case 1:
                case 2:
                  L.push("chlg2");
                  break;
                case 3:
                  L.push("chlg3");
              }
            else 1 == a ? L.push("chlg1") : L.push("letsgo");
          else
            switch (e.currentLvlPoints) {
              case 0:
                L.push("letsgo");
                break;
              case 1:
                L.push("awesome", "letsgo");
                break;
              case 2:
                L.push("fantastic", "letsgo");
                break;
              case 3:
                L.push("greatgoing", "choosechlg");
            }
          0 == e.replaygame && (e.screenType = 2);
        }),
        (e.levelPageNav = function (t, a) {
          if (!angular.element(t.currentTarget).hasClass("disable")) {
            switch (a) {
              case 1:
                e.currentLevelGroup = e.currentLevelGroup - 1;
                break;
              case 2:
                e.currentLevelGroup = e.currentLevelGroup + 1;
            }
            AccessibilityManager.updateTabOrder("levelScreen", function () {
              AccessibilityManager.setFocus($(".levelMode")[0]);
            });
          }
        }),
        e.$on("audioStarted", function (t, n, o) {
          (w = n),
            (A = "find" == n || "correctans" == n ? e.correctOption : ""),
            e.ccOn && e.$broadcast("showCaption", n, A),
            o &&
              o.callbackRef &&
              "start" == o.type &&
              (o.delay >= 0
                ? a(function () {
                    o.callbackRef.apply(o.thisRef, o.params);
                  }, o.delay)
                : o.callbackRef.apply(o.thisRef, o.params));
        }),
        e.$on("audioEnd", function (t, n, o) {
          (w = ""), (A = "");
          var l = 0;
          switch (n) {
            case "find":
            case "correctans":
            case "correct":
            case "incorrect":
              l = 500;
          }
          e.$broadcast("hideCaption", n, l),
            o &&
              o.callbackRef &&
              "end" == o.type &&
              (o.delay >= 0
                ? a(function () {
                    o.callbackRef.apply(o.thisRef, o.params);
                  }, o.delay)
                : o.callbackRef.apply(o.thisRef, o.params));
        }),
        (e.ccBtnClick = function () {
          (e.ccOn = !e.ccOn),
            e.ccOn
              ? e.$broadcast("showCaption", w, A)
              : e.$broadcast("hideCaption", w);
        }),
        (e.hoverLeafHandler = function (e, t) {
          if (!l.isDevice())
            switch (t) {
              case 1:
                $(e.currentTarget).find(".leafCreature").addClass("hoverAnim");
                break;
              case 0:
                $(e.currentTarget)
                  .find(".leafCreature")
                  .removeClass("hoverAnim");
            }
        }),
        (e.gameParentClick = function (t) {
          $(t.target).hasClass("gameInfoContainer") ||
            $(t.target).hasClass("infoAudio") ||
            $(t.target).hasClass("infoTxt") ||
            $(t.target).hasClass("gameInfoBtn") ||
            (1 == e.showLevelInfo && e.closeLevelInfo());
        }),
        e.$on("saveViewTincanData", function () {
          TincanManager.updateTincanData(
            e.$parent.appData.data.tincan,
            "total_score",
            y
          ),
            TincanManager.updateTincanData(
              e.$parent.appData.data.tincan,
              "restoreGame",
              !0
            ),
            e.saveGameState();
        }),
        (e.reportHeadClick = function (t) {
          1 == t && (e.showOverall = !0),
            2 == t &&
              ((e.showOverall = !1),
              setTimeout(function () {
                $($(".reportHeading")[1]).focus();
              }, 300));
        }),
        (e.generateReport = function () {
          e.$emit(t.SAVE_TINCAN_DATA),
            void 0 != e.$parent.appData.data.tincan.userDetails &&
              (e.userName = e.$parent.appData.data.tincan.userDetails.userId);
          var a = [],
            n = [];
          (e.reportLevels = []),
            (e.currentReportLevel = 0),
            (e.showOverall = !0),
            (e.reportTableHeading = [
              e.languageTxt.island.toUpperCase(),
              e.languageTxt.levelTxt.toUpperCase(),
              e.languageTxt.timeSpent.toUpperCase(),
              e.languageTxt.percentCorrect.toUpperCase(),
              e.languageTxt.targetWord.toUpperCase(),
              e.languageTxt.ans1.toUpperCase(),
              e.languageTxt.ans2.toUpperCase(),
            ]),
            angular.forEach(e.levelGroups, function (t) {
              angular.forEach(t, function (t) {
                var o = null;
                angular.forEach(t.modes, function (e, l) {
                  e.active &&
                    (!o &&
                      e.wordset &&
                      e.wordset.length > 0 &&
                      (o = {
                        number: t.level,
                        words: e.wordset,
                        correct: [],
                        levelRef: t,
                      }),
                    angular.forEach(e.wordset, function (t) {
                      a.indexOf(t) < 0 && a.push(t),
                        e.correctWords &&
                          e.correctWords.indexOf(t) >= 0 &&
                          (n.indexOf(t) < 0 && n.push(t),
                          o.correct.indexOf(t) < 0 && o.correct.push(t));
                    }));
                }),
                  o && e.reportLevels.push(o);
              });
            }),
            e.reportLevels.length > 3
              ? $(".reportDataTable .gameReportContent").css(
                  "width",
                  "calc(100% + 17px)"
                )
              : $(".reportDataTable .gameReportContent").css("width", "100%");
          var o = e.$parent.appData.data.tincan.time_in_units;
          (e.totalTime = TincanManager.getTimeInWords(o)),
            (e.totalWordsAttempted = a.length),
            (e.correctWordsAnswered = n.length),
            void 0 == e.reportLevels ||
            null == e.reportLevels ||
            0 == e.reportLevels.length
              ? (e.blankReport = !0)
              : e.reportLevels[0].levelRef.modes.easy.score > 0 ||
                e.reportLevels[0].levelRef.modes.challenger.score > 0 ||
                e.reportLevels[0].levelRef.modes.medium.score > 0
              ? (e.showReport = !0)
              : (e.blankReport = !0);
        }),
        (e.downloadReport = function (t) {
          var a = e.reportLevels,
            n = "",
            o = e.languageTxt.wordIsland,
            l = e.languageTxt.passingTxt + e.unlockThresh + "%";
          if (void 0 != e.$parent.appData.data.tincan.userDetails)
            var r = (e.userName =
              e.$parent.appData.data.tincan.userDetails.userId);
          n += o + "\r\n" + l + "\r\n" + r + "\r\n\n";
          for (
            var i = [
                e.languageTxt.islandName,
                e.languageTxt.levelTxt,
                e.languageTxt.dateNtime,
                e.languageTxt.comNPass,
                e.languageTxt.timeSpentLevel,
                e.languageTxt.percentComplete,
                e.languageTxt.gradeLvl,
                e.languageTxt.targetWord,
                e.languageTxt.attempt1,
                e.languageTxt.attempt2,
              ],
              s = "",
              c = 0;
            c < i.length;
            ++c
          )
            s += i[c] + ",";
          (s = s.slice(0, -1)), (n += s + "\r\n");
          for (var u = 0; u < a.length; u++)
            for (
              var p = a[u].levelRef, d = Object.keys(p.modes), v = 0;
              v < d.length;
              ++v
            )
              for (var m = p.modes[d[v]], g = 0; g < m.responses.length; ++g) {
                var s = "";
                p.level <= 10
                  ? (p.grade = "K")
                  : p.level >= 11 && p.level <= 25
                  ? (p.grade = "1")
                  : p.grade >= 26 && p.level <= 35
                  ? (p.grade = "2")
                  : (p.grade = "3"),
                  0 == g
                    ? ((s =
                        s +
                        p.name +
                        "," +
                        m.modelabels +
                        "," +
                        m.date +
                        "," +
                        m.isPass +
                        "," +
                        m.timeSpent +
                        "," +
                        m.percentComplete +
                        ", , , , ,"),
                      (s =
                        s +
                        "\r\n" +
                        p.name +
                        "," +
                        m.modelabels +
                        ", , , , ," +
                        p.grade +
                        "," +
                        m.responses[g].target +
                        "," +
                        m.responses[g].attempt1 +
                        "," +
                        m.responses[g].attempt2 +
                        ","))
                    : (s =
                        s +
                        p.name +
                        "," +
                        m.modelabels +
                        ", , , , ," +
                        p.grade +
                        "," +
                        m.responses[g].target +
                        "," +
                        m.responses[g].attempt1 +
                        "," +
                        m.responses[g].attempt2 +
                        ","),
                  m.correctWords &&
                  m.correctWords.indexOf(m.responses[g].target) >= 0
                    ? (s += "Correct")
                    : (s += "Incorrect"),
                  s.slice(0, s.length - 1),
                  (n += s + "\r\n"),
                  g == m.responses.length - 1 &&
                    ((s = " , , , , , , , , , ,"), (n += s + "\r\n"));
              }
          if ("" == n) return void alert("Invalid data");
          var f = "MyReport_";
          (f += o.replace(/ /g, "_")), (f += ".xlsx"), e.createXLS(n, f);
        }),
        (e.createXLS = function (e, t) {
          console.log("csv", e);
          var a = e.split("\n"),
            n = $JExcel.new("Calibri 10 #000000");
          n.set({ sheet: 0, value: "Report" }), n.addSheet("Sheet 2");
          for (
            var o = n.addStyle({
                font: "Calibri 14 #000000 B",
                align: "C C",
                fill: "#F0F0F0",
              }),
              l = n.addStyle({
                font: "Calibri 14 #000000 B",
                align: "C C",
                fill: "#F0F0F0",
              }),
              r = n.addStyle({
                font: "Calibri 20 #000000 B",
                align: "C C",
                fill: "#F0F0F0",
              }),
              i = a[4].split(","),
              s = n.addStyle({
                border: "thin,thin,thin,thin #333333",
                font: "Calibri 12 #000000 B",
                fill: "#F0F0F0",
                align: "L L",
              }),
              c = 0;
            c < i.length;
            c++
          )
            n.set(0, c, 3, i[c].trim(), s),
              n.set(0, c, void 0, "auto"),
              c < i.length - 2
                ? n.set(0, c, void 0, 22)
                : n.set(0, c, void 0, 37),
              n.set(0, c, 0, "", o),
              n.set(0, c, 1, "", l),
              n.set(0, c, 2, "", r);
          n.set(0, 0, 0, a[0].trim(), o),
            n.set(0, 0, 1, a[1].trim(), l),
            n.set(0, 0, 2, a[2].trim(), r);
          for (
            var u =
                (n.addStyle({ border: "thin,none,none,none #333333" }),
                n.addStyle({ border: "none,thin,none,none #333333" }),
                n.addStyle({
                  border: "none,none,thin,none #333333",
                  fill: "#F0F0F0",
                }),
                n.addStyle({
                  border: "none,none,none,thin #333333",
                  fill: "#F0F0F0",
                }),
                n.addStyle({
                  border: "thin,thin,thin,thin #333333",
                  align: "L L",
                })),
              p =
                (n.addStyle({
                  border: "thin,thin,thin,thin #333333",
                  fill: "#FAFAD2",
                  align: "L L",
                }),
                n.addStyle({
                  border: "thin,thin,thin,thin #333333",
                  fill: "#B3F39E",
                  align: "L L",
                })),
              d = n.addStyle({
                border: "thin,thin,thin,thin #333333",
                fill: "#F79898",
                align: "L L",
              }),
              v = n.addStyle({
                border: "thin,thin,thin,thin #ffffff",
                fill: "#3d3d3d",
                font: "Calibri 10 #ffffff B",
                align: "L L",
              }),
              m = n.addStyle({ fill: "#a09898" }),
              c = 5;
            c < a.length;
            c++
          ) {
            var g = a[c].split(","),
              f = !1,
              h = !1,
              b = c - 5 + 1;
            if (
              ((b - 1) % 12 == 0 && (f = !0),
              b % 12 == 0 && (h = !0),
              g.length >= i.length)
            )
              for (var y = 0; y < i.length; y++)
                n.set(0, y, c - 1, g[y].trim(), u),
                  g[y] &&
                    y >= i.length - 2 &&
                    (g[y].trim().toLowerCase() ==
                      g[i.length - 3].trim().toLowerCase() &&
                    " " != g[i.length - 3].trim().toLowerCase()
                      ? n.set(0, y, c - 1, g[y].trim(), p)
                      : "-" !== g[y].trim().toLowerCase() &&
                        n.set(0, y, c - 1, g[y].trim(), d)),
                  1 == f && n.set(0, y, c - 1, g[y].trim(), v),
                  1 == h && n.set(0, y, c - 1, g[y].trim(), m);
          }
          n.generate(t);
        }),
        (e.closeReport = function () {
          (e.showReport = !1),
            AccessibilityManager.setFocus(".levelScreen .reportBtn");
        }),
        (e.closeBlankReport = function () {
          (e.blankReport = !1),
            AccessibilityManager.setFocus(".levelScreen .reportBtn");
        }),
        (e.changeReportLevel = function (t, a) {
          switch (a) {
            case 1:
              e.currentReportLevel =
                e.currentReportLevel + 1 < e.reportLevels.length
                  ? e.currentReportLevel + 1
                  : e.currentReportLevel;
              break;
            case 0:
              e.currentReportLevel =
                e.currentReportLevel - 1 >= 0 ? e.currentReportLevel - 1 : 0;
          }
        }),
        (e.toggleLevelInfo = function () {
          e.$broadcast("stopAudio"),
            (e.screenOverlay = !0),
            (e.showInstBtn = !1),
            ("levelinfo" != w && 1 == m) ||
              (e.showLevelInfo && e.closeLevelInfo(), (e.showLevelInfo = !0));
        }),
        (e.closeInstructionPopup = function () {
          (e.screenOverlay = !1),
            (e.showInstBtn = !0),
            e.$broadcast("stopAudio");
        }),
        (e.levelInfoAudio = function () {
          e.refreshAudioCallbackObj(),
            e.$broadcast("playAudio", "letsgo", null);
        }),
        AccessibilityManager.registerActionHandler(
          "closeLevelInfo",
          "",
          "",
          function () {
            e.closeLevelInfo();
          }
        ),
        (e.closeLevelInfo = function () {
          (e.showLevelInfo = !1),
            (e.levelInfoAudioActive = !1),
            "levelinfo" == w && e.$broadcast("stopAudio"),
            (m = !1);
        }),
        (e.refreshAudioCallbackObj = function () {
          e.audioCallback = {
            thisRef: e,
            params: [],
            type: "end",
            delay: -1,
            arrIndex: -1,
            callbackRef: null,
          };
        }),
        (e.processRawDB = function () {
          var t = e.$parent.appData.data.rawDB;
          if (!t)
            return (
              console.log("DB file not not found. Game will use backup DB"),
              void (e.$parent.appData.data.dataset =
                e.$parent.appData.data.dataset_bk)
            );
          var a = [];
          angular.forEach(t, function (e) {
            var t = e.Words.split(", ");
            a = a.concat(t);
          });
          var n = Math.floor(a.length / 40),
            o = 10 - n,
            l = a.length - 40 * n,
            r = a.slice(-l),
            i = {};
          i[e.$parent.appData.language] = {};
          for (var s = 1; s <= 40; ++s) {
            i[e.$parent.appData.language][s] = [];
            for (var c = [], u = [], p = 1; p <= 10; ++p) {
              var d = [];
              if (p <= n) {
                var v = n * (s - 1) + (p - 1);
                d.push(a[v]);
              } else
                d.push(
                  (function (e, t) {
                    for (var a = t.slice(), n = "", o = 0; o <= 1; ) {
                      var l = Math.floor(Math.random() * a.length),
                        r = a.splice(l, 1);
                      e.indexOf(r[0]) < 0 && ((n = r[0]), o++);
                    }
                    return n;
                  })(c, u)
                );
              c.push(d[0]),
                1 == p &&
                  (u = (function (e) {
                    for (
                      var t = a.indexOf(e),
                        n = 2 * Math.floor(0.15 * a.length),
                        o = [],
                        l = t - 1,
                        r = 0,
                        i = 0;
                      i <= n / 2 && l > 0;

                    )
                      o.push(a[l--]), i++;
                    for (
                      r = n - i, i = 0, l = t + 1;
                      i <= r && l < a.length - 1;

                    )
                      o.push(a[l++]), i++;
                    return o;
                  })(c[0]));
              for (var m = 1; m <= 4; ) {
                var g = Math.floor(Math.random() * u.length),
                  f = u.splice(g, 1);
                d.indexOf(f[0]) < 0 && (d.push(f[0]), m++);
              }
              i[e.$parent.appData.language][s].push(d);
            }
          }
          for (var h = 40, s = l - 1; s >= 0; ) {
            for (var m = 0; m < o; ++m)
              s >= 0 && (i[e.$parent.appData.language][h][n + m][0] = r[s--]);
            h--;
          }
          e.$parent.appData.data.dataset[e.$parent.appData.language] =
            i[e.$parent.appData.language];
        }),
        (e.createLevelNodePosData = function () {
          for (var t in e.levelGroups) {
            var a = e.$parent.appData.screentype2;
            "1" == t && (a = e.$parent.appData.screentype1),
              "9" == t && (a = e.$parent.appData.screentype3),
              angular.forEach(e.levelGroups[t], function (t, n) {
                (e.$parent.appData.levelData[t.level].labelPos.bottom =
                  a[5 * n].bottom),
                  (e.$parent.appData.levelData[t.level].labelPos.top =
                    "initial"),
                  (e.$parent.appData.levelData[t.level].labelPos.left =
                    a[5 * n].left),
                  (e.$parent.appData.levelData[t.level].modes.easy.pos.bottom =
                    a[5 * n + 1].bottom),
                  (e.$parent.appData.levelData[t.level].modes.easy.pos.top =
                    "initial"),
                  (e.$parent.appData.levelData[t.level].modes.easy.pos.left =
                    a[5 * n + 1].left),
                  (e.$parent.appData.levelData[
                    t.level
                  ].modes.medium.pos.bottom = a[5 * n + 2].bottom),
                  (e.$parent.appData.levelData[t.level].modes.medium.pos.top =
                    "initial"),
                  (e.$parent.appData.levelData[t.level].modes.medium.pos.left =
                    a[5 * n + 2].left),
                  (e.$parent.appData.levelData[
                    t.level
                  ].modes.challenger.pos.bottom = a[5 * n + 3].bottom),
                  (e.$parent.appData.levelData[
                    t.level
                  ].modes.challenger.pos.top = "initial"),
                  (e.$parent.appData.levelData[
                    t.level
                  ].modes.challenger.pos.left = a[5 * n + 3].left),
                  e.$parent.appData.levelData[t.level].island &&
                    a[5 * n + 4] &&
                    ((e.$parent.appData.levelData[t.level].island.bottom =
                      a[5 * n + 4].bottom),
                    (e.$parent.appData.levelData[t.level].island.top =
                      "initial"),
                    (e.$parent.appData.levelData[t.level].island.left =
                      a[5 * n + 4].left),
                    (e.$parent.appData.levelData[t.level].island.height =
                      a[5 * n + 4].height),
                    (e.$parent.appData.levelData[t.level].island.width =
                      a[5 * n + 4].width));
              });
          }
          console.log(
            "-------------------- COPY THIS IN CONFIG JSON ------------------"
          );
        }),
        (e.enableDevDesign = function () {
          $(".devDesign").each(function (e, t) {
            $(t).css("height", $(t).height() + "px");
          }),
            $(".devDesign").draggable(),
            $(".devDesign.devResize").resizable(),
            $(".devDesign")
              .off("click")
              .on("click", function () {
                return !1;
              });
        }),
        (e.generateJson = function () {
          var e = [];
          $(".devDesign").each(function (t, a) {
            var n = $(".fixedNodeContainer").height(),
              o = {
                name: a.className + " " + t,
                top: a.style.top,
                left: a.style.left,
                bottom: n - (parseInt($(a).css("top")) + $(a).height()) + "px",
              };
            if (a.className.indexOf("levelMode") >= 0) {
              var l = $(a).height(),
                r = 0.6 * $(a).height(),
                i = l - r;
              o.bottom = n - i - (parseInt($(a).css("top")) + r) + "px";
            }
            a.className.indexOf("devResize") >= 0 &&
              ((o.height = $(a).css("height")), (o.width = $(a).css("width"))),
              e.push(o);
          }),
            console.log("Copy JSON in config - ", e);
        }),
        (e.getDateString = function (e) {
          e = new Date(e);
          var t = e.getDate(),
            a = e.getMonth() + 1,
            n = e.getFullYear();
          return (
            t < 10 && (t = "0" + t),
            a < 10 && (a = "0" + a),
            a + "/" + t + "/" + n
          );
        }),
        (e.getTimeString = function (e) {
          e = new Date(e);
          var t = e.getHours(),
            a = e.getMinutes(),
            n = t >= 12 ? "pm" : "am";
          return (
            (t %= 12),
            (t = t || 12),
            (a = a < 10 ? "0" + a : a),
            t + ":" + a + " " + n
          );
        }),
        (e.millisToMinutesAndSeconds = function (t) {
          t = new Date(t);
          var a = Math.floor(t / 6e4),
            n = ((t % 6e4) / 1e3).toFixed(0);
          return (
            (a < 10 ? "0" : "") +
            a +
            " min " +
            n +
            " " +
            e.languageTxt.secondTxt
          );
        });
    },
  ]),
  myView.filter("unsafe", function () {
    return function (e) {
      var t = {
        "sï¿½laba": "sílaba",
        "acentuaciï¿½n": "acentuación",
        "estï¿½bamos": "estábamos",
        "ï¿½ltimo": "último",
        "adiï¿½s": "adiós",
        "ahï¿½": "ahí",
        "seï¿½al": "señal",
        "plï¿½tano": "plátano",
        "frï¿½o": "frío",
        "guï¿½a": "guía",
        "ï¿½rbol": "árbol",
        "aquï¿½": "aquí",
        "niï¿½o": "niño",
        "adï¿½nde": "adónde",
        "estaciï¿½n": "estación",
        "miï¿½rcoles": "miércoles",
        "botï¿½n": "botón",
        "sï¿½bado": "sábado",
        "al revï¿½s": "al revés",
        "pequeï¿½a": "pequeña",
        "quizï¿½s": "quizás",
        "canciï¿½n": "canción",
        "escribï¿½": "escribí",
        "dï¿½nde": "dónde",
        "despuï¿½s": "después",
        "saliï¿½": "salió",
        "habï¿½a": "había",
        "querï¿½a": "quería",
        "decï¿½an": "decían",
        "asï¿½": "así",
        "cuï¿½ndo": "cuándo",
        "sï¿½": "sí",
        "tambiï¿½n": "también",
        "quï¿½": "qué",
        "detrï¿½s": "detrás",
        "tï¿½": "tú",
        "dï¿½a": "día",
        "cï¿½mo": "cómo",
        "estï¿½": "está",
        "niï¿½a": "niña",
        "rï¿½o": "río",
        "dï¿½": "dé",
        "allï¿½": "allí",
        "llamï¿½": "llamó",
        "luchï¿½": "luchó",
        "naciï¿½n": "nación",
        "seï¿½or": "señor",
        "alimentaciï¿½n": "alimentación",
        "antigï¿½edad": "antigüedad",
        "sï¿½": "sé",
        "telï¿½fono": "teléfono",
        "acciï¿½n": "acción",
        "llegï¿½": "llegó",
        "mï¿½s": "más",
        "quiï¿½n": "quién",
        "papï¿½": "papá",
        "mamï¿½": "mamá",
        "Isla del Camarï¿½n": "Isla del Camarón",
        "Isla del Delfï¿½n": "Isla del Delfín",
        "Isla del Mejillï¿½n": "Isla del Mejillón",
        "Isla del Manatï¿½": "Isla del Manatí",
        "Isla del Pez Leï¿½n": "Isla del Pez León",
        "Isla del Esturiï¿½n": "Isla del Esturión",
        "Isla del Pez ï¿½ngel": "Isla del Pez Ángel",
        "Isla del Dragï¿½n Marino": "Isla del Dragón Marino",
      };
      return e in t ? t[e] : e;
    };
  }),
  myView.directive("viewDirective", function () {
    return {
      retrict: "E",
      replace: !0,
      scope: !0,
      controller: "viewCtrl",
      templateUrl: "templates/view.html",
      link: function (e, t, a) {},
    };
  });
