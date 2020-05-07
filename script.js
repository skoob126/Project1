

searchTerm = "";
var apiKey = "2d8be9ee8837404dbaca8efa488054fc";
var appid = "d7b0ada5";
var nutritionAPIKey = "564db3a1db849563e92b49fc7b5ce44c";

loadInitialHistory();
prependHistoryElement()


function recipeInfoPull(id) {
    queryURL = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`;
    console.log("Test: " + queryURL);
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {
            console.log(queryURL)

            //Creates div tag to hold ingredients
            var ingredientDiv = $("<div>");
            //Creates the section header
            ingredientHeader = $("<h3>").text("Ingredients").attr("id", "ingredientHeader");
            ingredientDiv.append(ingredientHeader);

            //For loop to pull ingredient list from API/Display on page
            for (let i = 0; i < response.extendedIngredients.length; i++) {
                var ingredient = [];
                ingredient[i] = response.extendedIngredients[i].original;
                var ingredientEl = [];
                ingredientEl[i] = $("<li>").text(ingredient[i]).attr("id", "ingredient");
                ingredientDiv.append(ingredientEl).attr("id", "ingredientDiv");
                $("#recipeArea").append(ingredientDiv);
                // console.log(ingredientEl[i]);
                // console.log("Test Ingredient: " + ingredient[i]);
            }

            // Analyzed Instructions
            //Pulling the instructions for the recipe
            var instructionDiv = $("<div>");
            //Creates the section header
            instructionHeader = $("<h4>").text("Instructions").attr("id", "instructionHeader");
            instructionDiv.append(instructionHeader);

            //For loop to pull steps from API/Display on page
            console.log("Test: " + response.analyzedInstructions[0].steps);
            var steps = response.analyzedInstructions[0].steps;


            for (let i = 0; i < steps.length; i++) {
                var currentStep = steps[i]
                var stepsEl = $("<p>").text(currentStep.step).attr("id", "step");
                stepsEl.text(currentStep.step);
                instructionDiv.append(stepsEl).attr("id", "stepsDiv");
                $("#recipeArea").append(instructionDiv);
            }

            console.log(ingredient);

        })
}


//This function displays the base information about the recipe and pulls the recipe id
function displayRecipe(searchTerm) {
    var queryURL = `https://api.spoonacular.com/recipes/search?query=${searchTerm}&number=2&apiKey=${apiKey}`;
    $("#recipeArea").empty();

    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {

            console.log(queryURL);

            // Pulling variable information from the API
            var recipeID = response.results[0].id;
            var recipeTitle = response.results[0].title;
            var readyIn = response.results[0].readyInMinutes;
            var servings = response.results[0].servings;
            var sourceUrl = response.results[0].sourceUrl;


            recipeInfoPull(recipeID);
            // console.log(recipeTitle);
            // console.log(readyIn);
            // console.log(sourceUrl);

            //Creating Storing div tag
            var recipeDiv = $("<div>");

            //Creating element tags with the recipe info
            var recipeTitleEl = $("<h2>").text(recipeTitle);
            var readyInEl = $("<p>").text("Ready in " + readyIn + " minutes");
            var servingsEl = $("<p>").text("Servings: " + servings);
            var sourceEl = $("<p>").html(`<a href= "${sourceUrl}"> Source </a>`);


            //Appending to the recipeDiv
            recipeDiv.append(recipeTitleEl);
            recipeDiv.append(readyInEl);
            recipeDiv.append(servingsEl);
            recipeDiv.append(sourceEl);

            //Appending to HTML
            $("#recipeArea").append(recipeDiv);


        })
}

function displayNutrients(){

    fetch("https://cors-anywhere.herokuapp.com/https://api.edamam.com/api/nutrition-details?app_id=d7b0ada5&app_key=564db3a1db849563e92b49fc7b5ce44c",
{
 method: 'POST',
 headers: {
    'Content-Type': 'application/json'
    // 'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: JSON.stringify({"title": "Fresh Ham Roasted With Rye Bread and Dried Fruit Stuffing",  "ingr": [
    "1 fresh ham, about 18 pounds, prepared by your butcher (See Step 1)",
    "7 cloves garlic, minced",
    "1 tablespoon caraway seeds, crushed",
    "4 teaspoons salt",
    "Freshly ground pepper to taste",
    "1 teaspoon olive oil",
    "1 medium onion, peeled and chopped",
    "3 cups sourdough rye bread, cut into 1/2-inch cubes",
    "1 1/4 cups coarsely chopped pitted prunes",
    "1 1/4 cups coarsely chopped dried apricots",
    "1 large tart apple, peeled, cored and cut into 1/2-inch cubes",
    "2 teaspoons chopped fresh rosemary",
    "1 egg, lightly beaten",
    "1 cup chicken broth, homemade or low-sodium canned"
  ]})}
)
.then( resp => resp.json())
.then(resp => console.log(resp));

var kCal = resp.calories;
   console.log(kCal);

var fatLabel = resp.totalNutrients.FAT.label;
  console.log(fatLabel);

  var fatAmount = resp.totalNutrients.FAT.quantity;
  console.log(fatAmount);
  
  var fatUnit = resp.totalNutrients.FAT.quantity.unit;
  console.log(fatUnit);

  var sugarLabel = resp.totalNutrients.SUGAR.label;
  console.log(sugarLabel);

  var sugarAmount = resp.totalNutrients.FAT.quantity;
  console.log(sugarAmount);
  
  var sugarUnit = resp.totalNutrients.SUGAR.quantity.unit;
  console.log(sugarUnit);

var carbsLabel = resp.totalNutrients.CHOCDF.label;
console.log(carbsLabel);

  var carbsAmount = resp.totalNutrients.CHOCDF.quantity;
  console.log(carbsAmount);

var carbsUnit = resp.totalNutrients.CHOCDF.label.quantity.unit;
console.log(carbsUnit);

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
function prependHistoryElement(searchinput) {
    var searchHistoryEL = $("<a>").addClass("list-group-item")
    searchHistoryEL.text(searchinput);
    $('#historyList').prepend(searchHistoryEL)
    $(`${"#searchinput"}Item`).click(function () {

    })
}
$("#clearHistory").on("click", function(){
    $('#historyList').empty();
    localStorage.clear();

})


//On click previous search list item is searched again.
$("#historyList").on("click", ".list-group-item", function () {
    var searchTerm = $(this).text();
    addToHistory(searchTerm);
    console.log("Test 1: " + searchTerm);
    displayRecipe(searchTerm);
    prependHistoryElement(searchTerm)
})


//On click the search term in the form is searched. 
$("#searchButton").on("click", function () {
    searchTerm = $("#searchinput").val().trim();
    addToHistory(searchTerm);
    console.log("Test 1: " + searchTerm);
    displayRecipe(searchTerm);
    prependHistoryElement(searchTerm)
})
