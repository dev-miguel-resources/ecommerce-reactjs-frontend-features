import React, { useState } from "react";
import { useSelector } from "react-redux";
import { LoadingOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { auth } from "../../firebase";
import UserNav from "../../components/nav/UserNav";
import AdminNav from "../../components/nav/AdminNav";

const Password = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useSelector((state) => ({ ...state }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // console.log(password);

    await auth.currentUser
      .updatePassword(password)
      .then(() => {
        setLoading(false);
        setPassword("");
        toast.success("Password updated");
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.message);
      });
  };

  const passwordUpdateForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Your Password</label>
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          className="form-control"
          placeholder="Enter new password"
          disabled={loading}
          value={password}
          autoFocus
        />
        <button
          className="btn btn-primary"
          disabled={!password || password.length < 6 || loading}
        >
          Submit
        </button>
      </div>
    </form>
  );

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          {user && user.token && user.role === "admin" ? (
            <AdminNav />
          ) : (
            <UserNav />
          )}
        </div>
        <div className="col">
          {loading && <LoadingOutlined />}
          {!loading && <h4>Password Update</h4>}
          {passwordUpdateForm()}
        </div>
      </div>
    </div>
  );
};

export default Password;
