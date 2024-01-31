from django.shortcuts import render
from sqlalchemy import create_engine, text

def login(request):
    return render(request, 'ai_front/login.html')

def index(request):
    return render(request, 'ai_front/index.html')

def register(request):
    return render(request, 'ai_front/register.html')

def forgot_password(request):
    return render(request, 'ai_front/forgot-password.html')

def forgot_id(request):
    return render(request, 'ai_front/forgot-id.html')

# def kyadmin(request):
#     # Define your database connection parameters
#     db_params = {
#         'user': 'root',
#         'password': '#dpg85kjp',
#         'host': 'svc.sel5.cloudtype.app',
#         'port': '32691',
#         'database': 'kiyoung',
#     }

#     # Create a database connection using sqlalchemy
#     engine = create_engine(f"mysql+mysqlconnector://{db_params['user']}:{db_params['password']}@{db_params['host']}:{db_params['port']}/{db_params['database']}")

#     # Fetch data from the database using sqlalchemy
#     with engine.connect() as connection:
#         query = text("SELECT * FROM admin_sep")
#         result = connection.execute(query)
#         admin_sep = result.fetchall()

#     # Get the column names as a list
#     columns = result.keys()

#     # Define the template context
#     context = {
#         'admin_sep': admin_sep,
#         'columns': list(columns),
#     }

#     print(context)

#     # Render the template with the context
#     return render(request, 'ai_front/kyadmin.html', context)

def page_404(request):
    return render(request, 'ai_front/404.html')

def base(request):
    return render(request, 'ai_front/base.html')

def blank(request):
    return render(request, 'ai_front/blank.html')

def buttons(request):
    return render(request, 'ai_front/buttons.html')

def cards(request):
    return render(request, 'ai_front/cards.html')

def charts(request):
    return render(request, 'ai_front/charts.html')


def tables(request):
    return render(request, 'ai_front/tables.html')

def utilities_animation(request):
    return render(request, 'ai_front/utilities-animation.html')

def utilities_border(request):
    return render(request, 'ai_front/utilities-border.html')

def utilities_color(request):
    return render(request, 'ai_front/utilities-color.html')

def utilities_other(request):
    return render(request, 'ai_front/utilities-other.html')

def feeBaemin(request):
    return render(request, 'ai_front/feeBaemin.html')
