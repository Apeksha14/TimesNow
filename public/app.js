// Grab the articles as a json

function getArticles()
{
  
 $.getJSON("/articles", function(data) {

  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    
    $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<button data-id='" + data[i]._id + "'type='button' class='myButton1' id='savebtn' data-toggle='modal' data-target='#saveModal'>Save</button><br/><a id='articleid' href='"+data[i].link + "'>"+data[i].link+"</a></p>");

        $("#modalBodyScrape").html(data.length+" Articles Scraped");

}



});

}

$('#scrapemodal').on('show.bs.modal', function () {


$.ajax({
    method: "GET",
    url: "/scrape"
  }).done(function(data){

    getArticles();
    
    
    $("#saved").empty();
      
    console.log(data);
  
});



});

$('#saveModal').on('show.bs.modal', function () {

  var thisId = $("#savebtn").attr("data-id"); 

   $("#modalBodysave").text(" Article Saved");

    $.ajax({
    method: "POST",
    url: "/saved/" + thisId
    })
    // With that done
    .done(function(data) {


      $("#articles").empty();

            $("#saved").load(" #saved");

      // Log the response
      console.log(data);
    });


   

});

$('#deleteModal').on('show.bs.modal', function () {
  
   var thisId = $("#deletebtn").attr("data-id");

console.log("delete id "+thisId);
    $.ajax({
    method: "POST",
    url: "/delete/" + thisId
    })
    // With that done
    .done(function(data) {
      // Log the response

      $("#deletemodalBody").html("Article Deleted");

                      $("#saved").load(" #saved");



      console.log(data);
    });

});



$.getJSON("/saved", function(data) {
  
  if(data.length === 0)
  {
    $("#saved").append("<p>Uh Oh!! Looks like we don't have any new Articles.<br/>Scrape new articles.</p>");
  }
  else
  {
    for (var i = 0; i < data.length; i++) {
        $("#saved h2").text("SAVED ARTICLES");
        $("#articles").empty();
        $("#saved").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<button data-id='" + data[i]._id + "'type='button' id='deletebtn' class='myButton1' data-toggle='modal' data-target='#deleteModal'>Delete</button><button data-id='" + data[i]._id + "'type='button' class='myButton1' id='addnotes'  data-toggle='modal' data-target='#exampleModal' data-whatever='"+data[i]._id +"'>Add Notes</button><br/><a id='articleid' href='"+data[i].link + "'>"+data[i].link+"</a></p>");
        console.log(data);

  }
  }
  });



// Whenever someone clicks a p tag
$(document).on("click", "#addnotes", function() {

   
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .done(function(data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .done(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
