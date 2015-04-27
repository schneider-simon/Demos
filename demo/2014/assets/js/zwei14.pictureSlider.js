
zwei14.pictureSlider = {
    slides: [],
    $slider: null,
    $slides: null,
    $text: null,
    $indexText: null,
    $totalText: null,
    $scrollDown: null,
    activeIndex: -1,
    animationDuration: 1000,
    init: function () {
        var base = this;

        this.$slider = $('.zwei14-picture-slides');
        this.$slides = $('.zwei14-picture-slides .picture-slide');
        this.$text = $('.zwei14-picture-slides-text');
        this.$indexText = $('.zwei14-picture-slides-index');
        this.$totalText = $('.zwei14-picture-slides-total');
        this.$scrollDown = $('.zwei14-picture-slides-control.scrollDown');

        this.$totalText.text(this.$slides.length);

        this.$slides.each(function (index, item) {
            base.slides.push({
                index: index,
                text: $(item).attr('data-text'),
                image: $(item).attr('data-image'),
                $element: $(item)
            });
        });

        this.setActiveIndex(0);
        this.updateIndexText();

        this.insertImages();


        this.setTriggers();
    },
    setActiveIndex: function (index) {
        if (index < 0) index = this.slides.length - 1;
        if (index >= this.slides.length) index = 0;

        var oldSlide = this.getActiveSlide();
        var oldIndex = this.activeIndex;

        this.activeIndex = index;
        this.$slides.removeClass('active');

        var activeSlide = this.getActiveSlide();
        activeSlide.$element.addClass('active');

        if (oldIndex != -1) {
            oldSlide.$element.removeClass('fadeIn');
            oldSlide.$element.addClass('animated fadeOut');
        }
        activeSlide.$element.removeClass('fadeOut');
        activeSlide.$element.addClass('animated fadeIn');


        this.updateIndexText();


    },
    updateIndexText: function () {
        var $indexText = this.$indexText;
        var newNumber = this.activeIndex + 1;

        this.animate($indexText, 'fadeOutDown', 'fadeInDown', {
            afterFirst: function () {
                $indexText.text(newNumber);
            }
        });

    },
    moveText: function (text, direction) {
        var base = this;

        var fadeOut = (direction == 'right') ? 'fadeOutLeft' : 'fadeOutRight';
        var fadeIn = (direction == 'left') ? 'fadeInLeft' : 'fadeInRight';

        this.animate(this.$text, fadeOut, fadeIn, {
            afterFirst: function () {
                base.$text.text(text);
            }
        });

    },
    setTriggers: function () {
        var base = this;
        $('.zwei14-picture-slides-control').click(function (e) {
            e.preventDefault();
            base.controlClicked($(this));
        });
    },
    insertImages: function () {
        this.eachSlide(function (index, slide) {
            slide.$element.append('<img class="img-responsive" src="' + slide.image + '" />');
        });
    },
    controlClicked: function ($click) {
        if ($click.hasClass('left')) {
            return this.move(-1);
        }

        if ($click.hasClass("right")) {
            return this.move(+1);
        }

        if ($click.hasClass("scrollDown")) {
            return this.scrollDown();
        }

        if ($click.hasClass("scrollTop")) {
            return this.scrollTop();
        }
    },
    move: function (amount) {
        var base = this;
        var directionString = (amount > 0) ? 'right' : 'left';

        this.setActiveIndex(this.activeIndex + amount);

        var activeSlide = this.getActiveSlide();
        this.moveText(activeSlide.text, (directionString));

        vectorMorpher.next();

        window.setTimeout(function () {
            base.expandScrollDownCircle();
        }, 2000);

    },
    scrollDown: function () {
        var base = this;

        var sliderTop = this.$slider.offset().top + this.$slider.height() - $( window ).height();

        $('html, body').animate({
            scrollTop: parseInt(sliderTop)
        }, 1200);
    },
    scrollTop: function () {
        $('html, body').animate({
            scrollTop: 0
        }, 500);
    },
    eachSlide: function (callback) {
        for (var i in this.slides) {
            var slide = this.slides[i];
            var returner = callback(i, slide);

            if (returner === false) break;
        }
    },
    getActiveSlide: function () {
        return this.getSlideAt(this.activeIndex);
    },
    getSlideAt: function (index) {
        var found = false;
        this.eachSlide(function (i, slide) {
            if (slide.index == index) {
                found = slide;
                return false;
            }
        });

        return found;
    },
    animate: function ($element, classOne, classTwo, options) {
        $element.addClass('animated ' + classOne);

        if (typeof options === "undefined") options = {};
        if (typeof options.afterFirst === "undefined") options.afterFirst = function () {
        };
        if (typeof options.removeAnimated === "undefined") options.removeAnimated = false;


        window.setTimeout(function () {
            options.afterFirst();

            $element.removeClass(classOne);
            $element.addClass(classTwo);

            if (options.removeAnimated) {
                $element.removeClass('animated');
            }
        }, this.animationDuration);
    },
    expandScrollDownCircle: function () {
        if ($('.scrollDown-wrap .expandingDot').hasClass('expanded')) return false;

        $('.scrollDown-wrap .expandingDot').addClass('expanded');

        window.setTimeout(function () {
            $('.scrollDown-wrap .expandingDot').removeClass('expanded');
        }, 1200);
    }
};

