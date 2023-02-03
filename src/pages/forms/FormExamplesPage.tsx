import { zodResolver } from '@hookform/resolvers/zod';
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
  agreedToTerms: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to the terms & conditions' }),
  }),
  deadline: z.date(),
  eventDates: z.array(z.date()).length(2, 'A start and end date are required'),
});

type Person = z.infer<typeof personSchema>;

const FormExamplesPage: React.FC = () => {
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
    <UI.Box bg="white" p={4}>
      <UI.Form form={form}>
        <UI.FormGrid maxW="520px">
          <UI.FormField name="firstName" requiredStyling />
          <UI.FormField name="phone" type="phone" requiredStyling />
          <UI.FormField name="email" type="email" requiredStyling />
          <UI.FormField
            name="profilePhoto"
            label="Passport photo"
            type="photo"
            // input={{ cameraProps: { idealFacingMode: 'environment' } }}
            requiredStyling
          />
          <UI.FormField name="bio" type="textarea" requiredStyling span="lg" />
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
            name="pet"
            type="radio"
            input={{
              direction: 'horizontal',
              options: [
                { label: 'Cat', value: 'cat' },
                { label: 'Dog', value: 'dog' },
                { label: 'Iguana', value: 'iguana' },
              ],
            }}
          />
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
            name="percent"
            type="number"
            input={{ suffix: '%' }}
            requiredStyling
            span="sm"
          />
          <UI.FormField name="price" type="money" requiredStyling span="sm" />
          <UI.FormField
            name="isActive"
            label="Notification setting"
            type="switch"
            input={{
              label: 'Notify me of changes',
            }}
          />
          <UI.FormField
            name="agreedToTerms"
            label="Agreement"
            type="checkbox"
            input={{ label: 'I agree to the terms & conditions' }}
          />
          <UI.FormField
            name="deadline"
            label="Deadline"
            type="date"
            requiredStyling
            span="sm"
          />
          <UI.FormField
            name="eventDates"
            label="Event start & end"
            type="daterange"
            requiredStyling
          />
          <UI.FormErrorMessage>{form.formState.error}</UI.FormErrorMessage>
          <UI.FormButtonStack>
            <UI.SubmitButton>Save</UI.SubmitButton>
          </UI.FormButtonStack>
        </UI.FormGrid>
      </UI.Form>
    </UI.Box>
  );
};

export default FormExamplesPage;
