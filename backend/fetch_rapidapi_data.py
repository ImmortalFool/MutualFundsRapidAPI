import requests
import copy
import os

from dotenv import load_dotenv
load_dotenv()

URL = "https://latest-mutual-fund-nav.p.rapidapi.com/latest"
querystring = {"Scheme_Type": "Open"}

headers = {
	"X-RapidAPI-Key": os.getenv("RAPIDAPI_KEY"),
	"X-RapidAPI-Host": "latest-mutual-fund-nav.p.rapidapi.com"
}


def fetch_data():
    response = requests.get(URL, headers=headers, params=querystring)
    fund_family = []
    for i in response.json():
        if i["Mutual_Fund_Family"] not in fund_family:
            fund_family.append(i["Mutual_Fund_Family"])
    return fund_family


def get_filtered_data(fund_family: str | None = None):
    query_string = copy.deepcopy(querystring)
    if fund_family:
        query_string["Mutual_Fund_Family"] = fund_family
    response = requests.get(URL, headers=headers, params=query_string)

    return response.json()
