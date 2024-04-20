import json
import os
from typing import Annotated, List
from urllib.parse import unquote

import uvicorn
from fastapi import FastAPI, Depends, status, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware

from models import Purchase
from auth import get_current_user, router
from fetch_rapidapi_data import fetch_data, get_filtered_data


origins = ["https://localhost:3000"] # list of allowed origins for CORS
json_file_path = "../data.json" # Path to json file
funds_data_json_path = "../funds.json"

fund_family_list = []

# FastAPI instance, include router, add CORS middleware
app = FastAPI()
app.include_router(router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

user_dependency = Annotated[dict, Depends(get_current_user)] # Dependency to get current user

@app.on_event("startup")
def check_json_file():
    # Remove json file if it exists
    if os.path.exists(json_file_path):
        os.remove(json_file_path)

@app.on_event("startup")
def fetch():
    global fund_family_list
    fund_family_list = fetch_data()

# Fetch list of fund family
@app.get("/v1/get-fund-family", status_code=status.HTTP_200_OK)
async def get_fund_family(user: user_dependency):
    # Check for user authentication
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Authentication Failed'
        )
    return fund_family_list

# Get list of funds of specific fund family
@app.get('/v1/funds-list', status_code=status.HTTP_200_OK)
async def funds_list(user: user_dependency, family: str):
    # Check for user authentication
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Authentication Failed'  
        )
    funds = get_filtered_data(unquote(family))
    if os.path.exists(funds_data_json_path):
        os.remove(funds_data_json_path)
    with open(funds_data_json_path, "w") as json_file:
        json.dump(funds, json_file, indent=4)
    return {
        "message": "Funds Collected Successfully"
    }

# to get 10 funds at a time
@app.get('/v1/get-funds-list', status_code=status.HTTP_200_OK)
def get_funds_list(user: user_dependency, page: int):
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Authentication Failed'  
        )
    with open(funds_data_json_path, 'r') as json_file:
        filtered_funds = json.load(json_file)
        start = (page-1)*10
        end = start+9
        if end > len(filtered_funds):
            end = len(filtered_funds)
        li = []
        for i in range(len(filtered_funds)):
            li.append(filtered_funds[i])
    return li



# Purchanse funds
@app.post('/v1/purchase', status_code=status.HTTP_201_CREATED)
async def purchase(user: user_dependency, fund_to_purchase: List[Purchase], response: Response):
    # Check for user authentication
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Authentication Failed'
        )
    if not len(fund_to_purchase):
        response.status_code = status.HTTP_409_CONFLICT
        return {
            "message": "No Funds selected"
        }
    
    if os.path.exists(json_file_path):
        with open(json_file_path, "r") as json_file:
            purchased_funds = json.load(json_file)

        funds_dict = []
        for item in fund_to_purchase:
            for index, value in enumerate(purchased_funds):
                if item.Scheme_Code == value['Scheme_Code']:
                    purchased_funds[index]['quantity'] += 1
                    print(purchased_funds[index])
                else:
                    funds_dict.append(item.dict())
        print('Funds dict: ', funds_dict)
        print(purchased_funds)
        purchased_funds.extend(funds_dict)
        with open(json_file_path, "w") as json_file:
            json.dump(purchased_funds, json_file, indent=4)
    else:
        # Convert funds into dictionary format and store in json file
        funds_dict = [item.dict() for item in fund_to_purchase] 
        with open(json_file_path, "w") as json_file:
            json.dump(funds_dict, json_file, indent=4)
    return {
        "message": "Funds Purchased Successfully"
    }


# Get list of purchased funds
@app.get('/v1/get-purchase-list', status_code=status.HTTP_200_OK)
async def get_purchase_list(user: user_dependency, response: Response):
    if not os.path.exists(json_file_path):
        response.status_code = status.HTTP_207_MULTI_STATUS
        return {
            "message": "No Funds Purchased"
        }
    # Load purchased funds from JSON file
    with open(json_file_path, "r") as json_file:
        purchased_funds = json.load(json_file)
    return purchased_funds

# Check user token is active or not
@app.get('/v1/user', status_code=status.HTTP_200_OK)
async def check_user_token(user: user_dependency):
    return user

if __name__ == "__main__":
    uvicorn.run(app, port=8000)
