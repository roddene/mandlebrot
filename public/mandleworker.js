onmessage = function(msg){
    const data = msg.data;
    const xStart = data[0];
    const yStart = data[1];
    const xLength = data[2];
    const yLength = data[3];
    const pxYStart = data[4]
    const pxX = data[5];
    const pxY = data[6];
    const type = data[7];
    const constant = data[8];
    const iterateCount = data[9];
    const workerCount = parseInt(data[10]);
    const xSplit = xLength/pxX;
    const ySplit = (yLength/pxY)/workerCount;

    //console.log("worker",data)
    let arr = new Array(pxY*pxX);
    
    for(let j = 0;j<pxY;j++){
        for(let i = 0;i<pxX;i++){
            if (type === "mandelbrot"){
            const result = iterateMandle(xStart+i*xSplit,yStart+(j+pxYStart)*ySplit,iterateCount);//plus pxYStart to offset for each different worker
            if(result[0]){
                arr[j*pxX+i] = 0;
            }else{
                arr[j*pxX+i] = result[1];
            }
            } else{
                //console.log("julia");
                const result = iterateJulia(xStart+i*xSplit,yStart+(j+pxYStart)*ySplit,constant,iterateCount);
                if(result[0]){
                    arr[j*pxX+i] = 0;
                }else{
                    arr[j*pxX+i] = result[1];
                }
            }
        }
    }


    postMessage(arr);
}


function iterateMandle(a,b,iterateCount){
    let x = 0;
    let y = 0;
    for(let i = 0;i<iterateCount;i++){
        const oldx = x//keep x value so it can be used to find complex value
        x = x**2-y**2+a;
        y = 2*oldx*y+b;
        if((x*x+y*y) > 4){
            return [false,i+1];//plus one so it works on values outside of r = 2 circle
        }
    }
    return [true,0];
}

function iterateJulia(a,b,c,iterateCount){
    let x = a;
    let y = b;
    for(let i = 0;i<iterateCount;i++){
        const oldx = x//keep x value so it can be used to find complex value
        x = x**2-y**2+c[0];
        y = 2*oldx*y+c[1];
        if((x*x+y*y) > 4){
            return [false,i+1];//plus one so it works on values outside of r = 2 circle
        }
    }
    return [true,0];
}
