

searchTerm = "";
var apiKey = "2d8be9ee8837404dbaca8efa488054fc";
var appid = "745bf414";
var nutritionAPIKey = "ffe32e547d32e44bf969d26545b472e7";

var recipe = {
    title: "",
    ingr: []
}

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
            var ingredient = [];
            for (let i = 0; i < response.extendedIngredients.length; i++) {
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
            var steps = response.analyzedInstructions[0].steps;


            for (let i = 0; i < steps.length; i++) {
                var currentStep = steps[i]
                var stepsEl = $("<p>").text(currentStep.step).attr("id", "step");
                stepsEl.text(currentStep.step);
                instructionDiv.append(stepsEl).attr("id", "stepsDiv");
                $("#recipeArea").append(instructionDiv);
            }

            console.log(ingredient);
            recipe.ingr = ingredient; 
            console.log(recipe.ingr);
            displayNutrients();

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

            recipe.title = recipeTitle;

            console.log(recipe.title);

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

function displayNutrients() {

    fetch("https://cors-anywhere.herokuapp.com/https://api.edamam.com/api/nutrition-details?app_id=d7b0ada5&app_key=564db3a1db849563e92b49fc7b5ce44c",
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(recipe)
        }
    )
        .then(resp => resp.json())
        .then(resp => {
            
        console.log(resp)

var kCal = resp.calories;
    console.log(kCal);

    // var fatLabel = resp.totalNutrients.FAT.label;
    // console.log(fatLabel);

    // var sugar = resp.SUGAR.label.quantity.unit;
    // console.log(sugar)

    // var carbs = resp.CHOCDF.label.quantity.unit;
    // console.log(carbs)
});
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
$("#clearHistory").on("click", function () {
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
