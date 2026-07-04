// hooks/use-profile-form.ts
import { object, string, array, minLength, number } from "zod/mini";
import { useApiAuthenticated } from "@/api";
import { useAppForm } from "@/hooks/form";
import { mapBackendErrorsToFormFields } from "@/lib/form-error-mapper";
import { useRouteContext } from "@tanstack/react-router";

const schema = object({
  first_name: string().check(minLength(1, "Required")),
  last_name: string().check(minLength(1, "Required")),
  linkedin: string(),
  categories: array(number()),
});

export function useProfileForm() {
  const api = useApiAuthenticated();
  const userProfile = useRouteContext({
    from: "/_authed/dashboard/profile",
  });

  const user = userProfile?.user;
  const updateProfile = api.useMutation("patch", "/candidates/profile/");

  const form = useAppForm({
    defaultValues: {
      first_name: user?.first_name,
      last_name: user?.last_name,
      linkedin: user?.linkedin,
      categories: user?.interested_categories?.map(Number) || [],
    },
    validators: {
      onSubmit: schema,
      onSubmitAsync: async ({ value }) => {
        try {
          await updateProfile.mutateAsync({
            body: {
              first_name: value.first_name,
              last_name: value.last_name,
              linkedin: value.linkedin,
              interested_categories: value.categories,
            },
          });
        } catch (error) {
          return {
            fields: mapBackendErrorsToFormFields(error, {
              fallbackField: "first_name",
            }),
          };
        }
      },
    },
  });

  return form;
}
