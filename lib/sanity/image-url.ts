import { createImageUrlBuilder } from '@sanity/image-url'
import type { ImageUrlBuilder } from '@sanity/image-url'

import { publicEnv } from '@/lib/env/public-env'

import type { ProjectedImage } from '@/types/sanity-image'

const imageUrlBuilder = createImageUrlBuilder({
  projectId: publicEnv.sanityProjectId,
  dataset: publicEnv.sanityDataset,
})

export function urlForImage(image: ProjectedImage & { asset: { _id: string } }): ImageUrlBuilder {
  return imageUrlBuilder.image({
    asset: { _ref: image.asset._id },
    crop: image.crop ?? undefined,
    hotspot: image.hotspot ?? undefined,
  })
}
