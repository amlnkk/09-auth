import axios from "axios";
import { cookies } from "next/headers";
import { User } from "@/types/user";
import { Note } from "@/types/note";

const baseURL = process.env.NEXT_PUBLIC_API_URL + "/api";

interface NotesParams {
  search?: string;
  page?: number;
  perPage?: number;
  tag?: string;
}

interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

const getHeaders = async () => {
  const cookieStore = await cookies();
  return { Cookie: cookieStore.toString() };
};

export const checkSession = async () => {
  const headers = await getHeaders();
  const res = await axios.get<User | null>(`${baseURL}/auth/session`, {
    headers,
  });
  return res.data;
};

export const getMe = async () => {
  const headers = await getHeaders();
  const res = await axios.get<User>(`${baseURL}/users/me`, { headers });
  return res.data;
};

export const fetchNotes = async (params?: NotesParams) => {
  const headers = await getHeaders();
  const res = await axios.get<NotesResponse>(`${baseURL}/notes`, {
    headers,
    params,
  });
  return res.data;
};

export const fetchNoteById = async (id: string) => {
  const headers = await getHeaders();
  const res = await axios.get<Note>(`${baseURL}/notes/${id}`, { headers });
  return res.data;
};
