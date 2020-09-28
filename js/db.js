

var cookingRecipeAppDB = (function() {
  var cDB = {};
  var datastore = null;

  /**
   * Open a connection to the datastore.
   */
  cDB.open = function(callback) {
    // Database version.
    var version = 1;

    // Open a connection to the datastore.
    var request = indexedDB.open('recipes', version);

    // Handle datastore upgrades.
    request.onupgradeneeded = function(e) {
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
    request.onsuccess = function(e) {
      // Get a reference to the DB.
      datastore = e.target.result;
      
      // Execute the callback.
      callback();
    };

    // Handle errors when opening the datastore.
    request.onerror = cDB.onerror;
  };


  /**
   * Fetch all of the todo items in the datastore.
   * @param {function} callback A function that will be executed once the items
   *                            have been retrieved. Will be passed a param with
   *                            an array of the todo items.
   */
  cDB.fetchTodos = function(callback) {
    var db = datastore;
    var transaction = db.transaction(['recipe'], 'readwrite');
    var objStore = transaction.objectStore('recipe');

    var keyRange = IDBKeyRange.lowerBound(0);
    var cursorRequest = objStore.openCursor(keyRange);

    var recipes = [];

    transaction.oncomplete = function(e) {
      // Execute the callback function.
      callback(recipes);
    };

    cursorRequest.onsuccess = function(e) {
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
   * Create a new todo item.
   * @param {string} text The todo item.
   */
  cDB.createTodo = function(title, ingredients, description, estimation, callback) {
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
      let recipeObject = {title: title, ingredients: ingredients, description: description, estimation: estimation, timestamp: timestamp};
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
   * Delete a todo item.
   * @param {int} id The timestamp (id) of the todo item to be deleted.
   * @param {function} callback A callback function that will be executed if the 
   *                            delete is successful.
   */
  cDB.deleteTodo = function(id, callback) {
    var db = datastore;
    var transaction = db.transaction(['recipe'], 'readwrite');
    var objStore = transaction.objectStore('recipe');
    
    var request = objStore.delete(id);
    
    request.onsuccess = function(e) {
      callback();
    }
    
    request.onerror = function(e) {
      console.log(e);
    }
  };


  // Export the tDB object.
  return cDB;
}());
