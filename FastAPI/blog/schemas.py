from pydantic import BaseModel, Field
from typing import List

class BlogBase(BaseModel):
    title: str 
    body: str

class Blog(BlogBase):
    class Config() :
        orm_mode = True

class User(BaseModel):
    name: str
    email: str
    password: str

class ShowUser(User): # Show only name, email and blogs created, exclude password
    blogs: List[Blog] = [] # default value []
    password: str = Field(None, exclude=True)

    class Config() :
        orm_mode = True
        
class ShowBlog(BaseModel):
    title: str 
    body: str 
    creator: ShowUser

    # When orm_mode is set to True in a Pydantic model, it enables the model to accept and return ORM objects directly, rather than just dictionaries. 
    class Config():
        orm_mode = True 

class Login(BaseModel):
    username: str 
    password: str

# Tokens
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None