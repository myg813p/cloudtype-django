from oauth2client.service_account import ServiceAccountCredentials
from googleapiclient.discovery import build
import csv
import json

#google_sheet_id, gijungcpy_api : google-sheet-gy@project1-b992a.iam.gserviceaccount.com


def marketing_google_sheet_data():
    scope = [
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/drive",
    ]
    json_key_path = "google_sheet_ky_key.json"  # JSON Key File Path

    credential = ServiceAccountCredentials.from_json_keyfile_name(
        json_key_path, scope)
    # Assuming you've authenticated your Google Sheets API service
    service = build('sheets', 'v4', credentials=credential)

    # Spread Sheet Key로 열기
    spreadsheet_key = '1N8dsnVHMQTD2Y3pzShVNhX0jCe4NPu37ouAKZ7C_gy0'

    result = service.spreadsheets().get(
        spreadsheetId=spreadsheet_key,
        fields="sheets/properties/title,sheets/properties/sheetId"
    ).execute()

    sheet_name = ""
    result_dict = {
        '두찜':'',
        '숯불':'',
        '떡참':''
    }
    for sheet in result['sheets']:
        title = sheet['properties']['title']
        # print(title)
        if title.count('광고'):
            sheet_name = title

            result = service.spreadsheets().values().get(
                spreadsheetId=spreadsheet_key,
                # Adjust the range as needed to fit your data
                range=f"{sheet_name}!A1:ZZ"
            ).execute()

            # print(result.get('values'))

            if title.count('두찜'):
                result_dict['두찜'] = result.get('values')
            elif title.count('숯불'):
                result_dict['숯불'] = result.get('values')
            elif title.count('떡참'):
                result_dict['떡참'] = result.get('values')


    for key, value in result_dict.items():
        for val in value:
            for idx, el in enumerate(val):
                if len(el) == 2 and el[-1] == '월':
                    el = el.replace("월", "")
                    el = "20240" + el
                    result_dict[key][value.index(val)][idx] = el
                elif len(el) == 3 and el[-1] == '월':
                    el = el.replace("월", "")
                    el = "2024" + el
                    result_dict[key][value.index(val)][idx] = el
    print(result_dict)

    # Save the result to a JSON file with proper encoding for non-ASCII characters
    with open('ads.json', 'w', encoding='utf-8') as json_file:
        json.dump(result_dict, json_file, ensure_ascii=False)

    print("ads.json")
    # quit()

    values = result.get('values', [])
    print(values)

    if not values:
        print('No data found.')
    else:
        with open('output.csv', 'w', encoding='utf-8-sig', newline='') as csvfile:
            csv_writer = csv.writer(csvfile)
            for row in values:
                modified_row = []  # Create a new list to store modified values
                for r in row:
                    modified_r = r.replace(",", "")  # Remove commas from cell value
                    modified_row.append(modified_r)  # Add modified value to the new list
                    # print(modified_r)  # Optional: print the modified value
                csv_writer.writerow(modified_row)  # Write the modified row to CSV
            print('Data saved to output.csv')
marketing_google_sheet_data()
