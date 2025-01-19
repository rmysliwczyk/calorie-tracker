from django.contrib import admin
from .models import Product, Ingredient, Recipe, Meal
# Register your models here.

admin.site.register(Product)
admin.site.register(Ingredient)
admin.site.register(Recipe)
admin.site.register(Meal)
