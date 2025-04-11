import React from "react";
import ReactDOM from "react-dom/client";
import Home from "./pages/home";
import Homemain from "./pages/homemain";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/global.scss";
import "./styles/mainbar.css";
import "./styles/style.css";
import "./styles/styleinput.css";
import "rsuite/dist/rsuite.min.css"
import "rsuite/dist/rsuite-no-reset.min.css";
const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <React.StrictMode>

    <Homemain />
  </React.StrictMode>


);