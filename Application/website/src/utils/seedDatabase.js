import { collection, doc, getDocs, deleteDoc } from 'firebase/firestore';

export const clearDatabase = async (db) => {
  try {
    // Clear societies and all subcollections
    const socSnapshot = await getDocs(collection(db, 'societies'));
    const subcollections = ['visitors', 'users', 'amenities', 'maintenance', 'documents', 'parking', 'complaints'];
    
    for (const socDoc of socSnapshot.docs) {
      const socId = socDoc.id;
      for (const sub of subcollections) {
        const snapshot = await getDocs(collection(db, `societies/${socId}/${sub}`));
        const deletePromises = snapshot.docs.map(document => deleteDoc(doc(db, `societies/${socId}/${sub}`, document.id)));
        await Promise.all(deletePromises);
      }
      await deleteDoc(doc(db, 'societies', socId));
    }

    // Clear root ad_campaigns collection
    const adSnapshot = await getDocs(collection(db, 'ad_campaigns'));
    await Promise.all(adSnapshot.docs.map(d => deleteDoc(doc(db, 'ad_campaigns', d.id))));
    
    return { success: true, message: 'All dummy society records wiped clean!' };
  } catch (error) {
    console.error("Error clearing database: ", error);
    return { success: false, message: error.message };
  }
};

export const seedDatabase = async (db) => {
  return { success: true, message: 'Automatic dummy creation disabled. Onboard your real society using "+ Onboard New Society"!' };
};
