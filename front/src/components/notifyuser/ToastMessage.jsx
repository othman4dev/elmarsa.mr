import { toast } from "react-toastify";

export const notifyUser = (type, message) => {
  switch (type) {
    case "succuss":
      toast.success(message, {
        theme: "colored",
      });
      break;
    case "error":
      toast.error(message, {
        theme: "colored",
      });
      break;
    default:
      break;
  }
};
