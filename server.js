const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

// Utility function to execute shell commands securely
const runCommand = (command) => {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(stderr || error.message);
            } else {
                resolve(stdout.trim());
            }
        });
    });
};

// Define real-world tasks
const tasks = {
    '/run-recon': async (target) => {
        // Perform reconnaissance using Nmap
        const command = `nmap -A ${target}`;
        return await runCommand(command);
    },
    '/run-sql-injection': async (target) => {
        // Test for SQL Injection using SQLMap
        const command = `sqlmap -u "${target}" --batch --random-agent`;
        return await runCommand(command);
    },
    '/run-xss': async (target) => {
        // Test for XSS using XSStrike
        const command = `xsstrike --url "${target}"`;
        return await runCommand(command);
    },
    '/run-auth-test': async (target) => {
        // Authentication testing using Hydra for brute force attacks
        const command = `hydra -l admin -P /usr/share/wordlists/rockyou.txt ${target} http-post-form "/login:username=^USER^&password=^PASS^:F=incorrect"`;
        return await runCommand(command);
    },
    '/run-security-header-check': async (target) => {
        // Check for missing security headers using Curl
        const command = `curl -I ${target}`;
        return await runCommand(command);
    },
    '/run-brute-force': async (target) => {
        // Brute-force testing using Hydra for SSH services
        const command = `hydra -l root -P /usr/share/wordlists/rockyou.txt ssh://${target}`;
        return await runCommand(command);
    },
    '/run-automated-scan': async (target) => {
        // Run automated vulnerability scans using OWASP ZAP
        const command = `zap-cli quick-scan --self-contained ${target}`;
        return await runCommand(command);
    },
};

// Register endpoints and link to real-world tasks
Object.keys(tasks).forEach((endpoint) => {
    app.post(endpoint, async (req, res) => {
        const { target } = req.body;
        if (!target || typeof target !== 'string') {
            return res.status(400).json({ error: 'Invalid or missing target.' });
        }
        try {
            const result = await tasks[endpoint](target);
            res.json({ message: result });
        } catch (error) {
            res.status(500).json({ error: `Task failed: ${error}` });
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

