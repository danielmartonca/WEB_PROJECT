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
                imgFullscreen.style.display = "block";
            }

            div.appendChild(img);
            gallery.appendChild(div);
        })
    } catch (e) {
        console.error(e);
        alert("An unexpected error has occurred.");
    }

}

async function uploadPhoto() {

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
            'file': file.name,
            'bytes': btoa(String.fromCharCode(...new Uint8Array(evt.target.result)))
        }

        const response = await fetch("/addPetImage", {
            method: 'PUT', headers: {
                'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json'
            }, body: JSON.stringify(json)
        });

        let responseBody = await response.text();
        console.log(`Response: ${response.status} with body: \n${responseBody}.`);

        if (response.status !== 200) {
            console.error('Failed to get pet details.');
            alert("An unexpected error has occurred.");
            return;
        }
        alert("Upload successful");
        window.location.reload();
    }
}

window.onload = getPhotos();