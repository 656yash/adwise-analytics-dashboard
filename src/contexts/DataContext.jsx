import { createContext, useContext, useEffect, useState } from 'react';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

const DataContext = createContext();

export function useData() {
  return useContext(DataContext);
}

export function DataProvider({ children }) {
  const [events, setEvents] = useState([]);
  const [orders, setOrders] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30D'); // 'TODAY', '7D', '30D', '90D', 'ALL'

  useEffect(() => {
    // Determine start date based on filter
    const now = new Date();
    let startDate = new Date(0); // default ALL
    
    if (dateRange === 'TODAY') {
      startDate = new Date(now.setHours(0,0,0,0));
    } else if (dateRange === '7D') {
      startDate = new Date(now.setDate(now.getDate() - 7));
    } else if (dateRange === '30D') {
      startDate = new Date(now.setDate(now.getDate() - 30));
    } else if (dateRange === '90D') {
      startDate = new Date(now.setDate(now.getDate() - 90));
    }

    // Subscribe to Collections
    const unsubs = [];

    // Orders
    const ordersQuery = query(collection(db, 'orders'));
    unsubs.push(onSnapshot(ordersQuery, (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }));

    // Events
    const eventsQuery = query(collection(db, 'analytics_events'));
    unsubs.push(onSnapshot(eventsQuery, (snapshot) => {
      setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }));

    // Campaigns
    const campaignsQuery = query(collection(db, 'ad_campaigns'));
    unsubs.push(onSnapshot(campaignsQuery, (snapshot) => {
      setCampaigns(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }));

    // Users
    const usersQuery = query(collection(db, 'users'));
    unsubs.push(onSnapshot(usersQuery, (snapshot) => {
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false); // Set loading false after users load
    }));

    return () => unsubs.forEach(unsub => unsub());
  }, [dateRange]);

  const value = {
    events,
    orders,
    campaigns,
    users,
    loading,
    dateRange,
    setDateRange
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}
