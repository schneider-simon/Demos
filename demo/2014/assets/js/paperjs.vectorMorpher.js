/**
 * Vector Morpher
 * Automatic SVG morpher.
 *
 * Author: ZWEI14.de
 * Version: 1.2
 * Do not use without permission. We gonna get u (p) - never gonna let u down.
 */
vectorMorpher = {
    vectors: [],
    vars: {
        shineCounter: 0,
        $canvas: null,
        svgData: {},
        importsDone: false,
        importedSvgs : [],
        vectorsAnimated: 0
    },
    settings: {},
    defaults: {
        canvasId: 'myCanvas',
        svgsToImport: ['reh_seite_neu', 'reh_front'],
        svgBasePath: 'resources/svg/'
    },
    init: function (options) {

        var base = this;
        this.settings = this.defaults;
        this.settings = $.extend({}, this.defaults, options);

        this.vars.$canvas = $('#' + this.settings.canvasId);

        //this.importer.load('test');
        this.lab.init(this);

        //vectorMorpher.svgReader.read('http://localhost/projects/SchneiderClickLocal/demo/2014_vector/ressources/svg/reh_front.svg');

        vectorMorpher.importer.importSvgs(this.settings.svgsToImport, function(svgs){
            vectorMorpher.importer.load(base.settings.svgsToImport[0]);

        });


    },
    next: function(){
        vectorMorpher.importer.nextMorph();
    },
    onFrame: function (event) {
        if(!this.isRunning()){
            return false;
        }

        var shinePosition =  (event.count) % this.vectors.length;
        if(shinePosition == 0) this.vars.shineCounter++;

        var shinePause = this.vars.shineCounter % 3 != 0;

        for (var i in this.vectors) {
            var vector = this.vectors[i];

            var shineDistance = Math.abs(shinePosition - i);

            if (shineDistance < 5 && !shinePause) {
                vector.shine();
            }

            vector.animate(event);
        }
    },

    onMouseDown: function (event) {

    },
    createRandomVector: function () {
        var vector = new this.FlatVector(
            [
                this.randomPercentPoint(10, 90),
                this.randomPercentPoint(10, 90),
                this.randomPercentPoint(10, 90)
            ],
            {
                fill: 'magenta'
            }
        );
    },
    random: function (min, max, isFloat) {
        var number = Math.random() * (max - min) + min;


        if (isFloat)
            return number;
        else
            return Math.round(number);
    },
    randomPoint: function (topLeft, bottomRight) {
        if (typeof topLeft === "undefined") topLeft = this.percentPoint(0, 0);
        if (typeof bottomRight === "undefined") bottomRight = this.percentPoint(100, 100);

        var randomX = this.random(topLeft.x, bottomRight.x, false);
        var randomY = this.random(topLeft.y, bottomRight.y, false);

        return new Point(randomX, randomY);
    },
    randomPercentPoint: function (minPercent, maxPercent) {
        var topLeft = this.percentPoint(minPercent, minPercent);
        var bottomRight = this.percentPoint(maxPercent, maxPercent);

        return this.randomPoint(topLeft, bottomRight);
    },
    percentPoint: function (percentX, percentY) {
        var pixelX = this.viewSize().width * (percentX / 100);
        var pixelY = this.viewSize().height * (percentY) / 100;

        return new Point(pixelX, pixelY);
    },
    viewSize: function () {
        return view.size;
    },
    startDecompose: function(){
        this.forEveryVector(function(vector){
            vector.startDecompose();
        });
    },
    unDecompose: function(){
        this.forEveryVector(function(vector){
            vector.unDecompose();
        });
    },
    forEveryVector: function(mapFunction){
        for(var i in this.vectors){
            var vector = this.vectors[i];
            mapFunction(vector);
        }
    },
    isRunning: function(){
        var running = true;

        if(!this.vars.importsDone) running = false;

        return running;
    },
    vectorAnimated: function(vector){
        this.vars.vectorsAnimated++;


        if(this.vars.vectorsAnimated == this.vectors.length){
            this.allVectorsAnimated();
            this.vars.vectorsAnimated = 0;
        }
    },
    allVectorsAnimated: function(){
        this.vars.shineCounter = 0;
    }
};


