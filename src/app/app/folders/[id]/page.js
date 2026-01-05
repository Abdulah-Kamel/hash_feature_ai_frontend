import { redirect } from "next/navigation";

export default function FolderPage({ params }) {
  redirect(`/app/folders/${params.id}/stages`);
}
