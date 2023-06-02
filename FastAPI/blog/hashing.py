from passlib.context import CryptContext

# Hashing Password
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class Hash():
    def bcrypt(password: str):
        hashedPassword = pwd_context.hash(password)
        return hashedPassword

    def verify(entered_pwd, hashed_pwd):
        return pwd_context.verify(entered_pwd, hashed_pwd)