/**
 *
 * @param Point point1
 * @param point2
 * @param point3
 */
vectorMorpher.FlatVector = function (points, options) {
    var base = this;

    this.vars = {
        destinations: [],
        reachedDestinations: [],
        oldDestinations: [],
        timeAppeared: 0,
        shineCounter: 0,
        shining: true
    };

    this.getFillColor = function () {
        return this.options.fill;
    };
    this.getBorderColor = function () {
        return this.options.border;
    };

    this.shine = function () {
        this.vars.shining = true;
    }

    this.init = function () {
        var vectorSum = new Point(0, 0);

        base.defaults = {
            border: false,
            fill: 'gray',
            animate: true,
            animationDelay: 0,
            info: {},
            animationSpeed: 1
        };

        base.points = points;
        base.options = $.extend({}, base.defaults, options);

        base.info = options.info;

        base.path = new Path();

        base.path.onClick = function(event) {
            console.log(base.info.data.fill, base.info.data.info);
        };

        base.calculateCenter();

        var randomPoint = points[vectorMorpher.random(0, 2, false)].clone();

        for (var i = 0; i != points.length; i++) {
            var point = points[i];

            var destination = point.clone();

            if (base.animates()) {
                //point = base.center;
                point = randomPoint - vectorMorpher.random(0, 120, false);
            }

            base.addPoint(point, destination, i);


        }

        base.path.fillColor = base.getFillColor();

        if (base.getBorderColor()) {
            this.path.strokeColor = base.getBorderColor();
            this.path.strokeWidth = 0.8;
        }

        base.path.closed = true;

        vectorMorpher.vectors.push(this);


        base.path.onDoubleClick = function (event) {
            this.fillColor = 'red';

            base.path.remove();

        }
    }

    this.morphTo = function(points, fillColor){
        var destinations = [];
        for(var i in points){
            destinations.push(points[i].clone());
        }

        this.vars.destinations = destinations;
        base.options.animate = true;
        base.vars.reachedDestinations = [];

        if(fillColor)
            base.changeFillColor(fillColor, 0);

        this.changeLevel(points.length);
        this.options.animationSpeed = 0.7;
    }

    this.changeLevel = function(numberOfPoints){
        var points = base.points;
        var oldPointsNumber = points.length;


        if(numberOfPoints == oldPointsNumber) return;

        /**
         * Remove points that are over the new level (point ammount)
         */
        if(numberOfPoints < oldPointsNumber) {
            for (var i = oldPointsNumber -1; i >= numberOfPoints; i--) {
                this.removePoint(i);
            }
        }

        /**
         * Add points that we need for the new level
         */
        if(numberOfPoints > oldPointsNumber){
            var insertPoint = base.calculateCenter();

            for(var i = oldPointsNumber; i != numberOfPoints; i++){
                base.addPoint(insertPoint.clone(), false, i);
            }
        }


    }

    this.removePoint = function(index){
        base.path.removeSegment(index);
        base.points.splice(index,1);
    }

    this.addPoint = function(point, destination, index){
        base.path.addSegment(point.clone());
        base.points[index] = point.clone();

        if(destination)
            base.vars.destinations[index] = destination;
    }

    this.changeFillColor = function(newColor, tolerance){
        if(!tolerance && tolerance !== 0) tolerance = 20;


        newColor = new Color(newColor);
        newColor.saturation *= (vectorMorpher.random(100 - tolerance, 100 + tolerance, false) / 100);
        newColor.brightness *= (vectorMorpher.random(100 - tolerance, 100 + tolerance, false) / 100);


        base.options.fill = newColor;
        base.path.fillColor = newColor;
    }


    this.remove = function(){

        base.path.remove();
        var index = vectorMorpher.vectors.indexOf(base);
        vectorMorpher.vectors.splice(index, 1);


    }

    this.pointValues = function () {
        var points = [];

        for (var i in base.points) {
            var point = base.points[i];
            points.push(point.x);
            points.push(point.y);
        }

        return points;
    }

    this.animate = function (event) {
        this.shineAnimation();

        if (!base.animationRunning(event)) return false;
        if (event.count % 1 == 0) {

            for (var i = 0; i != base.points.length; i++) {
                base.animatePoint(i);
            }
        }
    }

    this.shineAnimation = function(){
        var shineMode = "none";

        if(this.vars.shineCounter >= 5 && this.vars.shining) this.vars.shining = false;

        if(this.vars.shineCounter > 0 && !this.vars.shining) shineMode = "unshine";
        if(this.vars.shineCounter < 5 && this.vars.shining) shineMode = "shining";

        if(shineMode === "none") return false;

        var shineColor = this.path.fillColor.clone();

        if(shineMode === "shining"){
            shineColor.brightness += 0.03;
            this.vars.shineCounter++;
        }

        if(shineMode === "unshine"){
            shineColor.brightness -= 0.03;
            this.vars.shineCounter--;
        }

        this.path.fillColor = shineColor;
    }

    this.animatePoint = function (index) {
        var speed = base.options.animationSpeed;
        var tolerance = speed * 0.8;
        var point = base.path.segments[index].point;
        var destination = base.vars.destinations[index];
        var location = point;

        var way = (destination - location) / 10;
        way *= speed;

        //console.log(way.length);

        if (way.length < 0.15) {
            base.path.segments[index].point = destination;
            base.vars.reachedDestinations[index] = true;

            if (
                base.reachedAllDestinations() && base.options.animate == true
            ) {
                vectorMorpher.vectorAnimated(this);
                base.options.animate = false;
                return false;
            }

        } else {
            base.path.segments[index].point += way;
        }

    }

    this.reachedAllDestinations = function(){
        for(var i in base.points){
            if(!base.vars.reachedDestinations[i]) return false;
        }

        return true;
    }

    this.animates = function () {
        return base.options.animate;
    }

    this.animationRunning = function (event) {
        if (!base.animates()) return false;

        if (base.vars.timeAppeared == 0) {
            base.vars.timeAppeared = event.time;
        }

        if (base.vars.timeAppeared + base.options.animationDelay > event.time) return false;

        return true;

    }

    this.calculateCenter = function () {
        var vectorSum = new Point(0, 0);

        for (var i = 0; i != base.points.length; i++) {
            vectorSum += base.points[i];
        }

        base.center = vectorSum / base.points.length;

        return base.center;
    }

    this.startDecompose = function(){
        var newDestinations = [];

        if(this.vars.oldDestinations.length == 0)
        this.vars.oldDestinations = this.vars.destinations;

        for (var i = 0; i != base.points.length; i++) {
            var point = base.points[i];

            var newDestination = new Point(point.x, vectorMorpher.viewSize().height);

            if(i > 2){
                newDestination.y -= vectorMorpher.random(10,50, false);
            }

            newDestinations[i] = newDestination;
        }

        this.morphTo(newDestinations, false);


    }

    this.unDecompose = function(){
        this.morphTo(this.vars.oldDestinations, false);
        this.vars.oldDestinations = [];
    };

    this.forEveryPoint = function(callback){
        for (var i = 0; i != base.points.length; i++) {
            var point = base.points[i];
            callback(point, index);
        }
    };

    this.init();

};

