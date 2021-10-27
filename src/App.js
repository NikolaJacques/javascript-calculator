import Container from "./components/Container/Container.js";
import Context from "./components/Context.js";

function App() {
  return (  
    <Context>  
      <div className="App">
          <Container />
      </div>
    </Context>

  );
}

export default App;
