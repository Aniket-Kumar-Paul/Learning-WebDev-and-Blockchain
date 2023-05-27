from fastapi import FastAPI
from . import schemas, models
from .database import engine

app = FastAPI() 

# Create the tables in database
models.Base.metadata.create_all(bind=engine)

@app.post('/blog')
def create(request: schemas.Blog):
    return request  