import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";
import { getCategories } from "../../functions/category";

const CategoryList = () => {
  const history = useHistory();
  const [categories, setCategories] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getCategories().then((c) => {
      setCategories(c.data);
      setLoaded(true);
    });
  }, []);

  const showCategories = () =>
    categories.map((c) => (
      <button
        key={c._id}
        className="col btn btn-outlined-primary btn-lg btn-block btn-raised m-3 color-blue"
        onClick={() => history.push(`/category/${c.slug}`)}
      >
        {c.name}
      </button>
    ));

  return (
    <div className="container">
      <div className="row">
        {!loaded && <LoadingOutlined />}
        {loaded && showCategories()}
      </div>
    </div>
  );
};

export default CategoryList;
