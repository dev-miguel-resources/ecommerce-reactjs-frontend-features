import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { LoadingOutlined } from "@ant-design/icons";
import CategoryForm from "../../../components/forms/CategoryForm";
import AdminNav from "../../../components/nav/AdminNav";
import { getCategories } from "../../../functions/category";
import { updateSub, getSub } from "../../../functions/sub";

const SubUpdate = ({ match, history }) => {
  const { user } = useSelector((state) => ({ ...state }));

  const [name, setName] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [categories, setCategories] = useState([]);
  const [parent, setParent] = useState("");

  const loadCategories = () =>
    getCategories().then((c) => setCategories(c.data));

  const loadSub = useCallback(
    () =>
      getSub(match.params.slug).then((s) => {
        setLoaded(true);
        setName(s.data.sub.name);
        setParent(s.data.sub.parent);
      }),
    [match.params.slug]
  );

  const loadCategoriesAndSub = useCallback(async () => {
    await loadCategories();
    loadSub();
  }, [loadSub]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoaded(false);
    updateSub(match.params.slug, { name, parent }, user.token)
      .then((res) => {
        setLoaded(true);
        setName("");
        toast.success(`"${res.data.name}" is updated`);
        history.push("/admin/sub");
      })
      .catch((err) => {
        console.log(err);
        setLoaded(true);
        return err.response.status === 400 && toast.error(err.response.data);
      });
  };

  useEffect(() => loadCategoriesAndSub(), [loadCategoriesAndSub]);

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
              <h4>Update sub category</h4>
              <div className="form-group">
                <label>Parent category</label>
                <select
                  name="category"
                  className="form-control"
                  value={parent}
                  onChange={(e) => setParent(e.target.value)}
                >
                  <option>Please select</option>
                  {categories.length > 0 &&
                    categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                </select>
              </div>
            </>
          )}
          <CategoryForm
            handleSubmit={handleSubmit}
            name={name}
            setName={setName}
          />
        </div>
      </div>
    </div>
  );
};

export default SubUpdate;
