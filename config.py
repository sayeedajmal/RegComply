import os

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "defaultsecret")
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///regcomply.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
