from django.urls import path, include
import calorie_tracker.views as views

app_name="calorie_tracker"
urlpatterns = [
    path("", views.index, name="index"),
    path("products", views.products, name="products"),
    path("meals", views.meals, name="meals"),
    path("accounts/", include("django.contrib.auth.urls")),
    path("accounts/register", views.register, name="register")
]