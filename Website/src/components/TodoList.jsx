import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'https://6874dd20dd06792b9c95996f.mockapi.io/api/ecommerece';

const TodoList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ name: '', price: '', image: '' });
  const [editId, setEditId] = useState(null);

  const fetchProducts = () => {
    setLoading(true);
    axios.get(API_URL)
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch products');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.name || !form.price) return;
    if (editId) {
      axios.put(`${API_URL}/${editId}`, form).then(() => {
        fetchProducts();
        setForm({ name: '', price: '', image: '' });
        setEditId(null);
      });
    } else {
      axios.post(API_URL, form).then(() => {
        fetchProducts();
        setForm({ name: '', price: '', image: '' });
      });
    }
  };

  const handleEdit = product => {
    setForm({ name: product.name, price: product.price, image: product.image || '' });
    setEditId(product.id);
  };

  const handleDelete = id => {
    axios.delete(`${API_URL}/${id}`).then(() => fetchProducts());
  };

  return (
    <div className="container">
      <h2>Todo List App (Product Manager)</h2>
      <form onSubmit={handleSubmit} style={{marginBottom:'2rem'}}>
        <input
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          style={{marginRight:'1rem'}}
        />
        <input
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          type="number"
          style={{marginRight:'1rem'}}
        />
        <input
          name="image"
          placeholder="Image URL (optional)"
          value={form.image}
          onChange={handleChange}
          style={{marginRight:'1rem'}}
        />
        <button type="submit">{editId ? 'Update' : 'Add'} Product</button>
        {editId && <button type="button" onClick={() => { setEditId(null); setForm({ name: '', price: '', image: '' }); }} style={{marginLeft:'1rem'}}>Cancel</button>}
      </form>
      {loading ? <p>Loading...</p> : error ? <p>{error}</p> : (
        <ul style={{listStyle:'none',padding:0}}>
          {products.map(product => (
            <li key={product.id} style={{marginBottom:'1rem',borderBottom:'1px solid #eee',paddingBottom:'1rem'}}>
              <img src={product.image || 'https://via.placeholder.com/50'} alt={product.name} style={{width:50,verticalAlign:'middle',marginRight:'1rem'}} />
              <span style={{fontWeight:'bold'}}>{product.name}</span> - ${product.price}
              <button onClick={() => handleEdit(product)} style={{marginLeft:'1rem'}}>Edit</button>
              <button onClick={() => handleDelete(product.id)} style={{marginLeft:'0.5rem',color:'red'}}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodoList;