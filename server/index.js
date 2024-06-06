import express from 'express'
import mysql from 'mysql2'
import cors from 'cors'

const app = express()
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Oc23tpax",
    database: "flowers"
})

app.use(express.json())
app.use(cors())

app.get("/",(req,res)=> {
    res.json("Hello this is the backend")
})
app.listen(8800,()=> {
    console.log("Connected to backend!")
})

app.get("/user", (req, res) => {
    const query = "SELECT * FROM users";
    db.query(query, (err, users) => {
        if (err) {
            console.error('Error fetching users:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json(users);
    });
});

app.post('/register', (req, res) => {
    const { email, username, password } = req.body;

    const checkUserQuery = 'SELECT * FROM users WHERE username = ? OR email = ?';
    db.query(checkUserQuery, [username, email], (err, results) => {
        if (err) {
            console.error('Error checking username and email:', err);
            res.status(500).json({ message: 'Error registering user.' });
            return;
        }

        if (results.length > 0) {
            const existingUser = results[0];
            if (existingUser.username === username) {
                res.status(400).json({ message: 'Username already exists.' });
            } else if (existingUser.email === email) {
                res.status(400).json({ message: 'Email already exists.' });
            } else {
                res.status(400).json({ message: 'Username or email already exists.' });
            }
        } else {
            const insertUserQuery = 'INSERT INTO users (email, username, password) VALUES (?, ?, ?)';
            db.query(insertUserQuery, [email, username, password], (err, result) => {
                if (err) {
                    console.error('Error inserting data:', err);
                    res.status(500).json({ message: 'Error registering user.' });
                    return;
                }
                res.status(200).json({ message: 'User registered successfully.' });
            });
        }
    });
});

app.get("/flower", (req, res) => {
    const query = "SELECT * FROM flowers WHERE quantity > 0"; // Select only flowers with quantity > 0
    db.query(query, (err, flowers) => {
        if (err) {
            console.error('Error fetching flowers:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json(flowers);
    });
});



app.post('/add-flower', (req, res) => {
    const { name, color, quantity, money } = req.body;

    const checkFlowerQuery = 'SELECT * FROM flowers WHERE name = ?';
    db.query(checkFlowerQuery, [name], (err, results) => {
        if (err) {
            console.error('Error checking flower:', err);
            res.status(500).json({ message: 'Error adding flower.' });
            return;
        }

        if (results.length > 0) {
            res.status(400).json({ message: 'Flower already exists.' });
        } else {
            const insertFlowerQuery = 'INSERT INTO flowers (name, color, quantity, money) VALUES (?, ?, ?, ?)';
            db.query(insertFlowerQuery, [name, color, quantity, money], (err, result) => {
                if (err) {
                    console.error('Error inserting flower:', err);
                    res.status(500).json({ message: 'Error adding flower.' });
                    return;
                }
                res.status(200).json({ message: 'Flower added successfully.' });
            });
        }
    });
});

app.delete("/flower/:id", (req, res) => {
    const flowerId = req.params.id;
    const query = "DELETE FROM flowers WHERE id = ?";

    db.query(query, [flowerId], (err, data) => {
        if (err) {
            return res.json(err);
        }
        return res.json("Flower has been deleted successfully.");
    });
});

app.post('/update-password', async (req, res) => {
    const { username, oldPassword, newPassword } = req.body;

    try {
        // Query the database to get the user by username
        const query = 'SELECT * FROM users WHERE username = ?';
        db.query(query, [username], async (err, results) => {
            if (err) {
                console.error('Error fetching user:', err);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }

            // If no user is found with the given username, return a 404 error
            if (results.length === 0) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            // Get the user from the query results
            const user = results[0];
            if (user.password === oldPassword)
                {
                const updateQuery = 'UPDATE users SET password = ? WHERE username = ?';
                db.query(updateQuery, [newPassword, username], (updateErr) => {
                if (updateErr) {
                    console.error('Error updating password:', updateErr);
                    res.status(500).json({ error: 'Internal Server Error' });
                    return;
                }
                
                console.log('Password updated successfully');
                res.status(200).json({ message: 'Password updated successfully' });
            });
        } else {
            console.log("Passwords didn't match");
            res.status(400).json({ error: 'Passwords do not match' });
        }
    });
    } catch (error) {
        console.error('Error handling update password request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.post('/order', (req, res) => {
    const shoppingList = req.body.shoppingList;
  
    // Check if all flowers in the shopping list are available in the database
    const flowerIds = shoppingList.map(item => item.id);
    const query = 'SELECT id, quantity FROM flowers WHERE id IN (?)';
    db.query(query, [flowerIds], (err, availableFlowers) => {
      if (err) {
        console.error('Error checking flower availability:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
  
      const flowerQuantities = {};
      availableFlowers.forEach(flower => {
        flowerQuantities[flower.id] = flower.quantity;
      });
  
      const unavailableFlowerIds = flowerIds.filter(id => !flowerQuantities[id]);
  
      if (unavailableFlowerIds.length > 0) {
        // If any flower in the shopping list is unavailable, return an error response
        res.status(400).json({ error: `The following flowers are not available: ${unavailableFlowerIds.join(', ')}` });
        return;
      }
  
      // Check if there are enough quantities of each flower in the shopping list
      const insufficientQuantityFlowers = shoppingList.filter(item => item.quantity > flowerQuantities[item.id]);
  
      if (insufficientQuantityFlowers.length > 0) {
        // If there is insufficient quantity of any flower in the shopping list, return an error response
        const insufficientFlowerIds = insufficientQuantityFlowers.map(item => item.id);
        res.status(400).json({ error: `Insufficient quantity for the following flowers: ${insufficientFlowerIds.join(', ')}` });
        return;
      }
  
      // If all flowers in the shopping list are available and there is sufficient quantity, update the database and complete the order
      const updateQuantitiesQuery = 'UPDATE flowers SET quantity = quantity - ? WHERE id = ?';
      const updatePromises = shoppingList.map(item => {
        return new Promise((resolve, reject) => {
          db.query(updateQuantitiesQuery, [item.quantity, item.id], (updateErr, result) => {
            if (updateErr) {
              reject(updateErr);
            } else {
              resolve();
            }
          });
        });
      });
  
      Promise.all(updatePromises)
        .then(() => {
          res.status(200).json({ message: 'Order placed successfully' });
        })
        .catch(updateErr => {
          console.error('Error updating flower quantities:', updateErr);
          res.status(500).json({ error: 'Internal Server Error' });
        });
    });
  });
  