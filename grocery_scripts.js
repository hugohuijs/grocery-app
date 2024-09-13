// This is where global variables can be declared, which can thus be accessed anywhere in the document
var xmlDoc;
var menu;
var others; 
// Initialize an object to store the accumulated amounts for each ingredient
const accumulatedIngredients = {};
// Store the content of the select elements in the select variables of the HTML file
const select0 = document.getElementById("selection0");
const select1 = document.getElementById("selection1");
const select2 = document.getElementById("selection2");
const select3 = document.getElementById("selection3");
const select4 = document.getElementById("selection4");
const select5 = document.getElementById("selection5");
const select6 = document.getElementById("selection6");
const select7 = document.getElementById("selection7");
const select8 = document.getElementById("selection8");
const select9 = document.getElementById("selection9");
const select10 = document.getElementById("selection10");
const select11 = document.getElementById("selection11");
const select12 = document.getElementById("selection12");
const select13 = document.getElementById("selection13");
const select14 = document.getElementById("selection14");
const select15 = document.getElementById("selection15");
const select16 = document.getElementById("selection16");
const select17 = document.getElementById("selection17");
const select18 = document.getElementById("selection18");
const select19 = document.getElementById("selection19");
const select20 = document.getElementById("selection20");
// Create an array with the select elements from the week days and from the other items
const selectElements = [select0, select1, select2, select3, select4, select5, select6, select7];
const selectOptions = [select8, select9, select10, select11, select12, select13, select14, select15, select16, select17, select18, select19, select20];

