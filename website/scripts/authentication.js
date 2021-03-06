const nameRegex = RegExp("^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆŠŽ∂ð,.'-]+$")
const familyNameRegex = RegExp("^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆŠŽ∂ð,.'-]+$")
const emailRegex = RegExp("^[\\w-\.]+@([\\w-]+\\.)+[\\w-]{2,4}$")
const passwordRegex = RegExp("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$")

async function attemptRegister() {
    const name = document.getElementById('name').value;
    const familyname = document.getElementById('familyname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('parola').value;
    const gender = document.getElementById('gender').value;

    const json = {
        name: name, familyname: familyname, email: email, password: password, gender: gender
    };
    if (nameRegex.test(json.name) === false) {
        alert("Invalid name.")
        return;
    }
    if (familyNameRegex.test(json.familyname) === false) {
        alert("Invalid family name.")
        return;
    }
    if (emailRegex.test(json.email) === false) {
        alert("Invalid email.")
        return;
    }
    if (passwordRegex.test(json.password) === false) {
        alert("Invalid password.")
        return;
    }

    console.log(`Will send registration request with body:\n${JSON.stringify(json)}`);
    let response = await fetch('/authentication/register', {
        method: 'POST', headers: {
            'Accept': 'application/json', 'Content-Type': 'application/json'
        }, body: JSON.stringify(json)
    })

    let responseBody = await response.text();
    console.log(`Response: ${response.status} with body:${responseBody}`);

    //if any error has occurred
    if (response.status !== 201) {//CREATED
        alert(responseBody);
        return;
    }

    console.log("Registration successful.")
    window.location.href = "/Login.html";
}

async function attemptLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('parola').value;

    const json = {
        email: email, password: password,
    };

    if (emailRegex.test(json.email) === false) {
        alert("Invalid email.")
        return;
    }
    if (passwordRegex.test(json.password) === false) {
        alert("Invalid password.")
        return;
    }

    console.log(`Will send registration request with body:\n${JSON.stringify(json)}`);
    let response = await fetch('/authentication/login', {
        method: 'POST', headers: {
            'Accept': 'application/json', 'Content-Type': 'application/json'
        }, body: JSON.stringify(json)
    })
    //
    let responseBody = await response.text();
    console.log(`Response: ${response.status} with body:${responseBody}`);

    //if any error has occurred
    if (response.status !== 200) {// it's not OK
        alert(responseBody);
        return;
    }

    if (response.headers.has('Authorization') === false) // does not have authorization header for some reason
    {
        alert("Internal server error. Server failed to send header.");
        return;
    }

    let token = '';
    try {
        token = response.headers.get('Authorization').split('Bearer ')[1];
    } catch (e) {
        alert("Internal server error. Server sent header but it's not valid.");
        return;
    }
    window.localStorage.setItem('JWT', token);

    console.log("Login successful.")
    window.location.href = "/MainPage.html";
}

function signOut() {
    window.localStorage.removeItem("JWT")
    window.location.href = "/Login.html"
}