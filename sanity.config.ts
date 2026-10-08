'use client'

import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { presentationTool } from 'sanity/presentation'
import { structureTool } from 'sanity/structure'

import { publicEnv } from '@/lib/env/public-env'

import { presentationResolve } from '@/sanity/presentation-resolve'
import { schemaTypes } from '@/sanity/schema-types/schema-types'
import { singletonTypes, structure } from '@/sanity/structure'

const singletonActions = new Set(['publish', 'discardChanges', 'restore'])

export default defineConfig({
  name: 'default',
  title: 'NexSanity',
  basePath: '/studio',
  projectId: publicEnv.sanityProjectId,
  dataset: publicEnv.sanityDataset,
  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
  document: {
    actions: (actions, { schemaType }) =>
      singletonTypes.has(schemaType)
        ? actions.filter(({ action }) => action && singletonActions.has(action))
        : actions,
  },
  plugins: [
    structureTool({ structure }),
    presentationTool({
      resolve: presentationResolve,
      previewUrl: { previewMode: { enable: '/api/draft-mode/enable' } },
    }),
    visionTool({ defaultApiVersion: publicEnv.sanityApiVersion }),
  ],
})
