import ReceiptPage from '@/components/ReceiptPage'
import { notFound } from 'next/navigation';
import React from 'react';

export default async function Page({params}: {params: Promise<{ id: string}>}) {
  const { id } = await params;
  // Ensure id exists before rendering
  if (!id) return notFound();


  return (
    <div>
      <ReceiptPage id={id} />
    </div>
  );
}
