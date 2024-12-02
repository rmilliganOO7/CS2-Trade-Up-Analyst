const { spawn } = require("child_process");

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

// Example usage
(async () => {
  try {
    const response = await interactWithPython("on");
    console.log("Response from Python:", response);

    setTimeout(async () => {
      const responseOff = await interactWithPython("off");
      console.log("Response from Python:", responseOff);
    }, 2000);
  } catch (error) {
    console.error(error);
  }
})();
