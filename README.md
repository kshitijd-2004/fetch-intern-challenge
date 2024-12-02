# Points Management API

This is a simple RESTful API that tracks and manages point transactions for multiple payers. The API supports the following operations:

1. **Add Transactions**: Add points for a payer.
2. **Spend Points**: Spend points across payers following specific rules.
3. **Check Balances**: View the remaining balance for each payer.

---

## Setup Instructions

### Prerequisites

Ensure you have the following installed:
- **Node.js**: A JavaScript runtime environment ([Download Node.js](https://nodejs.org/)).
- **npm**: Node Package Manager (included with Node.js).

---

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/kshitijd-2004/fetch-intern-challenge
   cd .\fetch-intern-challenge\
   ```
2. **Install Dependencies:**
   ```bash
   npm install
   ```
3.  **Run the Server:**
    ```bash
    npm start
    ```
The server will start on http://localhost:8000.

---

## API Endpoints

### 1. Add Points

- **Description**: Add a transaction for a payer. If the transaction would result in the payer’s balance becoming negative at any point (based on timestamps), it will be denied.
- **Endpoint**: `/add`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "payer": "DANNON",
    "points": 500,
    "timestamp": "2022-10-31T10:00:00Z"
  }

- **Responses**:
  - **200 OK**: `"Points added successfully"`
  - **400 Bad Request**: `"Transaction denied: Adding this transaction would cause [payer]'s balance to go negative at some point in time."`

### 2. Spend Points

- **Description**: Spend points across all payers, prioritizing the oldest points first. Ensures that no payer’s balance goes negative.
- **Endpoint**: `/spend`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "points": 5000
  }

- **Responses**:
  - **200 OK**: A list of payers and the points deducted from each:
    ```json
    [
      { "payer": "DANNON", "points": -300 },
      { "payer": "UNILEVER", "points": -200 },
      { "payer": "MILLER COORS", "points": -4500 }
    ]
    ```
  - **400 Bad Request**: `"Insufficient points."`
  - **500 Internal Server Error**: `"A payer balance went negative, which is not allowed."`

### 3. Check Balances

- **Description**: Retrieve the remaining point balance for each payer.
- **Endpoint**: `/balance`
- **Method**: `GET`
- **Responses**:
  - **200 OK**: A JSON object showing each payer and their respective balance:
    ```json
    {
      "DANNON": 1000,
      "UNILEVER": 0,
      "MILLER COORS": 5300
    }
    ```
## Folder Structure

  ```bash
  .
  ├── routes/
  │   ├── add.js        # Logic for adding transactions
  │   ├── spend.js      # Logic for spending points
  │   ├── balance.js    # Logic for checking balances
  ├── utils/
  │   ├── transactions.js # Shared transaction array
  ├── index.js          # Main server file
  └── package.json      # Project dependencies and scripts
  ```

## How It Works

1. **Add Transactions**:
   - Transactions are added to a shared array, ensuring that they don’t cause a payer’s balance to go negative when sorted by timestamp.

2. **Spend Points**:
   - Points are deducted from the oldest transactions first.
   - Balances are tracked to ensure no payer’s balance goes negative.

3. **Check Balances**:
   - Balances are calculated dynamically by summing all transactions for each payer.

## Sample Commands

### Add Transactions

```bash
curl -X POST http://127.0.0.1:8000/add \
-H "Content-Type: application/json" \
-d '{"payer":"DANNON","points":500,"timestamp":"2022-10-31T10:00:00Z"}'
```

### Spend Points
```bash
curl -X POST http://127.0.0.1:8000/spend \
-H "Content-Type: application/json" \
-d '{"points":500}'
```

### Check Balances
```bash
curl -X GET http://127.0.0.1:8000/balance
```

## Error Handling

- **Invalid Fields**:
  - If required fields (`payer`, `points`, or `timestamp`) are missing, the server responds with a `400 Bad Request`.

- **Negative Balance Prevention**:
  - Adding transactions that lead to a negative balance (chronologically) is rejected.

- **Insufficient Points**:
  - Spending requests exceeding the total available points return a `400 Bad Request`.

## Contact

For any issues or questions, please contact Kshitij Dhande at kshitijdhande1@gmail.com.
