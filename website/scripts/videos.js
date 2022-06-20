async function getVideos() {
    try {
        const token = window.localStorage.getItem("JWT");
        if (token === null) {
            console.error("No token extracted from local storage.");
            alert("You are not logged in to view this page.")
            window.location.href = "/login.html"
            return;
        }

        const response = await fetch("/getPetVideos", {
            method: 'GET', headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        let responseBody = JSON.parse(await response.text());
        console.log(`Response: ${response.status} with body:${responseBody.length} files.`);

        if (response.status !== 200) {
            console.error('Failed to get pet videos.');
            alert("An unexpected error has occurred.");
            return;
        }

        const gallery = document.getElementById('videosGallery');

        responseBody.forEach((videoBytes, index) => {
            let div = document.createElement("div");
            div.id = 'petVideo' + index;
            div.className = "asezare";
            let video = document.createElement("video");
            video.width = 500;
            video.height = 500;
            video.controls = true;

            let source = document.createElement('source');
            source.width = 600;
            source.height = 600;
            source.src = "data:video/mp4;base64," + videoBytes;
            source.type = "video/mp4";
            video.appendChild(source);
            div.appendChild(video);
            gallery.appendChild(div);
        })
    } catch (e) {
        console.error(e);
        alert("An unexpected error has occurred.");
    }

}

async function uploadVideo() {
    document.getElementById("fileInput").click();
    document.getElementById("fileInput").addEventListener('input', function () {

        let file = document.getElementById("fileInput").files[0];
        if (file === undefined) return;

        if (!file.name.endsWith(".mp4")) {
            alert("Only .mp4 files are supported.");
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
                'file': file.name, // 'by':buff.toString('base64')
                'bytes': btoa([].reduce.call(new Uint8Array(evt.target.result), function (p, c) {
                    return p + String.fromCharCode(c)
                }, ''))
            }

            const response = await fetch("/addPetVideo", {
                method: 'PUT', headers: {
                    'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json'
                }, body: JSON.stringify(json)
            });

            let responseBody = await response.text();
            console.log(`Response: ${response.status} with body: \n${responseBody}.`);

            if (response.status !== 200) {
                console.error('Failed to get pet videos.');
                alert("An unexpected error has occurred.");
                return;
            }
            alert("Upload successful");
            window.location.reload();
        }
    });
}

window.onload = getVideos();