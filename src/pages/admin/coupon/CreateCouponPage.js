import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import {
  getCoupons,
  removeCoupon,
  createCoupon,
} from "../../../functions/coupon";
import "react-datepicker/dist/react-datepicker.css";
import { DeleteOutlined, LoadingOutlined } from "@ant-design/icons";
import AdminNav from "../../../components/nav/AdminNav";

const CreateCouponPage = () => {
  const [name, setName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [discount, setDiscount] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [coupons, setCoupons] = useState([]);

  // redux
  const { user } = useSelector((state) => ({ ...state }));

  const catchEndpointAction = (err, setValue, value) => {
    console.log(err);
    setValue(value);
    toast.error(err.response.data.message);
  };

  const loadAllCoupons = useCallback(() => {
    setLoaded(false);
    getCoupons()
      .then((res) => {
        setLoaded(true);
        setCoupons(res.data);
      })
      .catch((err) => catchEndpointAction(err, setLoaded, true));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    createCoupon({ name, expiry, discount }, user.token)
      .then((res) => {
        setLoading(false);
        loadAllCoupons();
        setName("");
        setDiscount("");
        setExpiry("");
        toast.success(`"${res.data.name}" is created`);
      })
      .catch((err) => catchEndpointAction(err, setLoading, false));
  };

  const handleRemove = (couponId) => {
    if (window.confirm("Delete?")) {
      setLoading(true);
      removeCoupon(couponId, user.token)
        .then((res) => {
          setLoading(false);
          loadAllCoupons();
          toast.error(`Coupon "${res.data.name}" deleted`);
        })
        .catch((err) => catchEndpointAction(err, setLoading, false));
    }
  };

  useEffect(() => loadAllCoupons(), [loadAllCoupons]);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col-md-10">
          {(!loaded || loading) && <LoadingOutlined />}
          {loaded && !loading && <h4>Coupon</h4>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="text-muted">Name</label>
              <input
                type="text"
                className="form-control"
                onChange={(e) => setName(e.target.value)}
                value={name}
                autoFocus
                required
              />
            </div>

            <div className="form-group">
              <label className="text-muted">Discount %</label>
              <input
                type="text"
                className="form-control"
                onChange={(e) => setDiscount(e.target.value)}
                value={discount}
                required
              />
            </div>

            <div className="form-group">
              <label className="text-muted">Expiry</label>
              <br />
              <DatePicker
                className="form-control"
                dateFormat="dd/MM/yy"
                required
                selected={expiry}
                value={expiry}
                onChange={(date) => setExpiry(date)}
              />
            </div>

            <button className="btn btn-outline-primary">Save</button>
          </form>

          {loaded && (
            <>
              <br />

              <h4>{coupons.length} Coupons</h4>

              <table className="table table-bordered">
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Expiry</th>
                    <th scope="col">Discount</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {coupons.map((c) => (
                    <tr key={c._id}>
                      <td>{c.name}</td>
                      <td>{new Date(c.expiry).toLocaleDateString()}</td>
                      <td>{c.discount}%</td>
                      <td>
                        <DeleteOutlined
                          onClick={() => handleRemove(c._id)}
                          className="text-danger pointer"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateCouponPage;
