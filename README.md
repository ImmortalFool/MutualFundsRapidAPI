# MutualFundsRapidAPI
Mutual Funds transactions webpage which use Rapid api "(https://rapidapi.com/suneetk92/api/latest-mutual-fund-nav)" to fetch mutual funds data

# Prerequisites
To run this application, you need the following prerequisites:
Python 3.8 or greater.
Node.js v18 or greater.
Sign up to Rapid API -> https://rapidapi.com/suneetk92/api/latest-mutual-fund-nav
Subcribe to the API
Copy the RAPIDAPI_KEY from the request body

# To Setup Backend
Step 1: Create Virtual Environment & Install Requirements
To create virtual environment, run the following commands:
```
cd backend/
python3 -m venv venv
source venv/bin/activate
```
To install requiremnts, run the following command:
```
pip install -r requirements.txt
```
Step 2: Paste the RAPIDAPI_KEY that you have copied into .env file also input SECRET_KEY
You can change the username and password based on the convienence but the password must be a hashed password
Current password in .env file is "password" in hashed format

Step 3: To run the Backend of Application
run the following command:
```
python main.py
```
when you run this command a development server will run on [http://127.0.0.1:8000](http://localhost:8000)
Open the following url in browser to check the swagger guide of the api's used
```
http://localhost:8000/docs
```

# Open one more terminal to host the front end app

# To Setup Frontend
Setup 1: Navigate to the frontend folder and install the dependencies packages
Use the following commands
```
cd frontend
npm install
```
npm install will take some time to install all the packages and dependencies once completed
Use the following command to start the frontend
```
npm start
```

Login Page will be displayed once the frontend app is up
