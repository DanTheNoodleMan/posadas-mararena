// src/app/reservas/page.tsx
import { connection } from "next/server";
import ReservasClient from './ReservasClient';

export default async function ReservasPage() {
  // Do all server-side operations here
  await connection();
  
  // Fetch any initial data you need server-side
  // const initialData = await fetchSomeData();

  return (
    <ReservasClient 
    />
  );
}