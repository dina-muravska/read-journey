import MainLayout from "@/components/MainLayout";

type Props = {
  params: Promise<{ bookId: string }>;
};

export default async function ReadingPage({ params }: Props) {
  const { bookId } = await params;

  return (
    <MainLayout>
      <section>
        <h1>Reading</h1>
        <p>Book: {bookId}</p>
      </section>
    </MainLayout>
  );
}
