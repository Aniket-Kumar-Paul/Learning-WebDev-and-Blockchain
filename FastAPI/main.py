from fastapi import FastAPI

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

