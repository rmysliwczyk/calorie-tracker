let date;
let barcode;

document.addEventListener("DOMContentLoaded", function() {
    date = new Date(Date.now()).toISOString().split("T")[0];

    if(window.sessionStorage.getItem("selected_date") !== null)
    {
        date = window.sessionStorage.getItem("selected_date");
    }
	else
	{
		window.sessionStorage.setItem("selected_date", date);
	}
});
