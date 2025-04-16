import getToken from "../Token/GetToken";
import {API_URL} from "@env"
const apiUrl=API_URL
const TopExpenses = async () => {
  const token = await getToken();
  try {
    const response = await fetch(
      `${apiUrl}/transactions/single/top-transactions`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      }
    );
    return response.json();
  } catch (error) {
    console.error("fetch error: ", error);
  }
};

export default TopExpenses;