vectorMorpher.importer = {
    activeName: false,
    load: function (name) {
        var data = this.getData(name);
        this.createVectors(data);

        this.activeName = name;
    },
    importSvg: function(svgName, callback){
        var base = this;
        var svgPath = vectorMorpher.settings.svgBasePath + svgName + '.svg?v=' + vectorMorpher.random(0,100,false);


        vectorMorpher.svgReader.read(svgPath, function(svg){
            vectorMorpher.vars.svgData[svgName] = svg;
            vectorMorpher.vars.importedSvgs.push(svgName);

            svg.name = svgName;
            svg.vectors = base.sortByKey(svg.vectors, 'centerX').reverse();
            callback(svg, svgName);
        });

    },
    importSvgs: function(svgNames, callback){
        for(var i in svgNames){
            var svgName = svgNames[i];

            this.importSvg(svgName, function(svg){
                if( vectorMorpher.vars.importedSvgs.length == svgNames.length){
                    vectorMorpher.vars.importsDone = true;
                    callback(vectorMorpher.vars.svgData);
                }
            });
        }
    },
    getData: function(name){
        if(vectorMorpher.vars.svgData[name]){
            return jQuery.extend(true, {}, vectorMorpher.vars.svgData[name]);
        }

        throw "Dataset " + name + " is not imported.";
    },
    nextMorph: function(){
        var morphs = vectorMorpher.settings.svgsToImport;

        var returnNext = false;
        for(var i in morphs){
            var morphName = morphs[i];

            if(returnNext)
                return this.morphTo(morphName);

            if(morphName == this.activeName) returnNext = true;

        }

        return this.morphTo(morphs[0]);
    },
    morphTo: function(name){
        var polygonsData = this.getData(name);


        var oldVectors =  vectorMorpher.vectors;
        var vectorDatas = polygonsData.vectors;

        var stats = {morphed: 0, created: 0, deleted: 0};
        //Morph existing vectors
        for(var i = 0; i != oldVectors.length; i++){
            if(i >= vectorDatas.length) break;

            var newVectorData = vectorDatas[i];
            var oldVector = oldVectors[i];
            oldVector.morphTo(newVectorData.points, newVectorData.fill);
            stats.morphed++;
        }

        //Create new vectors
        if(vectorDatas.length > oldVectors.length){
            stats.created = this.createVectors(polygonsData, oldVectors.length)
        }
        //or delete needless ones
        else {
            while(vectorMorpher.vectors.length > vectorDatas.length){
                var needlessVector = vectorMorpher.vectors[vectorMorpher.vectors.length - 1];
                needlessVector.remove();
                stats.deleted++;
            }
        }

        //console.log(stats);

        this.activeName = name;

    },
    createVectors: function (polygonData, startAt) {
        if(typeof(startAt) === "undefined") startAt = 0;

        var vectorsCreated = 0;

        for (var i in polygonData.vectors) {
            if(i < startAt) continue;

            var vectorData = polygonData.vectors[i];

            this.createVector({
                points: vectorData.points,
                fill: vectorData.fill,
                info: vectorData.raw
            }, {
                animationDelay: (10/1000 * (i- startAt)) / ((polygonData.vectors.length ) / 100)
            });


            vectorsCreated++;
        }

        return vectorsCreated;

    },
    createVector: function (vectorData, options) {
        var index = (options.index)? options.index : 0;
        var animationDelay = (options.animationDelay)? options.animationDelay : 0;

        var points = vectorData.points;

        var color = new Color(vectorData.fill);

        var vector = new vectorMorpher.FlatVector(
            points, {
                fill: color,
                animationDelay: animationDelay,
                info: {'data': vectorData, 'index': index}
            }
        );
    },
    extractPoints: function(pointsString, scale){
        var pointValues;
        pointValues = pointsString.trim().split(' ');


        var offset = new Point(0,0);
        var pathMode = false;

        if(pointsString.indexOf('M') != -1){
            pathMode = true;
            pointsString = pointsString.replace(/[MLHVCSQTAZ]/gi,' ');
            pointsString = pointsString.replace('-', ' -');
            pointsString = pointsString.replace('  ', ' ').trim();
        }

        var points = [];

        for(var i in pointValues){

            var pointValue = pointValues[i];
            if(pointValue.trim() == "" || pointValue.indexOf(',') == -1) continue;

            var coordinates = pointValue.split(',');

            var x = parseFloat(coordinates[0]);
            var y = parseFloat(coordinates[1]);

            var point = new Point(x,y);
            point = this.scalePoint(scale, point);

            points.push(point);
        }

        return points;
    },
    scalePoint: function(factor, point){
        var newPoint = new Point(point.x * factor,point.y * factor);
        return newPoint;
    },
    toFullsizeFactor: function(width, height){
        var viewSize = vectorMorpher.viewSize();

        if(width > height){
            return viewSize.width / width;
        }

        if(height >= width){
            return viewSize.height / height;
        }
    },
    sortByKey: function(array, key) {
        return array.sort(function(a, b) {
            var x = a[key]; var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    }
}

vectorMorpher.svgReader = {
    read: function(path, callback){
        var base = this;
        this.load(path, function(xml){
            var svgData = base.svgToJson(xml);

            callback(svgData);
        });

    },
    helpers: {
        polygonNodes: function(xml){
            if (xml.children == undefined) {

                //What a work around - thank you Safari -.-
                return xml.childNodes[2].childNodes;


            } else {
                return xml.children[0].children;
            }
        }
    },
    polygonsFromXml: function(xml){

        var polygons = this.helpers.polygonNodes(xml);
        return polygons;
    },
    svgToJson: function(xml, xmlToJson){
        var polygons = this.polygonsFromXml(xml);

        var vectors = [];

        var edges = {
            min: {x: -1, y: -1},
            max: {x: -1, y: -1}
        }

        for(var i in polygons){
            var polygon = polygons[i];



            if(polygon.localName != 'polyline' && polygon.localName != 'polygon'){
                continue;
            }


            var fill = polygon.attributes[0].nodeValue;
            var points_raw = polygon.attributes[1].nodeValue;
            var points = vectorMorpher.importer.extractPoints(points_raw, 1);

            var xSum = 0;
            var ySum = 0;
            for(var j in points){
                var point = points[j];

                if(edges.min.x == -1 || point.x <= edges.min.x) edges.min.x = point.x;
                if(edges.min.y == -1 || point.y <= edges.min.y) edges.min.y = point.y;
                if(edges.max.x == -1 || point.x >= edges.max.x) edges.max.x = point.x;
                if(edges.max.y == -1 || point.y >= edges.max.y) edges.max.y = point.y;

                xSum += point.x;
                ySum += point.y;
            }

            var center = new Point(xSum / points.length, ySum / points.length)

            vectors.push({
                fill: fill,
                points: points,
                raw: points_raw,
                centerX: center.x,
                centerY: center.y
            })

        }

        var frame = new Point(edges.max.x - edges.min.x, edges.max.y - edges.min.y);
        var viewSize = vectorMorpher.viewSize();
        var fullScreenFactor = vectorMorpher.importer.toFullsizeFactor(frame.x, frame.y);
        fullScreenFactor *= 0.9;

        var centerDistance = {
            x: (viewSize.width - frame.x * fullScreenFactor) / 2,
            y: (viewSize.height - frame.y * fullScreenFactor) / 2
        }

        for(var i in vectors){
            var vector = vectors[i];

            for(var j in vector.points){
                var point = vector.points[j];
                //Move to top left corner
                point.x -= edges.min.x;
                point.y -= edges.min.y;

                //scale to full screen
                point.x *= fullScreenFactor;
                point.y *= fullScreenFactor;

                //center
                point.x += centerDistance.x;
                point.y += centerDistance.y;

            }
        }


        return {
            width: frame.x,
            height: frame.y,
            vectors: vectors
        };
    },
    load: function(path, callback){
        var xhttp = new XMLHttpRequest();
        xhttp.open('GET', path, true);
        xhttp.send();

        xhttp.onreadystatechange = function(){
            if(xhttp.readyState == 4 && xhttp.status == 200){
                callback(xhttp.responseXML);
            }
        }

        return xhttp.responseXML;
    }
}




vectorMorpher.lab = {
    frameSize: 0,
    init: function () {
        this.previewPath = new Path();
    },
    onMouseDown: function (event) {
        console.log(event.point.x, event.point.y);
    },
    onKeyDown: function (event) {
        if (event.key === 's') this.savePreview();
        if (event.key === 'o') vectorMorpher.startDecompose();
        if (event.key === 'p') vectorMorpher.unDecompose();
        if (event.key === 'm') this.testMorph();
        if (event.key === 'd') {
            this.drawBackground();
        }
    },
    testMorph: function () {
        vectorMorpher.importer.nextMorph();
    }
}

function onFrame(event) {
    vectorMorpher.onFrame(event);
}

function onMouseDown(event) {

    vectorMorpher.onMouseDown(event);
    vectorMorpher.lab.onMouseDown(event);
}

function onKeyDown(event) {
    vectorMorpher.lab.onKeyDown(event);
}


vectorMorpherReady();



