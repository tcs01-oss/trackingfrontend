const express = require('express');
const router = express.Router();
const contactController = require('../../controllers/contact/contact');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Temporary storage for CSV parsing

router.get('/contacts', contactController.getContacts);
router.post('/contacts/import', upload.single('file'), contactController.importContacts);

module.exports = router;
