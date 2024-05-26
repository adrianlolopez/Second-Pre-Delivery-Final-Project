const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

// Middleware para validar los campos obligatorios al agregar un producto al carrito
const validateCartProductFields = (req, res, next) => {
    const { productId, quantity } = req.body;
    if (!productId || !quantity) {
        return res.status(400).json({ error: 'productId y quantity son campos obligatorios' });
    }
    next();
};

// Endpoint para crear un nuevo carrito
router.post('/', (req, res) => {
    Cart.create({})
        .then(cart => {
            res.status(201).json(cart);
        })
        .catch(error => {
            res.status(500).json({ error: 'Error al crear el carrito en la base de datos' });
        });
});

// Endpoint para obtener los productos de un carrito por su id
router.get('/:cid', (req, res) => {
    const cartId = req.params.cid;
    Cart.findById(cartId)
        .populate('products.product')
        .then(cart => {
            if (!cart) {
                return res.status(404).json({ error: 'Carrito no encontrado' });
            }
            res.json(cart.products);
        })
        .catch(error => {
            res.status(500).json({ error: 'Error al obtener los productos del carrito de la base de datos' });
        });
});

// Endpoint para agregar un producto al carrito
router.post('/:cid/product', validateCartProductFields, (req, res) => {
    const { cid } = req.params;
    const { productId, quantity } = req.body;
    
    Cart.findById(cid)
        .then(cart => {
            if (!cart) {
                return res.status(404).json({ error: 'Carrito no encontrado' });
            }
            const existingProductIndex = cart.products.findIndex(item => item.product == productId);
            if (existingProductIndex !== -1) {
                cart.products[existingProductIndex].quantity += parseInt(quantity);
            } else {
                cart.products.push({ product: productId, quantity: parseInt(quantity) });
            }
            return cart.save();
        })
        .then(updatedCart => {
            res.status(200).json(updatedCart);
        })
        .catch(error => {
            res.status(500).json({ error: 'Error al agregar el producto al carrito en la base de datos' });
        });
});

// Endpoint para eliminar un producto del carrito por su id
router.delete('/:cid/product/:pid', (req, res) => {
    const { cid, pid } = req.params;
    
    Cart.findById(cid)
        .then(cart => {
            if (!cart) {
                return res.status(404).json({ error: 'Carrito no encontrado' });
            }
            cart.products = cart.products.filter(item => item.product != pid);
            return cart.save();
        })
        .then(updatedCart => {
            res.status(200).json(updatedCart);
        })
        .catch(error => {
            res.status(500).json({ error: 'Error al eliminar el producto del carrito en la base de datos' });
        });
});

// Endpoint para actualizar el carrito con un arreglo de productos
router.put('/:cid', (req, res) => {
    const { cid } = req.params;
    const { products } = req.body;
    
    Cart.findByIdAndUpdate(cid, { products }, { new: true })
        .then(updatedCart => {
            if (!updatedCart) {
                return res.status(404).json({ error: 'Carrito no encontrado' });
            }
            res.json(updatedCart);
        })
        .catch(error => {
            res.status(500).json({ error: 'Error al actualizar el carrito en la base de datos' });
        });
});

// Endpoint para actualizar la cantidad de un producto en el carrito
router.put('/:cid/product/:pid', validateCartProductFields, (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    
    Cart.findById(cid)
        .then(cart => {
            if (!cart) {
                return res.status(404).json({ error: 'Carrito no encontrado' });
            }
            const productToUpdate = cart.products.find(item => item.product == pid);
            if (!productToUpdate) {
                return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
            }
            productToUpdate.quantity = quantity;
            return cart.save();
        })
        .then(updatedCart => {
            res.status(200).json(updatedCart);
        })
        .catch(error => {
            res.status(500).json({ error: 'Error al actualizar la cantidad del producto en el carrito en la base de datos' });
        });
});

// Endpoint para eliminar todos los productos del carrito
router.delete('/:cid', (req, res) => {
    const cartId = req.params.cid;
    Cart.findByIdAndDelete(cartId)
        .then(deletedCart => {
            if (!deletedCart) {
                return res.status(404).json({ error: 'Carrito no encontrado' });
            }
            res.json(deletedCart);
        })
        .catch(error => {
            res.status(500).json({ error: 'Error al eliminar el carrito de la base de datos' });
        });
});

module.exports = router;
