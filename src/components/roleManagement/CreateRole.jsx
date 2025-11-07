// import React, { useEffect, useState } from "react";
// import { ArrowLeft, Save } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../auth/AuthContext";
// import * as yup from "yup";

// const schema = yup.object().shape({
//   name: yup.string().trim().required("Role name is required"),
//   description: yup
//     .string()
//     .trim()
//     .min(10, "Description should be at least 10 characters")
//     .required("Description is required"),
// });

// const CreateRole = () => {
//   const { token } = useAuth();
//   const navigate = useNavigate();

//   const [role, setRole] = useState({ name: "", description: "" });
//   const [permissions, setPermissions] = useState([]);
//   const [selected, setSelected] = useState({});
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [successMsg, setSuccessMsg] = useState("");
//   const [errorMsg, setErrorMsg] = useState("");

//   // ✅ Fetch all available permissions
//   useEffect(() => {
//     const fetchPermissions = async () => {
//       try {
//         const res = await fetch(
//           "https://crm-backend-qbz0.onrender.com/api/roles/permissions/all",
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         const data = await res.json();
//         if (data?.permissions) setPermissions(data.permissions);
//       } catch (err) {
//         console.error("Error fetching permissions:", err);
//       }
//     };
//     fetchPermissions();
//   }, [token]);

//   // ✅ Group by module/resource
//   const groupedModules = [...new Set(permissions.map((p) => p.resource))];

//   // ✅ Handle toggle per action
//   const handleToggle = (module, action) => {
//     setSelected((prev) => {
//       const prevModule = prev[module] || {
//         create: false,
//         read: false,
//         update: false,
//         delete: false,
//         manage: false,
//       };

//       const updated = {
//         ...prevModule,
//         [action]: !prevModule[action],
//       };

//       // ✅ If all CRUD true, mark manage true
//       updated.manage =
//         updated.create && updated.read && updated.update && updated.delete;

//       return { ...prev, [module]: updated };
//     });
//   };

//   // ✅ Handle "Allow All"
//   const handleAllowAll = (module) => {
//     setSelected((prev) => {
//       const prevModule = prev[module] || {
//         create: false,
//         read: false,
//         update: false,
//         delete: false,
//         manage: false,
//       };
//       const allSelected =
//         prevModule.create &&
//         prevModule.read &&
//         prevModule.update &&
//         prevModule.delete &&
//         prevModule.manage;

//       const newVal = !allSelected;

//       return {
//         ...prev,
//         [module]: {
//           create: newVal,
//           read: newVal,
//           update: newVal,
//           delete: newVal,
//           manage: newVal,
//         },
//       };
//     });
//   };

//   // ✅ Handle input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setRole((prev) => ({ ...prev, [name]: value }));
//     setErrors((prev) => ({ ...prev, [name]: "" }));
//   };

//   // ✅ Save new role
//   const handleSave = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setErrorMsg("");
//     setSuccessMsg("");

//     try {
//       await schema.validate(role, { abortEarly: false });

//       // ✅ Collect selected permissions
//       const selectedPermissions = [];
//       permissions.forEach((perm) => {
//         const mod = selected[perm.resource];
//         if (!mod) return;

//         if (mod.manage && perm.action === "manage") {
//           selectedPermissions.push(perm._id);
//         } else if (!mod.manage && mod[perm.action]) {
//           selectedPermissions.push(perm._id);
//         }
//       });

//       const payload = {
//         name: role.name.trim(),
//         description: role.description.trim(),
//         permissions: selectedPermissions,
//         isActive: true,
//       };

//       const res = await fetch(
//         "https://crm-backend-qbz0.onrender.com/api/roles",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify(payload),
//         }
//       );

//       const data = await res.json();

//       if (!res.ok) {
//         setErrorMsg(data?.message || "Failed to create role.");
//         return;
//       }

//       setSuccessMsg("Role created successfully!");
//     } catch (error) {
//       if (error.inner) {
//         const validationErrors = {};
//         error.inner.forEach(
//           (err) => (validationErrors[err.path] = err.message)
//         );
//         setErrors(validationErrors);
//       } else {
//         console.error("Error creating role:", error);
//       }
//     } finally {
//       setLoading(false);
//       setTimeout(() => {
//         setSuccessMsg("");
//         setErrorMsg("");
//       }, 6000);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {errorMsg && (
//         <div className="mb-4 p-2 bg-red-100 text-center text-red-700 rounded">
//           {errorMsg}
//         </div>
//       )}
//       {successMsg && (
//         <div className="mb-4 p-2 bg-green-100 text-center text-green-700 rounded">
//           {successMsg}
//         </div>
//       )}

