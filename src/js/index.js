"use strict";

import {
  CHATBOT_SERVICE
} from "./chat-service.js";
import {
  randomStr,
  setUserResponse
} from "./chats.js";

var chat = new CHATBOT_SERVICE();
if (localStorage.getItem('user_unique_id')) {
  chat.setUserId(localStorage.getItem('user_unique_id'));
  console.log(localStorage.getItem('user_unique_id'))
} else {
  // setInterval(() => {
  let id = randomStr();
  chat.setUserId(id);
  localStorage.setItem('user_unique_id', id);
  // }, 3000);
}

$(() => {
  chat.fetchUserMessagesHistory();

  // $('.welcome-message').removeClass('d-none').addClass('d-block');
  $(".chatbox-open").click();
});

$(".chatbox-open").click(() => {
  $(".chatbox-popup, .chatbox-close").fadeIn();
  $('#chatview').fadeIn();
});

$(".chatbox-close").click(() =>
  $(".chatbox-popup, .chatbox-close").fadeOut()
);

// $(".chatbox-maximize").click(() => {
//   $(".chatbox-popup, .chatbox-open, .chatbox-close").fadeOut();
//   $(".chatbox-panel").fadeIn();
//   $(".chatbox-panel").css({
//     display: "flex"
//   });
// });
// $(".chatbox-minimize").click(() => {
//   $(".chatbox-panel").fadeOut();
//   $(".chatbox-popup, .chatbox-open, .chatbox-close").fadeIn();
// });
// $(".chatbox-panel-close").click(() => {
//   $(".chatbox-panel").fadeOut();
//   $(".chatbox-open").fadeIn();
// });

$('#sendBtn').on('click', (e) => {
  $('#sendBtn').prop('disabled', true);
  let msg = $('#messageBox').val();
  if (msg == "" || msg.trim() == "") {
    e.preventDefault();
    return false;
  } else {
    setUserResponse(msg);
    chat.sendMessage(msg);
  }
});

$('#messageBox').on('keyup keypress', (e) => {
  if (e.keyCode == 13) {
    $('#sendBtn').prop('disabled', true);
    let msg = $('#messageBox').val();
    if (msg == "" || msg.trim() == "") {
      e.preventDefault();
      return false;
    } else {
      setUserResponse(msg);
      chat.sendMessage(msg);
    }
  }
  if (e.ctrlKey && e.keyCode == 13) {
    // next line
  }
});

$('.restart-chat').on('click', (e) => {
  chat.restartChat();
});
// renderMessages(messages);