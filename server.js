require('dotenv').config();
const app = require('./backend/app');

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});