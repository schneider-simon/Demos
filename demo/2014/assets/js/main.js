if(!zwei14) var zwei14 = {};

zwei14.initialized = false;

jQuery(document).ready(function ($) {
    zwei14.init();


    $( window ).resize(function() {
        zwei14.onResize();
    });


    //Smooth anchor scrolling
    $('a').click(function(){
        $('html, body').animate({
            scrollTop: $( $.attr(this, 'href') ).offset().top
        }, 1000);
        return false;
    });

});

zwei14.init = function(){
    zwei14.initialized = true;

    zwei14.waypoints.init();
    zwei14.fixedBlockSizes();
    zwei14.sliders();

    if(zwei14.projects)
        zwei14.projects();

    zwei14.mobileMenu.init({

    });
}


zwei14.onResize = function(){
    zwei14.fixedBlockSizes();

    if(zwei14.projectsResize)
        zwei14.projectsResize();
};

zwei14.fixedBlockSizes = function(){
    $('.fixed-section-block-container').each(function(index, element){
        var $container = $(element);
        var width = $container.width();
        var height = $container.height();
        var left = $container.offset().left;

        $container.find('.fixed-section-block').css({
            width: width + 'px',
            height: height + 'px',
            left: left + 'px'
        });

        $container.find('.triangle-right').css({
            left: left + width + 'px'
        });

        $container.find('.triangle-left').css({
            left: left + 'px'
        });
    });
}

zwei14.sliders = function(){
    $('.slider').slick();
};



