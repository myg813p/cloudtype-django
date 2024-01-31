from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser


class UserManager(BaseUserManager):
    def create_user(self, username, password=None):
        if not username:
            raise ValueError('Users mush have an username')
        user = self.model(
            username=username,
        )
        print("가입")
        user.set_password(password)
        user.save(using=self._db)
        return user

    #python mange.py createsuperuser 사용 시 해당 함수가 사용됨
    def create_superuser(self, username, password=None):
        user = self.create_user(
            username=username,
            password=password
        )
        user.is_admin = True
        user.save(using=self._db)
        return user


# custom user model
class User(AbstractBaseUser):
    username = models.CharField("사용자 계정", max_length=50, unique=True)
    password = models.CharField("비밀번호", max_length=128)
    biz_owner = models.CharField("성함", max_length=20)
    biz_no = models.CharField("사업자번호", max_length=10, unique=True)
    cust_id = models.CharField("아름넷코드", max_length=14, blank=True)
    cust_nm = models.CharField("업체명", max_length=100, blank=True)
    biz_email = models.EmailField("이메일", max_length=100)
    join_date = models.DateTimeField("가입일", auto_now_add=True)

    is_active = models.BooleanField(default=True)

    is_admin = models.BooleanField(default=False)

    USERNAME_FIELD = 'username'

    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return f"{self.username}"

    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True

    @property
    def is_staff(self):
        return self.is_admin