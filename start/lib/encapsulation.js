/*Kelvin Tech*/

const fs = require('fs');
const path = require('path');
const axios = require('axios');

async function obfuscateJS(inputFile) {
    try {
        // Read the JS file
        const code = fs.readFileSync(inputFile, 'utf8');
        
        if (!code || code.trim().length === 0) {
            throw new Error('JavaScript code cannot be empty');
        }

        // Prepare payload for PreEmptive API
        const payload = {
            sourceFile: {
                name: path.basename(inputFile),
                source: code
            },
            protectionConfiguration: {
                settings: {
                    booleanLiterals: { randomize: true },
                    integerLiterals: { radix: "none", randomize: true, lower: null, upper: null },
                    debuggerRemoval: true,
                    stringLiterals: true,
                    propertyIndirection: true,
                    localDeclarations: { nameMangling: "base52" },
                    controlFlow: { randomize: true },
                    constantArgument: true,
                    domainLock: false,
                    functionReorder: { randomize: true },
                    propertySparsing: true,
                    variableGrouping: true
                }
            }
        };

        // Call obfuscation API
        const response = await axios.post(
            'https://jsd-online-demo.preemptive.com/api/protect',
            payload,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Origin': 'https://jsd-online-demo.preemptive.com',
                    'Referer': 'https://jsd-online-demo.preemptive.com/',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'application/json, text/plain, */*'
                },
                timeout: 30000
            }
        );

        if (!response.data || !response.data.protectedCode) {
            throw new Error('Invalid response from obfuscation service');
        }

        // Save obfuscated code to temp file
        const outputFile = inputFile.replace('original', 'obfuscated');
        fs.writeFileSync(outputFile, response.data.protectedCode);
        
        return outputFile;

    } catch (error) {
        console.error('Obfuscation error:', error.message);
        throw new Error(error.response?.data?.message || error.message || 'Failed to obfuscate code');
    }
}

module.exports = { obfuscateJS };