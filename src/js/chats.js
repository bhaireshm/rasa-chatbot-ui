const CHAT = {
    userId: localStorage.getItem('user_unique_id') ? localStorage.getItem('user_unique_id') : '',
    messages: [{}],
}
const botResponse = (data) => {
    let bubble = '';

    if (data.hasOwnProperty("text")) {
        bubble = `${data.text}<div class="corner"></div>`;
    }

    //check if the response contains "images"
    if (data.hasOwnProperty("image")) {
        bubble = `<img src="${data.image}" alt="image" class="img-fluid w-75 respImage"><div class="corner"></div>`;
    }

    //check if the response contains "buttons" 
    if (data.hasOwnProperty("buttons")) {
        addSuggestion(data.buttons);
    }

    //check if the response contains "attachment" 
    if (data.hasOwnProperty("attachment")) {
        //check if the attachment type is "video"
        if (data.attachment.type == "video") {
            video_url = data.attachment.payload.src;
            bubble = '<div class="video-container"> <iframe src="' + video_url + '" frameborder="0" allowfullscreen></iframe> </div>'
        }
    }

    //check if the response contains "custom" message  
    if (data.hasOwnProperty("custom")) {
        //check if the custom payload type is "quickReplies"
        if (data.custom.payload == "quickReplies") {
            quickRepliesData = data.custom.data;
            showQuickReplies(quickRepliesData);
            return;
        }

        //check if the custom payload type is "pdf_attachment"
        if (data.custom.payload == "pdf_attachment") {
            renderPdfAttachment(data);
            return;
        }

        //check if the custom payload type is "dropDown"
        if (data.custom.payload == "dropDown") {
            dropDownData = data.custom.data;
            renderDropDwon(dropDownData);
            return;
        }

        //check if the custom payload type is "cardsCarousel"
        if (data.custom.payload == "cardsCarousel") {
            restaurantsData = (data.custom.data)
            showCardsCarousel(restaurantsData);
            return;
        }
    }

    return `<div class="message">
                <img src="./img/bot.svg" />
                <div class="bubble">
                    ${bubble}
                </div>
            </div>`;
    // <span>${data.timestamp}</span>
};

const randomStr = (length = 16) => {
    var res = '';
    var characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        res += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    console.log(res);
    return res;
}

const scrollDown = () => {
    var objDiv = document.getElementById("chat-messages");
    objDiv.scrollTop = objDiv.scrollHeight;
}

const clearMessageBox = () => {
    $('#messageBox').val('');
    $('#messageBox').blur();
}

const renderMessages = (data = []) => {
    console.log(data)
    setTimeout(function () {
        hideBotTyping();

        // if (data.length < 1) {
        // } 
        // else if (data.length > 1) {
        // $('#chat-messages').children('.message').remove();
        data.forEach(d => {
            let msg = botResponse(d);
            $('#chat-messages').append(msg).fadeIn(1000);
        });

        scrollDown();
        // }
    }, 500);
}

const renderHistory = (data = []) => {
    if (data.length > 0) {
        data.forEach(d => {
            let html = `<div class="message ${d.event == 'user' ? 'right' : ''}">
            <img src="./img/${d.event == 'bot' ? 'bot.svg': '2_copy.jpg'}" />
            <div class="bubble">${d.text}<div class="corner"></div></div>
            </div>`;
            $('#chat-messages').append(html).show("slow");
        });
        clearMessageBox();
        scrollDown();
    }
}

//=============== Set user response ===================
const setUserResponse = (msg) => {
    var UserResponse = `<div class="message right">
                            <img src="./img/2_copy.jpg" />
                            <div class="bubble">
                                ${msg}<div class="corner"></div>
                            </div>
                        </div>`;
    // <span>1 min</span>
    $('#chat-messages').append(UserResponse).show("slow");
    clearMessageBox();
    scrollDown();
}

function renderPdfAttachment(data) {
    pdf_url = data.custom.url;
    pdf_title = data.custom.title;
    pdf_attachment =
        '<div class="pdf_attachment">' +
        '<div class="row">' +
        '<div class="col s3 pdf_icon"><i class="fa fa-file-pdf-o" aria-hidden="true"></i></div>' +
        '<div class="col s9 pdf_link">' +
        '<a href="' + pdf_url + '" target="_blank">' + pdf_title + ' </a>' +
        '</div>' +
        '</div>' +
        '</div>'
    $(".chats").append(pdf_attachment);
    scrollDown();
}

function showBotTyping() {
    var botTyping = `
                <div class="message" id="botTyping">
                    <img src="./img/bot.svg" />
                    <div class="chat-bubble bubble">
                        <div class="typing">
                            <div class="dot"></div>
                            <div class="dot"></div>
                            <div class="dot"></div>
                        </div>
                    </div>
                </div>`
    $(botTyping).appendTo("#chat-messages");
    scrollDown();
}

function hideBotTyping() {
    $('#botTyping').remove();
}

// //============== Cards Carousel ================
// function showCardsCarousel(cardsToAdd) {
//     var cards = createCardsCarousel(cardsToAdd);

//     $(cards).appendTo(".chats").show();


