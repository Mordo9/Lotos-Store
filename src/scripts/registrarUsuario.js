// registrarUsuario.js

function registrarUsuario() {
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Validación básica de contraseñas
    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden. Por favor, inténtalo de nuevo.');
        return;
    }

    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            firstName,
            lastName,
            email,
            password,
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Mostrar notificación del servidor como un alert
            mostrarNotificacion(data.notification);

            // Redirigir después de un breve retraso
            setTimeout(() => {
                window.location.href = data.redirectTo;
            }, 3000); // Redirigir después de 3 segundos (ajusta según necesites)
        } else {
            // Mostrar mensaje de error si falla el registro
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Error al registrar usuario:', error);
        alert('Hubo un error al registrar el usuario.');
    });
}

function mostrarNotificacion(mensaje) {
    alert(mensaje);
}

// Evento submit del formulario
document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita el envío automático del formulario
    registrarUsuario(); // Llama a la función de registro de usuario
});
