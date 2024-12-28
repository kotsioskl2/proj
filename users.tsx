import React from "react";
import Link from "next/link";

const Users: React.FC = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Manage Users</h1>
      <p className="text-gray-600 text-center">This page is for managing users.</p>
      <div className="text-center mt-4">
        <Link href="/admin">
          <a className="text-blue-500 hover:underline">Go to Admin Dashboard</a>
        </Link>
      </div>
    </div>
  );
};

export default Users;