//     if (cardsToAdd.length <= 2) {
//         $(".cards_scroller>div.carousel_cards:nth-of-type(" + i + ")").fadeIn(3000);
//     } else {
//         for (var i = 0; i < cardsToAdd.length; i++) {
//             $(".cards_scroller>div.carousel_cards:nth-of-type(" + i + ")").fadeIn(3000);
//         }
//         $(".cards .arrow.prev").fadeIn("3000");
//         $(".cards .arrow.next").fadeIn("3000");
//     }


//     scrollDown();

//     const card = document.querySelector("#paginated_cards");
//     const card_scroller = card.querySelector(".cards_scroller");
//     var card_item_size = 225;

//     card.querySelector(".arrow.next").addEventListener("click", scrollToNextPage);
//     card.querySelector(".arrow.prev").addEventListener("click", scrollToPrevPage);


//     // For paginated scrolling, simply scroll the card one item in the given
//     // direction and let css scroll snaping handle the specific alignment.
//     function scrollToNextPage() {
//         card_scroller.scrollBy(card_item_size, 0);
//     }

//     function scrollToPrevPage() {
//         card_scroller.scrollBy(-card_item_size, 0);
//     }

// }

// function createCardsCarousel(cardsData) {

//     var cards = "";

//     for (i = 0; i < cardsData.length; i++) {
//         title = cardsData[i].name;
//         ratings = Math.round((cardsData[i].ratings / 5) * 100) + "%";
//         data = cardsData[i];
//         item = '<div class="carousel_cards in-left">' + '<img class="cardBackgroundImage" src="' + cardsData[i].image + '"><div class="cardFooter">' + '<span class="cardTitle" title="' + title + '">' + title + "</span> " + '<div class="cardDescription">' + '<div class="stars-outer">' + '<div class="stars-inner" style="width:' + ratings + '" ></div>' + "</div>" + "</div>" + "</div>" + "</div>";

//         cards += item;
//     }

//     var cardContents = '<div id="paginated_cards" class="cards"> <div class="cards_scroller">' + cards + '  <span class="arrow prev fa fa-chevron-circle-left "></span> <span class="arrow next fa fa-chevron-circle-right" ></span> </div> </div>';

//     return cardContents;
// }

// //=================== Quick Replies =====================
// function showQuickReplies(quickRepliesData) {
//     var chips = ""
//     for (i = 0; i < quickRepliesData.length; i++) {
//         var chip = '<div class="chip" data-payload=\'' + (quickRepliesData[i].payload) + '\'>' + quickRepliesData[i].title + '</div>'
//         chips += (chip)
//     }

//     var quickReplies = '<div class="quickReplies">' + chips + '</div><div class="clearfix"></div>'
//     $(quickReplies).appendTo(".chats").fadeIn(1000);
//     scrollDown();
//     const slider = document.querySelector('.quickReplies');
//     let isDown = false;
//     let startX;
//     let scrollLeft;

//     slider.addEventListener('mousedown', (e) => {
//         isDown = true;
//         slider.classList.add('active');
//         startX = e.pageX - slider.offsetLeft;
//         scrollLeft = slider.scrollLeft;
//     });
//     slider.addEventListener('mouseleave', () => {
//         isDown = false;
//         slider.classList.remove('active');
//     });
//     slider.addEventListener('mouseup', () => {
//         isDown = false;
//         slider.classList.remove('active');
//     });
//     slider.addEventListener('mousemove', (e) => {
//         if (!isDown) return;
//         e.preventDefault();
//         const x = e.pageX - slider.offsetLeft;
//         const walk = (x - startX) * 3; //scroll-fast
//         slider.scrollLeft = scrollLeft - walk;
//     });

// }

// // on click of quickreplies, get the value and send to rasa
// $(document).on("click", ".quickReplies .chip", function () {
//     var text = this.innerText;
//     var payload = this.getAttribute('data-payload');
//     console.log("chip payload: ", this.getAttribute('data-payload'))
//     setUserResponse(text);
//     send(payload);

//     //delete the quickreplies
//     $(".quickReplies").remove();

// });

// //============== Suggestions ================
// function addSuggestion(textToAdd) {
//     setTimeout(function () {
//         var suggestions = textToAdd;
//         var suggLength = textToAdd.length;
//         $(' <div class="singleCard"> <div class="suggestions"><div class="menu"></div></div></diV>').appendTo(".chats").hide().fadeIn(1000);
//         // Loop through suggestions
//         for (i = 0; i < suggLength; i++) {
//             $('<div class="menuChips" data-payload=\'' + (suggestions[i].payload) + '\'>' + suggestions[i].title + "</div>").appendTo(".menu");
//         }
//         scrollDown();
//     }, 1000);
// }

// on click of suggestions, get the value and send to rasa
$(document).on("click", ".menu .menuChips", function () {
    var text = this.innerText;
    var payload = this.getAttribute('data-payload');
    console.log("payload: ", this.getAttribute('data-payload'))
    setUserResponse(text);
    send(payload);

    //delete the suggestions once user click on it
    $(".suggestions").remove();

});

export {
    CHAT,
    randomStr,
    scrollDown,
    clearMessageBox,
    renderMessages,
    renderHistory,
    setUserResponse,
    showBotTyping,
    hideBotTyping
}