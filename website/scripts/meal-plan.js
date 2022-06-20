async function getMealPlan() {
    try {
        const token = window.localStorage.getItem("JWT");
        if (token === null) {
            console.error("No token extracted from local storage.");
            alert("You are not logged in to view this page.")
            window.location.href = "/login.html"
            return;
        }

        const response = await fetch("/getMealPlan", {
            method: 'GET', headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        let responseBody = JSON.parse(await response.text());
        console.log(`Response: ${response.status} with body:${JSON.stringify(responseBody)}.`);

        if (response.status !== 200) {
            console.error('Failed to get pet meal plan.');
            alert("An unexpected error has occurred.");
            return;
        }

        function updateDom(mealPlanArray, dayId) {
            if (mealPlanArray.length !== 0) {
                for (let i = 0; i < mealPlanArray.length; i++) {
                    let mealPlan = mealPlanArray[i];
                    let input;
                    let checkbox;
                    switch (mealPlan.Meal) {
                        case "Breakfast":
                            input = document.getElementById(`${dayId}-br`);
                            checkbox = document.getElementById(`check-${dayId}-br`);
                            break;
                        case "Lunch":
                            input = document.getElementById(`${dayId}-lu`);
                            checkbox = document.getElementById(`check-${dayId}-lu`);
                            break;
                        case "Dinner":
                            input = document.getElementById(`${dayId}-di`);
                            checkbox = document.getElementById(`check-${dayId}-di`);
                            break;
                    }
                    input.placeholder = mealPlan.Food;
                    checkbox.checked = mealPlan.HasEaten.startsWith("true");
                }
            }
        }

        updateDom(responseBody.mealPlanMonday, 'mo');
        updateDom(responseBody.mealPlanTuesday, 'tu');
        updateDom(responseBody.mealPlanWednesday, 'we');
        updateDom(responseBody.mealPlanThursday, 'th');
        updateDom(responseBody.mealPlanFriday, 'fr');
        updateDom(responseBody.mealPlanSaturday, 'sa');
        updateDom(responseBody.mealPlanSunday, 'su');
    } catch (e) {
        console.error(e);
        alert("An unexpected error has occurred.");
    }
}

async function updateMealPlan() {
    try {
        function getValuesFromDOM(dayId) {
            let inputBr = document.getElementById(`${dayId}-br`);
            let checkboxBr = document.getElementById(`check-${dayId}-br`);
            let inputLu = document.getElementById(`${dayId}-lu`);
            let checkboxLu = document.getElementById(`check-${dayId}-lu`);
            let inputDi = document.getElementById(`${dayId}-di`);
            let checkboxDi = document.getElementById(`check-${dayId}-di`);
            let arr = [];
            arr.push(
                {
                    'Meal': 'Breakfast',
                    'Food': inputBr.value,
                    'HasEaten': checkboxBr.checked === true ? "true" : "false"
                }
            );
            arr.push(
                {
                    'Meal': 'Lunch',
                    'Food': inputLu.value,
                    'HasEaten': checkboxLu.checked === true ? "true" : "false"
                }
            );
            arr.push(
                {
                    'Meal': 'Dinner',
                    'Food': inputDi.value,
                    'HasEaten': checkboxDi.checked === true ? "true" : "false"
                }
            )
            return arr;
        }

        const json = {
            'mealPlanMonday': getValuesFromDOM('mo'),
            'mealPlanTuesday': getValuesFromDOM('tu'),
            'mealPlanWednesday': getValuesFromDOM('we'),
            'mealPlanThursday': getValuesFromDOM('th'),
            'mealPlanFriday': getValuesFromDOM('fr'),
            'mealPlanSaturday': getValuesFromDOM('sa'),
            'mealPlanSunday': getValuesFromDOM('su')
        };

        const token = window.localStorage.getItem("JWT");
        if (token === null) {
            console.error("No token extracted from local storage.");
            alert("You are not logged in to view this page.")
            window.location.href = "/login.html"
            return;
        }

        const response = await fetch("/updateMealPlan", {
            method: 'POST', headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(json)
        });
        let responseBody = await response.text();
        console.log(`Response: ${response.status} with body:${responseBody}.`);

        if (response.status !== 200) {
            console.error('Failed to get pet meal plan.');
            alert("An unexpected error has occurred.");
            return;
        }
        console.log("Updated meal plan successfully.");
        window.location.reload();
    } catch (e) {
        console.error(e);
        alert("An unexpected error has occurred.");
    }
}

window.onload = getMealPlan;