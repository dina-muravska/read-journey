"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  children: React.ReactNode;
};

export default function ResponsivePaginationWrapper({ children }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const updateLimit = () => {
      const width = window.innerWidth;
      let newLimit = 10;

      if (width < 768) {
        newLimit = 2;
      } else if (width < 1440) {
        newLimit = 4;
      }

      const currentLimit = Number(searchParams.get("limit")) || 10;

      if (currentLimit !== newLimit) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("limit", String(newLimit));
        params.set("page", "1");
        router.replace(`?${params.toString()}`, { scroll: false });
      }
    };

    updateLimit();

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateLimit, 200);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
    };
  }, [searchParams, router]);

  return <>{children}</>;
}
