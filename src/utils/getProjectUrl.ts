import { getRelativeLocaleUrl } from "astro:i18n";
import config from "@/config";

/**
 * Returns a navigable URL for a project detail page.
 * e.g. `/projects/mannequio-virtual-try-on`
 */
export function getProjectUrl(
  id: string,
  locale: string | undefined = config.site.lang
): string {
  return getRelativeLocaleUrl(locale, `projects/${id}`);
}
