const express = require('express');
const router = express.Router();

//middleware
//const checkAuth = require('../middleware/checkAuth')

const Event = require('../controllers/event');

//create event
router.post('/', Event.createEvent);
//fetch all Event
router.get('/', Event.getEvents);

router.delete('/:id', Event.event_delete);

module.exports = router;