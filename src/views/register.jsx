import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios"
import "./register.css"
import Toast from "../sweetalert";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [disableForm, setDisableForm] = useState(false);
  const [showAlert, setShowAlert] = useState(false);


  const handleSubmit = async (event) => {
    event.preventDefault();
    setDisableForm(true);
    try {
      await axios.post("/api/register", { name, email, password })
      resetForm()
    } catch (error) {
      Toast.fire({ icon: "error", title: error.response.data.message})
    } finally {
      setDisableForm(false);
    }
  };

  const resetForm = () => {
    setDisableForm(false);
    setName("")
    setEmail("")
    setPassword("")
    setShowAlert(true)
  }

  return (
    <div className="main-register">
      <h1 className="mb-4">Register now!</h1>
      {showAlert && (
        <div className="alert card-maximum-500 alert-success alert-dismissible" role="success">
          <div>Registration successfully, <Link to={"/login"} className="alert-link">login here</Link> now!</div>
        </div>
      )}
      <div className="card card-maximum-500">
        <form className="card-body" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Enter your name</label>
            <input type="text" className="form-control" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input type="email" className="form-control" placeholder="example@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="text-center">
            <button type="submit" className="btn btn-primary" disabled={disableForm}>Register</button>
          </div>
        </form>
      </div>
      <p className="mt-4">Already have an account? <Link to={"/login"}>login here</Link></p>
    </div>


  )
}