const Event = require('../models/event');

function getUsersWithEvents() {
  const resultPromise = Event.aggregate([
    {
      $group: {
        "_id": {
          user: "$user"
        },
        events: {
          $push: "$$ROOT"
        }
      }
    },
    {
      $sort: {
        date: 1
      }
    }
  ]).exec();

  return resultPromise;
}

module.exports = {
  getUsersWithEvents
}