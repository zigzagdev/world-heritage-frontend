import type {
  ApiWorldHeritageDto,
  ApiWorldHeritageImageDto,
  WorldHeritageDetailVm,
  WorldHeritageImageVm,
  WorldHeritageVm,
} from "../../../../domain/types.ts";
import { toWorldHeritageVm } from "./to-world-heritage-vm.ts";

export function toWorldHeritageDetailVm(dto: ApiWorldHeritageDto): WorldHeritageDetailVm {
  const base: WorldHeritageVm = toWorldHeritageVm(dto);
  const images: WorldHeritageImageVm[] = (dto.images ?? [])
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order)
    .map(
      (img: ApiWorldHeritageImageDto): WorldHeritageImageVm => ({
        id: img.id,
        url: img.url,
        alt: img.alt ?? base.title,
        credit: img.credit,
        width: img.width,
        height: img.height,
        isPrimary: !!img.is_primary,
      }),
    );

  return {
    ...base,
    images,
  };
}
