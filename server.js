const express = require('express');
const mongoose = require('mongoose');

// Importar enrutadores
const productRouter = require('./routes/productRouter');
const cartRouter = require('./routes/cartRouter');

const app = express();
const PORT = 8080;

// Middleware para analizar JSON
app.use(express.json());

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/tu_nombre_de_base_de_datos', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Conexión exitosa a MongoDB');
    // Inicializar modelos
    const Product = require('./models/Product');
    const Cart = require('./models/Cart');
    
    // Usar enrutadores
    app.use('/api/products', productRouter);
    app.use('/api/carts', cartRouter);

    // Escuchar en el puerto
    app.listen(PORT, () => {
        console.log(`Servidor escuchando en el puerto ${PORT}`);
    });
})
.catch((error) => {
    console.error('Error de conexión a MongoDB:', error);
});
