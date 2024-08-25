#include <WiFi.h>
#include <WebServer.h>
#include <EmonLib.h>

EnergyMonitor emon;
#define vCalibration 83.3
#define currCalibration 0.50

float kWh = 0;
unsigned long lastmillis = millis();

const char* ssid = "Dom";
const char* password = "aneesh123";

WebServer server(80);

void setup() {
  Serial.begin(115200);

  WiFi.begin(ssid, password);
  Serial.println("Connecting to WiFi...");
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }

  Serial.println("");
  Serial.print("Connected to WiFi with IP: ");
  Serial.println(WiFi.localIP());

  emon.voltage(35, vCalibration, 1.7);
  emon.current(34, currCalibration);

  server.on("/", HTTP_GET, []() {
    String html = "<html><body>";
    html += "<h1>Energy Monitoring</h1>";
    html += "<p>Vrms: " + String(emon.Vrms, 2) + " V</p>";
    html += "<p>Irms: " + String(emon.Irms, 4) + " A</p>";
    html += "<p>Power: " + String(emon.apparentPower, 4) + " W</p>";
    html += "<p>kWh: " + String(kWh, 5) + " kWh</p>";
    html += "</body></html>";
    server.send(200, "text/html", html);
  });

  server.begin();
}

void loop() {
  server.handleClient();
  
  emon.calcVI(20, 2000);
  kWh = kWh + emon.apparentPower * (millis() - lastmillis) / 3600000000.0;
  lastmillis = millis();
}
