import './App.css';

import {Routes,Route,BrowserRouter} from "react-router-dom";

import Product from "./pages/Product";
import StoreList from "./pages/StoreList";
import ProductList from "./pages/ProductList";
import ReviewList from "./pages/ReviewList";
import Customer from "./pages/Customer";
import Login from "./pages/Login";
import Profile from "./pages/Profile";

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<ProductList />} />
      <Route path="/product/:id" element={<Product />} />
      <Route path="/login" element={<Login />} />
     {/*<Route path="/store:id" element={<Ind/>} */}
      <Route path="/productList" element={<ProductList/>} />
      <Route path="/reviewList" element={<ReviewList/>} />
    {/*  <Route path="/customer" element={<Customer/>} />*/}
      <Route path="/storeList" element={<StoreList/>} />
      <Route path="*" element={<h1>Not Found</h1>} />
      <Route path="/profile" element={<Profile/>} />
      <Route path="/user/:id" element={<Profile/>} />
    </Routes>
    </BrowserRouter>
  ); 
}
export default App;
