# api_app/views.py
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.views import TokenVerifyView

from sqlalchemy import create_engine, text


class SaveRemark(TokenVerifyView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)


        def save_remark():
            rawNo = request.data['rawNo']
            new_remark = request.data['remarkText']

            # Usage example
            destination_db_params = {
                'user': 'root',
                'password': '#dpg85kjp',
                'host': 'svc.sel5.cloudtype.app',
                'port': '32691',
                'database': 'kiyoung',
            }

            destination_engine = create_engine(f"mysql+mysqlconnector://{destination_db_params['user']}:{destination_db_params['password']}@{destination_db_params['host']}:{destination_db_params['port']}/{destination_db_params['database']}")

            query = text("UPDATE admin_sep SET remark = :new_remark WHERE 사업자번호 = :rawNo")
            # print(f"Generated SQL Query: {query}")
            # print(f"new_remark: {new_remark}, rawNo: {rawNo}")

            try:
                with destination_engine.connect() as connection:
                    connection.execute(query, {'new_remark': new_remark, 'rawNo': rawNo})
                    connection.commit()
            except Exception as e:
                print(f"Error: {e}")

        # Check the status code of the verification response
        if response.status_code == status.HTTP_200_OK and request.data['username'] == "admin":
            save_remark()
            return Response({"res": "saved"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Token is invalid or expired"}, status=status.HTTP_401_UNAUTHORIZED)

class AdminData(TokenVerifyView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        def admin_data():
            # Usage example
            destination_db_params = {
                'user': 'root',
                'password': '#dpg85kjp',
                'host': 'svc.sel5.cloudtype.app',
                'port': '32691',
                'database': 'kiyoung',
            }

            destination_engine = create_engine(f"mysql+mysqlconnector://{destination_db_params['user']}:{destination_db_params['password']}@{destination_db_params['host']}:{destination_db_params['port']}/{destination_db_params['database']}")

            query = text("SELECT * FROM admin_sep")

            try:
                with destination_engine.connect() as connection:
                    result = connection.execute(query)
                    rows = result.fetchall()

                    if not rows:
                        print("No rows returned from the database")
                        return None

                    # Convert the result to a list of dictionaries
                    data = [dict(zip(result.keys(), row)) for row in rows]
                    return data
            except Exception as e:
                print(f"Error: {e}")
                return None

        # Check the status code of the verification response
        if response.status_code == status.HTTP_200_OK and request.data['username'] == "admin":
            data = admin_data()
            return Response({"adminData": data}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Token is invalid or expired"}, status=status.HTTP_401_UNAUTHORIZED)

class AdminTotal(TokenVerifyView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        def admin_data():
            # Usage example
            destination_db_params = {
                'user': 'root',
                'password': '#dpg85kjp',
                'host': 'svc.sel5.cloudtype.app',
                'port': '32691',
                'database': 'kiyoung',
            }

            destination_engine = create_engine(f"mysql+mysqlconnector://{destination_db_params['user']}:{destination_db_params['password']}@{destination_db_params['host']}:{destination_db_params['port']}/{destination_db_params['database']}")

            query = text("SELECT * FROM admin_main")

            try:
                with destination_engine.connect() as connection:
                    result = connection.execute(query)
                    rows = result.fetchall()

                    if not rows:
                        print("No rows returned from the database")
                        return None

                    # Convert the result to a list of dictionaries
                    data = [dict(zip(result.keys(), row)) for row in rows]
                    return data
            except Exception as e:
                print(f"Error: {e}")
                return None

        # Check the status code of the verification response
        if response.status_code == status.HTTP_200_OK and request.data['username'] == "admin":
            data = admin_data()
            return Response({"adminData": data}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Token is invalid or expired"}, status=status.HTTP_401_UNAUTHORIZED)