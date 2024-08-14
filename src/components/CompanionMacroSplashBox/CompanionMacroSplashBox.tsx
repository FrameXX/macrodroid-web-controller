import { R_ExternalLink } from "../ExternalLink/ExternalLink";
import { R_Icon } from "../Icon/Icon";
import { R_SplashBox } from "../SplashBox/SplashBox";
import companionMacroPath from "../../assets/other/companion.macro?url";
import { COMPANION_MACRO_FILENAME } from "../../modules/const";

export function R_CompanionMacroSplashBox() {
  return (
    <R_SplashBox splash={<R_Icon iconId="cogs" />}>
      <h2>Companion macro</h2>
      Companion macro enables this websites requests to be interpreted on your
      connected devices. It is crucial for functionality of this tool.
      <br />
      <br />
      <R_ExternalLink
        download={COMPANION_MACRO_FILENAME}
        iconId="download"
        href={companionMacroPath}
        title="Download companion macro"
      >
        Download macro
      </R_ExternalLink>
    </R_SplashBox>
  );
}
