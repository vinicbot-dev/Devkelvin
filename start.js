console.log('Starting Jexploit bot with auto-restart...');

function startBot() {
    const { spawn } = require('child_process');
    
   
    const bot = spawn('node', ['index.js'], {
        stdio: 'inherit'  // Shows all logs in terminal
    });
    
    // If bot crashes, restart it after 5 seconds
    bot.on('exit', () => {
        console.log('❌ Bot crashed. Restarting in 5 seconds...');
        setTimeout(startBot, 5000);
    });
}

startBot();