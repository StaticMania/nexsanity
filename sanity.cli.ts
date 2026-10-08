import './sanity/load-next-env'

import { defineCliConfig } from 'sanity/cli'

import { publicEnv } from './lib/env/public-env'

export default defineCliConfig({
  api: {
    projectId: publicEnv.sanityProjectId,
    dataset: publicEnv.sanityDataset,
  },
  typegen: {
    path: './{app,components,lib}/**/*.{ts,tsx}',
    schema: './sanity/schema.json',
    generates: './sanity/sanity.types.ts',
    overloadClientMethods: true,
  },
})
