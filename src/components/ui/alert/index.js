import { cva } from 'class-variance-authority'

export { default as Alert } from './Alert.vue'
export { default as AlertTitle } from './AlertTitle.vue'
export { default as AlertDescription } from './AlertDescription.vue'

export const alertVariants = cva(
  'relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5 rounded-lg border px-4 py-3 text-sm has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3 [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground',
        // The description keeps full-opacity `text-destructive`: shadcn ships it at
        // /90, which lands at 4.22:1 over the dark `--background` and fails WCAG AA
        // (needs 4.5:1). At full opacity it measures 5.0:1 dark / 5.58:1 light.
        destructive:
          'border-destructive/50 bg-background text-destructive dark:border-destructive *:data-[slot=alert-description]:text-destructive',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)
