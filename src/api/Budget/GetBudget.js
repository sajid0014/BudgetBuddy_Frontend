import {API_URL} from "@env"
import getToken from "../Token/GetToken";

const apiUrl=API_URL
const GetBudget = async () => {
  const token=await getToken();
  try {
    const response = await fetch(
      `${apiUrl}/budget/userId`,
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

export default GetBudget;
