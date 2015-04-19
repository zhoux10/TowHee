'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Event = mongoose.model('Event'),
	_ = require('lodash');

/**
 * Create a article
 */
exports.create = function(req, res) {
	var eventmodel = new Event(req.body);
	eventmodel.user = req.user;

	eventmodel.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(eventmodel);
		}
	});
};

/**
 * Show the current article
 */
exports.read = function(req, res) {
	res.json(req.eventmodel);
};

/**
 * Update a article
 */
exports.update = function(req, res) {
	var eventmodel = req.eventmodel;

	eventmodel = _.extend(eventmodel, req.body);

	eventmodel.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(eventmodel);
		}
	});
};

/**
 * Delete an article
 */
exports.delete = function(req, res) {
	var eventmodel = req.eventmodel;

	eventmodel.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(eventmodel);
		}
	});
};

/**
 * List of Events
 */
exports.list = function(req, res) {
	Event.find().sort('-created').populate('user', 'displayName').exec(function(err, eventmodels) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(eventmodels);
		}
	});
};

/**
 * Event middleware
 */
exports.eventmodelByID = function(req, res, next, id) {
	console.log('I am here!!!!!!!!!!!');
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).send({
			message: 'Event is invalid'
		});
	}

	Event.findById(id).populate('user', 'displayName').exec(function(err, eventmodel) {
		if (err) return next(err);
		if (!eventmodel) {
			return res.status(404).send({
				message: 'Event not found'
			});
		}
		req.eventmodel = eventmodel;
		next();
	});
};
exports.eventsnearby = function(req, res){
	var lat,lng;
	lat = req.query.lat;
	lng = req.query.lng;

  Event.find({location :
        { $near :
           {
             $geometry : {
                type : "Point" ,
                coordinates : [lng, lat] },
             $maxDistance : 5000
           }
       }}, function(err,response)
    {
      var data = response;

      /*
      console.log('I am here!!!!')
      console.log(data);
      console.log(lat,lng);
      */
      res.send(data);
  });
};
/**
 * Article authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.eventmodel.user.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};
