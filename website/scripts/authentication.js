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


    console.log(`Will send registration request with body:\n${json}`);
    let response = await fetch('/authentication/register', {
        method: 'POST', headers: {
            'Accept': 'application/json', 'Content-Type': 'application/json'
        }, body: JSON.stringify(json)
    })
    if (response.status === 200) {
        let responseBody = await response.text();
        console.log(responseBody);

    }
    else console.error("eroare");


}