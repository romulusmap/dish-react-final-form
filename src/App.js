import logo from "./logo.svg";
import "./App.css";
import PizzaForm from "./PizzaForm";

function App() {
  return (
    <>
      <div className="App">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>Add new dish!</h2>
        <div>
          <PizzaForm></PizzaForm>
        </div>
      </div>
    </>
  );
}

export default App;
