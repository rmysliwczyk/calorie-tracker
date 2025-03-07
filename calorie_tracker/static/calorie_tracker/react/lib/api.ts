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

export async function getProducts(name = "", barcode = ""): Promise<Array<Product>> {
    try {
        let url = `api/products/?name__contains=${name}&barcode__contains=${barcode}`;
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


