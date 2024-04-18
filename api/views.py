# api_app/views.py
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.views import TokenVerifyView
from sqlalchemy import create_engine, text
import mysql.connector
from datetime import datetime, timedelta
import pandas as pd
import json


class SaveRemark(TokenVerifyView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)


        def save_remark():
            rawNo = request.data['rawNo']
            armNo = request.data['armNo']
            YM = request.data['YM']
            new_remark = request.data['remarkText']

            print(rawNo, armNo, new_remark)
            print(rawNo, armNo, new_remark)
            print(rawNo, armNo, new_remark)

            # Usage example
            destination_db_params = {
                'user': 'root',
                'password': '#dpg85kjp',
                'host': 'svc.sel5.cloudtype.app',
                'port': '32691',
                'database': 'kiyoung',
            }

            destination_engine = create_engine(f"mysql+mysqlconnector://{destination_db_params['user']}:{destination_db_params['password']}@{destination_db_params['host']}:{destination_db_params['port']}/{destination_db_params['database']}")

            if '-' not in new_remark and new_remark != '':
                query = text("UPDATE admin_sep SET remark = :new_remark WHERE 사업자번호 = :rawNo and 아름넷코드 = :armNo and YM = :YM")
            else:
                query = text("UPDATE admin_sep SET calendar = :new_remark WHERE 사업자번호 = :rawNo and 아름넷코드 = :armNo and YM = :YM")
            print(f"Generated SQL Query: {query}")
            print(f"new_remark: {new_remark}, rawNo: {rawNo}")

            try:
                with destination_engine.connect() as connection:
                    connection.execute(query, {'new_remark': new_remark, 'rawNo': rawNo, 'armNo': armNo, 'YM': YM})
                    connection.commit()
            except Exception as e:
                print(f"Error: {e}")

        # Check the status code of the verification response
        if response.status_code == status.HTTP_200_OK and request.data['username'] == "admin":
            save_remark()
            return Response({"res": "saved"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Token is invalid or expired"}, status=status.HTTP_401_UNAUTHORIZED)

class YangDown(TokenVerifyView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        RawId = request.data['RawId']

        SetDate = request.data['SetDate']
        set_date_obj = datetime.strptime(SetDate, '%Y-%m-%d')
        YangDo_start = set_date_obj.replace(day=1).strftime('%Y-%m-%d')
        YangDo_end = (set_date_obj - timedelta(days=1)).strftime('%Y-%m-%d')
        next_month = set_date_obj.replace(day=28) + timedelta(days=4)  # Ensure it goes to the next month
        YangSoo_end = (next_month - timedelta(days=next_month.day)).strftime('%Y-%m-%d')

        day_YangDo = [YangDo_start, YangDo_end]
        day_YangSoo = [SetDate, YangSoo_end]

        print('day_YangDo', day_YangDo)
        print('day_YangSoo', day_YangSoo)
        print(RawId)

        def baemin(Yang):
            # Establish the connection
            conn = mysql.connector.connect(
                host='localhost',
                user='root',
                password='0000',
                database='prom'
            )

            # Create a cursor object to interact with the database
            cursor = conn.cursor()

            # Example: Execute a simple query to fetch data
            query = f'''-- 배민
        -- 배민
        -- 배민
        SELECT *
        FROM(
            -- 배민
            (SELECT
                사업자번호,
                YM,
                brand,
                프로모션_구분 AS 행사,
                쿠폰사용금액 AS 쿠폰,
                CASE
                    WHEN YM LIKE '%2023%' AND brand = '떡참' THEN ROUND((쿠폰사용금액 * 0.5), 1) -- Adjust the ratio for 떡참 in 2023
                    WHEN YM LIKE '%2023%' THEN ROUND((쿠폰사용금액 * 0.7), 1) -- Adjust the ratio for other brands in 2023
                    ELSE 
                        CASE
                            -- VIP 프로모션, 배민 지원금 (두찜: 3500-500, 4500-1000 / 떡참: 4500-500, 5000-1000)
                            WHEN YM LIKE '%202403%' AND 프로모션_구분 LIKE '%VIP%' AND (쿠폰사용금액 = 3500 OR 쿠폰사용금액 = 4500) THEN ROUND(((쿠폰사용금액 - 500) * 0.6), 1)
                            WHEN YM LIKE '%202403%' AND 프로모션_구분 LIKE '%VIP%' AND (쿠폰사용금액 = 4000 OR 쿠폰사용금액 = 5000) THEN ROUND(((쿠폰사용금액 - 1000) * 0.6), 1)
                            -- 기본 계산
                            ELSE ROUND((쿠폰사용금액 * 0.6), 1)
                        END
                END AS 분담금,
                COUNT(CASE WHEN 정산금액 != 0 THEN 1 END) AS 건수,
                CASE
                    WHEN YM LIKE '%2023%' AND brand = '떡참' THEN ((쿠폰사용금액 * 0.5) * (COUNT(CASE WHEN 정산금액 != 0 THEN 1 END))) -- Adjust the ratio for 총합계
                    WHEN YM LIKE '%2023%' THEN ((쿠폰사용금액 * 0.7) * (COUNT(CASE WHEN 정산금액 != 0 THEN 1 END))) -- Adjust the ratio for 총합계 in 2024
                    ELSE 
                        CASE
                            -- VIP 프로모션, 배민 지원금 (두찜: 3500-500, 4500-1000 / 떡참: 4500-500, 5000-1000)
                            WHEN YM LIKE '%202403%' AND 프로모션_구분 LIKE '%VIP%' AND (쿠폰사용금액 = 3500 OR 쿠폰사용금액 = 4500) THEN ((쿠폰사용금액 - 500) * 0.6) * (COUNT(CASE WHEN 정산금액 != 0 THEN 1 END))
                            WHEN YM LIKE '%202403%' AND 프로모션_구분 LIKE '%VIP%' AND (쿠폰사용금액 = 4000 OR 쿠폰사용금액 = 5000) THEN ((쿠폰사용금액 - 1000) * 0.6) * (COUNT(CASE WHEN 정산금액 != 0 THEN 1 END))
                            -- 기본 계산
                            ELSE (쿠폰사용금액 * 0.6) * (COUNT(CASE WHEN 정산금액 != 0 THEN 1 END)) 
                        END
                END AS 총합계,
                CASE
                    WHEN YM LIKE '%2023%' AND brand = '떡참' THEN ((쿠폰사용금액 * 0.5) * (COUNT(CASE WHEN 정산금액 != 0 THEN 1 END))) / 2  -- Adjust the ratio for 과금1차
                    WHEN YM LIKE '%2023%' THEN ((쿠폰사용금액 * 0.7) * (COUNT(CASE WHEN 정산금액 != 0 THEN 1 END))) / 2 -- Adjust the ratio for 과금1차 in 2024
                    ELSE 
                        CASE
                            -- VIP 프로모션, 배민 지원금 (두찜: 3500-500, 4500-1000 / 떡참: 4500-500, 5000-1000)
                            WHEN YM LIKE '%202403%' AND 프로모션_구분 LIKE '%VIP%' AND (쿠폰사용금액 = 3500 OR 쿠폰사용금액 = 4500) THEN ((쿠폰사용금액 - 500) * 0.6) * (COUNT(CASE WHEN 정산금액 != 0 THEN 1 END)) / 2
                            WHEN YM LIKE '%202403%' AND 프로모션_구분 LIKE '%VIP%' AND (쿠폰사용금액 = 4000 OR 쿠폰사용금액 = 5000) THEN ((쿠폰사용금액 - 1000) * 0.6) * (COUNT(CASE WHEN 정산금액 != 0 THEN 1 END)) / 2
                            -- 기본 계산
                            ELSE (쿠폰사용금액 * 0.6) * (COUNT(CASE WHEN 정산금액 != 0 THEN 1 END)) / 2
                        END
                END AS '과금1차',
                CASE
                    WHEN YM LIKE '%2023%' AND brand = '떡참' THEN ((쿠폰사용금액 * 0.5) * (COUNT(CASE WHEN 정산금액 != 0 THEN 1 END))) / 2 -- Adjust the ratio for 과금2차
                    WHEN YM LIKE '%2023%' THEN ((쿠폰사용금액 * 0.7) * (COUNT(CASE WHEN 정산금액 != 0 THEN 1 END))) / 2 -- Adjust the ratio for 과금2차 in 2024
                    ELSE 
                        CASE
                            -- VIP 프로모션, 배민 지원금 (두찜: 3500-500, 4500-1000 / 떡참: 4500-500, 5000-1000)
                            WHEN YM LIKE '%202403%' AND 프로모션_구분 LIKE '%VIP%' AND (쿠폰사용금액 = 3500 OR 쿠폰사용금액 = 4500) THEN ((쿠폰사용금액 - 500) * 0.6) * (COUNT(CASE WHEN 정산금액 != 0 THEN 1 END)) / 2
                            WHEN YM LIKE '%202403%' AND 프로모션_구분 LIKE '%VIP%' AND (쿠폰사용금액 = 4000 OR 쿠폰사용금액 = 5000) THEN ((쿠폰사용금액 - 1000) * 0.6) * (COUNT(CASE WHEN 정산금액 != 0 THEN 1 END)) / 2
                            -- 기본 계산
                            ELSE (쿠폰사용금액 * 0.6) * (COUNT(CASE WHEN 정산금액 != 0 THEN 1 END)) / 2
                        END
                END AS '과금2차'
            FROM
                prom_baemin
            WHERE 사용일자 BETWEEN '{Yang[0]}' AND '{Yang[1]}'
            GROUP BY
                사업자번호, YM, brand, 행사, 쿠폰
            )
            UNION ALL

            -- 배민 메뉴할인
            (SELECT
                사업자번호,
                YM,
                brand,
                메뉴할인 AS 행사,
                ABS(메뉴할인금액) AS 쿠폰,
                CASE
                    WHEN YM LIKE '%2023%' AND brand = '떡참' THEN
                        ROUND((ABS(메뉴할인금액) * 0.5), 1) -- Adjust the ratio for 떡참 in 2023
                    WHEN YM LIKE '%2023%' THEN
                        ROUND((ABS(메뉴할인금액) * 0.7), 1) -- Adjust the ratio for other brands in 2023
                    ELSE
                        ROUND((ABS(메뉴할인금액) * 0.6), 1) -- Adjust the ratio for 2024 and beyond
                END AS 분담금,
                SUM(할인건수) AS 건수,
                CASE
                    WHEN YM LIKE '%2023%' AND brand = '떡참' THEN
                        (SUM(ABS(할인건수) * 메뉴할인금액) * 0.5) -- Adjust the ratio for 떡참 in 2023
                    WHEN YM LIKE '%2023%' THEN
                        (SUM(ABS(할인건수) * 메뉴할인금액) * 0.7) -- Adjust the ratio for other brands in 2023
                    ELSE
                        (SUM(ABS(할인건수) * 메뉴할인금액) * 0.6) -- Adjust the ratio for 2024 and beyond
                END AS '총합계',
                CASE
                    WHEN YM LIKE '%2023%' AND brand = '떡참' THEN
                        (SUM(ABS(할인건수) * 메뉴할인금액) * 0.5) / 2 -- Adjust the ratio for 떡참 in 2023
                    WHEN YM LIKE '%2023%' THEN
                        (SUM(ABS(할인건수) * 메뉴할인금액) * 0.7) / 2 -- Adjust the ratio for other brands in 2023
                    ELSE
                        (SUM(ABS(할인건수) * 메뉴할인금액) * 0.6) / 2 -- Adjust the ratio for 2024 and beyond
                END AS '과금1차',
                CASE
                    WHEN YM LIKE '%2023%' AND brand = '떡참' THEN
                        (SUM(ABS(할인건수) * 메뉴할인금액) * 0.5) / 2 -- Adjust the ratio for 떡참 in 2023
                    WHEN YM LIKE '%2023%' THEN
                        (SUM(ABS(할인건수) * 메뉴할인금액) * 0.7) / 2 -- Adjust the ratio for other brands in 2023
                    ELSE
                        (SUM(ABS(할인건수) * 메뉴할인금액) * 0.6) / 2 -- Adjust the ratio for 2024 and beyond
                END AS '과금2차'
            FROM
                prom_baemin_menuhalin
            WHERE 거래일자 BETWEEN '{Yang[0]}' AND '{Yang[1]}'
            GROUP BY
                사업자번호, YM, brand, 행사, 쿠폰, 분담금
            )
            UNION ALL

            -- 배민 기타(선물하기 쇼핑라이브)
            (SELECT
                사업자번호,
                YM,
                brand,
                이벤트구분 as 행사,
                '-' as 쿠폰,
                CASE
                    WHEN YM LIKE '%2023%' THEN '70%'
                    ELSE '60%'
                END as 분담금,
                (COUNT(CASE WHEN 구분 = '사용' THEN 1 END) - COUNT(CASE WHEN 구분 = '취소' THEN 1 END)) as 건수,
                (
                    SUM(
                        CASE
                            WHEN YM LIKE '%2023%' THEN 브랜드할인부담금 * 0.7
                            ELSE 브랜드할인부담금 * 0.6
                        END
                    ) + SUM(상품권이용료) + SUM(부가세)
                ) as 총합계,
                (
                    SUM(
                        CASE
                            WHEN YM LIKE '%2023%' THEN 브랜드할인부담금 * 0.7
                            ELSE 브랜드할인부담금 * 0.6
                        END
                    ) + SUM(상품권이용료) + SUM(부가세)
                ) as 과금1차,
                0 as 과금2차
            FROM
                prom_bamin_etc
            WHERE 거래일자 BETWEEN '{Yang[0]}' AND '{Yang[1]}'
            GROUP BY
                사업자번호, YM, brand, 행사, 쿠폰, 분담금
            )
        ) as combined
        WHERE 사업자번호='{RawId}'
        ORDER BY
            brand ASC, YM DESC, 사업자번호 ASC, 행사 ASC, 쿠폰 ASC;
                '''
            cursor.execute(query)

            # Fetch all the results
            results = cursor.fetchall()

            # Display the results
            print('len(results)', len(results))
            for row in results:
                print(row)

            # Close the cursor and connection
            cursor.close()
            conn.close()


            # Assuming 'results' is a list of tuples fetched from the database
            columns = ["사업자번호", "년월", "브랜드", "행사", "쿠폰", "분담금", "건수", "총합계", f"과금1차", f"과금2차"]

            # Create a DataFrame from the results
            df = pd.DataFrame(results, columns=columns)
            df['건수'] = df['건수'].astype(int)

            # # Sort the DataFrame by '사업자번호' and '년월'
            # df = df.sort_values(by=['브랜드', '년월', '사업자번호'], ascending=[True, False, True])

            # Get unique values of '사업자번호'
            unique_ids = df['사업자번호'].unique()

            for unique_id in unique_ids:
                # Select rows with the current '사업자번호'
                filtered_df = df[df['사업자번호'] == unique_id]

                json_data = filtered_df.to_json(orient='records', date_format='iso', default_handler=str)

                return json.loads(json_data)
        def coupang(Yang):
            # Establish the connection
            conn = mysql.connector.connect(
                host='localhost',
                user='root',
                password='0000',
                database='prom'
            )

            # Create a cursor object to interact with the database
            cursor = conn.cursor()

            # Example: Execute a simple query to fetch data
            query = f'''-- 쿠팡
        -- 쿠팡
        -- 쿠팡
        SELECT
            사업자등록번호 as 사업자번호,
            YM,
            brand,
            메뉴할인 as 행사,
            쿠폰,
            CASE
                WHEN YM LIKE '%2023%' AND brand = '떡참' THEN '50%' -- Adjust the ratio for 떡참 in 2023
                WHEN YM LIKE '%2023%' THEN '70%' -- Adjust the ratio for other brands in 2023
                ELSE '60%' -- Adjust the ratio for 2024 and beyond
            END AS 분담금,
            COUNT(CASE WHEN coupang_promotion_amount NOT LIKE '%-%' THEN 1 END) - COUNT(CASE WHEN coupang_promotion_amount LIKE '%-%' THEN 1 END) AS 건수,
            CASE
                WHEN YM LIKE '%2023%' AND brand = '떡참' THEN SUM(coupang_promotion_amount * 0.5) -- Adjust the ratio for 떡참 in 2023
                WHEN YM LIKE '%2023%' THEN SUM(coupang_promotion_amount * 0.7) -- Adjust the ratio for other brands in 2023
                ELSE SUM(coupang_promotion_amount * 0.6) -- Adjust the ratio for 2024 and beyond
            END AS 총합계,
            CASE
                WHEN YM LIKE '%2023%' AND brand = '떡참' THEN SUM(coupang_promotion_amount * 0.5) -- Adjust the ratio for 떡참 in 2023
                WHEN YM LIKE '%2023%' THEN SUM(coupang_promotion_amount * 0.7) -- Adjust the ratio for other brands in 2023
                ELSE SUM(coupang_promotion_amount * 0.6) -- Adjust the ratio for 2024 and beyond
            END AS 과금
        FROM
            prom_coupang
        WHERE recog_date BETWEEN '{Yang[0]}' AND '{Yang[1]}' AND 사업자등록번호 = '{RawId}'
        GROUP BY
            사업자번호, YM, brand, 행사, 쿠폰
        ORDER BY
            brand ASC, YM DESC, 사업자번호 ASC;
                '''
            cursor.execute(query)

            # Fetch all the results
            results = cursor.fetchall()

            # Display the results
            print('len(results)', len(results))
            for row in results:
                print(row)

            # Close the cursor and connection
            cursor.close()
            conn.close()


            # Assuming 'results' is a list of tuples fetched from the database
            columns = ["사업자번호", "년월", "브랜드", "행사", "쿠폰", "분담금", "건수", "총합계", f"과금"]

            # Create a DataFrame from the results
            df = pd.DataFrame(results, columns=columns)

            # Sort the DataFrame by '사업자번호' and '년월'
            df = df.sort_values(by=['브랜드', '년월', '사업자번호'], ascending=[True, False, True])

            # Get unique values of '사업자번호'
            unique_ids = df['사업자번호'].unique()


            # Save separate JSON files for each '사업자번호'
            for unique_id in unique_ids:
                # Select rows with the current '사업자번호'
                filtered_df = df[df['사업자번호'] == unique_id]

                json_data = filtered_df.to_json(orient='records', date_format='iso', default_handler=str)

                return json.loads(json_data)

        # Check the status code of the verification response
        if response.status_code == status.HTTP_200_OK and request.data['username'] == "admin":
            yangdo_baemin = baemin(day_YangDo)
            yangdo_coupang = coupang(day_YangDo)
            yangsoo_baemin = baemin(day_YangSoo)
            yangsoo_coupang = coupang(day_YangSoo)
            res = {
                "양도": {
                    "baemin": yangdo_baemin,
                    "coupang": yangdo_coupang
                },
                "양수": {
                    "baemin": yangsoo_baemin,
                    "coupang": yangsoo_coupang
                },
                "양도일": {
                    f"양도 ({YangDo_start} ~ {YangDo_end})"
                },
                "양수일": {
                    f"양수 ({SetDate} ~ {YangSoo_end})"
                }
            }

            print(res)

            return Response({"res": res}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Token is invalid or expired"}, status=status.HTTP_401_UNAUTHORIZED)


class AdminData(TokenVerifyView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        # print(request.data)

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

            query = text(f"SELECT * FROM admin_sep WHERE YM = '{request.data['selectedDate'].replace('-', '')}'")

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

class AdminData0(TokenVerifyView):
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

            query = text("SELECT * FROM admin_sep0")

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

            query = text(f"SELECT * FROM admin_main WHERE YM = '{request.data['selectedDate'].replace('-', '')}'")

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