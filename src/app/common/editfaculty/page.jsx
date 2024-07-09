import React, { useState, useEffect } from 'react';
import { FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import axios from 'axios';

const EditFacultyPopup = ({ isOpen, onClose, facultyDetails, data }) => {
    const demoSubjects = [
        { subjectID: 'SUBJ1', subjectName: 'Mathematics' },
        { subjectID: 'SUBJ2', subjectName: 'Science' },
        { subjectID: 'SUBJ3', subjectName: 'Social Studies' },
        { subjectID: 'SUBJ4', subjectName: 'English' },
        { subjectID: 'SUBJ5', subjectName: 'History' },
        { subjectID: 'SUBJ6', subjectName: 'Geography' },
        { subjectID: 'SUBJ7', subjectName: 'Physics' },
        { subjectID: 'SUBJ8', subjectName: 'Chemistry' },
        { subjectID: 'SUBJ9', subjectName: 'Biology' },
        { subjectID: 'SUBJ10', subjectName: 'Computer Science' }
    ];

    const [subjects, setSubjects] = useState([]);
    const [dropdowns, setDropdowns] = useState([]);

    useEffect(() => {
        if (facultyDetails && facultyDetails.subjects) {
            setSubjects(facultyDetails.subjects.length ? facultyDetails.subjects : demoSubjects);
            const initialDropdowns = facultyDetails.subjects.length ? facultyDetails.subjects.map(subject => ({
                subject: subject.subjectID,
                totalStudents: subject.total.toString(),
                passStudents: subject.passed.toString(),
                failStudents: subject.failed.toString()
            })) : [{ subject: '', totalStudents: '', passStudents: '', failStudents: '' }];
            setDropdowns(initialDropdowns);
        } else {
            setSubjects(demoSubjects);
            setDropdowns([{ subject: '', totalStudents: '', passStudents: '', failStudents: '' }]);
        }
    }, [facultyDetails]);

    const addDropdown = () => {
        if (dropdowns.length < 5) {
            setDropdowns([...dropdowns, { subject: '', totalStudents: '', passStudents: '', failStudents: '' }]);
        }
    };

    const removeDropdown = (index) => {
        if (dropdowns.length > 1) {
            const updatedDropdowns = dropdowns.filter((_, i) => i !== index);
            setDropdowns(updatedDropdowns);
        }
    };

    const handleSubjectChange = (index, e) => {
        const { name, value } = e.target;

        const isDuplicate = dropdowns.some((dropdown, i) => i !== index && dropdown.subject === value);
        if (isDuplicate) {
            alert('Subject already selected in another dropdown!');
            return;
        }

        const updatedDropdowns = dropdowns.map((dropdown, i) =>
            i === index ? { ...dropdown, [name]: value } : dropdown
        );
        setDropdowns(updatedDropdowns);
    };

    const handleInputChange = (index, e) => {
        const { name, value } = e.target;
        const updatedDropdowns = dropdowns.map((dropdown, i) =>
            i === index ? { ...dropdown, [name]: value } : dropdown
        );
        setDropdowns(updatedDropdowns);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate inputs
        const isValid = dropdowns.every(dropdown =>
            parseInt(dropdown.totalStudents) === (parseInt(dropdown.passStudents) + parseInt(dropdown.failStudents))
        );

        if (!isValid) {
            alert('Total students should equal the sum of passed and failed students for each subject.');
            return;
        }

        const updatedFacultyDetails = {
            facultyId: facultyDetails.facultyID,
            facultyName: facultyDetails.facultyName,
            facultyProfile: data.facultyProfile,
            facultyPermanentAddress: data.facultyPermanentAddress,
            facultyResidentialAddress: data.facultyResidentialAddress,
            facultyFatherName: data.facultyFatherName,
            facultyMotherName: data.facultyMotherName,
            facultyPANCard: data.facultyPANCard,
            facultyAadharCard: data.facultyAadharCard,
            facultyPhoneNumber: data.facultyPhoneNumber,
            facultyHomeNumber: data.facultyHomeNumber,
            facultyPassword: data.facultyPassword,
            facultyEmail: data.facultyEmail,
            isActive: data.isActive,
            studentsTaught: data.studentsTaught,
            subjectsCount: data.subjectsCount,
            passRate: data.passRate,
            failRate: data.failRate,
            rating: data.rating,
            status: data.status,
            attendance: data.attendance,
            subjects: dropdowns.map((dropdown) => {
                const subject = subjects.find(s => s.subjectID === dropdown.subject);
                if (!subject) {
                    console.error(`Subject with ID ${dropdown.subject} not found`);
                    return null;
                }
                return {
                    subjectID: dropdown.subject,
                    subjectName: subject.subjectName,
                    total: parseInt(dropdown.totalStudents),
                    passed: parseInt(dropdown.passStudents),
                    failed: parseInt(dropdown.failStudents),
                };
            }).filter(subject => subject !== null),
            college: {
                collegeID: facultyDetails.collegeId,
                collegeName: facultyDetails.collegeName,
                collegeLogo: data.collegeLogo,
                address: data.address, 
                state: data.state, 
                zipcode: data.zipcode,
            }
        };

        // Proceed with API calls
        try {
            // Update faculty details
            const updateFacultyResponse = await axios.put(`http://localhost:8080/api/v1/adminapp/faculty/update/${facultyDetails.facultyId}`, updatedFacultyDetails);
            console.log('Faculty details updated successfully:', updateFacultyResponse.data);

            // Update subjects (if any)
            for (let dropdown of dropdowns) {
                const subjectData = {
                    subjectID: dropdown.subject,
                    subjectName: subjects.find(s => s.subjectID === dropdown.subject)?.subjectName || "",
                    total: parseInt(dropdown.totalStudents),
                    passed: parseInt(dropdown.passStudents),
                    failed: parseInt(dropdown.failStudents),
                };
                await axios.post(`http://localhost:8080/v1/subjects/add/${facultyDetails.facultyId}`, [subjectData]);
                console.log(`Subject ${subjectData.subjectName} added successfully`);
            }

            // Close the popup on success
            onClose();
        } catch (error) {
            console.error('Error updating faculty details:', error);
            // Handle error updating faculty details
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center p-10 justify-center bg-gray-800 bg-opacity-50">
            <div className="relative bg-white rounded-lg p-8">
                <h2 className="text-2xl font-bold text-center mb-4">Edit Faculty Details</h2>
                <form onSubmit={handleSubmit} className="mt-4">
                    <div className="grid grid-cols-5 gap-4">
                        {Object.entries(facultyDetails).map(([key, value]) => (
                            key !== 'subjects' && (
                                <div className="mb-4" key={key}>
                                    <label className="block text-gray-700 uppercase text-sm font-bold mb-2">
                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                    </label>
                                    {typeof value === 'object' && value !== null ? (
                                        <div>
                                            {Array.isArray(value) && value.map((subject, index) => (
                                                <div key={index}>
                                                    <label className="block text-gray-700 uppercase text-sm font-bold mb-2">
                                                        Subject {index + 1}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name={`subject-${index}`}
                                                        value={subject.subject}
                                                        readOnly
                                                        className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <input
                                            type="text"
                                            name={key}
                                            defaultValue={value || ''}
                                            readOnly
                                            className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        />
                                    )}
                                </div>
                            )
                        ))}
                        {dropdowns.map((dropdown, index) => (
                            <div key={index}>
                                <div className="mb-4 col-span-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-gray-700 uppercase text-sm font-bold">
                                            Subject {index + 1}
                                        </label>
                                        <FaPlus className="text-blue-500 cursor-pointer text-end" onClick={addDropdown} />
                                        <MdDelete className="text-red-500 cursor-pointer" onClick={() => removeDropdown(index)} />
                                    </div>
                                    <select
                                        name="subject"
                                        value={dropdown.subject}
                                        onChange={(e) => handleSubjectChange(index, e)}
                                        className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    >
                                        <option value="">Select a subject</option>
                                        {subjects.map((subject, i) => (
                                            <option key={i} value={subject.subjectID}>
                                                {subject.subjectName}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex flex-wrap justify-between items-center">
                                    <div className='flex col-span-2 items-center justify-center'>
                                        <h1 className='w-1/2'>
                                            Total:
                                        </h1>
                                        <input
                                            type="text"
                                            name="totalStudents"
                                            value={dropdown.totalStudents}
                                            onChange={(e) => handleInputChange(index, e)}
                                            className="border w-full rounded py-2 mt-1 ml-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            required
                                        />
                                    </div>

                                    <div className='flex col-span-2 items-center justify-center'>
                                        <h1 className='w-1/2'>
                                            Passed:
                                        </h1>
                                        <input
                                            type="text"
                                            name="passStudents"
                                            value={dropdown.passStudents}
                                            onChange={(e) => handleInputChange(index, e)}
                                            className="border rounded w-full py-2 px-3 mt-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            required
                                        />
                                    </div>
                                    <div className='flex col-span-2 items-center justify-center'>
                                        <h1 className='w-1/2'>
                                            Failed:
                                        </h1>
                                        <input
                                            type="text"
                                            name="failStudents"
                                            value={dropdown.failStudents}
                                            onChange={(e) => handleInputChange(index, e)}
                                            className="border rounded w-full mt-1 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                        >
                            Close
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditFacultyPopup;
