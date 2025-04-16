import getToken from "../Token/GetToken"
import {API_URL} from "@env"
const apiUrl=API_URL
const createTransaction=async ({Amount,To,category,type,isSelfCredit,From,inputString})=>{
    const token=await getToken()
    const payload = {
        Amount: Amount,
        To: To,
        category: category,
        type:type,
        isSelfCredit:isSelfCredit,
        From:From,
        Date: inputString
      };
      console.log(payload)
      try {
        const response = await fetch(`${apiUrl}/transactions/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        return response;
    }catch (error) {
            console.error("fetch error: ", error);
          }

}

export default createTransaction;