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
  path("reset_password/<int:pk>/", views.reset_password, name="reset_password"),
  path("user/<int:pk>/", views.user_detail),
  path('users/', views.user_list),
  path("comment/<int:pk>/", views.comment_detail),
  path('comments/<int:pk>', views.comment_list),
]