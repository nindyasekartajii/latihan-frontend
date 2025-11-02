const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const filePath = path.join(__dirname, 'users.json');

// Baca data dari file
function readUsers() {
  if (!fs.existsSync(filePath)) return [];
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
}

// Tulis data ke file
function writeUsers(users) {
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
}

router.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Semua field wajib diisi' });
  }

  const users = readUsers();
  const existing = users.find(u => u.email === email);
  if (existing) {
    return res.status(400).json({ message: 'Email sudah terdaftar' });
  }

  users.push({ name, email, password });
  writeUsers(users);

  res.status(201).json({ message: 'Registrasi berhasil' });
});

module.exports = router;