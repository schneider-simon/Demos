zwei14.mobileMenu = {
    vars: {
        links: [],
        poppedUp: false,
        cssBeforePopup: {}
    },
    settings: {},
    $container: null,
    $inner: null,
    $desktopNavigation: null,
    defaults: {
        navigationContainer: '#mobile-menu',
        desktopNavigation: '#sites-navigation',
        popup: {
            padding: 20,
            height: 200
        },
        canpopup: false
    },
    init: function (options) {
        this.settings = this.defaults;
        this.settings = $.extend({}, this.defaults, options);

        this.$container = $(this.settings.navigationContainer);
        this.$desktopNavigation = $(this.settings.desktopNavigation);

        this.$container.addClass('zwei14-mobilemenu');

        this.$inner = $('<div class="inner"></div>').appendTo(this.$container);

        this.getLinks();
        this.fillContainer();
        this.setTriggers();
    },
    getLinks: function(){
        var base = this;

        this.$desktopNavigation.find('a').each(function(i,  item){
            var $link = $(item);
            base.vars.links.push({
                href: $link.attr('href'),
                title: $link.text(),
                icon: $link.attr('data-icon'),
                isActive: base.isActiveUrl($link.attr('href'))
            });
        });
    },
    fillContainer: function(){
        $ul = $('<ul class="zwei14-mobilemenu-links list-inline list-unstyled"></ul>');
        for(var i in this.vars.links){
            var link = this.vars.links[i];

            var $link = $('<a></a>');
            $link.html('<span>' + link.title + '</span>');
            $link.attr('href', link.href);

            if(link.isActive){
                $link.addClass('active');
            }

            var $li = $('<li></li>');
            var $icon = $('<i class="icon-' + link.icon +'"></i>');

            $link.prepend($icon);
            $li.append($link);

            $li.appendTo($ul);
        }

        $ul.appendTo(this.$inner);

        this.$container.prepend('<div id="zwei14-mobilemenu-overlay"></div>');
    },
    isActiveUrl: function(url){
        var pgurl = window.location.href.substr(window.location.href.lastIndexOf("/")+1);

        return url == pgurl;
    },
    setTriggers: function(){
        var base = this;
        this.$container.on('click', 'a', function(e){
            if(base.vars.poppedUp || !base.settings.canpopup) return true;

            e.preventDefault();
            base.popup();
        });

        this.$container.on('click', '#zwei14-mobilemenu-overlay', function(e){
            e.preventDefault();
            base.closePopup();
        });
    },
    popup: function(){
        $('body').addClass('zwei14-mobile-menu-poppedup');
        this.vars.poppedUp = true;

        var viewWidth = $( window ).width();
        var viewHeight = $( window ).height();

        var padding = this.settings.popup.padding;
        var popupWidth = viewWidth - 2 * this.settings.popup.padding;
        var popupHeight = this.settings.popup.height;

        this.vars.cssBeforePopup = {
            width: this.$inner.width(),
            height: this.$inner.height(),
            left: this.$inner.offset().left,
            top: this.$inner.offset().top
        };

        console.log('before css', this.vars.cssBeforePopup);

        var css = {
            width: popupWidth,
            height: popupHeight,
            left: padding,
            top: (viewHeight / 2) - (popupHeight / 2)
        };


        this.$container.addClass('poppedup');
        this.$inner.animate(css, 5000);




    },
    closePopup: function(){
        $('body').removeClass('zwei14-mobile-menu-poppedup');

        var base = this;

        base.$container.removeClass('poppedup');
        base.$container.addClass('popdown');
        this.$inner.animate(this.vars.cssBeforePopup, 5000);
        this.$inner.css({
            position: 'fixed'
        })

        this.vars.poppedUp = false;
    }
};