import grovepi
import sys
import json

# Define your LED pin
LED_PIN = 4  # Example: digital port D4
grovepi.pinMode(LED_PIN, "OUTPUT")

# Read command from Node.js
def main():
    try:
        # Read input from Node.js
        input_data = sys.stdin.read()
        data = json.loads(input_data)

        if data["command"] == "on":
            grovepi.digitalWrite(LED_PIN, 1)  # Turn LED ON
            response = {"status": "LED turned on"}
        elif data["command"] == "off":
            grovepi.digitalWrite(LED_PIN, 0)  # Turn LED OFF
            response = {"status": "LED turned off"}
        else:
            response = {"error": "Unknown command"}

        # Send output back to Node.js
        print(json.dumps(response))
    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    main()
