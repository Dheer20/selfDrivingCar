class Car{
    constructor(x,y,width,height,controlType,maxVelo=3){
        this.x=x;
        this.y=y;
        this.width = width;
        this.height = height;

        this.velocity=0;
        this.acceleration=0.2;
        this.friction=0.05
        this.maxVelo=maxVelo
        this.angle = 0
        this.damage = false;

        if(controlType != "DUMMY"){
            this.sensor = new Sensor(this);
            this.brain = new NeuralNetwork(
                [this.sensor.rayCount,6,4]
            );
        }
        this.controls = new Controls(controlType);

    }

    update(roadBorders,traffic){
        if (!this.damage){
            this.#move();
            this.polygon=this.#createPolygon();
            this.damage=this.#assessDamage(roadBorders,traffic);
        }
        if(this.sensor){
            this.sensor.update(roadBorders,traffic);
            const offsets = this.sensor.readings.map(
                s=>s==null?0:1-s.offset
            );
            const outputs = NeuralNetwork.feedForward(offsets,this.brain);
            console.log(outputs);

        }
    }

    #assessDamage(roadBorders,traffic){
        for(let i=0;i<roadBorders.length;i++){
            if (polysIntersect(this.polygon,roadBorders[i])){
                return true;
            }
        }
        for(let i=0;i<traffic.length;i++){
            if (polysIntersect(this.polygon,traffic[i].polygon)){
                return true;
            }
        }
        return false;
    }


    #createPolygon(){
        const points =[];
        const rad=Math.hypot(this.width,this.height)/2;
        const alpha=Math.atan2(this.width,this.height);

        points.push({x:this.x-Math.sin(this.angle-alpha)*rad,
                     y:this.y-Math.cos(this.angle-alpha)*rad
        });
        points.push({x:this.x-Math.sin(this.angle+alpha)*rad,
                     y:this.y-Math.cos(this.angle+alpha)*rad
        });
        points.push({x:this.x-Math.sin(Math.PI+this.angle-alpha)*rad,
                     y:this.y-Math.cos(Math.PI+this.angle-alpha)*rad
        });
        points.push({x:this.x-Math.sin(Math.PI+this.angle+alpha)*rad,
                     y:this.y-Math.cos(Math.PI+this.angle+alpha)*rad
        });
        return points
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

    draw(ctx,color){
        if (this.damage){
            ctx.fillStyle="gray";
        }else{
            ctx.fillStyle=color;
        }
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x,this.polygon[0].y);
        for(let i=1;i<this.polygon.length;i++){
            ctx.lineTo(this.polygon[i].x,this.polygon[i].y)
        }
        ctx.fill();
        if(this.sensor){
            this.sensor.draw(ctx);
        }
    }
}