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
    Scheme_Code: int
    ISIN_Div_Payout_ISIN_Growth: str
    ISIN_Div_Reinvestment: str
    Scheme_Name: str
    Net_Asset_Value: float
    Date: str
    Scheme_Type: str
    Scheme_Category: str
    Mutual_Fund_Family: str
    quantity: int
