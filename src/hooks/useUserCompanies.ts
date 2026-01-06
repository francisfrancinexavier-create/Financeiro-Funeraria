import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useUserCompanies(userId: string) {
  const [companies, setCompanies] = useState<any[]>([]);
  useEffect(() => {
    if (!userId) return;
    supabase
      .from("user_companies")
      .select("company_id, companies(*)")
      .eq("user_id", userId)
      .then(({ data }) => {
        setCompanies(data?.map((uc: any) => uc.companies) || []);
      });
  }, [userId]);
  return companies;
}
