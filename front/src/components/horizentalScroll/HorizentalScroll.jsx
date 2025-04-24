import "./HorizentalScroll.scss";
import ProductCard from "../productCard/ProductCard";
import { useRef } from "react";

const HorizontalScroll = ({ data }) => {
    const scrollContainerRef = useRef(null);
    const scrollLeft = () => {
      scrollContainerRef.current.scrollBy({ left: -600, behavior: "smooth" });
    };

    const scrollRight = () => {
      scrollContainerRef.current.scrollBy({ left: 600, behavior: "smooth" });
  };
  
  return (
    <div className="scrollContainer">
      <div className="products" ref={scrollContainerRef}>
        {data.map((item) => {
          return <ProductCard item={item} />;
        })}
        
      </div>
      <div className="buttons">
        <div className="btnLeft" onClick={scrollLeft}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="25"
            viewBox="0 0 24 25"
            fill="none"
          >
            <path
              d="M15.6998 8.20957L11.0998 12.8096L15.6998 17.4096L14.2998 18.8096L8.2998 12.8096L14.2998 6.80957L15.6998 8.20957Z"
              fill="#666666"
            />
          </svg>
        </div>
        <div className="btnRight" onClick={scrollRight}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="25"
            viewBox="0 0 24 25"
            fill="none"
          >
            <path
              d="M8.58984 17.3896L13.1698 12.8096L8.58984 8.21957L9.99984 6.80957L15.9998 12.8096L9.99984 18.8096L8.58984 17.3896Z"
              fill="#666666"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default HorizontalScroll;
