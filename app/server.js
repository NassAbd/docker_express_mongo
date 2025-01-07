const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

app.use(express.json());

// Connexion à MongoDB
mongoose.connect('mongodb://mongo:27017/dockerdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erreur de connexion à MongoDB:'));
db.once('open', () => {
  console.log('Connecté à MongoDB');
});

// Modèle Mongoose pour les utilisateurs
const userSchema = new mongoose.Schema({
  pseudo: { type: String, required: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Routes CRUD pour les utilisateurs

// Créer un utilisateur
app.post('/users', async (req, res) => {
  try {
    const { pseudo, password } = req.body;
    const newUser = new User({ pseudo, password });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Lire tous les utilisateurs
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mettre à jour un utilisateur
app.put('/users/:id', async (req, res) => {
  try {
    const { pseudo, password } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { pseudo, password },
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Supprimer un utilisateur
app.delete('/users/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route par défaut
app.get('/', (req, res) => {
  res.send('Hello World! Express est connecté à MongoDB');
});

app.listen(port, () => {
  console.log(`Serveur Express en écoute sur le port ${port}`);
});
