const express = require('express');
const mysql = require('mysql2');
const path = require('path')
const bodyParser = require('body-parser');


const app = express();

//Configuracion para el uso de peticiones post 
app.use(bodyParser.urlencoded({extended:false}));

//paginas staticas(esti)
app.use(express.static(path.join(__dirname, 'public')));

//plantillas sean dinamicas 
app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'));

// Conexion a la base de datos 
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'usuario_nuv',
    port: 3308
});


// Comprobacion de la conexion a la base de daros 
db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Connected to the MySQL database');
    }
});

// Iniciamos el server 
const port = 3009;
app.listen(port,()=>{
    console.log(`Servidor en funcionamiento desde http://localhost:${port}`);
});

// Read
app.get('/', (req, res) => {
    const query = 'SELECT * FROM users';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            res.send('Error');
        } else {
            res.render('index', { users: results });
        }
    });
});

//Agregar usuarios 

app.post('/add', (req, res) => {
    const { nombre, apellido_paterno, apellido_materno, email, tel, direccion, ciudad, codigo_postal, edad, genero } = req.body;
    const query = 'INSERT INTO users (nombre, apellido_paterno, apellido_materno, email, tel, direccion, ciudad, codigo_postal, edad, genero) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [nombre, apellido_paterno, apellido_materno, email, tel, direccion, ciudad, codigo_postal, edad, genero], (err) => {
        if (err) {
            console.error('Error adding user:', err);
            res.send('Error');
        } else {
            res.redirect('/');
        }
    });
});

// Mostrar formulario para agregar nuevo usuario
app.get('/CUser', (req, res) => {
    res.render('CUser');
});

// Ruta GET para mostrar el formulario de edición con los datos del usuario
app.get('/edit/:id', (req, res) => {
    const { id } = req.params;  
    const query = 'SELECT * FROM users WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);  
            res.send('Error');
        } else {
            const user = results[0]; 
            res.render('edit', { user });
        }
    });
});
// Ruta POST para manejar la actualización de los datos del usuario
app.post('/edit/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, apellido_paterno, apellido_materno, email, tel, direccion, ciudad, codigo_postal, edad, genero } = req.body;
    const query = 'UPDATE users SET nombre = ?, apellido_paterno = ?, apellido_materno = ?, email = ?, tel = ?, direccion = ?, ciudad = ?, codigo_postal = ?, edad = ?, genero = ? WHERE id = ?';
    db.query(query, [nombre, apellido_paterno, apellido_materno, email, tel, direccion, ciudad, codigo_postal, edad, genero, id], (err, results) => {
        if (err) {
            console.error('Error updating user:', err);
            return res.send('Error');
        }
        const selectQuery = 'SELECT * FROM users';
        db.query(selectQuery, (err, users) => {
            if (err) {
                console.error('Error fetching users:', err);
                return res.send('Error');
            }else{
                res.redirect('/');
            }
        });
    });
});



//eliminar usuario
app.get('/delete/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM users WHERE id = ?';
    db.query(query, [id], (err) => {
        if (err) {
            console.error('Error deleting user:', err);
            res.send('Error');
        } else {
            res.redirect('/');
        }
    });
});
