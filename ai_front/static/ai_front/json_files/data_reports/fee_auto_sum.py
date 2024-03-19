import mysql.connector
import pandas as pd
import os
import json
from dotenv import load_dotenv
load_dotenv()

from decimal import Decimal

class DecimalEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, Decimal):
            return float(o)
        return super(DecimalEncoder, self).default(o)

host = os.getenv('MYSQL_HOST')
user = os.getenv('MYSQL_USERNAME')
password = os.getenv('MYSQL_PASSWORD')
database = os.getenv('MYSQL_DB')


def sqlProcess(query):
    # Establish the connection
    conn = mysql.connector.connect(
        host=host,
        user=user,
        password=password,
        database=database
    )

    # Create a cursor object to interact with the database
    cursor = conn.cursor()

    # Example: Execute a simple query to fetch data
    cursor.execute(query)

    # Fetch the column names
    columns = [desc[0] for desc in cursor.description]

    # Fetch all the results
    results = cursor.fetchall()

    # Close the cursor and connection
    cursor.close()
    conn.close()

    # Combine column names and results into a dictionary
    results_with_header = [dict(zip(columns, row)) for row in results]

    return results_with_header

# -- 배민 진행내역 -- 배민 진행내역 -- 배민 진행내역 --

query1 = '''-- 배민 진행내역 -- 배민 진행내역 -- 배민 진행내역 -- 배민 진행내역 -- 배민 진행내역 -- 배민 진행내역 -- 배민 진행내역 -- 배민 진행내역 -- 배민 진행내역 
-- 배민 진행내역 -- 배민 진행내역 -- 배민 진행내역 -- 배민 진행내역 -- 배민 진행내역 -- 배민 진행내역 -- 배민 진행내역 -- 배민 진행내역 -- 배민 진행내역 
-- 배민 진행내역 -- 배민 진행내역 -- 배민 진행내역 -- 배민 진행내역 -- 배민 진행내역 -- 배민 진행내역 -- 배민 진행내역 -- 배민 진행내역 -- 배민 진행내역 
SELECT
    YM,
	brand,
    프로모션_구분,
    기간,
    쿠폰건수,
    CAST(본사분담금 AS SIGNED) AS 본사분담금,
    CAST(가맹점분담금 AS SIGNED) AS 가맹점분담금,
    광고분담금,
    CAST(합계 AS SIGNED) AS 합계
FROM (
	-- 진행내역 almost
    SELECT
		YM,
		brand,
        프로모션_구분,
        CONCAT(DATE_FORMAT(MIN(사용일자), '%m-%d'), ' ~ ', DATE_FORMAT(MAX(사용일자), '%m-%d')) AS 기간,
        COUNT(CASE WHEN 정산금액 != 0 THEN 1 END) AS 쿠폰건수,
        SUM(정산금액) * 0.4 AS 본사분담금,
        SUM(정산금액) * 0.6 AS 가맹점분담금,
        '' AS 광고분담금,
        SUM(정산금액) AS 합계
    FROM prom_baemin
    GROUP BY YM, brand, 프로모션_구분
    
    UNION ALL
    
	-- 진행내역 // 배민선물하기(면세), 배민쇼핑라이브(면세) 
    SELECT
		YM,
		brand,
        CONCAT(이벤트구분, '(면세)') AS 프로모션_구분,
        CONCAT(DATE_FORMAT(MIN(거래일자), '%m-%d'), ' ~ ', DATE_FORMAT(MAX(거래일자), '%m-%d')) AS 기간,
        (COUNT(CASE WHEN 구분 = '사용' THEN 1 END) - COUNT(CASE WHEN 구분 = '취소' THEN 1 END)) as 쿠폰건수,
        SUM(브랜드할인부담금 * 0.4) AS 본사분담금,
        SUM(브랜드할인부담금 * 0.6) AS 가맹점분담금,
        '' AS 광고분담금,
        (SUM(브랜드할인부담금)) AS 합계
    FROM prom_bamin_etc
    GROUP BY YM, brand, 프로모션_구분
    
    UNION ALL
    
	-- 진행내역 // 배민선물하기(과세), 배민쇼핑라이브(과세) 
    SELECT
        YM,
		brand,
        CONCAT(이벤트구분, '(과세)') AS 프로모션_구분,
        CONCAT(DATE_FORMAT(MIN(거래일자), '%m-%d'), ' ~ ', DATE_FORMAT(MAX(거래일자), '%m-%d')) AS 기간,
        '0' as 쿠폰건수,
        '0' AS 본사분담금,
        SUM(상품권이용료) + SUM(부가세) AS 가맹점분담금,
        '' AS 광고분담금,
        SUM(상품권이용료) + SUM(부가세) AS 합계
    FROM prom_bamin_etc
    GROUP BY YM, brand, 프로모션_구분
    
    UNION ALL
    
    -- 진행내역 // 메뉴할인
	SELECT
		YM,
		brand,
		CONCAT(메뉴할인, ' 1,100') AS 프로모션_구분,
		CONCAT(DATE_FORMAT(MIN(거래일자), '%m-%d'), ' ~ ', DATE_FORMAT(MAX(거래일자), '%m-%d')) AS 기간,
		SUM(할인건수) AS 쿠폰건수,
		SUM(ABS(할인건수) * 메뉴할인금액) * 0.4 AS 본사분담금,
		SUM(ABS(할인건수) * 메뉴할인금액) * 0.6 AS 가맹점분담금,
		'' AS 광고분담금,
		SUM(ABS(할인건수) * 메뉴할인금액) AS 합계
	FROM prom_baemin_menuhalin
	GROUP BY YM, brand, 메뉴할인
) AS combined_results
ORDER BY YM DESC, brand, 프로모션_구분 ASC, 기간 ASC;'''

