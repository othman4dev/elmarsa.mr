import { useState } from "react";
import SideBarSetting from "../../components/sideBarSetting/SideBarSetting";
import "./Settings.scss";
import InfoContainer from "../../components/infoContainer/InfoContainer";
import PassContainer from "../../components/passContainer/PassContainer";

const Settings = () => {
  const [activeComponents, setActiveComponents] = useState("info");

  return (
    <div className="setting">
      <div className="left">
        <SideBarSetting setActiveComponents={setActiveComponents} />
      </div>
      {activeComponents === "info" && (
          <InfoContainer />
      )}
      {activeComponents === "pass" && <PassContainer/>}
    </div>
  );
};

export default Settings;
