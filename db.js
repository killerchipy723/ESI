const mysql = require('mysql');

let db;

function handleDisconnect() {
    db = mysql.createConnection({
        host: '200.58.106.156',
        user: 'c2710325_killer',
        password: 'SistemaIES6021',
        database: 'c2710325_sistema'
    });

    db.connect(err => {
        if (err) {
            console.log('Error de conexión:', err);
            setTimeout(handleDisconnect, 2000);
        }
    });

    db.on('error', err => {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        } else {
            throw err;
        }
    });
}

handleDisconnect();

module.exports = db;
