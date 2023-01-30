import states from 'states-us';

export const stateOptions = states.map((state) => ({
  label: state.name,
  value: state.abbreviation,
}));

export const findUsStatesFromSearchtring = (str: string) => {
  if (!str) {
    return stateOptions;
  }

  return stateOptions.filter((state) => {
    return (
      state.label.toLowerCase().indexOf(str.toLowerCase()) >= 0 ||
      state.value.toLowerCase().indexOf(str.toLowerCase()) >= 0
    );
  });
};