# -- 배민 정산내역 -- 배민 정산내역 -- 배민 정산내역 --
query2 = '''-- 배민 정산내역 -- 배민 정산내역 -- 배민 정산내역 -- 배민 정산내역 -- 배민 정산내역 -- 배민 정산내역 -- 배민 정산내역 -- 배민 정산내역 -- 배민 정산내역 
-- 배민 정산내역 -- 배민 정산내역 -- 배민 정산내역 -- 배민 정산내역 -- 배민 정산내역 -- 배민 정산내역 -- 배민 정산내역 -- 배민 정산내역 -- 배민 정산내역 
-- 배민 정산내역 -- 배민 정산내역 -- 배민 정산내역 -- 배민 정산내역 -- 배민 정산내역 -- 배민 정산내역 -- 배민 정산내역 -- 배민 정산내역 -- 배민 정산내역 
SELECT 
    YM,
    brand,
    내용,
    날짜,
    금액,
    CAST(쿠폰건수_전체 AS SIGNED) AS 쿠폰건수_전체,
    CAST(납부금액_전체 AS SIGNED) AS 납부금액_전체,
    CAST(분담액_본사 AS SIGNED) AS 분담액_본사,
    CAST(합계_본사 AS SIGNED) AS 합계_본사,
    CAST(분담액_가맹 AS SIGNED) AS 분담액_가맹,
    CAST(합계_가맹 AS SIGNED) AS 합계_가맹,
    분담액,
    지원금액
FROM (
    -- 정산내역 almost
    SELECT
		YM,
        brand,
        프로모션_구분 AS 내용,
        CONCAT(DATE_FORMAT(MIN(사용일자), '%m-%d'), ' ~ ', DATE_FORMAT(MAX(사용일자), '%m-%d')) AS 날짜,
        쿠폰사용금액 AS 금액,
        COUNT(CASE WHEN 정산금액 != 0 THEN 1 END) AS 쿠폰건수_전체,
        SUM(정산금액) AS 납부금액_전체,
        쿠폰사용금액 * 0.4 AS 분담액_본사,
        SUM(정산금액) * 0.4 AS 합계_본사,
        쿠폰사용금액 * 0.6 AS 분담액_가맹,
        SUM(정산금액) * 0.6 AS 합계_가맹,
        '' AS 분담액,
        '' AS 지원금액
    FROM prom_baemin
    GROUP BY YM, brand, 내용, 금액

    UNION ALL

	-- 진행내역 // 배민선물하기(면세), 배민쇼핑라이브(면세) 
	SELECT
        YM,
		brand,
		CONCAT(이벤트구분, '(과세)') AS 내용,
		CONCAT(DATE_FORMAT(MIN(거래일자), '%m-%d'), ' ~ ', DATE_FORMAT(MAX(거래일자), '%m-%d')) AS 날짜,
		'' AS 금액,
		'' AS 쿠폰건수_전체,
		(SUM(상품권이용료) + SUM(부가세)) AS 납부금액_전체,
		'' AS 분담액_본사,
		'' AS 합계_본사,
		'100%' AS 분담액_가맹,
		(SUM(상품권이용료) + SUM(부가세)) AS 합계_가맹,
		'' AS 분담액,
		'' AS 지원금액
	FROM prom_bamin_etc
	GROUP BY YM, brand, 내용

	UNION ALL

	-- 진행내역 // 배민선물하기(과세), 배민쇼핑라이브(과세) 
	SELECT
		YM,
		brand,
		CONCAT(이벤트구분, '(면세)') AS 내용,
		CONCAT(DATE_FORMAT(MIN(거래일자), '%m-%d'), ' ~ ', DATE_FORMAT(MAX(거래일자), '%m-%d')) AS 날짜,
		'' AS 금액,
		(COUNT(CASE WHEN 구분 = '사용' THEN 1 END) - COUNT(CASE WHEN 구분 = '취소' THEN 1 END)) as 쿠폰건수_전체,
		(SUM(브랜드할인부담금)) AS 납부금액_전체,
		'40%' AS 분담액_본사,
		SUM(브랜드할인부담금 * 0.4) AS 합계_본사,
		'60%' AS 분담액_가맹,
		SUM(브랜드할인부담금 * 0.6) AS 합계_가맹,
		'' AS 분담액,
		'' AS 지원금액
	FROM prom_bamin_etc
	GROUP BY YM, brand, 내용

	UNION ALL

    -- 진행내역 // 메뉴할인
    SELECT
        YM,
        brand,
        메뉴할인 AS 내용,
        CONCAT(DATE_FORMAT(MIN(거래일자), '%m-%d'), ' ~ ', DATE_FORMAT(MAX(거래일자), '%m-%d')) AS 날짜,
        ABS(메뉴할인금액) AS 금액,
        SUM(할인건수) AS 쿠폰건수_전체,
        SUM(ABS(할인건수) * 메뉴할인금액) AS 납부금액_전체,
        SUM(ABS(할인건수) * 메뉴할인금액) * 0.4 AS 분담액_본사,
        SUM(ABS(할인건수) * 메뉴할인금액) * 0.4 AS 합계_본사,
        SUM(ABS(할인건수) * 메뉴할인금액) * 0.6 AS 분담액_가맹,
        SUM(ABS(할인건수) * 메뉴할인금액) * 0.6 AS 합계_가맹,
        '' AS 분담액,
        '' AS 지원금액
    FROM prom_baemin_menuhalin
    GROUP BY YM, brand, 내용, 금액
) AS combined_results
ORDER BY YM DESC, brand, 내용, 금액;'''

