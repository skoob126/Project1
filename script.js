

searchTerm = "";
var apiKey = "2d8be9ee8837404dbaca8efa488054fc";
 loadInitialHistory();
 prependHistoryElement()
    

function displayRecipe(){
    var queryURL = "https://api.spoonacular.com/recipes/search?query=" + searchTerm + "&number=2&apiKey=" + apiKey;

    
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {
            searchTerm = response;
            console.log(queryURL);

            // Pulling variable information from the API
            var recipeTitle = response.results[0].title;
            var readyIn = response.results[0].readyInMinutes;
            var servings = response.results[0].servings;
            var sourceUrl = response.results[0].sourceUrl;

            // console.log(recipeTitle);
            // console.log(readyIn);
            // console.log(sourceUrl);

            //Creating Storing div tag
            var recipeDiv =$("<div>");

            //Creating element tags with the recipe info
            var recipeTitleEl = $("<h2>").text(recipeTitle);
            var readyInEl = $("<p>").text("Ready in " + readyIn + " minutes");
            var servingsEl = $("<p>").text("Servings: " + servings);
            var sourceEl = $("<p>").html( `<a href= "${sourceUrl}"> Source </a>`);


            //Appending to the recipeDiv
            recipeDiv.append(recipeTitleEl);
            recipeDiv.append(readyInEl);
            recipeDiv.append(servingsEl);
            recipeDiv.append(sourceEl);

            //Appending to HTML
            $("#recipeArea").append(recipeDiv);

            
        })

        

}
function addToHistory(searchinput) {
    var savedHistory = loadHistory();
    savedHistory.push(searchinput);
    localStorage.setItem('history', JSON.stringify(savedHistory));
    // prependHistoryElement(searchinput);
}

function loadHistory() {
    var savedHistory = localStorage.getItem('history');
    if (savedHistory) {
        return JSON.parse(savedHistory)
    } else {
        return [];
    }
}

function loadInitialHistory() {
    var savedHistory = loadHistory();
    
    for (let i = 0; i < savedHistory.length; i++) {
       prependHistoryElement(savedHistory[i]) 
       console.log("test");
    }
}
//functioning
function prependHistoryElement(searchinput) {
    var searchHistoryEL = $("<a>").addClass("list-group-item")
    searchHistoryEL.text(searchinput);
    $('#historyList').prepend(searchHistoryEL)
     $(`${"#searchinput"}Item`).click(function() {
        
     })
}


$("#searchButton").on("click", function () {
    searchTerm = $("#searchinput").val().trim();
    addToHistory(searchTerm);
    console.log("Test 1: " + searchTerm);
    displayRecipe(searchTerm);
    prependHistoryElement(searchTerm)
})