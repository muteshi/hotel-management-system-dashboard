import React from "react";
import TableHeader from "./tableHeader";
import TableBody from "./tableBody";

const Table = ({ columns, sortColumn, onSort, data }) => {
  return (
    <div className="table-responsive">
      <table className="table">
        <TableHeader
          sortColumn={sortColumn}
          onSort={onSort}
          columns={columns}
        />
        <TableBody data={data} columns={columns} />
      </table>
    </div>
  );
};

export default Table;
