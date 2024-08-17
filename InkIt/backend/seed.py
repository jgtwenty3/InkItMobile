from config import app, db
from models import User, Client, Appointment
from faker import Faker
from random import choice as rc, randint
import json
from datetime import datetime

if __name__ == '__main__':
    fake = Faker()

    with app.app_context():
        print("Starting seed...")

        # Seed Users
        for _ in range(10):
            user = User(
                username=fake.user_name(),
                _password_hash=fake.password(),  # Use _password_hash here
                email=fake.email(),
                phone=fake.phone_number(),
                city=fake.city(),
                state=fake.state(),
                country=fake.country(),
            )
            db.session.add(user)
        db.session.commit()

        # Seed Clients
        for _ in range(20):
            user = User.query.get(randint(1, User.query.count()))
            client = Client(
                name=fake.name(),
                email=fake.email(),
                phone=fake.phone_number(),
                city=fake.city(),
                state=fake.state(),
                country=fake.country(),
                user=user,
            )
            db.session.add(client)

        # Seed Appointments
        for _ in range(30):
            client = Client.query.get(randint(1, Client.query.count()))
            user = User.query.get(randint(1, User.query.count()))
            appointment = Appointment(
                title=fake.sentence(),
                start_time=fake.date_time_this_month(),
                end_time=fake.date_time_this_month(),
                client=client,
                user=user,
                tattoo_description=fake.sentence(),
                tattoo_placement=fake.word(),
                notes=fake.text(),
                reference_images=json.dumps([fake.image_url() for _ in range(randint(1, 5))])
            )
            db.session.add(appointment)

        db.session.commit()

    print("Seed completed!")
