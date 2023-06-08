import Head from "next/head";
//import global css
import "../app/globals.css";
import { useState, useEffect } from "react";

//import component
import InputKolom from "@/components/inputKolom";
export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [customer_id, setCustomerID] = useState("");
  const [book_id, setBookID] = useState("");
  const [quantity, setQuantity] = useState("");
  const [staff_id, setStaffID] = useState("");
  const [transaction_date, setTransactionDate] = useState("");
  const [price, setPrice] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const [editingValue2, setEditingValue2] = useState("");
  const [data, setData] = useState([]);
  const [sqlQuery, setSqlQuery] = useState("");
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  //menambahkan data ke server
  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_id: parseInt(customer_id),
          book_id: parseInt(book_id),
          quantity: parseInt(quantity),
          staff_id: parseInt(staff_id),
          transaction_date: parseInt(transaction_date),
          price: parseFloat(price),
        }),
      });

      if (response.ok) {
        // Data berhasil ditambahkan
        console.log("data inserted successfully");

        // Mengambil data terbaru setelah berhasil menambahkan data baru
        fetch("/api/transaction", {
          method: "GET",
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            setTransactions(data);
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        // Gagal menambahkan data
        console.error("failed to insert data");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // menampilkan data dari server
  useEffect(() => {
    fetch("/api/transaction", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setTransactions(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  //delete data dari server
  const handleDelete = async (transaction_id) => {
    try {
      const response = await fetch(
        `/api/transaction?transaction_id=${transaction_id}`,
        {
          // Send transaction_id as a query parameter
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error(`Error: ${response.status}, ${errorData.message}`);
        return;
      }

      console.log("data deleted successfully");
      const newResponse = await fetch("/api/transaction", {
        method: "GET",
      });

      if (newResponse.ok) {
        const data = await newResponse.json();
        console.log(data);
        setTransactions(data);
      } else {
        console.error("failed to fetch new data");
      }
    } catch (error) {
      console.error(error);
    }
  };

  //edit quantity
  const handleEditSubmit = async () => {
    const response = await fetch("/api/transaction", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transaction_id: editingId,
        quantity: parseInt(editingValue, 10),
        price: parseFloat(editingValue2),
      }),
    });

    if (response.ok) {
      console.log("data updated successfully");
      setIsEditing(false);
      setEditingId(null);
      // Refresh data
      fetch("/api/transaction", {
        method: "GET",
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setTransactions(data);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      console.error("Failed to update data");
    }
  };


  //buat sql builder
  const fetchDataSQLBuilder = async () => {
    try {
    const response = await fetch("/api/sqlBuilder", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({ sqlQuery }),
      });

      if (!response.ok) {
          throw new Error("Failed to fetch data");
      }

      const result = await response.json();
      setData(result);
      setIsDataLoaded(true);
      } catch (error) {
      console.error(error);
      }
  };

  const handleSubmitQuery = (e) => {
      e.preventDefault();
      fetchDataSQLBuilder();
  };
  const handleSQLQueryChange = (event) => {
    setSqlQuery(event.target.value);
  };
  return (
    <>
      <Head>
        <title>salwa's bookstore</title>
      </Head>
      <section className="body bg-pink-50 py-20">
        <div className="flex flex-col mx-auto text-center justify-center items-center w-[840px]">
          <h1 className="text-[48px] text-center mx-auto">
            Welcome to Salwa's Bookstore ♡
          </h1>
          <div className="flex justify-evenly mt-12 gap-[120px]">
            <div className="flex flex-col items-start font-medium gap-3">
              <h3 className="text-md">Customer ID</h3>
              <h3 className="text-md">Book ID</h3>
              <h3 className="text-md">Quantity</h3>
            </div>
            <div className="flex flex-col gap-3">
              <input
                className="w-[120px] ring-1 text-center"
                value={customer_id}
                onChange={(e) => setCustomerID(e.target.value)}
              />
              <input
                className="w-[120px] ring-1 text-center"
                value={book_id}
                onChange={(e) => setBookID(e.target.value)}
              />
              <input
                className="w-[120px] ring-1 text-center"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div className="flex flex-col items-start gap-3 font-medium">
              <h3 className="text-md">Staff ID</h3>
              <h3 className="text-md">Transaction Date </h3>
              <h3 className="text-md">Price</h3>
            </div>
            <div className="flex flex-col gap-3">
              <input
                className="w-[120px] ring-1 text-center"
                value={staff_id}
                onChange={(e) => setStaffID(e.target.value)}
              />
              <input
                className="w-[120px] ring-1 text-center"
                value={transaction_date}
                placeholder="year"
                onChange={(e) => setTransactionDate(e.target.value)}
              />
              <input
                className="w-[120px] ring-1 text-center"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>
          <div className="bg-slate-100 h-[440px] mt-12 w-full overflow-y-scroll">
            <table className="table-style">
              <thead>
                <tr>
                  <th className="bg-gray-200">Book ID</th>
                  <th className="bg-gray-300">Quantity</th>
                  <th className="bg-gray-200">Price</th>
                  <th className="bg-gray-300">Customer ID</th>
                  <th className="bg-gray-200">Edit</th>
                  <th className="bg-gray-300">Delete</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.transaction_id}>
                    <td>{transaction.book_id}</td>
                    <td>
                      {isEditing && transaction.transaction_id === editingId ? (
                        <input
                          className="w-[50px] h-[30px] text-center ring-1"
                          type="number"
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                        />
                      ) : (
                        transaction.quantity
                      )}
                    </td>

                    <td>
                      {isEditing && transaction.transaction_id === editingId ? (
                        <input
                          className="w-[50px] h-[30px] text-center ring-1"
                          type="number"
                          value={editingValue2}
                          onChange={(e) => setEditingValue2(e.target.value)}
                        />
                      ) : (
                        transaction.price
                      )}
                    </td>
                    <td>{transaction.customer_id}</td>
                    <td>
                      {isEditing && transaction.transaction_id === editingId ? (
                        <button
                          className="w-[100px] h-[30px] bg-green-500 text-white rounded-md"
                          onClick={handleEditSubmit}
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          className="w-[100px] h-[30px] bg-blue-500 text-white rounded-md"
                          onClick={() => {
                            setIsEditing(true);
                            setEditingId(transaction.transaction_id);
                            setEditingValue(transaction.quantity);
                            setEditingValue2(transaction.price);
                          }}
                        >
                          Edit
                        </button>
                      )}
                    </td>
                    <td>
                      <button
                        className="w-[100px] h-[30px] rounded-md bg-red-500 text-white"
                        onClick={() => handleDelete(transaction.transaction_id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            className="font-medium bg-green-300 w-[100px] mt-3 h-[35px]"
            onClick={handleSubmit}
          >
            submit
          </button>
          <div className="w-full flex-col flex gap-3">
              <h2 className="font-bold text-left text-3xl">SQL builder</h2>
              <p className="font-medium text-md -mt-2 text-left">write your query here!</p>
              <form onSubmit={handleSubmitQuery}>
                <textarea
                    className="w-full h-24 p-4 mt-2 border border-gray-300 rounded"
                    placeholder="example : INSERT INTO tabel.transaction (customer_id, book_id, quantity, staff_id, transaction_date, price)
                                            VALUES (12, 11, 3, 14, 2023, 500)"
                     value={sqlQuery}
                     onChange={handleSQLQueryChange}

                ></textarea>
                <button
                    className="bg-blue-300 text-black font-medium w-[100px] h-[35px] mt-3"
                >
                    execute
                </button>
                </form>
                {isDataLoaded && (
                <div className="mt-2 overflow-y-scroll font-bold h-[400px]">
                <div className="bg-slate-200 p-8 text-left ">
                    <pre>{JSON.stringify(data, null, 2)}</pre>
                </div>
                </div>
            )}
          </div>


        </div>
      </section>
    </>
  );
}
