import { Navigation } from '@/components/Navigation'

export default async function LangLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: Promise<{ lang: string }>
}) {
    const { lang } = await params
    return (
        <div className="min-h-screen text-white selection:bg-[#39ff14] selection:text-black font-sans">
            {/* Fixed Background Layer */}
            <div
                className="fixed inset-0 z-[-2] bg-center bg-no-repeat bg-[length:100%_100%]"
                style={{ backgroundImage: 'url(/bg-gradient.jpg)' }}
            />

            {/* Overlay Layer for Readability - REMOVED per user request */}
            {/* <div className="fixed inset-0 z-[-1] bg-black/40" /> */}

            {/* Content Layer */}
            <div className="relative flex flex-col min-h-screen">
                <Navigation lang={lang} />
                <main className="flex-1 w-full max-w-[2000px] mx-auto px-4 md:px-8 py-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
