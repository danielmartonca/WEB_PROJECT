async function attemptRegister() {
    const name = document.getElementById('name').value;
    const familyname = document.getElementById('familyname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('parola').value;
    const gender = document.getElementById('gender').value;

    const json = {
        name: name,
        familyname: familyname,
        email: email,
        password: password,
        gender: gender
    };

    let response = await fetch('/authentication/register',
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(json)
        })
    if (response.status === 200) {
        let responseBody = await response.text();
        console.log(responseBody);

    } else
        console.error("eroare");


}