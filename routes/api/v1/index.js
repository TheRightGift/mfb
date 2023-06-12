const router = require('express').Router();
require('dotenv').config();

router.use(process.env.API_URL+'auth', require('./Controllers/auth'));
router.use(process.env.API_URL+'users', require('./users'));
// router.use(process.env.API_URL+'activities', require('./activities'));
// router.use(process.env.API_URL+'locations', require('./locations'));
// router.use(process.env.API_URL+'rooms', require('./rooms'));
// router.use(process.env.API_URL+'shows', require('./shows'));
router.use('/', require('./guest'));

module.exports = router;