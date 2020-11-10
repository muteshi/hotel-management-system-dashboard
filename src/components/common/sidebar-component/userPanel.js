import React, { Fragment, useState, useEffect } from "react";
import sixteen from "../../../assets/images/user/16.png";
import { Link } from "react-router-dom";
import { Edit } from "react-feather";
import auth from "../../../services/authService";

const UserPanel = () => {
  // const url = "";
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const user = auth.getCurrentUser();
    setUserData(user);
  }, []);

  return (
    <Fragment>
      <div className="sidebar-user text-center">
        <div>
          <img className="img-80 rounded-circle" src={sixteen} alt="#" />
          <div className="profile-edit">
            <Link to={`${process.env.PUBLIC_URL}/users/${userData.user_id}`}>
              {userData.name}
              <Edit />
            </Link>
          </div>
        </div>
        <h6 className="mt-3 f-14">{userData.name}</h6>
        <p>
          {userData.is_superuser
            ? "Super Admin"
            : userData.is_staff
            ? "Admin"
            : "Guest"}
        </p>
      </div>
    </Fragment>
  );
};

export default UserPanel;
