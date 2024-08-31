import axios from "axios";
import { baseUrl } from "@/config/global";

export default axios.create({
    baseURL: baseUrl,
    headers: {
        "Content-Type": "application/json"
    }
})