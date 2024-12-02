import sys
import json
import time

# Pin definitions
LED_PIN01 = 3
LED_PIN02 = 4

# Current command state
current_command = None

def digitalWrite(pin, state):
    # Mock implementation of digitalWrite
    print(f"Pin {pin} set to {state}")

def reset_pins():
    digitalWrite(LED_PIN01, 0)  # Turn off LED on PIN01
    digitalWrite(LED_PIN02, 0)  # Turn off LED on PIN02

def handle_blinking(pin):
    global current_command
    while current_command in ["items available", "items unavailable"]:
        digitalWrite(pin, 1)  # Turn on LED
        time.sleep(1)
        digitalWrite(pin, 0)  # Turn off LED
        time.sleep(1)
        # Exit loop if command changes
        if current_command not in ["items available", "items unavailable"]:
            break

def main():
    global current_command
    try:
        reset_pins()
        
        # Read input from Node.js
        input_data = sys.stdin.read()
        data = json.loads(input_data)
        new_command = data.get("command", "")

        # Stop any ongoing processes if the command changes
        if new_command != current_command:
            reset_pins()
            current_command = new_command

        if new_command == "items available":
            handle_blinking(LED_PIN01)

        elif new_command == "item bought":
            digitalWrite(LED_PIN01, 1)  # Green light on
            digitalWrite(LED_PIN02, 0)  # Red light off
            response = {"status": "green light"}
            print(json.dumps(response))

        elif new_command == "no item bought":
            digitalWrite(LED_PIN01, 0)  # Green light off
            digitalWrite(LED_PIN02, 1)  # Red light on
            response = {"status": "red light"}
            print(json.dumps(response))

        elif new_command == "items unavailable":
            handle_blinking(LED_PIN02)

        else:
            response = {"error": "Unknown command"}
            print(json.dumps(response))

    except Exception as e:
        print(json.dumps({"error": str(e)}))
    finally:
        reset_pins()

if __name__ == "__main__":
    main()
