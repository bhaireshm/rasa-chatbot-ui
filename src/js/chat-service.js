'use strict';

import {
    renderMessages,
    renderHistory,
    showBotTyping,
    hideBotTyping
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
                    res.forEach(r => {
                        r['event'] = 'bot';
                        r['timestamp'] = new Date().getTime();
                        this.messages.push(r);
                    });
                    renderMessages(this.messages);
                    $('#sendBtn').prop('disabled', true);
                },
                error: (err) => {
                    console.log(err);
                    hideBotTyping();
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
                        // console.log(this.messages);
                    }
                },
                error: (err) => {
                    console.log(err);
                }
            });
        } else {
            $('.welcome-message').removeClass('d-none').addClass('d-block');
        }
    };

    restartChat = () => {
        if (this._userId) {
            localStorage.getItem('user_unique_id') ? localStorage.removeItem('user_unique_id') : null;
            $('#chat-messages').children('.message').remove();
            console.info('User Data cleared');
        } else {
            $('.welcome-message').removeClass('d-none').addClass('d-block');
        }
    }
}