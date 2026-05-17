import api from "./api";
import { cookies } from "next/headers";
import { User } from "@/types/user";
import { Note } from "@/types/note";

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
  const res = await api.get<User | null>("/auth/session", { headers });
  return res;
};

export const getMe = async () => {
  const headers = await getHeaders();
  const res = await api.get<User>("/users/me", { headers });
  return res.data;
};

export const fetchNotes = async (params?: NotesParams) => {
  const headers = await getHeaders();
  const res = await api.get<NotesResponse>("/notes", { headers, params });
  return res.data;
};

export const fetchNoteById = async (id: string) => {
  const headers = await getHeaders();
  const res = await api.get<Note>(`/notes/${id}`, { headers });
  return res.data;
};
