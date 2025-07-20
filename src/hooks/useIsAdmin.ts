import { useMemo } from "react";
import { UserFirebase } from "../types";
import ROLE from "../src/utils/role";

export const useIsAdmin = (user: UserFirebase | null): boolean => {
  return useMemo(() => {
    if (!user || !user.apiUserData) {
      return false;
    }

    return user.apiUserData.role === ROLE.ADMIN;
  }, [user]);
};
