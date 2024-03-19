from datetime import datetime, timedelta

# Given SetDate
SetDate = '2023-01-13'

# Convert SetDate to a datetime object
set_date_obj = datetime.strptime(SetDate, '%Y-%m-%d')

# Calculate start_date (first day of the month)
start_date = set_date_obj.replace(day=1)

# Calculate end_date (last day of the month)
next_month = set_date_obj.replace(day=28) + timedelta(days=4)  # Ensure it goes to the next month
end_date = next_month - timedelta(days=next_month.day)

# Print the results
print("SetDate:", set_date_obj.strftime('%Y-%m-%d'))
print("Start Date:", start_date.strftime('%Y-%m-%d'))
print("End Date:", end_date.strftime('%Y-%m-%d'))