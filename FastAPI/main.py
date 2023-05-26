from typing import Optional
from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn

app = FastAPI() 

@app.get('/') # Below function will run for this path
def index(): # multiple function names can be same, but paths must be diff.
    return {
        'data': 'blog list'
    }

# For /blog/unpublished, it will give error
# Because, FastAPI reads line by line & since above path comes first & needs int, it will give error for 'unpublished'
# Thus, this path should come before the int one
@app.get('/blog/unpublished')
def unpublished():
    return {'data' : 'all unpublished blogs'}

# Dynamic routing using {}
@app.get('/blog/{id}')
# Default type is string
# By using :int, we're saying that the id can only be integers, if we give /blog/abc.. it'll give error
def show(id: int):  
    return {
        'data': id
    }

# Query Parameters
# We can take query parameters(?) as input in the function
# Eg: 'localhost:8000/myblog?limit=50&published=true'
@app.get('/myblog')
# # Query parameters must be given in the url to work (if default values not set)
def index(limit = 10, published: bool = False, sort: Optional[str] = None): # sort is an optional parameter of type string
    if published:
        return {'data': f'{limit} published blogs from db'}
    else:
        return {'data': f'{limit} unpublished blogs from db'}
    

# Creating Pydantic Model & using for request body for POST method
class Blog(BaseModel):
    title: str
    desc: str
    published: Optional[bool]

@app.post('/addblog')
async def create_blog(blog: Blog):
    return {'data': f"Blog is Created with title as {blog.title}"}


# Running server on custom port
# To run server, simply run: python main.py
if __name__=="__main__":
    uvicorn.run(app, host = "127.0.0.1", port=9000) 