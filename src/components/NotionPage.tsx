'use client'

import React from 'react'
import { NotionRenderer } from 'react-notion-x'
import { ExtendedRecordMap, Block } from 'notion-types'
import { defaultMapImageUrl } from 'notion-utils'
import Link from 'next/link'
import Image from 'next/image'

const NOTION_IMAGE_WIDTH = 1600

function mapImageUrl(url: string | undefined, block: Block): string | undefined {
    if (!url) {
        return url
    }
    const normalized = defaultMapImageUrl(url, block)
    if (!normalized || !normalized.includes('www.notion.so/image/')) {
        return normalized
    }
    const out = new URL(normalized)
    if (!out.searchParams.has('width')) {
        out.searchParams.set('width', String(NOTION_IMAGE_WIDTH))
    }
    return out.toString()
}

// Import styles moved to layout, but we need the components mapping for Next.js Image/Link
// We often need a Code component (using prismjs) and Collection (if we rendered collections, but we manually fetch index).

interface NotionPageProps {
    recordMap: ExtendedRecordMap
    rootPageId?: string
}

export const NotionPage = ({ recordMap, rootPageId }: NotionPageProps) => {
    return (
        <div className="notion-container">
            {/* 
        We wrap in a container to scope styles if needed.
        react-notion-x provides 'dark-mode' support via class validation usually.
      */}
            <NotionRenderer
                recordMap={recordMap}
                fullPage={false} // We embed it in our layout
                darkMode={false} // Can be dynamic if we implement theme toggle
                rootPageId={rootPageId}
                mapImageUrl={mapImageUrl}
                components={{
                    nextImage: Image,
                    nextLink: Link,
                }}
                // Customizing styles to be "Gentle"
                // Most styles come from CSS, but we can override some here if supported.
                // We can disable headers if we want to render title manually.
                disableHeader
            />
        </div>
    )
}
