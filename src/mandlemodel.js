//import onmessage from "./mandleworker";
//import Worker from 'worker-loader!./worker.js';



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
        
        this.workerCount = 0;
        this.workers = [];
        
        //this.workers[0].onmessage = this.jobFinished;
        //console.log("length",this.workers[0]);
        
    }


    createWorker(i,type,constant,workerCount){
        const xStart = this.xStart;
        const yStart = this.yStart;
        const xLength = this.xLength;
        const yLength = this.yLength;
        const pxY = this.pxY;
        const pxX = this.pxX;
        const iterateCount = this.iterateCount;
        let workers = this.workers;
        return new Promise(function(resolve,reject){
            
            //
            //this.workerCount++;
            workers[i].postMessage([xStart,yStart,xLength,yLength,pxY*i/workerCount,pxX,pxY/workerCount,type,constant,iterateCount,workerCount]);
            workers[i].onmessage = function(msg){
                resolve(msg.data);
            }
            workers[i].onerror = reject;
            
        });
    }





    calcArray(xStart,yStart,xLength,yLength,type,constant,workerCount,pxY,pxX){
        //console.log(xStart,yStart,xLength,yLength,type,constant,workerCount,pxY,pxX);
        //console.log("calcx",xStart," calcy", yStart);
        //console.log("calcxlength",xLength," calcylength",yLength);
        //console.log("constant",constant);
        if (this.workerCount !== workerCount){
            for(let i = 0;i<this.workerCount;i++){
                this.workers[i].terminate();
            }
            this.workers = [];
            
            for(let i = 0;i<workerCount;i++){
                this.workers.push(new Worker('./mandleworker.js'));
            }
            this.workerCount = workerCount;
            
        }
        this.pxX = pxX;
        this.pxY = pxY;
        this.xStart = xStart;
        this.yStart =yStart;
        this.xLength = xLength;
        this.yLength = yLength;

        let arr = [];
        //let xSplit = xLength/this.pxX;//find size of bins to split x and y
        //let ySplit = yLength/this.pxY;
        
        let promises = []
        for(let i = 0;i<workerCount;i++){
            promises.push(this.createWorker(i,type,constant,workerCount))
            //this.workers[i].postMessage([this.xStart,this.yStart,this.xLength,this.yLength,this.pxY*i/this.workerCount,this.pxX,this.pxY/this.workerCount,type,constant,this.iterateCount]);
            
        }
    
        return Promise.allSettled(promises).then((data) =>{
            for(let i = 0;i<data.length;i++){
                
                data[i].value.forEach(el => {arr.push(el)},this);
            }
            return arr;
        });
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