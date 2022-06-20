async function getPhotos() {
    try {
        const token = window.localStorage.getItem("JWT");
        if (token === null) {
            console.error("No token extracted from local storage.");
            alert("You are not logged in to view this page.")
            window.location.href = "/login.html"
            return;
        }

        const response = await fetch("/getPetPhotos", {
            method: 'GET', headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        let responseBody = JSON.parse(await response.json());
        console.log(`Response: ${response.status} with body:${responseBody.length} files.`);

        if (response.status !== 200) {
            console.error('Failed to get pet details.');
            alert("An unexpected error has occurred.");
            return;
        }

        //TODO add photos
        console.log("TODO")
    } catch (e) {
        console.error(e);
        alert("An unexpected error has occurred.");
    }

}

async function addPhoto() {
    //TODO
}

window.onload = getPhotos();