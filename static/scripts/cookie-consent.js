document.addEventListener("DOMContentLoaded", function () {
    const banner = document.getElementById("cookie-banner");
    const acceptButton = document.getElementById("cookie-accept");
    const rejectButton = document.getElementById("cookie-reject");

    if (!banner || !acceptButton || !rejectButton) {
        return;
    }

    if (!localStorage.getItem("cookieConsent")) {
        banner.style.display = "flex";
    }

    acceptButton.addEventListener("click", function () {
        localStorage.setItem("cookieConsent", "accepted");
        banner.style.display = "none";
    });

    rejectButton.addEventListener("click", function () {
        localStorage.setItem("cookieConsent", "rejected");
        banner.style.display = "none";
    });
});