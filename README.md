# Calorie Tracker

## Overview:
This web application enables users to monitor their caloric intake by logging their daily meals. The main feature of the app is a database that users can update with their favorite food products. For each product, the database stores essential nutritional values per 100 grams, including calories, fats, carbohydrates, and proteins. Users can add their products and search for them using a responsive search function or by scanning product barcodes.

## Distinctiveness and Complexity:
This web app offers a modern and efficient interface, primarily based on a single-page application approach that relies heavily on JavaScript for dynamic data fetching and updating. Additionally, it features a robust API on the backend that provides significant flexibility. The API is built using Django and the Django Rest Framework (DRF), allowing users to access a user-friendly interface for API testing. No other projects in CS50W utilize Django Rest Framework, which allowed me to explore this popular tool independently through reading the documentation and experimenting with its features. 

Moreover, I have incorporated another Python module, django-filter, which integrates with DRF to facilitate the sending of search queries to my API. My unique approach to this web application allows for a better separation of the frontend and backend components. Currently, I am using a convenient, minimalistic, and responsive interface built with Bootstrap; however, it is feasible to modify the app to use another frontend framework, such as React or Angular, which is a goal for the future development of this project.

One of the standout features of my application is the ability to scan barcodes or QR codes to identify food products, achieved through the integration of an exciting project called html5-qrcode.

In my app, the models for the Django ORM are extensive and complex. I am using a large set of model definitions, and the complexity is further increased by the introduction of inheritance—the Product model class inherits from the Food model class. Additionally, I have defined a custom field called PositiveDecimalField, which extends the models.DecimalField. Moreover, I utilize a @property decorator to create methods that function like attributes, allowing for dynamic value calculations.

To dynamically render the appropriate pages in my nearly single-page application, I utilize a feature of HTML called templates. I have created a large set of templates that I load using JavaScript and modify or extend as needed to incorporate essential elements into my app's interface.