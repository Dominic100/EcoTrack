import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

const EFSelector = () => {
    const [efData, setEfData] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedEF, setSelectedEF] = useState(null);

    // Load and parse the CSV file
    useEffect(() => {
        fetch('/EF (Electricity Grid).csv')
            .then(response => response.text())
            .then(csvText => {
                Papa.parse(csvText, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (result) => {
                        // Sort countries alphabetically
                        const sortedData = result.data.sort((a, b) => a.Country.localeCompare(b.Country));
                        setEfData(sortedData);
                    },
                });
            });
    }, []);

    const handleCountryChange = (e) => {
        const country = e.target.value;
        setSelectedCountry(country);

        // Find the EF for the selected country
        const countryData = efData.find(item => item.Country === country);
        if (countryData) {
            setSelectedEF(countryData.EF);
        } else {
            setSelectedEF(null);
        }
    };

    return (
        <div>
            <label htmlFor="country-select">Select a country:</label>
            <select id="country-select" value={selectedCountry} onChange={handleCountryChange}>
                <option value="" disabled>Select a country</option>
                {efData.map((item, index) => (
                    <option key={index} value={item.Country}>{item.Country}</option>
                ))}
            </select>

            {selectedEF !== null && (
                <div>
                    <p>Emission Factor (EF) for {selectedCountry}: {selectedEF}</p>
                </div>
            )}
        </div>
    );
};

export default EFSelector;