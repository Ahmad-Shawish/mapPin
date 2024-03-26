import Room from "@mui/icons-material/Room";
import CancelIcon from "@mui/icons-material/Cancel";
import "./register.css";
import { useRef, useState } from "react";
import axios from "axios";

const Register = ({ setShowRegister }) => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = {
      username: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      await axios.post("/users/register", newUser);
      setSuccess(true);
      setError(false);
    } catch (err) {
      setError(true);
    }
  };

  return (
    <div className="registerContainer">
      <div className="logo">
        <Room />
        AhmadPin
      </div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="username" ref={nameRef} />
        <input type="email" placeholder="email" ref={emailRef} />
        <input type="password" placeholder="password" ref={passwordRef} />
        <button className="registerBtn">Register</button>
        {success && (
          <span className="success">Successfull. You can login now!</span>
        )}
        {error && <span className="failure">Something went wrong!</span>}
      </form>
      <CancelIcon
        className="registerCancel"
        onClick={() => setShowRegister(false)}
      />
    </div>
  );
};

export default Register;
