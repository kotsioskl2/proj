import React, { useState, useEffect, useCallback } from "react";
import { FaCar, FaUsers, FaTrash, FaEdit } from "react-icons/fa";
import { fetchListings, fetchUsers, deleteListing, deleteUser, updateListing } from "../supabaseUtils";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "./AuthContext";
import ListingCard from "../components/ListingCard";

interface Listing {
  id: string;
  name: string;
  price: number;
  engine: string;
  engineSize: number;
  mileage: number;
  transmission: string;
  color: string;
  year: number;
  description: string;
  images: string[];
  location: string;
}

interface User {
  id: string;
  email: string;
  role: string;
  created_at: string;
}

const AdminDashboard: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAdmin } = useAuth();
  const router = useRouter();

  const getListings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchListings();
      if (data && Array.isArray(data) && data.length > 0) {
        setListings(data);
      } else {
        setError("No listings available");
      }
    } catch (error) {
      setError(`Failed to load listings: ${error.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user === null) {
      return;
    }

    if (!isAdmin) {
      router.push("/");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const [fetchedListings, fetchedUsers] = await Promise.all([
          fetchListings(),
          fetchUsers()
        ]);
        setListings(fetchedListings);
        setUsers(fetchedUsers);
      } catch (err) {
        setError("Failed to load data. Please try again.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, isAdmin, router, getListings]);

  const handleDelete = async (type: 'listing' | 'user', id: string) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) {
      return;
    }

    try {
      if (type === 'listing') {
        await deleteListing(id);
        setListings(listings.filter(item => item.id !== id));
      } else {
        await deleteUser(id);
        setUsers(users.filter(item => item.id !== id));
      }
    } catch (err) {
      setError(`Failed to delete ${type}. Please try again.`);
      console.error(`Error deleting ${type}:`, err);
    }
  };

  const handleEdit = async (listing: Listing) => {
    try {
      const updatedListing: Listing | null = await updateListing(listing);
      if (updatedListing) {
        setListings((prevListings) =>
          prevListings.map((item) => (item.id === updatedListing.id ? updatedListing : item))
        );
      } else {
        setError("Failed to update listing: No data returned");
      }
    } catch (error) {
      setError(`Failed to update listing: ${error.message || "Unknown error"}`);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="admin-dashboard-container bg-gray-200 min-h-screen p-8">
      <div className="admin-dashboard bg-white p-8 rounded shadow">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        <div className="search-bar mb-6">
          <input
            type="text"
            placeholder="Search..."
            className="p-2 border border-gray-300 rounded w-full"
          />
        </div>

        <div className="dashboard-section mb-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center"><FaCar className="mr-2" /> Listings</h2>
          <div className="table-container bg-white p-4 rounded shadow">
            {listings.length === 0 ? (
              <p>No listings found.</p>
            ) : (
              <div className="listings-grid grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {listings.map((listing) => (
                  <div key={listing.id} className="card p-4 bg-white rounded shadow">
                    <ListingCard listing={listing} />
                    <div className="flex gap-2 mt-2">
                      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={() => handleEdit(listing)}>
                        <FaEdit /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete('listing', listing.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="dashboard-section">
          <h2 className="text-2xl font-semibold mb-4 flex items-center"><FaUsers className="mr-2" /> Users</h2>
          {users.length === 0 ? (
            <p>No users found.</p>
          ) : (
            <div className="users-grid grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {users.map((user) => (
                <div key={user.id} className="card p-4 bg-white rounded shadow">
                  <h3 className="text-lg font-bold">{user.email}</h3>
                  <p>Role: {user.role}</p>
                  <div className="flex gap-2 mt-2">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete('user', user.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
