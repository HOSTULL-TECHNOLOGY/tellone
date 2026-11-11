import type { ComponentType } from "react";
import type { RoleKey } from "@/data/roles";
import MemberDashboard from "./member";
import StreetLeaderDashboard from "./street-leader";
import WardLeaderDashboard from "./ward-leader";
import StateCoordinatorDashboard from "./state-coordinator";
import CountryCoordinatorDashboard from "./country-coordinator";
import CreatorDashboard from "./creator";
import VendorDashboard from "./vendor";
import AspirantDashboard from "./aspirant";
import NationalDashboard from "./national";
import FinanceDashboard from "./finance";
import SafeguardingDashboard from "./safeguarding";
import DpoDashboard from "./dpo";
import CallCentreDashboard from "./call-centre";
import ShopperDashboard from "./shopper";
import ShopOpsDashboard from "./shop-ops";
import DeliveryDashboard from "./delivery";

/** One component per role. Each owns its own screens; only the shell is shared. */
export const dashboards: Record<RoleKey, ComponentType<{ section: string }>> = {
  "member": MemberDashboard,
  "street-leader": StreetLeaderDashboard,
  "ward-leader": WardLeaderDashboard,
  "state-coordinator": StateCoordinatorDashboard,
  "country-coordinator": CountryCoordinatorDashboard,
  "creator": CreatorDashboard,
  "vendor": VendorDashboard,
  "aspirant": AspirantDashboard,
  "national": NationalDashboard,
  "finance": FinanceDashboard,
  "safeguarding": SafeguardingDashboard,
  "dpo": DpoDashboard,
  "call-centre": CallCentreDashboard,
  "shopper": ShopperDashboard,
  "shop-ops": ShopOpsDashboard,
  "delivery": DeliveryDashboard,
};
