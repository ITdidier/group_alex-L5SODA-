// checkpass.js
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');

const conn = mysql.createConnection({ host:'localhost', user:'root', password:'', database:'focal' });
const username = 'uwishatse'; // change if needed
const plain = '567890';       // change to the plain password you think

conn.query('SELECT password FROM users WHERE username = ? LIMIT 1', [username], (err, rows) => {
  if (err) return console.error(err);
  if (!rows || rows.length === 0) return console.error('No user found');
  const hash = rows[0].password;
  bcrypt.compare(plain, hash, (e, ok) => {
    if (e) return console.error('bcrypt error', e);
    console.log('bcrypt.compare result:', ok); // true = match
    conn.end();
  });
});
