from .database import Base # Base created in database.py
from sqlalchemy import Column, Integer, String

# Blog Model (Table)
class Blog(Base):
    __tablename__ = "myBlogs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    body = Column(String)