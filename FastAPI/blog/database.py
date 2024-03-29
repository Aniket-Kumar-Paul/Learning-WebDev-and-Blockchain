from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Connecting
SQLALCHEMY_DATABASE_URL = 'sqlite:///./blog.db'

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args = {"check_same_thread": False} # needed for sqlite
    )

# Create Session
SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False
)

# Declare mapping
Base = declarative_base()

# Creating instance of the SessionLocal
def get_db():
    db = SessionLocal()  # create instance of the databse session

    try:
        yield db
    finally:
        db.close