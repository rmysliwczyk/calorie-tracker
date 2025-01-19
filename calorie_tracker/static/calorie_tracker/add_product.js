async function addProduct(product) {
    try {
        let url = `api/products`;
        const response = await fetch(url, {
            "headers": {"Content-Type": "application/json", "X-CSRFToken": csrftoken},
            "method": "POST",
            "body": JSON.stringify(product)
        });
        if(!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const responseJSON = await response.json();
        return responseJSON;
    }
    catch(error) {
        console.log(error.message);
    }
}

document.querySelector("#add-product").addEventListener("submit", async function(event){
    event.preventDefault();
    const product = {
        name: document.querySelector("#name").value,
        calories: document.querySelector("#calories").value, 
        fats: document.querySelector("#fats").value,
        carbs: document.querySelector("#carbs").value,
        proteins: document.querySelector("#proteins").value,
        portion_size: document.querySelector("#portion-size").value,
        barcode: document.querySelector("#barcode").value
    }
    
    response = await addProduct(product);
    if(response == null)
    {
        alert("Couldn't add the product. Please check the form data");
    }
});
