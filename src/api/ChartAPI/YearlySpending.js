import getToken from "../Token/GetToken";
import {API_URL} from "@env"
const apiUrl=API_URL
const YearlySpending = async () => {
  const token = await getToken();
  try {
    const response = await fetch(
      `${apiUrl}/transactions/all/debit/month-sum`,
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

export default YearlySpending;
