from pydantic import BaseModel


class Token(BaseModel):
    access_token: str
    token_type: str


class CreateUser(BaseModel):
    username: str
    password: str


class Users(BaseModel):
    username: str


class Purchase(BaseModel):
    scheme_code: int
    scheme_name: str
    price: float
    scheme_type: str
    scheme_category: str
    fund_family: str
    quantity: int