# -- 쿠팡 정산내역 -- 쿠팡 정산내역 -- 쿠팡 정산내역 --
query3 = '''-- 쿠팡 정산내역 -- 쿠팡 정산내역 -- 쿠팡 정산내역 -- 쿠팡 정산내역 -- 쿠팡 정산내역 -- 쿠팡 정산내역 -- 쿠팡 정산내역 -- 쿠팡 정산내역 -- 쿠팡 정산내역 -- 쿠팡 정산내역 -- 쿠팡 정산내역 
-- 쿠팡 정산내역 -- 쿠팡 정산내역 -- 쿠팡 정산내역 -- 쿠팡 정산내역 -- 쿠팡 정산내역 -- 쿠팡 정산내역 -- 쿠팡 정산내역 -- 쿠팡 정산내역 -- 쿠팡 정산내역 -- 쿠팡 정산내역 -- 쿠팡 정산내역 
-- 쿠팡 정산내역 -- 쿠팡 정산내역 -- 쿠팡 정산내역 -- 쿠팡 정산내역 -- 쿠팡 정산내역 -- 쿠팡 정산내역 -- 쿠팡 정산내역 -- 쿠팡 정산내역 -- 쿠팡 정산내역 -- 쿠팡 정산내역 -- 쿠팡 정산내역 
SELECT
	YM,
	brand,
	명칭_구분,
	날짜_구분,
	금액_구분,
	쿠폰건수_쿠폰상세,
	CAST(납부금액_쿠폰상세 AS SIGNED) AS 납부금액_쿠폰상세,
	분담액_본사,
	CAST(합계_본사 AS SIGNED) AS 합계_본사,
	분담액_가맹점,
	CAST(합계_가맹점 AS SIGNED) AS 합계_가맹점,
	분담액_광고분담금
FROM
	(
		SELECT
            YM,
			brand,
			'할인' AS 명칭_구분,
			CONCAT(DATE_FORMAT(MIN(recog_date), '%m-%d'), ' ~ ', DATE_FORMAT(MAX(recog_date), '%m-%d')) AS 날짜_구분,
			쿠폰 AS 금액_구분,
			COUNT(CASE WHEN vendor_settlement_order not like '%-%' THEN 1 END) AS 쿠폰건수_쿠폰상세,
			SUM(CASE WHEN vendor_settlement_order NOT LIKE '%-%' THEN vendor_settlement_order ELSE 0 END) AS 납부금액_쿠폰상세,
			'40%' AS 분담액_본사,
			SUM(CASE WHEN vendor_settlement_order NOT LIKE '%-%' THEN vendor_settlement_order ELSE 0 END) * 0.4 AS 합계_본사,
			'60%' AS 분담액_가맹점,
			SUM(CASE WHEN vendor_settlement_order NOT LIKE '%-%' THEN vendor_settlement_order ELSE 0 END) * 0.6 AS 합계_가맹점,
			'' AS 분담액_광고분담금
		FROM 
			prom_coupang
		GROUP BY
			YM, brand, 금액_구분
			
		UNION ALL
		
		SELECT
			YM,
			brand,
			'할인(취소)' AS 명칭_구분,
			CONCAT(DATE_FORMAT(MIN(recog_date), '%m-%d'), ' ~ ', DATE_FORMAT(MAX(recog_date), '%m-%d')) AS 날짜_구분,
			쿠폰 AS 금액_구분,
			COUNT(CASE WHEN vendor_settlement_order like '%-%' THEN 1 END) AS 쿠폰건수_쿠폰상세,
			SUM(CASE WHEN vendor_settlement_order LIKE '%-%' THEN vendor_settlement_order ELSE 0 END) AS 납부금액_쿠폰상세,
			'40%' AS 분담액_본사,
			SUM(CASE WHEN vendor_settlement_order LIKE '%-%' THEN vendor_settlement_order ELSE 0 END) * 0.4 AS 합계_본사,
			'60%' AS 분담액_가맹점,
			SUM(CASE WHEN vendor_settlement_order LIKE '%-%' THEN vendor_settlement_order ELSE 0 END) * 0.6 AS 합계_가맹점,
			'' AS 분담액_광고분담금
		FROM 
			prom_coupang
		GROUP BY
			YM, brand, 금액_구분
	) as combine
ORDER BY YM DESC, brand, 명칭_구분;'''

