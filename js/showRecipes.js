window.onload = function () {
  // Display the recipe items.
  cookingRecipeAppDB.open(refreshRecipes);
};

// Update the list of recipe items.
function refreshRecipes() {
  cookingRecipeAppDB.fetchRecipes(function (recipes) {
    var recipeList = document.getElementById('recipe-items');

    if (recipes) {
      recipeList.innerHTML = '';

      for (var i = 0; i < recipes.length; i++) {
        // Read the recipe items backwards (most recent first).
        var recipe = recipes[recipes.length - 1 - i];

        var li = document.createElement('li');
        li.className = 'item-flex';
        var anchor = document.createElement('a');
        anchor.href = './recipe.html?id=' + recipe.timestamp;
        anchor.innerHTML = recipe.title;
        var img = document.createElement('img');
        img.src = 'images/recipe.jpg';
        img.className = 'avatar';

        li.appendChild(img);
        li.appendChild(anchor);
        recipeList.appendChild(li);
      }
    }
  });
}
