import { zodResolver } from '@hookform/resolvers/zod';
import _ from 'lodash';
import React from 'react';
import { z } from 'zod';

import { findUsStatesFromSearchtring } from '../../helpers/usStates';
import * as UI from './components/UI';

const personSchema = z.object({
  firstName: z.string().min(2),
  phone: z.string().min(10),
  email: z.string().email(),
  profilePhoto: z.string(),
  bio: z.string().min(1),
  color: z.string(),
  pet: z.string(),
  state: z.object(
    {
      value: z.string(),
      label: z.string(),
    },
    { invalid_type_error: 'Required' }
  ),
  percent: z.number(),
  price: z.number(),
  isActive: z.boolean(),
  isActive2: z.boolean(),
  agreedToTerms: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to the terms & conditions' }),
  }),
  agreedToTerms2: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to the terms & conditions' }),
  }),
  deadline: z.date(),
  eventDates: z.array(z.date()).length(2, 'A start and end date are required'),
});

type Person = z.infer<typeof personSchema>;

const ComponentExample: React.FC<
  React.PropsWithChildren<
    { title: string; description?: string } & UI.SimpleGridProps
  >
> = ({ children, title, description, ...restProps }) => {
  return (
    <UI.SimpleGrid columns={2} {...restProps}>
      <UI.VStack alignItems="start" p={4}>
        <UI.Heading size="md">{title}</UI.Heading>
        {description && <UI.Text>{description}</UI.Text>}
      </UI.VStack>
      <UI.VStack
        p={4}
        border="2px solid"
        borderColor="purple.500"
        borderRadius="md"
      >
        {children}
      </UI.VStack>
    </UI.SimpleGrid>
  );
};

