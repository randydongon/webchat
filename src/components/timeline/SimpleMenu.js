import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Picker from 'emoji-picker-react';
export default function SimpleMenu({ anchorEl, setAnchorEl, setInput, input }) {

  const handleClose = () => {
    setAnchorEl(null);
  };
  const onEmojiClick = (event, emojiObject) => {

    setInput(input += ' ' + emojiObject.emoji);
    //setActive(false)
    setAnchorEl(null)
  };

  return (
    <div>

      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem >
          <Picker onEmojiClick={onEmojiClick} />
        </MenuItem>

      </Menu>
    </div>
  );
}