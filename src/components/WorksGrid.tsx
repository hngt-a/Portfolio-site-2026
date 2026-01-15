'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { WorkItem } from '@/lib/notion'

interface WorksGridProps {
    works: WorkItem[]
    lang: string
}

export const WorksGrid = ({ works, lang }: WorksGridProps) => {
    return (
        <div className="grid grid-cols-1 min-[1200px]:grid-cols-2 gap-x-12 gap-y-20">
            {works.map((work) => (
                <Link
                    key={work.id}
                    href={`/${lang}/works/${work.slug}`}
                    className="group block mix-blend-normal"
                >
                    {/* Work Item Container */}
                    <div className="">
                        {/* Image Container */}
                        <div className="relative w-full aspect-[4/3] bg-black overflow-hidden border border-white/20 transition-all duration-500 group-hover:invert">
                            {work.coverImage ? (
                                <Image
                                    src={work.coverImage}
                                    alt={work.title}
                                    fill
                                    className="object-cover transition-opacity duration-500"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    priority={false}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-500 font-mono text-xs uppercase tracking-widest">
                                    No Image
                                </div>
                            )}
                        </div>

                        {/* Text Block */}
                        <div className="flex flex-col gap-1 items-start mt-[3px] text-white bg-black transition-all duration-300 group-hover:invert">
                            <h2 className="text-[16pt] tracking-widest leading-tight">
                                {work.title}
                            </h2>
                            <span className="text-sm font-mono text-white/70">
                                {work.year}
                            </span>

                            {/* Meta Information */}
                            {work.meta && Object.keys(work.meta).length > 0 && (
                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-mono text-white/50 mt-1">
                                    {Object.entries(work.meta).map(([key, value]) => (
                                        <span key={key} className="tracking-wide">
                                            {value}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    )
}
