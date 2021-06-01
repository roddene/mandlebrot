import Canvas from './Canvas'
import React from 'react';

class Controller extends React.Component {
    constructor(props){
      super(props);  
          this.state = {
          
          }
        }

        render(){
    return (
      <div className="controller">
          <Canvas></Canvas>
      </div>
    );
  


      
  }
    
  }
  
  export default Controller;