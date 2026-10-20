import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface RevealProps {
  children: ReactNode
  delay?: number
  className?: string
}

/**
 * Shared scroll-reveal wrapper so every section doesn't repeat the same
 * Framer Motion props.
 *
 * Deliberately does NOT animate opacity. `whileInView` relies on
 * IntersectionObserver, which can skip firing for an element entirely
 * during a fast real-world scroll (more likely with a shrinking negative
 * viewport margin) — when that happens with an opacity animation, the
 * element is stuck invisible/faint forever. Animating only `y` means the
 * worst case if the trigger never fires is a static, fully-opaque,
 * perfectly readable element a few pixels lower than intended — never an
 * unreadable one.
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  return (
    <motion.div
      initial={{ y: 20 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
