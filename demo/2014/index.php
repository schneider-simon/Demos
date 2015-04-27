<?php
include('view_helper.php');
?>
<!DOCTYPE html>
<html>
<head>
    <?php partial('head'); ?>
    <link href="assets/css/zwei14.page-start.css"  rel="stylesheet" type="text/css"/>

    <script src="assets/js/paperjs/dist/paper-full.js"></script>

    <script>

        var vectorMorpher = null;
        var vectorMorpherReady = function(){

            vectorMorpher.init({
                svgsToImport: ['reh_front', 'reh_seite_neu', 'reh_seite_mirror']
            });
        }
    </script>
    <script type="text/paperscript" src="assets/js/paperjs.vectorMorpher.js?v=2" canvas="myCanvas"></script>

</head>
<body>
<?php partial('navigation'); ?>
<div class="page page-start">
    <section id="header" class="header">
        <div class="header-overlay">
            <div class="header-overlay-inner">
                <div class="header-overlay-sliderControl clearfix">
                    <div class="left zwei14-picture-slides-control"><i class="z-icon icon-arrowLeft">&#xe806;</i></div>
                    <div class="counter">
                        <span class="index zwei14-picture-slides-index">0</span>
                        <span class="seperator"></span>
                        <span class="total zwei14-picture-slides-total">0</span>
                    </div>
                    <div class="right zwei14-picture-slides-control"><i class="z-icon icon-arrowRight">&#xe805;</i></div>
                </div>
                <div class="super-text-wrap">
                    <h1 class="page-title">FRISCHFLEISS</h1>
                    <div class="super-text-slogan">
                        <div class="zwei14-picture-slides-text">Die Kreativ- und Digitalagentur aus Baden-Württemberg</div>
                    </div>
                </div>

            </div>
            <div class="scrollDown-wrap">
                <span class="zwei14-picture-slides-control scrollDown"><i class="z-icon icon-arrowDown">&#xe808;</i></span>
                <div class="expandingDot"></div>
            </div>
        </div>
        <div class="canvas-wrap">
            <canvas id="myCanvas"></canvas>
        </div>
    </section>

    <div class="zwei14-picture-slides picture-slides">
        <div class="picture-slide" data-text="Die Kreativ- und Digitalagentur aus Baden-Württemberg" data-image="assets/img/test/mountains_1.jpg">
        </div>
        <div class="picture-slide" data-text="Die Kreativagentur aus Baden-Württemberg" data-image="assets/img/test/mountains_2.jpg">
        </div>
        <div class="picture-slide" data-text="Die Digitalagentur aus Baden-Württemberg" data-image="assets/img/test/mountains_3.jpg">
        </div>
        <div class="zwei14-picture-slides-overlay">
            <div class="zwei14-text hidden-xs">
                <div class="zwei14-picture-slides-text"></div>
            </div>
            <div class="zwei14-controls">
                <div class="zwei14-controls-inner">
                    <div class="left zwei14-picture-slides-control"></div>
                    <div class="scrollTop zwei14-picture-slides-control"></div>
                    <div class="right zwei14-picture-slides-control"></div>
                </div>
            </div>
        </div>
    </div>
</div>

<?php partial('footer'); ?>
<script src="assets/js/zwei14.pictureSlider.js"></script>
<script>
    function calculateCanvasSize() {
        var totalSize = {
            width: $('.canvas-wrap').width(),
            height: $('.canvas-wrap').height()
        };

        var canvasLength = (totalSize.width < totalSize.height) ? totalSize.width : totalSize.height;

        var marginTop = (totalSize.height - canvasLength) / 2;

        $('#myCanvas').css({
            width: canvasLength + "px",
            height: canvasLength + "px",
            marginTop: marginTop + "px"
        });
    }
    calculateCanvasSize();

    jQuery(document).ready(function ($) {
        zwei14.pictureSlider.init();

    });
</script>

</body>
</html>