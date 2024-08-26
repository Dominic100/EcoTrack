# Ecotrack: Real-Time Carbon Footprint Calculator #
Welcome to our Real-Time Carbon Footprint Calculator, a comprehensive platform designed to help users track and reduce their carbon emissions. This project is developed to provide real-time monitoring of power consumption and calculate the corresponding carbon footprint, offering insights into three major areas: manufacturing, charging, and device usage.

## DEMO VIDEO
[![Watch the video](https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg)](https://www.youtube.com/watch?v=VIDEO_ID)

## Hardware Components ##
Our system is powered by the following hardware components:

•	ESP32 WiFi Module 
Provides Wi-Fi connectivity for real-time data transmission and remote monitoring.

•	ZMPT101B AC Voltage Sensor Module 
Measures the AC voltage and provides accurate voltage readings for power calculations.

•	SCT-013-030 Non-invasive AC Current Sensor 
Measures the AC current without direct electrical contact, ensuring safety and ease of use.

•	16x2 LCD Display 
Displays real-time data on power consumption, carbon footprint, and other relevant metrics.

•	Potentiometer 10K 
Adjusts the contrast of the LCD display for better visibility.

•	Resistor 10K
Used in the voltage divider circuit and for general circuit protection.

•	Resistor 100 Ohm 
current limiting to ensure the safety of the components.

•	Capacitor 10uF 
Stabilizes the power supply, ensuring smooth operation of the circuit.
![image](https://github.com/user-attachments/assets/8333eb81-3b07-486a-9432-db628da2605f)

 
Carbon Footprint Calculation Formula
Once the hardware measures the power consumption, the carbon footprint is calculated using the following formula:
Carbon Footprint Generated = Power Consumed * Emission Factor

This data is saved into our database and is available for users in real-time.
## Software Components ##
The software for this project is developed using modern web technologies and tools:
Frontend: React.js for a dynamic and responsive user interface.
Backend API Testing: Postman for API testing and integration.
Database: Firebase for real-time data storage and retrieval.
Key Features
Three Types of Emissions Calculated:
1.	**Manufacturing Emissions**: Users can directly calculate the carbon footprint generated during the manufacturing of their devices.
2.	**Charging Emissions**: Real-time monitoring of emissions generated during device charging.
3.	**Usage Emissions**: Emissions calculated based on the device's power consumption during usage.
User Experience:

Sign-In for Detailed Reports: Users can sign in to access detailed reports on their emissions, including comparisons with other devices.
Device Comparison: Compare carbon emissions of different devices through an intuitive pie chart and percentage format.
Gamified Engagement:

**Leaderboard**: A leaderboard to track and encourage users to reduce their carbon footprint, enhancing user engagement through gamification.
OpenText Content Services API Integration:
Storage Solution: We leverage OpenText Content Services API for efficient storage and retrieval of user data.
Carbon Footprint Reduction Tips:
We provide users with practical suggestions on how to reduce their carbon footprint, empowering them to make more sustainable choices.

**Future Scope**
1.	Enhanced Data Visualization
o	Advanced Reporting: Plan to use OpenText Magellan API for detailed analytics and interactive dashboards.
o	Real-Time Notifications: Implement OpenText Messaging API to send SMS and alerts about high emissions and reduction tips.
2.	IoT and Smart Home Integration
o	Expand to integrate with smart home devices, enabling automated adjustments to reduce power usage based on real-time data.
3.	Carbon Offset Integration
o	Offer users the ability to offset their emissions through partnerships, with tracking to monitor their impact over time.
4.	Mobile Application
o	Develop a mobile app for on-the-go monitoring and real-time notifications.
5.	AI-Powered Suggestions
o	Use machine learning to provide personalized recommendations for reducing carbon footprints based on user behavior.

Contributing
We welcome contributions from the community! Please feel free to submit issues, fork the repository, and send pull requests. Let's work together to create a more sustainable future.


