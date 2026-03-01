/*Kelvin Tech*/

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const moment = require('moment-timezone');

const MEMORY_LIMIT = 600; // MB
const RESTART_DELAY = 3000; // ms
const MEMORY_CHECK_INTERVAL = 600000; // 10 minutes
const TIMEZONE = "Africa/Nairobi";

function getLogFileName() {
  return `${moment().tz(TIMEZONE).format('YYYY-MM-DD')}.log`;
}

function createTmpFolder() {
  const folderName = "tmp";
  const folderPath = path.join(__dirname, folderName);

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }
}
 
createTmpFolder();

function logMessage(message) {
  const timestamp = moment().tz(TIMEZONE).format('HH:mm z');
  console.log(`[JEXPLOIT] ${message}`);
  fs.appendFileSync(path.join(__dirname, 'tmp', getLogFileName()), `[${timestamp}] ${message}\n`);
}

function start() {
  process.env.NODE_OPTIONS = '--no-deprecation';

  const args = [path.join(__dirname, 'index.js'), ...process.argv.slice(2)];
  
  logMessage('Starting Jexploit Bot...');

  const logFilePath = path.join(__dirname, 'tmp', getLogFileName());
  const errorLogStream = fs.createWriteStream(logFilePath, { flags: 'a' });

  let p = spawn(process.argv[0], args, {
    stdio: ['inherit', 'inherit', 'pipe', 'ipc'],
  });

  p.stderr.on('data', (data) => {
    const errorMsg = `[${moment().tz(TIMEZONE).format('HH:mm z')}] ${data.toString()}`;
    console.error(errorMsg);
    errorLogStream.write(errorMsg);
  });
  
  const memoryCheckInterval = setInterval(() => {
    try {
      if (!p.pid) return;
      
      // Get memory usage of the current process in MB using Node.js built-in
      const memoryUsage = process.memoryUsage().rss / 1024 / 1024;
      
      logMessage(`Memory check: ${memoryUsage.toFixed(2)}MB / ${MEMORY_LIMIT}MB`);
      
      if (memoryUsage > MEMORY_LIMIT) {
        logMessage(`⚠️ Memory usage exceeded ${MEMORY_LIMIT}MB. Current: ${memoryUsage.toFixed(2)}MB. Restarting...`);
        p.kill();
      }
    } catch (error) {
      logMessage(`Memory check failed: ${error.message}`);
    }
  }, MEMORY_CHECK_INTERVAL);

  p.on('exit', (code) => {
    clearInterval(memoryCheckInterval);
    logMessage(`Bot process exited with code: ${code}`);

    if (code !== 0) {
      logMessage(`Restarting in ${RESTART_DELAY/1000} seconds...`);
      setTimeout(start, RESTART_DELAY);
    } else {
      logMessage('Bot stopped normally. Exiting...');
      errorLogStream.end();
      process.exit(0);
    }
  });

  const handleShutdown = (signal) => {
    logMessage(`Shutting down Jexploit due to ${signal}...`);
    clearInterval(memoryCheckInterval);
    p.kill();
    errorLogStream.end();
    process.exit(0);
  };

  process.on('SIGINT', handleShutdown);
  process.on('SIGTERM', handleShutdown);
  
  logMessage('Bot started successfully!');
}

// Start the bot
start();