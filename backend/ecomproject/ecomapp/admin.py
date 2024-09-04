from django.contrib import admin
from .models import  Myrating, MyList , Movies

# Register your models here.
admin.site.register(Movies)
admin.site.register(Myrating)
admin.site.register(MyList)
