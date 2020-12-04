'use strict';

import {
    renderMessages,
    renderHistory,
    showBotTyping,
    hideBotTyping,
    hideWelcomeMessage,
    showWelcomeMessage,
    removeChats,
    fallbackMessage
} from "./chats.js";

export class CHATBOT_SERVICE {
    _userId = "";
    action_name = "action_greet_user";
    messages = [];
    origin = 'http://localhost:5005';

    setUserId = (usrid) => {
        this._userId = usrid;
    };

    sendMessage = (msg) => {
        if (msg != '') {
            let payload = {
                "sender": this._userId,
                "message": msg
            };
            console.log(payload);
            $.ajax({
                url: "http://127.0.0.1:5005/webhooks/rest/webhook",
                method: "POST",
                data: JSON.stringify(payload),
                contentType: "application/json",
                beforeSend: () => {
                    showBotTyping();
                },
                success: (res) => {
                    console.log(res);
                    this.messages = [];

                    // if user wants to restart the chat and clear the existing chat contents
                    if (msg.toLowerCase() == '/restart') {
                        removeChats();
                        showWelcomeMessage();
                        // fallbackMessage('Chat restarted');
                        console.info('User Data cleared');

                        //if you want the bot to start the conversation after restart
                        // action_trigger();
                        return;
                    } else {
                        res.forEach(r => {
                            r['event'] = 'bot';
                            r['timestamp'] = new Date().getTime();
                            this.messages.push(r);
                        });
                        renderMessages(this.messages);
                        $('#sendBtn').prop('disabled', true);
                    }
                },
                error: (xhr, textStatus, errorThrown) => {
                    hideBotTyping();
                    if (msg.toLowerCase() == '/restart') {
                        //if you want the bot to start the conversation after the restart action.
                        // action_trigger();
                        // return;
                    }
                    // if there is no response from rasa server
                    // setBotResponse("");
                    console.log("Error from bot end: ", textStatus);
                }
            });
        }
    };

    fetchUserMessagesHistory = () => {
        if (this._userId) {
            $.ajax({
                url: `${this.origin}/conversations/${this._userId}/tracker`,
                method: 'GET',
                success: (res) => {
                    console.log(res);
                    if (res && res.events.length > 0) {
                        this.messages = [];
                        res.events.forEach(msg => {
                            if (msg.event == "user" || msg.event == "bot") {
                                this.messages.push(msg);
                            }
                        });
                        renderHistory(this.messages);
                        console.log(this.messages);
                        this.messages.length > 0 ? hideWelcomeMessage() : showWelcomeMessage();
                    }
                },
                error: (err) => {
                    console.log(err);
                }
            });
        } else {
            showWelcomeMessage();
        }
    };

    restartChat = () => {
        if (this._userId) {
            this.sendMessage('/restart');
            // $.ajax({
            //     url: `${this.origin}/conversations/${this._userId}/tracker/events`,
            //     method: 'POST',
            //     data: {
            //         "event": "restart"
            //     },
            //     success: (res) => {
            //         console.log(res);
            //         this.messages = [];
            //         $('#chat-messages').children('.message').remove();
            //         showWelcomeMessage();
            //         console.info('User Data cleared');
            //         if (res && res.events.length > 0) {}
            //     },
            //     error: (err) => {
            //         console.log(err);
            //     }
            // });
        }
    };
}