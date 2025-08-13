// contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { auth, db } from "@/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";

WebBrowser.maybeCompleteAuthSession();

export interface UserProfile {
  uid: string;
  email: string;
  username?: string;
  createdAt?: string;
}

type AuthContextType = {
  user: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signInWithGoogle: () => void;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
  signInWithGoogle: () => {},
  setUser: () => {}, // dummy
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Google OAuth setup
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: "872883456440-is2nn752e9m0kj12j7gfs722sau8abbk.apps.googleusercontent.com",
    androidClientId: "872883456440-d567vqcj17msokbcb4nkq4o93posep43.apps.googleusercontent.com",
    // expoClientId: "872883456440-is2nn752e9m0kj12j7gfs722sau8abbk.apps.googleusercontent.com",
  });

  // Handle Google sign-in result
  useEffect(() => {
    const signInWithGoogleFirebase = async (idToken: string) => {
      const credential = GoogleAuthProvider.credential(idToken);
      const result = await signInWithCredential(auth, credential);

      // Check if user profile exists in Firestore
      const userRef = doc(db, "users", result.user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: result.user.uid,
          email: result.user.email,
          username: result.user.displayName || "",
          createdAt: new Date().toISOString(),
        });
      }
    };

    if (response?.type === "success" && response.authentication?.idToken) {
      signInWithGoogleFirebase(response.authentication.idToken).catch(console.error);
    }
  }, [response]);

  // Watch Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        if (userDoc.exists()) {
          setUser(userDoc.data() as UserProfile);
        } else {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || "",
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signOut = async () => {
    await firebaseSignOut(auth);
    setUser(null);
  };

  const signInWithGoogle = () => promptAsync();

  return (
    <AuthContext.Provider value={{ user, loading, signOut, signInWithGoogle, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
