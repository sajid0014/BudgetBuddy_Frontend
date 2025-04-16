import getToken from "../Token/GetToken"
import { API_URL } from "@env"
const apiUrl = API_URL
const SetBudget = async ({ Budget, Food, Entertainment, TourTravels, Fashion, Academics }) => {
  const token = await getToken()
  const payload = {
    food: Food,
    entertainment: Entertainment,
    tourTravel: TourTravels,
    fashion: Fashion,
    academics: Academics,
    Budget: Budget
  };
  console.log(payload)
  try {
    const response = await fetch(`${apiUrl}/budget/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    return response;
  } catch (error) {
    console.error("fetch error: ", error);
  }

}

export default SetBudget;