import React from 'react';
import NewLinkingCard from './items/NewLinkingCard';
import UpdateLinkingCard from './items/UpdateLinkingCard';

const LinkingCard = ({route}) => {
  const {key} = route.params;
  const renderContent = () => {
    switch (key) {
      case 'NEWLINKING':
        return <NewLinkingCard />;
      case 'UPDATELINKING':
        return <UpdateLinkingCard />;
      default:
        break;
    }
  };
  return renderContent();
};

export default LinkingCard;
