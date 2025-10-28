import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { FaGoogle, FaFacebookF, FaTwitter } from "react-icons/fa";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import Input from "../components/formInput/Input";
import loginbg from "../assets/adminImages/logo/login.svg";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

export default function Login() {
  const [formdata, setFormdata] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errors, setErrors] = useState({});
  const [acceptTC, setAcceptTC] = useState(false);
  const [termsConditionError, setTermsConditionError] = useState("");

  const navigate = useNavigate();
  const { setToken, setRole, setModules, setUser } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormdata({ ...formdata, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setErrorMsg("");
    setSuccessMsg("");
    try {
      await schema.validate(formdata, { abortEarly: false });
      if (!acceptTC) {
        setTermsConditionError("You must accept terms & conditions.");
        return;
      }
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formdata),
      });
      const data = await res.json();
      console.log(data.modules);
      if (!res.ok) {
        setErrorMsg(data.message || "Login failed");
        return;
      }
      setSuccessMsg(data.message || "Login successful");
      setToken(data.token);
      setRole(data.role);
      setModules(data.modules || []);
      setUser(data.user || null);
      if (data.role === "superadmin") {
        navigate("/admin/super-dashboard");
      } else if (
        data.modules?.some((m) => m.name.toLowerCase() === "dashboard")
      ) {
        navigate("/dashboard");
      } else {
        navigate("/unauthorized");
      }
    } catch (err) {
      if (err.name === "ValidationError") {
        const newErrors = {};
        err.inner.forEach((e) => {
          newErrors[e.path] = e.message;
        });
        setErrors(newErrors);
      } else {
        setErrorMsg("Something went wrong. Please try again.");
        console.error(err);
      }
    } finally {
      setTimeout(() => {
        setSuccessMsg("");
        setErrorMsg("");
      }, 5000);
    }
  };
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-[url('/images/login1.svg')] bg-cover bg-center before:content-[''] before:absolute before:inset-0 before:bg-white/10 overflow-hidden">
      <div className=" w-[50%] absolute left-[-10%] top-0 bottom-0 flex justify-center z-10 h-screen">
        <img src={loginbg} alt="admin logo" className="w-full opacity-30" />
      </div>

      <div className="relative w-full max-w-lg z-10">
        {/* Success/Error Messages */}
        {successMsg && (
          <p className="mb-1 p-3 rounded-md bg-green-100 text-green-700 border border-green-300 text-sm text-center">
            {successMsg}
          </p>
        )}
        {errorMsg && (
          <p className="mb-1 p-3 rounded-md bg-red-100 text-red-700 border border-red-300 text-sm text-center">
            {errorMsg}
          </p>
        )}
        <div className="bg-white shadow-md rounded-xl px-8 py-8 w-full max-w-lg border border-gray">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 sm:mb-0">
              Login
            </h2>
            <Link to="/" className="text-primary hover:underline text-sm">
              Don’t have an account?
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="text"
                name="email"
                placeholder="Email"
                className={`w-full px-4 py-2 rounded-md border   focus:outline-none transition ${
                  errors.email
                    ? "border-red-500"
                    : " border-gray-400 focus:border-gray-500"
                }`}
                value={formdata.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}

            <div className="relative">
              <Input
                id="password"
                type={`${showPassword ? "text" : "password"}`}
                name="password"
                value={formdata.password}
                handleChange={handleChange}
                errors={errors}
                labelName="Password"
              />
              <span
                className={`absolute right-1 top-1/2 ${
                  errors.password ? "-translate-y-[100%]" : "-translate-y-1/2"
                }  cursor-pointer text-darkGray  `}
                onClick={togglePassword}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>

            {/* T&C */}
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="accent-primary"
                  checked={acceptTC}
                  onChange={(e) => {
                    setAcceptTC(e.target.checked);
                    if (e.target.checked) setTermsConditionError("");
                  }}
                />
                Accept terms & conditions
              </label>
              {termsConditionError && (
                <p className="text-red-500 text-sm ">{termsConditionError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-dark hover:bg-orange-500 text-white  font-semibold py-3 rounded-md transition"
            >
              Sign in
            </button>

            {/* Divider */}
            <div className="flex items-center justify-center my-5 text-primary text-sm">
              <span className="border-b w-1/3"></span>
              <span className="px-2 font-semibold">Login with</span>
              <span className="border-b w-1/3"></span>
            </div>

            {/* Social Login */}
            <div className="flex justify-center gap-4">
              <button className="flex items-center justify-center w-12 h-12 rounded-full border border-gray-300 hover:bg-gray-100 transition">
                <FaGoogle className="text-red-500 text-lg" />
              </button>
              <button className="flex items-center justify-center w-12 h-12 rounded-full border border-gray-300 hover:bg-gray-100 transition">
                <FaFacebookF className="text-blue-600 text-lg" />
              </button>
              <button className="flex items-center justify-center w-12 h-12 rounded-full border border-gray-300 hover:bg-gray-100 transition">
                <FaTwitter className="text-sky-500 text-lg" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
