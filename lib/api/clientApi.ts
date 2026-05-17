import api from "./api";
import { User } from "@/types/user";
import { Note } from "@/types/note";

interface AuthCredentials {
  email: string;
  password: string;
}

interface NotesParams {
  search?: string;
  page?: number;
  perPage?: number;
  tag?: string;
}

interface CreateNoteData {
  title: string;
  content: string;
  tag: string;
}

// Auth
export const register = (data: AuthCredentials) =>
  api.post<User>("/auth/register", data).then((r) => r.data);

export const login = (data: AuthCredentials) =>
  api.post<User>("/auth/login", data).then((r) => r.data);

export const logout = () => api.post("/auth/logout");

export const checkSession = () =>
  api.get<User | null>("/auth/session").then((r) => r.data);

// Users
export const getMe = () => api.get<User>("/users/me").then((r) => r.data);

export const updateMe = (data: Partial<Pick<User, "username">>) =>
  api.patch<User>("/users/me", data).then((r) => r.data);

// Notes
export const fetchNotes = (params?: NotesParams) =>
  api.get<Note[]>("/notes", { params }).then((r) => r.data);

export const fetchNoteById = (id: string) =>
  api.get<Note>(`/notes/${id}`).then((r) => r.data);

export const createNote = (data: CreateNoteData) =>
  api.post<Note>("/notes", data).then((r) => r.data);

export const deleteNote = (id: string) =>
  api.delete<Note>(`/notes/${id}`).then((r) => r.data);
