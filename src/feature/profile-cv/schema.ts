import {
  object,
  string,
  array,
  number,
  minLength,
  boolean,
  refine,
} from "zod/mini";

const isLinkedInUrl = (val: string) => {
  if (!val) return true; // optional

  try {
    const url = new URL(val);
    return url.hostname.includes("linkedin.com");
  } catch {
    return false;
  }
};

export const profileSchema = object({
  first_name: string().check(minLength(1, "First name required")),
  last_name: string().check(minLength(1, "Last name required")),

  interested_categories: array(number()).check(
    minLength(1, "Select at least one"),
  ),

  linkedin_url: string().check(
    refine(isLinkedInUrl, "Must be a valid LinkedIn URL"),
  ),

  allow_marketing: boolean(),
});
