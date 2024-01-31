# api/urls.py
from django.urls import path
from .views import SaveRemark, AdminData, AdminTotal

urlpatterns = [
    path('SaveRemark/', SaveRemark.as_view(), name='SaveRemark'),
    path('AdminData/', AdminData.as_view(), name='AdminData'),
    path('AdminTotal/', AdminTotal.as_view(), name='AdminTotal'),
]
