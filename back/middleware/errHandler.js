import AppError from "../AppError.js";

const errHandler = (error, req, res, next) => {
  
  if (error.isJoi) {
    error.statusCode = 400;
    error.message = error.details[0].message;
    return res.status(error.statusCode).json({
      status: "failed",
      message: error.message,
      details: error.detail,
    });
  }
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: "failed",
      message: error.message,
      details: error.detail,
    });
  }
  console.log("error:", error);

  if (error.code === 11000) {

    const key = Object.keys(error.keyPattern)[0];
    const value = error.keyValue[key];
    throw new AppError(
      400,
      `Duplicate value for '${key}': '${value}'. Please use a different value.`
    ,400);
  }
  return res.status(400).json(error);
};

export default errHandler;
