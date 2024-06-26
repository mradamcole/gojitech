// Display the loading screen, and then have it scroll up and away
let intro = document.querySelector(".intro");
let logo = document.querySelector(".logo-header");
let logoSpan = document.querySelectorAll(".logo");

window.addEventListener("DOMContentLoaded", () => {
    let introPause = 2300;    //2300 for normal, 23 for debugging
    setTimeout(() => {
        logoSpan.forEach((span, idx) => {
            setTimeout(() => {
                span.classList.add("active");
            }, (idx + 1) * 400);
        });

        setTimeout(() => {
            logoSpan.forEach((span, idx) => {
                setTimeout(() => {
                    span.classList.remove("active");
                    span.classList.add("fading");
                }, (idx + 1) * 100);
            });
        }, 2000);

        setTimeout(() => {
            intro.style.top = "-100vh";
        }, introPause);
    });
});
