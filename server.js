const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const port = 3000;

const bcrypt = require('bcrypt');
const saltRounds = 10; // Número de rondas de sal para la generación del hash

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '4eZt@wR7yXu#2iS',
    database: 'db_lotos_store'
});

connection.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err.stack);
        return;
    }
    console.log('Conexión exitosa a la base de datos con el ID', connection.threadId);
});
module.exports = connection;

// Middleware para parsear JSON y datos de formularios
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware para sesiones
app.use(session({
    secret: 'mi_secreto_super_secreto',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Cambia a true si estás usando HTTPS
}));

// Middleware para servir archivos estáticos desde la carpeta "public"
app.use(express.static("public"));

// Ruta para manejar el registro de usuarios
app.post('/register', (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    // Verificar si el correo ya está registrado
    const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
    connection.query(checkEmailQuery, [email], (err, results) => {
        if (err) {
            console.error('Error al verificar el correo:', err.stack);
            res.status(500).json({ success: false, message: 'Error al verificar el correo.' });
            return;
        }

        if (results.length > 0) {
            // Correo ya registrado
            res.status(400).json({ success: false, message: 'El correo ya se encuentra registrado.' });
        } else {
            // Correo no registrado, proceder con la inserción
            // Insertar el usuario con la contraseña en texto claro en la base de datos
            const insertUserQuery = 'INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)';
            connection.query(insertUserQuery, [firstName, lastName, email, password], (err, result) => {
                if (err) {
                    console.error('Error al insertar datos:', err.stack);
                    res.status(500).json({ success: false, message: 'Error al registrar el usuario.' });
                    return;
                }
                res.status(200).json({ success: true, message: 'Usuario registrado exitosamente.', redirectTo: 'login.html' });
            });
        }
    });
});

// Ruta para manejar el envío de sugerencias
app.post('/submit-suggestion', (req, res) => {
    const { nombre, correo, telefono, presentacion } = req.body;

    // Insertar la sugerencia en la base de datos
    const insertSuggestionQuery = 'INSERT INTO sugerencias (nombre, correo, telefono, presentacion) VALUES (?, ?, ?, ?)';
    connection.query(insertSuggestionQuery, [nombre, correo, telefono, presentacion], (err, result) => {
        if (err) {
            console.error('Error al insertar la sugerencia:', err.stack);
            res.status(500).json({ success: false, message: 'Error al enviar la sugerencia.' });
            return;
        }
        res.status(200).json({ success: true, message: 'Sugerencia enviada correctamente.' });
    });
});
// Ruta para manejar el inicio de sesión
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const getUserQuery = 'SELECT id, email, password FROM users WHERE email = ?';
    connection.query(getUserQuery, [email], (err, results) => {
        if (err) {
            console.error('Error al verificar el inicio de sesión:', err);
            return res.status(500).json({ success: false, message: 'Error al verificar el inicio de sesión.' });
        }

        if (results.length === 0) {
            return res.status(400).json({ success: false, message: 'Correo o contraseña incorrectos.' });
        }

        const storedPassword = results[0].password;

        if (password === storedPassword) {
            req.session.userId = results[0].id;
            req.session.email = results[0].email;
            res.status(200).json({ success: true, message: 'Inicio de sesión exitoso.', redirectTo: 'index.html' });
        } else {
            res.status(400).json({ success: false, message: 'Correo o contraseña incorrectos.' });
        }
    });
});




// Ruta para cerrar sesión
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error al cerrar sesión.' });
        }
        res.clearCookie('connect.sid');
        res.status(200).json({ success: true, message: 'Sesión cerrada exitosamente.' });
    });
});

app.get('/session/status', (req, res) => {
    if (req.session.userId) {
        // Si existe req.session.userId, significa que hay una sesión abierta
        res.status(200).json({ loggedIn: true, userId: req.session.userId, email: req.session.email });
    } else {
        // Si no existe req.session.userId, no hay sesión abierta
        res.status(401).json({ loggedIn: false, message: 'Usuario no autenticado.' });
    }
});


app.get('/user-info', (req, res) => {
    if (req.session.userId) {
        res.status(200).json({ success: true, email: req.session.email });
    } else {
        res.status(401).json({ success: false, message: 'Usuario no autenticado.' });
    }
});


// Ruta para suscripciones
app.post('/subscribe', (req, res) => {
    const email = req.body.email;

    // Verificar si el correo electrónico ya está registrado
    const checkEmailQuery = 'SELECT * FROM suscripciones WHERE email = ?';
    connection.query(checkEmailQuery, [email], (err, results) => {
        if (err) {
            console.error('Error al verificar el correo electrónico:', err);
            return res.status(500).send('Error interno al procesar la suscripción');
        }

        // Si el correo electrónico ya está registrado, enviar una alerta
        if (results.length > 0) {
            return res.status(400).send('Usted ya se encuentra suscrito(a).');
        }

        // Si el correo electrónico no está registrado, insertarlo en la base de datos
        const insertEmailQuery = 'INSERT INTO suscripciones (email) VALUES (?)';
        connection.query(insertEmailQuery, [email], (err, result) => {
            if (err) {
                console.error('Error al guardar la suscripción en la base de datos:', err);
                return res.status(500).send('Error interno al procesar la suscripción');
            }

            console.log('Correo electrónico guardado en la base de datos:', email);
            res.status(200).send('Te has suscrito correctamente. Revisa tu correo para confirmar.');
        });
    });
});

app.post('/save-product', (req, res) => {
    if (!req.session.userId) {
        console.log('Usuario no autenticado.');
        return res.status(401).json({ success: false, message: 'Usuario no autenticado.' });
    }

    const { title, price, image } = req.body;
    const userId = req.session.userId;

    console.log('Usuario ID:', userId);
    console.log('Producto a guardar:', { title, price, image });

    const checkQuery = 'SELECT * FROM saved_products WHERE user_id = ? AND title = ?';
    connection.query(checkQuery, [userId, title], (err, result) => {
        if (err) {
            console.error('Error al verificar el producto:', err);
            return res.status(500).json({ success: false, message: 'Error al verificar el producto.' });
        }

        console.log('Resultado de la verificación:', result);

        if (result.length > 0) {
            return res.status(400).json({ success: false, message: 'Este producto ya está en tu lista de guardados.' });
        } else {
            const insertQuery = 'INSERT INTO saved_products (user_id, title, price, image) VALUES (?, ?, ?, ?)';
            connection.query(insertQuery, [userId, title, price, image], (err, result) => {
                if (err) {
                    console.error('Error al guardar el producto:', err);
                    return res.status(500).json({ success: false, message: 'Error al guardar el producto.' });
                }

                return res.status(200).json({ success: true, message: 'Producto guardado exitosamente.' });
            });
        }
    });
});


app.get('/saved-products', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ success: false, message: 'Usuario no autenticado.' });
    }

    const userId = req.session.userId;
    const getSavedProductsQuery = 'SELECT title, price, image FROM saved_products WHERE user_id = ?';
    connection.query(getSavedProductsQuery, [userId], (err, results) => {
        if (err) {
            console.error('Error al obtener los productos guardados:', err);
            return res.status(500).json({ success: false, message: 'Error al obtener los productos guardados.' });
        }
        res.status(200).json({ success: true, products: results });
    });
});

// Iniciar el servidor Express
app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
