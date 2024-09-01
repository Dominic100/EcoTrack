import React from 'react';
import { useNavigate } from 'react-router-dom';

const ReducePage = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/track-carbon-emissions');
    };

    return (
        <div className="p-6 bg-gray-100 text-gray-800">
            <h1 className="text-3xl font-bold mb-6">How to Reduce Your Carbon Footprint</h1>
            {/* Content about reducing carbon footprint */}
            <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-4">Practical Steps</h2>
                <ul className="list-disc list-inside ml-4">
                    <li>Reduce energy consumption by switching to energy-efficient appliances.</li>
                    <li>Use public transportation or carpool to reduce emissions from personal vehicles.</li>
                    <li>Support renewable energy sources like solar or wind power.</li>
                    <li>Minimize waste by recycling and composting.</li>
                </ul>
            </section>

            <div className="mt-6 text-center">
                <button
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                    onClick={handleBack}
                >
                    Back to Carbon Emission Calculator
                </button>
            </div>
        </div>
    );
};

export default ReducePage;