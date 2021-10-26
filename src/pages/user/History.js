import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { CheckCircleOutlined, CloseCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ShowPaymentInfo from "../../components/cards/ShowPaymentInfo";
import AdminNav from "../../components/nav/AdminNav";
import UserNav from "../../components/nav/UserNav";
import Invoice from "../../components/order/Invoice";
import { getUserOrders } from "../../functions/user";
import { useCurrentItemHeader } from "../../hooks/useCurrentItemHeader";

const History = () => {
  useCurrentItemHeader();
  const [loaded, setLoaded] = useState(false);
  const [orders, setOrders] = useState([]);
  const { user } = useSelector((state) => ({ ...state }));

  const loadUserOrders = useCallback(() => {
    getUserOrders(user.token).then((res) => {
      console.log(JSON.stringify(res.data, null, 4));
      setOrders(res.data.reverse());
      setLoaded(true);
    });
  }, [user.token]);

  useEffect(() => loadUserOrders(), [loadUserOrders]);

  const showOrderInTable = (order) => (
    <div className="responsive-table container">
      <table className="table table-bordered">
        <thead className="thead-light">
          <tr>
            <th scope="col">Title</th>
            <th scope="col">Price</th>
            <th scope="col">Brand</th>
            <th scope="col">Color</th>
            <th scope="col">Count</th>
            <th scope="col">Shipping</th>
          </tr>
        </thead>
        <tbody>
          {order.products.map((p, i) => (
            <tr key={i}>
              <td>
                <b>{p.product.title}</b>
              </td>
              <td>{p.product.price}</td>
              <td>{p.product.brand}</td>
              <td>{p.color}</td>
              <td>{p.count}</td>
              <td>
                {p.product.shipping === "Yes" ? (
                  <CheckCircleOutlined style={{ color: "green" }} />
                ) : (
                  <CloseCircleOutlined style={{ color: "red" }} />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const showDownloadLink = (order) => (
    <PDFDownloadLink
      document={<Invoice order={order} />}
      fileName="invoice.pdf"
      className="btn btn-sm btn-block btn-outline-primary"
    >
      Download PDF
    </PDFDownloadLink>
  );

  const showEachOrders = () =>
    orders.map((order, i) => (
      <div key={i} className="m-5 p-3 card">
        <ShowPaymentInfo order={order} />
        {showOrderInTable(order)}
        <div className="row">
          <div className="col">{showDownloadLink(order)}</div>
        </div>
      </div>
    ));

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
        <div className="col text-center">
          {!loaded && <LoadingOutlined />}
          {loaded && (
            <>
              <h4>
                {orders.length > 0
                  ? "User purchase orders"
                  : "No purchase orders"}
              </h4>
              {showEachOrders()}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
