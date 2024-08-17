from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.hybrid import hybrid_property
from datetime import datetime
from sqlalchemy.orm import relationship
from config import db
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    _password_hash = db.Column(db.String(100), nullable=False)  
    email = db.Column(db.String(255), nullable=False, unique = True)
    phone = db.Column(db.String(15), nullable = False, unique = True )
    city = db.Column(db.String(255), nullable = False)
    state = db.Column(db.String(255),nullable = False )
    country = db.Column(db.String(255), nullable = False)

    clients = relationship("Client", back_populates="user")
    appointments = relationship("Appointment", back_populates="user")

    serialize_rules = ['-client.user','-appointments.user']

    @hybrid_property
    def password_hash(self):
        """getter"""
        return self._password_hash
    
    @password_hash.setter
    def password_hash(self, new_password):
        """setter"""
        pass_hash = bcrypt.generate_password_hash(new_password.encode('utf-8'))
        self._password_hash = pass_hash.decode('utf-8')  # Set the password hash here
    
    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8')) if self._password_hash else False

    def to_dict(self):
        
        result = {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'phone' : self.phone,
            'city' : self.city,
            'state': self.state,
            'country': self.country,
            
        }
        
        return result

    def __repr__(self):
        return f'<User {self.id}: {self.username}>'

class Client(db.Model, SerializerMixin):
    __tablename__='clients'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(75), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(15), nullable=False)
    city = db.Column(db.String(255), nullable=False)
    state = db.Column(db.String(255), nullable=False)
    country = db.Column(db.String(255), nullable = False)
    
    notes = db.Column(db.Text)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user = relationship("User", back_populates="clients")
    
    appointments = relationship("Appointment", back_populates="client")

    serialize_rules = ['-user.clients', '-appointments.client']

    def __repr__(self):
        return f'<Client {self.id}: {self.name}>'

    def to_dict(self):
        
        result = {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'city': self.city,
            'state':self.state,
            'country': self.country,
            'notes': self.notes
        }
        
        return result


class Appointment(db.Model, SerializerMixin):
    __tablename__ = 'appointments'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String)
    start_time = db.Column(db.DateTime)
    end_time = db.Column(db.DateTime)
    tattoo_description = db.Column(db.String)
    tattoo_placement = db.Column(db.String)
    notes = db.Column(db.Text)
    reference_images = db.Column(db.String)  # Store as JSON list of strings
    
    client_id = db.Column(db.Integer, db.ForeignKey('clients.id') )
    client = relationship("Client", back_populates="appointments")

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user = relationship("User", back_populates="appointments")

    serialize_rules = ['-client.appointments', '-user.appointments']

    def __repr__(self):
        return f'<Appointment {self.id} for Client {self.client_id} at {self.appointment_datetime}>'

    def to_dict(self):
        
        result = {
            'id': self.id,
            'title': self.title,
            'client_id': self.client_id,
            'user_id': self.user_id,
            'start_time': self.start_time,
            'end_time': self.end_time,
            'tattoo_description': self.tattoo_description,
            'tattoo_placement': self.tattoo_placement,
            'notes': self.notes,
            'reference_images': self.reference_images 
        }
        return result
