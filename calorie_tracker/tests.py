from django.test import TestCase
from django.core.exceptions import ObjectDoesNotExist
from decimal import Decimal
from .models import User, Profile, Product

# Create your tests here.
class TestUserModel(TestCase):
    def setUp(self):
        User.objects.create_user("test_user", "test@test.com", "test")
        another_user = User(username="another_way_of_creating_user", password="another")
        another_user.full_clean()
        another_user.save()

    def test_user_is_successfuly_created(self):
        test_user = User.objects.get(username="test_user")
        another_test_user = User.objects.get(username="another_way_of_creating_user")
        self.assertIsInstance(test_user, User)
        self.assertIsInstance(another_test_user, User)
        self.assertNotIsInstance(test_user, Profile)
        self.assertNotIsInstance(another_test_user, Profile)

    def test_get_non_existent_user_is_failing(self):
        with self.assertRaises(ObjectDoesNotExist):
            non_existent = User.objects.get(username="BabaYaga")

class TestProductModel(TestCase):
    def setUp(self):
        test_product = Product(
            name = "Test",
            calories = Decimal("11.11"),
            fats = Decimal("11"),
            carbs = 1,
            proteins = 1,
            portion_size = 1,
            barcode = "12345"
        )
        test_product.full_clean()
        test_product.save()

    def test_product_contains_base_food_class_fields(self):
        test_product = Product.objects.get(name="Test")
        self.assertIsInstance(test_product.calories, Decimal)
        self.assertEqual(test_product.calories, Decimal("11.11"))
        self.assertEqual(test_product.fats, Decimal("11"))
        self.assertEqual(test_product.carbs, 1)
        
