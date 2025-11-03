import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import Button from "../buttons/Button";
import Input from "../formInput/Input";
import * as yup from "yup";
import { ArrowLeft, Plus, Save, Eye, EyeOff, User } from "lucide-react";

// Validation schema
const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  role: yup.string().required("Role is required"),
  phone: yup
    .string()
    .matches(/^\d+$/, "Phone must contain only numbers")
    .required("Phone is required"),
  zipCode: yup
    .string()
    .matches(/^\d+$/, "Zip Code must contain only numbers")
    .required("Zip Code is required"),
  country: yup.string().required("Country is required"),
  state: yup.string().required("State is required"),
  profileImage: yup
    .mixed()
    .test(
      "fileType",
      "Allowed formats: jpeg, jpg, png",
      (value) =>
        !value ||
        (value && ["image/jpeg", "image/jpg", "image/png"].includes(value.type))
    )
    .test(
      "fileSize",
      "Max size is 1 MB",
      (value) => !value || (value && value.size <= 1024 * 1024)
    ),
});
export default function UserManagement() {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    dob: "",
    address: "",
    country: "",
    state: "",
    zipCode: "",
    role: "",
    about: "",
    profileImage: "",
    status: "Active",
    sendEmail: "true",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [fullCountryData, setFullCountryData] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [profilePreview, setProfilePreview] = useState(
    "https://demo.bizcompass.app/static/media/staff-home-1.64454c1ed01404b6d0df.png"
  );

  useEffect(() => {
    getAllCountries();
  }, []);
  useEffect(() => {
    getAllStates();
  }, [formData.country, fullCountryData]);
  // Fetch all countries
  const getAllCountries = async () => {
    try {
      setLoadingCountries(true);
      const res = await fetch("https://countriesnow.space/api/v0.1/countries");
      const data = await res.json();
      if (data.data) {
        setFullCountryData(data.data);
        setCountries(data.data.map((c) => c.country));
      }
    } catch (err) {
      console.error("Error fetching countries:", err);
    } finally {
      setLoadingCountries(false);
    }
  };
  // Fetch states when country changes
  const getAllStates = async () => {
    if (!formData.country) {
      setStates([]);
      setFormData((prev) => ({ ...prev, state: "" }));
      return;
    }
    try {
      const res = await fetch(
        "https://countriesnow.space/api/v0.1/countries/states",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country: formData.country }),
        }
      );
      const data = await res.json();
      if (data.data?.states?.length) {
        setStates(data.data.states.map((s) => s.name));
        setFormData((prev) => ({ ...prev, state: "" }));
      } else {
        setStates([]);
        setFormData((prev) => ({ ...prev, state: "" }));
      }
    } catch (err) {
      console.error(err);
      setStates([]);
    }
  };
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone" || name === "zipCode") {
      const digits = value.replace(/\D/g, "");
      if (value !== digits) {
        setErrors((prev) => ({
          ...prev,
          [name]: "Only numbers are allowed",
        }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: digits }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };
  //Handle Image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePreview(reader.result);
      reader.readAsDataURL(file);
      setFormData((prev) => ({ ...prev, profileImage: file }));
      setErrors((prev) => ({ ...prev, profileImage: "" }));
    }
  };
  // Handle Status toggle
  const handleStatusToggle = (status) => {
    setFormData((prev) => ({ ...prev, status }));
  };
  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setErrorMsg("");
    setSuccessMsg("");
    try {
      await schema.validate(formData, { abortEarly: false });
      const fd = new FormData();
      Object.keys(formData).forEach((key) => fd.append(key, formData[key]));
      console.log("===== Form Data Submitted =====");
      for (let [key, value] of fd.entries()) console.log(`${key}:`, value);
      setSuccessMsg("Form submitted successfully! (No API call made)");
      // const res = await fetch("http://localhost:5000/api/users", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${token}`,
      //   },
      //   body: JSON.stringify(formData),
      // });
      // const data = await res.json();
      // if (!res.ok) throw new Error(data.message || "Failed to create user");
      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        dob: "",
        address: "",
        country: "",
        state: "",
        zipCode: "",
        role: "",
        about: "",
        profileImage: "",
        status: "InActive",
      });
      setProfilePreview(
        "https://demo.bizcompass.app/static/media/staff-home-1.64454c1ed01404b6d0df.png"
      );
      setStates([]);
      setSuccessMsg("User created successfully!");
    } catch (err) {
      if (err.inner) {
        const validationErrors = {};
        err.inner.forEach((e) => (validationErrors[e.path] = e.message));
        setErrors(validationErrors);
      } else {
        setErrorMsg(err.message);
      }
    }
  };
  // hide/show password
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };
  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    const randomPass = Array.from({ length: 10 }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join("");
    setFormData({ ...formData, password: randomPass });
    setShowPassword(true);
  };

  return (
    <div className="">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-semibold mb-4 ">Create User</h2>
        <div>
          <Link
            to="/admin/usermanagement/users"
            className="px-2 py-1.5  flex gap-1 items-center bg-dark text-white rounded-md"
          >
            <ArrowLeft size={18} />
            <span>Back</span>
          </Link>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-4 p-2 bg-red-100 text-center text-red-700 rounded">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="mb-4 p-2 bg-lightBottelGreen text-center text-bottelGreen rounded">
          {successMsg}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-[minmax(0,30%)_minmax(0,70%)] gap-5 items-stretch"
      >
        {/* User Profile */}
        <div className="p-6 flex flex-col items-center gap-4 border border-lightGray dark:border-darkGray rounded-xl">
          <div className="relative w-36 h-36">
            <img
              src={profilePreview}
              alt="Profile"
              className="w-full h-full rounded-full object-contain border border-gray-300"
            />

            <label className="absolute w-8 h-8 flex justify-center items-center bottom-0 right-5 bg-dark text-white px-2 py-1 rounded-md cursor-pointer hover:bg-light hover:text-dark">
              <Plus size={24} />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
          <p
            className={`text-center  ${
              errors.profileImage ? "text-red-600" : "text-[#605e5e]"
            } my-2`}
          >
            Allowed *.jpeg, *.jpg, *.png, <br /> max size of 1 Mb{" "}
          </p>
          {/* Status Toggle */}
          <div className="col-span-2 flex justify-center">
            <div className="w-64 flex border rounded-full p-1 bg-gray-200">
              <button
                type="button"
                onClick={() => handleStatusToggle("Active")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full transition-all duration-200 ${
                  formData.status === "Active"
                    ? "bg-green-700 text-white"
                    : "text-green-700"
                }`}
              >
                Active
              </button>
              <button
                type="button"
                onClick={() => handleStatusToggle("InActive")}
                className={` flex-1 flex items-center justify-center gap-2 py-2 rounded-full transition-all duration-200 ${
                  formData.status === "InActive"
                    ? "bg-red-700 text-white"
                    : "text-red-700"
                }`}
              >
                Inactive
              </button>
            </div>
          </div>
        </div>
        {/* User Form */}
        <div className=" rounded-xl p-6 border border-lightGray dark:border-darkGray">
          {/* <h3 className="text-lg font-semibold mb-4">Create New User</h3> */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              id="user_name"
              type="text"
              name="name"
              value={formData.name}
              handleChange={handleChange}
              className="col-span-2 md:col-span-1"
              errors={errors}
              labelName="Full Name"
            />
            <Input
              id="user_email"
              type="text"
              name="email"
              value={formData.email}
              handleChange={handleChange}
              className="col-span-2 md:col-span-1"
              errors={errors}
              labelName="Email"
            />
            <div className="relative">
              <Input
                id="user_password"
                type={`${showPassword ? "text" : "password"}`}
                name="password"
                value={formData.password}
                handleChange={handleChange}
                className="col-span-2 md:col-span-1"
                errors={errors}
                labelName="Password"
              />
              <div
                className={`flex gap-2 absolute  right-3 top-1/2 ${
                  errors.password ? "-translate-y-[100%]" : "-translate-y-1/2"
                }  cursor-pointer text-darkGray`}
              >
                <button
                  type="button"
                  onClick={generatePassword}
                  className="bg-light text-xs font-medium text-dark p-1 rounded whitespace-nowrap"
                >
                  Generate
                </button>
                <span onClick={togglePassword}>
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              </div>
            </div>
            <Input
              id="user_phone"
              type="tel"
              name="phone"
              value={formData.phone}
              handleChange={handleChange}
              className="col-span-2 md:col-span-1"
              errors={errors}
              labelName="Phone"
            />
            <Input
              id="user_role"
              type="text"
              name="role"
              value={formData.role}
              handleChange={handleChange}
              className="col-span-2 md:col-span-1"
              errors={errors}
              labelName="Role"
            />
            <Input
              id="user_dob"
              type="date"
              name="dob"
              value={formData.dob}
              handleChange={handleChange}
              className="col-span-2 md:col-span-1"
              errors={errors}
              labelName="DOB"
            />
            {/* Country Dropdown */}
            <div className="col-span-2 md:col-span-1">
              <div className="relative w-full">
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className={`block w-full p-[14px] text-sm bg-transparent rounded-md border appearance-none focus:outline-none peer transition 
        ${
          errors.country
            ? "border-red-500 "
            : "border-lightGray dark:border-darkGray focus:border-black"
        }
        `}
                >
                  <option value="" disabled hidden>
                    Select Country
                  </option>
                  {loadingCountries ? (
                    <option disabled>Loading...</option>
                  ) : (
                    countries.map((c) => (
                      <option key={c} value={c} className="text-darkBg">
                        {c}
                      </option>
                    ))
                  )}
                </select>
                <label
                  htmlFor="country"
                  className={`absolute pointer-events-none font-medium text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-darkBg px-2
            peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2
            peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4
            ${
              errors.country
                ? "peer-focus:text-red-500"
                : "peer-focus:text-darkBg dark:peer-focus:text-white"
            }
            rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1`}
                >
                  Country
                </label>
                {errors.country && (
                  <p className="text-red-500 text-sm mt-1">{errors.country}</p>
                )}
              </div>
            </div>
            {/* State Dropdown */}
            <div className="col-span-2 md:col-span-1">
              <div className="relative w-full">
                <select
                  id="user_state"
                  name="state"
                  value={formData.country}
                  onChange={handleChange}
                  className={`block w-full p-[14px] text-sm bg-transparent rounded-md border appearance-none focus:outline-none peer transition 
        ${
          errors.country
            ? "border-red-500 "
            : " border-lightGray dark:border-darkGray focus:border-black"
        }
        dark:text-white`}
                >
                  <option value="" disabled hidden>
                    Select State
                  </option>
                  {loadingCountries ? (
                    <option disabled>Loading...</option>
                  ) : (
                    states.map((c) => (
                      <option key={c} value={c} className="text-darkBg">
                        {c}
                      </option>
                    ))
                  )}
                </select>
                <label
                  htmlFor="state"
                  className={`absolute pointer-events-none font-medium text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-darkBg px-2
            peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2
            peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4
            ${
              errors.state
                ? "peer-focus:text-red-500"
                : "peer-focus:text-darkBg dark:peer-focus:text-white"
            }
            rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1`}
                >
                  State
                </label>
                {errors.state && (
                  <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                )}
              </div>
            </div>

            {/* Remaining Inputs */}

            <Input
              id="user_address"
              type="text"
              name="address"
              value={formData.address}
              handleChange={handleChange}
              className=""
              errors={errors}
              labelName="Address"
            />
            <Input
              id="user_zipcode"
              type="text"
              name="zipCode"
              value={formData.zipCode}
              handleChange={handleChange}
              className="col-span-2 md:col-span-1"
              errors={errors}
              labelName="Zip Code"
            />

            <div className="col-span-2">
              <div className="relative w-full">
                <textarea
                  id="user_about"
                  name="about"
                  rows={4}
                  value={formData.about}
                  onChange={handleChange}
                  placeholder=" "
                  className={`block p-[14px] w-full text-sm bg-transparent rounded-md border  appearance-none focus:outline-none peer transition
        ${
          errors.about
            ? "border-red-500 "
            : "border-lightGray dark:border-darkGray focus:border-black"
        }
        `}
                />
                <label
                  htmlFor="about"
                  className={`absolute pointer-events-none font-medium text-sm text-gray-500  duration-300 transform  z-10 origin-[0] bg-white dark:bg-darkBg px-2
            peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2
            peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-darkBg dark:peer-focus:text-white
            rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1`}
                >
                  About
                </label>
                {errors.about && (
                  <p className="text-red-500 text-sm mt-1">{errors.about}</p>
                )}
              </div>
            </div>
            {/* Checkbox */}
            <div className="col-span-2 flex items-start space-x-2 mt-2">
              <input
                id="terms"
                type="checkbox"
                name="terms"
                checked={formData.sendEmail}
                onChange={(e) =>
                  setFormData({ ...formData, sendEmail: e.target.checked })
                }
                className="mt-1 w-4 h-4 border rounded focus:ring-none  cursor-pointer"
              />
              <label
                htmlFor="terms"
                className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none"
              >
                Send Welcome Email
              </label>
            </div>

            <div className="col-span-2 flex justify-end">
              <Button type="submit" text="Save" icon={<Save size={18} />} />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
