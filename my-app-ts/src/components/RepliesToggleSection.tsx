import React, { useState } from 'react';
import { Box, Typography, Button, List, ListItem, ListItemText,Avatar } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';


interface RepliesToggleSectionProps {
  replies: any[];
}

const RepliesToggleSection: React.FC<RepliesToggleSectionProps> = ({ replies }) => {
  const [showReplies, setShowReplies] = useState<boolean>(false);

  return (
    <Box>
       {/* 返信を表示ボタン */}
       <Button
        onClick={() => setShowReplies(!showReplies)}
        sx={{
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        startIcon={showReplies ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
      >
        {showReplies ? '非表示' : `返信 (${replies.length})`}
      </Button>

      {/* リプライ表示 */}
      {showReplies && (
        <Box>
          {replies.length > 0 ? (
            <List>
              {replies.map((reply, index) => (
                <ListItem key={index} alignItems="flex-start">
                  {/* アバター画像 */}
                  <Avatar
                    src={reply.userAvatar || '/images/default-avatar.png'}
                    alt="Reply User Avatar"
                    sx={{ width: 40, height: 40, mr: 2 }}
                  />
                  <ListItemText
                    primary={reply.author || '匿名ユーザー'}
                    secondary={reply.content}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="textSecondary">
              リプライはありません
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default RepliesToggleSection;
