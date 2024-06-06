import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function SummaryPage() {
  const location = useLocation();
  const shoppingList = location.state.shoppingList;
  const navigate = useNavigate();
  const handleClick = ()  => {
  navigate('/login');
  }

  return (
    <div className='login-box'>
      <h1>Order Summary</h1>
      <ul>
        {shoppingList.map((item, index) => (
          <li key={index}>
            {item.name} - {item.color} - Quantity: {item.quantity}
          </li>
        ))}
      </ul>
      <p>
        Thank you for purcashing!
      </p>
      <p>
        <img src="./flower.png" alt="Flower" style={{ width: '100px', height: 'auto' }} /> {/* Apply styles for smaller size */}
      </p>
      <p>
      <button type="submit" onClick={handleClick}>Logout</button>
      </p>
    </div>
  );
}

export default SummaryPage;
