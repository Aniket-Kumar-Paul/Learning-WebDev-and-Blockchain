from fastapi import FastAPI
from . import models
from .database import engine

# Routers
from .routers import blog, user

# Create the tables from models.py in database
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Routers
app.include_router(blog.router)
app.include_router(user.router)