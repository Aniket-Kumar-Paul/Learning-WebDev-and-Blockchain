from fastapi import FastAPI, Depends
from . import schemas, models
from .database import engine, SessionLocal
from sqlalchemy.orm import Session

# Create the tables in database
models.Base.metadata.create_all(bind=engine)

app = FastAPI() 

def get_db():
    db = SessionLocal() # create instance of the databse session
    
    try:
        yield db 
    finally:
        db.close

@app.post('/blog')
def create(request: schemas.Blog, db: Session = Depends(get_db)): # Default value of db is Depends(get_db) to convert Session to a pydantic type
    new_blog = models.Blog(
        title=request.title, 
        body=request.body
        )
    db.add(new_blog)
    db.commit()
    # Refresh state of new_blog object with any changes made on db side (like automatic generated IDs etc.)
    db.refresh(new_blog)
    return new_blog
