import LaptopFormPage from '../../form-page';
import { notFound } from 'next/navigation';

export default async function EditLaptopPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  if (!id) {
    return notFound();
  }

  return <LaptopFormPage id={id} />;
}
