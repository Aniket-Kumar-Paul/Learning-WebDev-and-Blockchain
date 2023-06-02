from fastapi import Depends, HTTPException, status
from .. import schemas, models
from sqlalchemy.orm import Session
from ..hashing import Hash
from ..database import get_db

def create_user(request: schemas.User, db: Session = Depends(get_db)):
    new_user = models.User(
        name = request.name,
        email = request.email,
        password = Hash.bcrypt(request.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def get_user(id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f'Blog with ID {id} not available.'
        )
    return user 