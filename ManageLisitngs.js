import React, { useEffect, useState } from "react";
import { fetchListings, deleteListing } from "./supabaseUtils"; // Updated import statement

const ManageListings = () => {
    const [listings, setListings] = useState([]);

    useEffect(() => {
        const getListings = async () => {
            const fetchedListings = await fetchListings();
            setListings(fetchedListings);
        };
        getListings();
    }, []);

    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this listing?")) {
            await deleteListing(id);
            setListings(listings.filter((listing) => listing.id !== id));
        }
    };

    return (
        <div>
            <h1>Manage Listings</h1>
            <ul>
                {listings.map((listing) => (
                    <li key={listing.id}>
                        <h2>{listing.name}</h2>
                        <button onClick={() => handleDelete(listing.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ManageListings;
