import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import bienRoutes from './routes/biens';
import locataireRoutes from './routes/locataires';
import locationRoutes from './routes/locations';
import fraisRoutes from './routes/frais';
import organisationRoutes from './routes/organisations';
import noteRoutes from './routes/notes';
import eventRoutes from './routes/events';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/biens', bienRoutes);
app.use('/api/locataires', locataireRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/frais', fraisRoutes);
app.use('/api/organisations', organisationRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/events', eventRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API de gestion locative' });
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
