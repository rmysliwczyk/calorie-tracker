# Calorie Tracker

## Overview:
This web application enables users to monitor their caloric intake by logging their daily meals. The main feature of the app is a database that users can update with their favorite food products. For each product, the database stores essential nutritional values per 100 grams, including calories, fats, carbohydrates, and proteins. Users can add their products and search for them using a responsive search function or by scanning product barcodes.

## Distinctiveness and Complexity:
This web app offers a modern and efficient interface, primarily based on a single-page application approach that relies heavily on JavaScript for dynamic data fetching and updating. Additionally, it features a robust API on the backend that provides significant flexibility. The API is built using Django and the Django Rest Framework (DRF), allowing users to access a user-friendly interface for API testing. No other projects in CS50W utilize Django Rest Framework, which allowed me to explore this popular tool independently through reading the documentation and experimenting with its features. 

Moreover, I have incorporated another Python module, django-filter, which integrates with DRF to facilitate the sending of search queries to my API. My unique approach to this web application allows for a better separation of the frontend and backend components. Currently, I am using a convenient, minimalistic, and responsive interface built with Bootstrap; however, it is feasible to modify the app to use another frontend framework, such as React or Angular, which is a goal for the future development of this project.

One of the standout features of my application is the ability to scan barcodes or QR codes to identify food products, achieved through the integration of an exciting project called html5-qrcode.

In my app, the models for the Django ORM are extensive and complex. I am using a large set of model definitions, and the complexity is further increased by the introduction of inheritance—the Product model class inherits from the Food model class. Additionally, I have defined a custom field called PositiveDecimalField, which extends the models.DecimalField. Moreover, I utilize a @property decorator to create methods that function like attributes, allowing for dynamic value calculations.

The database models are delivered to the frontend of the app through Django Rest Framework serializers and viewsets. While a lot of functionality is available out of the box, I made several modifications to ensure that only the data belonging to the user is presented. I extended the relevant methods to verify whether the request is coming from the user designated as the owner of the data in the database. To prevent malicious users from deleting all data, I implemented a system that allows the admin to "lock" certain products in the database. This feature prevents deletion or modification of these products unless they are unlocked by the admin. I achieved this by further extending Django Rest Framework methods to check if a given food product is marked as locked in the database.

To dynamically render the appropriate pages in my nearly single-page application, I utilize a feature of HTML called templates. I have created a large set of templates that I load using JavaScript and modify or extend as needed to incorporate essential elements into my app's interface.

As an experiment, I integrated the jQuery framework into my project and used it to replace some of the JavaScript in one of my static files. I wanted to determine whether it would enhance the clarity of my code and provide any additional benefits. Ultimately, I've concluded that the current state of pure JavaScript is sufficient, and I do not need to introduce jQuery. However, I have retained my changes to demonstrate my efforts to meet the complexity and distinctiveness requirements.

## Files contents
### **calorie_tracker_uwsgi.ini**  
Contains configuration for uWsgi, which is a tool used to serve Django apps, suitable for production environment.

### **requirements.txt**  
Contains Python dependencies needed for running this Django project. 

### **static/jquery-3.7.1.min.js**  
jQuery framework library code.

### **calorie_tracker/serializers.py**
Django Rest Framework serializers. Here I've defined serializers for each of my models, in order to allow Django Rest Framework to interact with the data in the project's database. The following serializer classes are defined:  
- FoodSerializer
- ProductSerializer
- IngredientSerializer
- RecipeSerializer
- MealSerializer

Most of the serializers in this file implement default behavior for Django models by inheriting from the `serializers.ModelSerializer` class. However, I modified the default implementation for the `MealSerializer` to ensure that the `user` field in the Meal request is read-only from the API's perspective. This means that it cannot be modified externally; instead, it is determined by the currently logged-in user.

### **calorie_tracker/views.py**
Django views. Most of the contents here are what I've defined for Django Rest Framework viewsets and filtering classes, used for handling API requests.  
**Filters** - These are used to define API endpoints that can be queried to return only data matching the filter in the query:
- ProductFilter
- MealFilter

**View sets** - These define the behaviour of the API endpoints:  
- FoodViewSet
- ProductViewSet
- IngredientViewSet
- RecipeViewSet
- MealViewSet

Currently, not all of the viewsets are implemented in the frontend portion of the project, but they have been defined as future planned features to extend the functionality of the project.

**Django views** - These are the regular Django views:  
- index - This currently redirects to the `meals` view. Login is required
- products - Renders the `products.html` template.
- meals - Renders the `meals.html` template. Login is required
- register - Renders `register_user.html` template and validated a POST request containing registration form data.

The regular Django views are very minimalistic, because all of the work that defines the interaction with the user is done in the javascript on the frontend.

### **calorie_tracker/urls.py**
This Django URL configuration defines routes for the calorie_tracker app. It maps paths to corresponding views (index, products, meals, register) and includes Django's built-in authentication URLs under "accounts/".

### **calorie_tracker/models.py**
This models.py file defines the database structure for the calorie_tracker app. It includes:

- Food - Base model for food items with nutritional values.
- Product - Extends Food, adding an optional barcode.
- Ingredient - Links a Product to a weight measurement.
- Recipe - Extends Food, containing multiple Ingredients.
- Meal - Tracks user meals with timestamps, linking to Food and calculating total nutrition.
- PositiveDecimalField - ensures non-negative decimal values.

### **calorie_tracker/admin.py**
This admin.py file registers the Product, Ingredient, Recipe, and Meal models with the Django admin site, allowing them to be managed through the Django admin interface.

### **calorie_tracker/templates/calorie_tracker/layout.html**
This layout.html file is the base template for the calorie_tracker app. It includes:

