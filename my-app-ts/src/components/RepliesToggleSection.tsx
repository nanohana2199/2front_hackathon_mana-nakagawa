import React, { useState } from 'react';
import { Box, Typography, Button, List, ListItem, ListItemText } from '@mui/material';

interface RepliesToggleSectionProps {
  replies: any[];
}

const RepliesToggleSection: React.FC<RepliesToggleSectionProps> = ({ replies }) => {
  const [showReplies, setShowReplies] = useState<boolean>(false);

  return (
    <Box>
      {/* 返信を表示ボタン */}
      <Button onClick={() => setShowReplies(!showReplies)} sx={{ mb: 2 }}>
        {showReplies ? '他の返信を非表示' : '他の返信を表示'}
      </Button>

      {/* リプライ表示 */}
      {showReplies && (
        <Box>
          {replies.length > 0 ? (
            <List>
              {replies.map((reply, index) => (
                <ListItem key={index} alignItems="flex-start">
                  <ListItemText
                    primary={reply.content}
                    secondary={reply.userName || '匿名ユーザー'}
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
