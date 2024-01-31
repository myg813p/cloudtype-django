from django.contrib import admin
from users.models import User as UserModel
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

class UserAdmin(BaseUserAdmin):

    list_display = ('id', 'username', 'biz_owner', 'biz_no', 'cust_nm', 'cust_id', 'biz_email')
    list_display_links = ('username', )
    list_filter = ('username', )
    search_fields = ('username', 'email', )

    fieldsets = (
        ("info", {'fields': ('username', 'biz_owner', 'biz_no', 'cust_nm', 'cust_id', 'biz_email', 'join_date',)}),
        ("Permissions", {'fields': ('is_admin', 'is_active', )}),)
    add_fieldsets = (
        (None, {
            'classes': ('wide', ),
            'fields': ('username', 'biz_owner', 'biz_no', 'cust_nm', 'cust_id', 'biz_email', 'password1', 'password2')
        }),
    )

    filter_horizontal = []

    def get_readonly_fields(self, request, obj=None):
        if obj:
            return ('username', 'join_date', )
        else:
            return ('join_date', )

admin.site.register(UserModel, UserAdmin)