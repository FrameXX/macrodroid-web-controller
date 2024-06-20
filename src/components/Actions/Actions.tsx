import R_Category from "../Category/Category";
import R_IconNotice from "../IconNotice/IconNotice";

export default function R_Actions() {
  return (
    <>
      <R_Category defaultOpen name="Saved" iconId="star">
        <R_IconNotice>No actions saved</R_IconNotice>
      </R_Category>
      <R_Category defaultOpen name="Recent" iconId="history">
        <R_IconNotice>No actions send</R_IconNotice>
      </R_Category>
    </>
  );
}
