window.onload = function () {

    // Display the todo items.
    cookingRecipeAppDB.open(refreshRecipes);

    
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




