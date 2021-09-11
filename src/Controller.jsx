import Canvas from './Canvas'
import React from 'react';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';



class Controller extends React.Component {
    constructor(props){
      super(props);  
          this.state = {
            c:[0,0],
            workerCount:1,
            dimensions:[864,576]
          }
        this.can = true;  
        }

    handleRightClick = (coords)=>{
        //console.log("setting",coords);
    this.setState((state) => ({
        c:[coords[0]+coords[2],coords[1]+coords[3]]//this works for an unknown reason
      }));
    }

    changeWorkerCount = (event) =>{
      this.setState({workerCount:event.target.value})
    }

    canEdit = (can) =>{

      this.can=can;
    }

    valuetext =(value) =>{
      if(this.can){
      const val = value['target'].getAttribute('aria-valuenow');
      if((val>99 &&val<1600)){
        this.setState({dimensions:[(3*48*val/2)/50,parseInt(val)*48/50]})
      }else{
        console.log("error");
      }
    }
      
    }

        render(){
    return (
      <div className="controller">
        <div className = "hbox">
          <Typography id = "workertype">
            Workers: 
          </Typography>
          <select id = "worker-select" onChange = {this.changeWorkerCount}>
            <option value = "1">1</option>
            <option value = "2">2</option>
            <option value = "4">4</option>
            <option value = "8">8</option>
            <option value = "16">16</option>
          </select>
        
          </div>
          <br></br>
          <div className = "hbox">
          <Typography id="discrete-slider">
            Size:
      </Typography>
          <Slider id = "dimslider" defaultValue={600}
        onChangeCommitted	={this.valuetext}
        aria-labelledby="discrete-slider"
        valueLabelDisplay="auto"
        step={50}
        marks
        min={100}
        max={1100}></Slider>
          </div>
          <div className = "hbox">
          <Canvas dimensions = {this.state.dimensions} type = "mandelbrot" constant = {[0,0]} rightClick = {this.handleRightClick} workerCount = {this.state.workerCount} canEdit = {this.canEdit}></Canvas>
          <Canvas dimensions = {this.state.dimensions} type = "julia" constant = {this.state.c} rightClick = {this.handleRightClick}  workerCount = {this.state.workerCount} canEdit = {this.canEdit}></Canvas>
          </div>
      </div>//may need to add handler later??
    );
  


      
  }
    
  }
  
  export default Controller;