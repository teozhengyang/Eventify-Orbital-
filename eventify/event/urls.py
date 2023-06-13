from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenRefreshView

app_name = "event"
urlpatterns = [
  path('', views.get_routes),
  path('events/', views.event_list),
  path('events/<int:pk>/', views.event_detail),
  path('activities/', views.activity_list),
  path('activities/<int:pk>/', views.activity_detail),
  path('token/', views.NewTokenObtainPairView.as_view(), name ='token_obtain_pair'),
  path('token/refresh/', TokenRefreshView.as_view(), name ='token_refresh'),
  path("register/", views.register, name="register"),
  path("delete_user/<int:pk>/", views.delete_user, name="delete_user"),
  path("reset_password/<int:pk>/", views.reset_password, name="reset_password"),
]