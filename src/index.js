import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Package from './pages/Package';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Login from './pages/Login';
import Home from './pages/Home';
import Product from './pages/Product';
import User from './pages/User';
import Sale from './pages/Sale';
import SaveBill from './pages/SaveBill';
import AllPayBill from './pages/AllPayBill';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Package />,
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/home",
    element: <Home />
  },
  {
    path: "/product",
    element: <Product />
  },
  {
    path: "/user",
    element: <User />
  },
  {
    path: "/sale",
    element: <Sale />
  },
  {
    path: "/savebill",
    element: <SaveBill />
  },
  {
    path: "/allpaybill",
    element: <AllPayBill />
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={router} />
);

reportWebVitals();


