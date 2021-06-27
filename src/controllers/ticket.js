const mongoose = require('mongoose');

const Event = require('../models/event');
const Ticket = require('../models/ticket');

//create ticket
exports.createTicket = (req, res, next) => {
  if (req.body.passcode !== 'agudareal') {
    return res.status(200).json({
      hasError: true,
      message: "Incorrect passcode cannot create ticket"
    });
  }
  Event.findById(req.params.id).exec().then(doc => {
    if (doc !== null) {
      let ticket = new Ticket({
        _id: new mongoose.Types.ObjectId(),
        code: req.body.code,
        phone: req.body.phone,
        description: req.body.description,
        price: req.body.price,
        quantity: req.body.quantity,
        event: doc._id,
      });

      ticket.save().then(result => {
        res.status(200).json({
          hasError: false,
          message: "ticket generated successfully",
          data: result,
        })
      }).catch(err => {
        res.status(500).json({
          hasError: true,
          error: err,
          message: 'Could not create'
        });
      })
    } else {
      res.status(200).json({
        hasError: true,
        message: "event ID doesnt exist or has been deleted"
      });
    }
  }).catch(err => {
    res.status(500).json({
      hasError: true,
      error: err,
      message: "An error occurred"
    });
  });

}

//get tickets
exports.getTickets = (req, res, next) => {
  Ticket.find().populate('event').sort({
    date: -1
  }).exec().then(
    result => {
      res.status(200).json({
        hasError: false,
        message: "Tickets",
        data: result,
      })
    }).catch(err => {
      console.log(err)
      res.status(500).json({
        hasError: true,
        error: err,
        message: "An error occurred"
      });
    })
}


//update tickets
exports.updateTicket = (req, res, next) => {
  const id = req.params.id;

  if (req.body.code != 'agudareal') {
    return res.status(200).json({
      hasError: true,
      message: "Incorrect passcode cannot create ticket"
    });
  }

  Ticket.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
  .then(data => {
    if (!data) {
      res.status(404).send({
        message: `Cannot update Ticket with id=${id}. Maybe Ticket was not found!`
      });
    } else res.send({ message: "Ticket was updated successfully." });
  })
  .catch(err => {
    res.status(500).send({
      message: "Error updating Ticket with id=" + id
    });
  });

}


//update tickets status
exports.updateTicketStatus = (req, res, next) => {
  const id = req.params.code;

  Ticket.findOne({
    code: id
  }).exec().then(doc => {
    if (doc) {

      Ticket.update({
        code: id
      }, {
        $set: {
          status: 'approved'
        }
      })
        .exec()
        .then(result => {
          res.status(200).json({
            hasError: false,
            message: 'Updated successfully',
            data: doc,
          });
        })
        .catch(err => {
          res.status(500).json({
            hasError: true,
            message: 'An error occurred',
            error: err
          });
        });
    } else {
      res.status(200).json({
        hasError: true,
        message: 'ticket doesnt exist',
        //error: err
      });
    }
  }).catch(err => {
    console.log(err)
    res.status(500).json({
      hasError: true,
      message: 'ticket doesnt exist',
      error: err
    });
  })

}

//update tickets corkage
exports.updateTicketCorkage = (req, res, next) => {
  const id = req.params.code;
  Ticket.findOne({
    code: id
  }).exec().then(doc => {
    if (doc) {

      Ticket.update({
        code: id
      }, {
        $set: {
          corkage: 'approved'
        }
      })
        .exec()
        .then(result => {
          res.status(200).json({
            hasError: false,
            message: 'Updated successfully',
            data: doc,
          });
        })
        .catch(err => {
          res.status(500).json({
            hasError: true,
            message: 'An error occurred',
            error: err
          });
        });
    } else {
      res.status(200).json({
        hasError: true,
        message: 'ticket doesnt exist',
        //error: err
      });
    }
  }).catch(err => {
    console.log(err)
    res.status(500).json({
      hasError: true,
      message: 'ticket doesnt exist',
      error: err
    });
  });
}

//get tickets for an event
exports.getTicketsByEvent = (req, res, next) => {
  Ticket.find({
    event: req.params.id
  }).populate('event').sort({
    date: -1
  }).exec().then(doc => {
    res.status(200).json({
      hasError: false,
      message: "Tickets by event",
      data: doc
    });
  }).catch(err => {
    console.log(err)
    res.status(500).json({
      hasError: true,
      message: 'event doesnt exist',
      error: err
    });
  })
}

//get ticket for an event
exports.getTicket = (req, res, next) => {
  Ticket.findOne({
    code: req.params.code
  }).populate('event').exec().then(doc => {
    if (doc) {
      res.status(200).json({
        hasError: false,
        message: "Tickets Details",
        data: doc
      });
    } else {
      res.status(200).json({
        hasError: true,
        message: 'ticket doesnt exist',
        //error: err
      });
    }
  }).catch(err => {
    console.log(err)
    res.status(500).json({
      hasError: true,
      message: 'ticket doesnt exist',
      error: err
    });
  })
}


//delete user
exports.deleteTicket = (req, res, next) => {
  const id = req.params.id;
  Ticket.remove({
    _id: id
  })
    .exec()
    .then(result => {
      res.status(200).json({
        messgae: 'Ticket deleted',
        data: result
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      });
    });
}
