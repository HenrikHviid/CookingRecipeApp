window.onload = function () {
  // Display the recipe item.
  cookingRecipeAppDB.open(showRecipe);
};

function showRecipe() {
  var searchParams = new URLSearchParams(window.location.search);

  if (searchParams.has('id')) {
    var timestampParameter = searchParams.get('id');
    var id = parseInt(timestampParameter);

    cookingRecipeAppDB.fetchRecipe(id, function (recipe) {
      var recipeDiv = document.getElementById('recipe-item');

      if (recipe) {
        recipeDiv.innerHTML = '';

        var img = document.createElement('img');
        var title = document.createElement('h2');
        var description = document.createElement('p');
        var descriptionData = document.createElement('p');
        var estimation = document.createElement('p');
        var estimationData = document.createElement('p');
        var ingredients = document.createElement('p');
        var ingredientsData = document.createElement('p');

        img.src = 'images/recipe.jpg';
        img.className = 'recipe_image';
        title.innerHTML = recipe.title;
        description.innerHTML = 'Description:';
        descriptionData.innerHTML = recipe.description;
        estimation.innerHTML = 'Estimation:';
        estimationData.innerHTML = recipe.estimation + ' minutes';
        ingredients = 'Ingredients:';
        ingredientsData = recipe.ingredients;

        recipeDiv.appendChild(img);
        recipeDiv.appendChild(title);
        recipeDiv.appendChild(description);
        recipeDiv.appendChild(descriptionData);
        recipeDiv.appendChild(estimation);
        recipeDiv.appendChild(estimationData);
        recipeDiv.appendChild(ingredients);
        recipeDiv.appendChild(ingredientsData);
      }
    });
  } else {
    console.log('No timestamp id found in url');
  }
}
