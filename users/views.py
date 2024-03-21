from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response

from users.serializers import UserSignupSerializer
from users.jwt_claim_serializer import SpartaTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from ai_front.models import ArmUsers
from users.models import User as UserModel
from django.contrib.auth.hashers import check_password

####gmail
import random
import string
from .main_gmail import auth_code

class FindID(APIView):
    def post(self, request):
        BizOwner = request.data['BizOwner'].replace(' ', '')
        BizNo = request.data['BizNo'].replace('-', '').replace(' ', '')
        BizEmail = request.data['BizEmail'].replace(' ', '')

        print(BizOwner, BizNo, BizEmail)

        #find_id
        user = UserModel.objects.filter(biz_no=BizNo, biz_owner=BizOwner, biz_email=BizEmail).first()
        if user:
            # Retrieve the username
            username = user.username

            # Return the username in the response
            return Response({'username': username}, status=status.HTTP_200_OK)
        else:
            # If no matching user is found, return an appropriate response
            return Response({'username': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

class FindPassword(APIView):
    def post(self, request):
        username = request.data['username'].replace(' ', '')
        BizOwner = request.data['BizOwner'].replace(' ', '')
        BizNo = request.data['BizNo'].replace('-', '').replace(' ', '')
        BizEmail = request.data['BizEmail'].replace(' ', '')

        print(BizOwner, BizNo, BizEmail)

        #find_id
        user = UserModel.objects.filter(username=username, biz_no=BizNo, biz_owner=BizOwner, biz_email=BizEmail).first()
        if user:

            #new_password
            characters = string.digits
            length = 10
            new_password = ''.join(random.choice(characters) for _ in range(length))

            #password save
            user.set_password(new_password)
            user.save()

            #인증 메일 발송
            auth_code(new_password, BizEmail)
            # Return the username in the response
            return Response({'useremail': BizEmail}, status=status.HTTP_200_OK)
        else:
            # If no matching user is found, return an appropriate response
            return Response({'useremail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

class ChangePassword(APIView):
    def post(self, request):
        username = request.data['username']
        floatingInputPassword = request.data['floatingInputPassword']
        floatingInputNewPassword = request.data['floatingInputNewPassword']

        # find user by username
        user = UserModel.objects.filter(username=username).first()

        if user:
            if check_password(floatingInputPassword, user.password):
                # Passwords match, update password
                user.set_password(floatingInputNewPassword)
                user.save()

                # Return success message
                return Response({'message': '비밀번호 변경 성공!'}, status=status.HTTP_200_OK)
            else:
                # If passwords don't match, return failure message
                return Response({'message': '실패! 비밀번호가 잘못되었습니다.'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            # If no matching user, return failure message
            return Response({'message': '실패! 유효하지 않은 사용자입니다.'}, status=status.HTTP_400_BAD_REQUEST)

class UserView(APIView):

    #사용자 정보 조회
    def get(self, request):
        user_data = {
            'username': request.user.username,
            'biz_no': request.user.biz_no,
            'biz_owner': request.user.biz_owner,
            'cust_nm': request.user.cust_nm,
        }
        return Response(user_data, status=status.HTTP_200_OK)

    # 회원가입
    def post(self, request):
        serializer = UserSignupSerializer(data=request.data)

        if serializer.is_valid() and len(serializer.validated_data['biz_owner'])>=3:
            # arm_user = ArmUsers.objects.filter(biz_no=serializer.validated_data['biz_no']).first()
            arm_user = ArmUsers.objects.filter(biz_no=serializer.validated_data['biz_no'], biz_owner__contains=serializer.validated_data['biz_owner']).first()


            if arm_user:
                serializer.validated_data['cust_id'] = ""
                serializer.validated_data['cust_nm'] = arm_user.cust_nm
                serializer.save()
                return Response({"message": "가입 완료!!"})
            else:
                print('아름넷에 사업자번호가 없음')
                # Forbidden
                return Response({"message": "none_arumnet"})
        else:
            print(serializer.errors)
            error_text = list(serializer.errors.keys())[0]
            print(error_text)
            #Bad Request
            return Response({"message": f'{error_text}'}, 400)


    #회원 정보 수정
    def put(self, request):
        return Response({"message": "put method!!"})

    #회원 탈퇴
    def delete(self, request):
        return Response({"message": "delete method!!"})

class SpartaTokenObtainPairView(TokenObtainPairView):
    serializer_class = SpartaTokenObtainPairSerializer