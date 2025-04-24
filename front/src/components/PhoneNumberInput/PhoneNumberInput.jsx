import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaExclamationCircle, FaSpinner } from "react-icons/fa";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { checkPhoneNumberExists, loginWithPhone, sendVerificationCode, verifyPhoneNumber } from "../../redux/apiCalls";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

const PhoneNumberInput = ({ isPhoneModal, setIsPhoneModal }) => {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState({
    phone: "",
    verificationCode: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [messageSent, setMessageSent] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const dispatch = useDispatch();

  const validatePhone = (value) => {
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[1-9]\d{9,14}$/;
    return phoneRegex.test(value);
  };

  const handleInputChange = (value, country, e, formattedValue) => {
    setFormData({ ...formData, phone: value });

    // Clear errors when user types
    setErrors((prev) => ({ ...prev, phone: "" }));

    if (!validatePhone(value)) {
      setErrors((prev) => ({ ...prev, phone: t("phone_error") }));
    }
  };

  const handleContinue = async () => {
    if (step === 1) {
      const newErrors = {};

      if (!validatePhone(formData.phone)) {
        console.log("form data : ", formData);
        newErrors.phone = t("invalid_phone");
      }

      if (Object.keys(newErrors).length === 0) {
        setIsLoading(true);
        try {
          // Simulate API call
          // await new Promise(resolve => setTimeout(resolve, 1000));
          const res = await checkPhoneNumberExists(formData.phone);
          console.log("form data : ", formData);
          console.log("res : ", res);
          if (res && res.status === 200) {
            console.log("Phone number exists");
            setStep(2);
          } else {
            setErrors({ phone: t("phone_not_exists_or_not_verified") });
          }
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

 
  const sendCode = async () => {
    try {
      setIsLoading(true);
      const res = await sendVerificationCode(formData.phone);
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

 

  const handleVerify = (e) => {
    e.preventDefault();
    if (!formData.verificationCode) {
      setError("Please enter the verification code.");
      return;
    }
    setIsLoading(true);
    // setTimeout(() => {
    //   setIsLoading(false);
    //   setIsPhoneModal(false);
    // }, 2000);
    try {
      loginWithPhone(dispatch, formData.phone, formData.verificationCode);
      console.log("form data : ", formData);
      if (res && res.status === 200) {
        console.log("Login successful", res);
        notifyUser("success", "Login successfully");
        setIsLoading(false);
        setIsPhoneModal(false);
      } else {
        setErrors({ verification: t("verification_error") });
      }
    } catch (error) {
      console.error("Failed to verify code. Please try again.", error);
      setErrors({ verification: t("verification_error") });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsPhoneModal(false)} />
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <button onClick={() => setIsPhoneModal(false)} className="absolute right-4 top-4 text-gray-500 hover:text-gray-700" aria-label="Close modal">
          <IoClose size={24} />
        </button>

        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold">{step === 1 ? t("sign_in_with_phone") : step === 2 ? t("whatsapp_verification") : t("enter_code")}</h2>
        </div>

        {step === 1 && (
          <div>
            <div className="space-y-4">
              <PhoneInput
                country="ma"
                value={formData.phone}
                name="phone"
                onChange={handleInputChange}
                inputClass={`appearance-none block w-full px-3 py-2 border ${
                  errors.phone ? "border-red-300" : "border-gray-300"
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                containerClass="w-full"
              />
            </div>
            {errors.phone && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <FaExclamationCircle className="h-5 w-5 text-red-500" />
              </div>
            )}
            {errors.phone && <p className="mt-2 text-sm text-red-600">{errors.phone}</p>}
          </div>
        )}

        {step === 2 && (
          <div className="text-gray-700 text-center">
            <p>
              {t("to_start_verification")} <strong>"join detail-handsome"</strong> {t("to_the_number")} <strong>+1 415 523 8886</strong> {t("on_whatsapp")}
            </p>

            <button
              onClick={() => {
                window.open("https://wa.me/14155238886?text=join%20detail-handsome", "_blank");
                setStep(3);
              }}
              className="mt-6 w-full rounded-lg bg-blue-600 px-6 py-3 text-white transition-all hover:bg-blue-700 flex items-center justify-center"
            >
              {isLoading ? <FaSpinner className="animate-spin" /> : t("send")}
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-center text-xl font-semibold mb-4">{t("verification")}</h2>
              <p className="text-center text-gray-600 mb-6">
                {t("enter_the_6_digit_code_sent_to_your_whatsapp")} {formData.phone}
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
                  onChange={(e) => setFormData({ ...formData, verificationCode: e.target.value })}
                  placeholder="000000"
                />
              </div>
              {errors.verification && <p className="mt-2 text-sm text-red-600 text-center">{errors.verification}</p>}
            </div>
          </div>
        )}

        {error && <p className="text-red-500 mt-2 text-sm text-center">{error}</p>}
        {step != 2 && (
          <button
            onClick={step === 3 ? handleVerify : handleContinue}
            className="mt-6 w-full rounded-lg bg-blue-600 px-6 py-3 text-white transition-all hover:bg-blue-700 flex items-center justify-center"
          >
            {isLoading ? <FaSpinner className="animate-spin" /> : step === 3 ? t("verify&login") : t("continue")}
          </button>
        )}
      </div>
    </div>
  );
};

export default PhoneNumberInput;