# -- 요기요 정산내역 -- 요기요 정산내역 -- 요기요 정산내역 --
query4 = '''-- 요기요 정산내역 -- 요기요 정산내역 -- 요기요 정산내역 -- 요기요 정산내역 -- 요기요 정산내역 -- 요기요 정산내역 -- 요기요 정산내역 -- 요기요 정산내역 -- 요기요 정산내역 -- 요기요 정산내역 -- 요기요 정산내역
-- 요기요 정산내역 -- 요기요 정산내역 -- 요기요 정산내역 -- 요기요 정산내역 -- 요기요 정산내역 -- 요기요 정산내역 -- 요기요 정산내역 -- 요기요 정산내역 -- 요기요 정산내역 -- 요기요 정산내역 -- 요기요 정산내역
-- 요기요 정산내역 -- 요기요 정산내역 -- 요기요 정산내역 -- 요기요 정산내역 -- 요기요 정산내역 -- 요기요 정산내역 -- 요기요 정산내역 -- 요기요 정산내역 -- 요기요 정산내역 -- 요기요 정산내역 -- 요기요 정산내역
SELECT
    YM,
	brand,
    '할인' AS 명칭_구분,
    CONCAT(DATE_FORMAT(MIN(주문일시), '%m-%d'), ' ~ ', DATE_FORMAT(MAX(주문일시), '%m-%d')) AS 날짜_구분,
    ABS(프로모션할인금액프랜차이즈부담 + 프로모션할인금액레스토랑부담) AS 금액_구분,
    (COUNT(CASE WHEN 주문중개이용료주문중개이용료총액 not like "%-%"  THEN 1 END) - COUNT(CASE WHEN 주문중개이용료주문중개이용료총액 like "%-%" THEN 1 END)) AS 쿠폰건수_쿠폰상세,
    SUM(프로모션할인금액프랜차이즈부담) AS 납부금액_쿠폰상세,
    ABS(프로모션할인금액프랜차이즈부담 ) AS 분담액_본사_쿠폰내역상세,
	SUM(프로모션할인금액프랜차이즈부담) AS 합계_본사_쿠폰내역상세
FROM
	prom_yogiyo
GROUP BY YM, brand, 금액_구분, 분담액_본사_쿠폰내역상세
ORDER BY YM DESC, brand, 명칭_구분;'''




# main
# main
# main
# main
lists = [query1, query2, query3, query4]
results = []
for ls in lists:
    results.append(sqlProcess(ls))

# Creating a dictionary
result_dict = {
    '배민진행내역': results[0],
    '배민정산내역': results[1],
    '쿠팡정산내역': results[2],
    '요기요정산내역': results[3]
}

print(result_dict)

# Specify the file path where you want to save the JSON
json_file_path = 'data_reports.json'

# Save the dictionary to a JSON file using the custom encoder
with open(json_file_path, 'w', encoding='utf-8') as json_file:
    json.dump(result_dict, json_file, ensure_ascii=False, indent=4, cls=DecimalEncoder)

print(f'Data has been saved to {json_file_path}')