const loginButton = document.getElementById('login-button');
const errorMessage = document.getElementById('error-message');

loginButton.addEventListener('click', () => {
    try {
        const user = document.getElementById('username').value;
        const password = Number(document.getElementById('password').value);

        const response = axios.post(`http://localhost:3000/login`, {
            user,
            password
        })
            .then(result => {
                return window.location.href = result.data.url;
            })

    } catch (error) {
        return console.log(error);
    }
});