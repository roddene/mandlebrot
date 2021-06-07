import Canvas from './Canvas'
import React from 'react';

class Controller extends React.Component {
    constructor(props){
      super(props);  
          this.state = {
            c:[0,0]
          }
        }

    handleRightClick = (coords)=>{
        //console.log("setting",coords);
    this.setState((state) => ({
        c:[coords[0]+coords[2],coords[1]+coords[3]]//this works for an unknown reason
      }));
    }

        render(){
    return (
      <div className="controller">
          
          <Canvas dimensions = {[900,600]} type = "mandlebrot" constant = {[0,0]} rightClick = {this.handleRightClick}></Canvas>
          <Canvas dimensions = {[900,600]} type = "julia" constant = {this.state.c} rightClick = {this.handleRightClick}></Canvas>
      </div>//may need to add handler later??
    );
  


      
  }
    
  }
  
  export default Controller;