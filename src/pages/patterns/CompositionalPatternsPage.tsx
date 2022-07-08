import * as UI from '@chakra-ui/react';
import _ from 'lodash';
import React from 'react';

// http://reactjs.org/docs/render-props.html
const CounterComponent: React.FC<{
  count: number;
  setCount: (count: number) => any;
}> = ({ count, setCount }) => {
  return (
    <UI.Box
      borderRadius="8px"
      border="2px solid"
      borderColor="green.200"
      p={4}
      mb={2}
    >
      <UI.Button mb={2} onClick={() => setCount(count + 1)}>
        Click me!
      </UI.Button>
      <UI.Text>The button has been clicked {count} times.</UI.Text>
    </UI.Box>
  );
};
const NestedCompositionExample: React.FC = () => {
  const [count, setCount] = React.useState(0);

  return (
    <UI.Box mb={8}>
      <UI.Heading size="md" mb={4}>
        Nested composition
      </UI.Heading>
      <UI.Text mb={8}>
        In this example, we essentially nest everything. We pass in props that
        the component needs to function, and the component's functionality (and
        potentially any child components) are completely sealed off. It can be
        difficult to understand or change what's going on inside a component
        with this pattern.
      </UI.Text>
      <CounterComponent count={count} setCount={setCount} />
      <CounterComponent count={count} setCount={setCount} />
      <CounterComponent count={count} setCount={setCount} />
    </UI.Box>
  );
};

const Wrapper: React.FC = ({ children }) => {
  return (
    <UI.Box
      borderRadius="8px"
      border="2px solid"
      borderColor="green.200"
      p={4}
      mb={2}
    >
      {children}
    </UI.Box>
  );
};
const ChildrenExample: React.FC = () => {
  const [count, setCount] = React.useState(0);

  return (
    <UI.Box mb={8}>
      <UI.Heading size="md" mb={4}>
        Children pattern
      </UI.Heading>
      <UI.Text mb={8}>
        In this simple pattern, a "wrapper" component is created (eg. for
        styling) so that the context of the component are passed in, rather than
        being assembled inside the component. This pattern keeps all the
        "functionality binding" higher up and helps avoid prop-drilling that
        occurs when you nest components several layers deep.
      </UI.Text>
      <Wrapper>
        <UI.Button mb={2} onClick={() => setCount(count + 1)}>
          Click me!
        </UI.Button>
        <UI.Text>The button has been clicked {count} times.</UI.Text>
      </Wrapper>
      <Wrapper>
        <UI.Button mb={2} onClick={() => setCount(count + 1)}>
          Click me!
        </UI.Button>
        <UI.Text>The button has been clicked {count} times.</UI.Text>
      </Wrapper>
      <Wrapper>
        <UI.Button mb={2} onClick={() => setCount(count + 1)}>
          Click me!
        </UI.Button>
        <UI.Text>The button has been clicked {count} times.</UI.Text>
      </Wrapper>
    </UI.Box>
  );
};

// http://reactjs.org/docs/render-props.html
const Repeat: React.FC<{
  children: (i: number) => React.ReactNode;
  times: number;
}> = ({ children, times }) => {
  return <React.Fragment>{_.times(times, children)}</React.Fragment>;
};
const RenderPropsExample: React.FC = () => {
  const [count, setCount] = React.useState(0);

  return (
    <UI.Box mb={8}>
      <UI.Heading size="md" mb={4}>
        RenderProps pattern
      </UI.Heading>
      <UI.Text mb={8}>
        In this pattern, the "children" property is a function that renders a
        React Node. This pattens enhances component reusability and helps you
        avoid prop-drilling.
      </UI.Text>
      <Repeat times={3}>
        {(i) => {
          return (
            <UI.Box
              key={i}
              borderRadius="8px"
              border="2px solid"
              borderColor="green.200"
              p={4}
              mb={2}
            >
              <UI.Button mb={2} onClick={() => setCount(count + 1)}>
                Click me!
              </UI.Button>
              <UI.Text>The button has been clicked {count} times.</UI.Text>
            </UI.Box>
          );
        }}
      </Repeat>
    </UI.Box>
  );
};

// https://reactjs.org/docs/context.html
interface ExampleContextShape {
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
}
const ExampleContext = React.createContext<ExampleContextShape>(
  {} as ExampleContextShape
);
const ContextExampleConsumer: React.FC = () => {
  const { count, setCount } = React.useContext(ExampleContext);
  return (
    <UI.Box
      borderRadius="8px"
      border="2px solid"
      borderColor="green.200"
      p={4}
      mb={2}
    >
      <UI.Button mb={2} onClick={() => setCount(count + 1)}>
        Click me!
      </UI.Button>
      <UI.Text>The button has been clicked {count} times.</UI.Text>
    </UI.Box>
  );
};
const ContextExample: React.FC = () => {
  const [count, setCount] = React.useState(0);

  return (
    <UI.Box mb={8}>
      <UI.Heading size="md" mb={4}>
        Context Pattern
      </UI.Heading>
      <UI.Text mb={8}>
        In this pattern, we use React Context to provide values to an entire
        branch of the component tree. The consuming components expect the
        Context to be provided, so they don't need props assigned. This pattern
        is especially useful in large applications where you have very deep
        component trees.
      </UI.Text>
      <ExampleContext.Provider value={{ count, setCount }}>
        <ContextExampleConsumer />
        <ContextExampleConsumer />
        <ContextExampleConsumer />
      </ExampleContext.Provider>
    </UI.Box>
  );
};

const CompositionalPatternsPage: React.FC = () => {
  const exampleComponents = [
    NestedCompositionExample,
    ChildrenExample,
    RenderPropsExample,
    ContextExample,
  ];

  return (
    <UI.Box p="4">
      <UI.Heading size="3xl" mb={8}>
        Compositional patterns
      </UI.Heading>
      <UI.Text mb={8}>
        There are many ways to combine React components into an application
        structure. Here we outline some common patterns, and why you might use
        each one.
      </UI.Text>

      <UI.SimpleGrid minChildWidth="400px" spacing={2}>
        {_.map(exampleComponents, (Component) => (
          <UI.Box
            key={Component.name}
            bg="white"
            borderRadius="8px"
            p={6}
            minH="240px"
          >
            <Component />
          </UI.Box>
        ))}
      </UI.SimpleGrid>
    </UI.Box>
  );
};

export default CompositionalPatternsPage;
