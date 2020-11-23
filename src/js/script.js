"use strict";

import {
  CHATBOT
} from "./chat-service.js";
import {
  CHAT,
  MESSAGES
} from "./chats.js";

$(() => {
  $(".chatbox-open").click(() => {
    $(".chatbox-popup, .chatbox-close").fadeIn();
    $('#chatview').fadeIn();
  });

  $(".chatbox-close").click(() =>
    $(".chatbox-popup, .chatbox-close").fadeOut()
  );

  $(".chatbox-maximize").click(() => {
    $(".chatbox-popup, .chatbox-open, .chatbox-close").fadeOut();
    $(".chatbox-panel").fadeIn();
    $(".chatbox-panel").css({
      display: "flex"
    });
  });

  $(".chatbox-minimize").click(() => {
    $(".chatbox-panel").fadeOut();
    $(".chatbox-popup, .chatbox-open, .chatbox-close").fadeIn();
  });

  $(".chatbox-panel-close").click(() => {
    $(".chatbox-panel").fadeOut();
    $(".chatbox-open").fadeIn();
  });

  $('#sendBtn').on('click', function () {
    let msg = $('#messageBox').val();
    console.log(msg);
    sendMessage(msg);
  });

  renderMessages(MESSAGES);
  $(".chatbox-open").click();
  scroll();
});


function sendMessage(msg) {
  let message = `<div class="message right">
                  <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/245657/2_copy.jpg" />
                  <div class="bubble">
                    ${msg}
                    <div class="corner"></div>
                    <span>1 min</span>
                  </div>
                </div>`;
  $('#chat-messages').append(message);

  //api call

  clearMessageBox();
  scroll();
}

function scroll() {
  var objDiv = document.getElementById("chat-messages");
  objDiv.scrollTop = objDiv.scrollHeight;
}

function clearMessageBox() {
  $('#messageBox').val(null);
}

function renderMessages(data = []) {
  if (data.length > 0) {
    data.forEach(d => {
      let msg = CHAT.messageTemplate(d);
      $('#chat-messages').append(msg);
    });
  }
}