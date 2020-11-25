export class CHATBOT_SERVICE {
    userId = "";
    messages = [];

    setUserId = (usrid) => {
        this.userId = usrid;
    }

    sendMessage = (msg) => {
        if (msg != '') {
            $.ajax({
                url: "http://localhost:5005/webhooks/rest/webhook",
                method: "POST",
                data: {
                    "sender": this.userId,
                    "message": msg
                },
                success: (res) => {
                    console.log(res);
                    this.messages.push(res);
                },
                error: (err) => {
                    console.log(err);
                }
            });
        }
    }
}