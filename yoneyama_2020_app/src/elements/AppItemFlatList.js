import React from 'react';

const appItemFlatList = (Comp) => ({children, ...props}) => (
  <Comp {...props}>{children}</Comp>
);

export default appItemFlatList;
