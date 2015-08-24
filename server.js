// require the path module
var path = require("path");
// require express and create the express app
var express = require("express");
var app = express();
// require bodyParser since we need to handle post data for adding a user
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
	extended: true
}))
// require mongoose and create the mongoose variable
var mongoose = require('mongoose');
// connect to the mongodb database using mongoose -- "quoting_dojo_redux"
mongoose.connect('mongodb://localhost/quoting_dojo_redux');
// create a Schema
var QuoteSchema = new mongoose.Schema({
	name: String,
	quote: String,
	date: Date
})
var Quote = mongoose.model('Quote', QuoteSchema);
// input validation
QuoteSchema.path('name').required(true, 'Name cannot be blank');
QuoteSchema.path('quote').required(true, 'Quote cannot be blank');

// static content
app.use(express.static(path.join(__dirname, "./static")));
// set the views folder and set up ejs
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
// root route
app.get('/', function(req, res) {
 // This is where we would get the users from the database and send them to the index view to be displayed.
	res.render('index');
})
// route to add a quote
app.post('/quotes', function(req, res) {
	console.log("POST DATA", req.body);
 	// This is where we would add the user from req.body to the database.
	var quote = new Quote({name: req.body.name, quote: req.body.quote, date: new Date()});
	quote.save(function(err){
 		if(err){
 			res.render('index', {errors: quote.errors})
 			console.log('something went wrong');
 		}else {
 			console.log('successfully added a user!');
 			res.redirect('/quotes');
 		}
	})
})
// route to display quotes
app.get('/quotes', function(req, res){
	Quote.find({}, function(err, quotes){
		if(err){
			console.log('something went wrong');
		}else {
			res.render('main', {quotes:quotes});
		}
	}).sort({date:-1});
})
// listen on 8000
app.listen(8000, function() {
	console.log("listening on port 8000");
})