import { Client } from '@notionhq/client'
import { NotionAPI } from 'notion-client'
import { ExtendedRecordMap } from 'notion-types'

// 1. Official Client (for Data API / Database Query)
// This is used to fetch the LIST of works.
export const notionOfficial = new Client({
    auth: process.env.NOTION_API_KEY,
})

// 2. Unofficial Client (for Page Rendering)
// This is used to fetch the CONTENT of a specific page for react-notion-x.
export const notionUnofficial = new NotionAPI()

export interface WorkItem {
    id: string
    title: string
    slug: string
    year: string
    coverImage: string
    meta: Record<string, string>
}

export async function getWorkItems(lang: string): Promise<WorkItem[]> {
    const databaseId = process.env.NOTION_WORKS_DB_ID;

    if (!databaseId) {
        throw new Error("❌ FATAL ERROR: NOTION_WORKS_DB_ID is not defined in .env.local");
    }

    // Helper to format UUID if it's a raw hex string
    const formatUUID = (id: string) => {
        if (id.length === 32 && !id.includes('-')) {
            return `${id.slice(0, 8)}-${id.slice(8, 12)}-${id.slice(12, 16)}-${id.slice(16, 20)}-${id.slice(20)}`;
        }
        return id;
    };

    const formattedId = formatUUID(databaseId);
    const apiKey = process.env.NOTION_API_KEY;

    if (!apiKey) {
        throw new Error("❌ FATAL ERROR: NOTION_API_KEY is not defined");
    }

    // DIRECT API CALL implementation to bypass client library issues
    try {
        const response = await fetch(`https://api.notion.com/v1/databases/${formattedId}/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                filter: {
                    and: [
                        {
                            property: 'Language',
                            select: {
                                equals: lang,
                            },
                        },
                        {
                            property: 'Show',
                            checkbox: {
                                equals: true,
                            },
                        },
                    ],
                },
                sorts: [
                    {
                        property: 'Order',
                        direction: 'ascending',
                    },
                ],
            }),
            cache: 'no-store'
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ API Error: ${response.status} ${response.statusText}`, errorText);
            throw new Error(`Notion API Error: ${response.status} ${errorText}`);
        }

        const data = await response.json();

        // Map the results
        return data.results.map((page: any) => {
            // Standard Fields
            const titleProperty = page.properties.Name || page.properties.Title;
            const title = titleProperty?.title?.[0]?.plain_text || 'Untitled';
            const slug = page.properties.Slug?.rich_text?.[0]?.plain_text || page.id;
            const year = page.properties.Year?.number?.toString() || page.properties.Year?.rich_text?.[0]?.plain_text || '';

            // Cover Image Logic
            let coverImage = ''
            if (page.cover?.type === 'external') {
                coverImage = page.cover.external.url
            } else if (page.cover?.type === 'file') {
                coverImage = page.cover.file.url
            }

            if (!coverImage && page.properties['Cover Image']) {
                const coverProp = page.properties['Cover Image'];
                if (coverProp.type === 'files' && coverProp.files?.length > 0) {
                    const fileObj = coverProp.files[0];
                    if (fileObj.type === 'external') {
                        coverImage = fileObj.external.url;
                    } else if (fileObj.type === 'file') {
                        coverImage = fileObj.file.url;
                    }
                }
            }

            // Extract OTHER properties (Meta)
            const meta: Record<string, string> = {};
            const keysToExclude = ['Name', 'Title', 'Slug', 'Year', 'Language', 'Cover Image', 'Full Page', 'Order', 'Show'];

            Object.keys(page.properties).forEach(key => {
                if (keysToExclude.includes(key)) return;

                const prop = page.properties[key];
                let value = '';

                if (prop.type === 'rich_text') {
                    value = prop.rich_text.map((t: any) => t.plain_text).join('');
                } else if (prop.type === 'select') {
                    value = prop.select?.name || '';
                } else if (prop.type === 'multi_select') {
                    value = prop.multi_select?.map((s: any) => s.name).join(', ');
                } else if (prop.type === 'number') {
                    value = prop.number?.toString() || '';
                } else if (prop.type === 'date') {
                    value = prop.date?.start || '';
                } else if (prop.type === 'url') {
                    value = prop.url || '';
                }

                if (value) {
                    meta[key] = value;
                }
            });

            return {
                id: page.id,
                title,
                slug,
                year,
                coverImage,
                meta
            }
        });

    } catch (error) {
        console.error("❌ Fetch execution failed:", error);
        throw error;
    }
}
// notion-client's recordMap currently arrives doubly-nested
// (entry.value.value.id) and includes inaccessible blocks
// shaped like { value: { role: "none" } }. react-notion-x reads
// entry.value.id directly, so unwrap the extra layer and drop
// entries with no usable value, otherwise uuidToId(undefined) throws.
function normalizeRecordMap<T extends Record<string, unknown>>(recordMap: T): T {
    const tables = ['block', 'collection', 'collection_view', 'notion_user', 'space'] as const
    for (const tableName of tables) {
        const table = (recordMap as any)[tableName]
        if (!table || typeof table !== 'object') continue
        for (const key of Object.keys(table)) {
            const entry = table[key]
            const inner = entry?.value
            if (inner && typeof inner === 'object' && typeof inner.id !== 'string') {
                if (inner.value && typeof inner.value === 'object' && typeof inner.value.id === 'string') {
                    entry.value = inner.value
                } else {
                    delete table[key]
                }
            }
        }
    }
    return recordMap
}

