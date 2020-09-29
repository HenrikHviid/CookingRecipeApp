window.onload = function () {

  // Display the todo items.
  cookingRecipeAppDB.open(refreshRecipes);

  // Get references to the form elements.
  var newRecipeForm = document.getElementById('new-recipe-form');
  var newRecipeTitleInput = document.getElementById('title');
  var newRecipeDescriptionInput = document.getElementById('description');
  var newRecipeEstimationInput = document.getElementById('estimation');
  var newRecipeIngredientsInput = document.getElementById('ingredients');

  // Handle new recipe item form submissions.
  newRecipeForm.onsubmit = function () {
    // Get the title text.
    var text = newRecipeTitleInput.value;

    // Check to make sure the text is not blank (or just spaces).
    if (text.replace(/ /g, '') != '') {

      // Create array out out ingredients input
      var ingredientsArray = newRecipeIngredientsInput.value.split(' ');
      console.log(ingredientsArray);

      // Create the recipe item.
      cookingRecipeAppDB.createRecipe(newRecipeTitleInput.value, "" + ingredientsArray, newRecipeDescriptionInput.value, newRecipeEstimationInput.value, function () {
        //refreshRecipes();
      });
    }

    // Reset the input fields.    
    newRecipeTitleInput.value = '';
    newRecipeDescriptionInput.value = '';
    newRecipeEstimationInput.value = '';
    newRecipeIngredientsInput.value = '';

    // Don't send the form.
    return false;
  };

}

// Update the list of recipe items.
function refreshRecipes() {
  cookingRecipeAppDB.fetchRecipes(function (recipes) {
    var recipeList = document.getElementById('recipe-items');

    if (recipeList) {
      recipeList.innerHTML = '';

      for (var i = 0; i < recipe.length; i++) {
        // Read the recipe items backwards (most recent first).
        var recipe = recipes[(recipes.length - 1 - i)];

        var li = document.createElement('li');
        var span = document.createElement('span');
        span.innerHTML = recipe.title;

        li.appendChild(span);
        recipeList.appendChild(li);
      }
    }


  });
}




