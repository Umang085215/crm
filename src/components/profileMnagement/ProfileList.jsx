import React, { useState, useMemo, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
import {
  Pencil,
  Eye,
  Plus,
  Star,
  AtSign,
  Mail,
  Phone,
  RefreshCcw,
  Trash,
} from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import DateDisplay from "../ui/DateDisplay";
import Spinner from "../loaders/Spinner";
import ToolTip from "../ui/ToolTip";
import NoData from "../ui/NoData";
import { getAllProfiles } from "../../services/profileServices";

const ProfileList = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [successMsg, setSuccessMsg] = useState("");
  const [allProfiles, setAllProfiles] = useState([]);
  const [counts, setCounts] = useState({
    all: 0,
    active: 0,
    inactive: 0,
    banned: 0,
    defaulter: 0,
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
    limit: 25,
  });
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("user_id");
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [favourites, setFavourites] = useState([]);

  useEffect(() => {
    if (location.state?.successMsg) {
      setSuccessMsg(location.state.successMsg);
      const timer = setTimeout(() => {
        setSuccessMsg("");
        navigate(location.pathname, { replace: true });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [location, navigate]);

  useEffect(() => {
    fetchProfiles();
  }, [pagination.page, pagination.limit, activeTab, searchQuery]);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const data = await getAllProfiles(
        pagination.page,
        pagination.limit,
        activeTab,
        searchQuery
      );
      setAllProfiles(data.profiles || []);
      setPagination((prev) => ({
        ...prev,
        total: data.pagination?.total || 0,
        pages: data.pagination?.pages || 1,
      }));
      const activeCount =
        data.profiles?.filter((u) => u.status === "Active").length || 0;
      const inactiveCount =
        data.profiles?.filter((u) => u.status === "Inactive").length || 0;
      const allCount = data.pagination?.total || 0;
      const bannedCount =
        data.profiles?.filter((u) => u.status === "Banned").length || 0;
      const defaulterCount =
        data.profiles?.filter((u) => u.status === "Defaulter").length || 0;

      setCounts({
        all: allCount,
        active: activeCount,
        inactive: inactiveCount,
        banned: bannedCount,
        defaulter: defaulterCount,
      });
    } catch (error) {
      setErrorMsg(`"Errors  when fetching users" || ${error}`);
    } finally {
      setLoading(false);
    }
  };
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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const filteredData = useMemo(() => {
    let data = [...allProfiles];
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      data = data.filter((profile) =>
        Object.values(profile).some((value) => {
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
  }, [allProfiles, searchQuery]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const aVal = a[orderBy] ?? "";
      const bVal = b[orderBy] ?? "";
      return order === "asc"
        ? aVal.localeCompare?.(bVal)
        : bVal.localeCompare?.(aVal);
    });
  }, [filteredData, order, orderBy]);

  const getStickyClass = (columnId) => {
    if (columnId === "action") return "sticky right-0 z-30";
    if (columnId === "status")
      return `${
        sortedData.length > 0 ? "right-[126px]" : "right-[77px]"
      } sticky  z-20`;
    return "";
  };
  const handleFavourite = (profileId) => {
    setFavourites((prev) =>
      prev.includes(profileId)
        ? prev.filter((id) => id !== profileId)
        : [...prev, profileId]
    );
  };

  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold ">All Profiles</h2>
          <button
            className="flex items-center gap-2 "
            onClick={() => fetchProfiles()}
          >
            <ToolTip
              title="Refresh"
              placement="top"
              icon={<RefreshCcw size={16} />}
            />
          </button>
        </div>
        {successMsg && (
          <div className="mb-4 p-2 bg-green-400 text-center text-md font-semibold  text-white rounded">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="mb-4 p-2 bg-red-100 text-center text-red-700 rounded">
            {errorMsg}
          </div>
        )}
        <div>
          {/* Tabs */}
          <div className="relative mb-4">
            <div className="flex gap-4 border-b border-gray-200 mb-4">
              {["All", "Active", "InActive", "Banned", "Defaulter"].map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => handleTabChange(tab)}
                    className={`relative flex items-center gap-2 px-4 py-2 transition-all duration-300 ${
                      activeTab === tab
                        ? "text-dark  border-b-2 border-dark font-semibold"
                        : "text-gray-500 hover:opacity-90"
                    }`}
                  >
                    {tab} ({counts[tab.toLowerCase()] || 0})
                  </button>
                )
              )}
            </div>
          </div>
          <div className="p-3 bg-white dark:bg-gray-800 border border-lightGray dark:border-darkGray rounded-xl">
            {/* Search Box */}
            <div className="py-4 border-b border-lightGray dark:border-darkGray flex justify-between items-center">
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
                  to="/admin/profilemanagement/add-profile"
                  className="px-2 py-1.5 flex gap-1 items-center bg-dark text-white rounded-md"
                >
                  <Plus size={18} />
                  <span>Add New Profile</span>
                </Link>
              </div>
            </div>
            {/* Pgination */}
            <TablePagination
              component="div"
              className="text-black dark:text-white"
              count={pagination.total}
              page={pagination.page - 1}
              onPageChange={handleChangePage}
              rowsPerPage={pagination.limit}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[25, 50, 100]}
            />
            {/* Table */}
            <TableContainer className="rounded-xl border border-lightGray dark:border-darkGray ">
              <div
                className={` ${
                  sortedData.length > 10 ? "overflow-y-auto max-h-[700px]" : ""
                } ${
                  sortedData.length > 0
                    ? "overflow-x-auto "
                    : "overflow-x-hidden"
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
                        { id: "favourite", label: "" },
                        { id: "fullName", label: "Name" },
                        { id: "techStack", label: "Tech Stack" },
                        { id: "skills", label: "Skills" },
                        { id: "currentCompany", label: "Current Company" },
                        { id: "totalExp", label: "Total Exp" },
                        { id: "expectedCTC", label: "Expected CTC" },
                        { id: "workMode", label: "Work Mode" },
                        { id: "noticePeriod", label: "Notice Period" },
                        { id: "submittedBy", label: "SubmittedBy" },
                        { id: "createdAt", label: "Created Dtm" },
                        { id: "updatedAt", label: "Modified Dtm" },
                        { id: "status", label: "Status", sticky: true },
                        { id: "action", label: "Action", sticky: true },
                      ].map((column) => (
                        <TableCell
                          key={column.id}
                          className={`whitespace-nowrap font-bold text-darkBg dark:text-white bg-[#f2f4f5] dark:bg-darkGray ${
                            column.sticky ? getStickyClass(column.id) : ""
                          }`}
                        >
                          {column.id !== "action" &&
                          column.id !== "_id" &&
                          column.id !== "favourite" ? (
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
                        <TableCell colSpan={9}>
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
                      sortedData.map((item) => (
                        <TableRow
                          key={item._id}
                          className="hover:bg-lightGray dark:hover:bg-darkGray"
                        >
                          <TableCell
                            className="whitespace-nowrap"
                            padding="checkbox"
                          >
                            <div className="flex flex-col items-start ">
                              <Checkbox color="primary" />

                              {item.profileCode && (
                                <span className="text-dark bg-light text-[12px] p-[1px]   border-b border-dark  rounded font-[500]">
                                  #{item.profileCode}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="whitespace-nowrap ">
                            <button
                              onClick={() => handleFavourite(item._id)}
                              className={`transition-colors duration-200 ${
                                favourites.includes(item._id)
                                  ? "text-yellow-600"
                                  : "text-gray-500"
                              }`}
                            >
                              <Star size={18} />
                            </button>
                          </TableCell>
                          <TableCell className="whitespace-nowrap ">
                            <div className="flex items-center gap-3">
                              {item.profileImage ? (
                                <img
                                  src={item.profileImage}
                                  alt={item.fullName}
                                  className="w-10 h-10 rounded-md object-cover border border-dark"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-md flex items-center justify-center bg-gray-200 text-dark font-semibold">
                                  {item.fullName?.slice(0, 2).toUpperCase()}
                                </div>
                              )}
                              <div>
                                <p className="flex items-center gap-2  dark:text-gray-300 font-semibold">
                                  <AtSign size={14} />
                                  {item.fullName.charAt(0).toUpperCase() +
                                    item.fullName.slice(1)}
                                </p>
                                <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm">
                                  <Mail size={14} />
                                  {item.email}
                                </p>
                                <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm">
                                  <Phone size={14} />
                                  {item.phone}
                                </p>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell className="whitespace-nowrap  dark:text-gray-300">
                            {item.techStack}
                          </TableCell>
                          <TableCell className="whitespace-nowrap  dark:text-gray-300">
                            {item.skills.map((s) => (
                              <p>{s}</p>
                            ))}
                          </TableCell>
                          <TableCell className="whitespace-nowrap  dark:text-gray-300">
                            {item.currentCompany}
                          </TableCell>
                          <TableCell className="whitespace-nowrap  dark:text-gray-300">
                            {item.totalExp}
                          </TableCell>
                          <TableCell className="whitespace-nowrap  dark:text-gray-300">
                            {item.expectedCTC}
                          </TableCell>
                          <TableCell className="whitespace-nowrap  dark:text-gray-300">
                            {item.workMode}
                          </TableCell>
                          <TableCell className="whitespace-nowrap  dark:text-gray-300">
                            {item.noticePeriod}
                          </TableCell>
                          <TableCell className="whitespace-nowrap  dark:text-gray-300">
                            {item.submittedBy.fullName}
                          </TableCell>
                          <TableCell className="whitespace-nowrap  dark:text-gray-300">
                            {new Date(item.createdAt).toLocaleString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </TableCell>
                          <TableCell className="whitespace-nowrap  dark:text-gray-200">
                            <DateDisplay date={item.updatedAt} />
                          </TableCell>
                          <TableCell className="sticky right-[126px] bg-[#f2f4f5] dark:bg-darkGray z-20 whitespace-nowrap">
                            <div
                              className={`w-max px-2 py-1 text-xs text-center font-[500] text-white rounded-md ${
                                item.status === "Active"
                                  ? "bg-[#1abe17]"
                                  : item.status === "Banned"
                                  ? "bg-red-800"
                                  : item.status === "Defaulter"
                                  ? "bg-[#f9b801]"
                                  : "bg-red-500"
                              }`}
                            >
                              {item.status
                                ? item.status.charAt(0).toUpperCase() +
                                  item.status.slice(1)
                                : "-"}
                            </div>
                          </TableCell>
                          <TableCell className="sticky right-0 bg-[#f2f4f5] dark:bg-darkGray z-30">
                            <div className="flex gap-2 items-center">
                              <button
                                className="text-white bg-dark px-1 py-1 rounded"
                                onClick={() =>
                                  navigate(
                                    `/admin/profilemanagement/edit-profile/${item._id}`
                                  )
                                }
                              >
                                <Pencil size={18} />
                              </button>
                              <button
                                className="text-white bg-green-500 px-1 py-1 rounded"
                                onClick={() =>
                                  navigate(
                                    `/admin/profilemanagement/view-profile/${item._id}`
                                  )
                                }
                              >
                                <Eye size={18} />
                              </button>
                              <button className="text-white bg-red-600 px-1 py-1 rounded">
                                <Trash size={18} />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={10}
                          className="py-10 text-center bg-white dark:bg-darkBg"
                        >
                          <NoData
                            title="No Profiles Found"
                            description="There are currently no profiles in the system."
                          />
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TableContainer>
            <TablePagination
              component="div"
              className="text-black dark:text-white"
              count={pagination.total}
              page={pagination.page - 1}
              onPageChange={handleChangePage}
              rowsPerPage={pagination.limit}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[25, 50, 100]}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileList;
