import React from 'react';
import _ from 'lodash';
import * as UI from '@chakra-ui/react';

// Not covered: getters & setters, generators, prototypes

const initializeMultiple = () => {
  console.log('initializeMultiple');

  const foo = 1,
    bar = 2,
    baz = 3;

  console.log(foo); // 1;
  console.log(bar); // 2;
  console.log(baz); // 3;
};

const shorthandPropertyNames = () => {
  console.log('shorthandPropertyNames');

  const foo = 1;

  const bar = { foo };
  const baz = { foo: foo };

  const objectsAreEqual = _.isEqual(bar, baz);

  console.log(objectsAreEqual); // true;
};

const computedPropertyNames = () => {
  console.log('computedPropertyNames');

  const foo = { bar: 1 };
  const propertyName = 'bar';
  const baz = { [propertyName]: 1 };

  const objectsAreEqual = _.isEqual(foo, baz);

  console.log(objectsAreEqual); // true;
};

const templateLiterals = () => {
  console.log('templateLiterals');

  const name = 'Brent';
  const greeting = `Hello ${name}!`;

  console.log(greeting); // "Hello Brent!"
};

const tagFunctions = () => {
  console.log('tagFunctions');

  // 'Tag Function'
  const greet = (strings: TemplateStringsArray, name: string) => {
    console.log(strings); // ['Hello ', '!']
    console.log(name); // 'Brent'
  };

  const name = 'Brent';
  // 'Tagged Template'
  // Does not evaluate here like a Template Literal.
  // Instead passes arguments into the Tag Function.
  greet`Hello ${name}!`; // same as greet(['Hello ', '!'], name);
};

const destructuring = () => {
  console.log('destructuring');

  const foo = { a: 1, b: 2, c: 3 };

  const { a, b, c } = foo;

  console.log(a); // 1;
  console.log(b); // 2;
  console.log(c); // 3;
};

const destructuringRest = () => {
  console.log('destructuringRest');

  const foo = { a: 1, b: 2, c: 3 };

  const { a, ...rest } = foo;

  console.log(a); // 1;
  console.log(rest); // { b: 2, c: 3 };
};

const destructuringFunctionParameters = () => {
  console.log('destructuringFunctionParameters');

  const logObjectParams = ({ a, b, c, ...rest }: { [key: string]: any }) => {
    console.log(a); // 1;
    console.log(b); // 2;
    console.log(c); // 3;
    console.log(rest); // [4, 5];
  };

  const foo = { a: 1, b: 2, c: 3, d: 4, e: 5 };
  logObjectParams(foo);
};

const spreadIntoObject = () => {
  console.log('spreadIntoObject');

  const foo = { a: 1, b: 2, c: 3 };

  const bar = { ...foo };

  const objectsAreEqual = _.isEqual(foo, bar);

  console.log(objectsAreEqual); // true;
};

const spreadIntoJSX = () => {
  console.log('spreadIntoJSX');

  const props = { className: 'fancy-div', children: 'Hello world!' };

  const bar = <div {...props} />;

  console.log(bar); // :P
};

const arrowFunctionsAndHoisting = () => {
  console.log('arrowFunctionsAndHoisting');

  console.log(foo()); // "foo" (hoisted)
  // bar(); // ERROR
  // baz(); // ERROR
  // qux(); // ERROR

  function foo() {
    return 'foo';
  }

  const bar = function () {
    return 'bar';
  };

  const baz = () => {
    return 'baz';
  };

  const qux = () => 'qux'; // implicit return

  console.log(foo()); // "foo"
  console.log(bar()); // "bar"
  console.log(baz()); // "baz"
  console.log(qux()); // "qux"
};

const shorthandMethodNames = () => {
  console.log('shorthandMethodNames');

  const foo = {
    bar: () => {
      return 'bar';
    },
    baz() {
      return 'baz';
    },
  };

  console.log(foo.bar()); // "bar";
  console.log(foo.baz()); // "baz";
};

const JavascriptPatternsPage: React.FC = () => {
  return (
    <UI.Box p="4">
      <UI.Heading size="3xl" mb={8}>
        Javascript Patterns
      </UI.Heading>

      <UI.Stack alignItems="start">
        <UI.Button onClick={initializeMultiple}>initializeMultiple</UI.Button>
        <UI.Button onClick={shorthandPropertyNames}>
          shorthandPropertyNames
        </UI.Button>
        <UI.Button onClick={computedPropertyNames}>
          computedPropertyNames
        </UI.Button>
        <UI.Button onClick={templateLiterals}>templateLiterals</UI.Button>
        <UI.Button onClick={tagFunctions}>tagFunctions</UI.Button>
        <UI.Button onClick={destructuring}>destructuring</UI.Button>
        <UI.Button onClick={destructuringFunctionParameters}>
          destructuringFunctionParameters
        </UI.Button>
        <UI.Button onClick={destructuringRest}>destructuringRest</UI.Button>
        <UI.Button onClick={spreadIntoObject}>spreadIntoObject</UI.Button>
        <UI.Button onClick={spreadIntoJSX}>spreadIntoJSX</UI.Button>
        <UI.Button onClick={arrowFunctionsAndHoisting}>
          arrowFunctionsAndHoisting
        </UI.Button>
        <UI.Button onClick={shorthandMethodNames}>
          shorthandMethodNames
        </UI.Button>
      </UI.Stack>
    </UI.Box>
  );
};

export default JavascriptPatternsPage;
