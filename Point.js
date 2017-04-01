class Point {
    constructor(id, name, place, longitude, latitude){
        this.id = id;
        this.name = name;
        this.place = place;
        this.long = latitude;
        this.lat = latitude;
        this.x = getRandomInRange(offset, sizeX-offset);
        this.y = getRandomInRange(offset, sizeY-offset);
        this.color = getRandomColor();
        this.dir = int(random(4));
        this.inner_sz = 20;
        this.outer_sz = 40;
        this.beat = false;
    }

    display(){
        fill(100);
        stroke(200);
        ellipse(this.x, this.y, this.inner_sz, this.inner_sz);
        fill(color(100,90));
        stroke(this.color);
        ellipse(this.x, this.y, this.outer_sz, this.outer_sz);
    }

    distance(point){
        return Math.sqrt(Math.pow(this.x - point.x,2) + Math.pow(this.y - point.y,2)); 
    }

    changeDir(){
        this.x = getRandomInRange(offset, sizeX-offset);
        this.y = getRandomInRange(offset, sizeY-offset);
        this.dir = int(random(4));
    }

    heart_beat(){
        if(!this.beat) 
            this.inner_sz++; 
        else 
            this.inner_sz --;

        if(this.inner_sz > 35 || this.inner_sz < 20) 
            this.beat = !this.beat;
    }

    isMouseOver(){
        var currentMaxX = sizeX;
        var currentMaxY = sizeY;
        var currentMinX = 0;
        var currentMinY = 0;

        var xScale = width / (currentMaxX - currentMinX);
        var yScale = height / (currentMaxY - currentMinY);

        var x = (mouseX - width / 2) / xScale + (currentMaxX + currentMinX) / 2; 
        var y = (mouseY - height / 2) / yScale + (currentMaxY + currentMinY) / 2;

        var disX = this.x - x;
        var disY = this.y - y;
        console.log(this.x+" "+this.y);
        console.log(x+" "+y);
        if (sqrt(sq(disX) + sq(disY)) < this.outer_sz) {
            return true;
        } else {
            return false;
        }
    }

    move(){
        this.heart_beat();
        switch(this.dir){
            case 0:
                this.x+=speed;
                if(this.x > (sizeX+offset)) this.changeDir();  
                break;
            case 1:
                this.x-=speed;
                if(this.x < (0-offset)) this.changeDir();  
                break;
            case 2:
                this.y+=speed;
                if(this.y > (sizeY+offset)) this.changeDir();  
                break;
            case 3:
                this.y-=speed;
                if(this.y < (0-offset)) this.changeDir();  
                break;
        }
    }
}