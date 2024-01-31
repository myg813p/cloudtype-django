from django.urls import path
from . import views
from django.urls import include, path

urlpatterns = [
    path('', views.index, name='index'),
    path('login/', views.login, name='login'),
    # path('kyadmin/', views.kyadmin, name='kyadmin'),
    path('forgot-id/', views.forgot_id, name='forgot_id'),
    path('forgot-password/', views.forgot_password, name='forgot_password'),
    path('404/', views.page_404, name='404'),
    path('base/', views.base, name='base'),
    path('blank/', views.blank, name='blank'),
    path('buttons/', views.buttons, name='buttons'),
    path('cards/', views.cards, name='cards'),
    path('charts/', views.charts, name='charts'),
    path('register/', views.register, name='register'),
    path('tables/', views.tables, name='tables'),
    path('utilities-animation/', views.utilities_animation, name='utilities_animation'),
    path('utilities-border/', views.utilities_border, name='utilities_border'),
    path('utilities-color/', views.utilities_color, name='utilities_color'),
    path('utilities-other/', views.utilities_other, name='utilities_other'),
]

