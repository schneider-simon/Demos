zwei14.waypoints = {
    init: function(){
        this.navigation();
        this.deerBackground();
        this.sections();
        this.greetings();
    },
    navigation: function(){
        this.add({
            listenTo: 'section.header',
            element: '.page-topNavigation',
            offset: '-10%'
        });
    },
    deerBackground: function(){
        this.add({
            listenTo: 'section.header',
            element: '.deer-background',
            offset: '-15%'
        });
    },
    sections: function(){
        var $sections = $('section');
        $sections.first().addClass('active');

        $sections.waypoint({
            handler: function (direction) {
                var $activeSection;

                if (direction == "down") {
                    //reached bottom of one section
                    $activeSection = $(this.element);

                } else {
                    var $prevSection = $(this.element).prev();
                    if($prevSection.length == 0 || $prevSection.attr('id') == "undefined"){
                        $prevSection = $sections.first()
                    }

                    $activeSection = $prevSection;

                }

                if ($sections.first().attr('id') != $activeSection.attr('id'))
                    $('body').addClass('firstSectionPassed');
                else
                    $('body').removeClass('firstSectionPassed');

                $('a').removeClass('activeSection');
                $('a[href=#' + $activeSection.attr('id') + ']').addClass('activeSection');

                $sections.removeClass('active');
                $activeSection.addClass('active');
            },
            offset: '-0%'
        });
    },
    greetings: function(){
        var $portraits = $('.portrait-image');

        $portraits.waypoint({
            handler: function (direction) {
                if(direction != "down") return;
                console.log('40%');
                activatePerson($(this.element));
            },
            offset: '40%'
        });

        $portraits.waypoint({
            handler: function (direction) {
                if(direction != "up") return;
                console.log('-60%');

                activatePerson($(this.element));
            },
            offset: '-60%'
        });

        function activatePerson($activePortrait){
            var activeName = $activePortrait.attr('data-person');

            var inEffect = 'flipInY';
            var outEffect = 'fadeOut';

            $('.person-texts>div.active').removeClass('active animated ' + inEffect).addClass('animated ' + outEffect);
            $('.person-texts>div.' + activeName + '-text').removeClass(outEffect).addClass('active animated ' + inEffect);
        }
    },
    add: function(options){
        var $listenTo = $(options.listenTo);
        var $element = $(options.element);
        var cssClass = (typeof(options.css) !== "undefined")? options.css : "scrolled";
        var offset = (typeof(options.offset) !== "undefined")? options.offset : "0%";

        $listenTo.waypoint({
            handler: function (direction) {
                if (direction == "down") {
                    $element.addClass(cssClass);
                } else {
                    $element.removeClass(cssClass);
                }
            },
            offset: offset
        });

    }
};
