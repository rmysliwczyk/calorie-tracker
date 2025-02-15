let openedMealtime = "";

async function getMeals(date = "") {
    try {
        let url = `api/meals/?date=${date}`;
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

async function getMeal(mealId) {
    try {
        let url = `api/meals/${mealId}`;
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
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
    }
    catch (error) {
        console.log(error.message)
    }
}

async function getFood(foodId) {
    try {
        let url = `api/foods/${foodId}`;
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

        return await response.json();
    }
    catch (error) {
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

        return await response.json();
    }
    catch (error) {
        console.log(error)
    }
}

let listenerAttached = false;
async function showAddMealProductSelection(mealtimeId) {
    const mealsDiv = document.querySelector("#meals-div");
    mealsDiv.innerHTML = `<div id="products-div"></div>`;

    await showProducts();
    if (listenerAttached === false) {
        document.addEventListener("selected-product", function (event) {
            showAddMealForm(event.detail.id, mealtimeId);
            history.pushState({ "action": "addMealForm", "productId": event.detail.id, "mealtimeId": mealtimeId }, "", "meals");
            document.removeEventListener("selected-product", event);
            listenerAttached = false;
        }, { once: true });
        listenerAttached = true;
    }
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


    addMealForm.querySelector("#meal-weight").addEventListener("input", function (event) {
        document.querySelector("#meal-calories").value = (event.target.value * selectedFood.calories / 100).toFixed(2) + " kcal";
    });

    addMealForm.querySelector("#meal-form").addEventListener("submit", async function (event) {
        event.preventDefault();

        document.querySelector("#meal-calories").value;
        await addMeal(
            meal = {
                food: selectedFood.id,
                date: window.sessionStorage.getItem("selected_date"),
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
    removeMealButton.addEventListener("click", async function (event) {
        event.preventDefault();
        await deleteMeal(mealId);
        showMeals();
    })
    editMealForm.querySelector("#form-buttons").append(removeMealButton);

    editMealForm.querySelector("#meal-weight").addEventListener("input", function (event) {
        document.querySelector("#meal-calories").value = (event.target.value * food.calories / 100).toFixed(2) + " kcal";
    });

    editMealForm.querySelector("#meal-form").addEventListener("submit", async function (event) {
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

    const mealsDiv = $("#meals-div");
    mealsDiv.html(`<div class="spinner-border" role="status"> <span class="sr-only"></span></div>`);

    const meals = await getMeals(date);

    const mealtimesAccordionTemplate = $("#mealtimes-accordion-template").get(0);
    const mealtimesAccordionItemTemplate = $("#mealtimes-accordion-item-template").get(0);
    const mealsListTemplate = $("#meals-list-template").get(0);
    const mealsListItemTemplate = $("#meals-list-item-template").get(0);
    const dailyCaloriesTemplate = $("#daily-calories-template").get(0);

    const mealtimesAccordion = mealtimesAccordionTemplate.content.cloneNode(true);
    const dailyCalories = dailyCaloriesTemplate.content.cloneNode(true);


    let dailyCaloriesTotal = 0;
    for (mealtimeId in mealTimes) {
        const mealtimesAccordionItem = mealtimesAccordionItemTemplate.content.cloneNode(true);
        $("#mealtime-id-INSERT_MEALTIME_NUMBER", mealtimesAccordionItem).attr("id", `mealtime-id-${mealtimeId}`);

        $(".accordion-button", mealtimesAccordionItem).attr("data-bs-target", `#mealtime-collapse-${mealtimeId}`);
        $(".accordion-collapse", mealtimesAccordionItem).attr("id", `mealtime-collapse-${mealtimeId}`);

        const mealtimeIdRequest = JSON.parse(JSON.stringify(mealtimeId));
        const mealsList = mealsListTemplate.content.cloneNode(true);

        let mealtimeCalories = 0
        for (var meal of meals) {
            if (meal.meal_time == mealtimeId) {
                const mealsListItem = mealsListItemTemplate.content.cloneNode(true);
                $("#meal-id-INSERT_MEAL_ID", mealsListItem).attr("id", `meal-id-${meal.id}`);

                const foodItem = await getFood(meal.food);

                $("#product-name", mealsListItem).text(`${foodItem.name} - ${meal.weight} g`);
                $("#meal-nutritional-info", mealsListItem).text(`kcal: ${meal.total_calories.toFixed(2)} f: ${meal.total_fats.toFixed(2)}g c: ${meal.total_carbs.toFixed(2)}g p: ${meal.total_proteins.toFixed(2)}g`);

                const mealId = meal.id
                $("button", mealsListItem).click(function eventHandler(event) {
                    showEditMealForm(mealId);
                    history.pushState({ "action": "editMealForm", "mealId": mealId }, "", "meals");
                })

                $("ul", mealsList).append(mealsListItem);

                mealtimeCalories += meal.total_calories;
            }
        }

        $(".accordion-button", mealtimesAccordionItem).html(`
        <div class="container">
            <div class="row align-items-center">
                <div class="col">
                    ${mealTimes[mealtimeId]}
                </div>
                <div class="col">
                    ${mealtimeCalories.toFixed(2)} kcal
                </div>
                <div class="col">
                    <button class="btn btn-add-meal"><i class="bi bi-plus-circle fs-1"></i></button>
                </div>
            </div>
        </div>`);

        $(".btn-add-meal", mealtimesAccordionItem).attr("id", `add-meal-to-mealtime-${mealtimeId}`);
        $(".btn-add-meal", mealtimesAccordionItem).click(function (event) {
            showAddMealProductSelection(mealtimeIdRequest);
            history.pushState({ "action": "showAddMealProductSelection", "mealtimeId": mealtimeIdRequest }, "", "meals");
        })

        $(".accordion-body", mealtimesAccordionItem).append(mealsList);
        $("#mealtimes-accordion", mealtimesAccordion).append(mealtimesAccordionItem);

        dailyCaloriesTotal += mealtimeCalories;
    }

    mealsDiv.html("");

    const dateSelectTemplate = $("#date-select-template").get(0);
    const dateSelect = dateSelectTemplate.content.cloneNode(true);

    $("#date-selector", dateSelect)[0].valueAsDate = new Date(date);

    $("#date-selector", dateSelect).change(async function () {
        const newDate = $("#date-selector")[0].valueAsDate;
        window.sessionStorage.setItem("selected_date", newDate.toISOString().split("T")[0]);
        date = newDate.toISOString().split("T")[0];
        showMeals();
    });

    $("#daily-calories", dailyCalories).html(`<h5> Total calories: ${dailyCaloriesTotal.toFixed(2)} kcal </h5>`);

    mealsDiv.append(dateSelect);
    mealsDiv.append(dailyCalories);
    mealsDiv.append(mealtimesAccordion);

    if (openedMealtime != "") {
        $(`#${openedMealtime}`).addClass("show");
    }
}

document.addEventListener("DOMContentLoaded", function () {

    history.replaceState({ "action": "showMeals" }, "", "meals");
    showMeals().then(function () {

        document.addEventListener("show.bs.collapse", function (event) {
            openedMealtime = event.target.id;
        });
    });
});
