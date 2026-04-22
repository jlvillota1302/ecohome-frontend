
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export default function Chat({ token, onLogout, onBackProducts }) {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    const s = io('http://localhost:3000', {
      transports: ['websocket'],
      auth: {
        token
      }
    });

    setSocket(s);

    s.on('messages', (msgs) => {
      setMessages(msgs);
    });

    s.on('new-message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    s.on('connect_error', (err) => {
      console.error('Error de conexión al socket:', err.message);
    });

    return () => {
      s.disconnect();
    };
  }, [token]);

  function sendMessage(e) {
    e.preventDefault();

    if (!text.trim() || !socket) return;

    socket.emit('new-message', {
      text
    });

    setText('');
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Chat interno EcoHome</h2>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={onBackProducts}>Volver a productos</button>{' '}
        <button onClick={onLogout}>Cerrar sesión</button>
      </div>

      <div
        style={{
          border: '1px solid #ccc',
          height: '300px',
          overflowY: 'auto',
          padding: '10px',
          marginTop: '20px',
          marginBottom: '20px'
        }}
      >
        {messages.length === 0 ? (
          <p>No hay mensajes todavía.</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id || `${msg.username}-${msg.created_at}-${msg.text}`}
              style={{ marginBottom: '10px' }}
            >
              <strong>{msg.username}:</strong> {msg.text}
            </div>
          ))
        )}
      </div>

      <form onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="Escribe un mensaje"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ width: '70%', marginRight: '10px' }}
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}