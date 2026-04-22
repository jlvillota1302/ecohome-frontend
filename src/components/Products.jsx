import { useEffect, useState } from 'react';

export default function Products({ token, onGoChat, onLogout }) {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadProducts() {
    const res = await fetch('http://localhost:3000/products', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (res.ok) {
      setProducts(data);
    }
  }

  async function loadStats() {
    const res = await fetch('http://localhost:3000/users/me/stats', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (res.ok) {
      setStats(data);
    }
  }

  async function createProduct() {
    const name = prompt('Nombre del producto');
    const price = prompt('Precio del producto');

    if (!name || !price) return;

    const res = await fetch('http://localhost:3000/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        price: Number(price),
      }),
    });

    if (res.ok) {
      await loadProducts();
      await loadStats();
    } else {
      const error = await res.json();
      alert(error.message || 'Error creando producto');
    }
  }

  useEffect(() => {
    async function loadData() {
      await loadProducts();
      await loadStats();
      setLoading(false);
    }

    loadData();
  }, []);

  if (loading) return <p>Cargando productos...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>
        {stats ? `${stats.username} (${stats.productsCount})` : 'Productos'}
      </h2>

      <div style={{ marginBottom: 20 }}>
        <button onClick={createProduct}>Crear producto</button>{' '}
        <button onClick={onGoChat}>Ir al chat</button>{' '}
        <button onClick={onLogout}>Cerrar sesión</button>
      </div>

      <table border="1" cellPadding="10" style={{ width: '100%', background: 'white', color: 'black' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Creador</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>{product.creator_username || 'Sin creador'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}