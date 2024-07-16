import { R_ExternalLink } from "../ExternalLink/ExternalLink";
import { R_Icon } from "../Icon/Icon";
import { R_SplashBox } from "../SplashBox/SplashBox";
import companionMacroPath from "../../assets/other/companion.macro?url";

export function R_CompanionMacroSplashBox() {
  return (
    <R_SplashBox splash={<R_Icon iconId="cogs" />}>
      <h2>Companion macro</h2>
      Companion macro enables this websites request to be received and
      interpreted on your connected devices.
      <br />
      <br />
      <R_ExternalLink
        download
        iconId="download"
        href={companionMacroPath}
        title="Download companion macro"
      >
        Download macro
      </R_ExternalLink>
    </R_SplashBox>
  );
}
