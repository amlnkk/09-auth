import { fetchNotes } from "@/lib/api/serverApi";
import NotesClient from "./Notes.client";

export default async function FilterPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const tag = slug[0] === "all" ? undefined : slug[0];

  await fetchNotes({ tag, page: 1, perPage: 12 });

  return <NotesClient tag={tag} />;
}
