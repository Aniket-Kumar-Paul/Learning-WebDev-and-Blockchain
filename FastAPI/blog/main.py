from typing import List
from fastapi import FastAPI, Depends, HTTPException, status, Response
from . import schemas, models
from .database import engine, SessionLocal
from sqlalchemy.orm import Session
from .hashing import Hash

# Create the tables from models.py in database
models.Base.metadata.create_all(bind=engine)

app = FastAPI()


def get_db():
    db = SessionLocal()  # create instance of the databse session

    try:
        yield db
    finally:
        db.close


# or, simply status_code = 201
@app.post('/blog', status_code=status.HTTP_201_CREATED, tags=['blogs'])
# Default value of db is Depends(get_db) to convert Session to a pydantic type
def create(request: schemas.Blog, db: Session = Depends(get_db)):
    new_blog = models.Blog(
        title=request.title,
        body=request.body,
        user_id = 1
    )
    db.add(new_blog)
    db.commit()
    # Refresh state of new_blog object with any changes made on db side (like automatic generated IDs etc.)
    db.refresh(new_blog)
    return new_blog


@app.get('/blog', response_model=List[schemas.ShowBlog], tags=['blogs'])
def get_all(db: Session = Depends(get_db)):  # get all rows/data of Blog model
    blogs = db.query(models.Blog).all()
    return blogs


# If no error, return 200 status code
# response_model -> use ShowBlog pydantic schema
@app.get('/blog/{id}', status_code=status.HTTP_200_OK, response_model=schemas.ShowBlog, tags=['blogs'])
def show_ids_blog(id, response: Response, db: Session = Depends(get_db)):
    blog = db.query(models.Blog).filter(models.Blog.id ==
                                        id).first()  # Get only the first result
    if not blog:  # if blog not found, return with 404 status code
        # response.status_code = status.HTTP_404_NOT_FOUND
        # return {'Details: f"Blog with the ID {id} is not available"'}
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Blog with the ID {id} is not available"
        )
    return blog


@app.delete('/blog/{id}', status_code=status.HTTP_204_NO_CONTENT, tags=['blogs'])
def delete_blog(id, db: Session = Depends(get_db)):
    # schronize_session
    # |- False (synchronize only after session expiration / commit)
    # |- 'fetch' (synchronize automatically after delete)
    blog = db.query(models.Blog).filter(
        models.Blog.id == id
    )
    if not blog.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Blog with ID {id} is not available")

    blog.delete(synchronize_session=False)
    db.commit()
    return "Deleted"

# Update
@app.put('/blog/{id}', status_code=status.HTTP_202_ACCEPTED, tags=['blogs'])
def update(id, request: schemas.Blog, db: Session = Depends(get_db)):
    blog = db.query(models.Blog).filter(models.Blog.id == id)
    if not blog.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Blog with ID {id} is not available")
    blog.update(request.dict())
    db.commit()
    return "Updated"


# User
@app.post('/user', response_model=schemas.ShowUser, tags=['user'])
def create_user(request: schemas.User, db: Session = Depends(get_db)):
    # **request.dict() -> unpack all items in the dict
    # new_user = models.User(**request.dict()) 
    new_user = models.User(
        name = request.name,
        email = request.email,
        password = Hash.bcrypt(request.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.get('/user/{id}', response_model=schemas.ShowUser, tags=['user'])
def get_user(id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f'Blog with ID {id} not available.'
        )
    return user 