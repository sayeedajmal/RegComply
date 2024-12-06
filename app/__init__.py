from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS  # Import CORS

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    CORS(app)  # Enable CORS

    # Load configuration from config.py
    app.config.from_object("config.Config")

    # Initialize the extensions
    db.init_app(app)
    migrate.init_app(app, db)

    # Register blueprints or routes
    from .routes import main_routes
    app.register_blueprint(main_routes)

    return app
