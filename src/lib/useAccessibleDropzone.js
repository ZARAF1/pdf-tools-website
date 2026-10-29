import { useDropzone } from 'react-dropzone';

const useAccessibleDropzone = (options) => {
  const dropzone = useDropzone(options);

  return {
    ...dropzone,
    getRootProps: (props = {}) => {
      const role = props.role || 'button';
      return dropzone.getRootProps({
        ...props,
        role,
        tabIndex: props.tabIndex ?? (role === 'button' ? 0 : -1)
      });
    },
    getInputProps: (props = {}) => dropzone.getInputProps({
      ...props,
      'aria-hidden': true
    })
  };
};

export default useAccessibleDropzone;