- Bootstrap for styling and JavaScript dependencies.
- A navigation bar with links to meals, products, and logout.
- A content block ({% block content %}) where child templates insert page-specific content.
- Reusable HTML templates for UI components like product search, meals list, and forms.

### **calorie_tracker/templates/calorie_tracker/meals.html**
This meals.html template extends layout.html and defines the content for the meals page. It includes:

A `<div>` placeholder (meals-div) for dynamically loading meal data.
JavaScript scripts (meals.js, products.js, scan.js) for handling meals, products, and barcode scanning.
A CSRF token for secure form submissions in JavaScript.

### **calorie_tracker/templates/calorie_tracker/products.html**
This template is essentialy the same as the meals.html, but doesn't include meals.js script. Here we have a `<div>` placeholder (products-div), where all products in the databes are dynamically loaded and displayed

### **calorie_tracker/static/calorie_tracker/meals.js**
The `meals.js` script is used to manage meals. It interacts with both the UI and backend API to fetch, add, update, and delete meals:

- getMeals(date) - Fetches a list of meals for a specific date.
- getMeal(mealId) - Fetches details of a specific meal by its ID.
- deleteMeal(mealId) - Deletes a specific meal.
- getFood(foodId) - Fetches details of a specific food by its ID.
- addMeal(meal) - Adds a new meal.
- updateMeal(meal) - Updates an existing meal.
- showAddMealProductSelection(mealtimeId) - Displays a product selection UI for adding a meal. and listens for a `selected-product` event, which triggers the `showAddMealForm` function.
- showAddMealForm(productId, mealtimeId) - Displays a form to add a meal, including details like food name, nutritional values, and weight. Updates meal calories based on the input weight. Submits the form by calling `addMeal` with selected food and weight.
- showEditMealForm(mealId) - Displays a form to edit an existing meal, pre-populated with its details (food name, nutritional info, weight). Submits the updated meal by calling `updateMeal`. Adds a button to delete the meal by calling `deleteMeal`.
- showMeals() - Displays all meals grouped by mealtime (e.g., Breakfast, Lunch). Fetches the list of meals for the selected date and dynamically builds the UI using HTML templates. Updates the total daily calories and allows users to add meals to each mealtime. Supports date selection for viewing meals on different dates.

This script allows for the following UI interactions: 
- **Mealtime Accordion**: Meals are grouped by mealtime (Breakfast, Lunch, etc.), with collapsible sections to view meals for each mealtime.
- **Add Meal Button**: Each mealtime has a button that opens the product selection form to add a new meal.
- **Meal Editing**: Users can edit existing meals or delete them by selecting a meal and modifying its details.

Additional features: 
- **Dynamic HTML Updates**: The DOM is dynamically updated to show meal details, forms, and other UI elements (like the mealtime accordion and total calorie count).
- **History API**: The browser history is managed using `history.pushState` and `history.replaceState` to track different meal forms (e.g., adding or editing a meal).

### **calorie_tracker/static/calorie_tracker/products.js**
The `product.js` script provides functionality for interacting with products. It includes functions to fetch, add, update, delete, and manage products. It includes:

- getProducts(name = "", barcode = "") - Fetches a list of products filtered by name or barcode.
- getProduct(productId) - Fetches details of a specific product by ID.
- addProduct(product) - Adds a new product.
- updateProduct(product) - Updates an existing product.
- deleteProduct(productId) - Deletes a specific product.
- scanBarcode(returnFunction) - Initiates barcode scanning and returns the scanned barcode to the provided function.
- showEditProductForm(productId, receivedBarcode = "") - Displays a form to edit an existing product, pre-populated with its details. Allows editing fields like product name, calories, fats, carbs, proteins, and barcode.
- showAddProductForm(receivedBarcode = "") - Displays a form to add a new product, with an optional barcode scan, then submits the product data and calls `addProduct` on form submission.
- showProducts(name = "", receivedBarcode = "") - Displays a list of products with a search bar for filtering by name or barcode. Allows users to add products or scan a barcode to find specific products.

This script allows for the following UI interactions: 
- **Product Search**: Users can search products by name or barcode, dynamically fetching and displaying results.
- **Barcode Scan**: Users can scan a barcode to either find an existing product or add a new one.
- **Product Edit**: Users can edit an existing product's details or delete it if not locked.
- **Add Product**: Users can add new products via a form with fields for nutritional information and barcode.

Additional features: 
- **Dynamic Form Updates**: Forms for adding or editing products are populated dynamically based on user actions.
- **History API**: The browser history is managed for actions like adding, editing, or scanning products.

### **calorie_tracker/static/calorie_tracker/scan.js**
This file acts as an interface to the HTML5 QR JavaScript library, which facilitates the scanning functionality.

### **calorie_tracker/static/calorie_tracker/sessionData.js**
This file contains global variables and logic to manage window history, allowing users to navigate back a page even though the page has not technically reloaded.

## How to Run the Application
Make sure you have Python 3, PIP, and the Python venv installed on your system. For Debian-based systems, you can ensure you have everything you need by entering the following command:
```
sudo apt install python3 python3-venv python3-pip 
``` 
Once you have cloned or downloaded the source code, navigate to the root folder of the calorie-tracker and run the following commands: 
```
bash python3 -m venv .
source bin/activate
pip install -r requirements.txt
python3 manage.py migrate
python3 manage.pt collectstatic
python3 manage.py runserver 
``` 
If you are using a different operating system, you will need to figure out how to install the modules specified in the `requirements.txt` file. Make sure to run the command `python3 manage.py migrate` before executing `python3 manage.py runserver`.