const componentExamples = [
  {
    title: 'Checkbox',
    description:
      'Ideal for aggreeing or approving of things. Shown with minimum and extra props.',
    render: () => (
      <React.Fragment>
        <UI.FormField name="agreedToTerms" type="checkbox" />
        <UI.FormField
          name="agreedToTerms2"
          type="checkbox"
          label="Terms & conditions"
          input={{
            label: 'I have read and agree to the terms & conditions',
          }}
          requiredStyling
          span="sm"
        />
      </React.Fragment>
    ),
  },

  {
    title: 'Combobox',
    description:
      'Ideal for choosing from a long list of options (sync), or a list of dynamic options (async). Shown with minimum and extra props.',
    render: () => (
      <React.Fragment>
        <UI.FormField
          name="state"
          type="combobox"
          input={{
            loadOptions: (inputValue, callback) => {
              callback(findUsStatesFromSearchtring(inputValue));
            },
          }}
        />
        <UI.FormField
          name="state"
          type="combobox"
          label="State"
          input={{
            loadOptions: (inputValue, callback) => {
              callback(findUsStatesFromSearchtring(inputValue));
            },
            placeholder: 'Choose a state',
          }}
          requiredStyling
          span="sm"
        />
      </React.Fragment>
    ),
  },

  {
    title: 'Date',
    description: 'Shown with minimum and extra props.',
    render: () => (
      <React.Fragment>
        <UI.FormField name="deadline" type="date" />
        <UI.FormField
          name="deadline"
          type="date"
          label="Deadline"
          input={{ minDate: new Date() }}
          requiredStyling
          span="sm"
        />
      </React.Fragment>
    ),
  },

  {
    title: 'Daterange',
    description: 'Shown with minimum and extra props.',
    render: () => (
      <React.Fragment>
        <UI.FormField name="eventDates" type="daterange" />
        <UI.FormField
          name="eventDates"
          type="daterange"
          label="Event start & end"
          input={{ minDate: new Date() }}
          requiredStyling
          span="sm"
        />
      </React.Fragment>
    ),
  },

  {
    title: 'Email',
    description: 'Shown with minimum and extra props.',
    render: () => (
      <React.Fragment>
        <UI.FormField name="email" type="email" />
        <UI.FormField
          name="email"
          type="email"
          label="Email"
          input={{ placeholder: 'eg. demo@example.com' }}
          requiredStyling
          span="sm"
        />
      </React.Fragment>
    ),
  },

  {
    title: 'Money',
    description:
      'Supports decimal-first input with auto-formatting. Shown with minimum and extra props.',
    render: () => (
      <React.Fragment>
        <UI.FormField name="price" type="money" />
        <UI.FormField
          name="price"
          type="money"
          input={{ placeholder: 'eg. $1.23' }}
          requiredStyling
          span="sm"
        />
      </React.Fragment>
    ),
  },

  {
    title: 'Number',
    description:
      'Only allows numeric input, and includes additional formatting. Shown with minimum and extra props.',
    render: () => (
      <React.Fragment>
        <UI.FormField name="percent" type="number" />
        <UI.FormField
          name="percent"
          type="number"
          label="Percent"
          input={{ suffix: '%', placeholder: 'eg. 50%' }}
          requiredStyling
          span="sm"
        />
      </React.Fragment>
    ),
  },

  {
    title: 'Password',
    description: 'Obscures the input. Shown with minimum and extra props.',
    render: () => (
      <React.Fragment>
        <UI.FormField name="password" type="password" />
        <UI.FormField
          name="password"
          type="password"
          label="Password"
          input={{ placeholder: 'eg. monkey123' }}
          requiredStyling
          span="sm"
        />
      </React.Fragment>
    ),
  },

  {
    title: 'Phone',
    description:
      'Applies masking in the UI. Requires 10 digits. Shown with minimum and extra props.',
    render: () => (
      <React.Fragment>
        <UI.FormField name="phone" type="phone" />
        <UI.FormField
          name="phone"
          type="phone"
          label="Phone"
          input={{ placeholder: 'eg. (555) 555-5555' }}
          requiredStyling
          span="sm"
        />
      </React.Fragment>
    ),
  },

  {
    title: 'Photo',
    description:
      "Accesses the device's camera and populates the field value with a data URL. Shown with minimum and extra props.",
    render: () => (
      <React.Fragment>
        <UI.FormField name="profilePhoto" type="photo" />
        <UI.FormField
          name="profilePhoto"
          type="photo"
          label="Profile photo"
          input={{ cameraProps: { idealFacingMode: 'environment' } }}
          requiredStyling
          span="sm"
        />
      </React.Fragment>
    ),
  },

  {
    title: 'Radio',
    description:
      'Ideal for displaying a list of 4 or less preset options. Shown with minimum and extra props.',
    render: () => (
      <React.Fragment>
        <UI.FormField
          name="pet"
          type="radio"
          input={{
            options: [
              { label: 'Cat', value: 'cat' },
              { label: 'Dog', value: 'dog' },
              { label: 'Iguana', value: 'iguana' },
            ],
          }}
        />
        <UI.FormField
          name="pet"
          label="Pet"
          type="radio"
          input={{
            options: [
              { label: 'Cat', value: 'cat' },
              { label: 'Dog', value: 'dog' },
              { label: 'Iguana', value: 'iguana' },
            ],
            direction: 'horizontal',
          }}
          requiredStyling
          span="sm"
        />
      </React.Fragment>
    ),
  },

  {
    title: 'Select',
    description:
      'Ideal for displaying a list of 5 or more preset options. Shown with minimum and extra props.',
    render: () => (
      <React.Fragment>
        <UI.FormField
          name="color"
          type="select"
          input={{
            options: [
              { label: 'Red', value: 'red' },
              { label: 'Green', value: 'green' },
              { label: 'Blue', value: 'blue' },
              { label: 'Yellow', value: 'yellow' },
            ],
          }}
        />
        <UI.FormField
          name="color"
          label="Color"
          type="select"
          input={{
            options: [
              { label: 'Red', value: 'red' },
              { label: 'Green', value: 'green' },
              { label: 'Blue', value: 'blue' },
              { label: 'Yellow', value: 'yellow' },
            ],
            placeholder: 'Choose a color',
          }}
          requiredStyling
          span="sm"
        />
      </React.Fragment>
    ),
  },

  {
    title: 'Switch',
    description:
      'Ideal for turning things on and off. Shown with minimum and extra props.',
    render: () => (
      <React.Fragment>
        <UI.FormField name="isActive" type="switch" />
        <UI.FormField
          name="isActive2"
          type="switch"
          label="Notification settings"
          input={{ label: 'Notify me of changes via email' }}
          requiredStyling
          span="sm"
        />
      </React.Fragment>
    ),
  },

  {
    title: 'Text',
    description: 'The default type. Shown with minimum and extra props.',
    render: () => (
      <React.Fragment>
        <UI.FormField name="firstName" />
        <UI.FormField
          name="firstName"
          type="text"
          label="First name"
          input={{ placeholder: 'eg. John Doe' }}
          requiredStyling
          span="sm"
        />
      </React.Fragment>
    ),
  },

  {
    title: 'Textarea',
    description: 'Multiline text. Shown with minimum and extra props.',
    render: () => (
      <React.Fragment>
        <UI.FormField name="bio" type="textarea" />
        <UI.FormField
          name="bio"
          type="textarea"
          label="Bio"
          input={{ placeholder: 'I was born in a small midwest town.' }}
          requiredStyling
          span="lg"
        />
      </React.Fragment>
    ),
  },
];

const FormDocsPage: React.FC = () => {
  const form = UI.useHookForm<Person>({
    resolver: zodResolver(personSchema),
    defaultValues: {
      // example of default value for autocomplete
      // state: { value: 'FL', label: 'Florida' },
    },
    onValid: (data) => {
      console.log('onValid', data);
      // This function can be async, and can throw errors to users.
    },
  });

  return (
    <UI.Box bg="white">
      <UI.Form form={form}>
        <UI.HStack alignItems="start">
          <UI.List
            position="sticky"
            top={0}
            bg="white"
            p={8}
            w="150px"
            flex="0 0"
          >
            {componentExamples.map(({ title }, i) => {
              return (
                <UI.ListItem key={i}>
                  <UI.Link href={`#${_.kebabCase(title)}`}>{title}</UI.Link>
                </UI.ListItem>
              );
            })}
          </UI.List>
          <UI.VStack spacing={0} alignItems="stretch">
            {componentExamples.map(({ title, description, render }, i) => (
              <ComponentExample
                key={title}
                as="section"
                p={4}
                id={_.kebabCase(title)}
                title={title}
                description={description}
              >
                {render()}
              </ComponentExample>
            ))}
          </UI.VStack>
        </UI.HStack>
      </UI.Form>
    </UI.Box>
  );
};

export default FormDocsPage;
