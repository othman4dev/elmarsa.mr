import { useState } from "react";
import "./InfoContainer.scss";
import { useDispatch, useSelector } from "react-redux";
import { update } from "../../redux/apiCalls";
import { notifyUser } from "../notifyuser/ToastMessage";
import { toast } from "react-toastify";
import { updateSuccuss } from "../../redux/userSlice";
import { useTranslation } from "react-i18next";
import "../../locales/i18.js"; // Import the i18n config
const InfoContainer = () => {
  const { t, i18n } = useTranslation();
  const user = useSelector((stat) => stat.user.currentUser);

  const dispatch = useDispatch();
  const [userInfo, setUserInfo] = useState({
    username: user?.username || localStorage.getItem('name'),
    email: user?.email || localStorage.getItem('email'),
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleUpdate = (e) => {
    e.preventDefault();
    update(dispatch, userInfo, user._id).then(() => {
      notifyUser("succuss", "Votre compte a été mis à jour avec succès");
    });
  };
  return (
    <div className="infoContainer">
      <form>
        <label htmlFor="">{t('first_name')}</label>
        <div className="inputArea">
          <svg
            className="av-icon"
            height="40"
            width="40"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            fill="rgb(155, 155, 155)"
            aria-labelledby="AccountCircleTitleID"
          >
            <title id="AccountCircleTitleID">AccountCircle Icon</title>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2a7.2 7.2 0 01-6-3.22c.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08a7.2 7.2 0 01-6 3.22z"></path>
          </svg>
          <input
            type="text"
            placeholder={t('your_first_name')}
            name="username"
            value={userInfo.username}
            onChange={(e) => handleChange(e)}
          />
          <svg
            className="av-icon sc-1i9i8oo-1 gsixhk"
            height="32"
            width="32"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-labelledby="CloseCircleTitleID"
            fill="rgb(45, 45, 45)"
            onClick={() => setUserInfo((prev) => ({ ...prev, username: "" }))}
          >
            <title id="CloseCircleTitleID">CloseCircle Icon</title>
            <path d="M19.1 4.9C15.2 1 8.8 1 4.9 4.9 1 8.8 1 15.2 4.9 19.1 8.8 23 15.1 23 19 19.1c4-3.9 4-10.3.1-14.2zm-2.9 9.9l-1.4 1.4-2.8-2.8-2.8 2.8-1.4-1.4 2.8-2.8-2.8-2.8 1.4-1.4 2.8 2.8 2.8-2.8 1.4 1.4-2.8 2.8 2.8 2.8z"></path>
          </svg>
        </div>
        <label htmlFor="">{t('email')}</label>
        <div className="inputArea">
          <svg
            className="av-icon"
            height="40"
            width="40"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-labelledby="EmailTitleID"
            fill="rgb(155, 155, 155)"
          >
            <title id="EmailTitleID">Email Icon</title>
            <path d="M18.4 6c.88 0 1.6.72 1.6 1.6v9.6c0 .88-.72 1.6-1.6 1.6H5.6c-.88 0-1.6-.72-1.6-1.6l.008-9.6c0-.88.712-1.6 1.592-1.6h12.8zm-.8 11.2c.44 0 .8-.36.8-.8V9.2l-5.552 3.472a1.585 1.585 0 01-1.696 0L5.6 9.2v7.2c0 .44.36.8.8.8h11.2zM12 11.6l6.4-4H5.6l6.4 4z"></path>
          </svg>
          <input
            type="email"
            placeholder={t('your_email')}
            name="email"
            value={userInfo.email}
            onChange={(e) => handleChange(e)}
          />
          <svg
            onClick={() => setUserInfo((prev) => ({ ...prev, email: "" }))}
            className="av-icon sc-1i9i8oo-1 gsixhk"
            height="32"
            width="32"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-labelledby="CloseCircleTitleID"
            fill="rgb(45, 45, 45)"
          >
            <title id="CloseCircleTitleID">CloseCircle Icon</title>
            <path d="M19.1 4.9C15.2 1 8.8 1 4.9 4.9 1 8.8 1 15.2 4.9 19.1 8.8 23 15.1 23 19 19.1c4-3.9 4-10.3.1-14.2zm-2.9 9.9l-1.4 1.4-2.8-2.8-2.8 2.8-1.4-1.4 2.8-2.8-2.8-2.8 1.4-1.4 2.8 2.8 2.8-2.8 1.4 1.4-2.8 2.8 2.8 2.8z"></path>
          </svg>
        </div>
        <button onClick={(e) => handleUpdate(e)}>{t('save')}</button>
      </form>
    </div>
  );
};

export default InfoContainer;
