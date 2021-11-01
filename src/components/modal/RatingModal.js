import React, { useState } from "react";
import { Modal } from "antd";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { StarOutlined } from "@ant-design/icons";

const RatingModal = ({ children }) => {
  const history = useHistory();
  const { slug } = useParams();
  const { user } = useSelector((state) => ({ ...state }));
  const [modalVisible, setModalVisible] = useState(false);

  const divOnClick = () =>
    user?.token
      ? setModalVisible(true)
      : history.push({
          pathname: "/login",
          state: { from: `/product/${slug}` },
        });

  const modalOnClick = () => {
    setModalVisible(false);
    toast.success("Thanks for your review. It will apper soon");
  };

  return (
    <>
      <div onClick={divOnClick}>
        <StarOutlined className="text-danger" /> <br />{" "}
        {`${user?.token ? "" : "Login To "}Leave Rating`}
      </div>
      <Modal
        title="Leave your rating"
        centered
        visible={modalVisible}
        onOk={modalOnClick}
        onCancel={() => setModalVisible(false)}
      >
        {children}
      </Modal>
    </>
  );
};

export default RatingModal;
