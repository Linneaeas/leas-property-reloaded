import React, { useState } from "react";
import "./App.css";
import LoginPage from "./Pages/login-page";
import { AdminNavigation } from "./Pages/Admin/admin-navigation";

function App() {
  const adminUser = {
    username: "Admin",
    password: "admin123",
  };

  const [user, setUser] = useState({ username: "" });
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const Login = (details) => {
    if (
      details.username === adminUser.username &&
      details.password === adminUser.password
    ) {
      setUser({
        username: details.username,
      });
      setIsAdmin(true);
    } else {
      setError("Wrong Username or Password, Please try again");
    }
  };

  const Logout = () => {
    setUser({ username: "" });
    setIsAdmin(false);
    setError("");
  };

  return (
    <main className="App">
      {isAdmin ? (
        <AdminNavigation Logout={Logout} />
      ) : (
        <LoginPage Login={Login} error={error} />
      )}
    </main>
  );
}

export default App;
