import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, CircularProgress } from '@mui/material';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface UserBioModalProps {
  userId: string;
  open: boolean;
  onClose: () => void;
}

const UserBioModal: React.FC<UserBioModalProps> = ({ userId, open, onClose }) => {
  const [bio, setBio] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBio = async () => {
      if (!userId) {
        setBio('自己紹介文がありません');
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setBio(docSnap.data().bio || '自己紹介文がありません');
        } else {
          setBio('自己紹介文がありません');
        }
      } catch (error) {
        console.error('Bioの取得に失敗しました:', error);
        setBio('自己紹介文がありません');
      } finally {
        setLoading(false);
      }
    };

    if (open) fetchBio();
  }, [userId, open]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Box sx={{ bgcolor: 'background.paper', p: 4, borderRadius: 2, textAlign: 'center' }}>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <Typography variant="h6" gutterBottom>
              自己紹介
            </Typography>
            <Typography variant="body1">{bio}</Typography>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default UserBioModal;
