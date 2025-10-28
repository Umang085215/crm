import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const UserTableSkeleton = ({ rows = 8 }) => {
  return (
    <TableBody>
      {Array.from({ length: rows }).map((_, index) => (
        <TableRow key={index} className="hover:bg-[#f4f6f8]">
          {Array.from({ length: 15 }).map((_, idx) => (
            <TableCell key={idx} className="whitespace-nowrap">
              <div className="h-4 bg-gray-300 rounded animate-pulse w-full"></div>
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
};

export default UserTableSkeleton;
