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
        <div className="grid grid-cols-1 min-[1100px]:grid-cols-2 gap-x-12 gap-y-20">
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
                            {/* Year + Type (and other meta) on the same line */}
                            {(() => {
                                const inlineMeta = Object.entries(work.meta || {}).filter(
                                    ([key]) => key !== 'Description' && key !== 'Type'
                                )
                                const description = work.meta?.Description

                                return (
                                    <>
                                        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 font-mono mt-1">
                                            {work.year && (
                                                <span className="text-sm text-white/70">
                                                    {work.year}
                                                </span>
                                            )}
                                            {inlineMeta.map(([key, value]) => (
                                                <span key={key} className="text-xs text-white/50 tracking-wide">
                                                    {value}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Description on its own line */}
                                        {description && (
                                            <p className="w-full text-sm font-mono text-white/50 tracking-wide mt-1">
                                                {description}
                                            </p>
                                        )}
                                    </>
                                )
                            })()}
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    )
}
