/* Scrape and Display (18.3.8)
 * (If you can do this, you should be set for your hw)
 * ================================================== */

// STUDENTS:
// Please complete the routes with TODOs inside.
// Your specific instructions lie there

// Good luck!

// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
// Requiring our Note and Article models
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");
// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;


// Initialize Express
var app = express();

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

// Make public a static dir
app.use(express.static("public"));

// Database configuration with mongoose

   //var uristring = process.env.MONGOLAB_URI ||  process.env.MONGODB_URI || process.env.MONGOHQ_URL || 'mongodb://heroku_z49hw4k5:jg8j247rul3ho8c8gb5qndited@ds111791.mlab.com:11791/heroku_z49hw4k5';

    var uristring = 'mongodb://heroku_z49hw4k5:jg8j247rul3ho8c8gb5qndited@ds111791.mlab.com:11791/heroku_z49hw4k5'
    //var uristring = 'mongodb://localhost/timesnowdb';
    var PORT = process.env.PORT || 3000;

mongoose.connect(uristring, function (err, res) {
      if (err) {
      console.log ('ERROR connecting to: ' + uristring + '. ' + err);
      } else {
      console.log ('Succeeded connected to: ' + uristring);
      }
    });
    
  var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});


// Routes
// ======

// A GET request to scrape the echojs website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with request
  request("https://www.washingtonpost.com", function(error, response, html) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(html);
    // Now, we grab every h2 within an article tag, and do the following:
    $(".headline a").each(function(i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this).text();
      result.link = $(this).attr("href");

      // Using our Article model, create a new entry
      // This effectively passes the result object to the entry (and the title and link)
      var entry = new Article(result);

      // Now, save that entry to the db
      entry.save(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        // Or log the doc
        else {
          //console.log(doc);
        }
      });
      
    });
  });
  // Tell the browser that we finished scraping the text
  res.send("Scrape Complete");
  //res.sendFile(__dirname+"/public/index.html");
  //res.sendFile(path.join(__dirname, '/public/index.html'));
});

// This will get the articles we scraped from the mongoDB
app.get("/articles", function(req, res) {

  // TODO: Finish the route so it grabs all of the articles
    Article.find({"saved":"false"},function(err,data){
if(err)
  console.log(err);
else
  //res.sendFile(path.join(__dirname, '/public/index.html'));
  res.send(data);
    })

});

// This will grab an article by it's ObjectId
app.get("/articles/:id", function(req, res) {


  // TODO
  // ====

  // Finish the route so it finds one article using the req.params.id,

  // and run the populate method with "note",

  // then responds with the article with the note included

  Article.findOne({"_id":req.params.id}).populate("note").exec(function(err,data){

      
      if (err) {
          res.send(err);
        }
        // Or send the newdoc to the browser
        else {
          res.send(data);
        }

    });

});

app.get("/notes/:id", function(req, res) {


  // TODO
  // ====

  // Finish the route so it finds one article using the req.params.id,

  // and run the populate method with "note",

  // then responds with the article with the note included

  Article.findOne({"_id":req.params.id}).populate("note").exec(function(err,data){

      if (err) {
          console.log(err);
        }
        // Or send the newdoc to the browser
        else {

            var noteData = [];

            for(var i=0;i<data.note.length;i++)
            {

                  noteData.push(data.note[i]);

            }

            console.log(noteData);

            Note.find({"_id":{$in:noteData}}).exec(function(err,data){

                if(err){

                  res.send(err)

                }
                else{

                  res.send(data);

                }


                });

        }

    });

});

// Create a new note or replace an existing note
app.post("/articles/:id", function(req, res) {


  // TODO
  // ====

  // save the new note that gets posted to the Notes collection

  // then find an article from the req.params.id

  // and update it's "note" property with the _id of the new note

    var newNote = new Note(req.body);

    console.log(newNote);
  // Save the new note to mongoose
  newNote.save(function(error, doc) {
    // Send any errors to the browser
    if (error) {
      res.send(error);
    }
    // Otherwise
    else {
      // Find our user and push the new note id into the User's notes array //push for arrays 
      Article.findOneAndUpdate({"_id": req.params.id}, {$push:{"note": [doc._id]} }, function(err, newdoc) {
        // Send any errors to the browser
        if (err) {
          res.send(err);
        }
        // Or send the newdoc to the browser
        else {
          res.send(newdoc);
        }
      });
    }
  });

});

app.get("/saved", function(req, res) {

  // TODO: Finish the route so it grabs all of the articles
    Article.find({"saved":true},function(err,data){
if(err)
  console.log(err);
else
  //res.sendFile(path.join(__dirname, '/public/index.html'));
  res.send(data);
    })

});

app.post("/saved/:id", function(req, res) {

Article.findOneAndUpdate({"_id": req.params.id}, {"saved": "true"}, function(err, newdoc) {
  if (err) {
          res.send(err);
        }
        // Or send the newdoc to the browser
        else {
          res.send(newdoc);
        }
});
});

app.post("/delete/:id", function(req, res) {

Article.findOneAndUpdate({"_id": req.params.id}, {"saved": "false"}, function(err, newdoc) {
  if (err) {
          res.send(err);
        }
        // Or send the newdoc to the browser
        else {
          res.send(newdoc);
        }
});
});

app.post("/notedelete/:id", function(req, res) {

console.log("NOTE DELETED"+req.params.id);

Note.remove({"_id": req.params.id}, function(err, newdoc) {
  if (err) {
          res.send(err);
        }
        // Or send the newdoc to the browser
        else {
          res.send(newdoc);
        }
});
});

// Listen on port 3000
app.listen(PORT, function() {
  console.log("App running on port 3000!");
});
