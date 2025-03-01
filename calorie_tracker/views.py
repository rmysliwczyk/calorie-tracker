from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse
from django.contrib.auth import login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import UserCreationForm
from .models import Product, Meal, Food
from .serializers import *
from rest_framework import permissions, viewsets, status
from rest_framework.response import Response
from django_filters import rest_framework as filters
from django_filters import DateFilter

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

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        if request.user.is_staff == False:
            if instance.is_locked:
                return Response(data={'message': "This product is locked and cannot be updated by regular user"}, status=status.HTTP_403_FORBIDDEN)
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}

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

    def list(self, request):
        queryset = Meal.objects.filter(user=request.user)
        queryset = self.filter_queryset(queryset)
        
        serializer = MealSerializer(queryset, many=True)
        return Response(serializer.data)
    
    def retrieve(self, request, pk=None):
        queryset = Meal.objects.filter(user=request.user)
        queryset = self.filter_queryset(queryset)
        meal = get_object_or_404(queryset, pk=pk)
        serializer = MealSerializer(meal)
        return Response(serializer.data)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def destroy(self, request, pk=None):
        obj = self.get_object()
        if obj.user != self.request.user:
            return Response(data={'message': "This meal can only be deleted by owner"}, status=status.HTTP_403_FORBIDDEN)
        self.perform_destroy(obj)
        return Response(status=status.HTTP_204_NO_CONTENT)


@login_required
def index(request):
    return redirect(reverse("calorie_tracker:meals"))

def products(request):
    return render(request, "calorie_tracker/products.html")

@login_required
def meals(request):
    return render(request, "calorie_tracker/meals.html")

def about(request):
    return render(request, "calorie_tracker/about.html")

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
