import SnippetRenderer from "@src/components/react/snippet-renderer.svelte";
import { useEffect, useRef } from "react";
import { mount, unmount, type Snippet } from "svelte";

interface SvelteSnippetProps<T> {
    snippet: () => Snippet<[T]>;
    param: () => T;
}

export function SvelteSnippet<T>({ snippet, param }: SvelteSnippetProps<T>) {
    const containerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!containerRef.current) {
            return () => { }
        }

        const sv = mount(SnippetRenderer, {
            target: containerRef.current,
            props: {
                get param() {
                    return param() as any;
                },
                get snippet() {
                    return snippet() as any;
                },
            }
        });

        return () => unmount(sv)
    }, [containerRef]);

    return (
        <div ref={containerRef}>

        </div>
    )
}