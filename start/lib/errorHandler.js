/**
 * errorHandler.js
 * Last-resort safety net for uncaught errors.
 *
 * kevin.js already wraps individual commands and the whole switch
 * statement in try/catch, and index.js wraps its require("./start/kevin")
 * call in its own catch too - so a normal thrown error already can't
 * crash the bot. This catches whatever slips past all of that (a stray
 * unhandled promise rejection, an error thrown from a timer or event
 * callback that isn't inside any try block) so even that can't take
 * the process down.
 *
 * Call installGlobalGuards() once, near the top of index.js.
 */
function installGlobalGuards() {
    process.on('uncaughtException', (err) => {
        console.error('[UNCAUGHT EXCEPTION]', err);
    });

    process.on('unhandledRejection', (reason) => {
        console.error('[UNHANDLED REJECTION]', reason);
    });
}

module.exports = { installGlobalGuards };