//       {/* Role Details */}
//       <div className="grid grid-cols-3 gap-4">
//         <div className="col-span-3 p-6 bg-white dark:bg-darkBg border border-lightGray dark:border-darkGray rounded-lg">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-2xl font-semibold">Create New Role</h2>
//             <button
//               onClick={() => navigate(-1)}
//               className="flex items-center gap-2 text-gray-600 dark:text-white hover:text-dark transition"
//             >
//               <ArrowLeft size={20} />
//               <span className="text-sm font-medium">Back</span>
//             </button>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {/* Role Name */}
//             <div>
//               <label className="block font-medium mb-1">Role Name</label>
//               <input
//                 type="text"
//                 name="name"
//                 value={role.name || ""}
//                 onChange={handleChange}
//                 className={`w-full p-2 border ${
//                   errors.name ? "border-red-500" : "border-lightGray"
//                 } rounded-md focus:outline-none focus:border-gray-500 dark:bg-darkGray dark:text-white`}
//               />
//               {errors.name && (
//                 <p className="text-red-600 text-sm mt-1 font-medium">
//                   {errors.name}
//                 </p>
//               )}
//             </div>

//             {/* Description */}
//             <div>
//               <label className="block font-medium mb-1">Description</label>
//               <textarea
//                 name="description"
//                 value={role.description || ""}
//                 onChange={handleChange}
//                 className={`w-full p-2 border ${
//                   errors.description ? "border-red-500" : "border-lightGray"
//                 } rounded-md focus:outline-none focus:border-gray-500 dark:bg-darkGray dark:text-white`}
//                 rows="1"
//               />
//               {errors.description && (
//                 <p className="text-red-600 text-sm mt-1 font-medium">
//                   {errors.description}
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Permissions Table */}
//       <div className="bg-white dark:bg-darkBg rounded-lg shadow-md border">
//         <div className="overflow-x-auto">
//           <table className="w-full border-collapse text-sm">
//             <thead className="bg-gray-100 dark:bg-gray-800">
//               <tr>
//                 <th className="border p-3 text-left">Modules</th>
//                 <th className="border p-3 text-center">
//                   Create <br />
//                   <small>able to add new data</small>
//                 </th>
//                 <th className="border p-3 text-center">
//                   Read <br />
//                   <small>able to view data only</small>
//                 </th>
//                 <th className="border p-3 text-center">
//                   Update
//                   <br /> <small>able to modify existing data</small>
//                 </th>
//                 <th className="border p-3 text-center">
//                   Delete <br /> <small>able to delete data</small>
//                 </th>
//                 <th className="border p-3 text-center">
//                   Allow All <br /> <small>able to access all CRUD</small>
//                 </th>
//               </tr>
//             </thead>

//             <tbody>
//               {groupedModules.map((module) => (
//                 <tr key={module} className="border-b hover:bg-gray-50">
//                   <td className="border p-3 font-medium capitalize">
//                     {module}
//                   </td>
//                   {["create", "read", "update", "delete"].map((action) => (
//                     <td key={action} className="border text-center">
//                       <input
//                         type="checkbox"
//                         checked={selected[module]?.[action] || false}
//                         onChange={() => handleToggle(module, action)}
//                       />
//                     </td>
//                   ))}
//                   <td className="border text-center">
//                     <input
//                       type="checkbox"
//                       onChange={() => handleAllowAll(module)}
//                       checked={selected[module]?.manage || false}
//                     />
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         <div className="flex justify-end border-t px-6 py-4 bg-gray-50">
//           <button
//             onClick={handleSave}
//             disabled={loading}
//             className={`flex items-center gap-2 bg-dark text-white font-medium px-4 py-2 rounded-md transition ${
//               loading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"
//             }`}
//           >
//             <Save size={18} />
//             <span>{loading ? "Saving..." : "Save Role"}</span>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateRole;

import React, { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import * as yup from "yup";

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
    <div className="mx-auto bg-white dark:bg-darkBg border border-lightGray dark:border-darkGray rounded-xl p-6 shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-darkBg dark:text-white">
          Create New Role
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-gray-600 dark:text-white hover:text-dark transition"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Back</span>
        </button>
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
  );
};

export default CreateRole;
