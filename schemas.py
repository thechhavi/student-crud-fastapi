from pydantic import BaseModel, EmailStr

class StudentBase(BaseModel):
    name: str
    email: EmailStr
    course: str
    age: int

class StudentCreate(StudentBase):
    pass

class StudentUpdate(StudentBase):
    pass

class Student(StudentBase):
    id: int

    class Config:
        from_attributes = True
