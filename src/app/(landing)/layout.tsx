import React, { PropsWithChildren } from "react";
import LayoutWithNavAndFooter from "@/components/layouts/LayoutWithNavAndFooter";

const LandingPageLayout: React.FC<PropsWithChildren> = (props) => {
  return <LayoutWithNavAndFooter>{props.children}</LayoutWithNavAndFooter>;
};

export default LandingPageLayout;
