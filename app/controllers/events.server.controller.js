'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Event = mongoose.model('Event'),
	_ = require('lodash');

/**
 * Create a event
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
 * Show the current event
 */
exports.read = function(req, res) {
	res.json(req.eventmodel);
};

/**
 * Update an event
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
 * Delete an event
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
	var lat,lng, radius;
	lat = req.query.lat;
	lng = req.query.lng;
	radius = req.query.radius;

	var maxD = radius * 1609.34;
  Event.find({location :
        { $near :
           {
             $geometry : {
                type : "Point" ,
                coordinates : [lng, lat] },
             $maxDistance : maxD
           }
       }}, function(err,response)
    {
      var data = response;
      res.send(data);
  });
};
/**
 * Event authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.eventmodel.user.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};
