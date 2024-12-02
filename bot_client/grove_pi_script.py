from grovepi import *
import sys
import json
import time

# Define your LED pins
LED_PIN01 = 3  # Digital port D3
LED_PIN02 = 4  # Digital port D4

# Set pin modes
pinMode(LED_PIN01, "OUTPUT")
pinMode(LED_PIN02, "OUTPUT")

# Function to reset all LEDs
def reset_pins():
    digitalWrite(LED_PIN01, 0)  # Turn off LED on PIN01
    digitalWrite(LED_PIN02, 0)  # Turn off LED on PIN02

# Read command from Node.js
def main():
    try:
        # Reset all pins before starting
        reset_pins()

        # Read input from Node.js
        input_data = sys.stdin.read()
        data = json.loads(input_data)

        if data["command"] == "items available":
            reset_pins()  # Clear any previous states
            while True:
                try:
                    digitalWrite(LED_PIN01, 1)  # Turn on LED
                    time.sleep(1)
                    digitalWrite(LED_PIN01, 0)  # Turn off LED
                    time.sleep(1)
                except KeyboardInterrupt:
                    reset_pins()  # Ensure the LED is off
                    break

        elif data["command"] == "item bought":
            reset_pins()  # Clear any previous states
            digitalWrite(LED_PIN01, 1)  # Green light on
            digitalWrite(LED_PIN02, 0)  # Red light off
            response = {"status": "green light"}
            print(json.dumps(response))

        elif data["command"] == "no item bought":
            reset_pins()  # Clear any previous states
            digitalWrite(LED_PIN01, 0)  # Green light off
            digitalWrite(LED_PIN02, 1)  # Red light on
            response = {"status": "red light"}
            print(json.dumps(response))

        elif data["command"] == "items unavailable":
            reset_pins()  # Clear any previous states
            while True:
                try:
                    digitalWrite(LED_PIN02, 1)  # Turn on LED
                    time.sleep(1)
                    digitalWrite(LED_PIN02, 0)  # Turn off LED
                    time.sleep(1)
                except KeyboardInterrupt:
                    reset_pins()  # Ensure the LED is off
                    break

        else:
            reset_pins()  # Clear any previous states
            response = {"error": "Unknown command"}
            print(json.dumps(response))

    except Exception as e:
        reset_pins()  # Ensure LEDs are off in case of an error
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    main()
