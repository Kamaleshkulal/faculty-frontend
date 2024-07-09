'use client';
import React, { useEffect, useState } from 'react';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import './dashboard.css';
import HeadersComponents from '../../navbar/page';
import FacultyHomePage from '../Home/page';
import axios from 'axios'; // Import Axios for making HTTP requests

const DashboardPage = () => {
  const [facultyData, setFacultyData] = useState(null); // State to store faculty data
  const [facultyId, setFacultyId] = useState(localStorage.getItem('facultyId') || ''); // State to manage facultyId

  useEffect(() => {
    const fetchFacultyData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/adminapp/faculty/college/${facultyId}`);
        setFacultyData(response.data); 
        console.log(data);// Set faculty data in state
      } catch (error) {
        console.error('Error fetching faculty data:', error);
        if (error.response && error.response.status === 404) {
          // toast.error('Faculty not found. Please check the faculty ID.');
        } else {
          // toast.error('Failed to fetch faculty data. Please try again later.');
        }
      }
    };

    if (facultyId) {
      fetchFacultyData(); // Call the function to fetch data if facultyId is set
    }
  }, [facultyId]); // Dependency array to re-fetch data when facultyId changes

  // Function to update facultyId in localStorage and state
  const updateFacultyId = (newFacultyId) => {
    localStorage.setItem('facultyId', newFacultyId); // Set facultyId in localStorage
    setFacultyId(newFacultyId); // Update facultyId in state
  };

  return (
    <div className="p-2">
      {facultyData ? (
        <>
          <HeadersComponents collegeId={facultyData?.collegeId} /> {/* Pass collegeId to HeadersComponents */}
          <FacultyHomePage facultyData={facultyData} /> {/* Pass facultyData to FacultyHomePage */}
        </>
      ) : (
        <h2 className="text-center text-red-600 mt-4">Page Not Found (404)</h2>
      )}
      {/* <ToastContainer position="bottom-center" /> */}
    </div>
  );
};

export default DashboardPage;
