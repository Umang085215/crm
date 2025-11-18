import React, { useState, useMemo, useEffect } from "react";
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
import { Pencil, RefreshCcw, Plus, AtSign, Eye, Trash } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../loaders/Spinner";
import NoData from "../ui/NoData";
import ToolTip from "../ui/ToolTip";
import DateDisplay from "../ui/DateDisplay";
import { getAllClients } from "../../services/clientServices";

const ClientList = () => {
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [counts, setCounts] = useState({
    all: 0,
    active: 0,
    inactive: 0,
  });

  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
    limit: 25,
  });
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("clientName");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [openStatusRow, setOpenStatusRow] = useState(null);
  const statusOptions = ["active", "terminated", "on_hold", "rejected"];

  useEffect(() => {
    fetchClients();
  }, [pagination.page, pagination.limit, searchQuery]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const data = await getAllClients(
        pagination.page,
        pagination.limit,
        searchQuery
      );

      const allClients = data.clients || [];

      setClients(allClients);

      setCounts({
        all: allClients.length,
        active: allClients.filter((c) => c.status === "active").length,
        inactive: allClients.filter((c) => c.status === "inactive").length,
      });

      setPagination((prev) => ({
        ...prev,
        total: data.pagination?.total || 0,
        pages: data.pagination?.pages || 1,
      }));
    } catch (error) {
      setErrorMsg(`Error fetching clients: ${error}`);
    } finally {
      setLoading(false);
    }
  };
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (e, newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage + 1 }));
  };

  const handleChangeRowsPerPage = (e) => {
    setPagination((prev) => ({
      ...prev,
      limit: parseInt(e.target.value, 10),
      page: 1,
    }));
  };
  // const getStickyClass = (columnId) => {
  //   if (columnId === "action") return "sticky right-0 z-30";
  //   if (columnId === "status")
  //     return `${
  //       sortedData.length > 0 ? "right-[128px]" : "right-[76px]"
  //     } sticky  z-20`;
  //   return "";
  // };

  const getStickyClass = (columnId) => {
    switch (columnId) {
      case "action":
        return "sticky right-0 z-20";
      case "status":
        return "sticky right-[128px] z-20";
      default:
        return "";
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };
  const filteredData = useMemo(() => {
    let data = [...clients];
    if (activeTab === "Active") {
      data = data.filter((c) => c.status === "active");
    } else if (activeTab === "InActive") {
      data = data.filter((c) => c.status === "inactive");
    }

    // Apply Search Filter
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      data = data.filter((c) =>
        Object.values(c).some((v) => v?.toString().toLowerCase().includes(q))
      );
    }

    return data;
  }, [clients, activeTab, searchQuery]);
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const aVal = a[orderBy] ?? "";
      const bVal = b[orderBy] ?? "";
      return order === "asc"
        ? aVal.localeCompare?.(bVal)
        : bVal.localeCompare?.(aVal);
    });
  }, [filteredData, order, orderBy]);
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">All Clients</h2>
        <button className="flex items-center" onClick={() => fetchClients()}>
          <ToolTip
            title="Refresh"
            placement="top"
            icon={<RefreshCcw size={16} />}
          />
        </button>
      </div>

      {errorMsg && (
        <div className="mb-4 p-2 text-red-600 bg-red-100 rounded">
          {errorMsg}
        </div>
      )}
      {/* Tabs */}
      <div className="relative mb-4">
        <div className="flex gap-4 border-b border-gray-300 dark:border-gray-600 mb-4">
          {["All", "Active", "InActive"].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`relative flex items-center gap-2 px-4 py-2 transition-all duration-300 ${
                activeTab === tab
                  ? "text-dark border-b-2 border-dark font-semibold"
                  : "text-gray-500 hover:opacity-90"
              }`}
            >
              {tab} ({counts[tab.toLowerCase()] || 0})
            </button>
          ))}
        </div>
      </div>

      <div className="p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl">
        {/* Search */}
        <div className="py-4 border-b border-gray-300 dark:border-gray-600 flex justify-between items-center">
          <div className="w-1/2">
            <input
              type="text"
              placeholder="Search by name, email or phone..."
              className="w-full bg-white dark:bg-darkBg p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:border-gray-500 transition"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <div>
            <Link
              to="/admin/clientmanagement/add-client"
              className="px-2 py-1.5 flex gap-1 items-center bg-dark text-white rounded-md"
            >
              <Plus size={18} />
              <span>Add New Client</span>
            </Link>
          </div>
        </div>

        {/* Pagination */}
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

        <TableContainer className="rounded-xl border border-gray-300 dark:border-gray-600 ">
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHead className="sticky top-0 bg-lightGray dark:bg-darkGray z-20">
                <TableRow>
                  <TableCell
                    padding="checkbox"
                    className="bg-[#f2f4f5] dark:bg-darkGray"
                  >
                    <Checkbox color="primary" />
                  </TableCell>

                  {[
                    { id: "clientName", label: "Client Name" },
                    { id: "clientCategory", label: "Category" },
                    { id: "clientSource", label: "Source" },
                    { id: "companySize", label: "Company Size" },
                    { id: "headquarterAddress", label: "Headquarter Address" },
                    { id: "empanelmentDate", label: "Empanelment Date" },
                    { id: "addedBy", label: "Added By" },
                    { id: "createdAt", label: "Created Dtm" },
                    { id: "updatedAt", label: "Modified Dtm" },
                    { id: "status", label: "Status", sticky: true },
                    { id: "action", label: "Action", sticky: true },
                  ].map((col) => (
                    <TableCell
                      key={col.id}
                      className={`whitespace-nowrap font-bold text-darkBg dark:text-white bg-[#f2f4f5] dark:bg-darkGray ${
                        col.sticky ? getStickyClass(col.id) : ""
                      }`}
                    >
                      {col.id !== "action" ? (
                        <TableSortLabel
                          active={orderBy === col.id}
                          direction={orderBy === col.id ? order : "asc"}
                          onClick={() => handleSort(col.id)}
                          sx={{
                            color: "inherit !important",
                            "& .MuiTableSortLabel-icon": {
                              opacity: 1,
                              color: "currentColor !important",
                            },
                          }}
                        >
                          <strong> {col.label}</strong>
                        </TableSortLabel>
                      ) : (
                        <strong> {col.label}</strong>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={12} className="text-center py-10">
                      <Spinner size={45} text="Loading clients..." />
                    </TableCell>
                  </TableRow>
                ) : sortedData.length > 0 ? (
                  sortedData.map((row) => (
                    <TableRow
                      key={row._id}
                      className="hover:bg-lightGray dark:hover:bg-darkGray"
                    >
                      <TableCell padding="checkbox">
                        <Checkbox color="primary" />
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {row.profileImage ? (
                            <img
                              src={row.profileImage}
                              alt={row.clientName}
                              className="w-10 h-10 rounded-md object-cover border border-dark"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-md flex items-center justify-center bg-gray-200 text-dark font-semibold">
                              {row.clientName?.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="flex items-center gap-2  dark:text-gray-300 font-semibold">
                              <AtSign size={14} />
                              {row.clientName.charAt(0).toUpperCase() +
                                row.clientName.slice(1)}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* <TableCell>{row.clientName}</TableCell> */}
                      <TableCell className="whitespace-nowrap dark:text-gray-300">
                        {row.clientCategory}
                      </TableCell>
                      <TableCell className="whitespace-nowrap dark:text-gray-300">
                        {row.clientSource}
                      </TableCell>
                      <TableCell className="whitespace-nowrap dark:text-gray-300">
                        {row.companySize}
                      </TableCell>
                      <TableCell className="whitespace-nowrap dark:text-gray-300">
                        {row.headquarterAddress}
                      </TableCell>
                      <TableCell className="whitespace-nowrap dark:text-gray-300">
                        {formatDate(row.empanelmentDate)}
                      </TableCell>

                      <TableCell className="whitespace-nowrap dark:text-gray-300">
                        {row.addedBy?.fullName || "-"}
                      </TableCell>

                      <TableCell className="whitespace-nowrap dark:text-gray-300">
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

                      <TableCell
                        className={`relative whitespace-nowrap bg-[#f2f4f5] dark:bg-darkGray ${getStickyClass(
                          "status"
                        )}`}
                        style={{ overflow: "visible", zIndex: 20 }} // 1️⃣ allow dropdown to escape
                      >
                        {/* STATUS BADGE */}
                        <div
                          onClick={() =>
                            setOpenStatusRow(
                              openStatusRow === row._id ? null : row._id
                            )
                          }
                          className={`cursor-pointer px-2 py-1 text-xs text-center font-[500] text-white rounded-md ${
                            row.status === "active"
                              ? "bg-[#1abe17]"
                              : row.status === "terminated"
                              ? "bg-red-800"
                              : row.status === "on_hold"
                              ? "bg-[#f9b801]"
                              : "bg-red-500"
                          }`}
                        >
                          {row.status
                            ? row.status.charAt(0).toUpperCase() +
                              row.status.slice(1)
                            : "-"}
                        </div>

                        {/* DROPDOWN PANEL */}
                        {openStatusRow === row._id && (
                          <div
                            className="
        absolute 
        -left-20   /* 2️⃣ SHIFT LEFT SO IT SHOWS IN FRONT */
        top-10
        w-36 
        rounded-md 
        shadow-xl 
        bg-white dark:bg-[#2f3236]
        border border-gray-300 dark:border-gray-700
        z-[9999]  /* 3️⃣ MOST IMPORTANT */
      "
                            style={{ overflow: "visible" }}
                          >
                            {statusOptions.map((status) => (
                              <div
                                key={status}
                                onClick={() =>
                                  handleStatusUpdate(row._id, status)
                                }
                                className="
            px-3 py-2 text-sm cursor-pointer 
            hover:bg-gray-100 dark:hover:bg-gray-700
            transition
          "
                              >
                                {status.charAt(0).toUpperCase() +
                                  status.slice(1)}
                              </div>
                            ))}
                          </div>
                        )}
                      </TableCell>

                      {/* Action */}
                      <TableCell className="sticky right-0 bg-[#f2f4f5] dark:bg-darkGray z-30">
                        <div className="flex gap-2 items-center">
                          <button
                            className="text-white bg-dark px-1 py-1 rounded"
                            onClick={() =>
                              navigate(
                                `/admin/clientmanagement/edit-client/${row._id}`
                              )
                            }
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            className="text-white bg-[#1abe17] px-1 py-1 rounded"
                            onClick={() =>
                              navigate(
                                `/admin/clientmanagement/view-client/${row._id}`
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
                    <TableCell colSpan={12} className="py-10 text-center">
                      <NoData title="No Clients Found" />
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
    </>
  );
};

export default ClientList;
