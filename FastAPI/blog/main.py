from fastapi import FastAPI, Depends, HTTPException, status, Response
from . import schemas, models
from .database import engine, SessionLocal
from sqlalchemy.orm import Session

# Create the tables in database
models.Base.metadata.create_all(bind=engine)

app = FastAPI()


def get_db():
    db = SessionLocal()  # create instance of the databse session

    try:
        yield db
    finally:
        db.close


# or, simply status_code = 201
@app.post('/blog', status_code = status.HTTP_201_CREATED)
# Default value of db is Depends(get_db) to convert Session to a pydantic type
def create(request: schemas.Blog, db: Session = Depends(get_db)):
    new_blog = models.Blog(
        title=request.title,
        body=request.body
    )
    db.add(new_blog)
    db.commit()
    # Refresh state of new_blog object with any changes made on db side (like automatic generated IDs etc.)
    db.refresh(new_blog)
    return new_blog


@app.get('/blog')
def get_all(db: Session = Depends(get_db)):  # get all rows/data of Blog model
    blogs = db.query(models.Blog).all()
    return blogs


@app.get('/blog/{id}', status_code = status.HTTP_200_OK) # If no error, return this status code
def get_ids_blog(id, response: Response, db: Session = Depends(get_db)):
    blog = db.query(models.Blog).filter(models.Blog.id ==
                                        id).first()  # Get only the first result
    if not blog: # if blog not found, return with 404 status code
        # response.status_code = status.HTTP_404_NOT_FOUND
        # return {'Details: f"Blog with the ID {id} is not available"'}
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail = f"Blog with the ID {id} is not available"
            )
    return blog
