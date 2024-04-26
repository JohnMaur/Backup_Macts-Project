#include <ESP8266WiFi.h>
#include <SPI.h>
#include <MFRC522.h>

#define SS_PIN D4 // Define the SS (Slave Select) pin for the RFID module
#define RST_PIN D3 // Define the RST (Reset) pin for the RFID module

MFRC522 mfrc522(SS_PIN, RST_PIN); // Create MFRC522 instance

// const char* ssid = "loy"; // Change this to your Wi-Fi network SSID
// const char* password = "12345678"; // Change this to your Wi-Fi network password
// const char* serverAddress = "192.168.140.90"; // Change this to your server's IP address
// const int serverPort = 2727; // Change this to your server's port
const char* ssid = "HUAWEI-2.4G-z4ER"; // Change this to your Wi-Fi network SSID
const char* password = "PurpleSky.18"; // Change this to your Wi-Fi network password
const char* serverAddress = "192.168.100.138"; // Change this to your server's IP address
const int serverPort = 2727; 

void setup() {
  Serial.begin(9600);
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }

  Serial.println("Connected to WiFi");
  Serial.println("Tap your RFID tag");

  SPI.begin(); // Initiate SPI bus
  mfrc522.PCD_Init(); // Initiate RFID module
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;

    // Look for new RFID cards
    if (mfrc522.PICC_IsNewCardPresent()) {
      if (mfrc522.PICC_ReadCardSerial()) {
        Serial.println("Card detected!");

        // Print the tag data
        Serial.print("Tag data: ");
        String tagData = "";
        for (byte i = 0; i < mfrc522.uid.size; i++) {
          tagData += String(mfrc522.uid.uidByte[i], HEX);
        }
        Serial.println(tagData);

        if (client.connect(serverAddress, serverPort)) {
          Serial.println("Connected to server");

          // Send tag data to server
          sendTagData(client, tagData);
          
          // Wait for response from the server
          while (client.connected() && !client.available()) delay(1);
          if (client.available()) {
            String response = client.readStringUntil('\r');
            Serial.println("Response from server: " + response);
            // If you need to do something with the response, you can handle it here
          }
          
          mfrc522.PICC_HaltA(); // Halt PICC
          mfrc522.PCD_StopCrypto1(); // Stop encryption on PCD
          client.stop(); // Close the connection to the server
          Serial.println("Message sent to server");
        } else {
          Serial.println("Unable to connect to server");
        }
      }
    }
  } else {
    Serial.println("WiFi not connected");
  }
  
  delay(1000); // Delay before next iteration
}

void sendTagData(WiFiClient& client, String data) {
  String url = "/tagData";
  String requestBody = "tagData=" + data;
  Serial.print("Sending tag data to server: ");
  Serial.println(data);

  client.print("POST ");
  client.print(url);
  client.println(" HTTP/1.1");
  client.print("Host: ");
  client.println(serverAddress);
  client.println("Content-Type: application/x-www-form-urlencoded");
  client.print("Content-Length: ");
  client.println(requestBody.length());
  client.println();
  client.println(requestBody);
}

