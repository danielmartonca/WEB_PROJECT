async function getPhotos() {
    try {
        const token = window.localStorage.getItem("JWT");
        if (token === null) {
            console.error("No token extracted from local storage.");
            alert("You are not logged in to view this page.")
            window.location.href = "/login.html"
            return;
        }

        const response = await fetch("/getPetImages", {
            method: 'GET', headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        let responseBody = JSON.parse(await response.text());
        console.log(`Response: ${response.status} with body:${responseBody.length} files.`);

        if (response.status !== 200) {
            console.error('Failed to get pet details.');
            alert("An unexpected error has occurred.");
            return;
        }

        const gallery = document.getElementById('gallery');

        responseBody.forEach((imageBytes, index) => {
            let div = document.createElement("div");
            div.id = 'pet' + index;
            let img = document.createElement('img');
            img.alt = 'petImage'
            img.width = 600;
            img.height = 600;
            img.src = "data:image/png;base64," + imageBytes;
            img.onclick = function () {
                let imgFullscreen = document.getElementById("fullscreen");
                imgFullscreen.src = "data:image/jpg;base64," + imageBytes;
                imgFullscreen.style.display="block";
            }

            div.appendChild(img);
            gallery.appendChild(div);
        })
    } catch (e) {
        console.error(e);
        alert("An unexpected error has occurred.");
    }

}

async function addPhoto() {
    //TODO
}

window.onload = getPhotos();