export async function getPageContent(pageId: string) {
    try {
        // Use the UNOFFICIAL client for fetching page content
        const recordMap = await notionUnofficial.getPage(pageId);
        return normalizeRecordMap(recordMap as unknown as Record<string, unknown>) as unknown as ExtendedRecordMap;
    } catch (error: any) {
        console.error(`❌ getPageContent failed: ${error.message}`);
        throw error;
    }
}

// Keeping this helper to avoid breaking WorkPage
export const getWorkBySlug = async (slug: string, lang: 'ja' | 'en'): Promise<WorkItem | undefined> => {
    try {
        const databaseId = process.env.NOTION_WORKS_DB_ID
        if (!databaseId) {
            return undefined;
        }

        // Helper to format UUID (same as above)
        const formatUUID = (id: string) => {
            if (id.length === 32 && !id.includes('-')) {
                return `${id.slice(0, 8)}-${id.slice(8, 12)}-${id.slice(12, 16)}-${id.slice(16, 20)}-${id.slice(20)}`;
            }
            return id;
        };

        const formattedId = formatUUID(databaseId);
        const apiKey = process.env.NOTION_API_KEY;

        if (!apiKey) {
            console.error("❌ FATAL ERROR: NOTION_API_KEY is not defined");
            return undefined;
        }

        // DIRECT API CALL implementation
        const response = await fetch(`https://api.notion.com/v1/databases/${formattedId}/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                filter: {
                    and: [
                        {
                            property: 'Language',
                            select: { equals: lang }
                        },
                        {
                            property: 'Slug',
                            rich_text: { equals: slug }
                        }
                    ]
                }
            }),
            next: { revalidate: 60 }
        });

        if (!response.ok) {
            console.error(`Failed to fetch work by slug: ${response.status} ${response.statusText}`);
            return undefined;
        }

        const data = await response.json();

        if (data.results.length === 0) return undefined

        const page: any = data.results[0]

        // Fix: Title mapping
        const titleProperty = page.properties.Name || page.properties.Title;
        const title = titleProperty?.title?.[0]?.plain_text || 'Untitled';

        const year = page.properties.Year?.number?.toString() || page.properties.Year?.rich_text?.[0]?.plain_text || ''

        // Fix: Cover Image mapping
        let coverImage = ''
        if (page.cover?.type === 'external') {
            coverImage = page.cover.external.url
        } else if (page.cover?.type === 'file') {
            coverImage = page.cover.file.url
        }

        if (!coverImage && page.properties['Cover Image']) {
            const coverProp = page.properties['Cover Image'];
            if (coverProp.type === 'files' && coverProp.files?.length > 0) {
                const fileObj = coverProp.files[0];
                if (fileObj.type === 'external') {
                    coverImage = fileObj.external.url;
                } else if (fileObj.type === 'file') {
                    coverImage = fileObj.file.url;
                }
            }
        }

        // Extract OTHER properties (Meta)
        const meta: Record<string, string> = {};
        const keysToExclude = ['Name', 'Title', 'Slug', 'Year', 'Language', 'Cover Image', 'Full Page', 'Order', 'Show'];

        Object.keys(page.properties).forEach(key => {
            if (keysToExclude.includes(key)) return;

            const prop = page.properties[key];
            let value = '';

            if (prop.type === 'rich_text') {
                value = prop.rich_text.map((t: any) => t.plain_text).join('');
            } else if (prop.type === 'select') {
                value = prop.select?.name || '';
            } else if (prop.type === 'multi_select') {
                value = prop.multi_select?.map((s: any) => s.name).join(', ');
            } else if (prop.type === 'number') {
                value = prop.number?.toString() || '';
            } else if (prop.type === 'date') {
                value = prop.date?.start || '';
            } else if (prop.type === 'url') {
                value = prop.url || '';
            }

            if (value) {
                meta[key] = value;
            }
        });

        return {
            id: page.id,
            title,
            slug,
            year,
            coverImage,
            meta
        }
    } catch (error) {
        console.error(`Failed to find work with slug ${slug}:`, error)
        return undefined
    }
}

export const getStaticPageId = (slug: string, lang: 'ja' | 'en'): string | undefined => {
    // Map 'ja' to 'JP' to match .env.local keys (e.g., NOTION_CV_ID_JP)
    const langKey = lang === 'ja' ? 'JP' : lang.toUpperCase();
    const envKey = `NOTION_${slug.toUpperCase()}_ID_${langKey}`
    return process.env[envKey]
}
