"use client"

import * as React from "react"
import {
    Calculator,
    Calendar,
    CreditCard,
    Settings,
    Smile,
    User,
} from "lucide-react"

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"
import { Button } from "../ui/button"
import { Kbd } from "../ui/kbd"

import registry from "@/data/registry.json"
import Link from "next/link"

export default function SearchCommand() {
    const [open, setOpen] = React.useState(false)

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    return (
        <>
            <Button
                variant={"outline"}
                onClick={() => setOpen((open) => !open)}
                className="group px-2 py-0 sm:px-4 sm:py-2 md:space-x-1.5"
            >
                <div className="hidden items-center px-0 md:flex md:gap-2">
                    <span className="group-hover:text-accent-foreground text-muted-foreground font-normal duration-300">
                        Search documentaion...
                    </span>
                </div>

                <Kbd className="group-hover:text-accent-foreground text-muted-foreground duration-300">
                    ⌘ J
                </Kbd>
            </Button>
            <CommandDialog open={open} onOpenChange={setOpen} className="dark:bg-background">
                <CommandInput placeholder="Search documentation..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Components">
                        {
                            registry.items
                                .sort((a, b) => a.title.localeCompare(b.title))
                                .filter((item) => item.type == "component")
                                .map(item => (
                                    <CommandItem asChild key={item.slug}>
                                        <Link href={item.docs} onClick={() => setOpen(!open)} className="w-full cursor-pointer mb-2.5">
                                            {item.title}
                                        </Link>
                                    </CommandItem>
                                ))
                        }
                    </CommandGroup>
                    <CommandSeparator />
                </CommandList>
            </CommandDialog>
        </>
    )
}
