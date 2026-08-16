import { expect, userEvent } from 'storybook/test'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '.'

const faqItems = [
  {
    value: 'item-1',
    question: '¿Necesito una cuenta para comentar en la comunidad?',
    answer:
      'Puedes navegar y leer sin cuenta. Para votar, comentar o publicar hilos necesitas iniciar sesión.',
  },
  {
    value: 'item-2',
    question: '¿Cómo se sincroniza mi progreso entre dispositivos?',
    answer:
      'Tu progreso de reproducción y lectura se guarda en la nube automáticamente y está disponible en cualquier dispositivo donde inicies sesión con tu cuenta.',
  },
  {
    value: 'item-3',
    question: 'Cancelar notificaciones por episodio (solo plan Pro)',
    answer: 'Esta opción está disponible únicamente para cuentas con plan Pro activo.',
    disabled: true,
  },
  {
    value: 'item-4',
    question: '¿Qué diferencia hay entre voto positivo y guardar en favoritos?',
    answer:
      'El voto positivo ayuda a posicionar el hilo dentro de la comunidad; guardar en favoritos solo lo agrega a tu lista personal.',
  },
]

export default {
  title: 'UI/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Contenedor colapsable basado en el Accordion de shadcn-vue (Reka UI). Cada `AccordionItem` agrega un divisor inferior que se omite en el último ítem, y su `AccordionTrigger` cambia el ícono chevron al expandirse. Soporta selección única (`type="single"`) o múltiple (`type="multiple"`) y estado `disabled` por ítem.',
      },
    },
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['single', 'multiple'],
      description:
        'Selección única (un ítem abierto a la vez) o múltiple (varios ítems abiertos a la vez).',
    },
    collapsible: {
      control: 'boolean',
      description:
        'Solo aplica con `type="single"`: permite cerrar el ítem abierto volviendo a hacer clic en su trigger.',
    },
  },
  args: {
    type: 'single',
    collapsible: true,
  },
}

const renderFaq = (args, extra = {}) => ({
  components: { Accordion, AccordionItem, AccordionTrigger, AccordionContent },
  setup: () => ({ merged: { ...args, ...extra }, faqItems }),
  template: `
    <Accordion v-bind="merged" class="w-full max-w-xl">
      <AccordionItem v-for="item in faqItems" :key="item.value" :value="item.value" :disabled="item.disabled">
        <AccordionTrigger>{{ item.question }}</AccordionTrigger>
        <AccordionContent>{{ item.answer }}</AccordionContent>
      </AccordionItem>
    </Accordion>
  `,
})

export const Default = {
  render: (args) => renderFaq(args),
}

export const WithMultipleOpen = {
  args: {
    type: 'multiple',
  },
  render: (args) => renderFaq(args, { defaultValue: ['item-1', 'item-2'] }),
}

export const LightAndDark = {
  parameters: { controls: { disable: true } },
  render: (args) => {
    const accordionMarkup = `
      <Accordion v-bind="args" class="w-full">
        <AccordionItem v-for="item in faqItems" :key="item.value" :value="item.value" :disabled="item.disabled">
          <AccordionTrigger>{{ item.question }}</AccordionTrigger>
          <AccordionContent>{{ item.answer }}</AccordionContent>
        </AccordionItem>
      </Accordion>
    `
    return {
      components: { Accordion, AccordionItem, AccordionTrigger, AccordionContent },
      setup: () => ({ args, faqItems }),
      template: `
        <div class="flex gap-6">
          <div class="bg-background text-foreground flex-1 rounded-lg p-6">${accordionMarkup}</div>
          <div class="dark bg-background text-foreground flex-1 rounded-lg p-6">${accordionMarkup}</div>
        </div>
      `,
    }
  },
}

export const Interactive = {
  render: (args) => renderFaq(args),
  play: async ({ canvas }) => {
    const closedTrigger = canvas.getByRole('button', { name: /¿Necesito una cuenta/i })
    const closedAnswer =
      'Puedes navegar y leer sin cuenta. Para votar, comentar o publicar hilos necesitas iniciar sesión.'

    expect(closedTrigger).toHaveAttribute('aria-expanded', 'false')
    expect(canvas.queryByText(closedAnswer)).not.toBeInTheDocument()

    await userEvent.click(closedTrigger)
    expect(closedTrigger).toHaveAttribute('aria-expanded', 'true')
    expect(canvas.getByText(closedAnswer)).toBeVisible()

    await userEvent.click(closedTrigger)
    expect(closedTrigger).toHaveAttribute('aria-expanded', 'false')

    const disabledTrigger = canvas.getByRole('button', { name: /Cancelar notificaciones/i })
    expect(disabledTrigger).toBeDisabled()
    expect(disabledTrigger).toHaveAttribute('aria-expanded', 'false')
  },
}
