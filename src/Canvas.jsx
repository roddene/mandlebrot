import React,{useRef,useEffect} from 'react';
import MandleBrot from './mandlemodel';

const Canvas = props => {
  
  const canvasRef = useRef(null)
  let imageData = '';
  let mouse = {
    x:0,
    y:0,
    startX:0,
    startY:0
  }
  let drawingRect = false
  let mandle = new MandleBrot(1080,1920);
  let colors = mandle.getColors();
  
  const draw = (ctx,xStart,yStart,xLength,yLength) => {
    let arr = mandle.calcArray(xStart,yStart,xLength,yLength);    
    
    imageData = ctx.createImageData(1920, 1080);
    for (let i = 0; i < imageData.data.length; i += 4) {
        // Modify pixel data
        if(arr[i/4]=== 0){
        imageData.data[i + 0] = 255;  // R value
        imageData.data[i + 1] = 255;    // G value
        imageData.data[i + 2] = 255;  // B value
        }else{
        //console.log(arr[i/4])
        imageData.data[i + 0] = colors[3*(arr[i/4]-1)];  // R value
        imageData.data[i + 1] = colors[3*(arr[i/4]-1)+1];    // G value
        imageData.data[i + 2] = colors[3*(arr[i/4]-1)+2];
        }
        imageData.data[i + 3] = 255;  // A value
      }
      ctx.putImageData(imageData, 20, 20);//why 20 20
  }

  const calculate = ctx =>{

  }

  const handleLeftClick = event =>{
    const canvas = canvasRef.current
    if (drawingRect){
      drawingRect = false;
      canvas.style.cursor = "default"
      const coords = mandle.getNewCoords((mouse.x - mouse.startX < 0) ? mouse.x : mouse.startX,(mouse.y - mouse.startY < 0) ? mouse.y: mouse.startY,Math.abs(mouse.x - mouse.startX),Math.abs(mouse.y - mouse.startY))
      draw(canvas.getContext('2d'),coords[0],coords[1],coords[2],coords[3]);

    }else{
      mouse.startX = event.nativeEvent.offsetX;
      mouse.startY = event.nativeEvent.offsetY;
      drawingRect = true;

      canvas.style.cursor = "crosshair"
    }

  }

  const handleRightClick = event =>{
    event.preventDefault();
    drawingRect = false;
    console.log(mandle.getNewCoords((mouse.x - mouse.startX < 0) ? mouse.x : mouse.startX,(mouse.y - mouse.startY < 0) ? mouse.y: mouse.startY,
      Math.abs(mouse.x - mouse.startX),Math.abs(mouse.y - mouse.startY)));

    const context =  canvasRef.current.getContext('2d')
    context.clearRect(0,0,1920,1080);
    context.putImageData(imageData,20,20);
    
  }

  const handleMove = event =>{
    //console.log(event)
    mouse.x = event.nativeEvent.offsetX;
    mouse.y = event.nativeEvent.offsetY;
    if (drawingRect) {
      //clears and redraws entire image.  Should split and refactor later.
      const context =  canvasRef.current.getContext('2d')
      context.clearRect(0,0,1920,1080);
      context.putImageData(imageData,20,20);
      context.strokeRect((mouse.x - mouse.startX < 0) ? mouse.x : mouse.startX,(mouse.y - mouse.startY < 0) ? mouse.y: mouse.startY ,Math.abs(mouse.x - mouse.startX), Math.abs(mouse.y - mouse.startY))
  }
  }

  
  
  useEffect(() => {
    
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    
    //Our draw come here
    draw(context,-2,-1,3,2)
  }, [draw])
  
  return <canvas ref={canvasRef} {...props} width = "1920" height = "1080" onMouseMove = {handleMove} onContextMenu = {handleRightClick} onClick = {handleLeftClick}/>
}

export default Canvas

