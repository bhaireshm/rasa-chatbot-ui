export const CHAT = {
    messages: [{}],
    messageTemplate: function (data, position = "") {
        return `<div class="message ${data.position}">
                    <img src="./img/${data.position == 'right' ? '1': '2'}_copy.jpg" />
                    <div class="bubble">
                    ${data.msg}
                    <div class="corner"></div>
                    <span>${data.time}</span>
                    </div>
                </div>`;
    }
}

export const MESSAGES = [{
        msg: "hi",
        time: new Date().getHours(),
        position: 'left'
    },
    {
        msg: "hello",
        time: new Date().getHours(),
        position: 'right'
    },
    {
        msg: "how may i help you",
        time: new Date().getHours(),
        position: 'left'
    },
    {
        msg: "tell me the upcoming events",
        time: new Date().getHours(),
        position: 'right'
    }
];