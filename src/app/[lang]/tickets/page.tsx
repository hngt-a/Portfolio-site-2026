import type { Metadata } from 'next'

// Ticket links for Ergonomic Embryo (Autumn Meteorite 2026 Tokyo).
// Static page: not managed in Notion.

const sellers = [
    {
        ja: '東京芸術劇場ボックスオフィス',
        en: 'Tokyo Metropolitan Theatre Box Office',
        noteJa: 'セブン-イレブン・ファミリーマート引取',
        noteEn: 'Pick up at 7-Eleven / FamilyMart',
        url: 'https://tmt.pia.jp/ticketInformation.do?eventCd=2624082&rlsCd=002',
    },
    {
        ja: 'チケットぴあ',
        en: 'Ticket Pia',
        url: 'https://t.pia.jp/pia/ticketInformation.do?eventCd=2624082&rlsCd=001',
    },
    {
        ja: 'イープラス',
        en: 'e+ (eplus)',
        url: 'https://eplus.jp/sf/detail/4567060009-P0030008',
    },
    {
        ja: 'ローソンチケット',
        en: 'Lawson Ticket',
        url: 'https://l-tike.com/order/?gLcode=31189&gPfKey=20260710000002249724%2C20260710000002249728%2C20260710000002249729%2C20260710000002249730&gEntryMthd=01&gScheduleNo=1&gCarrierCd=08&gPfName=%E8%8A%B1%E5%BD%A2%E3%80%80%E6%A7%99%E3%80%8E%E3%82%A8%E3%83%AB%E3%82%B4%E3%83%8E%E3%83%9F%E3%82%AF%E3%82%B9%E8%83%9A%E3%80%8F&gBaseVenueCd=33049',
    },
]

const shows = [
    { ja: '10/29（木）18:30', en: 'Thu 29 Oct, 18:30' },
    { ja: '10/30（金）18:30', en: 'Fri 30 Oct, 18:30' },
    { ja: '10/31（土）14:30', en: 'Sat 31 Oct, 14:30' },
    { ja: '11/1（日）14:30', en: 'Sun 1 Nov, 14:30' },
]

export async function generateMetadata({
    params,
}: {
    params: Promise<{ lang: string }>
}): Promise<Metadata> {
    const { lang } = await params
    return {
        title: lang === 'ja' ? 'エルゴノミクス胚 チケット' : 'Ergonomic Embryo Tickets',
    }
}

export default async function TicketsPage({
    params,
}: {
    params: Promise<{ lang: string }>
}) {
    const { lang } = await params
    const ja = lang === 'ja'

    return (
        <div className="max-w-3xl mx-auto animate-in fade-in duration-500 not-italic space-y-6 leading-snug [&_li]:!mb-0 [&_p]:!mb-0 [&_li]:!leading-snug [&_p]:!leading-snug">
            <header className="space-y-1">
                <p className="text-xs opacity-80">
                    {ja ? '舞台芸術祭「秋の隕石2026東京」' : 'Autumn Meteorite 2026 Tokyo'}
                </p>
                <h1 className="text-2xl font-bold">
                    {ja ? '花形槙『エルゴノミクス胚』' : 'Shin Hanagata "Ergonomic Embryo"'}
                </h1>
                <p className="text-sm">
                    {ja ? '東京芸術劇場 シアターイースト' : 'Tokyo Metropolitan Theatre, Theatre East'}
                </p>
            </header>

            <section className="space-y-2">
                <h2 className="text-sm font-bold">{ja ? 'チケット' : 'Tickets'}</h2>
                <ul className="flex flex-col gap-4">
                    {sellers.map((s) => (
                        <li key={s.url}>
                            <a
                                href={s.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group inline-block px-1 underline decoration-1 underline-offset-4 transition-all hover:bg-white hover:!text-black hover:no-underline"
                            >
                                <span className="text-lg font-bold group-hover:!text-black">{ja ? s.ja : s.en} →</span>
                            </a>
                            {s.noteJa && (
                                <span className="block text-xs opacity-80 px-1">{ja ? s.noteJa : s.noteEn}</span>
                            )}
                        </li>
                    ))}
                </ul>
            </section>

            <section className="space-y-1 text-sm">
                <h2 className="font-bold">{ja ? '日程' : 'Dates'}</h2>
                <ul>
                    {shows.map((d) => (
                        <li key={d.en}>{ja ? d.ja : d.en}</li>
                    ))}
                </ul>
                <p className="text-xs opacity-80">
                    {ja ? '開場は開演の30分前' : 'Doors open 30 minutes before.'}
                </p>
            </section>

            <section className="space-y-1 text-sm">
                <h2 className="font-bold">{ja ? '料金' : 'Prices'}</h2>
                <p className="text-xs opacity-80">
                    {ja ? '全席自由（入場整理番号付）' : 'Unreserved seating (numbered entry)'}
                </p>
                <ul>
                    <li>{ja ? '一般 4,500円' : 'General ¥4,500'}</li>
                    <li>{ja ? 'U29 2,500円' : 'Under 29 ¥2,500'}</li>
                    <li>{ja ? 'U18 1,000円' : 'Under 18 ¥1,000'}</li>
                    <li>{ja ? '障害者割引 4,050円' : 'Disability discount ¥4,050'}</li>
                </ul>
                <p className="text-xs opacity-80">
                    {ja ? 'U29・U18 は公演当日に年齢確認書類が必要' : 'Under 29 / Under 18: bring ID on the day.'}
                </p>
            </section>

            <p className="text-xs opacity-80">
                {ja
                    ? 'お問い合わせ：東京芸術劇場ボックスオフィス 0570-010-296'
                    : 'Contact: Tokyo Metropolitan Theatre Box Office, 0570-010-296'}
            </p>
        </div>
    )
}
