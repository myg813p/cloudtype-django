# api/urls.py
from django.urls import path
from .views import SaveRemark, AdminData, AdminData0, AdminTotal, YangDown

urlpatterns = [
    path('SaveRemark/', SaveRemark.as_view(), name='SaveRemark'),
    path('YangDown/', YangDown.as_view(), name='YangDown'),
    path('AdminData/', AdminData.as_view(), name='AdminData'),
    path('AdminData0/', AdminData0.as_view(), name='AdminData0'),
    path('AdminTotal/', AdminTotal.as_view(), name='AdminTotal'),
]
