document.addEventListener('DOMContentLoaded', () => {
    const subscriptionForm = document.getElementById('subscriptionForm');
    const notificationContainer = document.getElementById('notificationContainer');

    subscriptionForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(subscriptionForm);
        const email = formData.get('email');

        try {
            const response = await fetch('/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();
            if (data.success) {
                showNotification('success', data.message);
                // Aquí podrías actualizar la interfaz o redirigir al usuario si es necesario
            } else {
                showNotification('error', data.message);
            }
        } catch (error) {
            console.error('Error al suscribirse:', error.message);
            showNotification('error', 'Error interno al procesar la suscripción.');
        }
    });

    function showNotification(type, message) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        notificationContainer.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 5000); // Eliminar la notificación después de 5 segundos
    }
});
