import { Icon } from "../Icon";

interface FAQItem {
    id: string;
    question: string;
    answer: string;
}

interface FAQprops {
    items: Array<FAQItem>
    title?: string;
    className?: string;
}

export function FAQCompontent({ items, title, className = ""}: FAQprops) {

    return (
        <section className={`py-16 lg:py-24 ${className}`}>
            <div className="mx-auto max-w-3xl">
                {title && (
                    <div className="text-center mb-12">
                        <p className="text-sm font-black uppercase tracking-[0.2em] text-primary mb.2">
                            FAQ
                        </p>
                        <h1 className="font-serif text-3xl font-bold leading-tight sm:text-4xl">
                            {title}
                        </h1>
                    </div>
                )}

                <dl className="space-y-3">
                    {items.map((item, index) => (
                        <div key={index} className="group">
                            <details id={item.id} className="group border border-foreground/10 rounded-xl bg-white overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-md">
                                <summary 
                                    className="flex items-center justify-between w-full px-6 py-4 text-left cursor-pointer list-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2"
                                >
                                    <dt className="flex-1 text-xl font-semibold text-foreground pr-4">
                                        {item.question}
                                    </dt>
                                    <Icon name="chevron" className="size-5 text-foreground/40 shrink-0 ml-4 transition-transform duration-300 group-open:rotate-90" aria-hidden="true" />
                                </summary>
                                <dd className="px-6 pb-5 pt-4 text-foreground/40 leading-7 border-t border-foreground/5">
                                    <p className="text-base leading-7 text-foreground/70">
                                        {item.answer}
                                    </p>
                                </dd>
                            </details>
                        </div>
                    ))}
                </dl>
            </div>
        </section>
    )

}