from .database import Base # Base created in database.py
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship  

# Blog Model (Table)
class Blog(Base):
    __tablename__ = "myBlogs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    body = Column(String)
    user_id = Column(Integer, ForeignKey('users.id'))

    creator = relationship("User", back_populates="blogs")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String)
    password = Column(String)
 
    blogs = relationship("Blog", back_populates="creator")
