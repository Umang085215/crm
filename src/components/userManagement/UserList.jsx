import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
} from "@mui/material";
import { Pencil, Trash, Plus, ArrowLeft, Mail, AtSign } from "lucide-react";
import { FiAtSign } from "react-icons/fi";
import { IoMail } from "react-icons/io5";
import listData from "../../jsonData/userList.json";

const UserList = () => {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("user_id");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Sorting
  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const filteredData = useMemo(() => {
    let data = listData;
    if (activeTab !== "All") {
      data = data.filter((user) => user.status === activeTab);
    }

    // Search filter across all data
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
  }, [activeTab, searchQuery]);

  // Sort
  const sortedData = [...filteredData].sort((a, b) => {
    const aVal = a[orderBy];
    const bVal = b[orderBy];
    if (typeof aVal === "string")
      return order === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    return order === "asc" ? aVal - bVal : bVal - aVal;
  });

  // Paginate
  const paginatedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 ">User List</h2>

      {/* Tabs */}
      <div className="relative mb-4">
        <div className="flex gap-6 border-b border-lightGray dark:border-darkGray relative">
          {["All", "Active", "InActive"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-4 py-2 font-semibold transition-colors duration-300 ${
                activeTab === tab
                  ? "text-dark border-b-2 border-dark"
                  : "text-gray-500 hover:text-dark"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Search Box */}
      <div className="mb-6 flex justify-between items-center">
        <div className="w-1/2 ">
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            className="w-full bg-white dark:bg-darkBg p-2 border border-lightGray dark:border-darkGray rounded-md focus:outline-none  focus:border-gray-500 transition"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div>
          <Link
            to="/admin/users/create"
            className="px-2 py-1.5  flex gap-1 items-center bg-dark text-white rounded-md"
          >
            <Plus size={18} />
            <span>Create User</span>
          </Link>
        </div>
      </div>

      {/* Table */}
      <TableContainer className="rounded-xl border border-lightGray dark:border-darkGray">
        <div
          className={`overflow-x-auto ${
            paginatedData.length > 10 ? "overflow-y-auto max-h-[700px]" : ""
          }`}
        >
          <Table className=" min-w-full">
            <TableHead className="sticky top-0  bg-lightGray dark:bg-darkGray  z-30">
              <TableRow>
                {[
                  { id: "user_id", label: "ID" },
                  { id: "user_name", label: "Name" },
                  { id: "status", label: "Status" },
                  { id: "phone", label: "Phone" },
                  { id: "role", label: "Role" },
                  { id: "skills", label: "Skills" },
                  { id: "tech_stack", label: "Tech stack" },
                  { id: "experience_years", label: "Exp" },
                  { id: "salary_lpa", label: "Salary" },
                  { id: "company", label: "Company" },
                  { id: "location", label: "Location" },
                  { id: "created_date", label: "Created Date" },
                  { id: "action", label: "Action", sticky: true },
                ].map((column) => (
                  <TableCell
                    key={column.id}
                    className={`whitespace-nowrap font-bold text-darkBg dark:text-white bg-[#f2f4f5] dark:bg-darkGray ${
                      column.sticky ? "sticky right-0  z-20" : ""
                    }`}
                  >
                    {column.id !== "action" ? (
                      <TableSortLabel
                        active={orderBy === column.id}
                        direction={orderBy === column.id ? order : "asc"}
                        onClick={() => handleSort(column.id)}
                      >
                        <strong className="text-darkBg dark:text-white">
                          {column.label}
                        </strong>
                      </TableSortLabel>
                    ) : (
                      <strong>{column.label}</strong>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedData.map((row) => (
                <TableRow
                  key={row.user_id}
                  className="hover:bg-lightGray dark:hover:bg-darkGray"
                >
                  <TableCell className="whitespace-nowrap text-darkBg dark:text-white">
                    {row.user_id}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-darkBg dark:text-white">
                    <div className="w-max flex items-center gap-3">
                      <div>
                        {row.user_image ? (
                          <img
                            src={row.user_image}
                            alt={row.user_name}
                            className="w-10 h-10 rounded-full object-cover border border-dark mx-auto"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full border border-dark flex items-center justify-center bg-gray-200 text-dark font-semibold mx-auto">
                            {row.user_name?.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div>
                        <span className="font-bold ">{row.user_name}</span>
                        <span className="flex items-center gap-2 text-darkGray dark:text-white">
                          {row.user_email}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="whitespace-nowrap ">
                    <div
                      className={` p-1 text-xs text-center text-white rounded-xl ${
                        row.status === "Active" ? "bg-green-800 " : "bg-red-600"
                      }`}
                    >
                      {row.status}
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-darkBg dark:text-white">
                    {row.phone}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-darkBg dark:text-white">
                    {row.role}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-darkBg dark:text-white">
                    {row.skills.map((skill, i) => (
                      <span key={i}>
                        {skill}
                        {i !== row.skills.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-darkBg dark:text-white">
                    {row.tech_stack}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-darkBg dark:text-white">
                    {row.experience_years}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-darkBg dark:text-white">
                    {row.salary_lpa}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-darkBg dark:text-white">
                    {row.company}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-darkBg dark:text-white">
                    {row.location}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-darkBg dark:text-white">
                    {row.created_date}
                  </TableCell>
                  {/* Sticky Action Column */}
                  <TableCell className="whitespace-nowrap sticky right-0 bg-[#f2f4f5] dark:bg-darkGray dark:text-white z-20">
                    <div className="flex gap-2 items-center">
                      <button className="text-white bg-dark px-1 py-1 rounded">
                        <Pencil size={18} />
                      </button>
                      <button className="text-white bg-red-600 px-1 py-1 rounded">
                        <Trash size={18} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredData.length}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 20, 50]}
      />
    </div>
  );
};

export default UserList;
