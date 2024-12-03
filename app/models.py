from . import db

class Circular(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(200), nullable=False)
    regulator_name = db.Column(db.String(100), nullable=False)
    method_of_communication = db.Column(db.String(100), nullable=False)
    business_process_status = db.Column(db.String(50), nullable=False)
    affected_business_process = db.Column(db.String(100), nullable=False)
