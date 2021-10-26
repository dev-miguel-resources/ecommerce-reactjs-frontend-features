import React, { useCallback, useEffect, useState } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { getCategories } from "../../../functions/category";
import { createSub, removeSub, getSubs } from "../../../functions/sub";
import { Link } from "react-router-dom";
import {
  DeleteOutlined,
  EditOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import CategoryForm from "../../../components/forms/CategoryForm";
import LocalSearch from "../../../components/forms/LocalSearch";

const SubCreate = () => {
  const { user } = useSelector((state) => ({ ...state }));

  const [name, setName] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [subs, setSubs] = useState([]);
  // step 1
  const [keyword, setKeyword] = useState("");

  const catchEndpointAction = (err) => {
    console.log(err);
    setLoading(false);
    return err.response.status === 400 && toast.error(err.response.data);
  };

  const loadCategories = () =>
    getCategories().then((c) => setCategories(c.data));

  const loadSubs = () => {
    setLoaded(false);
    getSubs().then((s) => {
      setLoaded(true);
      setSubs(s.data);
    });
  };

  const loadCategoriesAndSubs = useCallback(async () => {
    await loadCategories();
    loadSubs();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    createSub({ name, parent: category }, user.token)
      .then((res) => {
        setLoading(false);
        loadSubs();
        setName("");
        toast.success(`"${res.data.name}" is created`);
      })
      .catch((err) => catchEndpointAction(err));
  };

  const handleRemove = async (slug) => {
    if (window.confirm("Delete?")) {
      setLoading(true);
      removeSub(slug, user.token)
        .then((res) => {
          setLoading(false);
          loadSubs();
          toast.error(`${res.data.name} deleted`);
        })
        .catch((err) => catchEndpointAction(err));
    }
  };

  // step 4
  const searched = (keyword) => (c) => c.name.toLowerCase().includes(keyword);

  useEffect(() => loadCategoriesAndSubs(), [loadCategoriesAndSubs]);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col">
          {(!loaded || loading) && <LoadingOutlined />}
          {loaded && !loading && <h4>Create sub category</h4>}
          {loaded && (
            <div className="form-group">
              <label>Parent category</label>
              <select
                name="category"
                className="form-control"
                onChange={(e) => setCategory(e.target.value)}
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
          )}
          <CategoryForm
            handleSubmit={handleSubmit}
            name={name}
            setName={setName}
          />
          {loaded && (
            <>
              {/* step 2 and step 3 */}
              <LocalSearch keyword={keyword} setKeyword={setKeyword} />

              {/* step 5 */}
              {subs.filter(searched(keyword)).map((s) => (
                <div className="alert alert-secondary" key={s._id}>
                  {s.name}
                  <span
                    onClick={() => handleRemove(s.slug)}
                    className="btn btn-sm float-right"
                  >
                    <DeleteOutlined className="text-danger" />
                  </span>
                  <Link to={`/admin/sub/${s.slug}`}>
                    <span className="btn btn-sm float-right">
                      <EditOutlined className="text-warning" />
                    </span>
                  </Link>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubCreate;
