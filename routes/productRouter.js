const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Middleware para validar los campos obligatorios de un producto
const validateProductFields = (req, res, next) => {
    const { title, description, code, price, stock, category } = req.body;
    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
    next();
};

// Endpoint para listar todos los productos
router.get('/', (req, res) => {
    Product.find()
        .then(products => {
            res.json(products);
        })
        .catch(error => {
            res.status(500).json({ error: 'Error al obtener productos de la base de datos' });
        });
});

// Endpoint para obtener un producto por su id
router.get('/:pid', (req, res) => {
    const productId = req.params.pid;
    Product.findById(productId)
        .then(product => {
            if (!product) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }
            res.json(product);
        })
        .catch(error => {
            res.status(500).json({ error: 'Error al obtener el producto de la base de datos' });
        });
});

// Endpoint para agregar un nuevo producto
router.post('/', validateProductFields, (req, res) => {
    const newProduct = req.body;
    Product.create(newProduct)
        .then(product => {
            res.status(201).json(product);
        })
        .catch(error => {
            res.status(500).json({ error: 'Error al agregar el producto a la base de datos' });
        });
});

// Endpoint para actualizar un producto por su id
router.put('/:pid', validateProductFields, (req, res) => {
    const productId = req.params.pid;
    const updatedProduct = req.body;
    Product.findByIdAndUpdate(productId, updatedProduct, { new: true })
        .then(product => {
            if (!product) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }
            res.json(product);
        })
        .catch(error => {
            res.status(500).json({ error: 'Error al actualizar el producto en la base de datos' });
        });
});

// Endpoint para eliminar un producto por su id
router.delete('/:pid', (req, res) => {
    const productId = req.params.pid;
    Product.findByIdAndDelete(productId)
        .then(product => {
            if (!product) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }
            res.json(product);
        })
        .catch(error => {
            res.status(500).json({ error: 'Error al eliminar el producto de la base de datos' });
        });
});

module.exports = router;
