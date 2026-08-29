import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../firebase';

export const pollService = {
  // ── 1. REALTIME STREAM ────────────────────────────────────────────────────
  subscribePolls(societyId, callback, onError) {
    if (!societyId) return () => {};
    const q = query(
      collection(db, `societies/${societyId}/polls`),
      orderBy('createdAt', 'desc')
    );
    return onSnapshot(
      q,
      (snapshot) => {
        const polls = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        callback(polls);
      },
      onError
    );
  },

  // ── 2. CREATE POLL & DISPATCH BROADCAST ───────────────────────────────────
  async createPoll(societyId, pollData, adminUid = '') {
    if (!societyId) throw new Error('Society ID is required');
    if (!pollData.title || !pollData.options || pollData.options.length < 2) {
      throw new Error('Poll title and at least 2 options are required');
    }

    const docRef = doc(collection(db, `societies/${societyId}/polls`));
    const nowIso = new Date().toISOString();

    const formattedOptions = pollData.options.map((opt, idx) => ({
      id: `opt_${idx + 1}`,
      text: typeof opt === 'string' ? opt.trim() : opt.text.trim(),
      voteCount: 0,
    }));

    const payload = {
      id: docRef.id,
      title: pollData.title.trim(),
      description: (pollData.description || '').trim(),
      category: pollData.category || 'General Poll',
      allowedRoles: pollData.allowedRoles || ['owner', 'tenant', 'resident'],
      votingRule: pollData.votingRule || 'one_per_flat',
      status: 'active',
      expiresAt: pollData.expiresAt || null,
      createdAt: nowIso,
      createdBy: adminUid,
      totalVotes: 0,
      options: formattedOptions,
      serverCreatedAt: serverTimestamp(),
    };

    await setDoc(docRef, payload);

    // Dispatch Push Notification Broadcast
    import('../fcmBroadcastService')
      .then(({ broadcastToSociety }) => {
        const isOwnerOnly =
          payload.allowedRoles.length === 1 && payload.allowedRoles[0] === 'owner';
        broadcastToSociety(societyId, {
          title: `🗳️ New Poll: ${payload.title}`,
          body: isOwnerOnly
            ? 'AGM Resolution: Voting restricted to Flat Owners. Cast your vote in GateLink.'
            : 'New community voting poll is live. Cast your vote in GateLink.',
          category: 'poll',
          data: {
            pollId: docRef.id,
            type: 'poll',
          },
        }).catch((err) => console.warn('FCM Poll broadcast warning:', err));
      })
      .catch((err) => console.warn('FCM module load warning:', err));

    return docRef.id;
  },

  // ── 3. CLOSE POLL EARLY ───────────────────────────────────────────────────
  async closePoll(societyId, pollId) {
    if (!societyId || !pollId) throw new Error('Society ID and Poll ID are required');
    await updateDoc(doc(db, `societies/${societyId}/polls`, pollId), {
      status: 'closed',
      updatedAt: serverTimestamp(),
    });
  },

  // ── 4. DELETE POLL ────────────────────────────────────────────────────────
  async deletePoll(societyId, pollId) {
    if (!societyId || !pollId) throw new Error('Society ID and Poll ID are required');
    await deleteDoc(doc(db, `societies/${societyId}/polls`, pollId));
  },

  // ── 5. GET VOTES AUDIT LIST ───────────────────────────────────────────────
  async getPollVotes(societyId, pollId) {
    if (!societyId || !pollId) throw new Error('Society ID and Poll ID are required');
    const snapshot = await getDocs(collection(db, `societies/${societyId}/polls/${pollId}/votes`));
    return snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
  },
};
