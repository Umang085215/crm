import React, { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  Checkbox,
} from "@mui/material";
import { Pencil, Plus, RefreshCcw, Mail, AtSign } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import DateDisplay from "../ui/DateDisplay";
import Spinner from "../loaders/Spinner";
import ToolTip from "../ui/ToolTip";
import NoData from "../ui/NoData";
const UserList = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState([]);
  const [counts, setCounts] = useState({ all: 0, active: 0, inactive: 0 });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
    limit: 10,
  });
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("user_id");
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAllUsers(pagination.page, pagination.limit, activeTab, searchQuery);
  }, [pagination.page, pagination.limit, activeTab, token, searchQuery]);

  const getAllUsers = async (page = 1, limit = 5, tab = "All", search = "") => {
    try {
      setLoading(true);
      let url = `https://crm-backend-qbz0.onrender.com/api/users?page=${page}&limit=${limit}`;
      if (tab === "Active") url += `&status=active`;
      if (tab === "InActive") url += `&status=inactive`;
      if (search.trim() !== "") url += `&search=${encodeURIComponent(search)}`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data?.success) {
        setAllUsers(data.users || []);
        setPagination(data.pagination);
        const activeCount = data.users.filter(
          (u) => u.status === "active"
        ).length;
        const inactiveCount = data.users.filter(
          (u) => u.status === "inactive"
        ).length;
        const allCount = data.pagination.total;
        setCounts({
          all: allCount,
          active: activeCount,
          inactive: inactiveCount,
        });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const filteredData = useMemo(() => {
    let data = [...allUsers];

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      data = data.filter((user) =>
        Object.values(user).some((value) => {
          if (Array.isArray(value)) {
            return value.some((item) =>
              item.toString().toLowerCase().includes(query)
            );
          }
          return value?.toString().toLowerCase().includes(query);
        })
      );
    }

    return data;
  }, [allUsers, searchQuery]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const aVal = a[orderBy] ?? "";
      const bVal = b[orderBy] ?? "";
      return order === "asc"
        ? aVal.localeCompare?.(bVal)
        : bVal.localeCompare?.(aVal);
    });
  }, [filteredData, order, orderBy]);

  const handleChangePage = (event, newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage + 1 }));
  };

  const handleChangeRowsPerPage = (event) => {
    setPagination((prev) => ({
      ...prev,
      limit: parseInt(event.target.value, 10),
      page: 1,
    }));
  };

  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold ">All Users</h2>
          <button className="flex items-center gap-2 " onClick={getAllUsers}>
            <ToolTip
              title="Refresh"
              placement="top"
              icon={<RefreshCcw size={16} />}
            />
          </button>
        </div>
        <div>
          {/* Tabs */}
          <div className="relative mb-4">
            <div className="flex gap-4 border-b border-gray-200 mb-4">
              {["All", "Active", "InActive"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative flex items-center gap-2 px-4 py-2 transition-all duration-300 ${
                    activeTab === tab
                      ? "text-dark  border-b-2 border-dark font-semibold"
                      : "text-gray-500 hover:opacity-90"
                  }`}
                >
                  <span>{tab}</span>
                  <span className="text-sm ">
                    (
                    {tab === "All"
                      ? counts.all
                      : tab === "Active"
                      ? counts.active
                      : counts.inactive}
                    )
                  </span>
                </button>
              ))}
            </div>
          </div>
          {/* Search Box */}
          <div className="mb-6 flex justify-between items-center">
            <div className="w-1/2">
              <input
                type="text"
                placeholder="Search by name, email or phone..."
                className="w-full bg-white dark:bg-darkBg p-2 border border-lightGray dark:border-darkGray rounded-md focus:outline-none focus:border-gray-500 transition"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            <div>
              <Link
                to="/admin/usermanagement/create-user"
                className="px-2 py-1.5 flex gap-1 items-center bg-dark text-white rounded-md"
              >
                <Plus size={18} />
                <span>Add User</span>
              </Link>
            </div>
          </div>
          {/* Table */}
          <TableContainer className="rounded-xl border border-lightGray dark:border-darkGray">
            <div
              className={`overflow-x-auto ${
                sortedData.length > 10 ? "overflow-y-auto max-h-[700px]" : ""
              }`}
            >
              <Table className="min-w-full">
                <TableHead className="sticky top-0 bg-lightGray dark:bg-darkGray z-30">
                  <TableRow>
                    <TableCell
                      padding="checkbox"
                      className="bg-[#f2f4f5] dark:bg-darkGray"
                    >
                      <Checkbox color="primary" />
                    </TableCell>
                    {[
                      { id: "fullName", label: "Name" },
                      { id: "status", label: "Status" },
                      { id: "role", label: "Role" },
                      { id: "phone", label: "Phone" },
                      { id: "dob", label: "DOB" },
                      { id: "createdAt", label: "Created Dtm" },
                      { id: "updatedAt", label: "Modified Dtm" },
                      { id: "action", label: "Action", sticky: true },
                    ].map((column) => (
                      <TableCell
                        key={column.id}
                        className={`whitespace-nowrap font-bold text-darkBg dark:text-white bg-[#f2f4f5] dark:bg-darkGray ${
                          column.sticky ? "sticky right-0 z-20" : ""
                        }`}
                      >
                        {column.id !== "action" && column.id !== "_id" ? (
                          <TableSortLabel
                            active={orderBy === column.id}
                            direction={orderBy === column.id ? order : "asc"}
                            onClick={() => handleSort(column.id)}
                            sx={{
                              color: "inherit !important",
                              "& .MuiTableSortLabel-icon": {
                                opacity: 1,
                                color: "currentColor !important",
                              },
                            }}
                          >
                            <strong>{column.label}</strong>
                          </TableSortLabel>
                        ) : (
                          <strong>{column.label}</strong>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={12}>
                        <div className="flex justify-center items-center h-[300px]">
                          <Spinner
                            size={50}
                            color="#3b82f6"
                            text="Loading... "
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : sortedData.length > 0 ? (
                    sortedData.map((row) => (
                      <TableRow
                        key={row._id}
                        className="hover:bg-lightGray dark:hover:bg-darkGray"
                      >
                        <TableCell
                          padding="checkbox"
                          className="whitespace-nowrap  "
                        >
                          <Checkbox color="primary" />
                        </TableCell>
                        <TableCell className="whitespace-nowrap ">
                          <div className="flex items-center gap-3">
                            {row.profileImage ? (
                              <img
                                src={row.profileImage}
                                alt={row.fullName}
                                className="w-10 h-10 rounded-md object-cover border border-dark"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-md flex items-center justify-center bg-gray-200 text-dark font-semibold">
                                {row.fullName?.slice(0, 2).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <p className="flex items-center gap-2  dark:text-gray-300 font-semibold">
                                <AtSign size={14} />
                                {row.fullName.charAt(0).toUpperCase() +
                                  row.fullName.slice(1)}
                              </p>
                              <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm">
                                <Mail size={14} />
                                {row.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="whitespace-nowrap ">
                          <div
                            className={`w-max px-2 py-1 text-xs text-center font-[500] text-white rounded-md ${
                              row.status === "active"
                                ? "bg-[#1abe17]"
                                : "bg-red-500"
                            }`}
                          >
                            {row.status
                              ? row.status.charAt(0).toUpperCase() +
                                row.status.slice(1)
                              : "-"}
                          </div>
                        </TableCell>

                        <TableCell className="whitespace-nowrap  dark:text-gray-300">
                          {row.role?.name
                            ? row.role.name.charAt(0).toUpperCase() +
                              row.role.name.slice(1)
                            : "-"}
                        </TableCell>
                        <TableCell className="whitespace-nowrap  dark:text-gray-300">
                          {row.phone}
                        </TableCell>
                        <TableCell className="whitespace-nowrap  dark:text-gray-300">
                          {formatDate(row.dob)}
                        </TableCell>
                        <TableCell className="whitespace-nowrap  dark:text-gray-300">
                          {new Date(row.createdAt).toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </TableCell>

                        <TableCell className="whitespace-nowrap  dark:text-gray-200">
                          <DateDisplay date={row.updatedAt} />
                        </TableCell>

                        <TableCell className="sticky right-0 bg-[#f2f4f5] dark:bg-darkGray">
                          <div className="flex gap-2 items-center">
                            <button
                              onClick={() =>
                                navigate(
                                  `/admin/usermanagement/edit-user/${row._id}`
                                )
                              }
                              className="text-white bg-dark px-1 py-1 rounded"
                            >
                              <Pencil size={18} />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={15}
                        className="py-10 text-center bg-white dark:bg-darkBg"
                      >
                        <NoData
                          title="No Users Found"
                          description="There are currently no users in the system."
                        />
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TableContainer>
          {/* Pgination */}
          <TablePagination
            component="div"
            count={pagination.total}
            page={pagination.page - 1}
            onPageChange={handleChangePage}
            rowsPerPage={pagination.limit}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 20, 50]}
          />
        </div>
      </div>
    </>
  );
};

export default UserList;
