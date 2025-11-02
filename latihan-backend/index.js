const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const SECRET_KEY = 'rahasia-nindya';
const usersPath = path.join(__dirname, 'users.json');
const itemsPath = path.join(__dirname, 'items.json');

// Fungsi baca & tulis file
function readData(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
}

function writeData(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Load data awal
let users = readData(usersPath);
let items = readData(itemsPath);

// Middleware verifikasi token
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Token tidak ditemukan' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Token tidak valid' });
  }
}

// Endpoint register
app.post('/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Semua field wajib diisi' });
  }

  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'Email sudah terdaftar' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ name, email, password: hashedPassword });
  writeData(usersPath, users);

  res.json({ message: 'Registrasi berhasil! Silakan login.' });
});

// Endpoint login
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ message: 'Email tidak ditemukan' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: 'Password salah' });

  const token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
});

// Ambil semua item
app.get('/items', verifyToken, (req, res) => {
  res.json(items);
});

// Tambah item baru
app.post('/items', verifyToken, (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({ message: 'Judul dan deskripsi wajib diisi' });
  }

  const newItem = {
    id: items.length + 1,
    title,
    description
  };

  items.push(newItem);
  writeData(itemsPath, items);
  res.json({ message: 'Item berhasil ditambahkan', item: newItem });
});

// Edit item
app.put('/items/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const item = items.find(i => i.id === parseInt(id));

  if (!item) return res.status(404).json({ message: 'Item tidak ditemukan' });
  if (!title || !description) return res.status(400).json({ message: 'Judul dan deskripsi wajib diisi' });

  item.title = title;
  item.description = description;
  writeData(itemsPath, items);
  res.json({ message: 'Item berhasil diupdate', item });
});

// Hapus item
app.delete('/items/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const index = items.findIndex(i => i.id === parseInt(id));

  if (index === -1) return res.status(404).json({ message: 'Item tidak ditemukan' });

  items.splice(index, 1);
  writeData(itemsPath, items);
  res.json({ message: 'Item berhasil dihapus' });
});

// Jalankan server
app.listen(5000, () => {
  console.log('✅ Server running on http://localhost:5000');
});