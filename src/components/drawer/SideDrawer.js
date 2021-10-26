import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { Drawer } from "antd";
import laptop from "../../images/laptop.png";

const SideDrawer = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { drawer, cart } = useSelector((state) => ({ ...state }));
  const setVisible = () => dispatch({ type: "SET_VISIBLE", payload: false });

  const goToCart = () => {
    setVisible();
    history.push("/cart");
  };

  const getAltImg = (product) =>
    product.images[0] ? "p-img-drawer" : "p-notimg-drawer";

  const getSrcImg = (product) =>
    product.images[0] ? product.images[0].url : laptop;

  const getStyleImg = () => ({
    width: "100%",
    height: "50px",
    objectFit: "cover",
  });

  return (
    <Drawer
      className="text-center"
      title={`Cart / ${cart.length} Product`}
      placement="right"
      closable={false}
      onClose={setVisible}
      visible={drawer}
    >
      {cart.map((p) => (
        <div key={p._id} className="row">
          <div className="col">
            <img alt={getAltImg(p)} src={getSrcImg(p)} style={getStyleImg()} />
            <p className="text-center bg-secondary text-light">
              {p.title} x {p.count}
            </p>
          </div>
        </div>
      ))}
      <button
        onClick={goToCart}
        className="text-center btn btn-primary btn-raised btn-block"
      >
        Go To Cart
      </button>
    </Drawer>
  );
};

export default SideDrawer;