// HERE WE LOAD THE XML FILE, PARSE ALL THE DATA AND CREATE A DOM OBJECT
// Create a new XMLHttpRequest object to make an asynchronous HTTP request
const xhttp = new XMLHttpRequest();
// Initialize the request, specify the method as GET and the URL of the file we want to retrieve
xhttp.open("GET", "recipes.xml", true);
// Send the HTTP request to retrieve the XML file
xhttp.send();
// Event handler to be executed once the XML is loaded. The code inside will then be executed
// Only after the file has been loaded, the rest of the functionality of the page is accessible
xhttp.onload = function(){
    // Retrieve the response text of the XMLHttpRequest object, in this case the content of the XML file
    const xmlString = this.responseText;
    // Create a new DOMParser object, which is used to parse XML or HTML strings into a DOM object
    const parser = new DOMParser();
    // Parse the XML string and MIME type (text/xml) as arguments and returns the DOM object (xmlDoc)
    xmlDoc = parser.parseFromString(xmlString, "text/xml")


// HERE WE CREATE THE DROPDOWN MENU WITH THE TABLES THAT DISPLAY ALL THE AVAILABLE DISHES AND OTHER OPTIONS
    // Declare the menu variable to store the result of XML elements with tag name "RECIPE" and "EXTRA"
    menu = xmlDoc.getElementsByTagName("RECIPE");
    others = xmlDoc.getElementsByTagName("OTHER")

// This function creates the table with the names of the dishes and other items stored in the recipe file
    function menuFunction(menu) {
        // Create a table with the header Recipes
        let recipe_table="<tr><th>Recipes</th></tr>";
        // Loop over the RECIPE items and extract the "dish" values
        for (let i = 0; i < menu.length; i++) { 
            const dishName = menu[i].getElementsByTagName("dish")[0].childNodes[0].nodeValue;
            // Check if the dishName is not "None" before adding it to the table
            if (dishName.trim() !== "None") {
            // Fill up the table with the names of the available dishes
            recipe_table += "<tr><td>" +
                dishName +
                "</td></tr>";
            }
        }
        document.getElementById("recipeTable").innerHTML = recipe_table;
        // Create a table with the header Other items
        let other_table="<tr><th>Other items</th></tr>";
        // Loop over the OTHER ITEMS items and extract the values
        for (let i = 0; i < others.length; i++) { 
            const optionName = others[i].getElementsByTagName("option")[0].childNodes[0].nodeValue;   
            // Check if the optionName is not "none" before adding it to the table           
            if (optionName.trim() !== "None") {
            // Fill up the table with the names of the available items
                other_table += "<tr><td>" +
                    optionName +
                    "</td></tr>";
            }
        }
        document.getElementById("optionTable").innerHTML = other_table;
    }

    // Retrieve the dropdown button element
    const dropdownMenu = document.getElementById("dropdownMenu");
    const dropdownButton = document.getElementById("dropdownButton");

    // Add an event listener to the button
    dropdownButton.addEventListener('click', function() {
        toggleDropdown();
    });

// This function calls the tables when the button is pressed to display the recipes and items
    function toggleDropdown(){
        if (dropdownMenu.style.display === "block") {
            dropdownMenu.style.display = "none";
        } 
        else {
            dropdownMenu.style.display = "block";
            // We call the function to create the table on the HTML page
            menuFunction(menu);
        }
    }

// HERE WE FILL UP THE SELECT ELEMENTS WITH DISHES AND OTHER GROCERY ITEM OPTIONS
    // We call the function to fill up all the select elements
    populateSelectElements();
    // This functions selects which function should be executed for each item of a specific variable
    // In this case, we want to execute seperate functions for the recipe content then the other item content
    function populateSelectElements(){
        selectElements.forEach(showDish);
        selectOptions.forEach(showOther);
    }
// Here, we populate the select elements for each day of the week 
    function showDish(select){
        for (let i = 0; i < menu.length; i++) { 
            const dish = menu[i].getElementsByTagName("dish")[0].childNodes[0].nodeValue;
            // Create a element called option
            const option = document.createElement("option");
            // Create a textnode with the information of the "dish" for each iteration of the loop
            const optionText = document.createTextNode(dish);
            // Append the dish info to the option element
            option.appendChild(optionText);
            // Append the option data to the select element, which is displayed on the page
            select.appendChild(option);
        }  
    }
// Here, we populate the select elements for each other item that the user may want
    // It contains the same functionality as the function above, expect here we don't check for "None" names
    function showOther(select) {
        const others = xmlDoc.getElementsByTagName("OTHER");
        for (let i = 0; i < others.length; i++) {
            const item = others[i].getElementsByTagName("option")[0].textContent;
            const option = document.createElement("option");
            const optionText = document.createTextNode(item);
            option.appendChild(optionText);
            select.appendChild(option);

        }
    }


// HERE WE ALLOW THE USER TO PREVIEW THE INGREDIENTS OF A SPECIFIC DISH
    // Assign the HTML button element to the submitDish variable
    const submitDish = document.getElementById("submitDish");
    // Add an event listener to the button to execute the seeDish function upon submission
    submitDish.addEventListener("click", seeDish);
    // The function is called upon clicking the preview button on the page
// Firstly, we loop over the dishes to extract their ingredients and sort them by type
    function seeDish(){
        // Store the value of select element 7 into a variable, which contains the to be previewed recipe
        const selectedDish = select7.value;
        // Initialize an array to store the ingredients of the selected dish, which we use later
        const previewIngredients = [];
        // Create an object to store the ingredients sorted by their type, which we use later
        let sortedIngredients = {};
        // Extract the recipe nodes and store them in a variable
        const recipeOptions = xmlDoc.getElementsByTagName("RECIPE");
        // Iterate over the recipe nodes and store the dish content in a variable
        for (let i=0; i < recipeOptions.length; i++){
            const recipe = recipeOptions[i].getElementsByTagName("dish")[0].textContent;
            // If the recipe is the same as the selected dish (to be previewed), then execute the code to retrieve the ingredients
            if (recipe === selectedDish && recipe !== "None") {
                // Retrieve all the ingredients of the current dish / recipe
                const ingredients = recipeOptions[i].getElementsByTagName("ingredient");
                // Loop through the ingredients of the current dish and extract the data
                for (let j = 0; j < ingredients.length; j++) {
                    const ingredient = ingredients[j];
                    const type = ingredient.getElementsByTagName("type")[0].textContent;
                    const name = ingredient.getElementsByTagName("name")[0].textContent;
                    const amount = ingredient.getElementsByTagName("amount")[0].textContent;
                    const unit = ingredient.getElementsByTagName("unit")[0].textContent;
                // Create an object to store the ingredient data
                    const ingredientData = {
                        type: type,
                        name: name,
                        amount: amount,
                        unit: unit
                    };
                    // Add the ingredient data to the previewIngredients array
                    previewIngredients.push(ingredientData);
                }
                // Add the ingredients of the selected dish to the sortedIngredients object based on their type
                // Iterate over the ingredients of the to be previewed dish
                for (let i = 0; i < previewIngredients.length; i++) {
                    // For each iteration, retrieve the ingredient at index 'i' and assign it to the variable
                    const ingredient = previewIngredients[i];
                    // The type variable is assigned the value of ingredient.type (so the type of the ingredient)
                    const type = ingredient.type;
                    // If the statement is true, and a type is encountered for the first time --> then
                    // a new empty array is assigned to sortedIngredients[type]
                    if (!sortedIngredients[type]) {
                        // Here, the property name is the ingredient type and the value is an empty array
                        sortedIngredients[type] = [];
                    }
                    // Push the current ingredient data to the array corresponding to its type and go back into the loop
                    sortedIngredients[type].push(ingredient);
                }
            }
        }
// Next, we add the to be previewed ingredients to the previewDish HTML content
        // Create a string to store data and to display the sorted ingredient list
        let previewDish = "<h2>Ingredient List:</h2>";
        // Initialize another loop to go over the properties of the sortedIngredients object
        // We do this for each type that is found in the sortedIngredients object
        for (const type in sortedIngredients) {
            // Append an HTML unorderedlist to the string
            previewDish += "<ul>";
            // Add the type value to the string
            previewDish += `<h3>${type}</h3>`;
            // Using the forEach method, we iterate over the array of ingredients corresponding to the current type
            sortedIngredients[type].forEach((ingredient) => {
                // For each ingredient, create a list item that contains its name, amount and unit and append it to the string
                previewDish += `<li>${ingredient.name} - ${ingredient.amount} ${ingredient.unit}</li>`;
            });
            // Add a closing tag to the previewContent string
            previewDish += "</ul>";
        }
// Lastly, we display the preview content on the webpage by filling up the HTML element
        const previewNow = document.getElementById("previewNow");
        previewNow.innerHTML = previewDish;  
    }


// HERE WE ALLOW THE USER TO PREVIEW AND DOWNLOAD THE SORTED GROCERY LIST 
    // Assign the HTML element to the submitPreview variable
    const submitPreview = document.getElementById("submitPreview");
    // Add an event listener to the button to execute the seePreview function upon submission
    submitPreview.addEventListener("click", function(){
        seePreview(selectElements, selectOptions);
    });
    // Create a variable to store the content that is to be previewed, which is used later
    var previewContent = ""
    // Execute the preview function, for the select elements containing the weekly dishes and the other items
    function seePreview(selectElements, selectOptions){
        // Get the selected dishes and other options as well as the week days from all select elements and store them in an array
        const selectedDishes = [...selectElements, ...selectOptions].map((select) => select.value);
        const selectedDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        // Create an object to store the ingredients sorted by their type, which we use later again
        let sortedIngredients = {};
// First, we want to extract the info for all the weekly recipes, which mimics the other preview functionality 
        const quantity0 = document.getElementById("quantity0");
        const quantity1 = document.getElementById("quantity1");
        const quantity2 = document.getElementById("quantity2");
        const quantity3 = document.getElementById("quantity3");
        const quantity4 = document.getElementById("quantity4");
        const quantity5 = document.getElementById("quantity5");
        const quantity6 = document.getElementById("quantity6");
        const recipeQuantityElements = [quantity0, quantity1, quantity2, quantity3, quantity4, quantity5, quantity6];
        const selectedDishvalues = [
            select0.value,
            select1.value,
            select2.value,
            select3.value,
            select4.value,
            select5.value,
            select6.value,     
        ];
        // Start a loop to iterate over the selected dishes for each day of the week
        for (let i = 0; i < selectedDishvalues.length; i++) {
            // Retrieve all the RECIPE nodes and assign them to a variable
            const dish = selectedDishvalues[i];
            const recipeNodes = xmlDoc.getElementsByTagName("RECIPE");
            // Retrieve the corresponding quantity input element
            const quantElement = recipeQuantityElements[i];
            // Start another loop to iterate over the recipeNodes
            for (let j = 0; j < recipeNodes.length; j++) {
            // For each node, retrieve the dish name and store it in the recipeDish variable
            const recipe = recipeNodes[j];
            const recipeDish = recipe.getElementsByTagName("dish")[0].textContent;
                // If the recipeDish matches the currently selected dish, then proceed to extract the ingredients
                if (recipeDish === dish) {
                    // Retrieve all the ingredients of the current dish / recipe
                    const ingredients = recipe.getElementsByTagName("ingredient");
                    // Initialize an array to store the dishIngredients for the current dish
                    const dishIngredients = [];
                    // Loop through the ingredients of the current dish and extract the data
                    for (let j = 0; j < ingredients.length; j++) {
                        const ingredient = ingredients[j];
                        const type = ingredient.getElementsByTagName("type")[0].textContent;
                        const name = ingredient.getElementsByTagName("name")[0].textContent;
                        const quant = ingredient.getElementsByTagName("amount")[0].textContent;
                        const amount = parseFloat(quant) * quantElement.value;
                        const unit = ingredient.getElementsByTagName("unit")[0].textContent;
                    // Create an object to store the ingredient data
                        const ingredientData = {
                            type: type,
                            name: name,
                            amount: amount,
                            unit: unit
                        };
                        // Add the ingredient data to the dishIngredients array
                        dishIngredients.push(ingredientData);
                    }
                    // Add the ingredients of the current dish to the sortedIngredients object based on their type
                    // Iterate over the ingredients of the current dish
                    for (let k = 0; k < dishIngredients.length; k++) {
                        // For each iteration, retrieve the ingredient at index 'k' and assign it to the variable
                        const ingredient = dishIngredients[k];
                        // The type variable is assigned the value of ingredient.type
                        const type = ingredient.type;
                        // If the statement is true, and a type is encountered for the first type,
                        // a new empty array is assinged to 'sortedIngredients[type]
                        if (!sortedIngredients[type]) {
                            // Here, the property name is the ingredient type and the value is an empty array
                            sortedIngredients[type] = [];
                        }
                        // Push the current ingredient to the array corresponding to its type
                        sortedIngredients[type].push(ingredient);
                    }
                    // sortedIngredients now contains the ingredients of the selected dishes grouped by type
                }
            }
        }
// Secondly, we want to extract the info for all the other grocery items
        // We store the quantity and select values of the other items in variables in order to work with them in the loop
        const quantity8 = document.getElementById("quantity8");
        const quantity9 = document.getElementById("quantity9");
        const quantity10 = document.getElementById("quantity10");
        const quantity11 = document.getElementById("quantity11");
        const quantity12 = document.getElementById("quantity12");
        const quantity13 = document.getElementById("quantity13");
        const quantity14 = document.getElementById("quantity14");
        const quantity15 = document.getElementById("quantity15");
        const quantity16 = document.getElementById("quantity16");
        const quantity17 = document.getElementById("quantity17");
        const quantity18 = document.getElementById("quantity18");
        const quantity19 = document.getElementById("quantity19");
        const quantity20 = document.getElementById("quantity20");
        const inputQuantityElements = [quantity8, quantity9, quantity10, quantity11, quantity12, quantity13, quantity14, quantity15, quantity16, quantity17, quantity18, quantity19, quantity20];
        const selectValues = [
            select8.value,
            select9.value,
            select10.value,
            select11.value,
            select12.value,
            select13.value,
            select14.value,
            select15.value,
            select16.value,
            select17.value,
            select18.value,
            select19.value,   
            select20.value,         
        ];
        // Start a loop to iterate over the selected other items
        for (let i = 0; i < selectValues.length; i++) {
            // Retrieve the selected option from the select element
            const option = selectValues[i];
            // Retrieve the corresponding quantity input element
            const quantityElement = inputQuantityElements[i];
            // Retrieve all the OTHER nodes and assign them to a variable
            const otherNodes = xmlDoc.getElementsByTagName("OTHER");
            // Start another loop to iterate over the otherNodes
            for (let j = 0; j < otherNodes.length; j++) {
            // For each node, retrieve the item name and store it in the recipeDish variable
                const recipe = otherNodes[j];
                const recipeDish = recipe.getElementsByTagName("option")[0].textContent;
            // If the recipeDish matches the currently selected option, is not None or has no quantity, then proceed to extract the ingredients
                if (recipeDish.trim() === option.trim() && recipeDish !== "None" && !isNaN(quantityElement.value) && quantityElement.value !== "0") {
                    // Retrieve all the ingredients of the current item
                    const ingredients = recipe.getElementsByTagName("ingredient");
                    // Initialize an array to store the dishIngredients for the current item
                    const optionIngredients = [];
                    // Loop through the ingredients of the current item and extract the data
                    for (let j = 0; j < ingredients.length; j++) {
                        const ingredient = ingredients[j];
                        const type = ingredient.getElementsByTagName("type")[0].textContent;
                        const name = ingredient.getElementsByTagName("name")[0].textContent;
                        const amount = quantityElement.value // Use the quantity entered by the user
                        const unit = ingredient.getElementsByTagName("unit")[0].textContent;
                    // Create an object to store the ingredient data
                        const ingredientData = {
                            type: type,
                            name: name,
                            amount: amount,
                            unit: unit
                        };
                        // Add the ingredient data to the dishIngredients array
                        optionIngredients.push(ingredientData);
                    }
                    // Add the ingredients of the current option to the sortedIngredients object based on their type
                    // Iterate over the ingredients of the current option
                    for (let k = 0; k < optionIngredients.length; k++) {
                        // For each iteration, retrieve the ingredient at index 'k' and assign it to the variable
                        const ingredient = optionIngredients[k];
                        // The type variable is assigned the value of ingredient.type
                        const type = ingredient.type;
                        // If the statement is true, and a type is encountered for the first type,
                        // a new empty array is assinged to 'sortedIngredients[type]
                        if (!sortedIngredients[type]) {
                            // Here, the property name is the ingredient type and the value is an empty array
                            sortedIngredients[type] = [];
                        }
                        // Push the current ingredient to the sorted ingredients array corresponding to its type
                        sortedIngredients[type].push(ingredient);
                    }
                    break; // Exit the inner loop since we found the matching option and processed its data
                    // SortedIngredients now contains the ingredients of the selected dishes AND other options, sorted by type
                }
            }
// Thirdly, we want to sum up duplicates of the sorted ingredients
        // Iterate over the ingredients in the sortedIngredients object
        for (const type in sortedIngredients) {
            // Retrieve the array of ingredients of the current type
            const ingredients = sortedIngredients[type];
            // Create an empty array to store the accumulated ingredients of the current type
            const accumulatedTypeIngredients = [];
            // Loop over each ingredient of the current type
            for (let i = 0; i < ingredients.length; i++) {
            // Retrieve the current ingredient object from the array
            const ingredient = ingredients[i];
            // Extract properties from the ingredient object to access them in the loop
            const { name, amount, unit } = ingredient;
            // Create a unique key for each ingredient by combining the type and name using template literals
            const key = `${type}-${name}`;
                // Check if the ingredient already exists in accumulatedIngredients by looking for its name
                const existingIngredient = accumulatedTypeIngredients.find(
                    (item) => item.name === name
                );
                if (existingIngredient) {
                    // If it exists, add the new amount to the already existing amount
                    existingIngredient.amount += parseFloat(amount);
                } else {
                    // Otherwise, create a new entry for the ingredient
                    accumulatedTypeIngredients.push({
                        type,
                        name,
                        amount: parseFloat(amount),
                        unit,
                    });
                }
            }
            // Assign the array to the object to store the accumulated ingredients for each type
            accumulatedIngredients[type] = accumulatedTypeIngredients;
        }        
// Fourthly, we create the preview for the user to see the list on the web page
        // Start filling up the variable with a header 
        previewContent = "<h2>Selected Dishes:</h2>";
        // Start a loop over the selectedDishes array
        for (let i=0; i < 7 && i < selectedDishes.length; i++) {
            // Be sure to use backticks, dollar signs and curly braces when using the template literals
            // Use a template literal to create a paragraph containing the selected day and dish
            // This paragraph is appended to the previewContent string
            previewContent += `<p>${selectedDays[i]}: ${selectedDishes[i]}</p>`;        
        }
        // Add the sorted ingredients to the preview HTML content
        // Add the second header to the previewContent string
        previewContent += "<h2>Sorted Shopping List:</h2>";
        // Initialize another loop to go over the properties of the sortedIngredients object
        for (const type in accumulatedIngredients) {
            // Add the type content to the string
            previewContent += `<h3>${type}</h3>`;
            // Append an HTML unorderedlist to the string
            previewContent += "<ul>";
            // Using the forEach method, we iterate over the array of ingredients corresponding to the current type
            accumulatedIngredients[type].forEach((ingredient) => {
                // For each ingredient, create a list item that explains its data and append it to the string
                previewContent += `<li>${ingredient.name} - ${ingredient.amount} ${ingredient.unit}</li>`;
            });
            // Add a closing tag to the previewContent string
            previewContent += "</ul>";
        }
        // Display the preview content on the page
        const previewSection = document.getElementById("previewSection");
        previewSection.innerHTML = previewContent;
        }


// Lastly, we allow the user to download the sorted grocery list
        // Retrieve the download button element
        const downloadButton = document.getElementById('downloadButton');
        // Add an event listener to the button
        downloadButton.addEventListener('click', function() {
            download();
        });
        // Define the download function
        function download() {
            // Create a variable with the name of the download file
            const filename = 'grocery-list.html';
            // Create an HTML template for the selected dishes and sorted list with checkboxes
            const htmlTemplate = `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                    ul {
                        list-style-type: none;
                    }
                    </style>
                </head>
                <body>
                    <h2>Selected Dishes:</h2>
                    <ul>
                    ${selectedDays
                    // Extract the first 7 elements of the selectedDays array and create a new array for these entries
                        .slice(0, 7)
                        // Display each element of the array and generate an HTML string for each item (days and selected dish)
                        .map((day, index) => `<li><input type="checkbox" id="dish${index}" /><label for="dish${index}">${day}: ${selectedDishes[index]}</label></li>`)
                        // Join all the HTML strings into a single string
                        .join('')}
                    </ul>
                    <h2>Sorted Shopping List:</h2>
                    ${Object.entries(accumulatedIngredients)
                        // Take the accumulatedIngredient object and convert it into key-value pairs (type and other data)
                        // Iterate over each pair and generate an HTML string for each type of ingredient
                        .map(([type, ingredients]) => {
                            // Store HTML list items for each type of ingredient
                            let ingredientList = '';
                            // Check if the value is an array to ensure only arrays are processed
                            // The rest is the same as above
                            if (Array.isArray(ingredients)) {
                                ingredientList = ingredients
                                    .map((ingredient, index) => `<li><input type="checkbox" id="ingredient${index}" /><label for="ingredient${index}">${ingredient.name} (${ingredient.amount} ${ingredient.unit})</label></li>`)
                                    .join('');
                            }
                            // Return the HTML string, including its type heading and list of ingredients
                            return `
                            <h3>${type}</h3>
                            <ul>
                                ${ingredientList}
                            </ul>
                            `;
                        })
                        // Join all the generated HTML strings into a single string
                        .join('')}
                </body>
                </html>
            `;
            // Create an anchor elements to serve as the link for  downloading the HTML file
            const element = document.createElement('a');
            // Set the href attribute of the <a> element, indicate the URL type and include the HTML content from above
            element.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(htmlTemplate));
            // Set the download attribute and specify the filename, which is hold in that variable
            element.setAttribute('download', filename);
            // Ensures that the <a> element is hidden on the page
            element.style.display = 'none';
            // Append the element to the body of the document, this makes it part of the page
            document.body.appendChild(element);
            // When the element is clicked, it downloads the file
            element.click();
            // Remove the <a> element from the body of the document to clean up the DOM
            document.body.removeChild(element);
            // Create a new window or tab and open the HTML file in it
            const newWindow = window.open();
            newWindow.document.open();
            newWindow.document.write(htmlTemplate);
            newWindow.document.close();
        }
    }
}

