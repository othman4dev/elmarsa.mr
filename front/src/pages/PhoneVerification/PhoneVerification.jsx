import { useState, useEffect, useRef } from "react";
import { FiPhone, FiCheck, FiX } from "react-icons/fi";
import { BiLoader } from "react-icons/bi";
import { sendVerificationCode, verifyNumberPhone , fetchUser } from "../../redux/apiCalls";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import PhoneInput from 'react-phone-input-2';

const PhoneVerification = () => {
    const navigate = useNavigate();
    const {t,i18n} = useTranslation();
    const [phoneNumber, setPhoneNumber] = useState("");
    const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
    const [step, setStep] = useState("join");
    const [timer, setTimer] = useState(300);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [isLocked, setIsLocked] = useState(false);
    const [errors,setErrors] = useState({});
    const inputRefs = useRef([]);


    const getUser = async () => {
        try {
            const res = await fetchUser();

            if (res) {
                setPhoneNumber(res.phone); 
            } else {
                setError(res?.data?.message || "Failed to fetch user");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUser();
    }, []);


    useEffect(() => {
        let interval;
        if (step === "verify" && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [step, timer]);

    const validatePhoneNumber = (number) => {
        const phoneRegex = /^\+[1-9]\d{1,14}$/;
        return phoneRegex.test(number);
    };

    const handlePhoneSubmit = async (phoneNumber) => {
        if (!phoneNumber.startsWith("+")) {
            phoneNumber = `+${phoneNumber}`;
        }
        if (!validatePhoneNumber(phoneNumber)) {
            setError(t('please_enter_valid_phone_number'));
            return;
        }
        setLoading(true);
        setError("");
        // setTimeout(() => {
        //     setStep("verify");
        //     setLoading(false);
        // }, 2000);
        try {
            const res = await sendVerificationCode(phoneNumber);
            console.log("Verification code sent successfully", res);
            if (res.status === 200) {
                setStep("verify");
                setLoading(false);
                console.log("Verification code sent successfully", res);
            } else {
                setError("Failed to send verification code. Please try again.");
            }
        } catch (error) {
            console.error("Failed to send verification code. Please try again.", error);
            setError("Failed to send verification code. Please try again." , error);
        } finally {
            setLoading(false);
        }
    };

    const handleCodeChange = (index, value) => {
        if (isLocked) return;
        console.log("Verification code : ", verificationCode.join(""));
        const newCode = [...verificationCode];
        newCode[index] = value;
        setVerificationCode(newCode);

        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleVerifyCode = async (phoneNumber, verificationCode) => {
        if (verificationCode.length !== 6) {
            setError("Please enter all digits");
            return;
        }

        setLoading(true);
        try {
            const res = await verifyNumberPhone(phoneNumber, verificationCode);
            if (res.status === 200) {
                setStep("success");
                console.log("Verification successful", res);
                setTimeout(() => {
                    navigate("/");
                  }, 3000); // Redirect after 3 seconds
            } else {
                setError("Invalid code. Please try again.");
            }
        } catch (error) {
            console.error("Failed to verify code. Please try again.", error);
            setError("Incorrect code. Please try again.");
        }finally{
            setLoading(false);
        }

    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };
    const handleSendCode = () => {
        setStep("phone");       // Change to waitForMessage step
        // Construct the WhatsApp URL to send the message
        const phoneNumberForUrl = '14155238886'; // The number to send the message to
        const message = 'join detail-handsome'; // The message to send
        const whatsappUrl = `https://wa.me/${phoneNumberForUrl}?text=${encodeURIComponent(message)}`;

        // Redirect the user to WhatsApp
        window.open(whatsappUrl, '_blank');
    }
    const validatePhone = (value) => {
        // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\+?[1-9]\d{9,14}$/;
        return phoneRegex.test(value);
      };
      const handlePhoneChange = (value, country, e, formattedValue) => {
        setPhoneNumber(e.target.value)

    
        // Clear errors when user types
        setErrors(prev => ({ ...prev, phone: "" }));
    
        if (!validatePhone(value)) {
          setErrors(prev => ({ ...prev, phone: t('phone_error') }));
        }
      };
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
                {step === "join" && (
                    <div className="space-y-6 p-6 bg-indigo-50 rounded-xl shadow-lg max-w-md mx-auto">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-indigo-800">{t('phone_verification')}</h2>
                            <p className="mt-2 text-gray-600">{t('to_start_verification')} <span className="font-bold text-indigo-600">"join detail-handsome"</span> {t('to_the_number')} <span className="font-bold text-indigo-600">+14155238886</span> {t('on_whatsapp')}</p>
                        </div>

                        {/* First Button ("Send Code") */}
                        <div className="text-center">
                            <button
                                onClick={() => {
                                    handleSendCode();
                                }}
                                disabled={loading} // Disable if loading is true
                                className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 ease-in-out transform hover:scale-105 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {loading ? <BiLoader className="animate-spin h-5 w-5" /> : t('send_code')}
                            </button>
                        </div>


                    </div>
                )}

                {step === "phone" && (
                    <div className="space-y-6">
                        {/* Conditional alert based on whether the user has sent the message */}
                        <div className="bg-yellow-100 text-yellow-800 p-4 rounded-md shadow-md">
                            <p className="text-center font-medium">
                                {t('you_need_first')} "join detail-handsome" {t('to')} +14155238886 
                            </p>
                            <div className="mt-4 text-center">
                                <button
                                    onClick={() => setStep("join")}
                                    className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    {t('return_back')}
                                </button>
                            </div>
                        </div>

                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-gray-900">{t('phone_verification')}</h2>
                            <p className="mt-2 text-gray-600">{t('enter_your_phone')}</p>
                        </div>

                        <div>
                            <div className="relative">
                                <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                {/* <input
                                    type="tel"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    placeholder="+1234567890"
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                /> */}
                                 <div className="space-y-4">
                                <PhoneInput
                                    country="ma"
                                    value={phoneNumber}
                                    id="phone"
                                    name="phone"
                                    inputClass={`!w-full !h-[50px] appearance-none block px-3 py-2 border ${errors.phone ? "border-red-300" : "border-gray-300"} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                    containerClass="w-full"
                                    required
                                    onChange={handlePhoneChange}
                                />
                            </div>
                            </div>
                            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                            <button
                                onClick={() => handlePhoneSubmit(phoneNumber)}
                                disabled={loading}
                                className="mt-4 w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                {loading ? <BiLoader className="animate-spin h-5 w-5" /> : t('send_code')}
                            </button>
                        </div>
                    </div>
                )}


                {step === "verify" && (
                    <div className="space-y-6">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-gray-900">{t('enter_verification_code')}</h2>
                            <p className="mt-2 text-gray-600">{t('send_to')} {phoneNumber.replace(/(?<=.{3}).(?=.{2})/g, "*")}</p>
                            <p className="text-sm text-gray-500 mt-1">{t('code_expires_in')} {formatTime(timer)}</p>
                        </div>
                        <div className="flex justify-center space-x-2">
                            {verificationCode.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleCodeChange(index, e.target.value)}
                                    className="w-12 h-12 text-center border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    disabled={isLocked}
                                />
                            ))}
                        </div>
                        {error && <p className="text-center text-sm text-red-600">{error}</p>}
                        <div className="space-y-2">
                            <button
                                onClick={() => handleVerifyCode(phoneNumber, verificationCode.join(""))}
                                disabled={loading || isLocked}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                {loading ? <BiLoader className="animate-spin h-5 w-5" /> : t('verify_code')}
                            </button>
                            <button
                                onClick={() => setStep("phone")}
                                className="w-full text-sm text-indigo-600 hover:text-indigo-500"
                            >
                                {t('change_phone_number')}
                            </button>
                        </div>
                    </div>
                )}

                {step === "success" && (
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <FiCheck className="h-8 w-8 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">{t('verification_successful')}</h2>
                        <p className="text-gray-600">{t('your_phone_has_been_verified_successfully')}</p>
                        <p className="text-gray-500">{t('you_will_be_redirected_shortly')}...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PhoneVerification;