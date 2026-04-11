from flask import Flask, request, jsonify, session
from flask_cors import CORS
import os

app = Flask(__name__)

# Secret Key - Environment variable se le rahe hain
app.secret_key = os.environ.get('SECRET_KEY', 'default-dev-key-change-this')

# CORS - Sirf Vercel frontend ko allow karna hai
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:3000')
CORS(app, 
     supports_credentials=True,
     origins=[FRONTEND_URL],
     methods=['GET', 'POST', 'OPTIONS'],
     allow_headers=['Content-Type', 'Authorization'])

# Demo users
users = {
    'admin@example.com': {'password': 'admin123', 'name': 'Admin User'},
    'user@example.com': {'password': 'user123', 'name': 'Regular User'}
}

@app.route('/api/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return '', 200
    
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    user = users.get(email)
    if user and user['password'] == password:
        session['user'] = {'email': email, 'name': user['name']}
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'user': {'email': email, 'name': user['name']}
        }), 200
    
    return jsonify({'success': False, 'error': 'Invalid credentials'}), 401

@app.route('/api/check-auth', methods=['GET', 'OPTIONS'])
def check_auth():
    if request.method == 'OPTIONS':
        return '', 200
    
    if 'user' in session:
        return jsonify({
            'authenticated': True,
            'user': session['user']
        }), 200
    
    return jsonify({'authenticated': False}), 200

@app.route('/api/logout', methods=['POST', 'OPTIONS'])
def logout():
    if request.method == 'OPTIONS':
        return '', 200
    
    session.pop('user', None)
    return jsonify({'success': True, 'message': 'Logged out'}), 200

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)