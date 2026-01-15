
import { getStaticPageId, getPageContent } from '@/lib/notion'
import { NotionPage } from '@/components/NotionPage'
import { notFound } from 'next/navigation'

export const revalidate = 60

export default async function StaticPage({
    params,
}: {
    params: Promise<{ lang: string, staticSlug: string }>
}) {
    const { lang, staticSlug } = await params
    const safeLang = (lang === 'en' || lang === 'ja') ? lang : 'ja'

    const pageId = getStaticPageId(staticSlug, safeLang)

    if (!pageId) {
        notFound()
    }

    try {
        const recordMap = await getPageContent(pageId)

        return (
            <div className="max-w-3xl mx-auto animate-in fade-in duration-500 not-italic">
                <NotionPage recordMap={recordMap} rootPageId={pageId} />
            </div>
        )
    } catch (e) {
        console.error(e)
        notFound()
    }
}
