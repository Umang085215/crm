import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { FaGoogle, FaFacebookF, FaTwitter } from "react-icons/fa";
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

      // ✅ Store everything in AuthContext (this automatically updates sidebar)
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
    <div className="relative flex items-center justify-center min-h-screen bg-[url('/images/login1.svg')] bg-cover bg-center before:content-[''] before:absolute before:inset-0 before:bg-white/10 overflow-hidden">
      <div className="w-[50%] absolute left-[-10%] top-0 bottom-0 flex justify-center z-10 h-screen">
        <img src={loginbg} alt="admin logo" className="w-full opacity-30" />
      </div>

      <div className="relative w-full max-w-lg z-10">
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
            <Input
              id="login_email"
              type="text"
              name="email"
              value={formdata.email}
              handleChange={handleChange}
              errors={errors}
              labelName="Email"
            />

            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formdata.password}
              handleChange={handleChange}
              errors={errors}
              labelName="Password"
            />
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-dark hover:bg-orange-500 text-white font-semibold py-3 rounded-md transition ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

            <div className="flex items-center justify-center my-5 text-primary text-sm">
              <span className="border-b w-1/3"></span>
              <span className="px-2 font-semibold">Login with</span>
              <span className="border-b w-1/3"></span>
            </div>

            <div className="flex justify-center gap-4">
              <button
                type="button"
                className="flex items-center justify-center w-12 h-12 rounded-full border border-gray-300 hover:bg-gray-100 transition"
              >
                <FaGoogle className="text-red-500 text-lg" />
              </button>
              <button
                type="button"
                className="flex items-center justify-center w-12 h-12 rounded-full border border-gray-300 hover:bg-gray-100 transition"
              >
                <FaFacebookF className="text-blue-600 text-lg" />
              </button>
              <button
                type="button"
                className="flex items-center justify-center w-12 h-12 rounded-full border border-gray-300 hover:bg-gray-100 transition"
              >
                <FaTwitter className="text-sky-500 text-lg" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
