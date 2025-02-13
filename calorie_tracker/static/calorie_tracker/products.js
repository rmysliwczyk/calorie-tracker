async function getProducts(name = "", barcode = "") {
    try {
        let url = `api/products/?name__contains=${name}&barcode__contains=${barcode}`;
        const response = await fetch(url, {
            method: "GET",
            credentials: "same-origin",
            headers: {
                "X-CSRFToken": csrftoken,
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        return await response.json();
    }
    catch (error) {
        console.log(error.message)
    }
}

async function getProduct(productId) {
    try {
        let url = `api/products/${productId}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        return await response.json();
    }
    catch (error) {
        console.log(error.message)
    }
}

async function addProduct(product) {
    try {
        let url = `api/products/`;
        const response = await fetch(url, {
            method: "POST",
            credentials: "same-origin",
            headers: {
                "X-CSRFToken": csrftoken,
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(product)
        });

        if (!response.ok) {
            return null;
        }

        return await response.json();
    }
    catch (error) {
        console.log(error.message)
    }
}

async function updateProduct(product) {
    try {
        let url = `api/products/${product.id}/`;
        const response = await fetch(url, {
            method: "PATCH",
            credentials: "same-origin",
            headers: {
                "X-CSRFToken": csrftoken,
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(product)
        });
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        return await response.json();
    }
    catch (error) {
        console.log(error.message)
    }
}

async function deleteProduct(productId) {
    try {
        let url = `api/products/${productId}/`;
        const response = await fetch(url, {
            method: "DELETE",
            credentials: "same-origin",
            headers: {
                "X-CSRFToken": csrftoken,
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
    }
    catch (error) {
        console.log(error.message)
    }
}

async function scanBarcode(returnFunction) {
    showScanner("products-div");
    document.addEventListener("barcode-scanned", async function (event) {
        await html5QrcodeScanner.clear();
        returnFunction(returnedBarcode = event.detail.barcode);
    }, { once: true });

}

async function searchProducts(event) {
    showProducts(event.target.value);
}

async function showEditProductForm(productId, receivedBarcode = "") {
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

    if (product.is_locked == false) {
        const removeProductButton = document.createElement("div");
        removeProductButton.setAttribute("class", "col-3 p-2")
        removeProductButton.innerHTML = `<button id="product-delete-button" class="btn btn-danger">Delete</button>`;
        removeProductButton.addEventListener("click", function (event) {
            event.preventDefault();
            deleteProduct(productId).then(function () {
                showProducts();
            });
        })

        editProductForm.querySelector("#form-buttons").prepend(removeProductButton);

        editProductForm.querySelector("#scan-product-button").addEventListener("click", function (event) {
            event.preventDefault();
            const returnFunction = function (returnedBarcode) { showEditProductForm(productId, returnedBarcode) };
            scanBarcode(returnFunction);
            history.pushState({ "action": "scanBarcode" }, "", "products");
        });

        editProductForm.querySelector("#product-form-submit-button").textContent = "Update";

        editProductForm.querySelector("#product-form-submit-button").addEventListener("click", async function (event) {
            event.preventDefault();
            await updateProduct({
                id: productId,
                name: document.querySelector("#product-name").value,
                calories: document.querySelector("#product-calories").value,
                fats: document.querySelector("#product-fats").value,
                carbs: document.querySelector("#product-carbs").value,
                proteins: document.querySelector("#product-proteins").value,
                barcode: receivedBarcode != "" ? receivedBarcode : document.querySelector("#product-barcode").value,
                portion_size: document.querySelector("#product-portion-weight").value != "" ? document.querySelector("#product-portion-weight").value : 0
            });
            showProducts();
        });

    }
    else {
        editProductForm.querySelectorAll("input").forEach(function (element) { element.setAttribute("disabled", "") });
        editProductForm.querySelector("#form-buttons").remove();
    }


    if (receivedBarcode == "") {
        editProductForm.querySelector("#product-barcode").value = product.barcode;
    }
    else {
        editProductForm.querySelector("#product-barcode").value = receivedBarcode;
    }

    productsDiv.append(editProductForm);

}

async function showAddProductForm(receivedBarcode = "") {
    const productsDiv = document.querySelector("#products-div");
    productsDiv.innerHTML = "";
    productsDiv.setAttribute("style", "");

    const addProductFormTemplate = document.querySelector("#product-form-template");

    const addProductForm = addProductFormTemplate.content.cloneNode(true);
    addProductForm.querySelector("#product-barcode").value = receivedBarcode;


    addProductForm.querySelector("#scan-product-button").addEventListener("click", function (event) {
        event.preventDefault();
        window.sessionStorage.setItem("name", document.querySelector("#product-name").value);
        window.sessionStorage.setItem("calories", document.querySelector("#product-calories").value);
        window.sessionStorage.setItem("fats", document.querySelector("#product-fats").value);
        window.sessionStorage.setItem("carbs", document.querySelector("#product-carbs").value);
        window.sessionStorage.setItem("proteins", document.querySelector("#product-proteins").value);
        window.sessionStorage.setItem("portion_size", document.querySelector("#product-portion-weight").value)

        const returnFunction = async function (returnedBarcode) {
            await showAddProductForm(returnedBarcode);
            document.querySelector("#product-name").value = window.sessionStorage.getItem("name");
            document.querySelector("#product-calories").value = window.sessionStorage.getItem("calories");
            document.querySelector("#product-fats").value = window.sessionStorage.getItem("fats");
            document.querySelector("#product-carbs").value = window.sessionStorage.getItem("carbs");
            document.querySelector("#product-proteins").value = window.sessionStorage.getItem("proteins");
            document.querySelector("#product-portion-weight").value = window.sessionStorage.getItem("portion_size");
        }
        scanBarcode(returnFunction);
        history.pushState({ "action": "scanBarcode" }, "", "products");
    });

    addProductForm.querySelector("#product-form-submit-button").textContent = "Add product";

    let result;
    addProductForm.querySelector("#product-form").addEventListener("submit", async function (event) {
        event.preventDefault();
        result = await addProduct({
            name: document.querySelector("#product-name").value,
            calories: document.querySelector("#product-calories").value,
            fats: document.querySelector("#product-fats").value,
            carbs: document.querySelector("#product-carbs").value,
            proteins: document.querySelector("#product-proteins").value,
            barcode: receivedBarcode,
            portion_size: document.querySelector("#product-portion-weight").value != "" ? document.querySelector("#product-portion-weight").value : 0
        });
        if (result === null) {
            alert("Couldn't add product. Check input data and try again");
        }
        else {
            showProducts();
        }
    });

    productsDiv.append(addProductForm);

}

async function showProducts(name = "", receivedBarcode = "") {
    const productsDiv = document.querySelector("#products-div");
    productsDiv.innerHTML = "";
    productsDiv.setAttribute("style", "");
    const products = await getProducts(name, receivedBarcode);

    const searchProductOptionsTemplate = document.querySelector("#search-product-options-template");
    const searchProductOptions = searchProductOptionsTemplate.content.cloneNode(true);
    searchProductOptions.querySelector("#scan-barcode-button").addEventListener("click", function () {
        const returnFunction = async function (returnedBarcode) {
            const scannedProducts = await getProducts(name = "", returnedBarcode);
            if (scannedProducts.length === 1) {
                document.dispatchEvent(new CustomEvent("selected-product", { detail: { id: scannedProducts[0].id } }));
            }
            else {
                showProducts(name = "", returnedBarcode);
            }
        }

        scanBarcode(returnFunction);
        history.pushState({ "action": "scanBarcode" }, "", "products");
    });
    searchProductOptions.querySelector("#add-product-button").addEventListener("click", function () {
        showAddProductForm(receivedBarcode = "");
        history.pushState({ "action": "addProductForm", "receivedBarcode": "" }, "", "products");
    });

    let timeOut;
    searchProductOptions.querySelector("#food-search-input").value = name;
    searchProductOptions.querySelector("#food-search-input").addEventListener("input", function (event) {
        clearTimeout(timeOut);
        timeOut = setTimeout(function () { searchProducts(event) }, 500);
    });

    productsDiv.append(searchProductOptions);

    const productsListTemplate = document.querySelector("#products-list-template");
    const productsListItemTemplate = document.querySelector("#products-list-item-template");

    const productsList = productsListTemplate.content.cloneNode(true);
    const productsListItem = productsListItemTemplate.content.cloneNode(true);


    for (var product of products) {
        const productLi = productsListItem.querySelector("#product").cloneNode(true);
        productLi.setAttribute("id", `product-id-${product.id}`);
        productLi.querySelector("#product-name").textContent = `${product.name}`;
        productLi.querySelector("#product-calories").textContent = `${product.calories} kcal/100g`;

        const productId = product.id;
        productLi.addEventListener("click", function eventHandler() {
            document.dispatchEvent(new CustomEvent("selected-product", { detail: { id: productId } }));
        })

        productsList.querySelector("ul").append(productLi);
    }

    productsDiv.append(productsList);
    document.querySelector("#food-search-input").focus();
}

document.addEventListener("DOMContentLoaded", function () {
    if (document.querySelector("#products-div") != null) {
        showProducts();
        history.replaceState({ "action": "showProducts", "name": "", "receivedBarcode": "" }, "", "products");
        document.addEventListener("selected-product", function (event) {
            showEditProductForm(event.detail.id);
            history.pushState({ "action": "editProductForm", "productId": event.detail.id, "receivedBarcode": "" }, "", "products");
            document.removeEventListener("selected-product", event);
        });
    }
})
