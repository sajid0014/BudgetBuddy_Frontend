import getToken from "./Token/GetToken";
import {API_URL} from "@env"
const apiUrl=API_URL
const categorySorted=async ()=>{
    const token=await getToken();
    try{
        const response = await fetch(`${apiUrl}/transactions/all/category-sorted`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authorization:`Bearer ${token}`,
            },
          });
          return response;
    }catch(error){ 
        console.log("Error","Something went wrong. Please try again later.")
        console.error("Login error: ",error)
    }

}

export default categorySorted;