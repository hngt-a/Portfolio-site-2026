
import { getWorkBySlug, getPageContent } from '@/lib/notion'
import { NotionPage } from '@/components/NotionPage'
import Link from 'next/link'
import Image from 'next/image'
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
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 not-italic">
            {/* Navigation (Back) */}
            <div className="flex justify-between items-center text-sm text-gray-500 mb-8">
                <Link href={`/${safeLang}`} className="hover:text-black dark:hover:text-white flex items-center gap-1 transition-colors">
                    <ArrowLeft size={16} />
                    Back to Works
                </Link>
            </div>

            <header className="space-y-6 mb-12 border-b border-gray-100 pb-12 dark:border-gray-800">
                {/* Cover Image */}
                {work.coverImage && (
                    <div className="relative w-full aspect-video overflow-hidden rounded-sm bg-gray-100 dark:bg-gray-900 mb-8">
                        <Image
                            src={work.coverImage}
                            alt={work.title}
                            fill
                            className="object-cover"
                            priority
                            sizes="(max-width: 900px) 100vw, 900px"
                        />
                    </div>
                )}

                <div className="flex flex-col gap-1 items-start">
                    <h1 className="text-3xl tracking-widest leading-tight text-white italic">
                        {work.title}
                    </h1>

                    <span className="text-sm font-mono text-white/70 mt-1 block italic">
                        {work.year}
                    </span>

                    {work.meta?.Type && (
                        <div className="text-xs font-mono text-white/50 tracking-wide mt-1 italic">
                            {work.meta.Type}
                        </div>
                    )}

                    {work.meta?.Description && (
                        <p className="text-base leading-relaxed text-gray-300 mt-6 font-normal max-w-2xl">
                            {work.meta.Description}
                        </p>
                    )}
                </div>
            </header>

            <NotionPage recordMap={recordMap} rootPageId={work.id} />
        </div>
    )
}
