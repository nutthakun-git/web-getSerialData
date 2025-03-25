let port;
let reader;
let buffer = ""; // Buffer to accumulate incoming data

async function connectSerial() {
    try {
        port = await navigator.serial.requestPort(); // Ask user to select a port
        await port.open({ baudRate: 9600 }); // Set baud rate

        const decoder = new TextDecoderStream();
        const readableStreamClosed = port.readable.pipeTo(decoder.writable);
        reader = decoder.readable.getReader();

        console.log("Serial connected. Waiting for data...");
        document.getElementById("output").innerText = "Connected. Waiting for data...";
        readSerialData();
    } catch (error) {
        console.error("Serial connection error:", error);
        alert("Error: " + error.message);
    }
}

async function readSerialData() {
    try {
        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            if (value) {
                buffer += value; // Add received data to buffer

                let messages = buffer.split("\n"); // Split buffer by newline
                buffer = messages.pop(); // Keep last incomplete part in buffer

                messages.forEach((message) => {
                    if (message.trim() !== "") {
                        console.log("Complete Message:", message);
                        insertData(message);
                    }
                });
            }
        }
    } catch (error) {
        console.error("Error reading serial data:", error);
    }
}

// Function to insert received data into HTML
function insertData(data) {
    let outputDiv = document.getElementById("output");
    outputDiv.innerHTML = data; // Insert at top
}
