console.log("Josue Romero")
console.log("Emily Gaska");
console.log("Chadi Bouaazzi")


function buildQueryURL() {

    var queryURL = "https://api.spoonacular.com/recipes/search?query=";   
    var queryParams = { "api-key": "2d8be9ee8837404dbaca8efa488054fc"};
    queryParams.q = $("#search")
    .val()
    .trim()
}





