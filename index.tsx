import React, { useState, useEffect, useCallback } from "react";
import { fetchListings } from "../supabaseUtils";
import Link from "next/link";
import ListingCard from "../components/ListingCard";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

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

const Home: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEngine, setFilterEngine] = useState("All");
  const [filterYear, setFilterYear] = useState<number | null>(null);
  const [filterPrice, setFilterPrice] = useState<[number, number]>([0, 100000]);
  const [filterMileage, setFilterMileage] = useState<[number, number]>([0, 1000000]);
  const [filterTransmission, setFilterTransmission] = useState("All");
  const [filterColor, setFilterColor] = useState("All");
  const [filterEngineSize, setFilterEngineSize] = useState<[number, number]>([1.0, 8.0]);
  const [filterLocation, setFilterLocation] = useState("");
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Fetch listings from Supabase
  const getListings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchListings();
      if (data && Array.isArray(data) && data.length > 0) {
        setListings(data);
        setFilteredListings(data);
      } else {
        setError("No listings available");
      }
    } catch (error) {
      setError(`Failed to load listings: ${error.message || "Unknown error"}`);
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  }, []);

  useEffect(() => {
    getListings();
  }, [getListings]);

  // Apply filters
  useEffect(() => {
    if (!isInitialLoad || listings.length > 0) {
      const filtered = listings.filter((listing) => {
        const matchesSearchTerm = searchTerm === "" || listing.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesEngine = filterEngine === "All" || listing.engine === filterEngine;
        const matchesYear = !filterYear || listing.year === filterYear;
        const matchesPrice = listing.price >= filterPrice[0] && listing.price <= filterPrice[1];
        const matchesMileage = listing.mileage >= filterMileage[0] && listing.mileage <= filterMileage[1];
        const matchesEngineSize = listing.engineSize >= filterEngineSize[0] && listing.engineSize <= filterEngineSize[1];
        const matchesTransmission = filterTransmission === "All" || listing.transmission === filterTransmission;
        const matchesColor = filterColor === "All" || listing.color === filterColor;
        const matchesLocation = filterLocation === "" || listing.location.toLowerCase().includes(filterLocation.toLowerCase());

        return matchesSearchTerm && matchesEngine && matchesYear && matchesPrice && matchesMileage && matchesEngineSize && matchesTransmission && matchesColor && matchesLocation;
      });

      setFilteredListings(filtered);
    }
  }, [searchTerm, filterEngine, filterYear, filterPrice, filterMileage, filterTransmission, filterColor, filterEngineSize, filterLocation, listings, isInitialLoad]);

  if (isInitialLoad) {
    return <div className="text-center py-4">Loading listings...</div>;
  }

  return (
    <div className="container mx-auto p-5">
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Headers Emulation</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link href="/" className="nav-link">Home</Link>
              </li>
              <li className="nav-item">
                <Link href="/admin" className="nav-link">Admin Dashboard</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <header className="text-center my-8">
        <h1 className="display-4">Welcome to Headers Emulation 🚗</h1>
        <p className="lead">Find or post your perfect vehicle!</p>
      </header>

      {/* Filters Section */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3 d-flex">
          <input
            type="text"
            placeholder="Search listings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control me-2"
          />
          <button className="btn btn-primary" onClick={() => console.log("Search button clicked")}>
            Search
          </button>
        </div>
        <div className="col-md-3 mb-3">
          <select
            value={filterEngine}
            onChange={(e) => setFilterEngine(e.target.value)}
            className="form-select"
          >
            <option value="All">All Engines</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Electric">Electric</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>
        <div className="col-md-3 mb-3">
          <label className="form-label">Year</label>
          <DatePicker
            selected={filterYear ? new Date(filterYear, 0, 1) : null}
            onChange={(date: Date | null) => setFilterYear(date ? date.getFullYear() : null)}
            showYearPicker
            dateFormat="yyyy"
            className="form-control"
            placeholderText="Select Year"
          />
        </div>
        <div className="col-md-3 mb-3">
          <label className="form-label">Price Range (€)</label>
          <Slider
            range
            min={0}
            max={100000}
            defaultValue={filterPrice}
            onChange={(value) => setFilterPrice(value as [number, number])}
            trackStyle={[{ backgroundColor: '#007bff' }]}
            handleStyle={[{ borderColor: '#007bff' }, { borderColor: '#007bff' }]}
            className="form-control"
          />
          <p className="mt-2">
            €{filterPrice[0]} - €{filterPrice[1]}
          </p>
        </div>
        <div className="col-md-3 mb-3">
          <label className="form-label">Mileage Range (km)</label>
          <Slider
            range
            min={0}
            max={1000000}
            defaultValue={filterMileage}
            onChange={(value) => setFilterMileage(value as [number, number])}
            trackStyle={[{ backgroundColor: '#007bff' }]}
            handleStyle={[{ borderColor: '#007bff' }, { borderColor: '#007bff' }]}
            className="form-control"
          />
          <p className="mt-2">
            {filterMileage[0]} km - {filterMileage[1]} km
          </p>
        </div>
        <div className="col-md-3 mb-3">
          <label className="form-label">Engine Size (Liters)</label>
          <Slider
            range
            min={1.0}
            max={8.0}
            step={0.1}
            defaultValue={filterEngineSize}
            onChange={(value) => setFilterEngineSize(value as [number, number])}
            trackStyle={[{ backgroundColor: '#007bff' }]}
            handleStyle={[{ borderColor: '#007bff' }, { borderColor: '#007bff' }]}
            className="form-control"
          />
          <p className="mt-2">
            {filterEngineSize[0]}L - {filterEngineSize[1]}L
          </p>
        </div>
        <div className="col-md-3 mb-3">
          <select
            value={filterTransmission}
            onChange={(e) => setFilterTransmission(e.target.value)}
            className="form-select"
          >
            <option value="All">All Transmissions</option>
            <option value="Automatic">Automatic</option>
            <option value="Manual">Manual</option>
            <option value="Semi-Automatic">Semi-Automatic</option>
          </select>
        </div>
        <div className="col-md-3 mb-3">
          <select
            value={filterColor}
            onChange={(e) => setFilterColor(e.target.value)}
            className="form-select"
          >
            <option value="All">All Colors</option>
            <option value="Red">Red</option>
            <option value="Blue">Blue</option>
            <option value="Black">Black</option>
          </select>
        </div>
        <div className="col-md-3 mb-3">
          <input
            type="text"
            placeholder="Location"
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
            className="form-control"
          />
        </div>
      </div>

      {/* Link to Post Listing Page */}
      <Link href="/PostListing" legacyBehavior>
        <a className="btn btn-primary mb-4">
          + Post a Listing
        </a>
      </Link>

      {loading && <div className="text-center py-4">Updating listings...</div>}
      {error && <div className="text-center py-4 text-danger">{error}</div>}

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-6">Available Vehicles</h2>
        {filteredListings.length > 0 ? (
          <div className="row">
            {filteredListings.map((listing) => (
              <div className="col-md-6 col-lg-4 mb-4" key={listing.id}>
                <ListingCard listing={listing} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500 text-lg">No vehicles found matching your criteria</p>
            <p className="text-sm text-gray-400">Try adjusting your filters or check back later for new listings</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

