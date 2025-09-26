import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import { openDB } from 'idb';
import candidateReducer from './candidateSlice';
import interviewReducer from './interviewSlice';

// IndexedDB storage adapter
const createIndexedDBStorage = () => {
  let dbPromise: Promise<any>;

  const getDB = () => {
    if (!dbPromise) {
      dbPromise = openDB('InterviewAppDB', 1, {
        upgrade(db) {
          db.createObjectStore('redux-persist');
        },
      });
    }
    return dbPromise;
  };

  return {
    getItem: async (key: string) => {
      const db = await getDB();
      const result = await db.get('redux-persist', key);
      return result || null;
    },
    setItem: async (key: string, value: string) => {
      const db = await getDB();
      await db.put('redux-persist', value, key);
    },
    removeItem: async (key: string) => {
      const db = await getDB();
      await db.delete('redux-persist', key);
    },
  };
};

const rootReducer = combineReducers({
  candidate: candidateReducer,
  interview: interviewReducer,
});

const persistConfig = {
  key: 'root',
  storage: createIndexedDBStorage(),
  whitelist: ['candidate', 'interview'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;