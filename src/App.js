import Controller from './Controller'
import './App.css';
import Typography from '@material-ui/core/Typography';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h3>
          Mandelbrot Set Visualizer

        </h3>
        <Typography>
          Left click on the image to draw a rectangle and left click again to zoom in again.
        </Typography>
        <Typography>
          Right click on the Mandelbrot set to generate the Julia set associated with that specific point.
        </Typography>
        <Controller></Controller>
        <a id = "github" href = "https://github.com/roddene/mandlebrot">Check out the code on Github</a>
      </header>
    </div>
  );
}

export default App;
