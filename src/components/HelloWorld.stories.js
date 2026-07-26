import HelloWorld from './HelloWorld.vue'

export default {
  title: 'Components/HelloWorld',
  component: HelloWorld,
  tags: ['autodocs'],
  argTypes: {
    msg: { control: 'text' },
  },
}

export const Default = {
  args: {
    msg: 'Hello World!',
  },
}
