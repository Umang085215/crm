import React, { useState, useEffect } from "react";
import * as yup from "yup";
import { useAuth } from "../auth/AuthContext";
import Button from "../components/buttons/Button";
import Input from "../components/formInput/Input";
import { Save } from "lucide-react";
const ALL_MODULES = [
  {
    name: "Dashboard",
    submodules: [],
  },
  {
    name: "Users",
    submodules: [],
  },
  {
    name: "Roles",
    submodules: [],
  },
  {
    name: "Reports",
    submodules: ["HR", "BDE", "Sales"],
  },
  {
    name: "Orders",
    submodules: [],
  },
  {
    name: "Settings",
    submodules: [],
  },
];

const schema = yup.object().shape({
  name: yup.string().required("Role name is required"),
  modules: yup
    .array()
    .min(1, "Select at least one module")
    .of(
      yup.object().shape({
        name: yup.string().required(),
        submodules: yup.array().of(yup.string()),
      })
    ),
});

const RoleManagement = () => {
  const [name, setName] = useState("");
  const [modules, setModules] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [errors, setErrors] = useState({});
  const { token } = useAuth();

  useEffect(() => {
    if (token) fetchRoles();
  }, [token]);

  const handleChange = (e) => {
    setName(e.target.value);
    setErrors({});
  };

  const fetchRoles = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/roles", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setRoles(data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const toggleModule = (moduleName) => {
    const exists = modules.find((m) => m.name === moduleName);
    if (exists) {
      setModules(modules.filter((m) => m.name !== moduleName));
    } else {
      const moduleObj = ALL_MODULES.find((m) => m.name === moduleName);
      setModules([...modules, { name: moduleObj.name, submodules: [] }]);
    }
  };

  const toggleSubmodule = (moduleName, submoduleName) => {
    const updatedModules = modules.map((m) => {
      if (m.name === moduleName) {
        const subExists = m.submodules.includes(submoduleName);
        return {
          ...m,
          submodules: subExists
            ? m.submodules.filter((s) => s !== submoduleName)
            : [...m.submodules, submoduleName],
        };
      }
      return m;
    });
    setModules(updatedModules);
  };

  const toggleAllSubmodules = (moduleName) => {
    const module = ALL_MODULES.find((m) => m.name === moduleName);
    if (!module || !module.submodules.length) return;

    const updatedModules = modules.map((m) => {
      if (m.name === moduleName) {
        const allSelected = m.submodules.length === module.submodules.length;
        return {
          ...m,
          submodules: allSelected ? [] : [...module.submodules],
        };
      }
      return m;
    });
    setModules(updatedModules);
  };

  const createRole = async () => {
    setErrorMsg("");
    setErrors({});
    try {
      const payload = modules.map((m) => ({
        name: m.name,
        submodules: m.submodules,
      }));
      await schema.validate({ name, modules: payload }, { abortEarly: false });
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/roles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, modules: payload }),
      });
      let data;
      try {
        data = await res.json();
      } catch {
        data = {};
      }
      setLoading(false);
      if (!res.ok) {
        setErrorMsg(data.message || "Failed to create role");
        return;
      }
      // Reset form
      setName("");
      setModules([]);
      fetchRoles();
    } catch (err) {
      setLoading(false);
      if (err.inner) {
        const validationErrors = {};
        err.inner.forEach((e) => (validationErrors[e.path] = e.message));
        setErrors(validationErrors);
      } else {
        setErrorMsg(err.message);
      }
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6 ">Role Management</h2>
      <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,70%)_minmax(0,30%)] gap-5 items-stretch">
        <div>
          {/* Create Role */}
          <div className="border border-lightGray dark:border-darkGray rounded-xl p-6 ">
            <h3 className="text-lg font-semibold mb-4">Create New Role</h3>
            {errorMsg && (
              <div className="mb-4 p-2 bg-red-100 text-center text-red-700 rounded">
                {errorMsg}
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-start  gap-4 mb-4">
              <Input
                id="role_name"
                type="text"
                name="name"
                value={name}
                handleChange={handleChange}
                className="w-full"
                errors={errors}
                labelName="Role Name"
              />
            </div>

            {/* Modules */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
              {ALL_MODULES.map((m, i) => {
                const isSelected = modules.find((mod) => mod.name === m.name);
                return (
                  <div
                    key={i}
                    className="border border-lightGray dark:border-darkGray px-2 py-1 rounded"
                  >
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!isSelected}
                        onChange={() => toggleModule(m.name)}
                        className="accent-primary"
                      />
                      <span className="font-medium">{m.name}</span>
                    </label>

                    {/* Submodules */}
                    {m.submodules.length > 0 && isSelected && (
                      <div className="ml-6 mt-2">
                        <label className="flex items-center gap-2 mb-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={
                              isSelected.submodules.length ===
                              m.submodules.length
                            }
                            onChange={() => toggleAllSubmodules(m.name)}
                            className="accent-primary"
                          />
                          <span className="font-medium text-sm">
                            Select All
                          </span>
                        </label>
                        {m.submodules.map((s) => (
                          <label
                            key={s}
                            className="flex items-center gap-2 ml-4 mb-1 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={isSelected.submodules.includes(s)}
                              onChange={() => toggleSubmodule(m.name, s)}
                              className="accent-primary"
                            />
                            <span className="text-sm">{s}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="w-full flex justify-end items-center mt-4">
              <div className="w-max ">
                <Button
                  text="Save"
                  handleClick={createRole}
                  icon={<Save size={18} />}
                />
              </div>
            </div>
          </div>

          {/* Existing Roles */}
          {/* <div>
        <h3 className="text-lg font-semibold mb-4">Existing Roles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.length > 0 &&
            roles.map((r) => (
              <div
                key={r._id}
                className=" p-4 border border-gray rounded-lg shadow hover:shadow-lg transition"
              >
                <div className="font-semibold text-gray-800 mb-2">{r.name}</div>
                <div className="flex flex-wrap gap-2">
                  {r.modules.map((mod, i) => (
                    <span
                      key={i}
                      className="bg-light_primary text-white text-sm px-2 py-1 rounded-md"
                    >
                      {mod.name}
                      {mod.submodules && mod.submodules.length > 0 && (
                        <span className="ml-1 text-xs">
                          ({mod.submodules.map((s) => s.name).join(", ")})
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div> */}
        </div>
        <div className="roleImg border border-lightGray dark:border-darkGray rounded-xl">
          <img
            src="https://demo.bizcompass.app/static/media/staff-home-1.64454c1ed01404b6d0df.png"
            alt="Elevva Image"
          />
        </div>
      </div>
    </div>
  );
};

export default RoleManagement;
