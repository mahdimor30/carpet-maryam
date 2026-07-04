// src/services/session.server.ts
import { useSession } from "@tanstack/react-start/server";

export function useAppSession() {
  return useSession<{
    tokens: {
      access: string;
      refresh?: string;
    };
  }>({
    password: "ChangeThisBeforeShippingToProdOrYouWillBeFired",
  });
}
