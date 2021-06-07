class Mandlebrot {
    constructor(pxY,pxX){
        this.pxY = pxY;
        this.pxX = pxX;
        this.iterateCount = 1000;
        this.xStart = 0;
        this.yStart = 0;
        this.xLength = 0;
        this.yLength=0;
        this.c = 0;
        /*
        this.workerCount = 1;
        this.workers = [];
        this.workers.push(new Worker('./mandleworker.js'));
        //this.workers[0].onmessage = this.jobFinished;
        //console.log("length",this.workers[0]);
        */
    }


    /*setWorkerCount(workerCount){
        for(let i = 0;i<this.workerCount;i++){
            this.workers[i].terminate();
        }
        for(let i = 0;i<workerCount;i++){
            this.workers.push(new Worker('mandleworker.js'));
        }
    }
*/


    calcArray(xStart,yStart,xLength,yLength,type,constant,workerCount){
        /*console.log("calcx",xStart," calcy", yStart);
        //console.log("calcxlength",xLength," calcylength",yLength);
        if (this.workerCount !== workerCount){
            //this.setWorkerCount(workerCount);
        }
        */
        this.xStart = xStart;
        this.yStart =yStart;
        this.xLength = xLength;
        this.yLength = yLength;

        let arr = new Array(this.pxY*this.pxX);
        let xSplit = xLength/this.pxX;//find size of bins to split x and y
        let ySplit = yLength/this.pxY;
        
        for(let j = 0;j<this.pxY;j++){
            for(let i = 0;i<this.pxX;i++){
                if (type === "mandlebrot"){
                const result = this.iterateMandle(xStart+i*xSplit,yStart+j*ySplit);
                if(result[0]){
                    arr[j*this.pxX+i] = 0;
                }else{
                    arr[j*this.pxX+i] = result[1];
                }
                } else{
                    //console.log("julia");
                    const result = this.iterateJulia(xStart+i*xSplit,yStart+j*ySplit,constant);
                    if(result[0]){
                        arr[j*this.pxX+i] = 0;
                    }else{
                        arr[j*this.pxX+i] = result[1];
                    }
                }
            }
        }

        return arr;
    }

    iterateMandle(a,b){
        let x = 0;
        let y = 0;
        for(let i = 0;i<this.iterateCount;i++){
            const oldx = x//keep x value so it can be used to find complex value
            x = x**2-y**2+a;
            y = 2*oldx*y+b;
            if((x*x+y*y) > 4){
                return [false,i+1];//plus one so it works on values outside of r = 2 circle
            }
        }
        return [true,0];
    }

    iterateJulia(a,b,c){
        let x = a;
        let y = b;
        for(let i = 0;i<this.iterateCount;i++){
            const oldx = x//keep x value so it can be used to find complex value
            x = x**2-y**2+c[0];
            y = 2*oldx*y+c[1];
            if((x*x+y*y) > 4){
                return [false,i+1];//plus one so it works on values outside of r = 2 circle
            }
        }
        return [true,0];
    }
    

    getColors(colorCount,pallette){
        let a = []
        let itersplit = (360/colorCount);
        
        for(let i = 0;i<colorCount;i++){
            
            let color = this.HsvToRgb(i*itersplit,1,1);
            a.push(color[0]);
            a.push(color[1]);
            a.push(color[2]);
        }
        //console.log(a.length/3);
        return a;
    }


    getNewCoords(newStartX,newStartY,newXLength,newYLength){
        let xSplit = this.xLength/this.pxX;//find size of bins to split x and y
        let ySplit = this.yLength/this.pxY;
        let a = [this.xStart+newStartX*xSplit,this.yStart+(newStartY*ySplit),newXLength*xSplit,newYLength*ySplit]
        return a;
        

    }

    HsvToRgb(h,s,v){
        let a;
        h = h%360
        let c = v*s
        let x = c *(1-Math.abs((h/60)%2-1))
        let m = v-c;
        switch(true){
            case h<60:
                a = [c,x,0];
                break;
            case h<120:
                a = [x,c,0];
                break;
            case h<180:
                a = [0,c,x];
                break;
            case h<240:
                a = [0,x,c];
                break;
            case h<300:
                a = [x,0,c];
                break;
            default:
                a = [c,0,x];
                break;
        }

    return a.map((el)=>{
        return (el+m)*255;
    })
    }
}

export default Mandlebrot;