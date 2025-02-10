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
from rest_framework import permissions, viewsets, status
from rest_framework.response import Response
from django_filters import rest_framework as filters
from django_filters import DateFilter

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

class MealFilter(filters.FilterSet):
    date = DateFilter()
    class Meta:
        model = Meal
        fields = ["date"]

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

    def destroy(self, request, pk=None):
        obj = self.get_object()
        if obj.is_locked:
            return Response(data={'message': "This product is locked and cannot be deleted"}, status=status.HTTP_403_FORBIDDEN)
        self.perform_destroy(obj)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def partial_update(self, request, pk=None):
        obj = self.get_object()
        if obj.is_locked:
            return Response(data={'message': "This product is locked and cannot be updated"}, status=status.HTTP_403_FORBIDDEN)
        self.perform_update(obj)
        return Response(status=status.HTTP_200_OK)

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
    filterset_class = MealFilter
    filter_backends = [filters.DjangoFilterBackend]

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
