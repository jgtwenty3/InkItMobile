from flask import Flask, request, session, redirect, url_for, render_template, jsonify
from flask_bcrypt import Bcrypt
from sqlalchemy import desc
from datetime import datetime

from config import app, db, migrate, api, bcrypt

from models import db, User, Client, Appointment

@app.route('/')
def home():
    return ''

@app.route("/signup", methods=["GET","POST"])
def signup():
    json_data = request.get_json()

    # Validate required fields
    required_fields = ['username', 'password', 'email', 'phone', 'city','state', 'country']
    for field in required_fields:
        if field not in json_data:
            return {'error': f'Missing required field: {field}'}, 400
    
    

    # Create a new user instance
    new_user = User(
        username=json_data['username'],
        password_hash =(json_data['password']),
        email=json_data['email'], # Use password_hash instead of password
        phone=json_data['phone'],
        city=json_data['city'],
        state = json_data['state'],
        country = json_data['country'],
    )

    # Add the new user to the database
    db.session.add(new_user)
    db.session.commit()

    return {'message': 'User registered successfully'}, 201


@app.route('/login', methods=['POST'])
def login():
    json_data = request.get_json()
    print(f"Received login request: {json_data}")  # Log the incoming data

    # Validate required fields
    required_fields = ['email', 'password']
    for field in required_fields:
        if field not in json_data:
            return {'error': f'Missing required field: {field}'}, 400

    user = User.query.filter(User.email == json_data.get('email')).first()
    print(f"User found: {user}")  # Log the user lookup result

    if not user:
        return {'error': 'User not found'}, 404

    if not user.authenticate(json_data.get('password')):
        return {'error': 'Invalid password'}, 401

    # Update session with user_id and user_type
    session['user_id'] = user.id
    print(f"Session updated with user_id: {user.id}")

    return user.to_dict(), 200



@app.route('/check_session', methods=['GET'])
def check_session():
    user_id = session.get('user_id')

    if user_id is not None:
        user = User.query.get(user_id)
        if user:
            return user.to_dict(), 200
    return {}, 401



@app.route('/logout', methods=['DELETE'])
def logout():
    session.pop('user_id', None)
    session.pop('user_type', None)
    return {}, 204

@app.route('/clients', methods=['GET', 'POST'])
def all_clients():
    if request.method == "GET":
        # Check if user is logged in
        user_id = session.get('user_id')
        if user_id is None:
            return jsonify({'error': 'User not logged in'}), 401

        # Retrieve clients associated with the logged-in user
        user_clients = Client.query.filter_by(user_id=user_id).all()

        # Convert clients to dictionary format
        results = [client.to_dict() for client in user_clients]
        return jsonify(results), 200
    
    elif request.method == "POST":
        
        json_data = request.get_json()
        new_client = Client(
            name=json_data.get('name'),
            email=json_data.get('email'),
            phone=json_data.get('phone'),
            city=json_data.get('city'),
            state=json_data.get('state'),
            country = json_data.get('country'),
            notes=json_data.get('notes')
        )
        db.session.add(new_client)
        db.session.commit()

        return jsonify(new_client.to_dict()), 201
@app.route('/clients/<int:id>', methods = ["GET", "PATCH", "DELETE"])
def clients_by_id(id):
    client = Client.query.filter(Client.id == id).first()

    if client is None:
        return {'error':"client not found"}, 400
    if request.method == "GET":
        return client.to_dict(), 200
    elif request.method == "DELETE": 
        db.session.delete(client)
        db.session.commit()
        return {}, 204
    elif request.method == "PATCH":
        json_data = request.get_json()

        for field in json_data:
            if field != "client":
                setattr(client, field, json_data[field])
        
        db.session.add(client)
        db.session.commit()
    
    return client.to_dict(), 200

@app.route('/appointments', methods=['GET', 'POST'])
def all_appointments():
    if request.method == 'GET':
        user_id = session.get('user_id')
        
        if user_id is None:
            return jsonify({'error': 'User not logged in'}), 401

        all_user_appointments = Appointment.query.filter_by(user_id=user_id).all()
        results = [appointment.to_dict() for appointment in all_user_appointments]
        return jsonify(results), 200

    elif request.method == 'POST':
        json_data = request.get_json()
        client_id = json_data.get('client_id')
        user_id = session.get('user_id')
        
        # Ensure client_id is provided
        if client_id is None:
            return jsonify({'error': 'client_id is required'}), 400

        # Check if the client exists
        client = Client.query.get(client_id)
        if not client:
            return jsonify({'error': 'Client not found'}), 404

        new_appointment = Appointment(
            title=json_data.get('title'),
            start_time=json_data.get('start_time'),
            end_time=json_data.get('end_time'),
            client_id=client_id,
            user_id=user_id,  # Assign the current user's ID to the appointment
            tattoo_description=json_data.get('tattoo_description'),
            tattoo_placement=json_data.get('tattoo_placement'),
            notes=json_data.get('notes'),
            reference_images=json_data.get('reference_images')
        )
        db.session.add(new_appointment)
        db.session.commit()

        appointment_data = new_appointment.to_dict()
        appointment_data['client_name'] = client.name  
        return jsonify(appointment_data), 201

@app.route('/appointments/<int:id>', methods=['GET', 'PATCH', 'DELETE'])
def appointments_by_id(id):
    appointment = Appointment.query.get(id)

    if appointment is None:
        return jsonify({'error': 'Appointment not found'}), 404

    if request.method == "GET":
        appointment_data = appointment.to_dict()
        appointment_data['client_name'] = appointment.client.name
        return jsonify(appointment_data), 200

    elif request.method == "DELETE":
        db.session.delete(appointment)
        db.session.commit()
        return jsonify({}), 204

    elif request.method == "PATCH":
        json_data = request.get_json()

        for field in json_data:
            setattr(appointment, field, json_data[field])

        db.session.commit()
        return jsonify(appointment.to_dict()), 200
@app.route('/users')
def all_users():
    all_users = User.query.all()
    results = []

    for user in all_users:
        results.append(user.to_dict())
    return results, 200

@app.route('/users/<int:id>', methods = ['GET', 'PATCH', 'DELETE'])
def users_by_id(id):
    user = User.query.filter(User.id == id ).first()

    if user is None:
        return {'error': "User not found"}, 404
    if request.method == 'GET':
        return user.to_dict(), 200
    elif request.method == 'DELETE':
        db.session.delete(user)
        db.session.commit()
        return{},204
    elif request.method == 'PATCH':
        json_data = request.get_json()
        print(f"Received PATCH request with data: {json_data}")

        for field in json_data:
            if field != "user":
                setattr(user, field, json_data[field])
        
        db.session.add(user)
        db.session.commit()
    
    return user.to_dict(), 200 






if __name__ == '__main__':
    app.run(debug = True,host='192.168.1.51', port=5000) 