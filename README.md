# Navicode Project

## Overview
Navicode is a full-stack application designed to manage products. It includes a React-based frontend and a Node.js/Express backend. The application allows users to create, read, update, and delete (CRUD) product entries, with features like search, sorting, and pagination.

## Features
- **Frontend**: Built with React and TailwindCSS, the frontend provides a user-friendly interface for managing products.
- **Backend**: Powered by Node.js and Express, the backend handles API requests and connects to a database.
- **CRUD Operations**: Users can create, edit, delete, and view product details.
- **Search and Sorting**: Search products by name or creation date, and sort by price, weight, or creation date.
- **Pagination**: Navigate through products using "Next" and "Previous" buttons.

## Project Structure
```
navicode/
├── client/                # Frontend code
│   ├── src/
│   │   ├── App.jsx        # Main React component
│   │   ├── index.css      # Global styles
│   │   └── ...
│   ├── public/            # Static assets
│   ├── package.json       # Frontend dependencies
│   └── ...
├── server/                # Backend code
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── server.js          # Entry point for the backend
│   ├── package.json       # Backend dependencies
│   └── ...
└── README.md              # Project documentation
```

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm (v8 or higher)
- MongoDB (for database)

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/Nilo-07/navicode-submission.git
   cd navicode-submission
   ```

2. Install dependencies for the frontend:
   ```bash
   cd client
   npm install
   ```

3. Install dependencies for the backend:
   ```bash
   cd ../server
   npm install
   ```

4. Set up environment variables:
   - Create a `.env` file in the `server/` directory.
   - Add the following variables:
     ```env
     PORT=5001
     MONGO_URI=mongodb://localhost:27017/navicode
     ```

5. Start the backend server:
   ```bash
   npm start
   ```

6. Start the frontend development server:
   ```bash
   cd ../client
   npm run dev
   ```

7. Open the application in your browser:
   ```
   http://localhost:5173
   ```

## Usage
- **Create Product**: Click the "Create New" button, fill in the form, and save.
- **Edit Product**: Click the "Edit" button next to a product, modify the details, and save.
- **Delete Product**: Click the "Delete" button next to a product and confirm.
- **Search**: Use the search bar to find products by name or creation date.
- **Sort**: Use the dropdown to sort products by price, weight, or creation date.
- **Pagination**: Use the "Next" and "Previous" buttons to navigate through products.

## Technologies Used
- **Frontend**: React, TailwindCSS, Vite
- **Backend**: Node.js, Express
- **Database**: MongoDB


## Acknowledgments
- [React](https://reactjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
