# Generated by Django 5.0.1 on 2024-01-31 04:57

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('username', models.CharField(max_length=50, unique=True, verbose_name='사용자 계정')),
                ('password', models.CharField(max_length=128, verbose_name='비밀번호')),
                ('biz_owner', models.CharField(max_length=20, verbose_name='성함')),
                ('biz_no', models.CharField(max_length=10, unique=True, verbose_name='사업자번호')),
                ('cust_id', models.CharField(blank=True, max_length=14, verbose_name='아름넷코드')),
                ('cust_nm', models.CharField(blank=True, max_length=100, verbose_name='업체명')),
                ('biz_email', models.EmailField(max_length=100, verbose_name='이메일')),
                ('join_date', models.DateTimeField(auto_now_add=True, verbose_name='가입일')),
                ('is_active', models.BooleanField(default=True)),
                ('is_admin', models.BooleanField(default=False)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
