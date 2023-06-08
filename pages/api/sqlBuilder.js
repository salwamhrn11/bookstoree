const db = require("./db")

module.exports = async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { sqlQuery } = req.body;

      const result = await db.transact(async (client) => {
        const queryResult = await client.query(sqlQuery);
        return queryResult.rows;
      });

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
      console.log(error);
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
};
