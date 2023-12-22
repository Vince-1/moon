import logo from "./logo.svg";
import "./App.css";
import { Switch, Route, Link } from "wouter";
import { MoveableBox } from "./pages/moveBox";
import { Home } from "./pages/home";

function App() {
  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
      <Link href="/">
        <a>home</a>
      </Link>
      <Link href="/moveableBoxes">
        <a>moveable boxes</a>
      </Link>
      <Switch>
        <Route path="/home">
          <Home></Home>
        </Route>
        <Route path="/">
          <Home></Home>
        </Route>
        <Route path="/moveableBoxes">
          <MoveableBox></MoveableBox>
        </Route>
        <Route path="/home"></Route>
        <Route path="/home"></Route>
      </Switch>
    </div>
  );
}

export default App;
