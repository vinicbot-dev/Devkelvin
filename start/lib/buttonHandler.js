/*Kelvin Tech*/

class ButtonHandler {
    constructor(conn) {
        this.conn = conn;
        this.pending = new Map();
        this.setupListener();
    }

    setupListener() {
        this.conn.ev.on('messages.upsert', async (msgUpdate) => {
            try {
                const msg = msgUpdate.messages[0];
                if (!msg.message) return;

                let selectedId = null;
                let responseType = null;

                // Kango-wa uses templateButtonReplyMessage
                if (msg.message.templateButtonReplyMessage) {
                    selectedId = msg.message.templateButtonReplyMessage.selectedId;
                    responseType = 'kango';
                }
                // Gifted-btns uses buttonsResponseMessage
                else if (msg.message.buttonsResponseMessage) {
                    selectedId = msg.message.buttonsResponseMessage.selectedButtonId;
                    responseType = 'gifted';
                }

                if (selectedId && this.pending.has(selectedId)) {
                    const { callback } = this.pending.get(selectedId);
                    await callback(msg, selectedId, responseType);
                    this.pending.delete(selectedId);
                }
            } catch (err) {
                console.error('Button handler error:', err);
            }
        });
    }

    async send(chatId, options, quotedMsg, callback) {
        const { title, text, footer, buttons } = options;
        const timestamp = Date.now().toString();
        
        const processedButtons = buttons.map((btn, i) => ({
            ...btn,
            id: btn.id || `${timestamp}_${i}`
        }));

        // Separate buttons by type
        const replyButtons = processedButtons.filter(btn => !btn.url && !btn.copy);
        const urlButtons = processedButtons.filter(btn => btn.url);
        const copyButtons = processedButtons.filter(btn => btn.copy);

        // Store callbacks for reply buttons only
        for (const btn of replyButtons) {
            if (btn.id) {
                this.pending.set(btn.id, { callback });
                setTimeout(() => this.pending.delete(btn.id), 120000);
            }
        }

        // If there are reply buttons, use kango-wa
        if (replyButtons.length > 0) {
            try {
                const { sendButtons } = require('kango-wa');
                await sendButtons(this.conn, chatId, {
                    title: title || '',
                    text: text,
                    footer: footer || '',
                    buttons: replyButtons.map(btn => ({
                        id: btn.id,
                        text: btn.text
                    }))
                }, { quoted: quotedMsg });
                return;
            } catch (e) {
                console.log('Kango-wa failed:', e.message);
            }
        }

        // If there are URL or copy buttons, use gifted-btns
        if (urlButtons.length > 0 || copyButtons.length > 0) {
            try {
                const { sendButtons } = require('gifted-btns');
                
                const giftedButtons = [];
                
                // Add URL buttons
                for (const btn of urlButtons) {
                    giftedButtons.push({
                        name: 'cta_url',
                        buttonParamsJson: JSON.stringify({
                            display_text: btn.text,
                            url: btn.url
                        })
                    });
                }
                
                // copy button 
                for (const btn of copyButtons) {
                    giftedButtons.push({
                        name: 'cta_copy',
                        buttonParamsJson: JSON.stringify({
                            display_text: btn.text,
                            copy_code: btn.copy
                        })
                    });
                }
                
                await sendButtons(this.conn, chatId, {
                    title: title || '',
                    text: text,
                    footer: footer || '',
                    buttons: giftedButtons
                }, { quoted: quotedMsg });
                return;
            } catch (e) {
                console.log('Gifted-btns failed:', e.message);
            }
        }

        // Final fallback: send as normal text
        let fallbackText = `${text}\n\n`;
        for (const btn of processedButtons) {
            if (btn.url) {
                fallbackText += `• ${btn.text}: ${btn.url}\n`;
            } else if (btn.copy) {
                fallbackText += `• ${btn.text}: ${btn.copy}\n`;
            } else {
                fallbackText += `• Reply with "${btn.id}" for ${btn.text}\n`;
            }
        }
        await this.conn.sendMessage(chatId, { text: fallbackText }, { quoted: quotedMsg });
    }
}

module.exports = { ButtonHandler };