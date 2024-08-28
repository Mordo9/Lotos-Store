document.addEventListener('DOMContentLoaded', function() {
    const logoutButton = document.getElementById('logoutButton');

    logoutButton.addEventListener('click', function() {
        fetch('/logout')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Limpiar localStorage
                    localStorage.removeItem('loggedIn');
                    localStorage.removeItem('userEmail');
                    // Redirigir a la página de inicio de sesión
                    window.location.href = 'login.html';
                } else {
                    alert(data.message);
                }
            })
            .catch(error => console.error('Error:', error));
    });
});
