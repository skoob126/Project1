

searchTerm = "";
var apiKey = "2d8be9ee8837404dbaca8efa488054fc";
var appid = "745bf414";
var nutritionAPIKey = "ffe32e547d32e44bf969d26545b472e7";

var recipe = {
    title: "",
    ingr: []
}

// $('body').flowtype({
//     minimum   : 500,
//     maximum   : 1200,
//     minFont   : 10,
//     maxFont   : 18,
//     fontRatio : 30
//    });


//Function to run upon page load
loadInitialHistory();
prependHistoryElement()

//This function displays the base information about the recipe and pulls the recipe id
function displayRecipe(searchTerm) {
    var queryURL = `https://api.spoonacular.com/recipes/search?query=${searchTerm}&number=2&apiKey=${apiKey}`;
    $("#recipeArea").empty();

    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {
            // Pulling variable information from the API
            var recipeID = response.results[0].id;
            var recipeTitle = response.results[0].title;
            var readyIn = response.results[0].readyInMinutes;
            var servings = response.results[0].servings;
            var sourceUrl = response.results[0].sourceUrl;

            recipe.title = recipeTitle;
            recipeInfoPull(recipeID);
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

//Pulls the recipie ingredients and steps based on the recipe ID recieved from the displayRecipe()
function recipeInfoPull(id) {
    queryURL = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`;
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {
            //Creates div tag to hold ingredients
            var ingredientDiv = $("<div>");
            //Creates the section header
            ingredientHeader = $("<h3>").text("Ingredients").attr("id", "ingredientHeader");
            ingredientDiv.append(ingredientHeader);
            var ingredient = [];
           
            //For loop to pull ingredient list from API/Display on page
           
            for (let i = 0; i < response.extendedIngredients.length; i++) {
                ingredient[i] = response.extendedIngredients[i].original;
                var ingredientEl = [];
                ingredientEl[i] = $("<li>").text(ingredient[i]).attr("id", "ingredient");
                ingredientDiv.append(ingredientEl).attr("id", "ingredientDiv");
                $("#recipeArea").append(ingredientDiv);
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
            recipe.ingr = ingredient;

            //Calls the function displayNutrients
            displayNutrients();
        })
}


function displayNutrients() {
    $("#nutritionInformation").empty();
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
            //Creates the nutritionDiv to put the elements we are building in.
            var nutritionDiv = $("<div>");
            //Pulls the calculated calorie amount from the API and assigns that value to the variable kCal
            var kCal = resp.calories;
            //Creates the <p> tag which contains the calorie text (what we want to display on the page)
            var kCalEl = $("<p>").text("Total Calories: " + kCal);
            //Appends the the calorie <p> element into the nutritionDiv 
            nutritionDiv.append(kCalEl);

           //Gets the fat amount and appends to the nutrition div
            var fatAmount = resp.totalNutrients.FAT.quantity;
            var fatAmountPr = fatAmount.toPrecision(5);
            var fatUnit = resp.totalNutrients.FAT.unit;
            var fatEl = $("<p>").text("Total Fat: " + fatAmountPr + fatUnit);
            nutritionDiv.append(fatEl);
         
            //Gets the sugar amount and appends to the nutrition div
            var sugarAmount = resp.totalNutrients.SUGAR.quantity;
            var sugarAmountPr = sugarAmount.toPrecision(5);
            var sugarUnit = resp.totalNutrients.SUGAR.unit;
            var sugarEl = $("<p>").text("Total Sugar: " + sugarAmountPr + sugarUnit)
            nutritionDiv.append(sugarEl);
           
            
            //Gets the carb amount and appends to the nutrition div
            var carbsAmount = resp.totalNutrients.CHOCDF.quantity;
            var carbsAmountPr =  carbsAmount.toPrecision(5);
            var carbsUnit = resp.totalNutrients.CHOCDF.unit;
            var carbEl = $("<p>").text("Total Carbs: " + carbsAmountPr + carbsUnit);
            nutritionDiv.append(carbEl);

            //Appends the updated nutritionDiv into the nutritionInformation div(in the HTML)
            $("#nutritionInformation").append(nutritionDiv);


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

//Button clears search history once clicked
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
