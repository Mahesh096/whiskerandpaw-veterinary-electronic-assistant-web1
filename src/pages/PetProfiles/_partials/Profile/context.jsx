// react libraries
import React, { createContext } from 'react';

// third-party libraries
import PropTypes from 'prop-types';

const PetProfileContext = createContext(undefined);
const PetProfileDispatchContext = createContext(undefined);

const PetProfileStateProvider = ({ children, state, setState }) => {
  return (
    <PetProfileContext.Provider value={state}>
      <PetProfileDispatchContext.Provider value={{ setState }}>
        {children}
      </PetProfileDispatchContext.Provider>
    </PetProfileContext.Provider>
  );
};

PetProfileStateProvider.propTypes = {
  children: PropTypes.element,
  state: PropTypes.object.isRequired,
  setState: PropTypes.func,
};

export {
  PetProfileStateProvider,
  PetProfileContext,
  PetProfileDispatchContext,
};
