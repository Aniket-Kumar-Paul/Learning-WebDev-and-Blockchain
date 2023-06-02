from fastapi import APIRouter, Depends, status
from typing import List 
from .. import schemas
from sqlalchemy.orm import Session
from ..repository import blogRepository
from ..database import get_db

router = APIRouter(
    prefix="/blog",
    tags=['Blogs']
)

@router.post('/', status_code=status.HTTP_201_CREATED)
def create(request: schemas.Blog, db: Session = Depends(get_db)):
    return blogRepository.create(request, db)

@router.get('/', response_model=List[schemas.ShowBlog])
def get_all_blogs(db: Session = Depends(get_db)): 
    return blogRepository.get_all_blogs(db)

@router.get('/{id}', status_code=status.HTTP_200_OK, response_model=schemas.ShowBlog)
def show_ids_blog(id, db: Session = Depends(get_db)):
    return blogRepository.show_ids_blog(id, db)

@router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_blog(id, db: Session = Depends(get_db)):
    return blogRepository.delete_blog(id, db)

@router.put('/{id}', status_code=status.HTTP_202_ACCEPTED)
def update(id, request: schemas.Blog, db: Session = Depends(get_db)):
    return blogRepository.update(id, request, db)