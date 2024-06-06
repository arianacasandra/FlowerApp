import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css'; // Or another CSS file, if exists
import { useNavigate } from 'react-router-dom';

function Menu() {
  const [flowers, setFlowers] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFlowers = async () => {
      try {
        const response = await axios.get('http://localhost:8800/flower');
        const formattedFlowers = response.data.map(flower => ({
          ...flower,
          money: parseFloat(flower.money)
        }));
        setFlowers(formattedFlowers);
      } catch (error) {
        console.error('Error fetching the flower data:', error);
      }
    };

    fetchFlowers();
  }, []);

  useEffect(() => {
    const calculateTotalPrice = () => {
      const totalPrice = shoppingList.reduce((accumulator, item) => {
        return accumulator + item.quantity * item.money;
      }, 0);
      setTotalPrice(totalPrice);
    };

    calculateTotalPrice();
  }, [shoppingList]);

  const addToShoppingList = flower => {
    const existingFlower = shoppingList.find(item => item.id === flower.id);
    if (existingFlower) {
      const updatedList = shoppingList.map(item =>
        item.id === flower.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      setShoppingList(updatedList);
    } else {
      setShoppingList(prevList => [...prevList, { ...flower, quantity: 1 }]);
    }
  };

  const removeFromShoppingList = flower => {
    const existingFlower = shoppingList.find(item => item.id === flower.id);
    if (existingFlower) {
      const updatedList = shoppingList.map(item =>
        item.id === flower.id ? { ...item, quantity: Math.max(0, item.quantity - 1) } : item
      );
      setShoppingList(updatedList.filter(item => item.quantity > 0));
    }
  };

  const handleClick = () => {
    navigate('/login');
  };
/*
  const handleOrder = async () => {
    if (shoppingList.length > 0) {
      try {
        await axios.post('http://localhost:8800/order', { shoppingList });
        navigate('/summary', { state: { shoppingList } });
      } catch (error) {
        console.error('Error placing order:', error);
        alert('Failed to place order. Please try again later.');
      }
    } else {
      alert('Your shopping list is empty. Add items to proceed.');
    }
  };
  */
  const handleOrder = async () => {
    if (shoppingList.length > 0) {
      // Check if all flowers in the shopping list are available in the database
      const flowerIds = shoppingList.map(item => item.id);
      const availableFlowerIds = flowers.map(flower => flower.id);
      const unavailableFlowerIds = flowerIds.filter(id => !availableFlowerIds.includes(id));
  
      if (unavailableFlowerIds.length > 0) {
        // If any flower in the shopping list is unavailable, alert the user
        const unavailableFlowers = shoppingList.filter(item => unavailableFlowerIds.includes(item.id));
        const unavailableFlowerNames = unavailableFlowers.map(flower => flower.name).join(', ');
        alert(`The following flowers are not available: ${unavailableFlowerNames}. Please remove them to proceed.`);
        return;
      }
  
      try {
        // If all flowers in the shopping list are available, proceed with placing the order
        await axios.post('http://localhost:8800/order', { shoppingList });
        navigate('/summary', { state: { shoppingList } });
      } catch (error) {
        console.error('Error placing order:', error);
        alert('Failed to place order. Please try again later.');
      }
    } else {
      alert('Your shopping list is empty. Add items to proceed.');
    }
  };
  

  return (
    <div className="Menu">
      <header className="Menu-header">
        <h1>Flowers List</h1>
        <button type="submit" onClick={handleClick}>
          Logout
        </button>
      </header>
      <main>
        <div className="flower-container">
          {flowers.map(flower => (
            <div key={flower.id} className="flower-card">
              <h2>{flower.name}</h2>
              <p>Color: {flower.color}</p>
              <p>Price: ${flower.money.toFixed(2)}</p>
              <button type="submit" onClick={() => addToShoppingList(flower)}>
                Add
              </button>
            </div>
          ))}
        </div>
        <div className="shopping-list">
          <h2>Shopping List</h2>
          {shoppingList.map((flower, index) => (
            <div key={index} className="shopping-list-item">
              <div className="shopping-list-info">
                <p>
                  {flower.name} - {flower.color}
                </p>
                <p>Price: ${flower.money.toFixed(2)}</p>
                <p>Quantity: {flower.quantity}</p>
              </div>
              <button
                type="submit"
                onClick={() => removeFromShoppingList(flower)}
              >
                Remove
              </button>
            </div>
          ))}
          <div className="total-price">
            <p>Total Price: ${totalPrice.toFixed(2)}</p>
          </div>
          <button onClick={handleOrder} disabled={shoppingList.length === 0}>
            Order
          </button>
        </div>
      </main>
    </div>
  );
}

export default Menu;
