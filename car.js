class Car{
    constructor(x,y,width,height){
        this.x=x;
        this.y=y;
        this.width = width;
        this.height = height;

        this.velocity=0;
        this.acceleration=0.2;
        this.friction=0.05
        this.maxVelo=3
        this.angle = 0

        this.sensor = new Sensor(this);
        this.controls = new Controls();
    }

    update(roadBorders){
        this.#move()
        this.sensor.update(roadBorders)
    }

    #move(){
        if(this.controls.forward){
            this.velocity+=this.acceleration;
        }
        if(this.controls.reverse){
            this.velocity-=this.acceleration;
        }
        if(this.velocity!=0){
            const flip = this.velocity>0?1:-1
            if(this.controls.left){
                this.angle+=0.03*flip;
            }
            if(this.controls.right){
                this.angle-=0.03*flip;
            }
        }
        if (this.velocity>this.maxVelo){
            this.velocity=this.maxVelo;
        }
        if (this.velocity<-this.maxVelo/2){
            this.velocity = -this.maxVelo/2
        }
        if (this.velocity>0){
            this.velocity -= this.friction;
        }
        if (this.velocity<0){
            this.velocity += this.friction;
        }
        if (Math.abs(this.velocity)<this.friction){
            this.velocity = 0
        }
        this.x -= Math.sin(this.angle)*this.velocity
        this.y -= Math.cos(this.angle)*this.velocity
    }

    draw(ctx){
        ctx.save();
        ctx.translate(this.x,this.y);
        ctx.rotate(-this.angle);

        ctx.beginPath();
        ctx.rect(
            -this.width/2,
            -this.height/2,
            this.width,
            this.height
        );
        ctx.fill();

        ctx.restore();

        this.sensor.draw(ctx);
    }
}