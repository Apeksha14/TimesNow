// Grab the articles as a json
savedArticle();

  $("#savedart").on("click",function(){

  $("#saved").attr("display","block");

  $("#article").attr("display","none");


});

function getArticles()
{
 
  $.getJSON("/articles", function(data) {

  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
   $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<button data-id='" + data[i]._id + "'type='button' class='myButton1 savearticle' id='savebtn' data-toggle='modal' data-target='#saveModal'>Save</button><br/><a id='articleid' href='"+data[i].link + "'>"+data[i].link+"</a></p>");
   // $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<button data-id='" + data[i]._id + "'type='button' class='myButton1' id='savebtn' data-toggle='modal' data-target='#saveModal'>Save</button><br/><a id='articleid'></a></p>");

    $("#modalBodyScrape").html(data.length+" Articles Scraped");

}



});

} 
$(document).on("click", "#scrapebtn", function() {

  $("#articles").attr("display","block");

  $.ajax({
    method: "GET",
    url: "/scrape"
  }).done(function(data){

     $("#heading").html("ARTICLES");

    $("#saved").empty();


});   

setTimeout(getArticles,400); 

});

$(document).on("click", "p .savearticle", function() {


var thisId = $(this).attr("data-id"); 

   $("#modalBodysave").text(" Article Saved");

    $.ajax({
    method: "POST",
    url: "/saved/" + thisId
    })
    // With that done
    .done(function(data) {

       savedArticle();

});

});



$('#saveModal').on('show.bs.modal', function () {

      $("#heading").text("SAVED ARTICLES");

      $("#articles").empty();


      // Log the response
      //getArticles();
    });

$(document).on("click", "p .deletearticle", function() {
  
   var thisId = $(this).attr("data-id");

    $.ajax({
    method: "POST",
    url: "/delete/" + thisId
    })
    // With that done
    .done(function(data) {
      // Log the response

      //setTimeout(savedArticle,400); 
      
       $("#deletemodalBody").html("Article Deleted");

      //$("#saved").load(" #saved");



    });

});

function savedArticle()
{

$.getJSON("/saved", function(data) {
  if(data.length === 0)
  {
    $("#saved").append("<p>Uh Oh!! Looks like we don't have any new Articles.<br/>Scrape new articles.</p>");
  }
  else
  {  $("#heading").text("SAVED ARTICLES");

    for (var i = 0; i < data.length; i++) {
        $("#articles").empty();
        $("#saved").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<button data-id='" + data[i]._id + "'type='button' id=' btn' class='myButton1 deletearticle' data-toggle='modal' data-target='#deleteModal'>Delete</button><button data-id='" + data[i]._id + "'type='button' class='myButton1 adddnotesbtn' id='addnotes"+i+"'  data-toggle='modal' data-target='#exampleModal'>Add Notes</button><br/><a id='articleid' href='"+data[i].link + "'>"+data[i].link+"</a></p>");
        //$("#saved").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<button data-id='" + data[i]._id + "'type='button' id='deletebtn' class='myButton1' data-toggle='modal' data-target='#deleteModal'>Delete</button><button data-id='" + data[i]._id + "'type='button' class='myButton1' id='addnotes"+i+"'  data-toggle='modal' data-target='#exampleModal'>Add Notes</button><br/><a id='articleid'></a></p>");

  }
  }
  });

}

$(document).on("click","p .adddnotesbtn",function(){

  var thisId = $(this).attr("data-id");

  console.log(thisId);

  $("#articleidmodal").text(" "+thisId);

  $("#saveNoteModal").attr("data-id",thisId);  

  $("#message-text").val("");

  $("#prevNotes").empty();

  $.ajax({
    method: "GET",
    url: "/notes/" + thisId
  })
    // With that done, add the note information to the page
    .done(function(data) {
      // The title of the article
      // If there's a note in the article
      for(var i=0;i<data.length;i++)
      {
        $("#prevNotes").append("<p>"+data[i].body+"<button data-id='"+data[i]._id+"' id='deletenote' class='deleteNotebtn' data-dismiss='modal'><img id='close' src='img/close.png'></button></p>");
      }
        // Place the title of the note in the title input
        // Place the body of the note in the body textarea
      
    });


});

// When you click the savenote button
$(document).on("click", "#saveNoteModal", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  console.log(thisId);

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      // Value taken from note textarea
      body: $("#message-text").val()
    }
  })
    // With that done
    .done(function(data) {
      // Log the response
      
       $("#message-text").val("");
      // Empty the notes section
      $("#notes").empty();
    });
});

$(document).on("click", "p .deleteNotebtn", function() {


    var thisId = $(this).attr("data-id");

    console.log("deletenote app.js "+thisId );

    $.ajax({
    method: "POST",
    url: "/notedelete/" + thisId
    })
    // With that done
    .done(function(data) {
      // Log the response      

      console.log("note deleted");

    });




});