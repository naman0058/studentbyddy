from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from flask import Response, send_file

app = Flask(__name__)

import database as db

@app.route('/')
def default_page():
    return render_template('register2.html')

# @app.route('/register', methods = ['POST'])
# User Registration API
@app.route('/register', methods=['POST'])
def api_register_user():
    if request.method == 'POST':
        user_data = request.get_json()
        UserType = user_data['UserType']
        Username = user_data['Username']
        Email = user_data['Email']
        Password = user_data['Password']
        Phone = user_data['Phone']
        FirstName = user_data['FirstName']
        LastName = user_data['LastName']
        
        db.register_user(UserType, Username, Email, Password, Phone, FirstName, LastName)
        return jsonify({"message": "User registered successfully"}), 201
    else:
        return jsonify({"error": "Method not allowed"}), 405
    
@app.route('/login')
def login():
    # Handle login page rendering or logic here
    return render_template('login.html')

# # Property Search API
# @app.route('/api/search', methods=['GET'])
# def api_property_search():
#     locality_id = request.args.get('locality')
#     min_rent = request.args.get('min_rent')
#     max_rent = request.args.get('max_rent')
#     min_rooms = request.args.get('min_rooms')
#     max_rooms = request.args.get('max_rooms')
    
#     # Fetch properties from the database based on provided parameters
#     properties = db.search_properties(locality_id, min_rent, max_rent, min_rooms, max_rooms)
    
#     return jsonify(properties), 200

# # Expense Calculation API
# @app.route('/api/calculate_expense', methods=['POST'])
# def api_calculate_expense():
#     if request.method == 'POST':
#         expense_data = request.get_json()
#         PropertyID = expense_data['PropertyID']
#         UserID = expense_data['UserID']
#         ExpenseAmount = expense_data['ExpenseAmount']
#         NumberOfPeople = expense_data['NumberOfPeople']
#         ExpenseDate = expense_data['ExpenseDate']
        
#         # Calculate and record expense in the database
#         db.record_expense(PropertyID, UserID, ExpenseAmount, NumberOfPeople, ExpenseDate)
        
#         return jsonify({"message": "Expense recorded successfully"}), 200
#     else:
#         return jsonify({"error": "Method not allowed"}), 405

if __name__ == '__main__':
    app.run(debug=True)