import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { LoadingOutlined } from "@ant-design/icons";
import CategoryForm from "../../../components/forms/CategoryForm";
import AdminNav from "../../../components/nav/AdminNav";
import { getCategory, updateCategory } from "../../../functions/category";

const CategoryUpdate = ({ history, match }) => {
  const { user } = useSelector((state) => ({ ...state }));

  const [name, setName] = useState("");
  const [loaded, setLoaded] = useState(false);

  const loadCategory = useCallback(
    () =>
      getCategory(match.params.slug).then((c) => {
        setLoaded(true);
        setName(c.data.category.name);
      }),
    [match.params.slug]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoaded(false);
    updateCategory(match.params.slug, { name }, user.token)
      .then((res) => {
        setLoaded(true);
        setName("");
        toast.success(`"${res.data.name}" is updated`);
        history.push("/admin/category");
      })
      .catch((err) => {
        console.log(err);
        setLoaded(true);
        return err.response.status === 400 && toast.error(err.response.data);
      });
  };

  useEffect(() => loadCategory(), [loadCategory]);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col">
          {!loaded && <LoadingOutlined />}
          {loaded && (
            <>
              <h4>Update category</h4>
              <CategoryForm
                handleSubmit={handleSubmit}
                name={name}
                setName={setName}
              />
              <hr />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryUpdate;
