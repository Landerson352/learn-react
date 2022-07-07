import React from 'react';
import * as UI from '@chakra-ui/react';
import { AxiosError } from 'axios';
import useAxios from 'axios-hooks';
import * as reactHookForm from 'react-hook-form';
import flatMap from 'lodash/flatMap';
import startCase from 'lodash/startCase';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import ParticlesBg from 'particles-bg';
import * as FramerMotion from 'framer-motion';

const MotionUI = {
  Box: FramerMotion.motion(UI.Box),
};

/**
 * Utility for simulating delays in async operations.
 */
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Utility to captialize the first letter of a string, and add a period.
 */
const formatError = (fieldError: reactHookForm.FieldError | undefined) => {
  if (fieldError?.message === undefined) return '';
  return (
    fieldError.message.charAt(0).toUpperCase() +
    fieldError.message.slice(1) +
    '.'
  );
};

interface BreedData {
  message: {
    [x: string]: string[];
  };
}

/**
 * Loads, parses and sorts the breed data.
 */
const useBreeds = (): [string[], boolean, AxiosError | undefined] => {
  const [{ data, loading, error }] = useAxios<BreedData>(
    'https://dog.ceo/api/breeds/list/all'
  );

  if (!data?.message) {
    return [[], loading, error];
  }

  // Unwrap the data into a flat list of strings.
  const breeds: string[] = flatMap(data.message, (names, key) => {
    return names.map((name) => `${name} ${key}`);
  }).sort();

  return [breeds, loading, error];
};

interface PupperFormData {
  name: string;
  breed: string;
  info?: string;
}

const PupperFormSchema = yup.object().shape({
  name: yup
    .string()
    .required('Required')
    .max(20)
    .not(['cujo'], 'Cujo is NOT allowed (Not after last year)'),
  breed: yup.string().required('Required'),
  info: yup.string().max(200),
});

interface PupperFormProps {
  onSubmit?: (data: PupperFormData) => any;
}

const PupperForm: React.FC<PupperFormProps> = ({ onSubmit }) => {
  const [breeds, loading, error] = useBreeds();
  const form = reactHookForm.useForm<PupperFormData>({
    mode: 'onTouched',
    resolver: yupResolver(PupperFormSchema),
  });
  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting, errors },
  } = form;
  const name = watch('name');
  const toast = UI.useToast({
    // Default toast properties
    position: 'top-right',
    isClosable: true,
  });

  const onValid: reactHookForm.SubmitHandler<PupperFormData> = async (data) => {
    await onSubmit?.(data);
    toast({
      title: 'Form submitted',
      description: `Best of luck to ${data.name}!`,
      status: 'success',
    });
  };

  const onInvalid: reactHookForm.SubmitErrorHandler<PupperFormData> = (
    data
  ) => {
    toast({
      title: 'Oops!',
      description: 'Please fix the errors in the form.',
      status: 'error',
    });
  };

  if (loading) {
    return <UI.Spinner />;
  }
  if (error) {
    return <UI.Alert colorScheme="red">Error loading dog breeds.</UI.Alert>;
  }

  return (
    <UI.Box
      bg="white"
      borderRadius={4}
      shadow="xl"
      mb={8}
      p={4}
      maxW="500px"
      mx="auto"
    >
      <UI.Heading size="md" mb={4}>
        "Pup of the Year" submission form
      </UI.Heading>
      <UI.Box mb={2}>
        <form onSubmit={handleSubmit(onValid, onInvalid)}>
          <fieldset disabled={isSubmitting}>
            <UI.FormControl mb={4} isInvalid={!!errors.name}>
              <UI.FormLabel>Dog's name</UI.FormLabel>
              <UI.Input {...register('name')} />
              <UI.FormErrorMessage>
                {formatError(errors.name)}
              </UI.FormErrorMessage>
            </UI.FormControl>

            <UI.FormControl mb={4} isInvalid={!!errors.breed}>
              <UI.FormLabel>Breed</UI.FormLabel>
              <UI.Select placeholder="Select one" {...register('breed')}>
                {breeds.map((breed) => (
                  <option key={breed} value={breed}>
                    {startCase(breed)}
                  </option>
                ))}
              </UI.Select>
              <UI.FormErrorMessage>
                {formatError(errors.breed)}
              </UI.FormErrorMessage>
            </UI.FormControl>

            <UI.FormControl mb={4} isInvalid={!!errors.info}>
              <UI.FormLabel>
                Tell us about {name?.trim() || 'your dog'}
              </UI.FormLabel>
              <UI.Textarea resize="none" {...register('info')} />
              <UI.FormErrorMessage>
                {formatError(errors.info)}
              </UI.FormErrorMessage>
            </UI.FormControl>

            <UI.Button
              disabled={isSubmitting}
              colorScheme="green"
              type="submit"
            >
              Submit
            </UI.Button>
          </fieldset>
        </form>
      </UI.Box>
    </UI.Box>
  );
};

const LincChallenge1Page: React.FC = () => {
  const [formCount, setFormCount] = React.useState(0);
  const [done, setDone] = React.useState(false);

  const handleSubmit = async () => {
    await sleep(2000);
    setDone(true);
    setFormCount(formCount + 1); // remount (and clear) form
  };

  return (
    <React.Fragment>
      <UI.Flex
        position="fixed"
        zIndex={-1}
        top={0}
        left={0}
        right={0}
        bottom={0}
        alignItems="center"
        justifyContent="center"
        bg="gray.800"
        p={4}
      >
        <FramerMotion.AnimatePresence>
          {done ? (
            <ParticlesBg key="particles" type="lines" bg />
          ) : (
            <MotionUI.Box
              key="form"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              width="100%"
            >
              <PupperForm key={formCount} onSubmit={handleSubmit} />
            </MotionUI.Box>
          )}
        </FramerMotion.AnimatePresence>
      </UI.Flex>
    </React.Fragment>
  );
};
export default LincChallenge1Page;
