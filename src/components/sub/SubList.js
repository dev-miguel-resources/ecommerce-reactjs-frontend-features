import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";
import { getSubs } from "../../functions/sub";

const SubList = () => {
  const history = useHistory();
  const [subs, setSubs] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getSubs().then((res) => {
      setSubs(res.data);
      setLoaded(true);
    });
  }, []);

  const showSubs = () =>
    subs.map((s) => (
      <button
        key={s._id}
        className="col btn btn-outlined-primary btn-lg btn-block btn-raised m-3 color-blue"
        onClick={() => history.push(`/sub/${s.slug}`)}
      >
        {s.name}
      </button>
    ));

  return (
    <div className="container">
      <div className="row">
        {!loaded && <LoadingOutlined />}
        {loaded && showSubs()}
      </div>
    </div>
  );
};

export default SubList;
