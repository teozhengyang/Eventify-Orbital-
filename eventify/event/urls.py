from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenRefreshView

app_name = "event"
urlpatterns = [
  path('', views.get_routes),
  path('token/', views.NewTokenObtainPairView.as_view(), name ='token_obtain_pair'),
  path('token/refresh/', TokenRefreshView.as_view(), name ='token_refresh'),
  path('profile/', views.get_profile),
  path("main", views.index, name="index"),
]

'''
  # login, logout, register paths
  path("login/", views.login_user, name="login"),
  path("register/", views.register, name="register"),
  path("event/", views.eventpage, name="newevent"),
'''
  