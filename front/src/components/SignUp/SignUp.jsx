import { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaLock, FaCheck, FaExclamationCircle } from "react-icons/fa";

const SignUp = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: "",
    emailOrPhone: "",
    role: "buyer",
    password: "",
    confirmPassword: "",
    verificationCode: ""
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const validateUsername = (username) => {
    const regex = /^[a-zA-Z0-9]{3,}$/;
    return regex.test(username);
  };

  const validateEmailOrPhone = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[1-9]\d{9,14}$/;
    return emailRegex.test(value) || phoneRegex.test(value);
  };

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*]/.test(password);
    const hasMinLength = password.length >= 8;

    const strength = [
      hasUpperCase,
      hasNumber,
      hasSpecialChar,
      hasMinLength
    ].filter(Boolean).length;

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
        setErrors(prev => ({ ...prev, username: "Username must be at least 3 characters and contain no special characters" }));
      }
    }
    if (name === "emailOrPhone") {
      if (!validateEmailOrPhone(value)) {
        setErrors(prev => ({ ...prev, emailOrPhone: "Please enter a valid email or phone number" }));
      }
    }
    if (name === "password") {
      validatePassword(value);
      if (formData.confirmPassword && value !== formData.confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match" }));
      }
    }
    if (name === "confirmPassword") {
      if (value !== formData.password) {
        setErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match" }));
      }
    }
  };

  const handleNextStep = async () => {
    if (step === 1) {
      const newErrors = {};
      if (!validateUsername(formData.username)) {
        newErrors.username = "Invalid username";
      }
      if (!validateEmailOrPhone(formData.emailOrPhone)) {
        newErrors.emailOrPhone = "Invalid email or phone";
      }
      if (!validatePassword(formData.password)) {
        newErrors.password = "Password does not meet requirements";
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }

      if (Object.keys(newErrors).length === 0) {
        setIsLoading(true);
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          setStep(2);
        } catch (error) {
          setErrors({ submit: "An error occurred. Please try again." });
        } finally {
          setIsLoading(false);
        }
      } else {
        setErrors(newErrors);
      }
    }
  };

  const handleVerificationSubmit = async () => {
    if (formData.verificationCode.length === 6) {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert("Registration successful!");
      } catch (error) {
        setErrors({ verification: "Invalid verification code" });
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrors({ verification: "Please enter a valid 6-digit code" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="flex justify-center mb-8">
          <div className="w-full">
            <div className="flex items-center justify-between relative">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? "bg-blue-600" : "bg-gray-300"}`}>
                <FaUser className="text-white" />
              </div>
              <div className={`h-1 flex-1 mx-4 ${step >= 2 ? "bg-blue-600" : "bg-gray-300"}`} />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? "bg-blue-600" : "bg-gray-300"}`}>
                <FaCheck className="text-white" />
              </div>
            </div>
          </div>
        </div>

        {step === 1 ? (
          <div className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
              <div className="mt-1 relative">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className={`appearance-none block w-full px-3 py-2 border ${errors.username ? "border-red-300" : "border-gray-300"} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
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
              <label htmlFor="emailOrPhone" className="block text-sm font-medium text-gray-700">Email or Phone Number</label>
              <div className="mt-1 relative">
                <input
                  id="emailOrPhone"
                  name="emailOrPhone"
                  type="text"
                  required
                  className={`appearance-none block w-full px-3 py-2 border ${errors.emailOrPhone ? "border-red-300" : "border-gray-300"} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  value={formData.emailOrPhone}
                  onChange={handleInputChange}
                />
                {errors.emailOrPhone && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <FaExclamationCircle className="h-5 w-5 text-red-500" />
                  </div>
                )}
              </div>
              {errors.emailOrPhone && <p className="mt-2 text-sm text-red-600">{errors.emailOrPhone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <div className="mt-2 space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="buyer"
                    checked={formData.role === "buyer"}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Buyer</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="seller"
                    checked={formData.role === "seller"}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Seller</span>
                </label>
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className={`appearance-none block w-full px-3 py-2 border ${errors.password ? "border-red-300" : "border-gray-300"} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mt-2 flex space-x-1">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 w-1/4 rounded ${i < passwordStrength ? "bg-green-500" : "bg-gray-200"}`}
                  />
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <div className="mt-1 relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className={`appearance-none block w-full px-3 py-2 border ${errors.confirmPassword ? "border-red-300" : "border-gray-300"} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
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
                {isLoading ? "Processing..." : "Next Step"}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h2 className="text-center text-xl font-semibold mb-4">Verification</h2>
              <p className="text-center text-gray-600 mb-6">
                Enter the 6-digit code sent to your {formData.emailOrPhone}
              </p>
              <div>
                <label htmlFor="verificationCode" className="sr-only">Verification Code</label>
                <input
                  id="verificationCode"
                  name="verificationCode"
                  type="text"
                  maxLength="6"
                  required
                  className={`appearance-none block w-full px-3 py-2 border ${errors.verification ? "border-red-300" : "border-gray-300"} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-center tracking-widest`}
                  value={formData.verificationCode}
                  onChange={handleInputChange}
                  placeholder="000000"
                />
              </div>
              {errors.verification && (
                <p className="mt-2 text-sm text-red-600 text-center">{errors.verification}</p>
              )}
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleVerificationSubmit}
                disabled={isLoading}
                className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isLoading ? "Verifying..." : "Complete Sign Up"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUp;