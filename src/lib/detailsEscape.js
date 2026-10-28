export const closeDisclosureOnEscape = (event) => {
  if (event.key === 'Escape' && event.currentTarget.open) {
    event.preventDefault();
    event.currentTarget.open = false;
  }
};
