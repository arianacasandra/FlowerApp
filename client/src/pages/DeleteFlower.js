import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function FlowerDeleteForm() {
    const [flowers, setFlowers] = useState([]);
    const [selectedFlowerId, setSelectedFlowerId] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFlowers = async () => {
            try {
                const response = await axios.get('http://localhost:8800/flower');
                setFlowers(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching flowers:', error);
            }
        };

        fetchFlowers();
    }, []);

    const handleDelete = async () => {
        if (!selectedFlowerId) {
            alert('Please select a flower to delete.');
            return;
        }
    
        console.log('Deleting flower with ID:', selectedFlowerId); // Log the flower ID
        
    
        try {
            await axios.delete(`http://localhost:8800/flower/${selectedFlowerId}`);
            alert('Flower deleted successfully');
            // Refresh flower list after deletion
            const updatedFlowers = flowers.filter(flower => flower.id !== selectedFlowerId);
            setFlowers(updatedFlowers);
            setSelectedFlowerId(''); // Clear the selected flower after deletion
            navigate('/addelete');
            

        } catch (error) {
            console.error('Error deleting flower:', error);
            alert('An error occurred while trying to delete flower.');
        }
    };
    

    return (
        <div className="login-box">
        
            <h2>Delete Flower</h2>
            <select value={selectedFlowerId}
             onChange={(e) => setSelectedFlowerId(e.target.value)}>
                <option value="">Select Flower</option>
                {flowers.map((flower) => (
                    <option key={flower.id} value={flower.id}>{flower.name}</option>
                ))}
            </select>
        
            <button type="submit" onClick={handleDelete} disabled={!selectedFlowerId}>Delete</button>
           
        </div>
       
    );
}

export default FlowerDeleteForm;