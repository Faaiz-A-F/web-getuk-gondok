import { HeaderLandingPage } from "./HeaderLandingPage";

/**
 * Shared public-site header. Keeping one implementation prevents navigation,
 * account actions, and mobile behavior from drifting between pages.
 */
export function Header() {
  return <HeaderLandingPage />;
}
