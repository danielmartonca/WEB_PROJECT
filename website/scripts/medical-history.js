async function getPetDetails() {
    try {
        const token = window.localStorage.getItem("JWT");
        if (token === null) {
            console.error("No token extracted from local storage.");
            alert("You are not logged in to view this page.")
            window.location.href = "/login.html"
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
        document.getElementById('petName').textContent = "Name:" + responseBody.Name;
        document.getElementById('age').textContent = "Age:" + responseBody.Age;
        document.getElementById('birth').textContent = "Birth date:" + responseBody.DateOfBirth;
        document.getElementById('breed').textContent = "Breed:" + responseBody.Breed;
        document.getElementById('gender').textContent = "Gender:" + responseBody.Gender;
        document.getElementById('size').textContent = "Weight:" + responseBody.Size;
    } catch (e) {
        console.error(e);
        alert("An unexpected error has occurred.");
    }

    await getPetProfilePicture();
}

async function getPetProfilePicture() {
    const token = window.localStorage.getItem("JWT");
    if (token === null) {
        console.error("No token extracted from local storage.");
        alert("You are not logged in to view this page.")
        window.location.href = "/login.html"
        return;
    }
    const response = await fetch("/getPetProfilePicture", {
        method: 'GET', headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    let responseBody = await response.text();
    console.log(`Response: ${response.status} with body:${responseBody}`);

    if (response.status !== 200) {
        console.error('Failed to get pet details.');
        alert("An unexpected error has occurred.");
        return;
    }
    if (responseBody.length > 1) {
        document.getElementById("profile-image").src = "data:image/png;base64," + responseBody;
        return;
    }
    console.log("No profile picture is set.");
}

window.onload = getPetDetails();