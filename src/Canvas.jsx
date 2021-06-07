import React from 'react';
import MandleBrot from './mandlemodel';

class Canvas extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      constant: props.constant,
    }
    this.canvasRef = React.createRef();
    this.imageData = '';
    this.mouse = {
      x:0,
      y:0,
      startX:0,
      startY:0
    }
    this.toReset = false;
    this.dimensions = props.dimensions;
    this.drawingRect = false;
    this.mandle = new MandleBrot(props.dimensions[1],props.dimensions[0]);
    this.colorCount = 250;
    this.colors = this.mandle.getColors(this.colorCount,null);//second for pallette
    this.workerCount = 1;
    //this.constant = this.props.constant;
    //console.log("props",props.dimensions);
    
  }
  
  
 
  draw = async (ctx,xStart,yStart,xLength,yLength) => {
    
    //console.log("draw",this.props.constant);
    //console.log(this.state.constant);
    let arr = await this.mandle.calcArray(xStart,yStart,xLength,yLength,this.props.type,this.props.constant,this.props.workerCount,this.props.dimensions[1],this.props.dimensions[0]);//select core count here    
    
    //console.log("arr12124234324",arr);
    this.imageData = ctx.createImageData(this.props.dimensions[0], this.props.dimensions[1]);
    for (let i = 0; i < this.imageData.data.length; i += 4) {
        // Modify pixel data
        if(arr[i/4]=== 0){
        this.imageData.data[i + 0] = 0;  // R value
        this.imageData.data[i + 1] = 0;    // G value
        this.imageData.data[i + 2] = 0;  // B value
        }else{
        //console.log(arr[i/4])
        this.imageData.data[i + 0] = this.colors[3*(arr[i/4]-1)%this.colorCount];  // R value
        this.imageData.data[i + 1] = this.colors[(3*(arr[i/4]-1)+1)%this.colorCount];    // G value
        this.imageData.data[i + 2] = this.colors[(3*(arr[i/4]-1)+2)%this.colorCount];//mod colorcount with 250 and 1000 should make it cycle thru all colors 4 times.
        }
        this.imageData.data[i + 3] = 255;  // A value
      }
      ctx.putImageData(this.imageData, 0, 0);
  }



  handleLeftClick = event =>{
    const canvas = this.canvasRef.current
    if (this.drawingRect){
      this.drawingRect = false;
      canvas.style.cursor = "default"
      //dimensions[1]- to account for drawing from bottom left;
      //console.log("????");
      //console.log((this.mouse.y - this.mouse.startY < 0));
      const coords = this.mandle.getNewCoords((this.mouse.x - this.mouse.startX < 0) ? this.mouse.x : this.mouse.startX,(this.mouse.y - this.mouse.startY < 0) ? this.mouse.y: this.mouse.startY,
      Math.abs(this.mouse.x - this.mouse.startX),Math.abs(this.mouse.y - this.mouse.startY))
      this.draw(canvas.getContext('2d'),coords[0],coords[1],coords[2],coords[2]*this.props.dimensions[1]/this.props.dimensions[0]);

    }else{
      this.mouse.startX = event.nativeEvent.offsetX;
      this.mouse.startY = event.nativeEvent.offsetY;
      this.drawingRect = true;

      canvas.style.cursor = "crosshair"
    }

  }

  handleRightClick = event =>{
    event.preventDefault();
    
    

    this.canvasRef.current.style.cursor = "default"
    
    if (this.props.type === "mandlebrot" &&this.drawingRect ===false){
      const coords = this.mandle.getNewCoords((this.mouse.x - this.mouse.startX < 0) ? this.mouse.x : this.mouse.startX,(this.mouse.y - this.mouse.startY < 0) ? this.mouse.y: this.mouse.startY,
      Math.abs(this.mouse.x - this.mouse.startX),Math.abs(this.mouse.y - this.mouse.startY));
      this.props.rightClick(coords);
    }
    this.drawingRect = false;
    const context =  this.canvasRef.current.getContext('2d')
    context.clearRect(0,0,this.props.dimensions[0],this.props.dimensions[1]);
    context.putImageData(this.imageData,0,0);
    if(this.toReset &&this.props.type === "mandlebrot"){
      this.props.rightClick([0,0,0,0]);
      this.toReset = false;
    }

    
  }

   handleMove = event =>{
    //console.log(event)
    this.mouse.x = event.nativeEvent.offsetX;
    this.mouse.y = event.nativeEvent.offsetY;
    if (this.drawingRect) {
      //clears and redraws entire image.  Should split and refactor later.
      const context =  this.canvasRef.current.getContext('2d')
      context.clearRect(0,0,this.props.dimensions[0],this.props.dimensions[1]);
      context.putImageData(this.imageData,0,0);
      context.strokeRect((this.mouse.x - this.mouse.startX < 0) ? this.mouse.x : this.mouse.startX,(this.mouse.y - this.mouse.startY < 0) ? this.mouse.y: this.mouse.startY ,Math.abs(this.mouse.x - this.mouse.startX), Math.abs(this.mouse.y - this.mouse.startY))
  }
  }

  componentDidUpdate(){
    const canvas = this.canvasRef.current
    const context = canvas.getContext('2d')
    this.workerCount = this.props.workerCount;
    
    if(this.props.type==="julia"){
      //console.log("updating",this.props.constant);
      this.draw(context,-1.5,-1,3,2);
    }
    
    if(this.props.dimensions!==this.dimensions){
      this.dimensions = this.props.dimensions;
      this.reset();
    }
  }  

  reset = ()=> {
    if (this.props.type === "julia"){
      //console.log("right click");
      this.props.rightClick([0,0,0,0]);
      return
    }
    this.toReset = true;
    this.componentDidMount();
  }
  
  componentDidMount() {
     
    
    const canvas = this.canvasRef.current
    const context = canvas.getContext('2d')
    
    //Our draw come here
    if(this.props.type==="mandlebrot"){
    this.draw(context,-2,-1,3,2)
    }else if(this.props.type==="julia"){
      this.draw(context,-1.5,-1,3,2)
    }
  }
  
  render(){
  return (<div class = "viewer">
    <div>
    <button onClick = {this.reset}>Reset</button>
    </div>
    <canvas ref={this.canvasRef} constant = {this.props.constant} key = {this.props.constant} {...this.props} width = {this.props.dimensions[0]} height = {this.props.dimensions[1]} onMouseMove = {this.handleMove} onContextMenu = {this.handleRightClick} onClick = {this.handleLeftClick}/>
    </div>
)}
}

export default Canvas

