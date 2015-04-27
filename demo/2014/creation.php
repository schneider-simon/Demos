<?php
include('view_helper.php');
?>
<!DOCTYPE html>
<html>
<head>
    <?php partial('head'); ?>
    <link href="assets/css/zwei14.page-creation.css" rel="stylesheet" type="text/css"/>


</head>
<body>
<?php partial('navigation'); ?>
<div class="page page-creation">
    <section class="header oversize">
        <div class="container">

            <h1 class="page-title col-md-12">Kreation</h1>

            <div class="col-md-6 hidden-sm"></div>
        </div>
    </section>
    <section id="content" class="content oversize">
        <div id="filter" class="container filter">
            <div class="col-xs-6 col-md-offset-8 col-md-2 subfilter-service">
                <h3>Leistungen</h3>
                <ul class="list-unstyled">
                    <li data-filter="website">Website</li>
                    <li data-filter="service">Print</li>
                    <li data-filter="movie">Film</li>
                    <li data-filter="fair">Messe</li>
                </ul>

            </div>
            <div class="col-xs-6 col-md-2 subfilter-sector">
                <h3>Branche</h3>
                <ul class="list-unstyled">
                    <li data-filter="metal">Metall</li>
                    <li data-filter="design">Design</li>
                    <li data-filter="architecture">Architektur</li>
                </ul>
            </div>

        </div>
        <div class="container">
            <div class="projects" data-columns>
                <div class="project half movie">
                    <div class="inner">
                        <img width="1920" height="1080" src="assets/img/test/mountains_1.jpg"/>

                        <div class="overlay">
                            <h3>Diodea</h3>

                            <div class="details">
                                <a href="creation_sub.php" class="project-link"></a>
                                <ul class="list-unstyled">
                                    <li>Strategisches Marketing</li>
                                    <li>Logo Redesign</li>
                                    <li>Fotokonzept und Shooting</li>
                                    <li>Konzeption, Design und Programmierung von Vier Websites</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="project half movie metal">
                    <div class="inner">
                        <img width="1920" height="1080" src="assets/img/test/mountains_2.jpg"/>

                        <div class="overlay">
                            <h3>Diodea</h3>

                            <div class="details">
                                <a class="project-link"></a>
                                <ul>
                                    <li>Strategisches MArketing</li>
                                    <li>Logo Redesign</li>
                                    <li>Fotokonzept und Shooting</li>
                                    <li>Konzeption, Design und Programmierung von Vier Websites</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="project full movie architecture">
                    <div class="inner">
                        <img src="assets/img/test/mountains_3.jpg"/>

                        <div class="overlay">
                            <h3>Diodea</h3>

                            <div class="details">
                                <a class="project-link"></a>
                                <ul>
                                    <li>Strategisches MArketing</li>
                                    <li>Logo Redesign</li>
                                    <li>Fotokonzept und Shooting</li>
                                    <li>Konzeption, Design und Programmierung von Vier Websites</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
</div>

</section>
</div>

<?php partial('footer'); ?>
<script src="assets/lib/isotope.pkgd.min.js"></script>
<script src="assets/js/zwei14.page-creation.js"></script>

<script>

</script>

</body>
</html>