import { forwardRef, useRef } from "react";
import { useDefaultProps } from "../../modules/use_default_props";

interface SearchInputProps {
  onSearch: (value: string) => void;
  placeholder?: string;
  throttleMs?: number;
}

const defaultProps: Partial<SearchInputProps> = {
  throttleMs: 200,
};

export const R_SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (requiredProps, ref) => {
    const props = useDefaultProps(requiredProps, defaultProps);
    const inputTimeout = useRef(0);

    function onInput(value: string) {
      clearTimeout(inputTimeout.current);
      inputTimeout.current = setTimeout(() => {
        props.onSearch(value);
      }, 200);
    }

    return (
      <input
        ref={ref}
        type="search"
        onChange={(event) => onInput(event.target.value)}
        placeholder={props.placeholder}
      />
    );
  },
);
