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
  try {
    fs.appendFileSync(path.join(__dirname, 'tmp', getLogFileName()), `[${timestamp}] ${message}\n`);
  } catch {}
}

function start() {
  process.env.NODE_OPTIONS = '--no-deprecation';

  // index.js is the bot (there is no boot.js in this project)
  const args = [path.join(__dirname, 'index.js'), ...process.argv.slice(2)];

  logMessage('Starting Jexploit Bot...');

  const logFilePath = path.join(__dirname, 'tmp', getLogFileName());
  const errorLogStream = fs.createWriteStream(logFilePath, { flags: 'a' });
  errorLogStream.on('error', () => {});

  let restarted = false;
  const restart = (why) => {
    if (restarted) return; // 'error' and 'exit' can both fire
    restarted = true;
    logMessage(why);
    errorLogStream.end();
    logMessage(`Restarting in ${RESTART_DELAY / 1000} seconds...`);
    setTimeout(start, RESTART_DELAY);
  };

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

  p.on('error', (err) => restart(`Could not run the bot: ${err.message}`));

  // Any exit (crash, normal exit, killed) -> start the bot again. Never stops.
  p.on('exit', (code, signal) => restart(`Bot process exited with code: ${code}${signal ? ` (${signal})` : ''}`));

  logMessage('Bot started successfully!');
}

// Never let this supervisor die from a stray error
process.on('uncaughtException', (err) => console.error('[JEXPLOIT] uncaught:', err && err.stack || err));
process.on('unhandledRejection', (err) => console.error('[JEXPLOIT] unhandled:', err && err.stack || err));

// Start the bot
start();
