const express = require('express');
const cors = require('cors');
const { connectDB } = require('./db');
const { sequelize } = require('./models');

// Routes
const taskRoutes = require('./routes/tasks-routes');
const eventRoutes = require('./routes/events-routes');
const guestRoutes = require('./routes/guests-routes');
const userRoutes = require('./routes/users-routes');
const emailRoutes = require('./routes/email-routes');

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/guests', guestRoutes);
app.use('/api/users', userRoutes);
app.use('/api/email', emailRoutes);

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Une erreur est survenue sur le serveur' });
});

// Démarrage du serveur
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();

    sequelize.sync({ force: false })
    .then(() => {
      return true
    })
    .catch(err => {
        console.error("Erreur de synchronisation de la base de données : ", err);
    });


    // Démarrage du serveur
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Erreur lors du démarrage du serveur:', error);
  }
}

startServer();