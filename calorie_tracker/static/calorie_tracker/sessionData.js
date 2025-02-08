let date;
let barcode;

document.addEventListener("DOMContentLoaded", function() {
    date = new Date(Date.now()).toISOString().split("T")[0];

	window.sessionStorage.setItem("selected_date", date);
});
