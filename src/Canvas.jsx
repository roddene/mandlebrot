import React,{useRef,useEffect} from 'react';
import MandleBrot from './mandlemodel';

const Canvas = props => {
  
  const canvasRef = useRef(null)
  
  const draw = ctx => {

    let mandle = new MandleBrot(1080,1920);
    let arr = mandle.calcArray(-2,-1,3,2);    
    let colors = mandle.getColors();
    const imageData = ctx.createImageData(1920, 1080);
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
      ctx.putImageData(imageData, 20, 20);
      
  }
  
  useEffect(() => {
    
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    
    //Our draw come here
    draw(context)
  }, [draw])
  
  return <canvas ref={canvasRef} {...props} width = "1920" height = "1080" />
}

export default Canvas

