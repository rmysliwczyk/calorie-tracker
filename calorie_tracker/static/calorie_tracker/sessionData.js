let date;
let barcode;

document.addEventListener("DOMContentLoaded", function() {
    date = new Date(Date.now()).toISOString().split("T")[0];

	window.sessionStorage.setItem("selected_date", date);

	window.addEventListener("popstate", function(event) {
		if(event.state) {
			if(event.state.action === "showMeals") {
				showMeals();
			}
			else if(event.state.action === "editMealForm") {
				showEditMealForm(event.state.mealId);
			}
			else if(event.state.action === "addMealForm") {
				showAddMealForm(event.state.productId, event.state.mealtimeId);
			}
			else if(event.state.action === "showAddMealProductSelection")
			{
				showAddMealProductSelection(event.state.mealtimeId);
			}
			else if(event.state.action === "editProductForm") {
				showEditProductForm(event.state.productId, event.state.receivedBarcode);
			}
			else if(event.state.action === "addProductForm") {
				showAddProductForm(event.state.receivedBarcode);
			}
			else if(event.state.action === "showProducts") {
				if(document.querySelector("#products-div") === null) {
					document.querySelector("#meals-div").innerHTML = `<div id="products-div"></div>`;

				}
				showProducts(event.state.name, event.state.receivedBarcode);
			}
		}
	});
});
