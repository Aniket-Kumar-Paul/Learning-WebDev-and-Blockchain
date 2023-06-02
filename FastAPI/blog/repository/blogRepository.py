from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models, schemas

def get_all_blogs(db: Session):
    blogs = db.query(models.Blog).all()
    return blogs

def create(request: schemas.Blog, db: Session = Depends(get_db)):
    new_blog = models.Blog(
        title=request.title,
        body=request.body,
        user_id = 1
    )
    db.add(new_blog)
    db.commit()
    db.refresh(new_blog)
    return new_blog

def show_ids_blog(id, db: Session = Depends(get_db)):
    blog = db.query(models.Blog).filter(models.Blog.id ==
                                        id).first()
    if not blog:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Blog with the ID {id} is not available"
        )
    return blog

def delete_blog(id, db: Session = Depends(get_db)):
    blog = db.query(models.Blog).filter(
        models.Blog.id == id
    )
    if not blog.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Blog with ID {id} is not available")

    blog.delete(synchronize_session=False)
    db.commit()
    return "Deleted"

def update(id, request: schemas.Blog, db: Session = Depends(get_db)):
    blog = db.query(models.Blog).filter(models.Blog.id == id)
    if not blog.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Blog with ID {id} is not available")
    blog.update(request.dict())
    db.commit()
    return "Updated"