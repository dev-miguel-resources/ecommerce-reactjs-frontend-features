import React from "react";

const ShowPaymentInfo = ({ order, showStatus = true }) => {
  return (
    <div className="text-uppercase">
      <p>
        <span>
          <strong>Order Id:</strong> {order.paymentIntent.id || order._id}
        </span>
        {" / "}
        <span>
          <strong>Amount:</strong>{" "}
          {(order.paymentIntent.amount / 100).toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </span>
        {" / "}
        <span>
          <strong>Currency:</strong>{" "}
          {order.paymentIntent.currency.toUpperCase()}
        </span>
        {" / "}
        <span>
          <strong>Method:</strong> {order.paymentIntent.payment_method_types[0]}
        </span>
        {" / "}
        <span>
          <strong>Payment:</strong> {order.paymentIntent.status.toUpperCase()}
        </span>
        {" / "}
        <span>
          <strong>Orderd on:</strong>{" "}
          {new Date(order.paymentIntent.created * 1000).toLocaleString()}
        </span>
        <br />
        {showStatus && (
          <>
            {" / "}
            <span className="badge bg-primary text-white">
              <strong>STATUS:</strong> {order.orderStatus}
            </span>
          </>
        )}
      </p>
    </div>
  );
};

export default ShowPaymentInfo;
