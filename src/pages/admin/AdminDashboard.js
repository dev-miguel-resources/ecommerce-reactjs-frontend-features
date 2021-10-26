import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { LoadingOutlined } from "@ant-design/icons";
import AdminNav from "../../components/nav/AdminNav";
import Orders from "../../components/order/Orders";
import { getOrders, changeStatus } from "../../functions/admin";
import { useCurrentItemHeader } from "../../hooks/useCurrentItemHeader";

const AdminDashboard = () => {
  useCurrentItemHeader();
  const [loaded, setLoaded] = useState(false);
  const [orders, setOrders] = useState([]);
  const { user } = useSelector((state) => ({ ...state }));

  const loadOrders = useCallback(() => {
    setLoaded(false);
    getOrders(user.token).then((res) => {
      console.log(JSON.stringify(res.data, null, 4));
      setLoaded(true);
      setOrders(res.data);
    });
  }, [user.token]);

  useEffect(() => loadOrders(), [loadOrders]);

  const handleStatusChange = (orderId, orderStatus) => {
    changeStatus(orderId, orderStatus, user.token).then(() => {
      toast.success("Status updated");
      loadOrders();
    });
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col text-center">
          {!loaded && <LoadingOutlined />}
          {loaded && (
            <>
              <h4>Admin Dashboard</h4>
              <Orders orders={orders} handleStatusChange={handleStatusChange} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
