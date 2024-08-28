document.addEventListener('DOMContentLoaded', () => {
    const saveButton = document.getElementById('saveProductBtn');

    saveButton.addEventListener('click', () => {
        const title = document.querySelector('.text h2').innerText;
        const price = document.querySelector('.text p:nth-child(2)').innerText.replace('Precio: $', '');
        const image = document.querySelector('.carousel-item.active img').src;

        console.log('Title:', title);
        console.log('Price:', price);
        console.log('Image URL:', image);

        fetch('/save-product', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, price, image })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Producto guardado exitosamente.');
                } else {
                    alert('Error al guardar el producto: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al guardar el producto.');
            });
    });
});