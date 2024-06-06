import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddFlower() {
   // preia datele din form și le salvează
   const [inputs, setInputs] = useState({});
   const navigate = useNavigate();

   const handleChange = (event) => {
     const { name, value } = event.target;
     setInputs((values) => ({ ...values, [name]: value }));
   };
 
   const handleSubmit = async (event) => {
    event.preventDefault();

    try {
        const response = await fetch('http://localhost:8800/add-flower', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: inputs.name,
                color: inputs.color,
                quantity: inputs.quantity,
                money: inputs.money,
            }),
        });

        const result = await response.json();

        if (response.ok) {
            console.log('Flower added successful');
            alert('Flower added successful');
            navigate('/addelete'); // Redirect to home page after adding flower
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Error:', error.message);
        alert('An error occurred while trying to add flower.');
    }
};
    return (
        <div className="login-box">
        <h2>Add Flower</h2>
        <form onSubmit={handleSubmit}>
            
             
          <div className="user-box">
            <input 
            type="text" 
            name="name" 
            value={inputs.name}
            required 
            onChange={handleChange}>
            </input>
            <label>Name</label>
          </div> 

          <div className="user-box">
            <input 
            type="text" 
            name="color" 
            value={inputs.color} 
            required
            onChange={handleChange}>
            </input>
            <label>Color</label>
            
          </div>
          <div className="user-box">
            <input 
            type="number" 
            name="quantity" 
            value={inputs.quantity}
            required 
            onChange={handleChange}>
                </input>
            <label>Quantity</label>
          </div>
          <div className="user-box">
            <input 
            type="number" 
            name="money" 
            value={inputs.money} 
            required
            onChange={handleChange}>
                </input>
            <label>Money</label>
          </div>
          <button type="submit">Add Flower</button>
        </form>
      </div>

      
      
    );
}

export default AddFlower;
