// pages/api/transactions.js
import { transact } from "./db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const result = await transact(async (client) => {
        return await client.query(
          "SELECT * FROM TABEL.transaction ORDER BY transaction_id, book_id ASC"
        );
      });
      return res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else if (req.method === "DELETE") {
    const transaction_id = req.query.transaction_id; // Get transactionId from query parameters
    console.log("Deleting transaction:", transaction_id);

    try {
      const result = await transact(async (client) => {
        return await client.query(
          "DELETE FROM TABEL.transaction WHERE transaction_id = $1 RETURNING *",
          [transaction_id]
        );
      });

      if (result.rowCount > 0) {
        console.log("Successfully deleted transaction:", transaction_id);
        return res.status(204).end(); // Success response with no content
      } else {
        console.error("Transaction not found:", transaction_id);
        return res.status(404).json({ message: "Transaction not found" });
      }
    } catch (err) {
      console.error("Error deleting transaction:", transaction_id, err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else if (req.method === "POST") {
    try {
      const {
        customer_id,
        book_id,
        quantity,
        transaction_date,
        price,
        staff_id,
      } = req.body; // Mendapatkan data dari body request

      await transact(async (client) => {
        // Melakukan INSERT dengan data yang diberikan
        await client.query(
          "INSERT INTO TABEL.transaction (customer_id, book_id, quantity, transaction_date, price, store_id, staff_id) VALUES ($1, $2, $3, $4, $5, $6, $7)",
          [customer_id, book_id, quantity, transaction_date, price, 1, staff_id]
        );
      });

      return res.status(201).json({ message: "Data inserted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else if (req.method === "PUT") {
    try {
      const { transaction_id, quantity, price } = req.body;

      await transact(async (client) => {
        // Melakukan UPDATE quantity dan price berdasarkan transaction_id yang diberikan
        await client.query(
          "UPDATE TABEL.transaction SET quantity = $1, price = $2 WHERE transaction_id = $3",
          [quantity, price, transaction_id]
        );
      });

      return res.status(200).json({ message: "Data updated successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
