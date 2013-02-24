var mongoose = require('mongoose');
var User = mongoose.model('User');
var Summary = mongoose.model('Summary');
var http = require('http');

exports.index = function(req, res){
	res.render('search', { title: 'Newsblr', username: req.session.user});
};

exports.results = function(req, res){
	res.render('feeds', { title: 'Newsblr', terms: req.body.terms, username: req.session.user });
};

exports.getInfo = function (req, res) {
	res.render('login', {title: 'Please log in or sign up'})
};

exports.login = function (req, res) {
	User.findOne({name: req.body.name}).exec(function(err, user){
		if (err) throw err;
		req.session.user = req.body.name;
		if (user){
			res.redirect('/');
		} else {
			new User({
				name: req.body.name
			}).save(function(err){
				if (err) throw err;
				res.redirect('/');
			})
		}
	});
}

exports.feed = function (req, res) {
	res.render('index', {title: 'Newsblr', url: req.params.url, username: req.session.user});
}

exports.new = function (req, res) {
	User.findOne({name: req.session.user}).exec(function(err, user){
		if (err) throw err;
		new Summary({
			link: req.body.link,
			summary: req.body.content,
			source: req.body.from,
			title: req.body.title
		}).save(function (err, summ){
			if (err) throw err;
			user.update( { $push: {sites: summ._id}}, function(err){
				if (err) throw err;
				res.redirect('/me');
			});
		});
	});
}

exports.me = function (req, res) {
	User
		.findOne({name: req.session.user})
		.populate('sites', null, null, { sort: [['created', 'desc']] })
		.exec(function(err, user){
			if (err) throw err;
			res.render('me', {title: 'Newslr', user: user});
		});
}