document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-name');
    const categoryFilter = document.getElementById('category-filter');
    const products = document.querySelectorAll('.producto');

    function filterProducts() {
        const searchValue = searchInput.value.toLowerCase();
        const selectedCategory = categoryFilter.value;

        products.forEach(product => {
            const productName = product.querySelector('h3').textContent.toLowerCase();
            const productCategory = product.dataset.categoria;

            const matchesSearch = productName.includes(searchValue);
            const matchesCategory = selectedCategory === 'all' || productCategory === selectedCategory;

            if (matchesSearch && matchesCategory) {
                product.style.display = '';
            } else {
                product.style.display = 'none';
            }
        });
    }

    searchInput.addEventListener('input', filterProducts);
    categoryFilter.addEventListener('change', filterProducts);
});
