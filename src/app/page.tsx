import { getInitialData } from "@/app/actions";
import { MatrixClientWrapper } from "@/components/MatrixClientWrapper";

export const dynamic = "force-dynamic";

export default async function Page() {
  const initialData = await getInitialData();
  return <MatrixClientWrapper initialData={initialData} />;
}

