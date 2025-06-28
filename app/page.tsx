interface HomeParams {
  searchParams: {
    country: string;
    city: string;
  };
}

export default async function Home({
  searchParams: { country, city },
}: HomeParams) {
  console.log({ country, city });

  return <main>Hello</main>;
}
