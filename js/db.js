var cookingRecipeAppDB = (function () {
  var cDB = {};
  var datastore = null;

  /**
   * Open a connection to the datastore.
   */
  cDB.open = function (callback) {
    // Database version.
    var version = 1;

    // Open a connection to the datastore.
    var request = indexedDB.open('recipes', version);

    // Handle datastore upgrades.
    request.onupgradeneeded = function (e) {
      var db = e.target.result;

      e.target.transaction.onerror = cDB.onerror;

      // Delete the old datastore.
      if (db.objectStoreNames.contains('recipe')) {
        db.deleteObjectStore('recipe');
      }

      // Create a new datastore.
      var store = db.createObjectStore('recipe', {
        keyPath: 'timestamp'
      });
    };

    // Handle successful datastore access.
    request.onsuccess = function (e) {
      // Get a reference to the DB.
      datastore = e.target.result;

      // Execute the callback.
      callback();
    };

    // Handle errors when opening the datastore.
    request.onerror = cDB.onerror;
  };


  /**
   * Fetch all of the recipe items in the datastore.
   * @param {function} callback A function that will be executed once the items
   *                            have been retrieved. Will be passed a param with
   *                            an array of the recipe items.
   */
  cDB.fetchRecipes = function (callback) {
    var db = datastore;
    // Open a read/write db transaction, ready for retrieving the data
    var transaction = db.transaction(['recipe'], 'readwrite');
    // Create an object store on the transaction
    var objStore = transaction.objectStore('recipe');

    var keyRange = IDBKeyRange.lowerBound(0);
    var cursorRequest = objStore.openCursor(keyRange);

    var recipes = [];

    transaction.oncomplete = function (e) {
      // Execute the callback function.
      callback(recipes);
    };

    cursorRequest.onsuccess = function (e) {
      var result = e.target.result;

      if (!!result == false) {
        return;
      }

      recipes.push(result.value);

      result.continue();
    };

    cursorRequest.onerror = cDB.onerror;
  };

  /**
   * Fetch one of the recipe item in the datastore.
   * @param {int} id The timestamp (id) of the recipe item to be fetched.
   * @param {function} callback A function that will be executed once the item
   *                            have been retrieved. Will be passed a param with
   *                            an object of the recipe item.
   */
  cDB.fetchRecipe = function (id, callback) {
    // Get a reference to the db.
    var db = datastore;
    // open a read/write db transaction, ready for retrieving the data
    var transaction = db.transaction(['recipe'], 'readwrite');

    // create an object store on the transaction
    var objectStore = transaction.objectStore('recipe');

    var recipe = {};

    // Make a request to get a record by key from the object store
    var objectStoreRequest = objectStore.get(id);

    objectStoreRequest.onsuccess = function (event) {
      // save the result of our request     
      recipe = objectStoreRequest.result;
    };

    // report on the success of the transaction completing, when everything is done
    transaction.oncomplete = function (event) {
      callback(recipe);
    };

    transaction.onerror = function (event) {
      console.log("Transaction fetchRecipe failed");
    };
  };


  /**
   * Create a new todo item.
   * @param {string} text The todo item.
   */
  cDB.createRecipe = function (title, ingredients, description, estimation, callback) {
    // Get a reference to the db.
    var db = datastore;

    //TODO: finish the rest of the function here. There's a comment for all the small steps you have to take: 

    // Initiate a new transaction.
    let transaction = db.transaction(['recipe'], 'readwrite')
    // Get the datastore.
    let objectStore = transaction.objectStore('recipe');
    // Create a timestamp for the todo item.
    let timestamp = Date.now();
    // Create an object for the todo item.
    let recipeObject = { title: title, ingredients: ingredients, description: description, estimation: estimation, timestamp: timestamp };
    // Create the datastore request.
    let request = objectStore.add(recipeObject);
    // Handle a successful datastore put.
    request.onsuccess = () => {
      console.log("Create recipe succesful");
    }
    // Execute the callback function.
    transaction.oncomplete = () => {
      callback();
    }
    // Handle errors.
    transaction.onerror = () => {
      console.log("Transaction not completed");
    }
  };

  /**
   * Delete a recipe item.
   * @param {int} id The timestamp (id) of the recipe item to be deleted.
   * @param {function} callback A callback function that will be executed if the 
   *                            delete is successful.
   */
  cDB.deleteRecipe = function (id, callback) {
    var db = datastore;
    var transaction = db.transaction(['recipe'], 'readwrite');
    var objStore = transaction.objectStore('recipe');

    var request = objStore.delete(id);

    request.onsuccess = function (e) {
      callback();
    }

    request.onerror = function (e) {
      console.log(e);
    }
  };

  // Export the tDB object.
  return cDB;
}());
