import './App.css';
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import { Category } from './Category';

function App() {


  return (
    <>
      <div className='App'>
        <Router>
          <Routes>
            <Route path="/" element={<Category />} />
          </Routes >
        </Router >
      </div >
    </>
  )
}

export default App;
