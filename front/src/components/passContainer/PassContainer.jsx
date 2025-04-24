import { useState } from "react";
import "./PassContainer.scss";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { update } from "../../redux/apiCalls";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import "../../locales/i18.js"; // Import the i18n config
const PassContainer = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleUpdate = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      update(dispatch, { oldPassword, password });
    } else {
      toast.error("Passwords not match", {
        theme: "colored",
        position: "top-center",
      });
    }
  };
  return (
    <div className="passContainer">
      <form>
        <label htmlFor="">{t('password')}</label>
        <div className="inputArea">
          <input
            type="text"
            placeholder={t('current_password')}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </div>
        <label htmlFor="">{t('new_password')}</label>
        <div className="inputArea">
          <input
            type="text"
            placeholder={t('new_password')}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <label htmlFor="">{t('confirm_password')}</label>
        <div className="inputArea">
          <input
            type="text"
            placeholder={t('confirm_password')}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button onClick={(e) => handleUpdate(e)}>{t('save')}</button>
      </form>
    </div>
  );
};

export default PassContainer;
