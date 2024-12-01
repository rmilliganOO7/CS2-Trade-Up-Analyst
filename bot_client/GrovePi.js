const GrovePi = require('node-grovepi').GrovePi;

// Initialize the board
const Board = GrovePi.board;

// Pin where the LED is connected (e.g., D2)
const LED_PIN = 2;

// Create a new board instance
const board = new Board({
  debug: true,
  onError: (err) => {
    console.error(`Error: ${err}`);
  },
  onInit: function(res) {
    if (res) {
      console.log('GrovePi is ready!');

      // Set the LED pin mode to output
      this.pinMode(LED_PIN, 'output');

      // Function to turn LED on and off
      const toggleLED = () => {
        console.log('Turning LED ON');
        this.digitalWrite(LED_PIN, 1); // Turn LED ON

        setTimeout(() => {
          console.log('Turning LED OFF');
          this.digitalWrite(LED_PIN, 0); // Turn LED OFF
        }, 1000); // Wait 1 second
      };

      // Run the toggle function every 2 seconds
      setInterval(toggleLED, 2000);
    } else {
      console.error('GrovePi initialization failed');
    }
  },
});

// Start the board
board.init();
