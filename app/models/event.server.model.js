'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Event Schema
 */
var EventSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	title: {
		type: String,
		default: '',
		trim: true,
		required: 'Title cannot be blank'
	},
	day: {
		type:Date,
		default: ''
	},
	content: {
		type: String,
		default: '',
		trim: true
	},
	location: {
		type:Array,
		default: []
	},
	signupUrl :{
		type:String
	},
	imageUrl :{
		type:String
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Event', EventSchema);