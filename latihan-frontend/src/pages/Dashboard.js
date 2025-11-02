import React, { useEffect, useState, useCallback } from 'react';
import { Table, Button, Modal, Form, Container } from 'react-bootstrap';
import api from '../api/api'; // axios instance with baseURL

function Dashboard() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: '', description: '' });
  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem('token');

  const fetchData = useCallback(async () => {
    try {
      const res = await api.get('/items', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(res.data);
    } catch (err) {
      console.error('Fetch error:', err.response?.data || err.message);
    }
  }, [token]);

  const handleSave = async () => {
    console.log('Form:', form);
    console.log('Token:', token);

    try {
      if (!form.title || !form.description) {
        alert('Judul dan deskripsi wajib diisi');
        return;
      }

      if (editId) {
        await api.put(`/items/${editId}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await api.post('/items', form, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      setForm({ title: '', description: '' });
      setEditId(null);
      setShow(false);
      fetchData();
    } catch (err) {
      console.error('Save error:', err.response?.data || err.message);
      alert('Gagal menyimpan data: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/items/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      console.error('Delete error:', err.response?.data || err.message);
    }
  };

  const handleEdit = (item) => {
    setForm({ title: item.title, description: item.description });
    setEditId(item.id);
    setShow(true);
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Dashboard</h3>
        <Button onClick={() => {
          console.log('Klik Tambah Data');
          setShow(true);
        }}>
<div className="d-flex gap-2">
  <Button variant="outline-danger" onClick={() => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }}>
    Logout
  </Button>
  <Button onClick={() => setShow(true)}>
    Tambah Data
  </Button>
</div>   
          Tambah Data
        </Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Judul</th>
            <th>Deskripsi</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center">Belum ada data</td>
            </tr>
          ) : (
            items.map((item, i) => (
              <tr key={item.id}>
                <td>{i + 1}</td>
                <td>{item.title}</td>
                <td>{item.description}</td>
                <td>
                  <Button size="sm" variant="warning" className="me-2" onClick={() => handleEdit(item)}>Edit</Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(item.id)}>Hapus</Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editId ? 'Edit Data' : 'Tambah Data'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Judul</Form.Label>
              <Form.Control
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Masukkan judul"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Deskripsi</Form.Label>
              <Form.Control
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Masukkan deskripsi"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>Batal</Button>
          <Button variant="primary" onClick={handleSave}>Simpan</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Dashboard;