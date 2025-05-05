import { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaLock, FaCheck, FaExclamationCircle, FaWhatsapp, FaSms, FaGoogle, FaFacebook } from "react-icons/fa";
import { login, register, sendVerificationCode, verifyNumberPhone, verifyPhoneNumber } from "../../redux/apiCalls";
import PhoneInput from "react-phone-input-2";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate } from "react-router-dom";
import { notifyUser } from "../../components/notifyuser/ToastMessage";
import { useDispatch, useSelector } from "react-redux";
import PhoneNumberInput from "../../components/PhoneNumberInput/PhoneNumberInput";
import { FiPhone } from "react-icons/fi";

const SignUp = () => {
  const { t, i18n } = useTranslation();
  const [messageSent, setMessageSent] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: "",
    email: "welcome@elmarsa.com",
    phone: "",
    role: "normal",
    password: "",
    confirmPassword: "",
    verificationCode: "",
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [codeSent, setCodeSent] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isPhoneModal, setIsPhoneModal] = useState(false);
  const navigate = useNavigate();
  const error = useSelector((stat) => stat.user.error);
  const dispatch = useDispatch();
  const [isDisabled, setIsDisabled] = useState(false);
  const buttonBaseClass = `
  w-full
  px-6 py-3
  flex items-center justify-center gap-3
  rounded-lg
  transform transition-all duration-300
  hover:scale-105 active:scale-100
  focus:outline-none focus:ring-2 focus:ring-offset-2
  shadow-md hover:shadow-lg
  text-white font-medium
  disabled:cursor-not-allowed disabled:opacity-70
  mb-3
`;

  const validateUsername = (username) => {
    const regex = /^[a-zA-Z0-9]{5,}$/;
    return regex.test(username);
  };

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // const phoneRegex = /^\+?[1-9]\d{9,14}$/;
    return emailRegex.test(value);
    // || phoneRegex.test(value);
  };
  const validatePhone = (value) => {
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[1-9]\d{9,14}$/;
    return phoneRegex.test(value);
  };

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*]/.test(password);
    const hasMinLength = password.length >= 8;

    const strength = [hasUpperCase, hasNumber, hasSpecialChar, hasMinLength].filter(Boolean).length;

    setPasswordStrength(strength);

    return strength === 4;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear errors when user types
    setErrors({ ...errors, [name]: "" });

    // Validate fields in real-time
    if (name === "username") {
      if (!validateUsername(value)) {
        setErrors((prev) => ({ ...prev, username: t("username_error") }));
      }
    }
    if (name === "email") {
      if (!validateEmail(value)) {
        setErrors((prev) => ({ ...prev, email: t("email_error") }));
      }
    }
    if (name === "phone") {
      if (!validatePhone(value)) {
        setErrors((prev) => ({ ...prev, phone: t("phone_error") }));
      }
    }
    if (name === "password") {
      validatePassword(value);
      if (formData.confirmPassword && value !== formData.confirmPassword) {
        setErrors((prev) => ({ ...prev, confirmPassword: t("password_error") }));
      }
    }
    if (name === "confirmPassword") {
      if (value !== formData.password) {
        setErrors((prev) => ({ ...prev, confirmPassword: t("confirm_password_error") }));
      }
    }
  };
  const handlePhoneChange = (value, country, e, formattedValue) => {
    setFormData({ ...formData, phone: value });

    // Clear errors when user types
    setErrors((prev) => ({ ...prev, phone: "" }));

    if (!validatePhone(value)) {
      setErrors((prev) => ({ ...prev, phone: t("phone_error") }));
    }
  };
  const handleNextStep = async () => {
    if (step === 1) {
      const newErrors = {};
      if (!validateUsername(formData.username)) {
        newErrors.username = t("invalid_username");
      }
      if (!validateEmail(formData.email)) {
        newErrors.email = t("invalid_email");
      }
      if (!validatePhone(formData.phone)) {
        newErrors.phone = t("invalid_phone");
      }
      if (!validatePassword(formData.password)) {
        newErrors.password = t("invalid_password");
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = t("confirm_password_error");
      }

      if (Object.keys(newErrors).length === 0) {
        setIsLoading(true);
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          setStep(2);
        } catch (error) {
          setErrors({ submit: t("submit_error") });
        } finally {
          setIsLoading(false);
        }
      } else {
        setErrors(newErrors);
      }
    }
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    if (formData.verificationCode.length === 6) {
      setIsLoading(true);
      try {
        const res = await verifyPhoneNumber(formData.phone, formData.verificationCode);
        console.log("form data : ", formData);
        if (res && res.status === 200) {
          console.log("Verification successful", res);
          console.log("Code correct");
          notifyUser("succuss", t("verification_success"));
          setStep(4);
        } else {
          setErrors({ verification: t("verification_error") });
        }
      } catch (error) {
        console.error("Failed to verify code. Please try again.", error);
        setErrors({ verification: t("invalid_verification_code") });
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrors({ verification: t("verification_error_6_digits") });
    }
  };
  const handleRegister = async (e) => {
    e.preventDefault();
    const { verificationCode, ...formDataWithoutCode } = formData;
    try {
      await register(formDataWithoutCode);
      console.log("Sent user : ", formData);
      // if (res && res.status === 200) {
      notifyUser("succuss", t("register_success"));
      setTimeout(() => {
        setIsLogin(true);
      }, 2000);
      // } else {
      // console.log("Error reigster user");
      // }
    } catch (error) {
      console.error("Error while register user : ", error);
      notifyUser("error", t("register_error"));
    }
  };
  const sendCode = async (phone) => {
    try {
      setIsLoading(true);
      const res = await sendVerificationCode(phone);
      console.log("Verification code sent successfully", res);
      if (res && res.status === 200) {
        setIsLoading(false);
        console.log("Verification code sent successfully", res);
        setCodeSent(true);
      } else {
        setErrors({ verification: "Failed to send verification code. Please try again." });
      }
    } catch (error) {
      console.error("Failed to send verification code. Please try again.", error);
      // setErrors("Failed to send verification code. Please try again." , error);
    } finally {
      setIsLoading(false);
    }
  };
  const registerGoogle = async () => {
    // Redirect user to Google OAuth callback
    window.location.href = "https://www.elmarsa.mr/api/api/google/callback";
  };
  const registerFacebook = async () => {
    // Redirect user to Facebook OAuth callback
    window.location.href = "https://www.elmarsa.mr/api/api/auth/facebook";
  };
  const handleLogin = (e) => {
    e.preventDefault();

    login(dispatch, { email, password });

    // If there's an error, show the toast notification
    if (error) {
      setErrors({ verification: t("email_or_password_error") });
      toast.error(error, { theme: "colored", position: "top-center" });
    } else {
      // Assuming the 'login' function will return a response with the token
      // You can retrieve the token from the response (make sure it's available from your API response)
      setTimeout(() => {
        notifyUser("success", "Login successfully");
      }, 2000);
      Navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all duration-300 ${isLogin ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
            aria-label="Switch to login form"
          >
            {t("login")}
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all duration-300 ${!isLogin ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
            aria-label="Switch to signup form"
          >
            {t("sign_up")}
          </button>
        </div>
        {!isLogin ? (
          <div className="register">
            {step !== 1 && (
              <div className="flex justify-center mb-8">
                <div className="w-full">
                  <div className="flex items-center justify-between relative">
                    <div onClick={() => setStep(1)} className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? "bg-blue-600" : "bg-gray-300"}`}>
                      <FaUser className="text-white" />
                    </div>
                    <div className={`h-1 flex-1 mx-4 ${step >= 2 ? "bg-blue-600" : "bg-gray-300"}`} />
                    <div onClick={() => step >= 2 && setStep(2)} className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? "bg-blue-600" : "bg-gray-300"}`}>
                      <FaWhatsapp className="text-white" />
                    </div>
                    <div className={`h-1 flex-1 mx-4 ${step >= 3 ? "bg-blue-600" : "bg-gray-300"}`} />
                    <div onClick={() => step >= 3 && setStep(3)} className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? "bg-blue-600" : "bg-gray-300"}`}>
                      <FaSms className="text-white" />
                    </div>
                    <div className={`h-1 flex-1 mx-4 ${step >= 4 ? "bg-blue-600" : "bg-gray-300"}`} />
                    <div onClick={() => step >= 4 && setStep(4)} className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 4 ? "bg-blue-600" : "bg-gray-300"}`}>
                      <FaCheck className="text-white" />
                    </div>
                  </div>
                </div>
              </div>
            )}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    {t("username")}
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.username ? "border-red-300" : "border-gray-300"
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                      value={formData.username}
                      onChange={handleInputChange}
                    />
                    {errors.username && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <FaExclamationCircle className="h-5 w-5 text-red-500" />
                      </div>
                    )}
                  </div>
                  {errors.username && <p className="mt-2 text-sm text-red-600">{errors.username}</p>}
                </div>

                <div style={{ display: "none" }}>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    {t("email")}{" "}
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="email"
                      name="email"
                      type="text"
                      required
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.email ? "border-red-300" : "border-gray-300"
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                    {errors.email && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <FaExclamationCircle className="h-5 w-5 text-red-500" />
                      </div>
                    )}
                  </div>
                  {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    {t("phone_number")}
                  </label>
                  <div className="mt-1 relative">
                    {/* <input
                      id="phone"
                      name="phone"
                      type="text"
                      required
                      className={`appearance-none block w-full px-3 py-2 border ${errors.phone ? "border-red-300" : "border-gray-300"} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                      value={formData.phone}
                      onChange={handleInputChange}
                    /> */}
                    <div className="space-y-4">
                      <PhoneInput
                        country="mr"
                        value={formData.phone}
                        id="phone"
                        name="phone"
                        inputClass={`!w-full !h-[38px] appearance-none block px-3 py-2 border ${
                          errors.phone ? "border-red-300" : "border-gray-300"
                        } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                        containerClass="w-full"
                        onChange={handlePhoneChange}
                      />
                    </div>
                    {errors.phone && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <FaExclamationCircle className="h-5 w-5 text-red-500" />
                      </div>
                    )}
                  </div>
                  {errors.phone && <p className="mt-2 text-sm text-red-600">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">{t("role")}</label>
                  <div className="mt-2 space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="role"
                        value="normal"
                        checked={formData.role === "normal"}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">{t("normal_user")}</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="role"
                        value="store"
                        checked={formData.role === "store"}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">{t("store")}</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    {t("password")}
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.password ? "border-red-300" : "border-gray-300"
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mt-2 flex space-x-1">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className={`h-1 w-1/4 rounded ${i < passwordStrength ? "bg-green-500" : "bg-gray-200"}`} />
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    {t("confirm_password")}
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.confirmPassword ? "border-red-300" : "border-gray-300"
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                    />
                    {errors.confirmPassword && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <FaExclamationCircle className="h-5 w-5 text-red-500" />
                      </div>
                    )}
                  </div>
                  {errors.confirmPassword && <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>}
                </div>

                <div>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {isLoading ? t("processing") : t("next_step")}
                  </button>
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-3 text-center">
                  <p className="text-gray-700">
                    {t("to_start_verification")} <strong>"join detail-handsome"</strong> {t("to_the_number")} <strong>+1 415 523 8886</strong> {t("on_whatsapp")}
                  </p>
                  <button
                    onClick={() => {
                      window.open("https://wa.me/14155238886?text=join%20detail-handsome", "_blank");
                      setStep(3);
                    }}
                    className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 w-full"
                  >
                    {t("send_message")}
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-center text-xl font-semibold mb-4">{t("verification")}</h2>
                  <p className="text-center text-gray-600 mb-6">
                    {t("enter_the_6_digit_code_sent_to_your_whatsapp")} {formData.emailOrPhone}
                  </p>
                  <div className="flex items-center space-x-3 my-3">
                    <input type="text" value={formData.phone} disabled className="bg-gray-200 text-gray-700 px-3 py-2 border border-gray-300 rounded-md shadow-sm w-full cursor-not-allowed" />
                    <button type="button" onClick={() => sendCode(formData.phone)} className="min-w-max py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                      {t("send_code")}
                    </button>
                  </div>
                  <div className="flex items-center space-x-3 my-4">
                    <input type="checkbox" id="sentCode" onChange={(e) => setMessageSent(e.target.checked)} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <label htmlFor="sentCode" className="text-gray-700 text-sm">
                      {t("i_have_sent_the_message_and_received_the_code")}
                    </label>
                  </div>
                  <div>
                    <label htmlFor="verificationCode" className="sr-only">
                      {t("verification_code")}
                    </label>
                    <input
                      id="verificationCode"
                      name="verificationCode"
                      type="text"
                      maxLength="6"
                      required
                      disabled={!messageSent || !codeSent}
                      className={
                        !messageSent || !codeSent
                          ? "bg-gray-300 cursor-not-allowed  appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none  sm:text-sm text-center tracking-widest "
                          : `appearance-none block w-full px-3 py-2 border ${
                              errors.verification ? "border-red-300" : "border-gray-300"
                            } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-center tracking-widest`
                      }
                      value={formData.verificationCode}
                      onChange={handleInputChange}
                      placeholder="000000"
                    />
                  </div>
                  {errors.verification && <p className="mt-2 text-sm text-red-600 text-center">{errors.verification}</p>}
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {t("back")}
                  </button>
                  <button
                    type="button"
                    onClick={handleVerificationSubmit}
                    disabled={isLoading || !messageSent || !codeSent}
                    className={
                      !messageSent || isLoading || !codeSent
                        ? "cursor-not-allowed flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        : "flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    }
                  >
                    {isLoading ? t("verifying") : t("verify")}
                  </button>
                </div>
              </div>
            )}
            {step === 1 && (
              // <div className="flex flex-col items-center my-2 space-y-2">
              //   <button
              //     onClick={registerGoogle}
              //     className="flex items-center justify-center w-full max-w-xs bg-white border border-gray-300 rounded-lg shadow px-4 py-2 text-xs font-medium text-gray-800 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-400"
              //   >
              //     <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="-0.5 0 48 48">
              //       <g fill="none" fillRule="evenodd">
              //         <g transform="translate(-401.000000, -860.000000)">
              //           <g transform="translate(401.000000, 860.000000)">
              //             <path fill="#FBBC05" d="M9.827 24c0-1.524.253-2.986.705-4.357l-7.909-6.04C1.082 16.734.214 20.26.214 24c0 3.737.868 7.261 2.407 10.389l7.905-6.051A14.32 14.32 0 019.827 24z" />
              //             <path fill="#EB4335" d="M23.714 10.133c3.311 0 6.302 1.174 8.652 3.094l6.836-6.827c-4.166-3.627-9.507-5.867-15.489-5.867C14.427.533 6.445 5.844 2.623 13.604l7.909 6.04C12.355 14.112 17.55 10.133 23.714 10.133z" />
              //             <path fill="#34A853" d="M23.714 37.867c-6.165 0-11.36-3.979-13.182-9.51l-7.909 6.038C6.445 42.156 14.427 47.467 23.714 47.467c5.732 0 11.205-2.035 15.311-5.848l-7.507-5.804a13.98 13.98 0 01-7.804 2.052z" />
              //             <path fill="#4285F4" d="M46.145 24c0-1.387-.214-2.88-.534-4.267H23.714v9.067h12.605a13.897 13.897 0 01-4.8 7.015l7.507 5.804c4.314-4.004 7.12-9.969 7.12-16.619z" />
              //           </g>
              //         </g>
              //       </g>
              //     </svg>
              //     <span>{t('continue_with_google')}</span>
              //   </button>

              //   <button
              //     onClick={registerFacebook}
              //     class="flex items-center bg-white border border-gray-300 rounded-lg shadow-md max-w-xs px-14 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
              //     <svg class="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
              //       viewBox="0 0 48 48" version="1.1">
              //       <g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
              //         <g id="Color-" transform="translate(-200.000000, -160.000000)" fill="#4460A0">
              //           <path
              //             d="M225.638355,208 L202.649232,208 C201.185673,208 200,206.813592 200,205.350603 L200,162.649211 C200,161.18585 201.185859,160 202.649232,160 L245.350955,160 C246.813955,160 248,161.18585 248,162.649211 L248,205.350603 C248,206.813778 246.813769,208 245.350955,208 L233.119305,208 L233.119305,189.411755 L239.358521,189.411755 L240.292755,182.167586 L233.119305,182.167586 L233.119305,177.542641 C233.119305,175.445287 233.701712,174.01601 236.70929,174.01601 L240.545311,174.014333 L240.545311,167.535091 C239.881886,167.446808 237.604784,167.24957 234.955552,167.24957 C229.424834,167.24957 225.638355,170.625526 225.638355,176.825209 L225.638355,182.167586 L219.383122,182.167586 L219.383122,189.411755 L225.638355,189.411755 L225.638355,208 L225.638355,208 Z"
              //             id="Facebook">

              //           </path>
              //         </g>
              //       </g>
              //     </svg>

              //     <span>{t('continue_with_facebook')}</span>
              //   </button>
              // </div>

              <div className="w-full max-w-md mx-auto space-y-4">
                <div className="flex items-center justify-center space-x-2 my-4">
                  <div className="flex-1 h-px bg-gray-300"></div>
                  <span className="text-sm text-gray-500">{t("or_continue_with")}</span>
                  <div className="flex-1 h-px bg-gray-300"></div>
                </div>

                <button onClick={registerGoogle} disabled={isDisabled} className={`${buttonBaseClass} bg-red-500 hover:bg-red-600 focus:ring-red-500`}>
                  <FaGoogle className="w-5 h-5" />
                  <span>{t("continue_with_google")}</span>
                </button>

                <button onClick={registerFacebook} disabled={isDisabled} className={`${buttonBaseClass} bg-blue-600 hover:bg-blue-700 focus:ring-blue-500`}>
                  <FaFacebook className="w-5 h-5" />
                  <span>{t("continue_with_facebook")}</span>
                </button>
              </div>
            )}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    {t("username")}
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.username ? "border-red-300" : "border-gray-300"
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                      value={formData.username}
                      onChange={handleInputChange}
                    />
                    {errors.username && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <FaExclamationCircle className="h-5 w-5 text-red-500" />
                      </div>
                    )}
                  </div>
                  {errors.username && <p className="mt-2 text-sm text-red-600">{errors.username}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    {t("email")}{" "}
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="email"
                      name="email"
                      type="text"
                      required
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.email ? "border-red-300" : "border-gray-300"
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                    {errors.email && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <FaExclamationCircle className="h-5 w-5 text-red-500" />
                      </div>
                    )}
                  </div>
                  {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    {t("phone_number")}
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="phone"
                      name="phone"
                      disabled
                      type="text"
                      required
                      className={`cursor-not-allowed appearance-none block w-full px-3 py-2 border ${
                        errors.phone ? "border-red-300" : "border-gray-300"
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none bg-gray-200 sm:text-sm`}
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                    {errors.phone && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <FaExclamationCircle className="h-5 w-5 text-red-500" />
                      </div>
                    )}
                  </div>
                  {errors.phone && <p className="mt-2 text-sm text-red-600">{errors.phone}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">{t("role")}</label>
                  <div className="mt-2 space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="role"
                        value="normal"
                        checked={formData.role === "normal"}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">{t("nomrla_user")}</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="role"
                        value="store"
                        checked={formData.role === "store"}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">{t("store")}</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    {t("password")}
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.password ? "border-red-300" : "border-gray-300"
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mt-2 flex space-x-1">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className={`h-1 w-1/4 rounded ${i < passwordStrength ? "bg-green-500" : "bg-gray-200"}`} />
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    {t("confirm_password")}
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.confirmPassword ? "border-red-300" : "border-gray-300"
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                    />
                    {errors.confirmPassword && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <FaExclamationCircle className="h-5 w-5 text-red-500" />
                      </div>
                    )}
                  </div>
                  {errors.confirmPassword && <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>}
                </div>

                <div>
                  <button
                    type="button"
                    onClick={(e) => handleRegister(e)}
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {isLoading ? t("processing") : t("sign_up")}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                {t("email")}
              </label>
              <div className="mt-1 relative">
                <input
                  id="email"
                  name="email"
                  type="text"
                  required
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.email ? "border-red-300" : "border-gray-300"
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                {errors.email && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <FaExclamationCircle className="h-5 w-5 text-red-500" />
                  </div>
                )}
              </div>

              {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                {t("password")}
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.password ? "border-red-300" : "border-gray-300"
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="mt-2 flex space-x-1">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className={`h-1 w-1/4 rounded ${i < passwordStrength ? "bg-green-500" : "bg-gray-200"}`} />
                ))}
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isLoading ? t("processing") : t("login")}
              </button>
              {errors.verification && <p className="mt-2 text-sm text-red-600 text-center">{errors.verification}</p>}
            </div>

            <div className="w-full max-w-md mx-auto space-y-4">
              <div className="flex items-center justify-center space-x-2 my-4">
                <div className="flex-1 h-px bg-gray-300"></div>
                <span className="text-sm text-gray-500">{t("or_continue_with")}</span>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>

              <button onClick={registerGoogle} disabled={isDisabled} className={`${buttonBaseClass} bg-red-500 hover:bg-red-600 focus:ring-red-500`}>
                <FaGoogle className="w-5 h-5" />
                <span>{t("continue_with_google")}</span>
              </button>

              <button onClick={registerFacebook} disabled={isDisabled} className={`${buttonBaseClass} bg-blue-600 hover:bg-blue-700 focus:ring-blue-500`}>
                <FaFacebook className="w-5 h-5" />
                <span>{t("continue_with_facebook")}</span>
              </button>

              <button
                onClick={() => setIsPhoneModal(true)}
                disabled={isDisabled}
                className={`${buttonBaseClass} bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:ring-blue-500`}
              >
                <FiPhone className="w-5 h-5" />
                <span>{isDisabled ? t("processing") : t("continue_with_phone")}</span>
              </button>
            </div>
          </div>
        )}
      </div>
      {isPhoneModal && <PhoneNumberInput formData={formData} setFormData={setFormData} isPhoneModal={isPhoneModal} setIsPhoneModal={setIsPhoneModal} />}
    </div>
  );
};

export default SignUp;
