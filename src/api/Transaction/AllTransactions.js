import getToken from "../Token/GetToken";
import {API_URL} from "@env"
const apiUrl=API_URL
const getAllTransactions = async () => {
  const token = await getToken();
  try {
    const response = await fetch(
      `${apiUrl}/transactions/all/transactions`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      }
    );
    return response
  } catch (error) {
    console.error("fetch error: ", error);
  }
};

export default getAllTransactions;
