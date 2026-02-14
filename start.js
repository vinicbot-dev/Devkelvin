const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Check if PM2 is installed
function checkPM2() {
    return new Promise((resolve) => {
        exec('pm2 -v', (error) => {
            resolve(!error);
        });
    });
}

// Install PM2 if not present
async function ensurePM2() {
    const hasPM2 = await checkPM2();
    if (!hasPM2) {
        console.log('📦 Installing PM2 globally...');
        exec('npm install -g pm2', (error) => {
            if (error) {
                console.error('Failed to install PM2:', error);
                process.exit(1);
            }
            console.log('✅ PM2 installed successfully');
            startWithPM2();
        });
    } else {
        startWithPM2();
    }
}

function startWithPM2() {
    console.log('🚀 Starting Jexploit with PM2...');
    
    // Create logs directory
    if (!fs.existsSync('./logs')) {
        fs.mkdirSync('./logs');
    }
    
    // Start with PM2
    const pm2Command = `pm2 start index.js --name "jexploit" \
        --max-memory-restart 500M \
        --restart-delay 5000 \
        --exp-backoff-restart-delay 100 \
        --no-autorestart false \
        --log ./logs/combined.log \
        --error ./logs/error.log \
        --output ./logs/output.log \
        --time`;

    exec(pm2Command, (error, stdout, stderr) => {
        if (error) {
            console.error('❌ Failed to start with PM2:', error);
            console.log('Falling back to direct start...');
            startDirect();
            return;
        }
        
        console.log('✅ Bot started with PM2');
        console.log('📊 Run "npm run pm2:status" to check status');
        console.log('📝 Run "npm run pm2:logs" to view logs');
        
        // Save PM2 config
        exec('pm2 save');
    });
}

function startDirect() {
    console.log('🚀 Starting Jexploit directly...');
    require('./index.js');
}

// Check if running with PM2 already
if (process.env.PM2) {
    // Already in PM2, just start normally
    require('./index.js');
} else {
    // Not in PM2, start with PM2
    ensurePM2();
}