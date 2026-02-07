import { redirect } from 'next/navigation';

export default function RoundPage({ params }: { params: { id: string } }) {
  redirect(`/rounds/${params.id}/scorecard`);
}
