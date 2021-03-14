import { Popup } from 'semantic-ui-react';

const PopupComponent = ({ content, children }) => {
  return <Popup content={content} inverted trigger={children} />;
};

export default PopupComponent;
