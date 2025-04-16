import getToken from "../Token/GetToken";
import {API_URL} from "@env"
const apiUrl=API_URL
const getTypeTransaction = async (filterOption) => {
  const token = await getToken();
  try {
    const response = await fetch(
      `${apiUrl}/transactions/all/${filterOption}`,
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

export default getTypeTransaction;
