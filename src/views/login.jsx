import { useState } from "react";
import { Link } from "react-router-dom";



export default function Login() {
  const [showAlert, setShowAlert] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [disableForm, setDisableForm] = useState(false);



  const handleSubmit = async (event) => {
    event.preventDefault();
    alert("Hihihihi")
  };



  return (
    <div className="main-register">
      <h1 className="mb-4">Login</h1>
      {showAlert && (
        <div className="alert card-maximum-500 alert-danger alert-dismissible" role="danger">
          <div>Incorrect email or password</div>
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