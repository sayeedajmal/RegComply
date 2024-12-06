from . import db


class Circular(db.Model):
    id = db.Column(db.String(1000), primary_key=True)
    filename = db.Column(db.String(1000), nullable=False)
    regulator_name = db.Column(db.String(1000), nullable=False)
    method_of_communication = db.Column(db.String(1000), nullable=False)
    business_process_status = db.Column(db.String(1000), nullable=False)
    affected_business_process = db.Column(db.String(1000), nullable=False)
    ai_summary = db.Column(db.String(1000), nullable=False)
    common_tags = db.Column(db.String(1000), nullable=False)
    Issued = db.Column(db.String(1000), nullable=False)
    Due = db.Column(db.String(1000), nullable=False)
    Title = db.Column(db.String(1000), nullable=False)

    clauses = db.relationship('Clause', backref='circular', lazy=True)


class Clause(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(1000), nullable=False)
    actionable = db.Column(db.String(1000), nullable=False)
    department = db.Column(db.String(1000), nullable=False)
    circular_id = db.Column(db.String(1000), db.ForeignKey(
        'circular.id'), nullable=False)

    def __repr__(self):
        return f"<Clause {self.content[:50]}>"
