import "./Button.scss";

const Button = ({ label,icon ,onClick}) => {
  return <button className="button" onClick={ onClick }>{ label } { icon}</button>;
};

export default Button;
