from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError
from decimal import Decimal
from django.utils.functional import cached_property
from django.utils.translation import gettext_lazy as _

# For PositiveDecimalField
class PositiveDecimalField(models.DecimalField):
    description = _("Positive decimal number")

    @cached_property
    def validators(self):
        return super().validators + [MinValueValidator(Decimal("0"))]

# Create your models here.

class Food(models.Model):
    name = models.CharField(max_length=64)
    calories = PositiveDecimalField(max_digits=10, decimal_places=2) # kcal/100g
    fats = PositiveDecimalField(max_digits=10, decimal_places=2) # g/100g
    carbs = PositiveDecimalField(max_digits=10, decimal_places=2) # g/100g
    proteins = PositiveDecimalField(max_digits=10, decimal_places=2) # g/100g
    portion_size = PositiveDecimalField(max_digits=10, decimal_places=2) # g

    def __str__(self):
        return self.name
    
class Product(Food):
    barcode = models.CharField(max_length=64, blank=True)

    def __str__(self):
        return self.name


class Ingredient(models.Model):
    base_product = models.ForeignKey(Product, related_name="ingredients", on_delete=models.SET_NULL, null=True)
    weight = PositiveDecimalField(max_digits=10, decimal_places=2) # Amount of ingredient used

    def __str__(self):
        return f"{self.weight}g of {self.base_product.name}"

class Recipe(Food):
    ingredients = models.ManyToManyField(Ingredient, related_name="recipies")

    def __str__(self):
        return self.name

class Meal(models.Model):
    MEAL_TIME_CHOICES = [
        (1, "Breakfast"),
        (2, "Second Breakfast"),
        (3, "Lunch"),
        (4, "Dinner"),
        (5, "Supper")
    ]
    date = models.DateField(editable=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="meals")
    food = models.ForeignKey(Food, related_name="meals", on_delete=models.CASCADE, null=True, blank=True)
    weight = PositiveDecimalField(max_digits=10, decimal_places=2) # Weight of the meal
    meal_time = models.IntegerField(choices=MEAL_TIME_CHOICES)

    @property
    def total_calories(self):
        return self.weight * self.food.calories / 100
    
    @property
    def total_fats(self):
        return self.weight * self.food.fats / 100
    
    @property
    def total_carbs(self):
        return self.weight * self.food.carbs / 100
    
    @property
    def total_proteins(self):
        return self.weight * self.food.proteins / 100

    def __str__(self):
        return f"{self.user} on {self.date}"

