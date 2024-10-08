import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios"
import { useNavigate } from "react-router-dom";
import Toast from "../sweetalert";
import Logo from "../assets/logo.webp"

export default function Login() {
  const [showAlert, setShowAlert] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [disableForm, setDisableForm] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setDisableForm(true);
    try {
      const response = await axios.post("/api/login", {email,password})
      Toast.fire({ icon: 'success', title: 'Welcome!'})
      setShowAlert("")
      localStorage.setItem("token", response.data.token);
      axios.defaults.headers.common = {'Authorization': `bearer ${response.data.token}`}
      return navigate("/");
    } catch (error) {
      setShowAlert(error.response.data.message)
    } finally {
      setDisableForm(false);
    }
  };

  return (
    <div className="main-register">
      <h1 className="mb-4">Login <img src={Logo} className="logo-login" /></h1>
      {showAlert && (
        <div className="alert card-maximum-500 alert-danger alert-dismissible" role="danger">
          <div>{showAlert}</div>
        </div>
      )}
      <div className="card card-maximum-500">
        <form className="card-body" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input type="email" className="form-control" placeholder="example@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="text-center">
            <button type="submit" className="btn btn-primary" disabled={disableForm}>Login</button>
          </div>
        </form>
      </div>
      <p className="mt-4">Don't have an account? <Link to={"/register"}>register here</Link></p>
    </div>
  )
}