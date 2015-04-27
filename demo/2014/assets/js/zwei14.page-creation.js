zwei14.loadedProjectImages = 0;


zwei14.projects = function(){
    console.log('load projects');
    var $container = $('.projects');

    var $projects = $container.find('.project');
    var gutterWidth = 5;

    var $images = $container.find('img');

    $images.load(function(){
        zwei14.loadedProjectImages++;

        if (zwei14.loadedProjectImages == $images.length) {
            imagesLoaded();
        }
    });

    function imagesLoaded(){
        zwei14.projectsResize();
    }

    $('#filter li').addClass('active');

    $('#filter li').click(function(){
        $(this).toggleClass('active');

        var activeSelectors = [];
        $('#filter li.active').each(function(i, item){
            activeSelectors.push('.' + $(item).attr('data-filter'));
        });

        var selector = activeSelectors.join(',');
        if(selector == "") selector = "*";

        console.log(selector);

        $container.isotope({ filter: selector });
        return false;
    });

}



zwei14.projectsResize = function(){
    if(!zwei14.initialized) return false;

    var $container = $('.projects');

    var $projects = $container.find('.project');

    $container.addClass('animated fadeInUp');

    $projects.each(function(i, item){
        var $project = $(item);
        var css = {
            height: $project.height() ,
            width: $project.width()
        };

        $project.css(css);
    });

    $container.isotope({
        itemSelector: '.project',
        masonry: {
            columnWidth: ($container.width() / 2)
        }
    });
}