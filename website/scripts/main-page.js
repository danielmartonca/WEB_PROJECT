window.onload = async function () {
    try {
        const token = window.localStorage.getItem("JWT");
        if (token === null) {
            console.error("No token extracted from local storage.");
            alert("You are not logged in to view this page.")
            setTimeout(() => {
                window.location.href = "/login.html"
            }, 5000);
            return;
        }

        const response = await fetch("/getPetDetails", {
            method: 'GET', headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        let responseBody = JSON.parse(await response.text());
        console.log(`Response: ${response.status} with body:${JSON.stringify(responseBody)}`);

        if (response.status !== 200) {
            console.error('Failed to get pet details.');
            alert("An unexpected error has occurred.");
            return;
        }

        document.getElementById('petName').textContent = responseBody.Name;
        document.getElementById('size').placeholder = responseBody.Size;
        document.getElementById('health').placeholder = responseBody.HealthStatus;
        document.getElementById('food').placeholder = responseBody.PrefferedFood;
        document.getElementById('age').placeholder = responseBody.Age;
        document.getElementById('birth').placeholder = responseBody.DateOfBirth;
        document.getElementById('breed').placeholder = responseBody.Breed;
    } catch (e) {
        console.error(e);
        alert("An unexpected error has occurred.");
    }

}