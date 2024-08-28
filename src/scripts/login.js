document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(loginForm);
        const email = formData.get('email');
        const password = formData.get('password');

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            if (data.success) {
                alert(data.message); // Aquí puedes mostrar una notificación, redireccionar, etc.
                window.location.href = data.redirectTo; // Redirige al usuario a la página indicada
            } else {
                alert(data.message); // Muestra un mensaje de error al usuario
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error.message);
            alert('Error interno al procesar el inicio de sesión. Inténtalo de nuevo más tarde.');
        }
    });
});
