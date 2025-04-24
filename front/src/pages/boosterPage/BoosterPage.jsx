import { useState } from "react";
import "./BoosterPage.scss";
import Button from "../../components/button/Button";
const BoosterPage = () => {
      window.scrollTo({ top: 0, behavior: "auto" });
  const [active, setActive] = useState(0);
  const offers = [
    {
      title: "7 Jours",
      price: "60dh/semain",
      finalPrice: "150 DH",
    },
    {
      title: "14 Jours",
      price: "60dh/semain",
      finalPrice: "200 DH",
    },
    {
      title: "30 Jours",
      price: "60dh/semain",
      finalPrice: "200 DH",
    },
  ];
  //console.log(active);

  return (
    <div className="boosterPage">
      <div className="top">
        <img src="../test.png" alt="" />
      </div>
      <div className="bottom">
        <div className="info">
          <div className="title">
            <p>ANNONCE PREMIUM</p>
            <span>Jusqu’a 20 fois plus d’appels</span>
          </div>
          <div className="offers">
            <div className="offerTop">
              <span>16 fois plus de vues</span>
              <span>6 fois plus de Leads</span>
            </div>
            <div className="offerBottom">
              {offers.map((offer, index) => {
                return (
                  <div
                    key={index}
                    className={`item ${active === index ? "active" : ""}`}
                    onClick={() => setActive(index)}
                  >
                    <div className="left">
                      <div className="circle"></div>
                      <div className="inf">
                        <p>{offer.title}</p>
                        <span>{offer.price}</span>
                      </div>
                    </div>
                    <div className="right">
                      <p>{offer.finalPrice}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <Button label={"Payer"} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoosterPage;
