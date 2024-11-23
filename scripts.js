// Function to append messages to the console box
function logToConsole(message) {
    const consoleBox = document.getElementById("console");
    const logEntry = document.createElement("div");
    logEntry.textContent = message;
    consoleBox.appendChild(logEntry);
    consoleBox.scrollTop = consoleBox.scrollHeight; // Auto-scroll to the bottom
}

// Show loading spinner
function showLoading() {
    document.getElementById("loadingSpinner").style.display = "block";
}

// Hide loading spinner
function hideLoading() {
    document.getElementById("loadingSpinner").style.display = "none";
}

// Run a task by sending a request to the server
async function runTask(endpoint) {
    const target = document.getElementById("targetInput").value.trim();
    if (!target) {
        logToConsole("Error: Target is required.");
        alert("Please enter a valid target.");
        return;
    }

    showLoading();
    logToConsole(`Starting task: ${endpoint} on target ${target}`);
    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ target }),
        });

        const data = await response.json();
        hideLoading();

        if (response.ok) {
            logToConsole(`Task ${endpoint} completed: \n${data.message}`);
        } else {
            logToConsole(`Error: ${data.error || "An unknown error occurred."}`);
        }
    } catch (error) {
        hideLoading();
        logToConsole(`Error: Failed to connect to the server. Details: ${error.message}`);
        alert("Failed to connect to the server. Please try again later.");
    }
}
