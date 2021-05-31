class Mandlebrot {
    constructor(pxY,pxX){
        this.pxY = pxY;
        this.pxX = pxX;
        this.iterateCount = 100;//Only works up to 254, fix is possible but hard.
        this.xStart = 0;
        this.yStart = 0;
        this.xLength = 0;
        this.yLength=0;
    }


    calcArray(xStart,yStart,xLength,yLength){
        console.log("calcx",xStart," calcy", yStart);

        this.xStart = xStart;
        this.yStart =yStart;
        this.xLength = xLength;
        this.yLength = yLength;

        let arr = [];
        let xSplit = xLength/this.pxX;//find size of bins to split x and y
        let ySplit = yLength/this.pxY;

        for(let j = 0;j<this.pxY;j++){
            for(let i = 0;i<this.pxX;i++){
                const result = this.iterateMandle(xStart+i*xSplit,yStart+j*ySplit);
                if(result[0]){
                    arr.push(255);
                }else{
                    arr.push(result[1]);
                }
            }
        }
        return arr;
    }

    iterateMandle(a,b){
        let x = 0;
        let y = 0;
        for(let i = 0;i<this.iterateCount;i++){
            let oldx = x//keep x value so it can be used to find complex value
            x = x**2-y**2+a;
            y = 2*oldx*y+b;
            if((x*x+y*y) > 4){
                return [false,i+1];//plus one so it works on values outside of r = 2 circle
            }
        }
        return [true,0];
    }

    getColors(){
        let a = []
        let itersplit = 360/this.iterateCount;
        
        for(let i = 0;i<this.iterateCount;i++){
            
            let color = this.HsvToRgb(i*itersplit,1,1);
            a.push(color[0]);
            a.push(color[1]);
            a.push(color[2]);
        }
        console.log(a.length/3);
        return a;
    }


    getNewCoords(newStartX,newStartY,newXLength,newYLength){
        let xSplit = this.xLength/this.pxX;//find size of bins to split x and y
        let ySplit = this.yLength/this.pxY;
        let a = [this.xStart+newStartX*xSplit,this.yStart+(this.yLength-newStartY*ySplit),newXLength*xSplit,newYLength*ySplit]
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