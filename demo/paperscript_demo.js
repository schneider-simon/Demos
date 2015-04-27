paperscriptApp.foo = "bar";

var path = new Path.Circle({
    center: view.center,
    radius: 1,
    fillColor: '#fff'
});

var symbol = new Symbol(path);

var points = [];
var paths = [];

paperscriptApp.points = points;
paperscriptApp.paths = paths;

for(var i = 0; i != 150; i++){

    var randomPosition = new Point(
        view.size.width / 2,
        view.size.height / 4
    );
    var placed = symbol.place(randomPosition);
    placed.data.direction = new Point({
        angle: (Math.random() - 0.5) * 40,
        length: 3
    });
    placed.data.speed = (Math.random() + 0.5) * 2;
    placed.setScaling((Math.random() * 3 + 1));

    points.push(placed);
}

for(var i = 0; i != 35; i++){
    var myPath = new Path();
    myPath.strokeColor = '#777';
    myPath.closed = true;
    myPath.sendToBack();


    paths.push(myPath);
}


var connectionsLost = 0;
var emptyPaths = [];

function onFrame(event) {
    var randomPointNumber = parseInt(Math.random() * points.length) ;

    for(var i = 0; i != points.length; i++){
        var point = points[i];
        point.position += point.data.direction * point.data.speed;
        point.data.direction.angle += point.data.speed;

        var addNewPath = false;
        if(i == randomPointNumber && event.count % 5 == 0) addNewPath = true;
        if(connectionsLost >= 3)                            addNewPath = true;
        if(emptyPaths.length > 5)                            addNewPath = true;
        if(emptyPaths.length == 0)                          addNewPath = false;

        if(addNewPath){
            if(connectionsLost >= 3)
                connectionsLost = 0;

            var nearPoints = findClosePoints(point, (Math.random() + 1) * 5, 40);
            nearPoints.push(point);

            var randomPathNumber = parseInt(Math.random() * emptyPaths.length);
            var randomPath = emptyPaths[randomPathNumber];
            randomPath.data.points = nearPoints;

        }
    }

    emptyPaths = [];

    for(var i = 0; i != paths.length; i++){
        var path = paths[i];
        if(!path.data.points){
            emptyPaths.push(path);
            continue;
        }

        if(path.data.points.length < 3){
            emptyPaths.push(path);
        }

        path.removeSegments();
        for(var x in path.data.points){
            var point = path.data.points[x];
            path.add(path.data.points[x].position);
        }
        path.data.points = checkConnection(path);
    }
}

function checkConnection(path){
    var points = [];
    var basePoint = path.data.points[0];
    points.push(basePoint);
    for(var x = 1; x != path.data.points.length; x++){
        var pointToCheck = path.data.points[x];
        if(basePoint.position.getDistance(pointToCheck.position) <= 120){
            points.push(pointToCheck);
        } else {
            connectionsLost++;
        }
    }

    return points;
}

function findClosePoints(point, ammount, tolerance){
    var closePoints = [];
    ammount = parseInt(ammount);
    for(var i = 0; i != points.length; i++){
        var pointToCheck = points[i];

        if(point.position.getDistance(pointToCheck.position) <= tolerance){
            closePoints.push(pointToCheck);
            if(closePoints.length >= ammount) break;
        }
    }

    return closePoints;
}