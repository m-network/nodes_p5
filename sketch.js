var nodes = [];
var limit = 200;
var offset = 100;
var speed = 0.5;
var img;
var bg_img;
var cam;
var sizeX, sizeY;
var window_x, window_y;
var counter=0;

function setup() {
    createCanvas(windowWidth, windowHeight);
    smooth();
    sizeX = windowWidth;
    sizeY = windowHeight;
    window_x = width; 
    window_y = height;
    cam = new Camera();
    cam.reset(1.0, sizeX, sizeY);
    cam.translate(-windowWidth/2,-windowHeight/2);
    getFromDatabase();
    bg_img = loadImage("assets/startBG3.png");
}

function draw() {
  background(bg_img);
  //drawFabric();
  strokeWeight(5);
  fill(0, 40);
  rect(0,0,sizeX,sizeY);

  //checkTimer();
  
  connectNodes();
  for(idx in nodes){
    nodes[idx].display();
    nodes[idx].move();
  }
}

/**** Events ****/
function windowResized() {
  cam.reset(1.0, sizeX, sizeX);
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed(){
    for(i in nodes)
        if(nodes[i].isMouseOver())
            alert(nodes[i].long+" "+nodes[i].lat);
}

function mouseDragged(){
    var dx = cam.pmouseX - cam.mouseX;
    var dy = cam.pmouseY - cam.mouseY;
    // if(dx < 0 && window_x >= width/2)
    //     window_x += dx;

    // if(dy < 0 && window_y >= height/2)
    //     window_y += dy;

    // if(dx > 0 && window_x <= (3/2)*width)
    //     window_x += dx;

    // if(dy > 0 && window_y >= (3/2)*height)
    //     window_y += dy;

    // if(inWindow())
    //     cam.translate(dx,dy);
    window_x += dx;
    window_y += dy;
    cam.translate(dx,dy);
}

function mouseWheel(e) {
  var factor = Math.pow(1.01, e.delta);
  cam.scale(factor, mouseX, mouseY);
}

function keyPressed(){
    console.log("Key Pressed");
    getFromDatabase();
}

function inWindow(){
    return (window_x >= width/2 && window_x <= (3/2)*width) && (window_y >= height/2 && window_y < (3/2)*height);
}

function getWaveWeight(counter, idx){
    if(idx == counter) return 8;
    else if(abs(counter-idx) >= 800) return 0.1;
    else return float(200) / abs(counter-idx)
}

function drawFabric(){
  for (var i = 0; i<=sizeX; i+=50) {
    strokeWeight(getWaveWeight(counter, i));
    line(i, 0, i, sizeY);
  }
  
  strokeWeight(0.1);
  for (var j = 0; j<=sizeY; j+=50)
    line(0, j, sizeX, j);

  if(!(frameCount%5))
     counter = counter<=sizeX ? counter + 50:0;
}


function connectNodes(){
    stroke(200);
    strokeWeight(2);
    for(i in nodes){
        var min = Number.MAX_VALUE;
        var minIdx = i;
        for(j in nodes){
            if(i != j){
                var dist = nodes[i].distance(nodes[j]);
                if(dist < min){
                    min = dist;
                    minIdx = j;
                } 
            }
        }
        var distance = round(getGeoDistance(nodes[i].long, nodes[i].lat, nodes[minIdx].long, nodes[minIdx].lat, "km"));
        if(nodes.length > 1){
            var posX = (nodes[i].x + nodes[minIdx].x) / 2;
            var posY = (nodes[i].y + nodes[minIdx].y) / 2;
    stroke(200);
            fill(255);
            textAlign(CENTER);
            textSize(15);
            text(distance + " km", posX, posY);
    stroke(0);
            line(nodes[i].x, nodes[i].y, nodes[minIdx].x, nodes[minIdx].y);
        }
    }
}

function checkTimer(){
  if(!(frameCount % limit)){ 
    limit = int(getRandomInRange(50,200));
    addNode();
  }
}

function addNode(){
    var long = getRandomInRange(-180,180,3);
    var lat = getRandomInRange(-90, 90, 3);
    nodes.push(new Point(long, lat));
}

function getGeoDistance(long_1, lat_1, long_2, lat_2, mode){
    return calcGeoDistance(long_1, lat_1, long_2, lat_2, mode);
}

function getRandomInRange(from, to) {
    return (Math.random() * (to - from) + from);
}

function getRandomColor(){
    return color(random(255), random(255), random(255));
}

setInterval(function(){
    getFromDatabase();
}, 10*1000);

function getFromDatabase(){
    var thisBaseURL = "http://198.58.116.131/nodes_p5/getGPSLocationNodes.php";
    var ids = [];
    for(i in nodes)
    {
        ids.push(nodes[i].id);
    }

	$.post(thisBaseURL, 
			{ 
			},
			function( rtn ) 
			{	
                console.log(rtn.status);
				console.log(rtn.data.rowCount);
				$.each(rtn.data.users, function(i)
				{
                    if($.inArray(this.unityUserID, ids) == -1){
                        person = new Point(this.unityUserID, 
                                          this.screenName, 
                                          this.placeName,
                                          this.longitude,
                                          this.latitude);
                        nodes.push(person);
                        console.log(this.unityUserID);
                        console.log(this.screenName);
                        console.log(this.latitude);
                        console.log(this.longitude);
                        console.log(this.placeName);
                    }
				});
			}, "jsonp"
		);
}