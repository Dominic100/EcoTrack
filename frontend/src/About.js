import React from 'react';
import { useNavigate } from 'react-router-dom';

const About = () => {
    const navigate = useNavigate();

    const handleTrackEmissions = () => {
        navigate('/track-carbon-emissions');
    };

    return (
        <div className="p-6 bg-gray-100 text-gray-800">
            <h1 className="text-3xl font-bold mb-6">About Eco-Track</h1>

            <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-4">What Are Carbon Footprints?</h2>
                <ul className="list-disc list-inside ml-4">
                    <li>Carbon footprints measure the total greenhouse gases emitted by human activities, primarily carbon dioxide (CO₂).</li>
                    <li>These activities include energy consumption, transportation, and the production and consumption of goods.</li>
                </ul>
            </section>

            <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-4">Why Measure and Control Carbon Footprints?</h2>
                <ul className="list-disc list-inside ml-4">
                    <li>Tracking carbon footprints helps identify major sources of emissions and areas for improvement.</li>
                    <li>Controlling these emissions is crucial for implementing effective sustainability practices.</li>
                    <li>It supports global efforts to mitigate climate change and promote environmental stewardship.</li>
                </ul>
            </section>

            <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-4">What Harm Does Carbon Emission Cause?</h2>
                <ul className="list-disc list-inside ml-4">
                    <li>Carbon emissions contribute to global warming and climate change.</li>
                    <li>These effects lead to rising sea levels, extreme weather conditions, and loss of biodiversity.</li>
                    <li>Such environmental changes disrupt ecosystems and pose risks to both wildlife and human populations.</li>
                </ul>
            </section>

            <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-4">How Are We Affected?</h2>
                <ul className="list-disc list-inside ml-4">
                    <li>Increased health problems due to climate-related factors.</li>
                    <li>Higher economic costs related to damage, resource scarcity, and disaster response.</li>
                    <li>Challenges such as food and water shortages, more frequent natural disasters, and impacts on agriculture and infrastructure.</li>
                    <li>By addressing carbon footprints, we can reduce these negative impacts and work towards a more sustainable future.</li>
                </ul>
            </section>

            <div className="mt-6 text-center">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={handleTrackEmissions}
                >
                    Track Your Carbon Emissions
                </button>
            </div>
        </div>
    );
};

export default About;
