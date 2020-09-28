
window.onload = function() {
  
    // Display the todo items.
    cookingRecipeAppDB.open(refreshTodos);
    
    
    // Get references to the form elements.
    var newRecipeForm = document.getElementById('new-recipe-form');
    var newRecipeInput = document.getElementById('new-recipe');
    
    
    // Handle new todo item form submissions.
    newRecipeForm.onsubmit = function() {
      // Get the todo text.
      var text = newRecipe.value;
      
      // Check to make sure the text is not blank (or just spaces).
      if (text.replace(/ /g,'') != '') {
        // Create the todo item.
        cookingRecipeAppDB.createRecipe(text, function(todo) {
          refreshRecipes();
        });
      }
      
      // Reset the input field.
      newRecipeInput.value = '';
      
      // Don't send the form.
      return false;
    };
    
  }
  
  // Update the list of todo items.
  function refreshRecipes() {  
    todoDB.fetchRecipes(function(recipes) {
      var recipeList = document.getElementById('recipe-items');
      recipeList.innerHTML = '';
      
      for(var i = 0; i < recipe.length; i++) {
        // Read the todo items backwards (most recent first).
        var recipe = recipes[(recipes.length - 1 - i)];
  
        var li = document.createElement('li');
        var checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.className = "recipe-checkbox";
        checkbox.setAttribute("data-id", recipe.timestamp);
        
        li.appendChild(checkbox);
        
        var span = document.createElement('span');
        span.innerHTML = recipe.text;
        
        li.appendChild(span);
        
        recipeList.appendChild(li);
        
        // TODO: Setup an event listener for the checkbox.
        // hint: you have to get the id of the clicked element, and then call the deleteTodo function on that element
        
      }
  
    });
  }
  
  
  
  