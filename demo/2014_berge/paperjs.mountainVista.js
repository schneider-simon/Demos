vectorMorpher = {
    path: null,
    screens: null,
    angleLines: [],
    labels: [],
    vars: {
        buildUp: false,
        moveBy: 0,
        screenIndex: 0,
        statistics: {
            animateRun: 0,
            delta: 0,
            latestFraps: []
        },
        commands:  {
            fillAfterReposition: false
        },
        pixelVisible: 0,
        percentVisible: 0,
        running: false,
        straighting: false,
        $canvas: null
    },
    settings: {

    },
    defaults: {
        segmentsMinimum: 11,
        segmentsMaximum: 16,
        peakMinimum: 10,//in percent of canvas height
        peakMaximum: 40,
        highMountainMinimum: 80,
        highMountainMaximum: 90,
        animationSpeed: 1.5,
        buildUpSpeed: 10.0,
        moveSpeed: 100,
        color: '#FFEA00',
        width: 20,
        debugMode: false,
        straighten: {
            startAtPercent: 70,
            undoAtPercent: 0,
            addTopMargin: 60
        },
        canvasId: 'myCanvas'
    },
    init: function(options){
        //this.settings = $.extend( {}, this.defaults, options );
        this.settings = this.defaults;
        this.screens = this.helper.extendedArray();

        if(this.viewSize().width < 900)
            this.adjustToSmallScreen();

        this.vars.$canvas = $('#' + this.settings.canvasId);

        this.initDebug();
        this.onScroll(0);

        this.path = new Path();
        this.path.strokeColor = this.settings.color;
        this.path.strokeWidth = this.settings.width;

        this.path.selectedColor = "#e6c200";
        //this.path.fillColor = '#333';
        this.path.fullySelected = true;

        this.fillScreen(-1, {'buildUp': false});
        this.fillScreen(0, {'buildUp': true});
        this.fillScreen(1, {'buildUp': false});

        //this.fillScreen(-1, {'buildUp': false});
    },
    adjustToSmallScreen: function(){
        var screenFactor = 0.6
        this.settings.segmentsMaximum =  Math.round(this.settings.segmentsMaximum * screenFactor);
        this.settings.segmentsMinimum =  Math.round(this.settings.segmentsMinimum * screenFactor);
        this.settings.animationSpeed =  Math.round(this.settings.animationSpeed * screenFactor);
    },
    initDebug: function(){
        if(!this.settings.debugMode) return false;

        var text = new PointText({
            point: new Point(100,100),
            justification: 'left',
            pivtot: Rectangle.topleft,
            fontSize: 16,
            fillColor: 'black',
            content: "Debug\r\nText"
        });

        this.vars.debugText = text;
    },
    updateDebug: function()
    {
        if(!this.settings.debugMode) return false;

        var fps = Math.round(1/this.vars.statistics.delta);
        this.vars.statistics.delta = this.vars.lastEvent.delta;
        this.vars.statistics.latestFraps.push(fps);

        if(this.vars.statistics.latestFraps.length > 10)
            this.vars.statistics.latestFraps.shift();

        var fpsAvg = 0;
        var fpsSum = 0;
        for(var i in this.vars.statistics.latestFraps){
            fpsSum += this.vars.statistics.latestFraps[i];
        }

        fpsSum = Math.round(fpsSum / this.vars.statistics.latestFraps.length);

        var content = [];
        content.push('Delta: ' + this.vars.statistics.delta);
        content.push('FPS: ' + fpsSum);
        content.push('Animate run: ' + this.vars.statistics.animateRun);
        content.push('Screen: ' + this.vars.screenIndex);
        content.push('Screens: ' + this.screens.totalLength);
        content.push('MoveBy: ' + this.vars.moveBy);
        content.push('Visible: ' + Math.round(this.vars.pixelVisible) + 'px/' + Math.round(this.vars.percentVisible) + '%');

        this.vars.debugText.content = content.join('\r\n');
    },
    fillScreen: function(index, options) {
        if(typeof(options) === "undefined")         options = {};
        if(typeof(options.buildUp) === "undefined") options.buildUp = false;

        var method = "append";
        if(index < this.vars.screenIndex) method = "prepend";

        if(this.screens[index]) return false;

        var segmentsAmmount = this.helper.randomNumber(
            this.settings.segmentsMinimum,
            this.settings.segmentsMaximum
        );

        var yStart  = this.getYValue(index - 1, 'last');
        var yEnd    = this.getYValue(index + 1, 'first');

        var highMountainIndex = Math.floor(segmentsAmmount / 2)

        var percentSteps = 100 / segmentsAmmount;

        var segments = [];

        for(var i = 0; i != segmentsAmmount + 1; i++){
            var xPercent = i * percentSteps;

            var isFirst = i == 0;
            var isLast = i == segmentsAmmount;

            var isHighMountain = i == highMountainIndex;
            var isNearHighMountain = Math.abs(i - highMountainIndex) == 1;

            var beforeHighMountain = i < highMountainIndex;
            var isMountain = Math.abs(i - highMountainIndex) % 2 == 1;
            if(beforeHighMountain) isMountain != isMountain;

            if(isHighMountain) isMountain = true;
            var isValley = !isMountain;

            if(isNearHighMountain) continue;

            if(!isFirst && !isLast && !isHighMountain) {
                var xVariation = this.helper.randomNumber(-(percentSteps * 0.3), percentSteps * 0.15);
                xPercent += xVariation;
            }

            var yPercent;
            if(!isHighMountain){
                yPercent = this.helper.randomNumber(
                    this.settings.peakMinimum,
                    this.settings.peakMaximum
                );

                if(isMountain) yPercent *= 1.2;
                else           yPercent *= 0.8;
            } else {
                yPercent = this.helper.randomNumber(
                    this.settings.highMountainMinimum,
                    this.settings.highMountainMinimum
                );
            }

            var position = this.percentPoint(xPercent, yPercent, index);

            /**
             * Connect with oter screens
             */

            if(isFirst && yStart) position.y = yStart;
            if(isLast && yEnd) position.y = yEnd;

            /**
             * Add segment
             */
            var segment;

            var insertPoint = position;
            if(options.buildUp && !isFirst)
                insertPoint = segments[0].point;

            segment = new Segment(insertPoint);

            segment.data = {
                isHighMountain: isHighMountain,
                originalPosition: position
            };

            if(this.settings.debugMode) {
                this.createAngleLine(segment);
            }


            segments.push(segment);
        }


        if(options.buildUp){
            this.vars.buildUp = true;
        }

        var labels = [];
        labels.push(this.createLabel("1414", segments[highMountainIndex - 1]));

        this.screens[index] = {
            segments: segments,
            buildUpIndex: 1,
            options: options,
            labels: labels
        };

        if(method == "append")
            this.path.addSegments(segments);
        else
            this.path.insertSegments(0,segments);


    },
    getSegment: function(screenId, segmentId){
        if(!this.screens[screenId]) return false;
        var segments = this.screens[screenId].segments;
        if(!segments) return false;

        if(segmentId == "first")    segmentId = 0;
        if(segmentId == "last")     segmentId = segments.length - 1;

        return segments[segmentId];
    },
    getPoint: function(screenId, segmentId){
        var segment = this.getSegment(screenId, segmentId);
        if(!segment) return false;

        return segment.point;
    },
    getYValue: function(screenId, segmentId){
        var point = this.getPoint(screenId, segmentId);
        if(!point) return false;

        return point.y;
    },
    createAngleLine: function(onSegment){
        var angleLine = new Path.Line(0, 0);
        angleLine.strokeColor = "#000";
        angleLine.data.segment = onSegment;

        angleLine.data.label = new PointText({
            point: new Point(0,0),
            justification: 'left',
            fontSize: 12,
            fillColor: 'black',
            content: "label"
        });

        this.angleLines.push(angleLine);
    },
    createLabel: function(content, onSegment){
        var label = {};

        var labelColor = "#000";

        var segmentPosition = onSegment.data.originalPosition;
        var handlePosition = new Point(0,0);
        var offset = new Point(50, -30);

        var textPosition = new Point(handlePosition.x + 10, handlePosition.y - 5);

        var circle = new Path.Circle({
            center: handlePosition,
            radius: 2,
            fillColor: labelColor
        });

        var line = new Path.Line(handlePosition, new Point(handlePosition.x + 55, handlePosition.y));
        line.strokeColor = labelColor;

        var text = new PointText({
            point: textPosition,
            justification: 'left',
            fontSize: 16,
            fillColor: labelColor,
            content: content
        });

        var group = new Group([text, circle, line]);
        group.position = segmentPosition + offset;

        var textObject = {
            text: text,
            segment: onSegment,
            offset: offset,
            group: group,
            originalContent: content
        };

        onSegment.data.text = text;

        this.labels.push(textObject);

        return textObject;
    },
    viewSize: function(){
        return view.size;
    },
    percentPoint: function(percentX, percentY, screenIndex){
        var pixelX = this.viewSize().width * (percentX / 100);
        var pixelY = this.viewSize().height * ((100-percentY) / 100);

        if(typeof(screenIndex) !== "undefined"){
            var currentScreen = this.vars.screenIndex;
            var screenDifference = screenIndex - currentScreen;

            pixelX += (this.viewSize().width * (screenDifference));
        }

        return new Point(pixelX, pixelY);
    },
    onFrame: function(event){
        this.vars.lastEvent = event;
        this.updateDebug();


        var runAnimation = this.vars.moveBy == 0 && !this.vars.buildUp && !this.straightenActive();

        if(this.vars.buildUp)
            this.animateBuildUp(0, event);
        else{
            this.repositionLabels();
            this.updateAngleLines();
        }


        if(runAnimation) {
            this.vars.statistics.animateRun++;
            this.animateSegments(this.vars.screenIndex, event);
        }

        if(this.vars.moveBy != 0){
            this.animatePathMove();
        }

        if(event.count % 5 == 0)
            this.onScroll($(window).scrollTop());
    },
    animateStraighten: function(){
        var allSegments = this.path.getSegments();
        var height = this.viewSize().height;
        var percentDone = 1 - this.vars.percentVisible / this.settings.straighten.startAtPercent;

        for(var i in allSegments){
            var segment = allSegments[i];
            var totalWay = height - segment.data.straighten.start.y - this.settings.width / 2;
            var wayDone = (totalWay) * (Math.min(1,percentDone*1.3));

            var pixelY = segment.data.straighten.start.y + wayDone;

            if(segment.data.text){
                var altitude = Math.floor(1414 * (1-percentDone));
                if(altitude > 1414 - 200) altitude = 1414;

                segment.data.text.content = altitude;
            }

            segment.point.y = pixelY;

        }
    },
    animatePathMove: function(){
        var direction = (this.vars.moveBy > 0)? 1 : -1;

        var step =  this.vars.moveBy / (500/this.settings.moveSpeed);
        this.path.position.x += step;
        this.vars.moveBy -= step;

        if(Math.abs(this.vars.moveBy) < 3){
            this.path.position.x += this.vars.moveBy;
            this.vars.moveBy = 0;

            if(this.vars.commands.fillAfterReposition !== false){
                this.fillScreen(this.vars.commands.fillAfterReposition);
                this.vars.commands.fillAfterReposition = false;

            }
        }


    },
    animateBuildUp: function (screenIndex, event) {
        if(!this.vars.buildUp) return false;
        if(!this.screens[screenIndex]) return false;

        var screenObject = this.screens[screenIndex];

        var destinationSegment = screenObject.segments[screenObject.buildUpIndex];
        var destination = destinationSegment.data.originalPosition;


        var destinationReached = false;
        for(var i in screenObject.segments){
            if(i < screenObject.buildUpIndex) continue;
            var segment = screenObject.segments[i];

            var originalVector = destination - segment.point;

            var vector = originalVector.clone();

            vector /= (vector.length / 10 /  this.settings.buildUpSpeed);


            segment.point += vector;

            if(segment.point.x > destination.x){
                segment.point = destination;
                destinationReached = true;
            }
        }

        if(destinationReached)
            screenObject.buildUpIndex++;

        if(screenObject.buildUpIndex >= screenObject.segments.length){
            this.buildUpDone();
        }
    },
    buildUpDone: function(){
        this.vars.buildUp = false;
        this.vars.running = true;

        this.onScroll(0, true);
        this.onScroll($(window).scrollTop());
    },
    animateSegments: function(screenIndex, event){
        if(!this.screens[screenIndex]) return false;
        if(this.screens[screenIndex].buildUp) return false;

        var screenObject = this.screens[screenIndex];

        for(var i in screenObject.segments){
            var segment = screenObject.segments[i];
            var segmentBefore = (screenObject.segments.length > 0)? screenObject.segments[i - 1] : false;
            var segmentAfter = (screenObject.segments[i + 1])? screenObject.segments[i + 1] : false;

            var isFirst = i == 0;
            var isLast = i == screenObject.segments.length - 1;

            if(isFirst || isLast || (segment.data.isHighMountain && false)) continue;

            if(!segment.animation)
                segment.animation = { endTime: 0, amountDone: 0 };

            if(this.destinationReached(segment, event)){
                segment.animation = this.generateAnimationObject(segment, event);
            }

            var tooSharp = false;

            if(segmentAfter && segmentAfter.point.x <= segment.point.x) {
                tooSharp = true;

                if(segmentAfter.animation)
                    segmentAfter.animation.tooSharp = true;
            }

            if(segmentBefore && segmentBefore.point.x >= segment.point.x) {
                tooSharp = true;

                if(segmentBefore.animation)
                    segmentBefore.animation.tooSharp = true;
            }

            if(tooSharp){
                if(!segment.animation.tooSharp)
                    segment.animation.endTime = 0;

                segment.animation.tooSharp = true;
                console.log('toosharp', i);
            } else {
                segment.animation.tooSharp = false;
            }

            segment.point += new Point({
                angle: segment.animation.angle,
                length: segment.animation.speed
            });
        }
    },
    updateAngleLines: function(){
        for(var i in this.angleLines){
            var angleLine = this.angleLines[i];
            var onSegment = angleLine.data.segment;

            var fromSegment = angleLine.getFirstSegment();
            var toSegment = angleLine.getLastSegment();

            var color = "#000";
            if(onSegment.animation && onSegment.animation.tooSharp){
                color = "red";
            }

            var gohome = false;
            if(onSegment.animation && onSegment.animation.gohome){
                gohome = true;
            }

            var from = angleLine.data.segment.point;
            var angle = (angleLine.data.segment.animation)?onSegment.animation.angle : 0;

            var to = from + new Point({angle: angle, length: 50});

            var label =  angleLine.data.label;
            var homeVector = onSegment.data.originalPosition - onSegment.point

            label.point = from;
            label.content = 'angle: ' + Math.round(angle) +
                        '\r\nhome: ' + Math.round(homeVector.length) +
                        '\r\nhomeangle: ' + Math.round(homeVector.angle) +
                        '\r\ngohome: ' + gohome

            ;

            fromSegment.point = from;
            toSegment.point = to;
            angleLine.strokeColor = color;
        }
    },
    repositionLabels: function(){
      for(var i in this.screens){
          var screenObject = this.screens[i];
          for(var l in screenObject.labels){

              var labelObject = screenObject.labels[l];
              labelObject.group.position = labelObject.segment.point + labelObject.offset;
          }
      }
    },
    destinationReached: function(segment, event){
        return event.time >= segment.animation.endTime;
    },
    generateAnimationObject: function(segment, event){
        var animationSpeed = this.settings.animationSpeed / 5;

        var angle = this.helper.randomNumber(0,360);

        var gohome = (segment.animation.tooSharp || segment.animation.amountDone % 3 == 2);

        if(gohome){
            homeVector = segment.data.originalPosition - segment.point;
            angle = homeVector.angle;
        }



        var endTime = event.time + this.helper.randomNumber(1,3.5, true);
        var speed = this.helper.randomNumber(
            animationSpeed * 0.5,
            animationSpeed * 1.5,
            true
        );


        if(segment.animation.amountDone % 4 == this.helper.randomNumber(0,3) && !gohome){
            angle = 90;
            speed = 0;
        }


        return {
            angle: angle,
            endTime: endTime,
            speed: speed,
            amountDone: segment.animation.amountDone++,
            tooSharp: false,
            gohome: gohome
        }

    },
    moveScreen: function(direction){
        if(this.vars.moveBy != 0 || !this.vars.running) return false;

        var intDirection = (direction == "right")? -1 : 1;

        this.vars.screenIndex -=  intDirection;
        this.vars.commands.fillAfterReposition = this.vars.screenIndex - intDirection;

        this.vars.moveBy = this.viewSize().width * intDirection;
    },
    straightenActive: function(){
        return this.settings.straighten.startAtPercent > this.vars.percentVisible;
    },
    startStraighten: function(){
        if(!this.vars.running ) return false;

        this.getStraightenStartPositions();
        this.vars.straighting = true;


    },
    stopStraighten: function(){
        this.vars.straighting = false;

        var allSegments = this.path.getSegments();

        for(var i in allSegments){
            var segment = allSegments[i];

            var endPoint = segment.data.straighten.start;

            if(segment.point.y > endPoint.y + 100){
                segment.point.y = endPoint.y;
            }
        }

        this.resetLabelContents();

    },
    resetLabelContents: function(){
        for(var i in this.labels){
            var label = this.labels[i];

            var originalContent = label.originalContent;
            label.text.content = originalContent;
        }
    },
    getStraightenStartPositions: function(){
        var allSegments = this.path.getSegments();

        for(var i in allSegments){
            var segment = allSegments[i];

            var startPoint = segment.point.clone();
            if(segment.data.straighten && segment.data.straighten.start) {
                startPoint = segment.data.straighten.start;
            }

            segment.data.straighten = {
                start: startPoint
            };
        }
    },
    onScroll: function(scrollTop, getStartPositions){
        var pixelVisible = this.viewSize().height - scrollTop;
        this.vars.pixelVisible = pixelVisible;
        this.vars.percentVisible = (pixelVisible / this.viewSize().height) * 100;
        this.vars.percentVisible = Math.max(0,this.vars.percentVisible);


        if(getStartPositions && this.vars.running )
            this.getStraightenStartPositions();

        if(this.straightenActive() && !this.vars.straighting){
            this.startStraighten();
        } else if(!this.straightenActive() && this.vars.straighting) {
            this.stopStraighten();
        }

        if(this.vars.pixelVisible <= this.settings.width + this.settings.straighten.addTopMargin){
            $('body').addClass('mountainview-straightened');
            //this.vars.$canvas.addClass('straightened');
            //this.vars.$canvas.css('top', -1* (this.viewSize().height - this.settings.width - this.settings.straighten.addTopMargin));
        } else {
            $('body').removeClass('mountainview-straightened');
            //this.vars.$canvas.removeClass('straightened');
            //this.vars.$canvas.css('top',0);
        }

        if(this.vars.running && this.straightenActive())
            this.animateStraighten();
    },
    helper: {
        extendedArray: function() {
            var a = [];

            Object.defineProperty(a, 'totalLength', {
                get : function() { return Object.keys(a).length; }
            });

            return a;
        },
        randomNumber: function(min, max, isFloat){
            var number =  Math.random() * (max - min) + min;


            if(isFloat)
                return number;
            else
                return Math.round(number);
        },
        radToDegree: function(radians){
            return radians * (180/3.14159265);
        }
    }
};

function onFrame(event){
    mountainVista.onFrame(event);
}

mountainVistaReady();

