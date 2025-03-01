from rest_framework import serializers
from .models import Profile, Food, Product, Ingredient, Recipe, Meal

class FoodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Food
        fields = "__all__"

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"

class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = "__all__"

class RecipeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipe
        fields = "__all__"

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["calorie_goal", "user", "username"]
    
class MealSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True, default=serializers.CurrentUserDefault())
    class Meta:
        model = Meal 
        fields = [
            "id", "date", "user", "food", "food_id",
            "weight", "meal_time", "total_calories",
            "total_fats", "total_carbs", "total_proteins"
        ]
        read_only_fields = ["total_calories"]