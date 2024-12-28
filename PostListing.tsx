import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from './supabaseClient';
import { uploadImage } from './UplaodImage';

const PostListing: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    engine: '',
    engineSize: '',
    mileage: '',
    transmission: '',
    color: '',
    year: '',
    description: '',
  });
  const [images, setImages] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(e.target.files);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const imageUrls = await uploadImages(images);

      const { data, error: insertError } = await supabase
        .from('listings')
        .insert([
          {
            ...formData,
            price: parseFloat(formData.price),
            engineSize: parseFloat(formData.engineSize),
            mileage: parseInt(formData.mileage),
            year: parseInt(formData.year),
            images: imageUrls,
          },
        ]);

      if (insertError) {
        throw insertError;
      }

      console.log("Listing created successfully:", data);
      alert("Listing created successfully!");
      router.push('/');

      // Clear form after successful submission
      setFormData({
        name: '',
        price: '',
        engine: '',
        engineSize: '',
        mileage: '',
        transmission: '',
        color: '',
        year: '',
        description: '',
      });
      setImages(null);
    } catch (error) {
      console.error("Error creating listing:", error);
      setError(error instanceof Error ? error.message : "Failed to create listing");
      alert("There was an error creating the listing. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const uploadImages = async (files: FileList | null): Promise<string[]> => {
    if (!files) return [];
    const urls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const url = await uploadImage(file);
      urls.push(url);
    }
    return urls;
  };

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-3xl font-bold mb-6">Post a New Car or Bike</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="form-label">Brand and Model</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="form-label">Price (€)</label>
          <input
            type="number"
            name="price"
            className="form-control"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="form-label">Engine</label>
          <select
            name="engine"
            className="form-select"
            value={formData.engine}
            onChange={handleChange}
            required
          >
            <option value="">Select Engine</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Electric">Electric</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="form-label">Engine Size (Liters)</label>
          <input
            type="number"
            step="0.1"
            name="engineSize"
            className="form-control"
            value={formData.engineSize}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="form-label">Mileage (km)</label>
          <input
            type="number"
            name="mileage"
            className="form-control"
            value={formData.mileage}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="form-label">Transmission</label>
          <select
            name="transmission"
            className="form-select"
            value={formData.transmission}
            onChange={handleChange}
            required
          >
            <option value="">Select Transmission</option>
            <option value="Automatic">Automatic</option>
            <option value="Manual">Manual</option>
            <option value="Semi-Automatic">Semi-Automatic</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="form-label">Color</label>
          <input
            type="text"
            name="color"
            className="form-control"
            value={formData.color}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="form-label">Year</label>
          <input
            type="number"
            name="year"
            className="form-control"
            value={formData.year}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            className="form-control"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="form-label">Upload Images</label>
          <input type="file" accept="image/*" multiple onChange={handleImageChange} className="form-control" />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? (
            <span>
              <div className="spinner"></div> Uploading...
            </span>
          ) : (
            "Post Listing"
          )}
        </button>
        {error && <div className="text-red-500 mt-4">{error}</div>}
      </form>
    </div>
  );
};

export default PostListing;