import React from "react";
import ReactDOM from "react-dom";

export default function render(reducer, Routes, renderedElement) {
  ReactDOM.render(<Routes />, renderedElement);
}
