import { Navigate, useNavigate } from "react-router-dom";
import Button from "../../components/button/Button";
import "./ErrorPage.scss";

const ErrorPage = () => {
      window.scrollTo({ top: 0, behavior: "auto" });
  const navigate = useNavigate();
  return (
    <div className="error">
      <div className="errorItem">
        <img src="../errorPage.png" alt="" />
        <h3>404, Page not founds</h3>
        <p>
          Something went wrong. It’s look that your requested could not be
          found. It’s look like the link is broken or the page is removed.
        </p>

        <Button label={"go back"} onClick={() => navigate("/")} />
      </div>
    </div>
  );
};

export default ErrorPage;
