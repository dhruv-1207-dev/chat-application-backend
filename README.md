# Chat Application

A modern chat application enabling real-time communication between registered users with a focus on user experience and security.

## Features

### 1. Live Chat
- Engage in real-time conversations with other registered users for seamless communication.

### 2. Profile Management
- Update your profile details.
- Upload a profile picture easily using a drag-and-drop interface.

### 3. Secure Authentication
- Implements **Refresh Token** functionality for continuous and secure user sessions without frequent re-authentication.

### 4. Rate Limiting and Security Middleware
- Middleware ensures protection against abuse by:
  - **Rate limiting API requests** to prevent excessive calls.
  - Mitigating potential **DDoS attacks** and API abuse.

---

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <project-folder>

2. Install dependencies

    ```bash
    node 18.20.4
    redis-cli
    npm install

3. Set up environment variables:

  - Create a .env file in the root directory.
  - Add the necessary environment variables as shown in .env.example.

4. Start the application:

    ```bash
    npm start


## Usage
 - Register as a user or log in if you already have an account.
 - Start chatting with other registered users in real time.
 - Update your profile, including uploading a profile picture via drag-and-drop.

## Postman Collection Link
- [Chat Application API Collection](https://www.postman.com/flight-architect-84253443/workspace/patient-management-system/collection/13906941-d1a391b3-2a81-47c0-8506-7de4ed7fe362?action=share&creator=13906941&active-environment=13906941-ca32083d-e60d-49d9-a60b-7ccc641e9df7)