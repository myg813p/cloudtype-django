from django.contrib import admin
from .models import ArmUsers

@admin.register(ArmUsers)
class ArmUsersAdmin(admin.ModelAdmin):
    list_display = ('biz_no', 'cust_id', 'cust_nm', 'biz_owner', 'biz_tel_no', 'biz_tel_hp', 'biz_email',)
    search_fields = ('biz_no', 'cust_id', 'cust_nm', 'biz_owner', 'biz_tel_no', 'biz_tel_hp', 'biz_email',)
    list_display_links = ('biz_no', 'cust_id', 'cust_nm', 'biz_owner', 'biz_tel_no', 'biz_tel_hp', 'biz_email',)