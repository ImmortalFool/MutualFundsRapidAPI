import json
import os
from typing import Annotated, List

import uvicorn
from fastapi import FastAPI, Depends, status, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware

from models import Purchase
from auth import get_current_user, router
from fetch_rapidapi_data import fetch_data, get_filtered_data


origins = ["https://localhost:3000"] # list of allowed origins for CORS
json_file_path = "../data.json" # Path to json file

# Remove json file if it exists
if os.path.exists(json_file_path):
    os.remove(json_file_path)

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
fund_family = fetch_data() # Fetch list of fund family


# Get list of funds of specific fund family
@app.get('/v1/funds-list/{family}', status_code=status.HTTP_200_OK)
async def funds_list(user: user_dependency, family: str):
    # Check for user authentication
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Authentication Failed'
        )
    funds = get_filtered_data(family)
    return {"funds": funds}


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

if __name__ == "__main__":
    uvicorn.run(app)
