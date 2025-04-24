import React, { useState, useEffect } from 'react';
import { fetchUser, updatePassword, updateUserInfos } from '../../redux/apiCalls';
import Modal from './Modal';
import { notifyUser } from '../../components/notifyuser/ToastMessage';
import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';
import { Loader } from 'lucide-react';
import PhoneInput from 'react-phone-input-2';
export const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [image, setImage] = useState(null);
    const [errors, setErrors] = useState({});
    const getUser = async () => {
        try {
            const res = await fetchUser();

            if (res) {
                setUser(res); // Ensure you're setting `res.data`, not `res`
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


    const updateUser = async (e) => {
        e.preventDefault();
        try {
            const res = await updateUserInfos(user);
            if (res) {
                console.log(t('user_updated_successfully'));
            }
        } catch (err) {
            console.error("Error updating user:", err);
        }
    };
    const handlePasswordChange = async () => {
        if (newPassword !== confirmPassword) {
            notifyUser("error", t('password_do_not_match'));
            return;
        }

        // Call an API to change the password (you'll need to implement this in your backend)
        try {
            setLoading(true);
            const res = await updatePassword(oldPassword, newPassword, confirmPassword);
            if (res.status === 200) {
                console.log(t('password_changed_successfully'));
            } else {
                console.log(t('password_not_changed'));
            }
            setShowModal(false);
        } catch (error) {
            console.error("Error changing password:", error);
        } finally {
            setLoading(false);
        }
    }
    const handleImageChange = async (event) => {
        event.preventDefault();
        const file = event.target.files[0];
        console.log(file); // Check if the file is selected
        if (!file) return;

        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "clicon");
        data.append("cloud_name", "di96wpw7b");

        try {
            setLoading(true);
            const response = await fetch(
                "https://api.cloudinary.com/v1_1/di96wpw7b/image/upload",
                {
                    method: "POST",
                    body: data,
                }
            );

            if (!response.ok) {
                throw new Error("Failed to upload image");
            }

            const uploadedImageURL = await response.json();
            setImage(uploadedImageURL.url);
            setUser({ ...user, image: uploadedImageURL.url });
            console.log("user", user);
            console.log("image", image);
        } catch (error) {
            console.error("Error uploading image:", error);
        } finally {
            setLoading(false);
        }
    };
    const handleRemoveImage = async (event) => {
        event.preventDefault();
        setUser({ ...user, image: null });
        setImage(null);
    };
    const validatePhone = (value) => {
        // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\+?[1-9]\d{9,14}$/;
        return phoneRegex.test(value);
    };
    const handlePhoneChange = (value, country, e, formattedValue) => {
        setUser({ ...user, phone: value });

        // Clear errors when user types
        setErrors(prev => ({ ...prev, phone: "" }));

        if (!validatePhone(value)) {
            setErrors(prev => ({ ...prev, phone: t('phone_error') }));
        }
    };
    return (
        <div className="bg-gradient-to-r min-h-screen flex items-center justify-center lg:p-20">
            <div className="font-std mb-10 w-full rounded-2xl bg-white p-10 font-normal leading-relaxed text-gray-900 shadow-xl">
                <div className="flex flex-col">
                    <div className="flex flex-col md:flex-row justify-between mb-5 items-start">
                        <h2 className="mb-5 text-4xl font-bold text-blue-900">{t('update_profile')}</h2>
                        <div className="text-center">
                            <div>
                                {loading ? (
                                    <div className="flex align-center justify-center py-8">
                                        <Loader />
                                    </div>
                                ) : (
                                    <img
                                        src={user?.image || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'}
                                        alt="Profile Picture" className="rounded-full w-32 h-32 mx-auto border-4 border-indigo-800 mb-4 transition-transform duration-300 hover:scale-105 ring ring-gray-300" />
                                )}

                                <input type="file" name="profile" id="upload_profile" hidden onChange={handleImageChange} />

                                <label for="upload_profile" className="inline-flex items-center">
                                    <svg data-slot="icon" className="w-5 h-5 text-blue-700" fill="none" stroke-width="1.5"
                                        stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
                                        aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z">
                                        </path>
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z">
                                        </path>
                                    </svg>
                                </label>
                            </div>
                            <button onClick={handleRemoveImage} className="bg-indigo-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors duration-300 ring ring-gray-300 hover:ring-indigo-300">
                                {t('remove_image')}
                            </button>
                        </div>
                    </div>
                    {error && <div className="alert alert-danger">{error}</div>}

                    <form className="space-y-4">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">{t('username')}</label>
                            <input
                                type="text"
                                id="username"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                value={user ? user.username : ''}
                                onChange={(e) => setUser({ ...user, username: e.target.value })}
                            />
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">{t('phone')}</label>
                            {/* <input
                                type="tel"
                                id="phone"
                                className={`w-full px-3 py-2 border ${user && !user.phoneVerified ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-indigo-500 focus:border-indigo-500`}
                                value={user ? user.phone : ''}
                                onChange={(e) => setUser({ ...user, phone: e.target.value })}
                            /> */}
                            <div className="space-y-4">
                                <PhoneInput
                                    country="ma"
                                    value={user ? user.phone : ''}
                                    id="phone"
                                    name="phone"
                                    inputClass={`!w-full !h-[50px] appearance-none block px-3 py-2 border ${errors.phone ? "border-red-300" : "border-gray-300"} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                    containerClass="w-full"
                                    required
                                    onChange={handlePhoneChange}
                                />
                            </div>
                            {user && !user.phoneVerified && (
                                <div>
                                    <p className="text-red-500 text-xs">{t('phone_unverified')}.</p>
                                    <button
                                        type="button"
                                        onClick={() => navigate("/phone-verification")}
                                        className="text-indigo-600 text-xs mt-1 hover:underline"
                                    >
                                        {t('verify_phone')}
                                    </button>
                                </div>
                            )}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">{t('email')}</label>
                            <input
                                type="email"
                                id="email"
                                className={`w-full px-3 py-2 border ${user && !user.emailVerified ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-indigo-500 focus:border-indigo-500`}
                                value={user ? user.email : ''}
                                onChange={(e) => setUser({ ...user, email: e.target.value })}
                            />
                            {user && !user.emailVerified && (
                                <div>
                                    <p className="text-red-500 text-xs">{t('email_unverified')}.</p>
                                    {/* <button
                    type="button"
                    onClick={() => navigate("/email-verification")}
                    className="text-indigo-600 text-xs mt-1 hover:underline"
                >
                    {t('verify_email')}
                </button> */}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                                onClick={() => setShowModal(true)}
                            >
                                {t('change_password')}
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                // className="px-4 py-2 bg-indigo-800 text-white rounded-lg hover:bg-indigo-700"
                                className={loading ? "bg-gray-300 px-4 py-2 rounded-md cursor-not-allowed opacity-50" : "px-4 py-2 bg-indigo-800 text-white rounded-lg hover:bg-indigo-700"}
                                onClick={updateUser}
                            >
                                {t('save_changes')}
                            </button>
                        </div>
                    </form>

                </div>
            </div>
            {/* Modal for changing password */}
            {showModal && (
                <Modal onClose={() => setShowModal(false)}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">{t('old_password')}</label>
                            <input
                                type="password"
                                id="oldPassword"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">{t('new_password')}</label>
                            <input
                                type="password"
                                id="newPassword"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">{t('confirm_password')}</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                                onClick={() => setShowModal(false)}
                            >
                                {t('cancel')}
                            </button>
                            <button
                                type="button"
                                className="px-4 py-2 bg-indigo-800 text-white rounded-lg hover:bg-indigo-700"
                                onClick={handlePasswordChange}
                            >
                                {t('change_password')}
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};
