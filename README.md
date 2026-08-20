# EstateFlow


EstateFlow is a web-based Real Estate Management System designed to manage properties and provide a simple platform for administrators, property owners, agents, and customers.


## Features


- Admin dashboard for property management
- Add, view, edit, and delete properties
- Property search and filtering
- Property pagination
- Owner dashboard
- Customer dashboard
- Explore available properties
- View complete property details
- Property image support
- Customer enquiries
- Site visit management
- PostgreSQL database integration
- REST API integration


## Property Management


The admin can manage property records using:


- Property ID
- Property Name
- Property Type
- Location
- Price
- Owner
- Agent
- Bedrooms
- Bathrooms
- Area
- Status
- Property Image


The property management module also includes search, filters, pagination, and property actions such as View, Edit, and Delete.


## Technology Stack


### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- Lucide React


### Backend
- Python
- FastAPI
- SQLAlchemy
- Pydantic


### Database
- PostgreSQL


### Tools
- Visual Studio Code
- Git
- GitHub


## Project Structure


```text
EstateFlow/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── types/
│   └── package.json
│
├── backend/
│   ├── app/
│   ├── requirements.txt
│   └── ...
│
├── .gitignore
└── README.md
Getting Started
#Frontend

Navigate to the frontend folder:

cd frontend

Install dependencies:

npm install

Start the development server:

npm run dev

The frontend will run at:

http://localhost:3000
#Backend

Navigate to the backend folder:

cd backend

Create a virtual environment:

python -m venv venv

Activate it on Windows:

venv\Scripts\activate

Install dependencies:

pip install -r requirements.txt

Start the FastAPI server using the configured project command.

#admin dashboard credentials
admin@estateflow.com
admin123

#owner dashboard credentials
owner@estateflow.com
owner123

#agent dashboard credentials
agent@estateflow.com
agent123



#Database

EstateFlow uses PostgreSQL to store property and application data.

The backend uses SQLAlchemy for database operations and FastAPI for providing REST APIs.

Pagination

The property management module supports pagination with different page sizes:

5 records
10 records
20 records
50 records

The property list also displays the current record range and total number of records.

Example:

1-10 of 100
Search and Filters

The properties module provides search functionality using:

Property Name
Property ID
Location
Owner
Agent

Available filters include:

Property Type
Sale/Rent
Location
Price Range
Bedrooms
Bathrooms
Status

Author

manvitha


Purpose

EstateFlow is a personal project developed to gain practical experience in full-stack web development, database integration, REST APIs, property management, and modern web technologies.
