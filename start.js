/*Kelvin Tech*/

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const moment = require('moment-timezone');

const RESTART_DELAY = 3000; // ms
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
    env: {
      ...process.env,
    }
  });

  p.stderr.on('data', (data) => {
    const errorMsg = `[${moment().tz(TIMEZONE).format('HH:mm z')}] ${data.toString()}`;
    console.error(errorMsg);
    errorLogStream.write(errorMsg);
  });

  p.on('exit', (code) => {
    logMessage(`Bot process exited with code: ${code}`);

    if (code !== 0 && code !== null) {
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