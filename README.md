# TryMighty Frontend Developer Challenge

## Student Details

- **Name** - Janhavi Hivarekar
- **University** - Mit-Adt University, Pune

## Project Overview
This project is a web application designed to allow users to view and cancel their purchases. Users will authenticate via OTP (One-Time Password) and access their orders for the day. The application includes:

- A login screen where users input their country code and mobile number.
- OTP validation and authentication process.
- An order list screen displaying the user's purchases.
- An order details screen where users can view their order items and cancel an order if needed.

## Technologies Used

### **Svelte**
- **Why?**
  - Svelte is a modern frontend framework that compiles components into highly efficient JavaScript.
  - It eliminates the need for a virtual DOM, resulting in faster updates and a better user experience.
  - Its reactive nature makes it easy to manage state changes, such as displaying updated order details after a cancellation.

### **Tailwind CSS**
- **Why?**
  - Provides utility-first styling, making it easier to create a responsive and modern UI.
  - Speeds up development by reducing the need to write custom CSS.
  - Ensures consistency across the application with predefined styles and design patterns.

## Project Flow

1. **User Authentication (OTP Flow):**
   - The user enters their country code and mobile number.
   - A request is sent to the server to generate an OTP.
   - The user inputs the OTP received via SMS.
   - The OTP is validated, and upon success, the user is authenticated.

2. **Orders Listing:**
   - After successful login, the user is redirected to the order list screen.
   - A request is sent to the server to fetch the day's orders.
   - The orders are displayed in a structured format with relevant details.

3. **Order Details:**
   - When the user clicks on an order, a request is made to retrieve order details and items.
   - The details are displayed, including a list of items in the order.
   - The user is presented with two buttons:
     - **Return Button:** Navigates back to the order list.
     - **Cancel Button:** Cancels the order by sending an update request to the server.

4. **Canceling an Order:**
   - When the cancel button is clicked, a request is sent to update the order status.
   - The UI updates to reflect the cancellation status.

## File Structure

```
📂 src
 ┣ 📂 routes
 ┃ ┣ 📂 login  # Login and OTP validation
 ┃ ┃ ┣ 📜 +page.svelte
 ┃ ┣ 📂 orders  # Order list screen
 ┃ ┃ ┣ 📜 +page.svelte
 ┃ ┣ 📂 orders/[id]  # Order details screen
 ┃ ┃ ┣ 📜 +page.svelte
 ┣ 📂 lib
 ┃ ┣ 📜 api.js  # Handles API requests
 ┃ ┣ 📜 store.js  # Manages global state
 ┣ 📜 app.html  # Main HTML template
 ┣ 📜 global.css  # Tailwind CSS styles
```

## API Endpoints Used

### **Request OTP**
```
POST https://api-tst.trymighty.com/v2/collaborators?action=request-otp
Body: {
  "phone": {
    "countryCode": "99",
    "number": "999999999"
  }
}
Response: 204 No Content
```

### **Validate OTP**
```
POST https://api-tst.trymighty.com/v2/collaborators?action=validate-otp
Body: {
  "phone": {
    "countryCode": "99",
    "number": "999999999"
  },
  "otp": {
    "code": "5886"
  }
}
Response: 204 No Content
```

### **Sign In**
```
POST https://api-tst.trymighty.com/v2/collaborators?action=sign-in
Body: {
  "phone": {
    "countryCode": "99",
    "number": "999999999"
  },
  "otp": {
    "code": "5886"
  }
}
Response: 200 OK
```

### **List Today's Orders**
```
GET https://api-tst.trymighty.com/v2/orders?onlyOrders=TRUE&period=TODAY
Headers: { "Authorization": "Bearer ${token}" }
Response: 200 OK
```

### **Get Order Items**
```
GET https://api-tst.trymighty.com/v2/orders/${order.id}/items
Headers: { "Authorization": "Bearer ${token}" }
Response: 200 OK
```

### **Cancel an Order**
```
PUT https://api-tst.trymighty.com/v2/orders/${order.id}
Headers: { "Authorization": "Bearer ${token}" }
Body: {
  "status": { "id": 0 }
}
Response: 200 OK
```

## Installation & Running the Project

1. **Clone the repository:**
   ```sh
   git clone https://github.com/Janhavi003/Janhavi.git
   cd Janhavi
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Start the development server:**
   ```sh
   npm run dev
   ```

4. **Deployed Link**
    ```sh
      https://janhavi-six.vercel.app/login
    ```

## Conclusion
This project demonstrates how to build a responsive and interactive web application using **Svelte** and **Tailwind CSS**. It efficiently manages user authentication, order retrieval, and order cancellation, providing a smooth user experience.

