"use strict";
let start = document.querySelector(".settings__start");
let settings = document.querySelector(".settings");
let buttonsDiff = document.querySelectorAll(".settings__difficulty button");

// difficulties to choose
let easy = document.querySelector(".settings__easy");
let medium = document.querySelector(".settings__medium");
let nightmare = document.querySelector(".settings__nightmare");


canvas.classList.add("visually-hidden");
playing = false;
// reset selected difficult or size button
let resetSelected = function (buttons) {
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("selected");
    }
}

// hide setup popup and start snake game
start.addEventListener('click', function () {
    settings.classList.add("visually-hidden");
    canvas.classList.remove("visually-hidden");
    gameReturn();
});

// difficult buttons clickhandlers
easy.addEventListener('click', function () {
    resetSelected(buttonsDiff);
    easy.classList.add("selected");
    botSpeed = 3;
});
medium.addEventListener('click', function () {
    resetSelected(buttonsDiff);
    medium.classList.add("selected");
    botSpeed = 4;
});
nightmare.addEventListener('click', function () {
    resetSelected(buttonsDiff);
    nightmare.classList.add("selected");
    botSpeed = 6;
});

