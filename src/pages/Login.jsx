import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { FaGoogle, FaFacebookF, FaTwitter } from "react-icons/fa";
import { Mail, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import Input from "../components/ui/Input";
import loginbg from "../assets/adminImages/logo/loginBg.jpg";
import logo from "../assets/adminImages/logo/logo.png";
import googleLogo from "../assets/adminImages/logo/google-logo.svg";

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
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ use single login() from context

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
    setLoading(true);

    try {
      await schema.validate(formdata, { abortEarly: false });

      const response = await fetch(
        "https://crm-backend-qbz0.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formdata),
        }
      );

      const data = await response.json();
      console.log("LOGIN RESPONSE:", data);

      if (!response.ok || !data.token || !data.user) {
        setErrorMsg(data.message || "Invalid credentials");
        return;
      }
      await login(data);
      setSuccessMsg("Login successful!");
      // ✅ Redirect based on role
      const userRole = data.user.role?.name?.toLowerCase() || "user";
      if (userRole === "admin") navigate("/admin/super-dashboard");
      else navigate("/dashboard");
    } catch (err) {
      if (err.name === "ValidationError") {
        const newErrors = {};
        err.inner.forEach((e) => {
          newErrors[e.path] = e.message;
        });
        setErrors(newErrors);
      } else {
        console.error("Login error:", err);
        setErrorMsg("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
      setTimeout(() => {
        setSuccessMsg("");
        setErrorMsg("");
      }, 4000);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen bg-white dark:bg-gray-900 p-3">
      {/* Left Column - Login Form */}
      <div className="flex flex-col justify-center items-center px-6">
        <div className="flex items-center gap-2 mb-6">
          <img src={logo} alt="Elevva CRM Logo" className="w-10 h-10" />
          <h1 className="text-3xl font-semibold ">Elevva CRM</h1>
        </div>

        {/* Login  */}
        <div className="w-full rounded-xl p-12 border border-gary-300 ">
          {successMsg && (
            <p className="mb-3 p-3 rounded-md bg-green-100 text-green-700 border border-green-300 text-sm text-center">
              {successMsg}
            </p>
          )}
          {errorMsg && (
            <p className="mb-3 p-3 rounded-md bg-red-100 text-red-700 border border-red-300 text-sm text-center">
              {errorMsg}
            </p>
          )}

          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 sm:mb-0">
                Login
              </h2>
              <p className="text-gray-500 text-md mt-2">
                Login to access the Elevva CRM
              </p>
            </div>
            <div>
              Don’t have an account?{" "}
              <Link
                to="/"
                className="text-[#3282ff] hover:underline text-md font-medium"
              >
                Create account
              </Link>
            </div>
          </div>

          {/* Login Form */}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <label htmlFor="email" className=" font-medium">
                Email Address
              </label>
              <Input
                id="login_email"
                type="text"
                name="email"
                value={formdata.email}
                handleChange={handleChange}
                errors={errors}
                labelName="Email"
                className="mt-2"
                icon={<Mail size={18} />}
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className=" font-medium">
                Password
              </label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formdata.password}
                handleChange={handleChange}
                errors={errors}
                labelName="Password"
                className="mt-2"
                icon={
                  showPassword ? (
                    <EyeOff
                      size={18}
                      className="cursor-pointer"
                      onClick={() => setShowPassword(false)}
                    />
                  ) : (
                    <Eye
                      size={18}
                      className="cursor-pointer"
                      onClick={() => setShowPassword(true)}
                    />
                  )
                }
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer ">
                <input
                  type="checkbox"
                  className="w-4 h-4  accent-[#3282ff]  border-gray-300 rounded "
                />
                Remember me
              </label>
              <Link
                to="/forgot-password"
                className="text-[#3282ff]  font-medium hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#3282ff] text-white font-semibold py-3 rounded-md transition-all duration-300 shadow-md hover:shadow-lg hover:opacity-90 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

            {/* Divider */}
            <div className="flex items-center justify-center my-5 text-gray-500 dark:text-gray-300 text-sm">
              <span className="border-b w-1/3"></span>
              <span className="px-2 font-semibold">or login with</span>
              <span className="border-b w-1/3"></span>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                className="flex items-center justify-center p-3 bg-[#3282ff]  rounded border border-gray-300  hover:opacity-90  transition"
              >
                <FaFacebookF className="text-[#3282ff] text-2xl p-1 bg-white rounded-full" />
              </button>
              <button
                type="button"
                className="flex items-center justify-center p-3 rounded border border-gray-300 hover:opacity-90 transition"
              >
                <img src={googleLogo} alt="google" />
              </button>
              <button
                type="button"
                className="flex items-center justify-center p-3  rounded bg-black border border-gray-300 hover:opacity-90 transition"
              >
                <FaTwitter className="text-[#3282ff] text-2xl p-1 bg-white rounded-full" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Column - Image */}
      <div className="hidden md:flex justify-center items-center ">
        <div className="relative w-[100%] h-[100%]">
          <img
            src={loginbg}
            alt="Login Illustration"
            className="w-full h-full object-cover rounded-xl shadow"
          />
        </div>
      </div>
    </div>
  );
}
