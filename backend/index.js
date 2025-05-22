const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());



const mongoose = require('mongoose');
const todoRouter = require('./routes/todoRoutes');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});




app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});

app.use("/",todoRouter)
