import { Link, useNavigate } from "react-router-dom";
import { Icon } from "../../components/Icon";
import Markdown from "react-markdown";
import { useEffect, useState } from "react";
import { aboutUsApi } from "../../services/aboutUsAPi";
import { LoadingBody } from "../../components/ui/LoadingBody";
import type { ReactNode } from "react";
import { placeholderFallback } from "../../lib/imagePlaceholder";

export function AboutUs() {
	const navigate = useNavigate();
	const [imageUrl, setImageUrl] = useState("");
	const [loading, setLoading] = useState(true);
	const [content, setContent] = useState("");
    type MDProps = { children?: ReactNode}
    type LinkProps = { href?: string, children?: ReactNode }
    type ImgProps = { src?: string, alt?: string, title?: string}

	useEffect(() => {
		async function load() {
			try {
				const data = await aboutUsApi.getAboutUs();
				setContent(data?.content || "");
				setImageUrl(data?.imageUrl || placeholderFallback);
			} catch (e) {
				console.error(`Error:`, e);
			} finally {
				setLoading(false);
			}
		}
		load();
	}, []);

	const markdownComponents = {
		h2: ({ children }: MDProps) => (
			<h2 className="font-black text-2xl mb-4 mt-10 pb-3 border-b-2 border-primary/20 flex items-center gap-3">
				<span className="w-2 h-2 rounded-full bg-primary" />
				{children}
			</h2>
		),

		h3: ({ children }: MDProps) => (
			<h3 className="font-bold text-lg mb-3 mt-8 text-primary/90 flex items-center gap-2">
				<Icon name="arrow" className="size-4 rotate-45" />
				{children}
			</h3>
		),

		p: ({ children }: MDProps) => (
			<p className="text-base leading-8 text-foreground/75 mb-5">{children}</p>
		),

		ul: ({ children }: MDProps) => <ul className="space-y-3 my-6 pl-2">{children}</ul>,

		li: ({ children }: MDProps) => (
			<li className="flex items-start gap-3 leading-7 pl-1 group">
				<span className="shrink-0 w-1.5 h-1.5 rounded-full bg-primary/30 mt-3 group-hover:bg-primary group-hover:scale-125 transition-all" />
				<span className="text-foreground/75 group-hover:text-foreground transition-colors">
					{children}
				</span>
			</li>
		),

		ol: ({ children }: MDProps) => <ol className="space-y-4 my-6 pl-2">{children}</ol>,

		blockquote: ({ children }: MDProps) => (
			<blockquote className="relative pl-6 py-4 my-6 bg-linear-to-r from-primary/5 to-accent/5 rounded-r-2xl border-l-4 border-primary">
				<p className="italic text-foreground/80 leading-7">{children}</p>
				<div className="absolute top-2 left-2 text-primary/20 text-4xl font-serif">
					"
				</div>
			</blockquote>
		),

		code: ({ children }: MDProps) => (
			<code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-primary/90">
				{children}
			</code>
		),

		a: ({ href, children }: LinkProps) => (
			<a
				href={href || "#"}
				target="_blank"
				rel="noopener noreferrer"
				className="text-primary underline underline-offset-2 hover:text-primary/70 transition-colors font-medium"
			>
				{children}
			</a>
		),

		img: ({ src, alt, title }: ImgProps) => (
			<div className="my-8 rounded-2xl overflow-hidden shadow-lg">
				<img
					src={src}
					alt={alt || placeholderFallback}
					title={title}
					className="w-full h-auto object-cover transition-transform duration-300 hover:scale-[1.01]"
				/>
				{title && (
					<p className="text-center text-xs text-foreground/50 mt-2 italic">
						{title}
					</p>
				)}
			</div>
		),
		hr: () => (
			<div className="my-12 flex items-center gap-4">
				<div className="flex-1 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />
				<span className="px-4 text-primary/40 text-xs font-black uppercase tracking-wider">
					• • •
				</span>
				<div className="flex-1 h-px bg-linear-to-r from-primary/30 via-transparent to-transparent" />
			</div>
		),

		strong: ({ children }: MDProps) => (
			<strong className="font-black text-foreground">{children}</strong>
		),

		em: ({ children }: MDProps) => {
            return (
			    <em className="italic text-foreground/80">{children}</em>
            )
		}
	}

	if (loading) {
		return <LoadingBody />;
	}

	return (
		<main className="min-h-screen bg-background">
			<section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-linear-to-b from-accent/10 to-transparent">
				{imageUrl && (
					<div
						className="absolute inset-0 bg-cover bg-center opacity-65"
						style={{ backgroundImage: `url(${imageUrl})` }}
					/>
				)}
				<div className="relative z-10 mx-auto max-w-4xl px-4 py-20 text-center">
					<div className="inline-flex items-center gap-2 bg-primary px-4 py-2 rounded-full text-white text-xs font-black uppercase tracking-[0.14em] mb-5">
						<Icon name="home" className="size-4" />
						MultiHogar Yadita
					</div>
					<h1 className="font-serif text-4xl font-bold leading-[1.05] tracking-[-0.03em] sm:text-5xl lg:text-6xl">
						Hacemos que tu hogar sea{" "}
						<span className="italic text-primary">realmente tuyo</span>
					</h1>
				</div>
			</section>

			<section className="mx-auto max-w-3xl px-4 py-12">
				<div className="prose prose-sm prose-foreground max-w-none">
					<Markdown components={markdownComponents}>{content || "Sin contenido disponible"}</Markdown>
				</div>
			</section>

            <div className="flex items-center justify-center mb-15">
                <button
                    className="group flex items-center justify-center gap-2 rounded-full bg-primary px-20 py-3.5 text-sm font-black text-white transition hover:bg-primary/90"
                    onClick={() => navigate("/")}
                >

                    Explorar la tienda
                    <Icon name="home" className="size-5 transition-transform group-hover:-translate-y-1" />
                </button>
            </div>
		</main>
	);
}
