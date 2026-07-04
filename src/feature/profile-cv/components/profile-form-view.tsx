import { useRouteContext, useRouter } from "@tanstack/react-router";
import { Check, Mail, Trash2, Lock, Link2 } from "lucide-react";
import { useApiAuthenticated } from "@/api";
import { Button } from "@/components/ui/button";
import { useAppForm } from "@/hooks/form";
import { mapBackendErrorsToFormFields } from "@/lib/form-error-mapper";
import { AreaChipSelector } from "@/components/onboarding/area-chip-selector";
import { profileSchema } from "../schema";
import { toast } from "@/lib/use-toast";

export function ProfileForm() {
  const router = useRouter();
  const authedApi = useApiAuthenticated();

  const updateProfile = authedApi.useMutation("patch", "/candidates/profile/");

  const { user } = useRouteContext({
    from: "/_authed",
  });

  const form = useAppForm({
    defaultValues: {
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      interested_categories:
        user?.interested_categories
          ?.map((cat) => cat?.id)
          .filter((id): id is number => id !== undefined) || [],
      linkedin_url: user?.linkedin || "",
      allow_marketing: user?.allow_marketing_email || false,
    },
    validators: {
      onSubmit: profileSchema,
      onSubmitAsync: async ({ value }) => {
        try {
          await updateProfile.mutateAsync({
            body: {
              first_name: value.first_name,
              last_name: value.last_name,
              interested_categories: value?.interested_categories,
              linkedin: value?.linkedin_url,
              allow_marketing_email: value?.allow_marketing,
            },
          });

          toast({
            title: "Profile Updated",
            description: "Your profile has been successfully updated.",
            variant: "default",
          });

          await router.invalidate();

          // Optional: Add a success toast here
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

  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-8 shadow-sm">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-[#032f22]">
          Personal Information
        </h2>
        <p className="text-sm text-[#414844]">
          Manage your public profile and preferences.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-8"
      >
        {/* Name Row */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <form.AppField
            name="first_name"
            children={(field) => <field.TextField label="First Name" />}
          />
          <form.AppField
            name="last_name"
            children={(field) => <field.TextField label="Last Name" />}
          />
        </div>

        {/* Email - Read Only */}
        <div className="space-y-2">
          <label
            className="text-xs font-bold tracking-widest text-[#4B5563]
              uppercase"
          >
            Email Address
          </label>
          <div className="relative">
            <input
              readOnly
              value={user?.email}
              className="w-full cursor-not-allowed rounded-xl border-none
                bg-[#F3F4F6] px-4 py-3 text-slate-400 italic outline-none"
            />
            <Lock
              className="absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2
                text-slate-400"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-4">
          <label
            className="text-xs font-bold tracking-widest text-[#4B5563]
              uppercase"
          >
            Job Categories
          </label>
          <form.AppField
            name="interested_categories"
            children={(field) => (
              <AreaChipSelector
                value={field.state.value}
                onChange={field.handleChange}
              />
            )}
          />
        </div>

        {/* LinkedIn */}
        <form.AppField
          name="linkedin_url"
          children={(field) => (
            <div className="space-y-2">
              <label
                className="text-xs font-bold tracking-widest text-gray-600
                  uppercase"
              >
                LinkedIn Profile
              </label>

              <field.TextField
                leftIcon={<Link2 className="h-4 w-4 text-gray-400" />}
                placeholder="https://www.linkedin.com/in/yourprofile"
                className="h-12 w-full rounded-xl border-0 bg-gray-100 pr-4
                  pl-11 text-sm text-gray-900 transition outline-none
                  focus:bg-white focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          )}
        />

        {/* Marketing Toggle */}
        <form.AppField
          name="allow_marketing"
          children={(field) => (
            <div
              className="flex items-center justify-between rounded-xl
                bg-[#ECFDF5] p-4"
            >
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-[#065F46]" />
                <div>
                  <p className="text-sm font-bold text-[#065F46]">
                    Marketing Emails
                  </p>
                  <p className="text-xs text-[#065F46]/70">
                    Receive career insights and updates
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => field.handleChange(!field.state.value)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0
                rounded-full transition-colors ${
                  field.state.value ? "bg-[#059669]" : "bg-slate-300"
                }`}
              >
                <span
                  className={`mt-0.5 inline-block h-5 w-5 transform rounded-full
                  bg-white shadow transition-transform ${
                    field.state.value ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          )}
        />

        {/* Footer Actions */}
        <div
          className="flex items-center justify-between border-t border-[#E5E7EB]
            pt-8"
        >
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm
              font-bold text-red-600 transition-all hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" /> Delete Account
          </button>

          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className="flex items-center gap-2 rounded-xl bg-[#059669] px-8
                  py-3 font-bold text-white transition-all hover:bg-[#047857]
                  active:scale-95"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
                {!isSubmitting && <Check className="h-4 w-4" />}
              </Button>
            )}
          />
        </div>
      </form>
    </div>
  );
}
