// scripts/dbConnection.js
const mysql = require('mysql2');

// Configuración de la conexión
const connection = mysql.createConnection({
    host: 'localhost',      // Cambia esto por el host de tu base de datos
    user: 'root',     // Cambia esto por tu nombre de usuario de la base de datos
    password: '4eZt@wR7yXu#2iS', // Cambia esto por tu contraseña de la base de datos
    database: 'db_lotos_store' // Cambia esto por el nombre de tu base de datos
});

// Conectar a la base de datos
connection.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err.stack);
        return;
    }
    console.log('Conexión exitosa a la base de datos con el ID', connection.threadId);
});

// Exportar la conexión para usarla en otros archivos
module.exports = connection;
