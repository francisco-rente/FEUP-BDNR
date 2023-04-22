import './App.css';

import {Routes,Route,BrowserRouter} from "react-router-dom";

import Product from "./pages/Product";
import Store from "./pages/Store";
import ProductList from "./pages/ProductList";
import ReviewList from "./pages/ReviewList";
import Customer from "./pages/Customer";

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<ProductList />} />
      <Route path="/product:id" element={<Product />} />
      <Route path="/store:id" element={<Store/>} />
      <Route path="/productList" element={<ProductList/>} />
      <Route path="/reviewList" element={<ReviewList/>} />
      <Route path="/customer" element={<Customer/>} />
    </Routes>
    </BrowserRouter>
  ); 
}
export default App;
