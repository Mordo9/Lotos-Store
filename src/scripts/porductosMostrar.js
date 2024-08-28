document.addEventListener('DOMContentLoaded', () => {
    fetch('/saved-products')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const tableBody = document.querySelector('#savedProducts tbody');
                data.products.forEach(product => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td><img src="${product.image}" alt="${product.title}" width="100"></td>
                        <td>${product.title}</td>
                        <td>${product.price}</td>
                    `;
                    tableBody.appendChild(row);
                });
            } else {
                alert('No se pudieron cargar los productos guardados.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al cargar los productos guardados.');
        });
});
