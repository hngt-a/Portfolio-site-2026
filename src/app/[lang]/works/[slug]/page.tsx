
import { getWorkBySlug, getPageContent } from '@/lib/notion'
import { NotionPage } from '@/components/NotionPage'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

export const revalidate = 60

export default async function WorkPage({
    params,
}: {
    params: Promise<{ lang: string, slug: string }>
}) {
    const { lang, slug } = await params

    const safeLang = (lang === 'en' || lang === 'ja') ? lang : 'ja'

    // 1. Find the page ID via slug
    const work = await getWorkBySlug(slug, safeLang)
    if (!work) {
        notFound()
    }

    // 2. Fetch the page content
    const recordMap = await getPageContent(work.id)

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Navigation (Back) */}
            <div className="flex justify-between items-center text-sm text-gray-500">
                <Link href={`/${safeLang}`} className="hover:text-black dark:hover:text-white flex items-center gap-1 transition-colors">
                    <ArrowLeft size={16} />
                    Back to Works
                </Link>
                {/* Next/Prev could go here if we implemented scanning the index */}
            </div>

            <header className="space-y-2 mb-8 border-b border-gray-100 pb-8 dark:border-gray-800">
                <h1 className="text-3xl font-bold tracking-tight">{work.title}</h1>
                <p className="text-gray-400 font-mono">{work.year}</p>
            </header>

            <NotionPage recordMap={recordMap} rootPageId={work.id} />
        </div>
    )
}
