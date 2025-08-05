import { cookies } from 'next/headers';

export default async function Page() {
  const cookieStore = cookies();
  const test =
    (await cookieStore).get('accessToken')?.value || 'No test cookie found';

  return <div>{test}</div>;
}
