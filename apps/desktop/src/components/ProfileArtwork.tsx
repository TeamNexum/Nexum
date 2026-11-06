import { categoryMeta } from "../modeMeta";
import { tintOf, tintStyle } from "../galaxyTints";
import PixelGalaxy from "./PixelGalaxy";

/** A profile's picture: its own pixel galaxy in its own tint, with the category icon on a white plate. */
export default function ProfileArtwork({ category }: { category: string }) {
  const { Icon, label } = categoryMeta(category);
  const tint = tintOf(category);
  return (
    <div className="profile-art" data-category={category} style={tintStyle(tint)} aria-hidden="true">
      <PixelGalaxy tint={tint} animate={false} />
      <span className="art-category">{label}</span>
      <span className="art-plate"><Icon size={20} className="cine-icon" /></span>
    </div>
  );
}
