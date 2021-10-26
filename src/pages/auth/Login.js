import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "antd";
import { GoogleOutlined, LoadingOutlined, MailOutlined } from "@ant-design/icons";
import { auth, googleAuthProvider } from "../../firebase";
import { createOrUpdateUser, currentUser } from "../../functions/auth";
import { useCurrentItemHeader } from "../../hooks/useCurrentItemHeader";

const Login = ({ history }) => {
  useCurrentItemHeader();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => ({ ...state }));
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    !history.location.state && user?.token && history.push("/");
  }, [user, history]);

  const roleBasedRedirect = (
    { data: { name, email, role, _id } },
    { token }
  ) => {
    const payload = { name, email, token, role, _id };
    const { state: intended } = history.location;
    const dashboard = role === "admin" ? "/admin/dashboard" : "/user/history";
    const redirect = intended?.from || dashboard;
    dispatch({ type: "LOGGED_IN_USER", payload });
    history.push(redirect);
  };

  const setToastErrorMessage = (err) => {
    console.log(err);
    toast.error(err.message);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await auth.signInWithEmailAndPassword(email, password);
      const idTokenResult = await result.user.getIdTokenResult();

      currentUser(idTokenResult.token)
        .then((res) => roleBasedRedirect(res, idTokenResult))
        .catch((err) => console.log(err));
    } catch (err) {
      setToastErrorMessage(err);
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    auth
      .signInWithPopup(googleAuthProvider)
      .then(async (result) => {
        const { user } = result;
        const idTokenResult = await user.getIdTokenResult();
        createOrUpdateUser(idTokenResult.token)
          .then((res) => roleBasedRedirect(res, idTokenResult))
          .catch((err) => console.log(err));
      })
      .catch((err) => {
        setToastErrorMessage(err);
      });
  };

  const loginForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          autoFocus
        />
      </div>

      <div className="form-group">
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your password"
        />
      </div>

      <br />
      <Button
        onClick={handleSubmit}
        type="primary"
        className="mb-3"
        block
        shape="round"
        icon={<MailOutlined />}
        size="large"
        disabled={!email || password.length < 6}
      >
        Login with Email/Password
      </Button>
    </form>
  );

  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          {loading && <LoadingOutlined />}
          {!loading && <h4>Login</h4>}
          {loginForm()}

          <Button
            onClick={googleLogin}
            type="danger"
            className="mb-3"
            block
            shape="round"
            icon={<GoogleOutlined />}
            size="large"
          >
            Login with Google
          </Button>

          <Link to="/forgot/password" className="float-right text-danger">
            Forgot Password
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
