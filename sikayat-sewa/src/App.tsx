import { use, useEffect } from 'react'
import AppRouter from './routes/Router'
import client from './client/Client';
import { useAuthStore } from './store/store';

export default function App() {
    useEffect(()=>{
    async function getData() {
      try {
        const response = await client.getSession()
        if (response) {
          useAuthStore.getState().setSession(response);
        } else {
          console.warn("No session data found");
        }
      } catch (error) {
        console.error("Error in App component:", error);

      }
    }
    getData();
  }, [useAuthStore.getState().session]);

  return (
    <div>
     <AppRouter />
    </div>
  )
}
