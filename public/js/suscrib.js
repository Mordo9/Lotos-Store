document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('subscriptionForm');
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Evita que el formulario se envíe automáticamente

        const email = document.getElementById('emailInput').value;
        
        // Aquí puedes hacer una llamada fetch para verificar si el correo ya está registrado
        fetch('/check-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email })
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Network response was not ok');
            }
        })
        .then(data => {
            if (data.exists) {
                alert('Usted ya se encuentra suscrito(a).'); // Alerta si el correo ya está registrado
            } else {
                // Si no está registrado, puedes proceder a enviar el formulario
                fetch('/subscribe', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email: email })
                })
                .then(response => {
                    if (response.ok) {
                        alert('¡Gracias por suscribirte!'); // Mensaje de éxito
                        form.reset(); // Reinicia el formulario
                    } else {
                        throw new Error('Network response was not ok');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});
