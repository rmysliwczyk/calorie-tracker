let openedMealtime = "";

async function getMeals() {
    try {
        let url = `api/meals`;
        const response = await fetch(url);
        if(!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const meals = await response.json();
        return meals;
    }
    catch(error) {
        console.log(error.message)
    }
}

async function getMeal(mealId) {
    try {
        let url = `api/meals/${mealId}`;
        const response = await fetch(url);
        if(!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const meal = await response.json();
        return meal;
    }
    catch(error) {
        console.log(error.message)
    }
}

async function deleteMeal(mealId) {
    try {
        let url = `api/meals/${mealId}/`;
        const response = await fetch(url, {
            method: "DELETE",
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

async function getFood(foodId) {
    try {
        let url = `api/foods/${foodId}`;
        const response = await fetch(url);
        if(!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const food = await response.json();
        return food;
    }
    catch(error) {
        console.log(error.message)
    }
}

async function addMeal(meal) {
    try {
        let url = `api/meals/`;
        const response = await fetch(url, {
            method: "POST",
            credentials: "same-origin",
            headers: {
                "X-CSRFToken": csrftoken,
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(meal)
        });

        const meals = await response.json();
        return meals;
    }
    catch(error) {
        console.log(error)
    }
}

async function updateMeal(meal) {
    try {
        let url = `api/meals/${meal.id}/`;
        const response = await fetch(url, {
            method: "PATCH",
            credentials: "same-origin",
            headers: {
                "X-CSRFToken": csrftoken,
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(meal)
        });

        const responseJson = await response.json();
        return responseJson;
    }
    catch(error) {
        console.log(error)
    }
}

async function showAddMealProductSelection(mealtimeId) {
    const mealsDiv = document.querySelector("#meals-div");
    mealsDiv.innerHTML = `<div id="products-div"></div>`;


    showProducts();
    
    document.addEventListener("selected-product", function(event){
        showAddMealForm(event.detail.id, mealtimeId);
        document.removeEventListener("selected-product", event);
    }, {once: true});
}

async function showAddMealForm(productId, mealtimeId) {
    const mealsDiv = document.querySelector("#meals-div");
    mealsDiv.innerHTML = "";
    const selectedFood = await getProduct(productId);
    const addMealFormTemplate = document.querySelector("#meal-form-template");

    const addMealForm = addMealFormTemplate.content.cloneNode(true);

    addMealForm.querySelector("#food-name").innerHTML = selectedFood.name;
    const nutritionalValuesData = addMealForm.querySelectorAll("td");
    nutritionalValuesData[0].textContent = selectedFood.calories;
    nutritionalValuesData[1].textContent = selectedFood.fats;
    nutritionalValuesData[2].textContent = selectedFood.carbs;
    nutritionalValuesData[3].textContent = selectedFood.proteins;


    addMealForm.querySelector("#meal-weight").addEventListener("input", function(event) {
        document.querySelector("#meal-calories").value = event.target.value * selectedFood.calories / 100 + " kcal";
    });

    addMealForm.querySelector("#meal-form").addEventListener("submit", async function(event){
        event.preventDefault();

        document.querySelector("#meal-calories").value;
        await addMeal(
            meal = {
                food: selectedFood.id,
                weight: document.querySelector("#meal-weight").value,
                meal_time: mealtimeId
            }
        )
        showMeals();
    });

    mealsDiv.append(addMealForm);
}

async function showEditMealForm(mealId) {
    const mealsDiv = document.querySelector("#meals-div");
    mealsDiv.innerHTML = "";
    const meal = await getMeal(mealId);
    const food = await getFood(meal.food_id);
    const editMealFormTemplate = document.querySelector("#meal-form-template");

    const editMealForm = editMealFormTemplate.content.cloneNode(true);

    editMealForm.querySelector("#food-name").innerHTML = food.name;
    const nutritionalValuesData = editMealForm.querySelectorAll("td");
    nutritionalValuesData[0].textContent = food.calories;
    nutritionalValuesData[1].textContent = food.fats;
    nutritionalValuesData[2].textContent = food.carbs;
    nutritionalValuesData[3].textContent = food.proteins;

    editMealForm.querySelector("#meal-weight").value = meal.weight;
    editMealForm.querySelector("#meal-calories").value = meal.total_calories;
    editMealForm.querySelector("#meal-add-button").setAttribute("id", "meal-edit-button");
    editMealForm.querySelector("#meal-edit-button").textContent = "Edit meal"
    
    const removeMealButton = document.createElement("div");
    removeMealButton.setAttribute("class", "col-4 p-2")
    removeMealButton.innerHTML = `<button id="meal-delete-button" class="btn btn-danger">Delete meal</button>`;
    removeMealButton.addEventListener("click", async function(event) {
        event.preventDefault();
        await deleteMeal(mealId);
        showMeals();
    })
    editMealForm.querySelector("#form-buttons").append(removeMealButton);

    editMealForm.querySelector("#meal-weight").addEventListener("input", function(event) {
        document.querySelector("#meal-calories").value = event.target.value * food.calories / 100 + " kcal";
    });

    editMealForm.querySelector("#meal-form").addEventListener("submit", async function(event){
        event.preventDefault();

        document.querySelector("#meal-calories").value;
        await updateMeal(
            {
                id: meal.id,
                food: food.id,
                weight: document.querySelector("#meal-weight").value
            }
        )
        showMeals();
    });

    mealsDiv.append(editMealForm);
}


async function showMeals() {

    mealTimes = {
        1: "Breakfast",
        2: "Second Breakfast",
        3: "Lunch",
        4: "Dinner",
        5: "Supper"
    }

    const mealsDiv = document.querySelector("#meals-div");
    mealsDiv.innerHTML = `<div class="spinner-border" role="status"> <span class="sr-only"></span></div>`;
    const meals = await getMeals();

    const mealtimesAccordionTemplate = document.querySelector("#mealtimes-accordion-template");
    const mealtimesAccordionItemTemplate = document.querySelector("#mealtimes-accordion-item-template");
    const mealsListTemplate = document.querySelector("#meals-list-template");
    const mealsListItemTemplate = document.querySelector("#meals-list-item-template");

    const mealtimesAccordion = mealtimesAccordionTemplate.content.cloneNode(true);

    for(mealtimeId in mealTimes)
    {
        const mealtimesAccordionItem = mealtimesAccordionItemTemplate.content.cloneNode(true);
        mealtimesAccordionItem.querySelector("#mealtime-id-INSERT_MEALTIME_NUMBER").setAttribute("id", `mealtime-id-${mealtimeId}`);

        mealtimesAccordionItem.querySelector(".accordion-button").setAttribute("data-bs-target", `#mealtime-collapse-${mealtimeId}`);
        mealtimesAccordionItem.querySelector(".accordion-collapse").setAttribute("id", `mealtime-collapse-${mealtimeId}`);

        mealtimesAccordionItem.querySelector(".accordion-button").textContent = mealTimes[mealtimeId];
        
        mealtimesAccordionItem.querySelector(".btn-add-meal").setAttribute("id", `add-meal-to-mealtime-${mealtimeId}`);

        const mealtimeIdRequest = JSON.parse(JSON.stringify(mealtimeId));
        mealtimesAccordionItem.querySelector(".btn-add-meal").addEventListener("click", function(event){
             showAddMealProductSelection(mealtimeIdRequest);
        })

        const mealsList = mealsListTemplate.content.cloneNode(true);
        for (var meal of meals){
            if(meal.meal_time == mealtimeId)
            {
                const mealsListItem = mealsListItemTemplate.content.cloneNode(true);
                mealsListItem.querySelector("#meal-id-INSERT_MEAL_ID").setAttribute("id", `meal-id-${meal.id}`);
                const foodItem = await getFood(meal.food);
                mealsListItem.querySelector("#product-name").textContent = foodItem.name;
                mealsListItem.querySelector("#meal-nutritional-info").textContent = `kcal: ${meal.total_calories} fats: ${meal.total_fats} g carbs: ${meal.total_carbs} g proteins: ${meal.total_proteins} g`;
                
                const mealId = meal.id
                mealsListItem.querySelector("button").addEventListener("click", function eventHandler(event) {
                    showEditMealForm(mealId);
                })
        
                mealsList.querySelector("ul").append(mealsListItem);
            }
        }

        mealtimesAccordionItem.querySelector(".accordion-body").append(mealsList);
        mealtimesAccordion.querySelector("#mealtimes-accordion").append(mealtimesAccordionItem);
    }

    mealsDiv.innerHTML = "";
    mealsDiv.append(mealtimesAccordion);

    if (openedMealtime != "")
    {
        document.querySelector(`#${openedMealtime}`).classList.add("show");
    }
}

document.addEventListener("DOMContentLoaded", function() {

    showMeals().then(function(){

        document.addEventListener("show.bs.collapse", function(event){
            openedMealtime = event.target.id;
        });
    });
});
