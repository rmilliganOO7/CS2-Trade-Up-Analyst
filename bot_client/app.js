const { spawn } = require("child_process");
const readline = require("readline");

// Function to interact with Python
function interactWithPython(command) {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn("python3", ["grove_pi_script.py"]);

    // Send input to the Python script
    pythonProcess.stdin.write(JSON.stringify({ command }));
    pythonProcess.stdin.end();

    // Capture Python script's output
    pythonProcess.stdout.on("data", (data) => {
      const output = JSON.parse(data.toString());
      resolve(output);
    });

    // Handle errors
    pythonProcess.stderr.on("data", (data) => {
      reject(`Error: ${data.toString()}`);
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        reject(`Python process exited with code ${code}`);
      }
    });
  });
}

// Function to process item status
async function processStatus(item_status) {
  try {
    if (item_status === "items_available") {
      const response = await interactWithPython("items available");
      console.log("Response from Python:", response);
    } else if (item_status === "item_bought") {
      const response = await interactWithPython("item bought");
      console.log("Response from Python:", response);
    } else if (item_status === "no_item_bought") {
      const response = await interactWithPython("no item bought");
      console.log("Response from Python:", response);
    } else {
      const response = await interactWithPython("items unavailable");
      console.log("Response from Python:", response);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Create a readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "Enter item status: ",
});

// Prompt the user for input
rl.prompt();

// Listen for user input and process it dynamically
rl.on("line", async (line) => {
  const item_status = line.trim(); // Get user input
  if (item_status.toLowerCase() === "exit") {
    console.log("Exiting...");
    rl.close(); // Exit the program
  } else {
    await processStatus(item_status); // Process the input
    rl.prompt(); // Prompt again for more input
  }
});

