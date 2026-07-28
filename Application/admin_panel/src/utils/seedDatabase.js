import { collection, doc, getDocs, deleteDoc, writeBatch } from 'firebase/firestore';

export const clearDatabase = async (db) => {
  try {
    // Clear subcollections of SOC-001 and SOC-002
    const societiesList = ['SOC-001', 'SOC-002'];
    const subcollections = ['visitors', 'users', 'amenities', 'maintenance', 'documents', 'parking', 'complaints'];
    
    for (const socId of societiesList) {
      for (const sub of subcollections) {
        const snapshot = await getDocs(collection(db, `societies/${socId}/${sub}`));
        const deletePromises = snapshot.docs.map(document => deleteDoc(doc(db, `societies/${socId}/${sub}`, document.id)));
        await Promise.all(deletePromises);
      }
    }

    // Clear root societies collection
    const socSnapshot = await getDocs(collection(db, 'societies'));
    await Promise.all(socSnapshot.docs.map(d => deleteDoc(doc(db, 'societies', d.id))));

    // Clear root ad_campaigns collection
    const adSnapshot = await getDocs(collection(db, 'ad_campaigns'));
    await Promise.all(adSnapshot.docs.map(d => deleteDoc(doc(db, 'ad_campaigns', d.id))));
    
    return { success: true, message: 'All database records wiped clean!' };
  } catch (error) {
    console.error("Error clearing database: ", error);
    return { success: false, message: error.message };
  }
};

export const seedDatabase = async (db) => {
  try {
    const batch = writeBatch(db);

    // 1. Seed Default Society (SOC-001)
    const societies = [
      { id: 'SOC-001', name: 'Greenwood Apartments', city: 'Mumbai', code: 'GW-8492', status: 'Active', mrr: 12000, flats: 220, president: 'Rajesh Malhotra', phone: '+91 98201 12345' },
    ];

    societies.forEach(soc => {
      const socRef = doc(db, 'societies', soc.id);
      batch.set(socRef, soc);
    });

    await batch.commit();
    return { success: true, message: 'Default society initialized!' };
  } catch (error) {
    console.error("Error initializing database: ", error);
    return { success: false, message: error.message };
  }
};
