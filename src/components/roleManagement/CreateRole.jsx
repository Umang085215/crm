import React, { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import * as yup from "yup";
import { div } from "framer-motion/client";

// Validation Schema
const schema = yup.object().shape({
  name: yup.string().required("Role name is required"),
  description: yup
    .string()
    .min(10, "Description should be at least 10 characters")
    .required("Description is required"),
});

const CreateRole = () => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: [],
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await schema.validate(formData, { abortEarly: false });
      setLoading(true);
      if (!token) {
        console.log("No token found. Please log in again.");
        return;
      }
      const payload = {
        name: formData.name,
        description: formData.description,
        permissions: formData.permissions || [],
      };
      const res = await fetch(
        "https://crm-backend-qbz0.onrender.com/api/roles",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error response:", errorData);
        return;
      }
      const data = await res.json();
      navigate(`/admin/rolemanagement/edit-roles/${data.role._id}`);
    } catch (error) {
      if (error.inner) {
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
      } else {
        console.error("Error creating role:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Role & Permission Management</h2>
        <button
          onClick={() => navigate("/admin/rolemanagement/roles")}
          className="flex items-center gap-2 px-3 py-1.5 bg-gray-600 text-white text-sm rounded-md hover:opacity-90 transition"
        >
          <ArrowLeft size={16} /> Back
        </button>
      </div>
      <div className="mx-auto bg-white dark:bg-darkBg border border-lightGray dark:border-darkGray rounded-xl p-6 shadow-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-darkBg dark:text-white">
            Create New Role
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Role Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Role Name <span className="text-red-600">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter role name"
                className={`w-full p-2 border ${
                  errors.name ? "border-red-500" : "border-lightGray"
                } dark:border-darkGray rounded-md focus:outline-none focus:border-gray-500 dark:bg-darkGray dark:text-white`}
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1 font-medium">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Description <span className="text-red-600">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows="1"
                placeholder="Enter at least 10 characters"
                className={`w-full p-2 border ${
                  errors.description ? "border-red-500" : "border-lightGray"
                } dark:border-darkGray rounded-md focus:outline-none focus:border-gray-500 dark:bg-darkGray dark:text-white resize-none`}
                value={formData.description}
                onChange={handleChange}
              />
              {errors.description && (
                <p className="text-red-600 text-sm mt-1 font-medium">
                  {errors.description}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center gap-2 bg-dark text-white font-medium px-4 py-2 rounded-md transition ${
                loading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"
              }`}
            >
              <Save size={18} />
              <span>{loading ? "Saving..." : "Save"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRole;
