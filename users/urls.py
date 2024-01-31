from django.contrib import admin
from django.urls import path, include
from users import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    # user/
    path('', views.UserView.as_view()),
    path('api/token/', views.SpartaTokenObtainPairView.as_view(), name='token_obtain_pair'),
    # path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh', TokenRefreshView.as_view(), name='token_refresh'),

    path('api/findid', views.FindID.as_view()),
    path('api/findpassword', views.FindPassword.as_view()),
    path('api/changepassword', views.ChangePassword.as_view()),
]