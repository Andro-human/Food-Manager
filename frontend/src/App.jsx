import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import PrivateRoute from "./components/auth/PrivateRoute";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import axios from "axios";
import { Loader } from "./components/shared/Loader";
import { userExists, userNotExists } from "./redux/reducers/auth";
import { Toaster } from "react-hot-toast";

function App() {
  const { user, isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_SERVER}api/v1/auth/profile`, {
        withCredentials: true,
      })
      .then(({ data }) => dispatch(userExists(data.user)))
      .catch(() => dispatch(userNotExists()));
  }, [dispatch]);
  return isLoading ? (
    <Loader />
  ) : (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<PrivateRoute user={!user} />}>
          <Route path="/login" element={<Login />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster postition="bottom-center" />
    </Router>
  );
}

export default App;
