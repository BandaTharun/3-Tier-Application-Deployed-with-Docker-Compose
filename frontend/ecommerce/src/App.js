import React from "react";
import { HashRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Header from "./components/Header";
import HomeScreen from "./components/screens/HomeScreen";
import SignupScreen from "./components/screens/SignupScreen";
import LoginScreen from "./components/screens/LoginScreen";
import Logout from "./components/screens/Logout";
import ProductScreen from "./components/screens/ProductScreen";
import MyList from "./components/Mylist";
import MyRateings from "./components/Myratings";
import Myrecommendation from "./components/recommendation";
import Adminlogin from "./components/adminlogin";
import Adminpage from "./components/admin";
import ManageMovies from "./components/Managemovies";
import ManageUsers from "./components/Manageusers";
import Adminheader from "./components/adminheader";


const Main = () => (
  <>
    <Header />
    <Outlet />
  </>
);

const Art = () => (
  <>
    <Adminheader />
    <Outlet />
  </>
);

export default function App() {
  return (
    <Router>

        <Routes>
          <Route element={<Main />}>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/signup" element={<SignupScreen />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/movies/:id" element={<ProductScreen />} />
            <Route path="/MyRatings" element={<MyRateings />} />
            <Route path="/mylist" element={<MyList />} />
            <Route path="/GetRecommendation" element={<Myrecommendation />} />
          </Route>

          <Route element={<Art />}>
            <Route path="/Admin" element={<Adminlogin />} />
            <Route path="/Adminpage" element={<Adminpage />} />
            <Route path="/admin/manage-movies" element={<ManageMovies />} />
            <Route path="/admin/manage-users" element={<ManageUsers />} />
          </Route>

      </Routes>
    </Router>
  );
}
