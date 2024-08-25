import React, { useState } from 'react';

function App() {
    const [file, setFile] = useState(null);
    const [powerData, setPowerData] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('http://localhost:5000/upload', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();
        setPowerData(result.power);
    };

    return (
        <div className="App">
            <h1>Some power values:</h1>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange} accept="image/*" />
                <button type="submit">Upload</button>
            </form>
            {powerData && (
                <div>
                    <h2>Power Values:</h2>
                    <p><strong>Package Power:</strong> {powerData.packagePower}</p>
                    <p><strong>IA Cores Power:</strong> {powerData.iaCoresPower}</p>
                    <p><strong>GT Power:</strong> {powerData.gtPower}</p>
                    <p><strong>Power Max (PL1):</strong> {powerData.powerMaxPL1}</p>
                    <p><strong>Short Power Max (PL2):</strong> {powerData.shortPowerMaxPL2}</p>
                </div>
            )}
        </div>
    );
}

export default App;