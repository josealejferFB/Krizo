import React, { useState } from 'react';
import { useWindowDimensions } from 'react-native'

const Dimentions = () => {

  const { width, height } = useWindowDimensions();
  const isLowerHeight = height > 800;
  const isLargerHeight = height > 850;
  const isLowerWidth = width > 600;
  const isLargerWidth = width > 760;
  const bottomPosition = isLargerHeight ? '4%' : isLowerHeight ? '2%' : '1%'; // Más arriba en pantallas grandes, más abajo en pequeñas
  const responsiveWidth = isLargerWidth ? '96%' : isLowerWidth ? '80%' : 350;
  const paddingAmount = isLargerHeight ? 24 : 14;

}
export default Dimentions; // Don't forget to export your component
