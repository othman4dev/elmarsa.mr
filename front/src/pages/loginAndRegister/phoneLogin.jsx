import { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { FaSpinner } from "react-icons/fa";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const phoneLogin = ({  onClose }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState("phone"); // phone, otp, success
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isOpen , setIsOpen] = useState(true)


  const handlePhoneChange = (value) => {
    setPhoneNumber(value);
    setIsValid(value.length >= 10);
    setError("");
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 6) {
      setOtp(value);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (step === "phone") {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setStep("otp");
      } else if (step === "otp") {
        // Simulate OTP verification
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setStep("success");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div
        className={`relative w-full max-w-md rounded-lg p-6 shadow-xl ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          aria-label="Close modal"
        >
          <IoClose size={24} />
        </button>

        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold">
            {step === "phone"
              ? "Enter Phone Number"
              : step === "otp"
              ? "Verify OTP"
              : "Success!"}
          </h2>
        </div>

        {step === "phone" && (
          <div className="space-y-4">
            <div className="relative">
              <PhoneInput
                country={"us"}
                value={phoneNumber}
                onChange={handlePhoneChange}
                containerClass={`w-full ${error ? "border-red-500" : ""}`}
                inputClass={`w-full p-4 ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}
                specialLabel="Phone Number"
                enableSearch
                disabled={loading}
              />
              {error && (
                <p className="mt-1 text-sm text-red-500" role="alert">
                  {error}
                </p>
              )}
            </div>
          </div>
        )}

        {step === "otp" && (
          <div className="space-y-4">
            <input
              type="text"
              value={otp}
              onChange={handleOtpChange}
              placeholder="Enter 6-digit OTP"
              className={`w-full rounded-lg p-4 text-center text-xl tracking-wider ${
                darkMode ? "bg-gray-700" : "bg-gray-50"
              }`}
              maxLength={6}
              disabled={loading}
            />
          </div>
        )}

        {step === "success" && (
          <div className="text-center">
            <p className="text-lg">You have successfully signed in!</p>
          </div>
        )}

        {step !== "success" && (
          <button
            onClick={handleSubmit}
            disabled={loading || (step === "phone" && !isValid) || (step === "otp" && otp.length !== 6)}
            className={`mt-6 w-full rounded-lg px-6 py-3 text-white transition-all ${loading ? "cursor-not-allowed bg-blue-400" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {loading ? (
              <FaSpinner className="mx-auto animate-spin" />
            ) : step === "phone" ? (
              "Send OTP"
            ) : (
              "Verify"
            )}
          </button>
        )}

        <div className="mt-4 flex justify-end">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Toggle {darkMode ? "Light" : "Dark"} Mode
          </button>
        </div>
      </div>
      
    </div>
  );
};

export default phoneLogin;