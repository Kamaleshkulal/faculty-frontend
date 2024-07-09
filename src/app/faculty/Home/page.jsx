/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { RiEdit2Fill } from "react-icons/ri";
import EditFacultyPopup from '../../common/editfaculty/page'; // Import the popup component
import { MdModeEditOutline } from "react-icons/md";
const FacultyHomePage = ({ projectNameStatus, presentationStatus, demoStatus = false, successStatus }) => {
    const percentage1 = 75;
    const percentage3 = 90;
    const [subjects, setSubjects] = useState([]);
    const [data, setData] = useState(null);
    const [facultyId, setFacultyId] = useState(null);
    const [date, setDate] = useState(new Date());
    const [facultyDetails, setFacultyDetails] = useState({
        subjects: []
    });
    const isActive = true;
    // const isActive = true; // Replace with your logic for determining active status
    const [statuses, setStatuses] = useState({
        projectName: false,
        presentation: false,
        demo: false,
        success: false,
    });
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    useEffect(() => {
        // Fetch facultyId from localStorage
        const storedFacultyId = localStorage.getItem('facultyId');
        if (storedFacultyId) {
            setFacultyId(storedFacultyId);
            // Example: Fetch faculty details based on facultyId (replace with your actual API call)
            fetchFacultyDetails(storedFacultyId);
        }
    }, []);

    // Example function to fetch faculty details based on facultyId (replace with actual implementation)
    const fetchFacultyDetails = async (facultyId) => {
        try {
            // Example endpoint: replace with your actual API endpoint
            const response = await fetch(`http://localhost:8080/api/v1/adminapp/faculty/${facultyId}`);
            if (response.ok) {
                const data = await response.json();
                setData(data);

                // Filter out only the desired fields
                const filteredDetails = {
                    facultyId: data.facultyID,
                    facultyName: data.facultyName,
                    facultyEmail: data.facultyEmail,
                    fatherName: data.facultyFatherName,
                    motherName: data.facultyMotherName,
                    aadharCard: data.facultyAadharCard,
                    panCard: data.facultyPANCard,
                    pincode: data.facultyPincode,
                    residentialAddress: data.facultyResidentialAddress,
                    city: data.facultyCity,
                    permanentAddress: data.facultyPermanentAddress,
                    collegeId: data.collegeId,
                    collegeCity: data.city,
                    collegeName: data.collegeName,
                    collegePincode: data.zipcode,
                    subjects: data.subjects,
                    // Keep all subjects
                };
                setFacultyDetails(filteredDetails);
            } else {
                console.error('Failed to fetch faculty details');
            }
        } catch (error) {
            console.error('Error fetching faculty details:', error);
        }
    };


    const [nextStatus, setNextStatus] = useState('');

    useEffect(() => {
        // Example logic to determine the next status
        if (!statuses.projectName) {
            setNextStatus('projectName');
        } else if (!statuses.presentation) {
            setNextStatus('presentation');
        } else if (!statuses.demo) {
            setNextStatus('demo');
        } else if (!statuses.success) {
            setNextStatus('success');
        } else {
            setNextStatus('');
        }
    }, [statuses]);

    // const handleClick = (status) => {
    //     setStatuses((prevStatuses) => ({
    //         ...prevStatuses,
    //         [status]: !prevStatuses[status],
    //     }));
    // };

    // Function to handle click events
    const handleClick = (stage) => {
        // Create an array of stages in the correct order
        const stages = ['projectName', 'presentation', 'demo', 'success'];

        // Find the index of the current stage
        const stageIndex = stages.indexOf(stage);

        // Update statuses based on clicked stage and previous stages
        const updatedStatuses = {};
        stages.forEach((s, index) => {
            if (index <= stageIndex) {
                updatedStatuses[s] = true; // Set to true up to the clicked stage
            } else {
                updatedStatuses[s] = false; // Set to false for stages after the clicked stage
            }
        });

        // Update state with the new statuses
        setStatuses(updatedStatuses);
    };

    return (
        <div>
            <div className='flex mt-2 space-x-2'>
                {/* First column with 70% width */}
                <div className='flex bg-slate-50 rounded-lg shadow-lg p-2 border w-full h-full' style={{ flexBasis: '70%' }}>
                    <div className='w-full mt-2'>
                        {/* First row */}
                        <div className='flex w-full'>
                            {/* First column with the image */}
                            <div className='flex items-center p-2 bg-white shadow-lg rounded-full'>
                                <img
                                    src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGJ5PMZUZPaA8_GYEW5XN_--bWQbaXK7ZhXtV4myhhAG376YUTcHIfeItLj9h-gZoBEMg&usqp=CAU'
                                    alt='Profile Image'
                                    width={150}
                                    height={150}
                                    className='rounded-full'
                                />
                            </div>
                            {/* Cards in the first column */}
                            <div className='flex flex-grow justify-around items-center ml-4'>
                                <div className='bg-yellow-400 shadow-lg h-32 rounded-lg p-4 m-2 w-1/3 flex flex-col items-center'>
                                    <h2 className=' font-bold uppercase text-md'>Attendance</h2>
                                    <CircularProgressbar
                                        value={percentage1}
                                        text={`${percentage1}%`}
                                        styles={buildStyles({
                                            textColor: "black",
                                            pathColor: "black",
                                            trailColor: "white"
                                        })}
                                        className='w-24 h-24 mt-2'
                                    />
                                </div>
                                <div className={`shadow-lg h-32 rounded-lg p-4 m-2 w-1/3 flex flex-col items-center ${isActive ? 'bg-green-600' : 'bg-red-600'}`}>
                                    <h2 className=' font-bold uppercase text-md'>Status</h2>
                                    <h1 className={`mt-4 font-semibold text-center uppercase text-black ${isActive ? '' : 'hidden'} text-sm`}>Active</h1>
                                    <h1 className={`mt-4 font-semibold text-center uppercase text-black ${isActive ? 'hidden' : ''} text-sm`}>Inactive</h1>
                                </div>
                                <div className='bg-blue-600 shadow-lg h-32 rounded-lg p-4 m-2 w-1/3 flex flex-col items-center'>
                                    <h2 className=' font-bold uppercase text-md'>Rating</h2>
                                    <CircularProgressbar
                                        value={percentage3}
                                        text={`${percentage3}%`}
                                        styles={buildStyles({
                                            textColor: "black",
                                            pathColor: "black",
                                            trailColor: "white"
                                        })}
                                        className='w-24 h-24 mt-2'
                                    />
                                </div>
                            </div>

                            {isActive && (
                                <button
                                    className='flex bg-purple-600 items-center w-10 h-10 justify-center rounded-full'
                                    onClick={() => setIsPopupOpen(true)} // Open the popup on click
                                >
                                    <RiEdit2Fill color='#fff' />
                                </button>
                            )}
                        </div>
                        {/* Second row */}
                        <div className='flex mt-2 items-center justify-center'>
                            <div className="col-span-2">
                                <div className="grid grid-cols-5 w-full -mt-1  gap-4">

                                    {/* Displaying subjects */}
                                    {Object.entries(facultyDetails).map(([key, value]) => (
                                        key !== 'subjects' && (
                                            <div className="mb-4" key={key}>
                                                <label className="block text-gray-700 uppercase text-sm font-bold mb-2">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                                                <input
                                                    type="text"
                                                    name={key}
                                                    value={value}
                                                    readOnly
                                                    className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                    required
                                                />
                                            </div>
                                        )
                                    ))}

                                    {facultyDetails.subjects.map((subject, index) => (
                                        <div key={index + 1} className="mb-4">
                                            <label className="block text-gray-700 uppercase text-sm font-bold mb-2">{subject.subjectName}</label>
                                            <input
                                                type="text"
                                                value={`Total Students: ${subject.total}`}
                                                readOnly
                                                className="border rounded w-full py-2 px-3 mt-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                required
                                            />
                                            <input
                                                type="text"
                                                value={`Passed Students: ${subject.passed}`}
                                                readOnly
                                                className="border rounded w-full py-2 px-3 mt-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                required
                                            />
                                            <input
                                                type="text"
                                                value={`Failed Students: ${subject.failed}`}
                                                readOnly
                                                className="border rounded w-full py-2 px-3 mt-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                required
                                            />
                                        </div>
                                    ))}


                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Second column with 30% width */}
                <div className='flex flex-col bg-slate-50 rounded-lg items-center justify-center shadow-lg p-2 border w-full h-full' style={{ flexBasis: '30%' }}>
                    <div className='flex flex-col mt-2 p-3 bg-purple-600  rounded-lg shadow-lg border items-center'>
                        <Calendar
                            onChange={setDate}
                            value={date}
                        />
                    </div>

                    <div className='flex justify-center border w-full bg-slate-50 p-6 shadow-lg rounded-lg mt-6 overflow-y-auto' style={{ maxHeight: 'calc(100vh - 200px)' }}>
                        <div className='absolute items-start -mt-2  ml-80'>
                            <button className=' bg-purple-600  hover:bg-purple-800 rounded-full p-2'>
                                <MdModeEditOutline  color='#fff'/>
                            </button>
                        </div>
                        
                        <div className='flex flex-col items-center'>
                            {/* Project Name */}
                            <h2
                                className={`text-sm font-bold ${statuses.projectName ? 'text-green-600' : 'text-gray-500'}`}
                                onClick={() => handleClick('projectName')}
                            >
                                Project Name
                            </h2>
                            <div className={`h-8 w-1 ${statuses.projectName ? 'bg-green-600' : nextStatus === 'projectName' ? 'bg-blink' : 'bg-gray-300'} my-1`}></div>

                            {/* Presentation */}
                            <h2
                                className={`text-sm font-bold ${statuses.presentation ? 'text-green-600' : 'text-gray-500'}`}
                                onClick={() => handleClick('presentation')}
                            >
                                Presentation
                            </h2>
                            <div className={`h-8 w-1 ${statuses.presentation ? 'bg-green-600' : nextStatus === 'presentation' ? 'bg-blink' : 'bg-gray-300'} my-1`}></div>

                            {/* Demo */}
                            <h2
                                className={`text-sm font-bold ${statuses.demo ? 'text-green-600' : 'text-gray-500'}`}
                                onClick={() => handleClick('demo')}
                            >
                                Demo
                            </h2>
                            <div className={`h-8 w-1 ${statuses.demo ? 'bg-green-600' : nextStatus === 'demo' ? 'bg-blink' : 'bg-gray-300'} my-1`}></div>

                            {/* Success */}
                            <h2
                                className={`text-sm font-bold ${statuses.success ? 'text-green-600' : 'text-gray-500'}`}
                                onClick={() => handleClick('success')}
                            >
                                Success
                            </h2>
                            <div className={`h-8 w-1 ${statuses.success ? 'bg-green-600' : nextStatus === 'success' ? 'bg-blink' : 'bg-gray-300'} my-1`}></div>
                        </div>
                    </div>

                    <style jsx>{`
    @keyframes blink {
        0% { background-color: #e0e0e0; }
        50% { background-color: blue; }
        100% { background-color: #e0e0e0; }
    }

    .bg-blink {
        animation: blink 1s infinite;
    }
`}</style>

                </div>
                {/* Popup for editing faculty details */}

            </div>
            <EditFacultyPopup
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                facultyDetails={facultyDetails}
                data={data}
                subjects={subjects}

            />
        </div>
    );
};

export default FacultyHomePage;
