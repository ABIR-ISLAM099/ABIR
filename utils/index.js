const axios = require("axios");
const config = require("../config.json");

async function sendMessage(sender_psid, message) {
    try {
        const response = await axios.post(
            `https://graph.facebook.com/v21.0/me/messages`,
            {
            recipient: { id: sender_psid },
                messaging_type: "RESPONSE",
                message: typeof message === "string" ? { text: message } : message,
            },
            {
    params: { access_token: config.Token },
headers: { "Content-Type": "application/json" },
            },
        );
        return response.data;
    } catch (error) {
        console.error(
            "Error sending message:",
            error.response ? error.response.data : error.message,
        );
        return null;
    }
}

async function reply(sender_psid, message) {
    if (typeof message === "string") {
        const data = await sendMessage(sender_psid, { text: message });
        return data;
    } else if (typeof message === "object" && message.attachment) {
        const data = await sendMessage(sender_psid, {
            attachment: {
                type: message.attachment.type,
                payload: {
                    url: message.attachment.url,
                    is_reusable: true,
                },
            },
        });
        return data;
    } else {
        console.error("Invalid message format for reply");
        return null;
    }
}

async function buttonMessage(sender_psid, text, buttons) {
    const buttonPayload = buttons.map((btn, index) => ({
        type: "postback",
        title: btn.label,
        payload: btn.payload || `BUTTON_PAYLOAD_${index + 1}`,
    }));

    try {
        const data = await sendMessage(sender_psid, {
            attachment: {
                type: "template",
                payload: {
                    template_type: "button",
                    text: text,
                    buttons: buttonPayload,
                },
            },
        });
        return data;
    } catch (error) {
        console.error(
            "Error sending button message:",
            error.response ? error.response.data : error.message,
        );
        return null;
    }
}

async function unsend(message_id) {
    try {
        const response = await axios.delete(
            `https://graph.facebook.com/v21.0/${message_id}`,
            {
                params: {
                    access_token: config.Token,
                },
            },
        );
        console.log("Message unsent successfully.");
        return response.data;
    } catch (error) {
        console.error(
            "Error unsending message:",
            error.response ? error.response.data : error.message,
        );
        return null;
    }
}

async function edit(message_id, new_text) {
    try {
        const data = await axios.post(
            `https://graph.facebook.com/v21.0/message_edits`,
            {
                recipient: { id: message_id },

                message: { text: new_text },
            },
            {
                params: { access_token: config.Token },
                headers: { "Content-Type": "application/json" },
            },
        );
        return data;
    } catch (error) {
        console.error(
            "Error editing message:",
            error.response ? error.response.data : error.message,
        );
        return null;
    }
}

async function react(sender_psid, emoji) {
    // Maybe possible but not sure 🐸🐸 in docs not available 😕
}

module.exports = { reply, buttonMessage, unsend, edit, react };
