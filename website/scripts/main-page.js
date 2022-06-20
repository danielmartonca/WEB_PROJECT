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

    await getPetProfilePicture();
}

async function updatePetDetails() {
    const token = window.localStorage.getItem("JWT");
    if (token === null) {
        console.error("No token extracted from local storage.");
        alert("You are not logged in to view this page.")
        window.location.href = "/login.html"
        return;
    }

    const sizeElement = document.getElementById('size');
    const healthStatusElement = document.getElementById('health');
    const prefferedFoodElement = document.getElementById('food');
    const ageElement = document.getElementById('age');
    const breedElement = document.getElementById('breed');
    const dateOfBirthElement = document.getElementById('birth');

    const json = {
        'Size': sizeElement.value.length !== 0 ? sizeElement.value : sizeElement.placeholder,
        'HealthStatus': healthStatusElement.value.length !== 0 ? healthStatusElement.value : healthStatusElement.placeholder,
        'PrefferedFood': prefferedFoodElement.value.length !== 0 ? prefferedFoodElement.value : prefferedFoodElement.placeholder,
        'Age': ageElement.value.length !== 0 ? ageElement.value : ageElement.placeholder,
        'Breed': breedElement.value.length !== 0 ? breedElement.value : breedElement.placeholder,
        'DateOfBirth': dateOfBirthElement.value.length !== 0 ? dateOfBirthElement.value : dateOfBirthElement.placeholder,
    }

    //TODO maybe regex?

    console.log(`Will send registration request with body:\n${JSON.stringify(json)}`);
    let response = await fetch("/updatePetDetails", {
        method: 'POST', headers: {
            'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json'
        }, body: JSON.stringify(json)
    })

    let responseBody = await response.text();
    console.log(`Response: ${response.status} with body:${JSON.parse(responseBody)}`);

    //if any error has occurred
    if (response.status !== 200) {// it's not OK
        alert(responseBody);
        return;
    }
    console.log("Successfully updated pet details");
    alert("Pet details have been updated.")
    window.location.reload();
}

async function uploadProfilePicture() {
    document.getElementById("fileInput").click();
    document.getElementById("fileInput").addEventListener('input', function () {
        let file = document.getElementById("fileInput").files[0];
        if (file === undefined) return;

        if (!file.name.endsWith(".jpg")) {
            alert("Only .jpeg files are supported.");
            return;
        }
        const fr = new FileReader();
        fr.readAsArrayBuffer(file);
        fr.onload = async function (evt) {
            const token = window.localStorage.getItem("JWT");
            if (token === null) {
                console.error("No token extracted from local storage.");
                alert("You are not logged in to add new photo.")
                window.location.href = "/login.html"
                return;
            }

            const json = {
                'file': file.name, 'bytes': btoa(String.fromCharCode(...new Uint8Array(evt.target.result)))
            }

            const response = await fetch("/uploadPetProfilePicture", {
                method: 'PUT', headers: {
                    'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json'
                }, body: JSON.stringify(json)
            });

            let responseBody = await response.text();
            console.log(`Response: ${response.status} with body: \n${responseBody}.`);

            if (response.status !== 200) {
                console.error('Failed to update profile picture.');
                alert("An unexpected error has occurred.");
                return;
            }
            alert("Upload successful.");
            window.location.reload();
        }
    });

}

window.onload = getPetDetails;
