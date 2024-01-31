from django.db import models


class ArmUsers(models.Model):
    cust_id = models.CharField("아름넷코드", max_length=20, blank=True, null=True)
    biz_no = models.CharField("사업자번호", max_length=20, blank=True, null=True)
    cust_nm = models.CharField("업체명", max_length=50, blank=True, null=True)
    biz_owner = models.CharField("점주명", max_length=20, blank=True, null=True)
    biz_zip_cd = models.CharField("우편번호", max_length=10, blank=True, null=True)
    biz_state = models.CharField("주소1", max_length=10, blank=True, null=True)
    biz_city = models.CharField("주소2", max_length=10, blank=True, null=True)
    biz_dong = models.CharField("주소3", max_length=20, blank=True, null=True)
    biz_addr1 = models.CharField("주소4", max_length=100, blank=True, null=True)
    biz_addr2 = models.CharField("주소5", max_length=100, blank=True, null=True)
    biz_addr = models.CharField("주소6", max_length=100, blank=True, null=True)
    biz_tel_no = models.CharField("전화번호", max_length=20, blank=True, null=True)
    biz_tel_hp = models.CharField("휴대폰번호", max_length=20, blank=True, null=True)
    biz_email = models.CharField("메일", max_length=50, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'arm_users'
