from django.contrib import admin
from django.forms import inlineformset_factory
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from .models import Product, Ingredient, Recipe, Meal, Profile
# Register your models here.

class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name = "User's profile information"

class UserAdmin(BaseUserAdmin):
    inlines = [ProfileInline]

    def get_inline_instances(self, request, obj = None):
        if not obj:
            return []
        return super().get_inline_instances(request, obj)

admin.site.register(Product)
admin.site.register(Ingredient)
admin.site.register(Recipe)
admin.site.register(Meal)
admin.site.unregister(User)
admin.site.register(User, UserAdmin)
