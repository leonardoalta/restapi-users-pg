const { Router } = require('express');
const controllers = require('../controllers');

const router = Router();

router.get('/', (req, res) => res.send('Welcome'))

router.post('/users', controllers.createUser);
router.get('/users', controllers.getAllUsers);
+router.put    ('/users/:id', controllers.updateUser);    // ← editar
+router.delete ('/users/:id', controllers.deleteUser);     
module.exports = router; 
