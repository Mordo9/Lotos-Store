document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Mostrar mensaje de éxito y redirigir
                alert(data.message);
                window.location.href = data.redirectTo || '/index.html'; // Redirige a index.html o a la URL proporcionada
            } else {
                // Mostrar mensaje de error
                alert(data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    });
});
