# Ojewelry Server

This is the backend server for the Ojewelry e-commerce platform, responsible for handling business logic, database interactions, and API endpoints. Built with **Node.js**, **Express.js**, and **MongoDB**, it provides a secure and efficient backend for managing products, orders, and users.

## Features

### Customer Features

- 🛍️ View and fetch product details via API.
- 🛒 Add products to the cart and manage cart contents.
- 📦 Store and manage shipping addresses.
- 💳 Process payments securely via **Paymob** integration.
- ⭐ Customers can leave reviews and ratings for products.

### Admin Features

- ➕ Add new products with images and descriptions.
- ✏️ Edit or delete existing product details.
- 💰 Apply sales and discounts to products.
- 🖼️ Manage Hero images and product galleries.
- 🔒 Secure authentication and authorization for admins.

## 🛠 Tech Stack

- **Node.js** – Runtime environment.
- **Express.js** – Web framework for handling API requests.
- **MongoDB** – NoSQL database for storing products, users, and orders.
- **Mongoose** – ODM for interacting with MongoDB.
- **Paymob API** – Payment gateway integration.
- **JWT** – Secure authentication and authorization.

## 🚀 Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/Kareem-Mohamed-Wardany/Ojewelry-server.git
   ```

2. **Navigate to the project folder:**

   ```sh
   cd Ojewelry-server
   ```

3. **Install dependencies:**

   ```sh
   npm install
   ```

4. **Set up environment variables:**
   Create a `.env` file and configure the required credentials:

   ```env
    PORT = 5000
    DB_CONNECTION = DB_Connection_String
    JWT_SECRET = your_jwt_secret
    JWT_LIFETIME = 1h
    CLOUD_NAME = Cloudinary Cloud Name
    API_KEY = Cloudinary_API_KEY
    API_SECRET = Cloudinary_API_SECRET
    Paymob_API_KEY= your_paymob_key
    BASE_URL = 'https://accept.paymobsolutions.com/api'
    integration_id = PayMob_integration_id

   ```

5. **Run the server:**

   ```sh
   npm start
   ```

6. **API Endpoints:**
   The server runs on `http://localhost:5000`, providing RESTful API endpoints:

   ### **Auth Routes**

   - `/api/v1/auth` → Handles authentication (login, signup, etc.).

   ### **Admin Routes** (Protected)

   - `/api/v1/admin/products` → Admins manage products.
   - `/api/v1/admin/orders` → Admins manage orders.

   ### **Shop Routes**

   - `/api/v1/shop/products` → Fetch products for customers.
   - `/api/v1/shop/cart` → Manage shopping cart (requires authentication for users/admins).
   - `/api/v1/shop/address` → Manage shipping addresses (authenticated users/admins).
   - `/api/v1/shop/order` → Place orders (authenticated users/admins).
   - `/api/v1/shop/search` → Search for products.
   - `/api/v1/shop/review` → Add product reviews.

   ### **Common Routes**

   - `/api/v1/common/hero` → Manage hero images.

   ### **Payments**

   - `/api/v1/payments` → Handles payment processing.

## 🌍 Deployment

- Deployable on **Heroku**, **VPS**, or **Render**.
- Ensure all environment variables are configured in the hosting platform.

## 🤝 Contributions

Feel free to contribute by submitting pull requests or reporting issues.

## 📜 License

This project is licensed under the **MIT License**.
