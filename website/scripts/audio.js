async function getAudio() {
    try {
        const token = window.localStorage.getItem("JWT");
        if (token === null) {
            console.error("No token extracted from local storage.");
            alert("You are not logged in to view this page.")
            window.location.href = "/login.html"
            return;
        }

        const response = await fetch("/getPetAudio", {
            method: 'GET', headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        let responseBody = JSON.parse(await response.text());
        console.log(`Response: ${response.status} with body:${responseBody.length} files.`);

        if (response.status !== 200) {
            console.error('Failed to get pet audio.');
            alert("An unexpected error has occurred.");
            return;
        }

        const gallery = document.getElementById('audioGallery');

        responseBody.forEach((videoBytes, index) => {
            let div = document.createElement("div");
            div.className = "asezare";
            let audio = document.createElement("audio");
            audio.controls = true;
            audio.src = "data:audio/ogg;base64," + videoBytes;
            let source = document.createElement('source');
            source.type = "audio/mpeg";
            audio.appendChild(source);
            div.appendChild(audio);
            gallery.appendChild(div);
        })
    } catch (e) {
        console.error(e);
        alert("An unexpected error has occurred.");
    }

}

async function uploadAudio() {
    let file = document.getElementById("fileInput").files[0];
    if (file === undefined) return;

    if (!file.name.endsWith(".mp3")) {
        alert("Only .mp3 files are supported.");
        return;
    }
    const fr = new FileReader();
    fr.readAsArrayBuffer(file);
    fr.onload = async function (evt) {
        const token = window.localStorage.getItem("JWT");
        if (token === null) {
            console.error("No token extracted from local storage.");
            alert("You are not logged in to add new audio.")
            window.location.href = "/login.html"
            return;
        }

        const json = {
            'file': file.name,
            'bytes': btoa([].reduce.call(new Uint8Array(evt.target.result),function(p,c){return p+String.fromCharCode(c)},''))
        }

        const response = await fetch("/addPetAudio", {
            method: 'PUT', headers: {
                'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json'
            }, body: JSON.stringify(json)
        });

        let responseBody = await response.text();
        console.log(`Response: ${response.status} with body: \n${responseBody}.`);

        if (response.status !== 200) {
            console.error('Failed to get pet audio.');
            alert("An unexpected error has occurred.");
            return;
        }
        alert("Upload successful");
        window.location.reload();
    }
}

window.onload = getAudio();