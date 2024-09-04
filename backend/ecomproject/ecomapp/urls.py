'''
from django.urls import path
from . import views


urlpatterns = [
    path('', views.index, name='index'),
    path('signup/', views.signUp, name='signup'),
    path('login/', include('rest_framework.urls'), name='login'),
    path('logout/', views.Logout, name='logout'),
    path('<int:movie_id>/', views.detail, name='detail'),
    path('watch/', views.watch, name='watch'),
    path('recommend/', views.recommend, name='recommend'),


]



'''
# urls.py
from django.urls import path
from . import views
from rest_framework_simplejwt.views import (TokenObtainPairView,TokenRefreshView,TokenVerifyView )

urlpatterns = [
    path('', views.getRoutes,name="getRoutes"),
    path('signup/', views.signup),
    path('login/', views.login),
    path('logout/', views.logout),
    path('movies/', views.movies),
    path('spefic_movies/<int:movie_id>/', views.spefic_movies),
    path('mylist/', views.manage_mylist),
    path('rating/', views.rating),
    path('recommend/', views.recommend),
    
    #-----------chartbot--------
    path('addupdatedeleterating/', views.addupdatedeleterating),
    
    
    #admin
    path('adminlogin/', views.admin_login),
    path('adminlogout/', views.admin_logout),
    path('adminmanage_movies/', views.manage_movies),
    path('adminmanage_users/', views.manage_users),
        
]


