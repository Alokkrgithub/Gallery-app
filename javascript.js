import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "https://api.unsplash.com/photos";
const API_KEY = "YOUR_UNSPLASH_API_KEY";  // Replace with your Unsplash API key

const App = () => {
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch photos from Unsplash
  const fetchPhotos = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(API_URL, {
        params: {
          client_id: API_KEY,
          page,
          per_page: 12, // Number of images per page
        },
      });

      setPhotos((prevPhotos) => [...prevPhotos, ...response.data]);
    } catch (err) {
      setError("Failed to fetch photos.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  // Infinite scroll effect
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 100
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (page > 1) {
      fetchPhotos();
    }
  }, [page, fetchPhotos]);

  return (
    <div className="App">
      <h1>Photo Gallery</h1>
      {error && <p className="error">{error}</p>}
      <div className="gallery">
        {photos.map((photo) => (
          <div key={photo.id} className="photo-item">
            <img src={photo.urls.small} alt={photo.alt_description} />
            <div className="caption">{photo.user.name}</div>
          </div>
        ))}
      </div>
      {loading && <div className="loading">Loading...</div>}
    </div>
  );
};

export default App;

// // Show the loading message
// function showLoading() {
//   const loadingElement = document.getElementById('loading');
//   loadingElement.style.display = 'block';  // Show the loading text
// }

// // Hide the loading message
// function hideLoading() {
//   const loadingElement = document.getElementById('loading');
//   loadingElement.style.display = 'none';  // Hide the loading text
// }

// // Example usage: Show the loading message when fetching data
// showLoading();

// // Hide the loading message after 3 seconds (simulating data fetching)
// setTimeout(hideLoading, 3000);
