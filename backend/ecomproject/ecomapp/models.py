

from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from django.contrib.auth.models import User
from django.contrib.auth.models import AbstractUser





class Movies(models.Model):
    title = models.CharField(max_length=200)
    genre = models.CharField(max_length=100)
    image_url = models.CharField(max_length=200, null=True, blank=True)

    def __str__(self):
        return self.title


class Myrating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    movie = models.ForeignKey(Movies, on_delete=models.CASCADE)
    rating = models.IntegerField(default=0, validators=[MaxValueValidator(5), MinValueValidator(0)])


class MyList(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    movie = models.ForeignKey(Movies, on_delete=models.CASCADE)
    watch = models.BooleanField(default=False)
    



