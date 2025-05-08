export async function getUserProfile(userId: number = null): Promise<User> {
    try {
        const response = await fetch(`api/userprofiles/${userId}`);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        return await response.json();
    }
    catch (error) {
        return {
            username: null,
            calorie_goal: null,
            error_message: error
        }
    }
}

export async function addProduct(product: Product, csrftoken: string): Promise<Product> {
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
        return ({
            id: null,
            name: null,
            calories: null,
            fats: null,
            carbs: null,
            proteins: null,
            portion_size: null,
            is_locked: null,
            barcode: null,
            error_message: error
        })
    }
}

export async function getProducts(searchQuery: string = "", barcode: string = ""): Promise<Array<Product>> {
    try {
        let url = `api/products/?name__contains=${searchQuery}&barcode__contains=${barcode}`;
        const response = await fetch(url, {
            method: "GET",
            credentials: "same-origin",
            headers: {
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
        return ([{
            id: null,
            name: null,
            calories: null,
            fats: null,
            carbs: null,
            proteins: null,
            portion_size: null,
            is_locked: null,
            barcode: null,
            error_message: error
        }])
    }
}

export async function getProduct(productId: BigInt): Promise<Product> {
    try {
        let url = `api/products/${productId}`;
        const response = await fetch(url, {
            method: "GET",
            credentials: "same-origin",
            headers: {
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
        return ({
            id: null,
            name: null,
            calories: null,
            fats: null,
            carbs: null,
            proteins: null,
            portion_size: null,
            is_locked: null,
            barcode: null,
            error_message: error
        })
    }
}

export async function updateProduct(product: Product, csrftoken: string): Promise<number> {
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
        console.log(response.status)
        return await response.status;
    }
    catch (error) {
        console.log(error.message)
    }
}