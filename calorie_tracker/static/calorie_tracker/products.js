async function getProducts(name="", barcode="") {
    try {
        let url = `api/products/?name__contains=${name}&barcode__contains=${barcode}`;
        const response = await fetch(url, {
            method: "get",
            credentials: "same-origin",
            headers: {
                "X-CSRFToken": csrftoken,
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });
        if(!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const products = await response.json();
        return products;
    }
    catch(error) {
        console.log(error.message)
    }
}

async function getProduct(productId) {
    try {
        let url = `api/products/${productId}`;
        const response = await fetch(url);
        if(!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const product = await response.json();
        return product;
    }
    catch(error) {
        console.log(error.message)
    }
}

async function addProduct(product) {
    try {
        let url = `api/products/`;
        const response = await fetch(url, {
            method: "post",
            credentials: "same-origin",
            headers: {
                "X-CSRFToken": csrftoken,
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(product)
        });
        if(!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const productReceived = await response.json();
        return productReceived;
    }
    catch(error) {
        console.log(error.message)
    }
}

async function updateProduct(product) {
    try {
        let url = `api/products/${product.id}/`;
        const response = await fetch(url, {
            method: "patch",
            credentials: "same-origin",
            headers: {
                "X-CSRFToken": csrftoken,
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(product)
        });
        if(!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const productReceived = await response.json();
        return productReceived;
    }
    catch(error) {
        console.log(error.message)
    }
}

async function deleteProduct(productId) {
    try {
        let url = `api/products/${productId}/`;
        const response = await fetch(url, {
            method: "delete",
            credentials: "same-origin",
            headers: {
                "X-CSRFToken": csrftoken,
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });
        if(!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
    }
    catch(error) {
        console.log(error.message)
    }
}

async function scanBarcode(returnFunction) {
    showScanner("products-div");
    document.addEventListener("barcode-scanned", function(event) {
        returnFunction(returnedBarcode=event.detail.barcode);
    }, {once: true});
}

async function searchProducts(event) {
    showProducts(event.target.value);
}

async function showEditProductForm(productId, barcode="") {
    const productsDiv = document.querySelector("#products-div");
    productsDiv.innerHTML = "";
    productsDiv.setAttribute("style", "");
    const product = await getProduct(productId);

    const editProductFormTemplate = document.querySelector("#product-form-template");

    const editProductForm = editProductFormTemplate.content.cloneNode(true);
    editProductForm.querySelector("#product-name").value = product.name;

    editProductForm.querySelector("#product-calories").value = product.calories;
    editProductForm.querySelector("#product-fats").value = product.fats;
    editProductForm.querySelector("#product-carbs").value = product.carbs;
    editProductForm.querySelector("#product-proteins").value = product.proteins;
    editProductForm.querySelector("#product-portion-weight").value = product.portion_size;
    
    const removeProductButton = document.createElement("div");
    removeProductButton.setAttribute("class", "col-3 p-2")
    removeProductButton.innerHTML = `<button id="product-delete-button" class="btn btn-danger">Delete</button>`;
    removeProductButton.addEventListener("click", function(event) {
        event.preventDefault();
        deleteProduct(productId).then(function() {
            showProducts();
        });
    })

    editProductForm.querySelector("#form-buttons").prepend(removeProductButton);

    if(barcode == "")
    {
        editProductForm.querySelector("#product-barcode").value = product.barcode;
    }
    else
    {
        editProductForm.querySelector("#product-barcode").value = scannedBarcode;
    }

    editProductForm.querySelector("#scan-product-button").addEventListener("click", function(event){
        event.preventDefault();
        scanBarcode(function(returnedBarcode) {showEditProductForm(productId, barcode = returnedBarcode)});
    });

    editProductForm.querySelector("#product-form-submit-button").textContent = "Update";

    editProductForm.querySelector("#product-form").addEventListener("submit", function(event){
        event.preventDefault();
        updateProduct({
            id: productId,
            name: document.querySelector("#product-name").value,
            calories: document.querySelector("#product-calories").value,
            fats: document.querySelector("#product-fats").value,
            carbs: document.querySelector("#product-carbs").value,
            proteins: document.querySelector("#product-proteins").value,
            barcode: document.querySelector("#product-barcode").value,
            portion_size: document.querySelector("#product-portion-weight").value != "" ? document.querySelector("#product-portion-weight").value : 0
        }).then( function(){
            showProducts();
        });
    });

    productsDiv.append(editProductForm);
}

async function showAddProductForm(barcode="") {
    const productsDiv = document.querySelector("#products-div");
    productsDiv.innerHTML = "";
    productsDiv.setAttribute("style", "");
    
    const addProductFormTemplate = document.querySelector("#product-form-template");

    const addProductForm = addProductFormTemplate.content.cloneNode(true);
    addProductForm.querySelector("#product-barcode").value = barcode;


    addProductForm.querySelector("#scan-product-button").addEventListener("click", function(event){
        event.preventDefault();
        scanBarcode(function(returnedBarcode) {showAddProductForm(returnedBarcode);});
    });

    addProductForm.querySelector("#product-form-submit-button").textContent = "Add product";

    addProductForm.querySelector("#product-form").addEventListener("submit", function(event){
        event.preventDefault();
        addProduct({
            name: document.querySelector("#product-name").value,
            calories: document.querySelector("#product-calories").value,
            fats: document.querySelector("#product-fats").value,
            carbs: document.querySelector("#product-carbs").value,
            proteins: document.querySelector("#product-proteins").value,
            barcode: document.querySelector("#product-barcode").value,
            portion_size: document.querySelector("#product-portion-weight").value != "" ? document.querySelector("#product-portion-weight").value : 0
        }).then( function(){
            showProducts();
        });
    });

    productsDiv.append(addProductForm);
}

async function showProducts(name="", barcode="") {
    const productsDiv = document.querySelector("#products-div");
    productsDiv.innerHTML = "";
    productsDiv.setAttribute("style", "");
    const products = await getProducts(name, barcode);

    const searchProductOptionsTemplate = document.querySelector("#search-product-options-template");
    const searchProductOptions = searchProductOptionsTemplate.content.cloneNode(true);
    searchProductOptions.querySelector("#scan-barcode-button").addEventListener("click", function()
    { 
        scanBarcode(function(returnedBarcode) { showProducts(name="", barcode=returnedBarcode) });
    });
    searchProductOptions.querySelector("#add-product-button").addEventListener("click", function() { showAddProductForm(barcode=""); });

    let timeOut;
    searchProductOptions.querySelector("#food-search-input").value = name;
    searchProductOptions.querySelector("#food-search-input").addEventListener("input", function(event) {
        clearTimeout(timeOut);
        timeOut = setTimeout(function() {searchProducts(event)}, 500);
    });

    productsDiv.append(searchProductOptions);

    const productsListTemplate = document.querySelector("#products-list-template");
    const productsListItemTemplate = document.querySelector("#products-list-item-template");

    const productsList = productsListTemplate.content.cloneNode(true);
    const productsListItem = productsListItemTemplate.content.cloneNode(true);


    for (var product of products){
        const productLi = productsListItem.querySelector("#product").cloneNode(true);
        productLi.setAttribute("id", `product-id-${product.id}`);
        productLi.querySelector("#product-name").textContent = `${product.name}`;
        productLi.querySelector("#product-calories").textContent = `${product.calories} kcal/100g`;
        
        const productId = product.id;
        productLi.addEventListener("click", function eventHandler() {
            document.dispatchEvent(new CustomEvent("selected-product", {detail: {id: productId }}));
        })

        productsList.querySelector("ul").append(productLi);
    }

    productsDiv.append(productsList);
    document.querySelector("#food-search-input").focus();
}

document.addEventListener("DOMContentLoaded", function() {
    if(document.querySelector("#products-div") != null)
    {
        showProducts();

        document.addEventListener("selected-product", function(event){
            showEditProductForm(event.detail.id);
            document.removeEventListener("selected-product", event);
        });
    }
})