import { useEffect, useState } from "react";
import { termsServiceApi } from "../../services/termsServiceApi";
import type { TermsServiceContent } from "../../types/termsService";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "../../components/Icon";
import Markdown from "react-markdown";

export function TermsPage() {
    const [terms, setTerms] = useState<TermsServiceContent | null>(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate();

    useEffect(() => {
        async function loadTerms() {
            try {
            const termsContent = await termsServiceApi.getTermsService()
            setTerms(termsContent)
            setLoading(false)
            } catch (e) {
                console.error("Error loading terms:", e)
            } finally {
                setLoading(false)
            }
        }
        loadTerms();
    }, []);

   if (loading) {
    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-6">
            <div className="size-12 animate-spin rounded-full border-4 border-accent border-t-accent/55" />
        </div>
    );
   }

   if (!terms) {
    return (
        <div className="mx-auto mas-w-2xl px-4 py-16 text-center">
            <p className="font-serif text-2xl font-bold text-foreground">
                No se pudieron cargar los términos
            </p>
            <Link to="/" className="mt-4 inline-block text-primary hover:underline">
                Volver al inicio
            </Link>
        </div>
    );
   }

   return (
    <main className="mx-auto max-w-3xl px-4 py-12">
        <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-2 bg-primary px-4 py-2 rounded-full text-white text-xs font-black uppercase tracking-[0.14em] mb-4">
                <Icon name="shield" className="size-4" />
                Lee esta información antes de comprar
            </div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-destructive mb-2">
                Bienvenido a MultiHogar Yadita
            </p>
            <h1 className="font-serif text-3xl font-bold sm:text-4xl">
                Primero compra con claridad
            </h1>
        </div>
        <p className="text-sm leading-6 text-foreground/65 mb-8">
            Para evitar problemas o confusiones, lee las condiciones de servicios siguientes
        </p>
        <div className="prose prose-sm prose-foreground max-w-none">
            <Markdown components={{
                h2: ({children}) => (
                    <h2 className="font-black text-lg mb-2 mt-6">
                        {children}
                    </h2>
                ),
                h3: ({children}) => (
                    <h3 className="font-bold text-base mb-1 mt-4">
                        {children}
                    </h3>
                ),
                p: ({children}) => (
                    <p className="text-sm leading-6 text-foreground/60 mb-3">
                        {children}
                    </p>
                ),
                ul: ({children}) => (
                    <ul className="list-disc list-inside space-y-1 text-sm text-foreground/60 mb-3">
                        {children}
                    </ul>
                ),
                ol: ({children}) => (
                    <ol className="list-decimal list-inside space-y-1 text-sm text-foreground/60 mb-3">
                        {children}
                    </ol>
                ),
                li: ({children}) => (
                    <li className="leading-6">
                        {children}
                    </li>
                ),
                strong: ({children}) => (
                    <strong className="font-black">
                        {children}
                    </strong>
                ),
            }}>
                {terms.content}
            </Markdown>
            <div className="mt-16 pt-6 border-t border-foreground/10">
                <button onClick={() => navigate(-1)} className="group flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3.5 text-sm font-black text-white transition hover:bg-primary/90">
                    He leído, continuar a la tienda
                    <Icon name="arrow" className="size-4 transition-transform group-hover:translate-x-1" />
                </button>
            </div>
        </div>
    </main>
   )
}