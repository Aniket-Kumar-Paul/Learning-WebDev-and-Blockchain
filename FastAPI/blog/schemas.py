from pydantic import BaseModel, Field

class Blog(BaseModel):
    title: str 
    body: str

class ShowBlog(Blog): # Extend Blog class
    pass # show only title & body, no id

    # When orm_mode is set to True in a Pydantic model, it enables the model to accept and return ORM objects directly, rather than just dictionaries. 
    class Config():
        orm_mode = True 

class User(BaseModel):
    name: str
    email: str
    password: str

class ShowUser(User): # Show only name and email, exclude password
    password: str = Field(None, exclude=True)

    class Config():
        orm_mode = True
        