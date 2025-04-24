import { useState } from "react";
import { useNavigate } from "react-router-dom";

const UserMenu = ({ handleLogout, user, t, setMenuOpen }) => {
    const [profileOpen, setProfileOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="relative">
            {/* User Button or Login Button */}
            {user && user?.username ? (


                <div
                    className="w-full flex items-center justify-center gap-2 bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg 
                   hover:bg-gray-700 transition duration-300 cursor-pointer"
                    onClick={() => {
                        if (user) {
                            setProfileOpen((prev) => !prev);
                        } else {
                            navigate("/auth"); // Navigate to the login page
                        }
                    }}
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M16 20C20.4183 20 24 16.4183 24 12C24 7.58172 20.4183 4 16 4C11.5817 4 8 7.58172 8 12C8 16.4183 11.5817 20 16 20Z"
                            stroke="white"
                            strokeWidth="2"
                            strokeMiterlimit="10"
                        />
                        <path
                            d="M3.875 26.9999C5.10367 24.8713 6.87104 23.1037 8.99944 21.8747C11.1278 20.6458 13.5423 19.9988 16 19.9988C18.4577 19.9988 20.8722 20.6458 23.0006 21.8747C25.129 23.1037 26.8963 24.8713 28.125 26.9999"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>

                    <span className="flex items-center gap-1">
                        {user ? (
                            <>
                                {user.username}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="10"
                                    height="6"
                                    viewBox="0 0 10 6"
                                    fill="none"
                                >
                                    <path
                                        d="M9 1.125L5.25 4.875L1.5 1.125"
                                        stroke="white"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </>
                        ) : (
                            <span>{t("login")}</span> // Login text if no user is logged in
                        )}
                    </span>
                </div>
            ) : (
                <div
                    className="w-full flex items-center justify-center gap-2 bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg 
                   hover:bg-gray-700 transition duration-300 cursor-pointer"
                    onClick={() => {
                        navigate("/auth");
                        setMenuOpen(false);
                    }}
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M16 20C20.4183 20 24 16.4183 24 12C24 7.58172 20.4183 4 16 4C11.5817 4 8 7.58172 8 12C8 16.4183 11.5817 20 16 20Z"
                            stroke="white"
                            strokeWidth="2"
                            strokeMiterlimit="10"
                        />
                        <path
                            d="M3.875 26.9999C5.10367 24.8713 6.87104 23.1037 8.99944 21.8747C11.1278 20.6458 13.5423 19.9988 16 19.9988C18.4577 19.9988 20.8722 20.6458 23.0006 21.8747C25.129 23.1037 26.8963 24.8713 28.125 26.9999"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>

                    <span className="flex items-center gap-1">

                        <span>{t("login")}</span>
                    </span>
                </div>
            )}





            {/* Profile Dropdown Menu */}
            {profileOpen && user && (
                <div className="absolute right-0 mt-2 w-[220px] bg-white shadow-lg rounded-lg overflow-hidden">
                    <ul className="text-gray-700">
                        <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                                navigate("/profile");
                                setProfileOpen(false);
                                setMenuOpen(false);
                            }}
                        >
                            {t("profile")}
                        </li>
                        <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                                navigate("/myProduct");
                                setProfileOpen(false);
                                setMenuOpen(false);
                            }}
                        >
                            {t("my_ann")}
                        </li>
                        <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                                navigate("/myFavorite");
                                setMenuOpen(false);
                            }}
                        >
                            {t("favorites")}
                        </li>

                        {user && user.isAdmin ? (
                            <li
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                    navigate("/dashBoard");
                                    setProfileOpen(false);
                                    setMenuOpen(false);
                                }}
                            >
                                {t("dashboard")}
                            </li>
                        ) : null}
                        <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500"
                            onClick={() => handleLogout()}
                        >
                            {t("logout")}
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default UserMenu;
