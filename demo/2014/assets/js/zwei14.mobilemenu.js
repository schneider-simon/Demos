zwei14.mobileMenu = {
    vars: {
        links: []
    },
    settings: {},
    $container: null,
    $desktopNavigation: null,
    defaults: {
        navigationContainer: '#mobile-menu',
        desktopNavigation: '#sites-navigation'
    },
    init: function (options) {
        this.settings = this.defaults;
        this.settings = $.extend({}, this.defaults, options);

        this.$container = $(this.settings.navigationContainer);
        this.$desktopNavigation = $(this.settings.desktopNavigation);


        this.getLinks();
        this.fillContainer();
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

        $ul.appendTo(this.$container);

    },
    isActiveUrl: function(url){
        var pgurl = window.location.href.substr(window.location.href.lastIndexOf("/")+1);

        return url == pgurl;
    }

};