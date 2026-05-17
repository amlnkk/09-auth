import { create } from "zustand";
import { NoteTag } from "@/types/note";

interface NoteDraft {
  title: string;
  content: string;
  tag: NoteTag;
}

interface NoteStore {
  draft: NoteDraft;
  setDraft: (data: Partial<NoteDraft>) => void;
  clearDraft: () => void;
}

const defaultDraft: NoteDraft = {
  title: "",
  content: "",
  tag: "Todo",
};

export const useNoteStore = create<NoteStore>()((set) => ({
  draft: defaultDraft,
  setDraft: (data) => set((state) => ({ draft: { ...state.draft, ...data } })),
  clearDraft: () => set({ draft: defaultDraft }),
}));
