
import { getWorkItems } from '@/lib/notion'
import { WorksGrid } from '@/components/WorksGrid'

export const revalidate = 60 // ISR: Revalidate every 60 seconds

export default async function TopPage({
    params,
}: {
    params: Promise<{ lang: string }>
}) {
    const { lang } = await params
    const worksDbId = process.env.NOTION_WORKS_DB_ID
    if (!worksDbId) {
        return <div>Database ID not configured</div>
    }

    // Validate Lang
    const safeLang = (lang === 'en' || lang === 'ja') ? lang : 'ja'

    const works = await getWorkItems(safeLang)

    return (
        <div className="space-y-8">
            {/* "Clean navigation at the top, followed immediately by the works grid." */}
            {/* Navigation is in Layout */}

            <section>
                {/* Maybe a hidden H1 for SEO */}
                <h1 className="sr-only">Works</h1>
                <WorksGrid works={works} lang={safeLang} />
            </section>
        </div>
    )
}
