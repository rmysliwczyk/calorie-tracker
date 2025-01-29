from django.shortcuts import render, redirect
from django.urls import reverse
from django.contrib.auth import login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import UserCreationForm
from django.http.response import HttpResponse, JsonResponse
from django.core.exceptions import ObjectDoesNotExist, ValidationError
from django.forms import ModelForm
from .models import Product, Meal, Food
from .serializers import *
from rest_framework import permissions, viewsets
from django_filters import rest_framework as filters

class ProductForm(ModelForm):
	class Meta:
		model = Product
		fields = "__all__"

class ProductFilter(filters.FilterSet):
	class Meta:
		model = Product
		fields = {
			"name": ["contains", "exact"],
			"barcode": ["contains", "exact"]
		}

class FoodViewSet(viewsets.ModelViewSet):
	queryset = Food.objects.all()
	serializer_class = FoodSerializer
	permission_classes = [permissions.IsAuthenticated]
	filter_backends = [filters.DjangoFilterBackend]

class ProductViewSet(viewsets.ModelViewSet):
	queryset = Product.objects.all()
	serializer_class = ProductSerializer
	permission_classes = [permissions.IsAuthenticated]
	filter_backends = [filters.DjangoFilterBackend]
	filterset_class = ProductFilter

class IngredientViewSet(viewsets.ModelViewSet):
	queryset = Ingredient.objects.all()
	serializer_class = IngredientSerializer
	permission_classes = [permissions.IsAuthenticated]

class RecipeViewSet(viewsets.ModelViewSet):
	queryset = Recipe.objects.all()
	serializer_class = RecipeSerializer
	permission_classes = [permissions.IsAuthenticated]

class MealViewSet(viewsets.ModelViewSet):
	queryset = Meal.objects.all()
	serializer_class = MealSerializer
	permission_classes = [permissions.IsAuthenticated]

	def perform_create(self, serializer):
		serializer.save(user=self.request.user)


@login_required
def index(request):
    return redirect(reverse("calorie_tracker:meals"))

def products(request):
	return render(request, "calorie_tracker/products.html")

def meals(request):
	return render(request, "calorie_tracker/meals.html")

def add_product(request):
	if request.method == "POST":
		# Get submitted product data 
		form = ProductForm(request.POST)
		if form.is_valid():
			form.save(commit=True)
			return redirect(reverse("calorie_tracker:products"))
		else:
			# Pass the form again including error message
			return render(request, "calorie_tracker/add_product.html", {"product_form":form})
			
	# Pass the form for the first time
	return render(request, "calorie_tracker/add_product.html", {"product_form":ProductForm()})

def register(request):
	if request.method == "POST":
		form = UserCreationForm(request.POST)
		if form.is_valid():
			new_user = form.save()
			login(request, new_user) 
			return redirect(reverse("calorie_tracker:index"))
		else:
			return render(request, "registration/register_user.html", {"form":form})
	return render(request, "registration/register_user.html", {"form":UserCreationForm()})
