console.log("Josue Romero")
console.log("Emily Gaska");
console.log("Chadi Bouaazzi")

searchTerm = "";
var apiKey = "2d8be9ee8837404dbaca8efa488054fc";

function recipeInfoPull(id) {
    queryURL = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`;
    console.log(queryURL);
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


        })


}


function displayRecipe() {
    var queryURL = `https://api.spoonacular.com/recipes/search?query=${searchTerm}&number=2&apiKey=${apiKey}`;

    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {
            searchTerm = response;
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

$("#searchButton").on("click", function () {
    searchTerm = $("#searchinput").val().trim();
    console.log("Test 1: " + searchTerm);
    displayRecipe(searchTerm);


})
