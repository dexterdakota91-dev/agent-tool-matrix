import { getInitialData } from "@/app/actions";
import { MatrixClient } from "@/components/MatrixClient";

export const dynamic = "force-dynamic";

export default async function Page() {
  const initialData = await getInitialData();
  return <MatrixClient initialData={initialData} />;
}
