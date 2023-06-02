from fastapi import APIRouter, Depends, HTTPException, status
from typing import List 
from .. import schemas, database, models
from sqlalchemy.orm import Session

router = APIRouter(
    prefix="/blog",
    tags=['Blogs']
)

get_db = database.get_db

# or, simply status_code = 201
@router.post('/', status_code=status.HTTP_201_CREATED) # /blog/
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

@router.get('/', response_model=List[schemas.ShowBlog])
def get_all(db: Session = Depends(get_db)):  # get all rows/data of Blog model
    blogs = db.query(models.Blog).all()
    return blogs

# If no error, return 200 status code
# response_model -> use ShowBlog pydantic schema
@router.get('/{id}', status_code=status.HTTP_200_OK, response_model=schemas.ShowBlog)
def show_ids_blog(id, db: Session = Depends(get_db)):
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


@router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
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
@router.put('/{id}', status_code=status.HTTP_202_ACCEPTED)
def update(id, request: schemas.Blog, db: Session = Depends(get_db)):
    blog = db.query(models.Blog).filter(models.Blog.id == id)
    if not blog.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Blog with ID {id} is not available")
    blog.update(request.dict())
    db.commit()
    return "Updated"