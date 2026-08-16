import { CircleAlert, CircleCheckBig, PartyPopper } from '@lucide/vue'
import { Alert, AlertDescription, AlertTitle } from '.'

const variants = ['default', 'destructive']

export default {
  title: 'UI/Alert',
  component: Alert,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Callout basado en el Alert de shadcn-vue. Compone `Alert` + `AlertTitle` + `AlertDescription` (opcional). El ícono es opcional: si está presente, `AlertTitle`/`AlertDescription` se indentan automáticamente. Soporta variantes `default` y `destructive`.',
      },
    },
  },
  argTypes: {
    variant: { control: 'select', options: variants },
  },
  args: {
    variant: 'default',
  },
}

export const Default = {
  render: (args) => ({
    components: { Alert, AlertTitle, AlertDescription, CircleCheckBig },
    setup: () => ({ args }),
    template: `
      <Alert v-bind="args" class="max-w-xl">
        <CircleCheckBig />
        <AlertTitle>¡Cambios guardados!</AlertTitle>
        <AlertDescription>Esta es una alerta con ícono, título y descripción.</AlertDescription>
      </Alert>
    `,
  }),
}

export const WithTitleOnly = {
  render: (args) => ({
    components: { Alert, AlertTitle, PartyPopper },
    setup: () => ({ args }),
    template: `
      <Alert v-bind="args" class="max-w-xl">
        <PartyPopper />
        <AlertTitle>Esta alerta solo tiene ícono y título, sin descripción.</AlertTitle>
      </Alert>
    `,
  }),
}

export const WithoutIcon = {
  render: (args) => ({
    components: { Alert, AlertTitle, AlertDescription },
    setup: () => ({ args }),
    template: `
      <Alert v-bind="args" class="max-w-xl">
        <AlertTitle>Sin ícono</AlertTitle>
        <AlertDescription>Sin ícono, el título y la descripción no se indentan.</AlertDescription>
      </Alert>
    `,
  }),
}

export const Destructive = {
  args: { variant: 'destructive' },
  render: (args) => ({
    components: { Alert, AlertTitle, AlertDescription, CircleAlert },
    setup: () => ({ args }),
    template: `
      <Alert v-bind="args" class="max-w-xl">
        <CircleAlert />
        <AlertTitle>No se pudo procesar tu pago.</AlertTitle>
        <AlertDescription>
          <p>Verifica tu información de facturación e intenta nuevamente.</p>
          <ul class="mt-2 list-inside list-disc space-y-1">
            <li>Revisa los datos de tu tarjeta</li>
            <li>Verifica que tengas fondos suficientes</li>
            <li>Confirma tu dirección de facturación</li>
          </ul>
        </AlertDescription>
      </Alert>
    `,
  }),
}

export const AllVariants = {
  parameters: { controls: { disable: true } },
  render: () => ({
    components: { Alert, AlertTitle, AlertDescription, CircleCheckBig, CircleAlert },
    setup: () => ({ variants }),
    template: `
      <div class="flex max-w-xl flex-col gap-4">
        <Alert v-for="v in variants" :key="v" :variant="v">
          <CircleCheckBig v-if="v === 'default'" />
          <CircleAlert v-else />
          <AlertTitle>Variante: {{ v }}</AlertTitle>
          <AlertDescription>Así se ve la alerta con la variante "{{ v }}".</AlertDescription>
        </Alert>
      </div>
    `,
  }),
}

export const LightAndDark = {
  parameters: { controls: { disable: true } },
  render: () => {
    const alertMarkup = `
      <div class="flex flex-col gap-4">
        <Alert>
          <CircleCheckBig />
          <AlertTitle>¡Cambios guardados!</AlertTitle>
          <AlertDescription>Esta es una alerta con ícono, título y descripción.</AlertDescription>
        </Alert>
        <Alert variant="destructive">
          <CircleAlert />
          <AlertTitle>No se pudo procesar tu pago.</AlertTitle>
          <AlertDescription>Verifica tu información de facturación e intenta nuevamente.</AlertDescription>
        </Alert>
      </div>
    `
    return {
      components: { Alert, AlertTitle, AlertDescription, CircleCheckBig, CircleAlert },
      template: `
        <div class="flex gap-6">
          <div class="bg-background text-foreground flex-1 rounded-lg p-6">${alertMarkup}</div>
          <div class="dark bg-background text-foreground flex-1 rounded-lg p-6">${alertMarkup}</div>
        </div>
      `,
    }
  },
}
