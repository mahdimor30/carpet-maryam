import { useApiAuthenticated } from "@/api";

// hooks/use-cv-manager.ts
export function useCvManager() {
  const api = useApiAuthenticated();

  const cvsQuery = api.useQuery("get", "/candidates/cv/");

  const createCv = api.useMutation("post", "/candidates/cv/");
  const deleteCv = api.useMutation("delete", "/candidates/cv/{id}/");
  const updateCv = api.useMutation("patch", "/candidates/cv/{id}/");

  const uploadCv = async (file: File) => {
    const formData = new FormData();
    formData.append("document", file);
    formData.append("version_name", 'label1');

    const res = await createCv.mutateAsync({ body: formData });

    await cvsQuery.refetch(); // 🔥 sync UI

    return res;
  };

  const removeCv = async (id: number) => {
    await deleteCv.mutateAsync({
      params: { path: { id: String(id) } },
    });

    await cvsQuery.refetch();
  };

  const renameCv = async (id: number, version_name: string) => {
    await updateCv.mutateAsync({
      params: { path: { id: String(id) } },
      body: { version_name },
    });

    await cvsQuery.refetch();
  };

  return {
    cvs: cvsQuery.data ?? [],
    isLoading: cvsQuery.isLoading,
    uploadCv,
    removeCv,
    renameCv,
  };
}