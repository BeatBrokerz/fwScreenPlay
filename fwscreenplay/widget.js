flexloader.extendApp(function ($, App, config) {

    App.addWidget('fwscreenplay', {

        html: function (template, settings) {
            return '\
            <div data-bind="visible: music.nowplaying().nid > 0" style="display:none">\
              <div class="fw-screenplay-content">\
                <img class="fw-beat-image" data-bind="click: music.showLicenseOptions"/>\
                <div class="fw-screenplay-info csstransition">\
                  <div data-bind="visible: app.settings.bootmode != \'disabled\'" class="fw-fullscreen-tr"><i data-bind="click: app.fullScreen" class="fwicon-resize-full"></i></div>\
                  <div class="fw-heading"><i class="fwicon-music"></i> Now Playing</div>\
                  <div class="fw-beat-title" data-bind="html: nowplaying().title"></div>\
                  <div class="fw-beat-artist" data-bind="html: nowplaying().artist"></div>\
                  <div class="fw-beat-genres" data-bind="html: nowplaying().genres"></div>\
                  <div class="fw-beat-description" data-bind="html: nowplaying().description"></div>\
                  <div class="fw-license-options" data-bind="click: music.showLicenseOptions"><i class="fwicon-tag"></i> <span data-bind="html: nowplaying().licensing.options.length"></span> License<span data-bind="if: nowplaying().licensing.options.length != 1">s</span> Available For Purchase</div>\
                  <div data-bbflex="widget: \'playbar\', width: 370, fullscreen: false"></div>\
                </div>\
              </div>\
            </div>\
            ';
        },
        init: function (template, widget, settings) {

            var image = widget.find('.fw-beat-image');
            image.attr('src', App.Music.nowplaying().image);

            widget.hover(function () {
                $(this).addClass('hovering');
            }, function () {
                $(this).removeClass('hovering');
            });

            App.on('bbflex-nowplaying', function (media) {

                if (widget.hasClass('hovering')) {
                    image.animate({ opacity: 0, left: -400 }, function () {
                        image.removeClass('csstransition').attr('src', media.image);
                        image.css({ left: 400 }).animate({ left: 0, opacity: 1 }, function () {
                            image.addClass('csstransition');
                        });
                    });
                }
                else {
                    image.removeClass('csstransition').css({ opacity: 0, left: 400, width: 500 });
                    image.attr('src', media.image);
                    image.animate({ left: 0, opacity: 1, width: 100 }, function () {
                        image.css({ width: '' }).addClass('csstransition');
                    });
                }

            });

        }

    });

    /**
     * Autoload Handler
     *
     * Our autoload handling is placed after addWidget() for good reason. We want to ensure the widget is added
     * right away because of our 'autodeploy' option that will add the widget into the DOM and then display it
     * automatically.
     *
     * Also, we separate the task into two parts since we want to put the placeholder into the DOM right
     * away, but we dont want to actually load the widget until the app data is ready, so we use the
     * App.ready() method to delay the actual rendering of the widget.
     *
     * Note: if this handling block was placed before the addWidget() method, things would still work fine if
     * doing the autoload during page boot (because of our App.ready() technique). The problem surfaces when
     * we try to autoload this widget after the page has loaded (and therefore the app is already ready!).
     *
     */
    if (config.autoload) {
        flexloader.addResource({ src: config.script.basepath + "widget.css" });
        flexloader.addResource({
            missing: function () {
                return typeof jQuery === 'undefined' || typeof jQuery.path === 'undefined';
            },
            src: "//www.beatbrokerz.com/flex/js/jquery.path.js"
        });
        if (config.options && config.options.autodeploy) {
            $('body').append('<div id="fwscreenplay-auto">');
            App.ready(function() {
                $('#fwscreenplay-auto').bbflex({ widget: 'fwscreenplay' });
            });
        }
    }

});
