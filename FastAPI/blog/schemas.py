from pydantic import BaseModel

class Blog(BaseModel):
    title: str 
    body: str

class ShowBlog(Blog): # Extend Blog class
    pass # show only title & body, no id

    # When orm_mode is set to True in a Pydantic model, it enables the model to accept and return ORM objects directly, rather than just dictionaries. 
    class Config():
        orm_mode = True 