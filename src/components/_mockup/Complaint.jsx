import React, {useState, useEffect} from "react";

// useEffect ---> 

// 2 way to handle use effect --->
    // 1. The function inside the useEffect
    //2. The function being called in the useEffect

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://ahms-be.onrender.com';


export default function Complaint(){

    const [complaints, setComplaints] = useState([])

    useEffect(() => {
        fetchOpenComplaints()
    }, [])
    const fetchOpenComplaints = async() => {
        try {
            // Get our token
            const token = localStorage.getItem('authToken')

            if(!token){
                throw new Error("Auth failed")
            }

            const url = `${API_BASE_URL}/api/admin/dashboard/complaints/open`

            const urlWithParams = new URL(url)
            urlWithParams.searchParams.append('limit', '5')
            urlWithParams.searchParams.append('offset', '0')

            const response = await fetch(urlWithParams.toString(), {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })

            const data = await response.json()
            setComplaints(data)
            console.log(data)
            return data
        } catch (error) {
            console.log(error)
        } 
    }

    return
}