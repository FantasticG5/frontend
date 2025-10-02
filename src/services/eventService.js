// src/services/eventService.js
import { apiGet, endpoints } from '../components/http';

// GET /api/event
export async function getAllClasses() {
    return apiGet(`${endpoints.EVENT}/event`);
  }
  
  // GET /api/event/{id}
  export async function getClassById(id) {
    return apiGet(`${endpoints.EVENT}/event/${id}`);
  }