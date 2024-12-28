import React from 'react';
import Link from 'next/link';

const Navigation = () => {
  return (
    <nav className="nav">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-dark-text font-bold text-xl">Headers Emulation</h1>
        <div>
          <Link href="/">
            <a className="mx-2">Home</a>
          </Link>
          <Link href="/admin">
            <a className="mx-2">Admin Dashboard</a>
          </Link>
          <Link href="/users">
            <a className="mx-2">Users</a>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
