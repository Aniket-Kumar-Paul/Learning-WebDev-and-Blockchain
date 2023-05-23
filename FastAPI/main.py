from fastapi import FastAPI

app = FastAPI() 

@app.get('/') # Below function will run for this path
def index():
    return {
        'data': {'name': 'Aniket'}
    }

@app.get('/about')
def about():
    return {
        'data': {'about page'}
    }