from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from .. import schemas, models, token
from ..database import get_db
from sqlalchemy.orm import Session
from ..hashing import Hash

router = APIRouter(
    tags=["Authentication"]
)

@router.post('/login')
def login(request: schemas.Login, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(
        models.User.email == request.username
    ).first()

    # Check if user(email) exists
    if not user:
        raise HTTPException(status_code = status.HTTP_404_NOT_FOUND,
                            detail = f"Invalid Credentials")
    # Verify password
    if not Hash.verify(request.password, user.password):
        raise HTTPException(status_code = status.HTTP_404_NOT_FOUND,
                            detail = f"Incorrect Password")
    
    # JWT Token
    access_token_expires = timedelta(minutes=token.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = token.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}