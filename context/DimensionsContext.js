// context/DimensionsContext.js
import React, { createContext, useContext } from 'react';
import { useWindowDimensions } from 'react-native';

const DimensionsContext = createContext(null);

export const useResponsiveDimensions = () => {
  const context = useContext(DimensionsContext);
  if (!context) {
    throw new Error('useResponsiveDimensions must be used within a DimensionsProvider');
  }
  return context;
};

export const DimensionsProvider = ({ children }) => {
  const { width, height } = useWindowDimensions();

  const isLowerHeight = height > 800;
  const isLargerHeight = height > 850;
  const isLowerWidth = width > 600;
  const isLargerWidth = width > 760;

  const bottomPosition = isLargerHeight ? '4%' : isLowerHeight ? '2%' : '1%';
  const responsiveWidth = isLargerWidth ? '96%' : isLowerWidth ? '80%' : 350;
  const paddingAmount = isLargerHeight ? 24 : 14;

  const responsiveValues = {
    width,
    height,
    isLowerHeight,
    isLargerHeight,
    isLowerWidth,
    isLargerWidth,
    bottomPosition,
    responsiveWidth,
    paddingAmount,
  };

  return (
    <DimensionsContext.Provider value={responsiveValues}>
      {children}
    </DimensionsContext.Provider>
  );
};
